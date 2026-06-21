import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/container";
import { Icon } from "@/components/icon";
import { BrandIcon } from "@/components/brand-icons";
import { trustBadges } from "@/content/home";

export function TrustBar() {
  const t = useTranslations("Home.trustBar");

  return (
    <section aria-label={t("veteran")} className="border-y border-border bg-surface">
      <Container>
        <ul className="grid grid-cols-2 divide-border sm:grid-cols-4 sm:divide-x">
          {trustBadges.map((badge) => (
            <li
              key={badge.id}
              className="flex items-center justify-center gap-2.5 px-4 py-6 sm:py-7"
            >
              <span className="shrink-0 text-sky">
                {badge.id === "veteran" ? (
                  <BrandIcon name="shield" className="size-6" />
                ) : (
                  <Icon name={badge.icon} className="size-6" />
                )}
              </span>
              <span className="text-sm font-semibold text-navy">{t(badge.id)}</span>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
