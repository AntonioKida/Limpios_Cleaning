import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { buildMetadata } from "@/lib/metadata";
import { PageHero } from "@/components/sections/page-hero";
import { Container } from "@/components/ui/container";
import { QuoteForm } from "@/components/quote/quote-form";
import { isServiceSlug } from "@/content/services";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Quote" });
  return buildMetadata({
    title: t("title"),
    description: t("intro"),
    locale,
    path: "/quote",
  });
}

export default async function QuotePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ service?: string | string[] }>;
}) {
  const { locale } = await params;
  const { service } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations("Quote");

  const raw = Array.isArray(service) ? service[0] : service;
  const defaultService = raw && isServiceSlug(raw) ? raw : "";

  return (
    <main id="main-content">
      <PageHero
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
      />
      <section className="py-12 sm:py-16">
        <Container className="max-w-2xl">
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm sm:p-8">
            <QuoteForm defaultService={defaultService} />
          </div>
        </Container>
      </section>
    </main>
  );
}
