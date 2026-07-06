/**
 * FAQ item order. Questions & answers (translatable) live in the message
 * catalogs under `Faq.items.<id>.{q,a}`. This ordered list drives both the
 * accordion UI and the FAQPage JSON-LD. Add an id here + a catalog entry.
 *
 * Repositioned 2026-07: `pricing` now explains the walkthrough + free
 * estimate model (no dollar figures); `walkthrough` and `area` are new;
 * `pets` (residential-only concern) was retired with its catalog copy —
 * restorable from git history if residential is re-promoted (G1).
 */
export const faqIds = [
  "pricing",
  "walkthrough",
  "area",
  "insured",
  "eco",
  "supplies",
  "satisfaction",
  "homes",
  "bilingual",
  "booking",
] as const;

export type FaqId = (typeof faqIds)[number];
