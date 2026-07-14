import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { buildMetadata } from "@/lib/metadata";
import { PageHero } from "@/components/sections/page-hero";
import { TrustedBy } from "@/components/sections/trusted-by";
import { CTASection } from "@/components/sections/cta-section";
import { BreadcrumbJsonLd } from "@/components/breadcrumb-json-ld";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Meta.pages.trustedBy" });
  return buildMetadata({
    title: t("title"),
    description: t("description"),
    locale,
    path: "/trusted-by",
  });
}

export default async function TrustedByPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("TrustedBy");
  const tNav = await getTranslations("Nav");

  return (
    <main id="main-content">
      <BreadcrumbJsonLd
        locale={locale}
        crumbs={[
          { name: tNav("home"), path: "" },
          { name: tNav("trustedBy"), path: "/trusted-by" },
        ]}
      />
      <PageHero
        eyebrow={t("eyebrow")}
        title={t("pageTitle")}
        subtitle={t("pageSubtitle")}
      />
      {/* The page hero supplies the <h1>, so the section hides its own heading. */}
      <TrustedBy showHeading={false} />
      <CTASection
        title={t("ctaTitle")}
        subtitle={t("ctaSubtitle")}
        primaryLabel={t("ctaButton")}
      />
    </main>
  );
}
