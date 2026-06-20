import { useTranslations } from "next-intl";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/reveal";
import { Icon } from "@/components/icon";
import { steps } from "@/content/home";

export function HowItWorks() {
  const t = useTranslations("Home.steps");

  return (
    <Section id="how-it-works" surface="cool">
      <SectionHeading
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
      />

      <ol className="relative mt-14 grid gap-10 sm:grid-cols-3 sm:gap-8">
        {/* Connecting line (desktop) */}
        <div
          aria-hidden
          className="absolute top-8 right-[16%] left-[16%] hidden h-px bg-gradient-to-r from-transparent via-border to-transparent sm:block"
        />
        {steps.map((step, i) => (
          <li key={step.id}>
            <Reveal
              delay={i * 0.1}
              className="flex flex-col items-center gap-4 text-center"
            >
              <div className="relative grid size-16 place-items-center rounded-2xl bg-surface text-royal shadow-sm ring-1 ring-border">
                <Icon name={step.icon} className="size-7" />
                <span className="absolute -top-2 -right-2 grid size-7 place-items-center rounded-full bg-cta text-xs font-bold text-cta-foreground shadow">
                  {step.n}
                </span>
              </div>
              <h3 className="font-heading text-xl font-semibold text-navy">
                {t(`items.${step.id}.title`)}
              </h3>
              <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
                {t(`items.${step.id}.description`)}
              </p>
            </Reveal>
          </li>
        ))}
      </ol>
    </Section>
  );
}
