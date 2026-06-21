import type { Metadata } from "next";
import { Play } from "lucide-react";
import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { buildMetadata } from "@/lib/metadata";
import { PageHero } from "@/components/sections/page-hero";
import { Section } from "@/components/ui/section";
import { Mascot } from "@/components/brand/mascot";
import { Icon } from "@/components/icon";
import { CTASection } from "@/components/sections/cta-section";
import { valueCards } from "@/content/founder";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Meta.pages.about" });
  return buildMetadata({
    title: t("title"),
    description: t("description"),
    locale,
    path: "/about",
  });
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("About");
  const th = await getTranslations("Home.hero");

  const story = t.raw("story.body") as string[];

  return (
    <main id="main-content">
      <PageHero
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
      />

      {/* Story */}
      <Section surface="white">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="relative mx-auto w-full max-w-sm">
            {/* The mascot is a caricature of the owner. TODO: add a real photo. */}
            <Mascot alt={th("mascotAlt")} sizes="(max-width: 1024px) 80vw, 36vw" />
          </div>
          <div className="flex flex-col gap-4">
            <h2 className="font-heading text-2xl font-bold text-navy sm:text-3xl">
              {t("story.title")}
            </h2>
            {story.map((para, i) => (
              <p key={i} className="leading-relaxed text-pretty text-muted-foreground">
                {para}
              </p>
            ))}
          </div>
        </div>
      </Section>

      {/* Mission + Eco */}
      <Section surface="cool">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-border bg-surface p-8">
            <h2 className="font-heading text-xl font-bold text-navy">
              {t("mission.title")}
            </h2>
            <p className="mt-3 leading-relaxed text-pretty text-muted-foreground">
              {t("mission.body")}
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-8">
            <h2 className="flex items-center gap-2 font-heading text-xl font-bold text-navy">
              <span className="grid size-9 place-items-center rounded-lg bg-secondary text-royal">
                <Icon name="Leaf" className="size-5" />
              </span>
              {t("eco.title")}
            </h2>
            <p className="mt-3 leading-relaxed text-pretty text-muted-foreground">
              {t("eco.body")}
            </p>
          </div>
        </div>
      </Section>

      {/* Values */}
      <Section surface="white">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {valueCards.map((value) => (
            <div
              key={value.id}
              className="flex flex-col gap-3 rounded-2xl border border-border bg-cool/50 p-6"
            >
              <span className="grid size-12 place-items-center rounded-xl bg-secondary text-royal">
                <Icon name={value.icon} className="size-6" />
              </span>
              <h3 className="font-heading font-semibold text-navy">
                {t(`values.${value.id}.title`)}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {t(`values.${value.id}.description`)}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* Team + Video */}
      <Section surface="cool">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col gap-4">
            <h2 className="font-heading text-2xl font-bold text-navy sm:text-3xl">
              {t("team.title")}
            </h2>
            <p className="leading-relaxed text-pretty text-muted-foreground">
              {t("team.body")}
            </p>
            {/* TODO: add real team photos + bios. */}
            <p className="text-xs text-muted-foreground">
              {t("team.placeholderNote")}
            </p>
          </div>
          <div className="relative aspect-video overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-royal to-navy shadow-xl ring-1 ring-white/10">
            <div
              aria-hidden
              className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,color-mix(in_srgb,var(--sky)_30%,transparent),transparent_55%)]"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center text-white">
              <span className="grid size-16 place-items-center rounded-full bg-white/15 ring-1 ring-white/30 backdrop-blur">
                <Play className="size-7 translate-x-0.5 fill-white" aria-hidden />
              </span>
              <div>
                <p className="font-heading text-lg font-semibold">
                  {t("video.title")}
                </p>
                {/* TODO: embed the real founder video here. */}
                <p className="mt-1 text-sm text-cool/70">{t("video.comingSoon")}</p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <CTASection title={t("cta.title")} subtitle={t("cta.body")} primaryLabel={t("cta.button")} />
    </main>
  );
}
