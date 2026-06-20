import { Phone, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";
import { Mascot } from "@/components/brand/mascot";
import { QuoteCTA } from "@/components/quote/quote-cta";
import { StarRating } from "@/components/star-rating";
import { site } from "@/content/site";

export function Hero() {
  const t = useTranslations("Home.hero");
  const tt = useTranslations("Home.trustBar");

  return (
    <section className="relative isolate overflow-hidden bg-cool">
      {/* Subtle brand backdrop (single soft accent — not glow-everywhere). */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -right-24 -z-10 size-[36rem] rounded-full bg-[radial-gradient(circle_at_center,color-mix(in_srgb,var(--cyan)_30%,transparent),transparent_62%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -left-24 -z-10 size-[30rem] rounded-full bg-[radial-gradient(circle_at_center,color-mix(in_srgb,var(--sky)_16%,transparent),transparent_60%)]"
      />

      <Container className="grid items-center gap-12 py-16 sm:py-20 lg:grid-cols-2 lg:gap-16 lg:py-24">
        {/* Copy */}
        <div className="flex flex-col items-start gap-6 text-left">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-sky/30 bg-surface px-3.5 py-1.5 text-sm font-semibold text-royal shadow-sm">
              <ShieldCheck className="size-4 text-sky" aria-hidden />
              {t("eyebrow")}
            </span>
          </Reveal>

          <h1 className="font-heading text-4xl leading-[1.08] font-bold tracking-tight text-balance text-navy sm:text-5xl lg:text-6xl">
            {t("title")} <span className="text-royal">{t("titleAccent")}</span>
          </h1>

          <p className="max-w-xl text-lg leading-relaxed text-pretty text-muted-foreground">
            {t("subtitle")}
          </p>

          <Reveal delay={0.12} className="w-full">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <QuoteCTA size="2xl" withIcon className="w-full sm:w-auto" />
              <Button
                asChild
                variant="outline"
                size="2xl"
                className="w-full sm:w-auto"
              >
                <a href={site.phone.href}>
                  <Phone className="size-5" aria-hidden />
                  {t("ctaSecondary")}
                </a>
              </Button>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
              <StarRating rating={5} />
              <span className="font-medium text-foreground">{t("trust")}</span>
            </div>
          </Reveal>
        </div>

        {/* Mascot with floating trust accents */}
        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <Mascot alt={t("mascotAlt")} priority className="mx-auto max-w-md" />

          {/* Rating accent */}
          <div className="animate-float absolute -top-4 -right-2 flex items-center gap-2.5 rounded-2xl border border-border bg-surface px-4 py-3 shadow-lg sm:-right-4">
            <StarRating rating={5} starClassName="size-4" />
            <span className="text-xs font-semibold text-navy">
              {tt("rating")}
            </span>
          </div>

          {/* Veteran accent */}
          <div
            className="animate-float absolute -bottom-4 -left-2 flex items-center gap-2.5 rounded-2xl border border-border bg-surface px-4 py-3 shadow-lg sm:-left-4"
            style={{ animationDelay: "1.4s" }}
          >
            <span className="grid size-9 place-items-center rounded-xl bg-secondary text-royal">
              <ShieldCheck className="size-5" aria-hidden />
            </span>
            <span className="text-xs font-semibold text-navy">
              {tt("veteran")}
            </span>
          </div>
        </div>
      </Container>
    </section>
  );
}
