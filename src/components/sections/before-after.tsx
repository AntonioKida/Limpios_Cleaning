import { useTranslations } from "next-intl";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { GalleryGrid } from "./gallery-grid";
import { homepageLead, homepageMore } from "@/content/gallery";

export function BeforeAfterGallery() {
  const t = useTranslations("Home.beforeAfter");

  return (
    <Section id="before-after" surface="cool">
      <SectionHeading
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
      />
      <div className="mt-12">
        <GalleryGrid lead={homepageLead} more={homepageMore} />
      </div>
    </Section>
  );
}
