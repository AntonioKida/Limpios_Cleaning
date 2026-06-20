import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { Hero } from "@/components/sections/hero";
import { TrustBar } from "@/components/sections/trust-bar";
import { ServicesOverview } from "@/components/sections/services-overview";
import { HowItWorks } from "@/components/sections/how-it-works";
import { WhyUs } from "@/components/sections/why-us";
import { BeforeAfterGallery } from "@/components/sections/before-after";
import { Testimonials } from "@/components/sections/testimonials";
import { ServiceAreaSection } from "@/components/sections/service-area";
import { Faq } from "@/components/sections/faq";
import { CTASection } from "@/components/sections/cta-section";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Home.finalCta");

  return (
    <main id="main-content">
      <Hero />
      <TrustBar />
      <ServicesOverview />
      <HowItWorks />
      <WhyUs />
      <BeforeAfterGallery />
      <Testimonials />
      <ServiceAreaSection />
      <Faq />
      <CTASection
        title={t("title")}
        subtitle={t("subtitle")}
        primaryLabel={t("primary")}
      />
    </main>
  );
}
