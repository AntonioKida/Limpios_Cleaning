import type { Metadata } from "next";
import { routing, type Locale } from "@/i18n/routing";
import { site } from "@/content/site";

const OG_LOCALE: Record<Locale, string> = {
  en: "en_US",
  es: "es_ES",
};

/**
 * Build per-page metadata with a canonical URL, hreflang alternates (en/es +
 * x-default) and Open Graph/Twitter. The og:image is supplied automatically by
 * the `opengraph-image` route convention, so it isn't set here.
 */
export function buildMetadata({
  title,
  description,
  locale,
  path = "",
  titleAbsolute = false,
}: {
  title: string;
  description: string;
  locale: Locale;
  /** Path AFTER the locale segment, e.g. "/services/residential". */
  path?: string;
  /** Use the title verbatim (skip the "%s | Limpios…" template). */
  titleAbsolute?: boolean;
}): Metadata {
  const url = `${site.url}/${locale}${path}`;
  const languages: Record<string, string> = {};
  for (const l of routing.locales) {
    languages[l] = `${site.url}/${l}${path}`;
  }
  languages["x-default"] = `${site.url}/${routing.defaultLocale}${path}`;

  // Reference the per-locale OG image explicitly. A page that sets `openGraph`
  // without `images` otherwise suppresses the `opengraph-image` file convention,
  // leaving subpages with no social preview image.
  const ogImage = {
    url: `/${locale}/opengraph-image`,
    width: 1200,
    height: 630,
    alt: site.name,
  };

  return {
    title: titleAbsolute ? { absolute: title } : title,
    description,
    alternates: { canonical: url, languages },
    openGraph: {
      type: "website",
      url,
      title,
      description,
      siteName: site.name,
      locale: OG_LOCALE[locale],
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`/${locale}/opengraph-image`],
    },
  };
}
