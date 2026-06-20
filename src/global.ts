import type { routing } from "@/i18n/routing";
import type messages from "../messages/en.json";

/**
 * next-intl type augmentation: makes `useTranslations`/`getTranslations` keys
 * type-checked against the English catalog, and types `Locale` from routing.
 * (English is the source-of-truth catalog; Spanish mirrors its shape.)
 */
declare module "next-intl" {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: typeof messages;
  }
}
