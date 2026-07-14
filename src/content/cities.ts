/**
 * Service-area cities for templated, locally-flavored city pages (local SEO).
 * Add a city by appending an entry here + a `ServiceAreas.cities.<slug>` block
 * in the message catalogs — the hub, homepage list, routes and sitemap update
 * automatically. City NAMES are proper nouns (identical across locales) so they
 * stay here; the marketing blurb is translatable and lives in messages.
 */

export type CountyKey = "lake" | "orange" | "multi";

export type CitySlug =
  | "clermont"
  | "minneola"
  | "groveland"
  | "winter-garden"
  | "horizon-west"
  | "four-corners"
  | "montverde"
  | "mascotte";

export interface City {
  slug: CitySlug;
  /** Proper noun — not translated. */
  name: string;
  county: CountyKey;
  /** Show in the homepage service-area shortlist. */
  featured: boolean;
  /** Nearby city slugs for internal linking. */
  nearby: CitySlug[];
}

export const cities: City[] = [
  {
    slug: "clermont",
    name: "Clermont",
    county: "lake",
    featured: true,
    nearby: ["minneola", "groveland", "montverde"],
  },
  {
    slug: "minneola",
    name: "Minneola",
    county: "lake",
    featured: true,
    nearby: ["clermont", "montverde", "groveland"],
  },
  {
    slug: "groveland",
    name: "Groveland",
    county: "lake",
    featured: true,
    nearby: ["clermont", "mascotte", "minneola"],
  },
  {
    slug: "winter-garden",
    name: "Winter Garden",
    county: "orange",
    featured: true,
    nearby: ["horizon-west", "clermont", "montverde"],
  },
  {
    slug: "horizon-west",
    name: "Horizon West",
    county: "orange",
    featured: true,
    nearby: ["winter-garden", "four-corners", "clermont"],
  },
  {
    slug: "four-corners",
    name: "Four Corners",
    county: "multi",
    featured: true,
    nearby: ["horizon-west", "clermont", "groveland"],
  },
  {
    slug: "montverde",
    name: "Montverde",
    county: "lake",
    featured: false,
    nearby: ["minneola", "clermont", "winter-garden"],
  },
  {
    slug: "mascotte",
    name: "Mascotte",
    county: "lake",
    featured: false,
    nearby: ["groveland", "clermont", "minneola"],
  },
];

export function getCity(slug: string): City | undefined {
  return cities.find((c) => c.slug === slug);
}

export const citySlugs = cities.map((c) => c.slug);
