/**
 * FAQ item order. Questions & answers (translatable) live in the message
 * catalogs under `Faq.items.<id>.{q,a}`. This ordered list drives both the
 * accordion UI and the FAQPage JSON-LD. Add an id here + a catalog entry.
 */
export const faqIds = [
  "pricing",
  "eco",
  "supplies",
  "pets",
  "satisfaction",
  "bilingual",
  "insured",
  "booking",
] as const;

export type FaqId = (typeof faqIds)[number];
