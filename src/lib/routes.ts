import type { ServiceSlug } from "@/content/services";

/**
 * Centralized, locale-agnostic route paths. Pass these to the locale-aware
 * `Link`/`redirect` from `@/i18n/navigation` (the locale prefix is added
 * automatically). Keeping routes here prevents stringly-typed URLs drifting.
 */
export const routes = {
  home: "/",
  services: "/services",
  service: (slug: ServiceSlug | string) => `/services/${slug}`,
  pricing: "/pricing",
  quote: "/quote",
  serviceAreas: "/service-areas",
  city: (slug: string) => `/service-areas/${slug}`,
  about: "/about",
  reviews: "/reviews",
  contact: "/contact",
} as const;
