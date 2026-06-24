import type { Metadata } from "next";
import { Info } from "lucide-react";
import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { buildMetadata } from "@/lib/metadata";
import { PageHero } from "@/components/sections/page-hero";
import { Section } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/reveal";
import { CheckList } from "@/components/check-list";
import { Icon } from "@/components/icon";
import { QuoteCTA } from "@/components/quote/quote-cta";
import { CTASection } from "@/components/sections/cta-section";
import { BreadcrumbJsonLd } from "@/components/breadcrumb-json-ld";
import { pricePackages, priceFactorIds, type PriceFactorId } from "@/content/pricing";
import type { IconName } from "@/content/icons";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";

const FACTOR_ICON: Record<PriceFactorId, IconName> = {
  size: "House",
  condition: "Sparkles",
  frequency: "CalendarCheck",
  addons: "BadgeCheck",
  access: "Clock",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Meta.pages.pricing" });
  return buildMetadata({
    title: t("title"),
    description: t("description"),
    locale,
    path: "/pricing",
  });
}

export default async function PricingPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Pricing");
  const tc = await getTranslations("Common");
  const tNav = await getTranslations("Nav");

  return (
    <main id="main-content">
      <BreadcrumbJsonLd
        locale={locale}
        crumbs={[
          { name: tNav("home"), path: "" },
          { name: tNav("pricing"), path: "/pricing" },
        ]}
      />
      <PageHero
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
      />

      <Section surface="white">
        <p className="mx-auto mb-12 max-w-2xl text-center text-pretty text-muted-foreground">
          {t("intro")}
        </p>
        <div className="grid gap-6 lg:grid-cols-4">
          {pricePackages.map((pkg, i) => {
            const features = t.raw(`packages.${pkg.id}.features`) as string[];
            const unit =
              pkg.unit === "visit"
                ? tc("perVisit")
                : pkg.unit === "service"
                  ? tc("perService")
                  : null;
            return (
              <Reveal key={pkg.id} delay={i * 0.06} className="h-full">
                <div
                  className={cn(
                    "relative flex h-full flex-col gap-5 rounded-2xl border bg-surface p-6 shadow-sm",
                    pkg.popular
                      ? "border-royal ring-1 ring-royal"
                      : "border-border",
                  )}
                >
                  {pkg.popular ? (
                    <Badge
                      variant="cta"
                      className="absolute -top-3 left-6 px-3 py-1"
                    >
                      {t("popular")}
                    </Badge>
                  ) : null}
                  <span className="grid size-11 place-items-center rounded-xl bg-secondary text-royal">
                    <Icon name={pkg.icon} className="size-5" />
                  </span>
                  <div>
                    <h2 className="font-heading text-lg font-bold text-navy">
                      {t(`packages.${pkg.id}.name`)}
                    </h2>
                    <p className="mt-2 flex items-baseline gap-1">
                      {pkg.model === "from" && pkg.amount ? (
                        <>
                          <span className="text-sm text-muted-foreground">
                            {tc("from", { amount: "" }).trim()}
                          </span>
                          <span className="font-heading text-3xl font-bold text-navy">
                            {formatCurrency(pkg.amount, locale)}
                          </span>
                          {unit ? (
                            <span className="text-sm text-muted-foreground">
                              {unit}
                            </span>
                          ) : null}
                        </>
                      ) : (
                        <span className="font-heading text-2xl font-bold text-navy">
                          {tc("customQuote")}
                        </span>
                      )}
                    </p>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {t(`packages.${pkg.id}.description`)}
                  </p>
                  <CheckList items={features} className="gap-2.5" />
                  <div className="mt-auto pt-2">
                    <QuoteCTA
                      service={pkg.serviceSlug}
                      label={t(`packages.${pkg.id}.cta`)}
                      variant={pkg.popular ? "cta" : "outline"}
                      size="lg"
                      fullWidth
                      className="h-11"
                    />
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        <p className="mx-auto mt-8 flex max-w-2xl items-start justify-center gap-2 text-center text-sm text-muted-foreground">
          <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden />
          <span>{t("disclaimer")}</span>
        </p>
      </Section>

      <Section surface="cool">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-2xl font-bold text-navy sm:text-3xl">
            {t("factorsTitle")}
          </h2>
          <p className="mt-3 text-pretty text-muted-foreground">
            {t("factorsIntro")}
          </p>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {priceFactorIds.map((id, i) => (
            <Reveal
              key={id}
              delay={i * 0.05}
              className="flex gap-4 rounded-2xl border border-border bg-surface p-5"
            >
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-secondary text-royal">
                <Icon name={FACTOR_ICON[id]} className="size-5" />
              </span>
              <div className="flex flex-col gap-1">
                <h3 className="font-heading font-semibold text-navy">
                  {t(`factors.${id}.title`)}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {t(`factors.${id}.description`)}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <CTASection title={t("ctaTitle")} subtitle={t("ctaSubtitle")} primaryLabel={t("ctaButton")} />
    </main>
  );
}
