/**
 * Single source of truth for Limpios business facts (NAP — Name/Address/Phone).
 * Keep this STRICTLY consistent with the footer, contact page, and LocalBusiness
 * JSON-LD for local SEO. Translatable prose lives in the message catalogs, not
 * here — this file holds locale-neutral, structured data only.
 */

export const site = {
  name: "Limpios Cleaning Management",
  shortName: "Limpios",

  /** Canonical production URL (domain points to Vercel in a later phase). */
  url: "https://limpioscleaning.com",

  email: "info@limpioscleaning.com",

  /**
   * Google Voice line — CLICK-TO-CALL ONLY. Do not build SMS automation on it.
   */
  phone: {
    display: "(407) 680-2945",
    e164: "+14076802945",
    href: "tel:+14076802945",
  },

  /**
   * SERVICE-AREA business — NO published street address. The old suite was a UPS
   * mailbox; removed per owner (2026-07). Reachable by phone + email only; the
   * service area is all of Central Florida, based in Lake County. Do NOT
   * reintroduce a PostalAddress here or in the JSON-LD.
   */

  /** Approx. service-area center, Lake County FL (not a street address). */
  geo: { latitude: 28.5853, longitude: -81.7459 },

  social: {
    instagram: "https://www.instagram.com/limpioscleaning",
    instagramHandle: "@limpioscleaning",
    // Verified 2026-07-06 via web research (audit/fable/research/).
    facebook: "https://www.facebook.com/LimpiosCleaningManagement",
    facebookName: "Limpios Cleaning Management",
  },

  /**
   * South Lake Chamber of Commerce membership — verified 2026-07-06 in the
   * chamber's member directory (audit/fable/research/web-research-raw.md).
   * Rendered as a trust credential (footer/About) + JSON-LD `memberOf`.
   */
  chamber: {
    name: "South Lake Chamber of Commerce",
    url: "https://www.southlakechamber-fl.com/",
  },

  /**
   * Business hours in 24h local time; `null` = closed. Confirmed by the owner
   * (2026-07). These are the PHONE/OFFICE hours; the cleaning itself is done
   * evenings and weekends, because the cleaners hold day jobs with the county
   * schools. Day labels are localized in messages (Common.days).
   */
  hours: {
    mon: { open: "08:00", close: "18:00" },
    tue: { open: "08:00", close: "18:00" },
    wed: { open: "08:00", close: "18:00" },
    thu: { open: "08:00", close: "18:00" },
    fri: { open: "08:00", close: "18:00" },
    sat: { open: "09:00", close: "15:00" },
    sun: null,
  },

  /** City business license number — confirmed by owner (2026-07). */
  license: "License #L2600319",
  /** Real number on file → the footer license line is shown. */
  licenseIsPlaceholder: false,

  /**
   * "SBA-certified" is UNCONFIRMED and therefore NOT rendered.
   *
   * It names a real federal registration (SBA VetCert), which makes it the
   * highest-liability claim on the site: asserting it without an active
   * certification is materially worse than any other overstatement here. The
   * repo disagreed with itself about it — BUSINESS-PROFILE.md inferred it from
   * the owner's own public pages, while docs/fable-audit/ says do not assert it —
   * and the owner has not confirmed either way.
   *
   * So it is gated rather than deleted, because the capability should survive the
   * question. While this is false, every SBA surface renders the confirmed claim
   * instead: "Veteran Owned Business", plus the 28 years of military service.
   * Flip this to true once the owner produces the VetCert and all three surfaces
   * (hero slogan proof, trust bar, Trusted By proof stack) restore the SBA line
   * together. Fails closed: the safe string is the default, so forgetting the
   * flag ships the truth, not the claim.
   */
  sbaCertifiedConfirmed: false,

  /**
   * NO ratings/reviews data. The fake placeholder reviews were retired (2026-07)
   * in favour of the "Trusted By" section: anonymized client categories + the
   * trust stack we can actually prove. AggregateRating is never emitted.
   */

  /**
   * Judean Services LLC (the legal entity) filed 2023-09-18; the "Limpios
   * Cleaning Management" fictitious name followed 2023-10-14 (Florida
   * registries, verified 2026-07-06 — audit/fable/research/). The previous
   * placeholder (2021) contradicted the registry. TODO: owner confirms.
   */
  foundedYear: 2023,
} as const;

export type DayKey = keyof typeof site.hours;

export const dayOrder: DayKey[] = [
  "mon",
  "tue",
  "wed",
  "thu",
  "fri",
  "sat",
  "sun",
];
