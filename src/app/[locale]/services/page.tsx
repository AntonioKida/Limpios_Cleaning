import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { buildMetadata } from "@/lib/metadata";
import { PageHero } from "@/components/sections/page-hero";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/reveal";
import { ServiceCard } from "@/components/sections/service-card";
import { CTASection } from "@/components/sections/cta-section";
import { BreadcrumbJsonLd } from "@/components/breadcrumb-json-ld";
import { Icon } from "@/components/icon";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import { routes } from "@/lib/routes";
import { primaryServices, secondaryServices } from "@/content/services";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Meta.pages.services" });
  return buildMetadata({
    title: t("title"),
    description: t("description"),
    locale,
    path: "/services",
  });
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Services");
  const tc = await getTranslations("Home.finalCta");
  const tNav = await getTranslations("Nav");

  return (
    <main id="main-content">
      <BreadcrumbJsonLd
        locale={locale}
        crumbs={[
          { name: tNav("home"), path: "" },
          { name: tNav("services"), path: "/services" },
        ]}
      />
      <PageHero
        eyebrow={t("hub.eyebrow")}
        title={t("hub.title")}
        subtitle={t("hub.subtitle")}
      />
      <Section surface="white">
        <p className="mx-auto mb-12 max-w-2xl text-center text-pretty text-muted-foreground">
          {t("hub.intro")}
        </p>
        {/* Section label for a correct heading outline (h1 -> h2 -> card h3) */}
        <h2 className="sr-only">{t("labels.allServices")}</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {primaryServices.map((service, i) => (
            <Reveal key={service.slug} delay={i * 0.05} className="h-full">
              <ServiceCard service={service} />
            </Reveal>
          ))}
        </div>

        {/* G1: demoted offerings — reachable, but visibly secondary. */}
        <div className="mt-14 rounded-2xl border border-border bg-cool p-6 sm:p-8">
          <h2 className="font-heading text-lg font-bold text-navy">
            {t("hub.alsoAvailableTitle")}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {t("hub.alsoAvailableBody")}
          </p>
          <ul className="mt-5 flex flex-wrap gap-3">
            {secondaryServices.map((service) => (
              <li key={service.slug}>
                <Link
                  href={routes.service(service.slug)}
                  className="group inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-semibold text-navy transition-colors hover:border-sky/50 hover:bg-secondary"
                >
                  <Icon name={service.icon} className="size-4 text-royal" />
                  {t(`items.${service.slug}.name`)}
                  <ArrowRight className="size-3.5 text-royal transition-transform group-hover:translate-x-0.5" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Section>
      <CTASection title={tc("title")} subtitle={tc("subtitle")} />
    </main>
  );
}
