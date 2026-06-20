import { ArrowRight, Info } from "lucide-react";
import { useTranslations } from "next-intl";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { ReviewCard } from "./review-card";
import { reviews } from "@/content/reviews";
import { routes } from "@/lib/routes";

export function Testimonials() {
  const t = useTranslations("Home.reviews");
  const ti = useTranslations("Reviews.items");
  const td = useTranslations("Reviews");

  const featured = reviews.filter((r) => r.featured).slice(0, 3);

  return (
    <Section id="reviews" surface="cool">
      <SectionHeading
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
      />

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {featured.map((review, i) => (
          <Reveal key={review.id} delay={i * 0.08} className="h-full">
            <ReviewCard
              name={review.name}
              city={review.city}
              rating={review.rating}
              quote={ti(`${review.id}.quote`)}
            />
          </Reveal>
        ))}
      </div>

      {/* Placeholder disclaimer — sample reviews must be replaced before launch. */}
      <p className="mx-auto mt-8 flex max-w-2xl items-start justify-center gap-2 text-center text-xs text-muted-foreground">
        <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden />
        <span>{td("disclaimer")}</span>
      </p>

      <div className="mt-8 flex justify-center">
        <Button asChild variant="outline" size="lg" className="h-11 px-6">
          <Link href={routes.reviews}>
            {t("viewAll")}
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </Section>
  );
}
