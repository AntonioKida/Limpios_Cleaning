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

  /** Mailing/registered address (UPS-style suite). Used verbatim in NAP. */
  address: {
    street: "1683 N Hancock Rd",
    suite: "Suite 103-272",
    city: "Minneola",
    region: "FL",
    regionName: "Florida",
    postalCode: "34715",
    country: "US",
  },

  /** Approx. coordinates for Minneola, FL. TODO: confirm exact geo if needed. */
  geo: { latitude: 28.5853, longitude: -81.7459 },

  social: {
    instagram: "https://www.instagram.com/limpioscleaning",
    instagramHandle: "@limpioscleaning",
    // TODO: replace with the real Facebook page URL.
    facebook: "https://www.facebook.com/limpioscleaning",
    facebookName: "Limpios Cleaning Management",
  },

  /**
   * Business hours in 24h local time; `null` = closed.
   * Day labels are localized in messages (Common.days). TODO: confirm real hours.
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

  /** TODO: replace with the real Florida license/registration number. */
  license: "LIC# 000000000",

  /**
   * Google rating. PLACEHOLDER values — gate AggregateRating JSON-LD on real
   * data before launch. TODO: replace with real Google Business Profile rating
   * + the public review URL.
   */
  rating: {
    value: 5.0,
    count: 27,
    isPlaceholder: true,
    reviewUrl: "https://g.page/r/limpios-cleaning/review", // TODO: real GBP link
  },

  /** TODO: confirm founding year (used in About / copyright baseline). */
  foundedYear: 2021,
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
