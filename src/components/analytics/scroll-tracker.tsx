"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

/**
 * Fires scroll-depth milestones (25/50/75/100%) and per-section in-view events so
 * page length and drop-off can be judged from real data post-launch instead of by
 * guesswork. Each milestone/section fires at most once. Passive listeners +
 * IntersectionObserver; self-detaches once all milestones are reached.
 */
export function ScrollTracker({ page = "home" }: { page?: string }) {
  useEffect(() => {
    const milestones = [25, 50, 75, 100];
    const firedDepth = new Set<number>();

    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const pct = max <= 0 ? 100 : ((window.scrollY / max) * 100);
      for (const m of milestones) {
        if (pct >= m && !firedDepth.has(m)) {
          firedDepth.add(m);
          track("scroll_depth", { page, depth: m });
        }
      }
      if (firedDepth.size === milestones.length) {
        window.removeEventListener("scroll", onScroll);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    const seen = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const id = (entry.target as HTMLElement).id;
          if (id && !seen.has(id)) {
            seen.add(id);
            track("section_view", { page, section: id });
          }
        }
      },
      { threshold: 0.4 },
    );

    const sections = document.querySelectorAll<HTMLElement>(
      "main section[id], main [data-section]",
    );
    sections.forEach((el) => observer.observe(el));

    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, [page]);

  return null;
}
