import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { buildMetadata } from "@/lib/metadata";
import { PageHero } from "@/components/sections/page-hero";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/reveal";
import { ServiceCard } from "@/components/sections/service-card";
import { CTASection } from "@/components/sections/cta-section";
import { services } from "@/content/services";

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
          {services.map((service, i) => (
            <Reveal key={service.slug} delay={i * 0.05} className="h-full">
              <ServiceCard service={service} />
            </Reveal>
          ))}
        </div>
      </Section>
      <CTASection title={tc("title")} subtitle={tc("subtitle")} />
    </main>
  );
}
