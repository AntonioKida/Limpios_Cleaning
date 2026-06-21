import { useTranslations } from "next-intl";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { Icon } from "@/components/icon";
import { BrandIcon, type BrandIconName } from "@/components/brand-icons";
import { steps } from "@/content/home";

// Mix brand-drawn + lucide icons (the "clean" step gets the brand spray bottle).
const STEP_ICON: Record<string, { brand?: BrandIconName; lucide?: "CalendarCheck" | "Smile" }> = {
  quote: { lucide: "CalendarCheck" },
  clean: { brand: "spray" },
  relax: { lucide: "Smile" },
};

export function HowItWorks() {
  const t = useTranslations("Home.steps");

  return (
    <Section id="how-it-works" surface="cool">
      <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        {/* Editorial: heading sits to the left, list flows to the right. */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading
            align="left"
            eyebrow={t("eyebrow")}
            title={t("title")}
            subtitle={t("subtitle")}
          />
        </div>

        <ol className="flex flex-col">
          {steps.map((step) => {
            const ic = STEP_ICON[step.id];
            return (
              <li
                key={step.id}
                className="flex gap-5 border-t border-border py-8 first:border-t-0 first:pt-0 sm:gap-7"
              >
                <span className="font-heading text-5xl leading-none font-bold tabular-nums text-border">
                  {String(step.n).padStart(2, "0")}
                </span>
                <div className="flex-1 pt-1">
                  <div className="flex items-center gap-3">
                    <span className="text-royal">
                      {ic.brand ? (
                        <BrandIcon name={ic.brand} className="size-6" />
                      ) : (
                        <Icon name={ic.lucide!} className="size-6" />
                      )}
                    </span>
                    <h3 className="font-heading text-xl font-bold text-navy">
                      {t(`items.${step.id}.title`)}
                    </h3>
                  </div>
                  <p className="mt-2 max-w-md leading-relaxed text-muted-foreground">
                    {t(`items.${step.id}.description`)}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </Section>
  );
}
