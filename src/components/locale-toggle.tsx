"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";

/**
 * EN/ES segmented toggle. Renders real locale-aware links (good for SEO and
 * keyboard users) that swap the locale while preserving the current path.
 */
export function LocaleToggle({ className }: { className?: string }) {
  const activeLocale = useLocale();
  const pathname = usePathname();
  const t = useTranslations("Nav");

  return (
    <div
      role="group"
      aria-label={t("language")}
      className={cn(
        "inline-flex items-center rounded-full border border-border bg-background p-0.5",
        className,
      )}
    >
      {routing.locales.map((locale) => {
        const isActive = locale === activeLocale;
        return (
          <Link
            key={locale}
            href={pathname}
            locale={locale}
            hrefLang={locale}
            aria-current={isActive ? "true" : undefined}
            title={locale === "en" ? t("switchToEn") : t("switchToEs")}
            className={cn(
              "rounded-full px-2.5 py-1 text-xs font-semibold uppercase transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {locale}
          </Link>
        );
      })}
    </div>
  );
}
