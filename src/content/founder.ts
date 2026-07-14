/**
 * Founder / About structure. Bio paragraphs, mission and value descriptions are
 * translatable (message catalogs under `About.*`). This file holds non-prose
 * structure: placeholder meta + the eco/value cards' icons & ids.
 */

export const founder = {
  /** The owner goes by Papo. The About copy already says "Hi, I'm Papo". */
  name: "Papo",
  photo: "/placeholders/founder.svg", // TODO: real founder photo
  /** Optional 30–60s founder video. TODO: add real video URL (YouTube/Vimeo/mp4). */
  videoUrl: null as string | null,
  // No `yearsExperience`: it used to say 10, which was invented and contradicted
  // the 28 years of military experience the site actually claims. Nothing rendered
  // it, but a fabricated number sitting in the content layer is a trap, not data.
} as const;

import type { IconName } from "./icons";

export interface ValueCard {
  id: "veteran" | "eco" | "guarantee" | "bilingual";
  icon: IconName;
}

/** "Why Limpios" value props — text lives in messages under `About.values` / `Home.why`. */
export const valueCards: ValueCard[] = [
  { id: "veteran", icon: "ShieldCheck" },
  { id: "eco", icon: "Leaf" },
  { id: "guarantee", icon: "BadgeCheck" },
  { id: "bilingual", icon: "Languages" },
];
