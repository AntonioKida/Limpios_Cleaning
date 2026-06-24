import { JsonLd } from "./json-ld";
import { breadcrumbSchema } from "@/lib/json-ld";
import { site } from "@/content/site";

/**
 * BreadcrumbList JSON-LD for a page. Pass the localized crumb names + their
 * locale-relative paths (root crumb path = ""); the absolute URLs are built here.
 */
export function BreadcrumbJsonLd({
  locale,
  crumbs,
}: {
  locale: string;
  crumbs: { name: string; path: string }[];
}) {
  return (
    <JsonLd
      data={[
        breadcrumbSchema(
          crumbs.map((c) => ({
            name: c.name,
            url: `${site.url}/${locale}${c.path}`,
          })),
        ),
      ]}
    />
  );
}
