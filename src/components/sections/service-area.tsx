import { ArrowRight, MapPin } from "lucide-react";
import { useTranslations } from "next-intl";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
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
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-cool px-3.5 py-1.5 text-sm font-medium text-navy transition-colors hover:border-sky/50 hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
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

        {/* Stylized map placeholder. TODO: replace with a real map embed. */}
        <Reveal delay={0.1}>
          <div className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem] border border-border bg-gradient-to-br from-cool to-secondary shadow-sm">
            <div
              aria-hidden
              className="absolute inset-0 opacity-60 [background-image:linear-gradient(color-mix(in_srgb,var(--royal)_10%,transparent)_1px,transparent_1px),linear-gradient(90deg,color-mix(in_srgb,var(--royal)_10%,transparent)_1px,transparent_1px)] [background-size:38px_38px]"
            />
            {[
              { top: "28%", left: "32%" },
              { top: "44%", left: "58%" },
              { top: "62%", left: "40%" },
              { top: "36%", left: "72%" },
            ].map((p, i) => (
              <span
                key={i}
                aria-hidden
                className="absolute -translate-x-1/2 -translate-y-full text-sky drop-shadow"
                style={{ top: p.top, left: p.left }}
              >
                <MapPin className="size-7 fill-sky/20" />
              </span>
            ))}
            <div className="absolute inset-x-0 bottom-0 flex items-center gap-2 bg-surface/80 px-5 py-3 text-sm font-medium text-navy backdrop-blur">
              <MapPin className="size-4 text-royal" aria-hidden />
              {t("mapPlaceholder")}
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
