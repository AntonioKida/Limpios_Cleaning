import { track as vercelTrack } from "@vercel/analytics";

/**
 * One call site for custom analytics events. Fans out to whatever is wired up —
 * Vercel Analytics (always on), GA4 (`gtag`, if NEXT_PUBLIC_GA_ID), and Microsoft
 * Clarity (if NEXT_PUBLIC_CLARITY_ID). Each sink is best-effort and guarded, so a
 * missing/blocked provider never throws into the UI.
 */
export type AnalyticsProps = Record<string, string | number | boolean>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    clarity?: (...args: unknown[]) => void;
  }
}

export function track(event: string, props: AnalyticsProps = {}): void {
  try {
    vercelTrack(event, props);
  } catch {
    // no-op: Vercel Analytics not active (e.g. local dev)
  }

  if (typeof window === "undefined") return;

  try {
    window.gtag?.("event", event, props);
  } catch {
    // no-op
  }

  try {
    // Clarity custom event + searchable tags for the props.
    window.clarity?.("event", event);
    for (const [key, value] of Object.entries(props)) {
      window.clarity?.("set", key, String(value));
    }
  } catch {
    // no-op
  }
}
