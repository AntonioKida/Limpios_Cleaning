import { useTranslations } from "next-intl";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { HeroVideo } from "@/components/sections/hero-video";
import { heroVideo, heroVideoSrc } from "@/content/media";

/**
 * A deliberate "see us in action" showcase: the self-hosted, chrome-free Vid4
 * (muted autoplay loop; poster + no autoplay under reduced-motion / no-JS) as a
 * single centered 9:16 portrait with breathing room. Lives below the hero on the
 * warm-neutral surface so it reads as its own moment, not a card crammed next to
 * the mascot.
 */
export function SeeInAction() {
  const t = useTranslations("Home.seeInAction");
  const tv = useTranslations("Video");

  return (
    <Section id="see-in-action" surface="cool">
      <SectionHeading
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
      />
      <div className="mt-10 flex justify-center">
        <figure className="w-full max-w-[17rem]">
          <div className="aspect-[9/16] overflow-hidden rounded-3xl border-4 border-surface bg-navy shadow-xl ring-1 ring-black/5">
            <HeroVideo
              src={heroVideoSrc}
              poster={heroVideo.poster}
              label={tv(`captions.${heroVideo.id}`)}
              className="size-full object-cover"
            />
          </div>
        </figure>
      </div>
    </Section>
  );
}
