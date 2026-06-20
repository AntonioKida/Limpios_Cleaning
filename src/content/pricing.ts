/**
 * Pricing packages + the "factors that affect price" list. All amounts are
 * PLACEHOLDER market estimates — favor transparency but mark as estimates.
 * TODO: replace with the pricing the client is willing to publish.
 * Names/descriptions/feature lists are translatable (messages `Pricing.*`).
 */
import type { IconName } from "./icons";
import type { ServiceSlug } from "./services";

export type PricePackageId = "standard" | "deep" | "recurring" | "commercial";

export interface PricePackage {
  id: PricePackageId;
  icon: IconName;
  model: "from" | "custom";
  amount?: number;
  /** Billing unit, when applicable (e.g. per visit). */
  unit?: "visit" | "service";
  popular?: boolean;
  /** Service this package maps to (prefills the quote form / links to service). */
  serviceSlug: ServiceSlug;
}

export const pricePackages: PricePackage[] = [
  {
    id: "standard",
    icon: "House",
    model: "from",
    amount: 120,
    unit: "service",
    serviceSlug: "residential",
  },
  {
    id: "deep",
    icon: "Sparkles",
    model: "from",
    amount: 200,
    unit: "service",
    popular: true,
    serviceSlug: "deep-cleaning",
  },
  {
    id: "recurring",
    icon: "CalendarCheck",
    model: "from",
    amount: 99,
    unit: "visit",
    serviceSlug: "residential",
  },
  {
    id: "commercial",
    icon: "Building2",
    model: "custom",
    serviceSlug: "commercial",
  },
];

export const priceFactorIds = [
  "size",
  "condition",
  "frequency",
  "addons",
  "access",
] as const;

export type PriceFactorId = (typeof priceFactorIds)[number];
