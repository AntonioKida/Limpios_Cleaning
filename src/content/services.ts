/**
 * Service catalog STRUCTURE. Names, taglines, descriptions, "what's included"
 * checklists and "who it's for" copy live in the message catalogs under
 * `Services.items.<slug>` (so they are translatable in one place). This file
 * holds routing slugs, icons, pricing model and relationships only.
 */

export const serviceSlugs = [
  "residential",
  "commercial",
  "deep-cleaning",
  "move-in-out",
  "post-construction",
  "interior-painting",
] as const;

export type ServiceSlug = (typeof serviceSlugs)[number];

import type { IconName } from "./icons";

export interface Service {
  slug: ServiceSlug;
  icon: IconName;
  /** Show on the homepage services grid. */
  featured: boolean;
  related: ServiceSlug[];
  /**
   * Pricing model drives how the price is rendered:
   * - "from"   -> "from $<amount>" (a starting-price estimate)
   * - "custom" -> "Custom quote"
   * - "quote"  -> "Request a quote"
   * Amounts are PLACEHOLDER market estimates. TODO: confirm publishable pricing.
   */
  price: { model: "from" | "custom" | "quote"; amount?: number };
}

export const services: Service[] = [
  {
    slug: "residential",
    icon: "House",
    featured: true,
    related: ["deep-cleaning", "move-in-out"],
    price: { model: "from", amount: 120 }, // TODO: confirm
  },
  {
    slug: "commercial",
    icon: "Building2",
    featured: true,
    related: ["post-construction", "residential"],
    price: { model: "custom" },
  },
  {
    slug: "deep-cleaning",
    icon: "Sparkles",
    featured: true,
    related: ["residential", "move-in-out"],
    price: { model: "from", amount: 200 }, // TODO: confirm
  },
  {
    slug: "move-in-out",
    icon: "KeyRound",
    featured: true,
    related: ["deep-cleaning", "post-construction"],
    price: { model: "from", amount: 200 }, // TODO: confirm
  },
  {
    slug: "post-construction",
    icon: "HardHat",
    featured: true,
    related: ["commercial", "deep-cleaning"],
    price: { model: "quote" },
  },
  {
    slug: "interior-painting",
    icon: "PaintRoller",
    featured: true,
    related: ["residential", "commercial"],
    price: { model: "quote" },
  },
];

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}

export function isServiceSlug(slug: string): slug is ServiceSlug {
  return serviceSlugs.includes(slug as ServiceSlug);
}
