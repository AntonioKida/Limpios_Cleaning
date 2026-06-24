import { Phone, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";
import { Mascot } from "@/components/brand/mascot";
import { HeroVideo } from "@/components/sections/hero-video";
import { QuoteCTA } from "@/components/quote/quote-cta";
import { StarRating } from "@/components/star-rating";
import { site } from "@/content/site";
import { heroVideo, heroVideoSrc } from "@/content/media";

export function Hero() {
  const t = useTranslations("Home.hero");
  const tv = useTranslations("Video");

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
              <QuoteCTA size="2xl" withIcon className="w-full sm:w-auto" location="hero" />
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

        {/* Mascot (brand anchor) + a contained, chrome-free real-footage accent. */}
        <div className="mx-auto w-full max-w-md lg:max-w-none">
          <div className="flex flex-col items-center gap-6 lg:flex-row lg:items-end lg:justify-center lg:gap-5">
            {/* Mascot with the anchored rating chip */}
            <div className="relative w-full max-w-xs sm:max-w-sm lg:max-w-none lg:flex-1">
              <Mascot alt={t("mascotAlt")} priority className="mx-auto w-full" />
              <div className="absolute -top-3 right-1 flex items-center gap-2.5 rounded-xl bg-navy px-4 py-2.5 shadow-md ring-1 ring-white/10">
                <StarRating rating={5} starClassName="size-4" />
                <span className="text-sm font-semibold text-white">
                  {t("chipRating")}
                </span>
              </div>
            </div>

            {/* Real-footage portrait accent — self-hosted muted loop, no chrome */}
            <figure className="w-36 shrink-0 sm:w-44 lg:w-36">
              <div className="aspect-[9/16] overflow-hidden rounded-2xl border-4 border-surface bg-navy shadow-xl ring-1 ring-black/5">
                <HeroVideo
                  src={heroVideoSrc}
                  poster={heroVideo.poster}
                  label={tv(`captions.${heroVideo.id}`)}
                  className="size-full object-cover"
                />
              </div>
            </figure>
          </div>
        </div>
      </Container>
    </section>
  );
}
