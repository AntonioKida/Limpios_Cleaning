import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";

// Lead capture endpoint. Env-gated: with no RESEND_API_KEY (e.g. local dev) the
// lead is logged to the server console and a { ok, dev: true } response is
// returned so the UI still shows success. This route is excluded from the
// i18n middleware (see proxy.ts matcher) and runs on the Node.js runtime.

const leadSchema = z.object({
  service: z.string().min(1).max(60),
  propertyType: z.string().min(1).max(60),
  bedrooms: z.string().max(20).optional(),
  bathrooms: z.string().max(20).optional(),
  sqft: z.string().max(20).optional(),
  frequency: z.string().min(1).max(40),
  name: z.string().min(1).max(120),
  email: z.string().email().max(160),
  phone: z.string().min(5).max(40),
  address: z.string().max(300).optional(),
  message: z.string().max(2000).optional(),
  locale: z.string().max(5).optional(),
  // Honeypot — bots tend to fill every field. Accepted here, checked below.
  company: z.string().max(200).optional(),
});

type Lead = z.infer<typeof leadSchema>;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildEmail(lead: Lead) {
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

  const html = `<!doctype html><html><body style="font-family:Arial,Helvetica,sans-serif;color:#0a2359;background:#f4f9fb;padding:24px">
    <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #d8e3ee">
      <div style="background:#0a2359;color:#fff;padding:18px 24px;font-size:18px;font-weight:700">New quote request</div>
      <table style="width:100%;border-collapse:collapse">
        ${visible
          .map(
            ([label, value], i) =>
              `<tr style="background:${i % 2 ? "#f4f9fb" : "#ffffff"}">
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

  // Honeypot tripped: silently accept without sending (don't tip off bots).
  if (lead.company && lead.company.length > 0) {
    return NextResponse.json({ ok: true });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_NOTIFICATION_EMAIL ?? "info@limpioscleaning.com";

  // Dev / unconfigured: log to server console and report dev mode.
  if (!apiKey) {
    console.info(
      "[lead] No RESEND_API_KEY set — logging lead instead of emailing:",
      { ...lead, company: undefined },
    );
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
      return NextResponse.json({ ok: false, error: "send_failed" }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[lead] Unexpected error:", err);
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}
