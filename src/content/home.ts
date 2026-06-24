/**
 * Small structured lists for homepage sections (icon + id). Labels and copy are
 * translatable and live in the message catalogs (`Home.stats`, `Home.steps`,
 * `Home.why.points`). Each list carries DISTINCT proof so the homepage's three
 * trust touchpoints don't restate each other:
 *   - hero star line  -> veteran-owned, licensed & insured
 *   - trust stats      -> since/eco/bilingual/local (credentials)
 *   - why points       -> service differentiators (team, checklist, quote, guarantee)
 */
import type { IconName } from "./icons";

export interface TrustStat {
  id: "since" | "eco" | "bilingual" | "local";
  icon: IconName;
}

export const trustStats: TrustStat[] = [
  { id: "since", icon: "Clock" },
  { id: "eco", icon: "Leaf" },
  { id: "bilingual", icon: "Languages" },
  { id: "local", icon: "MapPin" },
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

export interface WhyPoint {
  id: "team" | "checklist" | "quote" | "guarantee";
  icon: IconName;
}

export const whyPoints: WhyPoint[] = [
  { id: "team", icon: "Users" },
  { id: "checklist", icon: "ListChecks" },
  { id: "quote", icon: "Zap" },
  { id: "guarantee", icon: "BadgeCheck" },
];
