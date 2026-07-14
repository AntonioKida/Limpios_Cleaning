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

// Display labels for the internal notification (English — the lead stores slugs).
// Unmapped ids fall back to a humanized slug, so the email keeps working if the
// content enums grow (it just won't be as polished until the label is added here).
const AUDIENCE_LABELS: Record<string, string> = {
  business: "Business",
  "property-manager": "Property manager",
};
const SERVICE_LABELS: Record<string, string> = {
  commercial: "Commercial cleaning",
  "post-construction": "Post-construction",
  "move-in-out": "Move-in / move-out",
  "window-cleaning": "Window cleaning",
  "carpet-cleaning": "Carpet cleaning",
  "deep-cleaning": "Deep cleaning",
  "interior-painting": "Interior painting",
};
const SPACE_LABELS: Record<string, string> = {
  office: "Office",
  retail: "Retail",
  medical: "Medical",
  construction: "Construction site",
  other: "Other",
};
const FREQUENCY_LABELS: Record<string, string> = {
  daily: "Daily",
  weekly: "Weekly",
  monthly: "Monthly",
  onetime: "One-time",
  biweekly: "Every 2 weeks",
  custom: "Custom schedule",
  turnover: "Turnover / as-needed",
};
const FLOORING_LABELS: Record<string, string> = {
  carpet: "Carpet",
  lvt: "LVT",
  lvp: "LVP",
  marble: "Marble",
};
const CARPET_LABELS: Record<string, string> = {
  none: "None",
  steam: "Steam",
  "steam-deodorizer": "Steam + deodorizer",
};
const PREFERRED_LABELS: Record<string, string> = {
  phone: "Phone call",
  email: "Email",
  text: "Text message",
};

