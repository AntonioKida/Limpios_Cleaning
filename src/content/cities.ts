/**
 * Service-area cities for templated, locally-flavored city pages (local SEO).
 * Add a city by appending an entry here + a `ServiceAreas.cities.<slug>` block
 * in the message catalogs — the hub, homepage list, routes and sitemap update
 * automatically. City NAMES are proper nouns (identical across locales) so they
 * stay here; the marketing blurb is translatable and lives in messages.
 */

export type CountyKey = "lake" | "orange" | "multi";

export interface City {
  slug: string;
  /** Proper noun — not translated. */
  name: string;
  county: CountyKey;
  /** Show in the homepage service-area shortlist. */
  featured: boolean;
  /** Representative ZIP codes. TODO: confirm exact coverage + ZIPs with client. */
  zips: string[];
  /** Nearby city slugs for internal linking. */
  nearby: string[];
}

export const cities: City[] = [
  {
    slug: "clermont",
    name: "Clermont",
    county: "lake",
    featured: true,
    zips: ["34711", "34714", "34715"],
    nearby: ["minneola", "groveland", "montverde"],
  },
  {
    slug: "minneola",
    name: "Minneola",
    county: "lake",
    featured: true,
    zips: ["34715"],
    nearby: ["clermont", "montverde", "groveland"],
  },
  {
    slug: "groveland",
    name: "Groveland",
    county: "lake",
    featured: true,
    zips: ["34736"],
    nearby: ["clermont", "mascotte", "minneola"],
  },
  {
    slug: "winter-garden",
    name: "Winter Garden",
    county: "orange",
    featured: true,
    zips: ["34787"],
    nearby: ["horizon-west", "clermont", "montverde"],
  },
  {
    slug: "horizon-west",
    name: "Horizon West",
    county: "orange",
    featured: true,
    zips: ["34787"],
    nearby: ["winter-garden", "four-corners", "clermont"],
  },
  {
    slug: "four-corners",
    name: "Four Corners",
    county: "multi",
    featured: true,
    zips: ["34747", "33896"],
    nearby: ["horizon-west", "clermont", "groveland"],
  },
  {
    slug: "montverde",
    name: "Montverde",
    county: "lake",
    featured: false,
    zips: ["34756"],
    nearby: ["minneola", "clermont", "winter-garden"],
  },
  {
    slug: "mascotte",
    name: "Mascotte",
    county: "lake",
    featured: false,
    zips: ["34753"],
    nearby: ["groveland", "clermont", "minneola"],
  },
];

export function getCity(slug: string): City | undefined {
  return cities.find((c) => c.slug === slug);
}

export const citySlugs = cities.map((c) => c.slug);
