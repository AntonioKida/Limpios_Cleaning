import { notFound } from "next/navigation";

/**
 * Catch-all for any unmatched path under a locale. Triggers the localized
 * not-found boundary (`[locale]/not-found.tsx`) so 404s render inside the locale
 * layout with the correct language (header, footer and translations intact).
 */
export default function CatchAllPage() {
  notFound();
}
