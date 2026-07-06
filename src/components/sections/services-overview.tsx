import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { ServiceCard } from "./service-card";
import { primaryServices } from "@/content/services";
import { routes } from "@/lib/routes";

export function ServicesOverview() {
  const t = useTranslations("Home.services");

  return (
    <Section id="services" surface="white">
      <SectionHeading
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
      />
      {/* The five-service primary offer (G1: demoted services live on the hub). */}
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {primaryServices.map((service, i) => (
          <Reveal key={service.slug} delay={i * 0.06} className="h-full">
            <ServiceCard service={service} />
          </Reveal>
        ))}
      </div>
      <div className="mt-10 flex justify-center">
        <Button asChild variant="outline" size="lg" className="h-11 px-6">
          <Link href={routes.services}>
            {t("viewAll")}
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </Section>
  );
}
