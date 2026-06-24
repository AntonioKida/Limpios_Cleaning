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

  return (
    <section className="relative isolate overflow-hidden bg-cool">
      {/* Flat shield-grid motif (no radial glow). */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.55] [mask-image:linear-gradient(to_bottom,black,transparent_85%)] [background-image:linear-gradient(var(--border)_1px,transparent_1px),linear-gradient(90deg,var(--border)_1px,transparent_1px)] [background-size:64px_64px]"
      />

      <Container className="grid items-center gap-12 py-16 sm:py-20 lg:grid-cols-2 lg:gap-16 lg:py-24">
        {/* Copy — the one signature entrance on the site. */}
        <div className="flex flex-col items-start gap-6 text-left">
          <Reveal signature>
            <span className="inline-flex items-center gap-2 rounded-full border border-sky/30 bg-surface px-3.5 py-1.5 text-sm font-semibold text-royal shadow-sm">
              <ShieldCheck className="size-4 text-sky" aria-hidden />
              {t("eyebrow")}
            </span>
          </Reveal>

          <h1 className="font-heading text-6xl font-bold text-balance text-navy">
            {t("title")} <span className="text-royal">{t("titleAccent")}</span>
          </h1>

          <p className="max-w-xl text-lg leading-relaxed text-pretty text-muted-foreground">
            {t("subtitle")}
          </p>

          <Reveal signature delay={0.1} className="w-full">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <QuoteCTA size="2xl" withIcon className="w-full sm:w-auto" />
              <Button asChild variant="outline" size="2xl" className="w-full sm:w-auto">
                <a href={site.phone.href}>
                  <Phone className="size-5" aria-hidden />
                  {t("ctaSecondary")}
                </a>
              </Button>
            </div>
          </Reveal>

          <Reveal signature delay={0.18}>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
              <StarRating rating={5} />
              <span className="font-medium text-foreground">{t("trust")}</span>
            </div>
          </Reveal>
        </div>

        {/* Mascot with anchored proof chips (solid, not glassy/floating). */}
        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <Mascot alt={t("mascotAlt")} priority className="mx-auto max-w-md" />

          {/* Rating chip — solid navy, anchored top-right */}
          <div className="absolute -top-3 -right-1 flex items-center gap-2.5 rounded-xl bg-navy px-4 py-2.5 shadow-md ring-1 ring-white/10 sm:-right-4">
            <StarRating rating={5} starClassName="size-4" />
            <span className="text-sm font-semibold text-white">{t("chipRating")}</span>
          </div>
        </div>
      </Container>
    </section>
  );
}
