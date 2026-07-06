/**
 * Small structured lists for homepage sections (icon + id). Labels and copy are
 * translatable and live in the message catalogs (`Home.stats`, `Home.steps`,
 * `Home.why.points`, `Home.audiences`). Each list carries DISTINCT proof so the
 * homepage's trust touchpoints don't restate each other:
 *   - hero star line  -> veteran-owned, licensed & insured
 *   - trust stats      -> since/chamber/bilingual/local (credentials)
 *   - audiences        -> who we work with (B2B buyer segments)
 *   - why points       -> service differentiators (team, scope, estimate, guarantee)
 */
import type { IconName } from "./icons";

export interface TrustStat {
  id: "since" | "chamber" | "bilingual" | "local";
  icon: IconName;
}

export const trustStats: TrustStat[] = [
  { id: "since", icon: "Clock" },
  { id: "chamber", icon: "Landmark" },
  { id: "bilingual", icon: "Languages" },
  { id: "local", icon: "MapPin" },
];

/** Buyer segments from the owner brief — the audiences the site must serve. */
export interface Audience {
  id: "commercial" | "property-managers" | "hoa" | "construction";
  icon: IconName;
  /** Service page this audience most likely needs first. */
  serviceSlug: "commercial" | "move-in-out" | "post-construction";
}

export const audiences: Audience[] = [
  { id: "commercial", icon: "Building2", serviceSlug: "commercial" },
  { id: "property-managers", icon: "Handshake", serviceSlug: "move-in-out" },
  { id: "hoa", icon: "Building", serviceSlug: "commercial" },
  { id: "construction", icon: "HardHat", serviceSlug: "post-construction" },
];

export interface Step {
  id: "walkthrough" | "estimate" | "clean";
  icon: IconName;
  /** 1-based step number shown in the UI. */
  n: number;
}

/** The estimate model: walk the space → written estimate → we clean. */
export const steps: Step[] = [
  { id: "walkthrough", icon: "ClipboardList", n: 1 },
  { id: "estimate", icon: "FileText", n: 2 },
  { id: "clean", icon: "SprayCan", n: 3 },
];

export interface WhyPoint {
  id: "team" | "checklist" | "estimate" | "guarantee";
  icon: IconName;
}

export const whyPoints: WhyPoint[] = [
  { id: "team", icon: "Users" },
  { id: "checklist", icon: "ListChecks" },
  { id: "estimate", icon: "Zap" },
  { id: "guarantee", icon: "BadgeCheck" },
];
