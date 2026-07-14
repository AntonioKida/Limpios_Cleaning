import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { JsonLd } from "@/components/json-ld";
import { localBusinessSchema, faqPageSchema } from "@/lib/json-ld";
import { faqIds } from "@/content/faq";
import { Hero } from "@/components/sections/hero";
import { TrustBar } from "@/components/sections/trust-bar";
import { ClientsServed } from "@/components/sections/clients-served";
import { SeeInAction } from "@/components/sections/see-in-action";
import { ServicesOverview } from "@/components/sections/services-overview";
import { Audiences } from "@/components/sections/audiences";
import { HowItWorks } from "@/components/sections/how-it-works";
import { WhyUs } from "@/components/sections/why-us";
import { BeforeAfterGallery } from "@/components/sections/before-after";
import { Testimonials } from "@/components/sections/testimonials";
import { ServiceAreaSection } from "@/components/sections/service-area";
import { Faq } from "@/components/sections/faq";
import { CTASection } from "@/components/sections/cta-section";
import { ScrollTracker } from "@/components/analytics/scroll-tracker";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Home.finalCta");
  const tMeta = await getTranslations("Meta");
  const tFaq = await getTranslations("Faq.items");
  const faqItems = faqIds.map((id) => ({
    q: tFaq(`${id}.q`),
    a: tFaq(`${id}.a`),
  }));

  return (
    <main id="main-content">
      <ScrollTracker page="home" />
      <JsonLd
        data={[
          localBusinessSchema({ description: tMeta("defaultDescription") }),
          faqPageSchema(faqItems),
        ]}
      />
      <Hero />
      <TrustBar />
      {/* Built but DISABLED (clientsServedEnabled=false) — renders nothing until
          Papo has written permission from each named client. One-flag flip. */}
      <ClientsServed />
      <SeeInAction />
      <ServicesOverview />
      <Audiences />
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
