import { Play } from "lucide-react";
import { useTranslations } from "next-intl";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/reveal";
import { Icon } from "@/components/icon";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { valueCards } from "@/content/founder";
import { routes } from "@/lib/routes";

export function WhyUs() {
  const t = useTranslations("Home.why");
  const tv = useTranslations("About.values");

  return (
    <Section id="why" surface="white">
      <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="flex flex-col gap-8">
          <SectionHeading
            align="left"
            eyebrow={t("eyebrow")}
            title={t("title")}
            subtitle={t("subtitle")}
          />
          <div className="grid gap-5 sm:grid-cols-2">
            {valueCards.map((value, i) => (
              <Reveal
                key={value.id}
                delay={i * 0.06}
                className="flex gap-4 rounded-2xl border border-border bg-cool/60 p-5"
              >
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-secondary text-royal">
                  <Icon name={value.icon} className="size-5" />
                </span>
                <div className="flex flex-col gap-1">
                  <h3 className="font-heading font-semibold text-navy">
                    {tv(`${value.id}.title`)}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {tv(`${value.id}.description`)}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
          <div>
            <Button asChild variant="outline" size="lg" className="h-11 px-6">
              <Link href={routes.about}>{t("ctaAbout")}</Link>
            </Button>
          </div>
        </div>

        {/* Founder video placeholder slot */}
        <Reveal delay={0.1} className="lg:sticky lg:top-28">
          <div className="relative aspect-video overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-royal to-navy shadow-xl ring-1 ring-white/10">
            <div
              aria-hidden
              className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,color-mix(in_srgb,var(--sky)_30%,transparent),transparent_55%)]"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center text-white">
              <span className="grid size-16 place-items-center rounded-full bg-white/15 ring-1 ring-white/30 backdrop-blur transition-transform hover:scale-105">
                <Play className="size-7 translate-x-0.5 fill-white" aria-hidden />
              </span>
              <div>
                <p className="font-heading text-lg font-semibold">
                  {t("videoLabel")}
                </p>
                {/* TODO: embed the real 30–60s founder video here. */}
                <p className="mt-1 text-sm text-cool/70">
                  {t("videoComingSoon")}
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
