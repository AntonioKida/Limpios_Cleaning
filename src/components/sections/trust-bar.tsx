import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/container";
import { Icon } from "@/components/icon";
import { Reveal } from "@/components/reveal";
import { trustBadges } from "@/content/home";

export function TrustBar() {
  const t = useTranslations("Home.trustBar");

  return (
    <section
      aria-label={t("veteran")}
      className="border-y border-border bg-surface py-7 sm:py-9"
    >
      <Container>
        <ul className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4">
          {trustBadges.map((badge, i) => (
            <li key={badge.id}>
              <Reveal
                delay={i * 0.05}
                className="flex items-center justify-center gap-2.5"
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-secondary text-sky">
                  <Icon name={badge.icon} className="size-5" />
                </span>
                <span className="text-sm font-semibold text-navy">
                  {t(badge.id)}
                </span>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
