import { useTranslations } from "next-intl";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/reveal";
import { Icon } from "@/components/icon";
import { PortraitVideo } from "@/components/sections/portrait-video";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { whyPoints } from "@/content/home";
import { standardsVideo } from "@/content/media";
import { routes } from "@/lib/routes";

export function WhyUs() {
  const t = useTranslations("Home.why");
  const tp = useTranslations("Home.why.points");
  const tv = useTranslations("Video");

  return (
    <Section id="why" surface="white">
      <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="flex flex-col gap-8">
          <SectionHeading
            align="left"
            eyebrow={t("eyebrow")}
            title={t("title")}
            subtitle={t("subtitle")}
          />
          <div className="grid gap-5 sm:grid-cols-2">
            {whyPoints.map((point) => (
              <div
                key={point.id}
                className="flex gap-4 rounded-2xl border border-border bg-cool/60 p-5"
              >
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-secondary text-royal">
                  <Icon name={point.icon} className="size-5" />
                </span>
                <div className="flex flex-col gap-1">
                  <h3 className="font-heading font-semibold text-navy">
                    {tp(`${point.id}.title`)}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {tp(`${point.id}.description`)}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div>
            <Button asChild variant="outline" size="lg" className="h-11 px-6">
              <Link href={routes.about}>{t("ctaAbout")}</Link>
            </Button>
          </div>
        </div>

        {/* Real-footage standards clip — replaces the old founder placeholder. */}
        <Reveal delay={0.1} className="mx-auto w-full max-w-xs lg:sticky lg:top-28">
          <PortraitVideo
            poster={standardsVideo.poster}
            url={standardsVideo.url}
            provider={standardsVideo.provider}
            spokenCaptions={standardsVideo.spokenCaptions}
            caption={tv(`captions.${standardsVideo.id}`)}
            playLabel={tv("playLabel")}
            sizes="(max-width: 1024px) 80vw, 320px"
          />
        </Reveal>
      </div>
    </Section>
  );
}