function humanize(value: string): string {
  return value.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
function labelFor(map: Record<string, string>, value?: string): string | undefined {
  if (!value) return undefined;
  return map[value] ?? humanize(value);
}

/**
 * The internal "new lead" notification to the Limpios team. Optimized to be
 * scanned + acted on: the audience + prospect are up top, one-tap Call / Email
 * buttons, then the job details (fields depend on the business vs property-manager
 * branch), then the message. Email-client-safe (table layout, inline styles only,
 * system fonts, no external assets); Resend sets `replyTo` to the lead's address.
 */
function buildEmail(lead: LeadInput) {
  const e = escapeHtml;
  const isBiz = lead.audience === "business";
  const audienceLabel = labelFor(AUDIENCE_LABELS, lead.audience);
  const firstName = lead.name?.trim().split(/\s+/)[0] || lead.name;
  const language = lead.locale === "es" ? "Spanish" : "English";
  const telHref = lead.phone ? lead.phone.replace(/[^\d+]/g, "") : "";
  const yes = "Yes";
  const services =
    Array.isArray(lead.services) && lead.services.length > 0
      ? lead.services.map((s) => labelFor(SERVICE_LABELS, s)).join(", ")
      : undefined;

  // Raw [label, value] rows for the active branch — reused for HTML + plain text.
  const jobRows: [string, string | undefined][] = isBiz
    ? [
        ["Space type", labelFor(SPACE_LABELS, lead.spaceType)],
        ["Services needed", services],
        ["Frequency", labelFor(FREQUENCY_LABELS, lead.frequency)],
        ["Restrooms", lead.restrooms],
        ["Offices", lead.offices],
        ["Conference rooms", lead.conferenceRooms],
        ["Windows", lead.windows],
        ["Flooring", labelFor(FLOORING_LABELS, lead.flooring)],
        ["Last professional cleaning", lead.lastCleaning],
        ["First-time deep clean", lead.firstTimeDeepClean ? yes : undefined],
        ["Window blinds", lead.blindsType],
        ["Special surfaces", lead.specialSurfaces],
      ]
    : [
        ["Bedrooms", lead.bedrooms],
        ["Bathrooms", lead.bathrooms],
        ["Square footage", lead.sqft],
        ["Carpet cleaning", labelFor(CARPET_LABELS, lead.carpetCleaning)],
        ["Appliances", lead.appliances ? yes : undefined],
        ["Window blinds", lead.blinds ? yes : undefined],
        ["LVT steam clean", lead.lvtSteam ? yes : undefined],
        ["LVT steam + grout sealant", lead.lvtSteamGrout ? yes : undefined],
      ];
  jobRows.push(["Preferred contact", labelFor(PREFERRED_LABELS, lead.preferredContact)]);

  // HTML rows (escaped) + the clickable contact rows.
  const htmlRows: [string, string | undefined][] = [
    ...jobRows.map(([label, value]) => [label, value ? e(value) : undefined] as [string, string | undefined]),
    [
      "Email",
      lead.email &&
        `<a href="mailto:${e(lead.email)}" style="color:#1b5a9d;text-decoration:none;font-weight:600;">${e(lead.email)}</a>`,
    ],
    [
      "Phone",
      lead.phone &&
        `<a href="tel:${e(telHref)}" style="color:#1b5a9d;text-decoration:none;font-weight:600;">${e(lead.phone)}</a>`,
    ],
  ];
  const rows = htmlRows.filter(([, v]) => Boolean(v));
  const rowsHtml = rows
    .map(([label, value], i) => {
      const sep = i === rows.length - 1 ? "" : "border-bottom:1px solid #f0ede8;";
      return `<tr>
        <td style="padding:12px 0;${sep}font-size:13px;color:#50607a;width:42%;vertical-align:top;">${e(label)}</td>
        <td style="padding:12px 0;${sep}font-size:14px;color:#0a2359;font-weight:600;vertical-align:top;">${value}</td>
      </tr>`;
    })
    .join("");

  const audiencePill = audienceLabel
    ? `<span style="display:inline-block;background:#e8f1fa;color:#1b5a9d;font-size:11px;font-weight:700;letter-spacing:.5px;text-transform:uppercase;padding:5px 12px;border-radius:999px;">${e(audienceLabel)}</span>`
    : "";
  const companyLine = lead.company
    ? `<div style="font-size:14px;color:#50607a;margin-top:4px;">${e(lead.company)}</div>`
    : "";
  const callBtn = lead.phone
    ? `<td style="padding-right:10px;"><a href="tel:${e(telHref)}" style="display:inline-block;background:#f47b20;color:#0a2359;font-size:14px;font-weight:700;text-decoration:none;padding:11px 20px;border-radius:10px;">Call ${e(lead.phone)}</a></td>`
    : "";
  const emailBtn = lead.email
    ? `<td><a href="mailto:${e(lead.email)}" style="display:inline-block;background:#0a2359;color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;padding:11px 20px;border-radius:10px;">Email ${e(firstName)}</a></td>`
    : "";
  const buttons =
    callBtn || emailBtn
      ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:20px;"><tr>${callBtn}${emailBtn}</tr></table>`
      : "";
  const messageBlock = lead.message
    ? `<tr><td style="padding:6px 32px 12px;">
        <div style="font-size:13px;color:#50607a;margin-bottom:7px;">Message</div>
        <div style="background:#f7f6f3;border-left:3px solid #1b5a9d;border-radius:0 8px 8px 0;padding:14px 16px;font-size:14px;color:#0a2359;line-height:1.55;white-space:pre-wrap;">${e(lead.message)}</div>
      </td></tr>`
    : "";

  const preheader = `New estimate request from ${lead.name}${audienceLabel ? ` · ${audienceLabel}` : ""}`;

  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light only"><title>New estimate request</title></head>
<body style="margin:0;padding:0;background:#f7f6f3;-webkit-font-smoothing:antialiased;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:#f7f6f3;">${e(preheader)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f7f6f3;">
    <tr><td align="center" style="padding:28px 14px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:600px;background:#ffffff;border:1px solid #e7e1d8;border-radius:16px;overflow:hidden;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
        <tr><td style="background:#0a2359;padding:26px 32px;">
          <div style="font-size:12px;letter-spacing:2px;font-weight:700;color:#7f9cc4;text-transform:uppercase;">Limpios Cleaning</div>
          <div style="font-size:21px;font-weight:700;color:#ffffff;margin-top:7px;">New estimate request</div>
          <div style="font-size:13px;color:#9db4d4;margin-top:3px;">via limpioscleaning.com</div>
        </td></tr>
        <tr><td style="padding:28px 32px 4px;">
          ${audiencePill}
          <div style="font-size:22px;font-weight:700;color:#0a2359;margin-top:${audienceLabel ? "14px" : "0"};line-height:1.25;">${e(lead.name)}</div>
          ${companyLine}
          ${buttons}
        </td></tr>
        <tr><td style="padding:22px 32px 6px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rowsHtml}</table>
        </td></tr>
        ${messageBlock}
        <tr><td style="background:#f7f6f3;padding:18px 32px;border-top:1px solid #ece9e3;">
          <div style="font-size:13px;color:#50607a;line-height:1.5;">Reply to this email to reach ${e(firstName)} directly · Submitted in ${language}</div>
        </td></tr>
      </table>
      <div style="font-size:12px;color:#9aa2af;margin-top:14px;font-family:-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">Limpios Cleaning Management · Veteran Owned Business · Central Florida</div>
    </td></tr>
  </table>
</body></html>`;

  const text = [
    "NEW ESTIMATE REQUEST",
    "",
    `${lead.name}${lead.company ? ` · ${lead.company}` : ""}`,
    audienceLabel ? `Audience: ${audienceLabel}` : "",
    "",
    ...jobRows.filter(([, v]) => Boolean(v)).map(([l, v]) => `${l}: ${v}`),
    lead.email ? `Email: ${lead.email}` : "",
    lead.phone ? `Phone: ${lead.phone}` : "",
    lead.message ? `\nMessage:\n${lead.message}` : "",
    "",
    `Reply to this email to reach ${firstName}. Submitted in ${language}.`,
  ]
    .filter((line) => line !== "")
    .join("\n");

  const subject = `New estimate request · ${audienceLabel ?? "Lead"} · ${lead.name}${lead.company ? ` (${lead.company})` : ""}`;
  return { subject, html, text };
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
  const { website: _honeypot, ...cleanLead } = lead;
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
    const { subject, html, text } = buildEmail(lead);

    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: lead.email,
      subject,
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
