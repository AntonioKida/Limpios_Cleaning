import { site, dayOrder, type DayKey } from "@/content/site";
import { cities } from "@/content/cities";
import { reviewsArePlaceholder } from "@/content/reviews";

const BUSINESS_ID = `${site.url}/#business`;

const SCHEMA_DAY: Record<DayKey, string> = {
  mon: "Monday",
  tue: "Tuesday",
  wed: "Wednesday",
  thu: "Thursday",
  fri: "Friday",
  sat: "Saturday",
  sun: "Sunday",
};

const postalAddress = {
  "@type": "PostalAddress",
  streetAddress: `${site.address.street}, ${site.address.suite}`,
  addressLocality: site.address.city,
  addressRegion: site.address.region,
  postalCode: site.address.postalCode,
  addressCountry: site.address.country,
};

/**
 * LocalBusiness with full NAP, geo, hours, areaServed and social profiles.
 * AggregateRating is intentionally OMITTED while reviews are placeholders
 * (`reviewsArePlaceholder`) — never emit structured data for sample reviews.
 */
export function localBusinessSchema({ description }: { description: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": BUSINESS_ID,
    name: site.name,
    description,
    url: site.url,
    telephone: site.phone.e164,
    email: site.email,
    image: `${site.url}/brand/logo.jpeg`,
    logo: `${site.url}/brand/logo.jpeg`,
    priceRange: "$$",
    address: postalAddress,
    geo: {
      "@type": "GeoCoordinates",
      latitude: site.geo.latitude,
      longitude: site.geo.longitude,
    },
    areaServed: cities.map((c) => ({ "@type": "City", name: c.name })),
    openingHoursSpecification: dayOrder
      .filter((d) => site.hours[d])
      .map((d) => {
        const h = site.hours[d]!;
        return {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: SCHEMA_DAY[d],
          opens: h.open,
          closes: h.close,
        };
      }),
    sameAs: [site.social.instagram, site.social.facebook],
    // aggregateRating: gated — only when real reviews exist.
    ...(reviewsArePlaceholder
      ? {}
      : {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: site.rating.value,
            reviewCount: site.rating.count,
          },
        }),
  };
}

export function serviceSchema({
  name,
  description,
  url,
}: {
  name: string;
  description: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: name,
    name,
    description,
    url,
    provider: {
      "@type": "LocalBusiness",
      "@id": BUSINESS_ID,
      name: site.name,
      telephone: site.phone.e164,
      url: site.url,
      address: postalAddress,
    },
    areaServed: { "@type": "State", name: "Florida" },
  };
}

export function faqPageSchema(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
