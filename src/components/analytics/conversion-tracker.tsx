"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

/**
 * Site-wide conversion tracking via one delegated, capture-phase click listener —
 * so every `tel:` link (tap-to-call) and every quote CTA is tracked without
 * touching each call site. Quote CTAs opt in with `data-analytics="quote-cta"`
 * and an optional `data-location`.
 */
export function ConversionTracker() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const tel = target.closest<HTMLAnchorElement>('a[href^="tel:"]');
      if (tel) {
        track("tap_to_call", { href: tel.getAttribute("href") ?? "" });
        return;
      }

      const quote = target.closest<HTMLElement>('[data-analytics="quote-cta"]');
      if (quote) {
        track("quote_cta_click", {
          location: quote.dataset.location ?? "unknown",
        });
      }
    };

    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}
