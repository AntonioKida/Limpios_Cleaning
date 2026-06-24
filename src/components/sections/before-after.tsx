import { useTranslations } from "next-intl";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/reveal";
import { BeforeAfterSlider } from "./before-after-slider";
import { homepageGallery } from "@/content/gallery";

export function BeforeAfterGallery() {
  const t = useTranslations("Home.beforeAfter");

  return (
    <Section id="before-after" surface="cool">
      <SectionHeading
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
      />

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {homepageGallery.map((pair, i) => {
          const caption = t(`captions.${pair.id}`);
          return (
            <Reveal key={pair.id} delay={i * 0.06} className="flex flex-col gap-3">
              <BeforeAfterSlider
                before={pair.before}
                after={pair.after}
                aspect="3 / 4"
                beforeAlt={`${t("beforeLabel")} — ${caption}`}
                afterAlt={`${t("afterLabel")} — ${caption}`}
                beforeLabel={t("beforeLabel")}
                afterLabel={t("afterLabel")}
                dragHint={t("dragHint")}
              />
              <p className="font-heading text-sm font-semibold text-navy">
                {caption}
              </p>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
