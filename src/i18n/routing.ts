import { defineRouting } from "next-intl/routing";

/**
 * Central i18n routing config for Limpios.
 * Locales are always prefixed (`/en/...`, `/es/...`) and `/` redirects to the
 * default locale via the middleware. Add a locale here and it flows through the
 * whole app (middleware, navigation, sitemap, hreflang).
 */
export const routing = defineRouting({
  locales: ["en", "es"],
  defaultLocale: "en",
  localePrefix: "always",
});

export type Locale = (typeof routing.locales)[number];
