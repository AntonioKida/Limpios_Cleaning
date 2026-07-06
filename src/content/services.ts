/**
 * Service catalog STRUCTURE. Names, taglines, descriptions, "what's included"
 * checklists and "who it's for" copy live in the message catalogs under
 * `Services.items.<slug>` (so they are translatable in one place). This file
 * holds routing slugs, icons, pricing model and relationships only.
 *
 * REPOSITIONING (2026-07, owner brief): the primary offer is the five B2B-first
 * services below (commercial, post-construction, move-in/out, window, carpet).
 * `residential` and `interior-painting` are DEMOTED, not deleted — decision
 * gate G1 (docs/fable-audit/30-decision-gates.md): routes, copy and quote
 * options stay live so the change is reversible with two flag flips.
 */

export const serviceSlugs = [
  "commercial",
  "post-construction",
  "move-in-out",
  "window-cleaning",
  "carpet-cleaning",
  "residential",
  "deep-cleaning",
  "interior-painting",
] as const;

export type ServiceSlug = (typeof serviceSlugs)[number];

import type { IconName } from "./icons";

export interface Service {
  slug: ServiceSlug;
  icon: IconName;
  /** Show on the homepage services grid + services-hub primary grid. */
  featured: boolean;
  /**
   * Demoted offering (G1): still routed, linked from the services hub's
   * "also available" strip and offered in the quote form, but out of the
   * homepage grid, footer nav and hub primary grid.
   */
  secondary?: boolean;
  related: ServiceSlug[];
  /**
   * Pricing model drives how the price is rendered:
   * - "quote"  -> "Free estimate" (walkthrough + free estimate — the only
   *               model in use since the repositioning; no published amounts)
   * - "from" / "custom" retained in the type so G1/pricing reversals are a
   *   data-only change. Amounts, if ever published again, are owner-provided.
   */
  price: { model: "from" | "custom" | "quote"; amount?: number };
}

export const services: Service[] = [
  {
    slug: "commercial",
    icon: "Building2",
    featured: true,
    related: ["post-construction", "window-cleaning", "carpet-cleaning"],
    price: { model: "quote" },
  },
  {
    slug: "post-construction",
    icon: "HardHat",
    featured: true,
    related: ["commercial", "window-cleaning", "move-in-out"],
    price: { model: "quote" },
  },
  {
    slug: "move-in-out",
    icon: "KeyRound",
    featured: true,
    related: ["carpet-cleaning", "window-cleaning", "post-construction"],
    price: { model: "quote" },
  },
  {
    slug: "window-cleaning",
    icon: "Grid2x2",
    featured: true,
    related: ["commercial", "post-construction", "carpet-cleaning"],
    price: { model: "quote" },
  },
  {
    slug: "carpet-cleaning",
    icon: "Waves",
    featured: true,
    related: ["commercial", "move-in-out", "window-cleaning"],
    price: { model: "quote" },
  },
  // ——— Demoted (G1): reachable, quotable, out of the primary surfaces.
  // deep-cleaning is not in the owner's five either, but its route/content are
  // preserved for the same reversibility reason as residential/painting. ———
  {
    slug: "residential",
    icon: "House",
    featured: false,
    secondary: true,
    related: ["deep-cleaning", "carpet-cleaning", "window-cleaning"],
    price: { model: "quote" },
  },
  {
    slug: "deep-cleaning",
    icon: "Sparkles",
    featured: false,
    secondary: true,
    related: ["residential", "move-in-out", "carpet-cleaning"],
    price: { model: "quote" },
  },
  {
    slug: "interior-painting",
    icon: "PaintRoller",
    featured: false,
    secondary: true,
    related: ["post-construction", "move-in-out"],
    price: { model: "quote" },
  },
];

/** The B2B-first primary offer (homepage grid, footer nav, hub primary grid). */
export const primaryServices = services.filter((s) => !s.secondary);

/** Demoted offerings (G1) — services hub "also available" strip. */
export const secondaryServices = services.filter((s) => s.secondary);

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}

export function isServiceSlug(slug: string): slug is ServiceSlug {
  return serviceSlugs.includes(slug as ServiceSlug);
}
