import { type NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { leadSchema, isHoneypotTripped, type LeadInput } from "@/lib/lead-schema";
import { persistLead, markEmailStatus } from "@/lib/lead-store";
import { checkRateLimit } from "@/lib/rate-limit";

// Lead capture. Resilience model:
//  1. Per-IP rate limit (Upstash sliding window, or in-memory fallback).
//  2. Validate (server-side zod) + drop honeypot.
//  3. PERSIST the lead durably BEFORE/independently of email, so a Resend
//     outage never loses a lead (failed sends are queued for retry).
//  4. Email is decoupled: if it fails but the lead was persisted, the user
//     still gets success (the lead is safe).
// Excluded from the i18n middleware (proxy.ts matcher); Node.js runtime.

function getClientIp(req: NextRequest): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildEmail(lead: LeadInput) {
  const rows: [string, string | undefined][] = [
    ["Service", lead.service],
    ["Property type", lead.propertyType],
    ["Bedrooms", lead.bedrooms],
    ["Bathrooms", lead.bathrooms],
    ["Square footage", lead.sqft],
    ["Frequency", lead.frequency],
    ["Name", lead.name],
    ["Email", lead.email],
    ["Phone", lead.phone],
    ["Address / city", lead.address],
    ["Message", lead.message],
    ["Submitted in", lead.locale === "es" ? "Spanish" : "English"],
  ];
  const visible = rows.filter(([, v]) => v && v.trim().length > 0);

  const html = `<!doctype html><html><body style="font-family:Arial,Helvetica,sans-serif;color:#0a2359;background:#f7f6f3;padding:24px">
    <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #d8e3ee">
      <div style="background:#0a2359;color:#fff;padding:18px 24px;font-size:18px;font-weight:700">New quote request</div>
      <table style="width:100%;border-collapse:collapse">
        ${visible
          .map(
            ([label, value], i) =>
              `<tr style="background:${i % 2 ? "#f7f6f3" : "#ffffff"}">
                 <td style="padding:10px 24px;font-weight:600;width:38%;vertical-align:top">${escapeHtml(label)}</td>
                 <td style="padding:10px 24px;vertical-align:top">${escapeHtml(value ?? "")}</td>
               </tr>`,
          )
          .join("")}
      </table>
    </div>
  </body></html>`;

  const text = visible.map(([l, v]) => `${l}: ${v}`).join("\n");
  return { html, text };
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);

  // 1. Rate limit
  const { success } = await checkRateLimit(ip);
  if (!success) {
    return NextResponse.json(
      { ok: false, error: "rate_limited" },
      { status: 429 },
    );
  }

  // 2. Parse + validate
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }
  const parsed = leadSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "validation" }, { status: 400 });
  }
  const lead = parsed.data;

  // Honeypot tripped: silently accept without storing/sending.
  if (isHoneypotTripped(lead)) {
    return NextResponse.json({ ok: true });
  }

  // 3. Persist durably BEFORE attempting email.
  const { company: _honeypot, ...cleanLead } = lead;
  void _honeypot;
  const { id, persisted } = await persistLead({ ...cleanLead, ip });

  // 4. Email (decoupled from durability).
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_NOTIFICATION_EMAIL ?? "info@limpioscleaning.com";

  if (!apiKey) {
    await markEmailStatus(id, "skipped");
    return NextResponse.json({ ok: true, dev: true });
  }

  try {
    const resend = new Resend(apiKey);
    // TODO: set LEAD_FROM_EMAIL to a verified-domain sender in production.
    const from =
      process.env.LEAD_FROM_EMAIL ?? "Limpios Cleaning <onboarding@resend.dev>";
    const { html, text } = buildEmail(lead);

    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: lead.email,
      subject: `New quote request — ${lead.name}`,
      html,
      text,
    });

    if (error) {
      console.error("[lead] Resend error:", error);
      await markEmailStatus(id, "failed");
      // The lead is safe if it was persisted — don't fail the user.
      return persisted
        ? NextResponse.json({ ok: true, emailQueued: true })
        : NextResponse.json({ ok: false, error: "send_failed" }, { status: 502 });
    }

    await markEmailStatus(id, "sent");
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[lead] Unexpected error:", err);
    await markEmailStatus(id, "failed");
    return persisted
      ? NextResponse.json({ ok: true, emailQueued: true })
      : NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}
