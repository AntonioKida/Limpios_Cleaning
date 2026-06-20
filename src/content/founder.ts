/**
 * Founder / About structure. Bio paragraphs, mission and value descriptions are
 * translatable (message catalogs under `About.*`). This file holds non-prose
 * structure: placeholder meta + the eco/value cards' icons & ids.
 */

export const founder = {
  // TODO: replace with the real owner name + headshot.
  name: "TODO: Owner Name",
  photo: "/placeholders/founder.svg", // TODO: real founder photo
  /** Optional 30–60s founder video. TODO: add real video URL (YouTube/Vimeo/mp4). */
  videoUrl: null as string | null,
  yearsExperience: 10, // TODO: confirm
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
