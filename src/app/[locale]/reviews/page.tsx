import type { Metadata } from "next";
import { Info } from "lucide-react";
import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { buildMetadata } from "@/lib/metadata";
import { PageHero } from "@/components/sections/page-hero";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/star-rating";
import { ReviewCard } from "@/components/sections/review-card";
import { CTASection } from "@/components/sections/cta-section";
import { reviews } from "@/content/reviews";
import { site } from "@/content/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Meta.pages.reviews" });
  return buildMetadata({
    title: t("title"),
    description: t("description"),
    locale,
    path: "/reviews",
  });
}

export default async function ReviewsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Reviews");
  const ti = await getTranslations("Reviews.items");
  const tf = await getTranslations("Home.finalCta");

  return (
    <main id="main-content">
      <PageHero eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")}>
        <StarRating rating={5} starClassName="size-6" />
        <Button asChild variant="outline" size="lg" className="h-11 px-6">
          {/* TODO: replace with the real Google "leave a review" URL. */}
          <a href={site.rating.reviewUrl} target="_blank" rel="noopener noreferrer">
            {t("leaveReview")}
          </a>
        </Button>
      </PageHero>

      <Section surface="white">
        {/* Placeholder disclaimer — sample reviews must be replaced before launch. */}
        <div className="mx-auto mb-10 flex max-w-3xl items-start gap-3 rounded-xl border border-sand/60 bg-[color-mix(in_srgb,var(--sand)_18%,white)] px-4 py-3 text-sm text-navy">
          <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
          <span>{t("disclaimer")}</span>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review, i) => (
            <Reveal key={review.id} delay={i * 0.05} className="h-full">
              <ReviewCard
                name={review.name}
                city={review.city}
                rating={review.rating}
                quote={ti(`${review.id}.quote`)}
              />
            </Reveal>
          ))}
        </div>
      </Section>

      <CTASection title={tf("title")} subtitle={tf("subtitle")} />
    </main>
  );
}
