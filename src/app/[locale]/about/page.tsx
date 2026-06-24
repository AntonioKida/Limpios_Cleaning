import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { buildMetadata } from "@/lib/metadata";
import { PageHero } from "@/components/sections/page-hero";
import { Section } from "@/components/ui/section";
import { Mascot } from "@/components/brand/mascot";
import { Icon } from "@/components/icon";
import { PortraitVideo } from "@/components/sections/portrait-video";
import { CTASection } from "@/components/sections/cta-section";
import { valueCards } from "@/content/founder";
import { teamVideo, standardsVideo } from "@/content/media";

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
  const tv = await getTranslations("Video");

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

      {/* Team + real footage (Vid7 human moment + Vid3 standards) */}
      <Section surface="cool">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col gap-4">
            <h2 className="font-heading text-2xl font-bold text-navy sm:text-3xl">
              {t("team.title")}
            </h2>
            <p className="leading-relaxed text-pretty text-muted-foreground">
              {t("team.body")}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-5">
            <PortraitVideo
              poster={teamVideo.poster}
              url={teamVideo.url}
              provider={teamVideo.provider}
              spokenCaptions={teamVideo.spokenCaptions}
              caption={tv(`captions.${teamVideo.id}`)}
              playLabel={tv("playLabel")}
              sizes="(max-width: 1024px) 45vw, 22vw"
            />
            <PortraitVideo
              poster={standardsVideo.poster}
              url={standardsVideo.url}
              provider={standardsVideo.provider}
              spokenCaptions={standardsVideo.spokenCaptions}
              caption={tv(`captions.${standardsVideo.id}`)}
              playLabel={tv("playLabel")}
              sizes="(max-width: 1024px) 45vw, 22vw"
            />
          </div>
        </div>
      </Section>

      <CTASection title={t("cta.title")} subtitle={t("cta.body")} primaryLabel={t("cta.button")} />
    </main>
  );
}
