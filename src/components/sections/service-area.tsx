import { ArrowRight, MapPin } from "lucide-react";
import { useTranslations } from "next-intl";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { FloridaMap } from "@/components/florida-map";
import { Reveal } from "@/components/reveal";
import { Link } from "@/i18n/navigation";
import { cities } from "@/content/cities";
import { routes } from "@/lib/routes";

export function ServiceAreaSection() {
  const t = useTranslations("Home.serviceArea");
  const featured = cities.filter((c) => c.featured);

  return (
    <Section id="service-area" surface="white">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="flex flex-col gap-6">
          <SectionHeading
            align="left"
            eyebrow={t("eyebrow")}
            title={t("title")}
            subtitle={t("subtitle")}
          />
          <div>
            <p className="mb-3 text-sm font-semibold text-navy">
              {t("listIntro")}
            </p>
            <ul className="flex flex-wrap gap-2.5">
              {featured.map((city) => (
                <li key={city.slug}>
                  <Link
                    href={routes.city(city.slug)}
                    className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-border bg-cool px-4 py-1.5 text-sm font-medium text-navy transition-colors hover:border-sky/50 hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  >
                    <MapPin className="size-3.5 text-sky" aria-hidden />
                    {city.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <p className="text-sm text-muted-foreground">{t("notListed")}</p>
          <div>
            <Link
              href={routes.serviceAreas}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-royal hover:underline"
            >
              {t("cta")}
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>

        {/* Real (stylized) Florida map: a static inline SVG. No Google/Mapbox
            embed, so no API key, no JS weight, and it renders without JS. */}
        <Reveal delay={0.1}>
          <div className="rounded-[1.75rem] border border-border bg-cool p-6 shadow-sm sm:p-8">
            <FloridaMap className="mx-auto max-w-xs sm:max-w-sm" />
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
