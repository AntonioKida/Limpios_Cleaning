/**
 * Small structured lists for homepage sections (icon + id). Labels and copy are
 * translatable and live in the message catalogs (`Home.trustBar`, `Home.steps`).
 */
import type { IconName } from "./icons";

export interface TrustBadge {
  id: "veteran" | "insured" | "eco" | "rating";
  icon: IconName;
}

export const trustBadges: TrustBadge[] = [
  { id: "veteran", icon: "ShieldCheck" },
  { id: "insured", icon: "BadgeCheck" },
  { id: "eco", icon: "Leaf" },
  { id: "rating", icon: "Star" },
];

export interface Step {
  id: "quote" | "clean" | "relax";
  icon: IconName;
  /** 1-based step number shown in the UI. */
  n: number;
}

export const steps: Step[] = [
  { id: "quote", icon: "CalendarCheck", n: 1 },
  { id: "clean", icon: "SprayCan", n: 2 },
  { id: "relax", icon: "Smile", n: 3 },
];
