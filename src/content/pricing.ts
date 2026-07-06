/**
 * Pricing STRUCTURE for the estimate model. Since the 2026-07 repositioning
 * there are NO published amounts anywhere: every engagement is priced from a
 * free walkthrough + written estimate (owner brief — price depends on square
 * footage, scope, manpower, and the condition of the space).
 * TODO: if the owner ever decides to publish starting prices again, amounts
 * are owner-provided and the `from` model below re-activates them.
 * Names/descriptions/feature lists are translatable (messages `Pricing.*`).
 */
import type { IconName } from "./icons";
import type { ServiceSlug } from "./services";

export type PricePackageId =
  | "commercial"
  | "post-construction"
  | "move-in-out"
  | "specialty";

export interface PricePackage {
  id: PricePackageId;
  icon: IconName;
  /** "custom" → walkthrough + written estimate (the only model in use). */
  model: "from" | "custom";
  amount?: number;
  /** Billing unit, when applicable (e.g. per visit). */
  unit?: "visit" | "service";
  popular?: boolean;
  /** Service this package maps to (prefills the quote form / links to service). */
  serviceSlug: ServiceSlug;
}

/**
 * Engagement types, not price tiers: how businesses actually buy cleaning.
 * All quote-based — the card CTA routes to the estimate form prefilled.
 */
export const pricePackages: PricePackage[] = [
  {
    id: "commercial",
    icon: "Building2",
    model: "custom",
    popular: true,
    serviceSlug: "commercial",
  },
  {
    id: "post-construction",
    icon: "HardHat",
    model: "custom",
    serviceSlug: "post-construction",
  },
  {
    id: "move-in-out",
    icon: "KeyRound",
    model: "custom",
    serviceSlug: "move-in-out",
  },
  {
    id: "specialty",
    icon: "Grid2x2",
    model: "custom",
    serviceSlug: "window-cleaning",
  },
];

/**
 * What shapes an estimate — mirrors the owner's own list: square footage,
 * scope, condition, manpower, frequency.
 */
export const priceFactorIds = [
  "size",
  "scope",
  "condition",
  "crew",
  "frequency",
] as const;

export type PriceFactorId = (typeof priceFactorIds)[number];
