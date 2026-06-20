import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { buildMetadata } from "@/lib/metadata";
import { PageHero } from "@/components/sections/page-hero";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/reveal";
import { CityCard } from "@/components/sections/city-card";
import { CTASection } from "@/components/sections/cta-section";
import { cities } from "@/content/cities";
import { routes } from "@/lib/routes";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Meta.pages.serviceAreas" });
  return buildMetadata({
    title: t("title"),
    description: t("description"),
    locale,
    path: "/service-areas",
  });
}

export default async function ServiceAreasPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("ServiceAreas");
  const tc = await getTranslations("Common");
  const tf = await getTranslations("Home.finalCta");

  return (
    <main id="main-content">
      <PageHero
        eyebrow={t("hub.eyebrow")}
        title={t("hub.title")}
        subtitle={t("hub.subtitle")}
      />

      <Section surface="white">
        <p className="mx-auto mb-12 max-w-2xl text-center text-pretty text-muted-foreground">
          {t("hub.intro")}
        </p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cities.map((city, i) => (
            <Reveal key={city.slug} delay={i * 0.05} className="h-full">
              <CityCard
                name={city.name}
                countyLabel={tc(`counties.${city.county}`)}
                blurb={t(`cities.${city.slug}.blurb`)}
                href={routes.city(city.slug)}
                cta={t("labels.cityCta")}
              />
            </Reveal>
          ))}
        </div>

        <div className="mx-auto mt-12 max-w-2xl rounded-2xl border border-border bg-cool p-6 text-center sm:p-8">
          <h2 className="font-heading text-xl font-bold text-navy">
            {t("hub.notListedTitle")}
          </h2>
          <p className="mt-2 text-pretty text-muted-foreground">
            {t("hub.notListedBody")}
          </p>
        </div>
      </Section>

      <CTASection title={tf("title")} subtitle={tf("subtitle")} />
    </main>
  );
}
