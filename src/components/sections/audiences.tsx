import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/reveal";
import { Icon } from "@/components/icon";
import { Link } from "@/i18n/navigation";
import { audiences } from "@/content/home";
import { routes } from "@/lib/routes";

/**
 * "Who we work with" — the B2B buyer segments from the owner brief
 * (commercial businesses, property managers, HOAs, construction companies).
 * Each card links to the service that segment most likely needs first.
 */
export function Audiences() {
  const t = useTranslations("Home.audiences");

  return (
    <Section id="audiences" surface="cool">
      <SectionHeading
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
      />
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {audiences.map((audience, i) => (
          <Reveal key={audience.id} delay={i * 0.05} className="h-full">
            <Link
              href={routes.service(audience.serviceSlug)}
              className="group flex h-full flex-col gap-4 rounded-xl border border-border bg-surface p-6 transition duration-200 hover:-translate-y-0.5 hover:border-sky/50 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:hover:translate-y-0"
            >
              <span className="grid size-11 place-items-center rounded-xl bg-secondary text-royal">
                <Icon name={audience.icon} className="size-5" />
              </span>
              <div className="flex flex-col gap-1.5">
                <h3 className="font-heading text-lg font-bold text-navy">
                  {t(`items.${audience.id}.title`)}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {t(`items.${audience.id}.description`)}
                </p>
              </div>
              <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-royal">
                {t("cta")}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
