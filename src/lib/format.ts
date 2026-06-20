import type { Locale } from "@/i18n/routing";

/** Format a "HH:MM" 24h string into a locale-aware time (e.g. "8:00 AM"). */
export function formatTime(hhmm: string, locale: Locale): string {
  const [h, m] = hhmm.split(":").map(Number);
  // Fixed reference date — only the time matters.
  const d = new Date(Date.UTC(2024, 0, 1, h, m));
  return new Intl.DateTimeFormat(locale, {
    hour: "numeric",
    minute: m === 0 ? undefined : "2-digit",
    timeZone: "UTC",
  }).format(d);
}

/** Format a US phone number for screen-reader-friendly digit grouping. */
export function spokenPhone(display: string): string {
  return display.replace(/\D/g, "").split("").join(" ");
}

/** Whole-dollar USD currency, locale-aware (e.g. "$120"). */
export function formatCurrency(amount: number, locale: Locale): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}
