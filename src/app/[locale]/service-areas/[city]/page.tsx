import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin, Phone } from "lucide-react";
import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { buildMetadata } from "@/lib/metadata";
import { PageHero } from "@/components/sections/page-hero";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { ServiceCard } from "@/components/sections/service-card";
import { CTASection } from "@/components/sections/cta-section";
import { QuoteCTA } from "@/components/quote/quote-cta";
import { PhoneLink } from "@/components/phone-link";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/json-ld";
import { localBusinessSchema, breadcrumbSchema } from "@/lib/json-ld";
import { Link } from "@/i18n/navigation";
import { citySlugs, getCity } from "@/content/cities";
import { primaryServices } from "@/content/services";
import { site } from "@/content/site";
import { routes } from "@/lib/routes";

export function generateStaticParams() {
  return citySlugs.map((city) => ({ city }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; city: string }>;
}): Promise<Metadata> {
  const { locale, city } = await params;
  const data = getCity(city);
  if (!data) return {};
  const t = await getTranslations({ locale, namespace: "ServiceAreas.cityPage" });
  return buildMetadata({
    title: t("metaTitle", { city: data.name }),
    description: t("metaDescription", { city: data.name }),
    locale,
    path: `/service-areas/${city}`,
    titleAbsolute: true,
  });
}

export default async function CityPage({
  params,
}: {
  params: Promise<{ locale: Locale; city: string }>;
}) {
  const { locale, city } = await params;
  const data = getCity(city);
  if (!data) notFound();
  setRequestLocale(locale);

  const t = await getTranslations("ServiceAreas");
  const tc = await getTranslations("Common");
  const tNav = await getTranslations("Nav");
  const cityName = data.name;
  const cityUrl = `${site.url}/${locale}/service-areas/${city}`;
  const nearby = data.nearby
    .map((slug) => getCity(slug))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

  return (
    <main id="main-content">
      <JsonLd
        data={[
          localBusinessSchema({
            description: t("cityPage.metaDescription", { city: cityName }),
          }),
          breadcrumbSchema([
            { name: tNav("home"), url: `${site.url}/${locale}` },
            { name: tNav("serviceAreas"), url: `${site.url}/${locale}/service-areas` },
            { name: cityName, url: cityUrl },
          ]),
        ]}
      />
      <PageHero
        align="left"
        eyebrow={tc(`counties.${data.county}`)}
        title={t("cityPage.metaTitle", { city: cityName })}
        subtitle={t("cityPage.intro", { city: cityName })}
      >
        <QuoteCTA
          label={t("labels.getQuoteIn", { city: cityName })}
          service="commercial"
          className="w-full whitespace-normal sm:w-auto sm:whitespace-nowrap"
        />
        <Button asChild variant="outline" size="xl" className="w-full sm:w-auto">
          <a href={site.phone.href}>
            <Phone className="size-5" aria-hidden />
            {tc("callNow")}
          </a>
        </Button>
      </PageHero>

      <Container className="pt-8">
        <Link
          href={routes.serviceAreas}
          className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-royal hover:underline"
        >
          <ArrowLeft className="size-4" />
          {t("labels.backToAreas")}
        </Link>
      </Container>

      <Section surface="none" className="pt-8">
        <div className="grid gap-10 lg:grid-cols-3 lg:gap-12">
          <div className="lg:col-span-2">
            <h2 className="font-heading text-2xl font-bold text-navy">
              {t("cityPage.whyTitle", { city: cityName })}
            </h2>
            <p className="mt-4 leading-relaxed text-pretty text-muted-foreground">
              {t("cityPage.whyBody", { city: cityName })}
            </p>
          </div>
          {/* G2: broad-area framing — no ZIP enumeration (data stays in
              cities.ts for reversibility). The aside sells the walkthrough. */}
          <aside className="rounded-2xl border border-border bg-cool p-6">
            <h3 className="flex items-center gap-2 font-heading font-semibold text-navy">
              <MapPin className="size-4 text-sky" aria-hidden />
              {tc("serviceAreaLabel")}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {tc("estimateNote")}
            </p>
            {/* Was a hand-rolled copy of PhoneLink that rendered a 21px-tall tap
                target and skipped the call-tracking hook. Use the real component. */}
            <PhoneLink showIcon className="mt-4 text-sm font-semibold text-royal hover:underline">
              {tc("callUs", { phone: site.phone.display })}
            </PhoneLink>
          </aside>
        </div>
      </Section>

      <Section surface="white">
        <h2 className="font-heading text-2xl font-bold text-navy">
          {t("cityPage.servicesTitle", { city: cityName })}
        </h2>
        <p className="mt-3 max-w-2xl text-pretty text-muted-foreground">
          {t("cityPage.servicesBody", { city: cityName })}
        </p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {primaryServices.map((service) => (
            <ServiceCard key={service.slug} service={service} />
          ))}
        </div>
      </Section>

      {nearby.length > 0 ? (
        <Section surface="cool">
          <h2 className="font-heading text-xl font-bold text-navy">
            {t("labels.nearbyTitle")}
          </h2>
          <ul className="mt-5 flex flex-wrap gap-2.5">
            {nearby.map((c) => (
              <li key={c.slug}>
                <Link
                  href={routes.city(c.slug)}
                  className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-border bg-surface px-4 py-1.5 text-sm font-medium text-navy transition-colors hover:border-sky/50 hover:bg-secondary"
                >
                  <MapPin className="size-3.5 text-sky" aria-hidden />
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      <CTASection
        title={t("cityPage.ctaTitle", { city: cityName })}
        subtitle={t("cityPage.ctaBody", { city: cityName })}
      />
    </main>
  );
}
