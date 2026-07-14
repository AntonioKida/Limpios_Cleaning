import { site, dayOrder, type DayKey } from "@/content/site";
import { cities } from "@/content/cities";

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

/**
 * LocalBusiness as a SERVICE-AREA business: NO PostalAddress is published (the
 * old suite was a UPS mailbox, removed per owner 2026-07). The coverage is
 * declared via `areaServed`; contact is phone + email only. AggregateRating is
 * intentionally OMITTED while reviews are placeholders (`reviewsArePlaceholder`)
 * — never emit structured data for sample reviews.
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
    image: `${site.url}/brand/logo-l.png`,
    logo: `${site.url}/brand/logo-l.png`,
    priceRange: "$$",
    // Service-area business — no `address`/PostalAddress. Coverage via areaServed.
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
    // Verified membership (South Lake Chamber directory, 2026-07-06).
    memberOf: {
      "@type": "Organization",
      name: site.chamber.name,
      url: site.chamber.url,
    },
    // NO aggregateRating / Review: there are no real reviews and we never
    // fabricate them. Social proof lives in the "Trusted By" section instead.
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
