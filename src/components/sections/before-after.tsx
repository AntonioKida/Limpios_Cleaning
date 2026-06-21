import Image from "next/image";
import { useTranslations } from "next-intl";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/reveal";
import { beforeAfterPairs } from "@/content/gallery";

export function BeforeAfterGallery() {
  const t = useTranslations("Home.beforeAfter");

  return (
    <Section id="before-after" surface="cool">
      <SectionHeading
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
      />

      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {beforeAfterPairs.map((pair, i) => {
          const title = t(`items.${pair.id}.title`);
          return (
            <Reveal key={pair.id} delay={i * 0.08} className="h-full">
              <figure className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
                <div className="grid grid-cols-2">
                  {(
                    [
                      { src: pair.before, label: t("beforeLabel"), tone: "before" },
                      { src: pair.after, label: t("afterLabel"), tone: "after" },
                    ] as const
                  ).map((side) => (
                    <div
                      key={side.tone}
                      className="relative aspect-[4/3] border-border first:border-r"
                    >
                      <Image
                        src={side.src}
                        alt={`${side.label} — ${title} (${t("placeholderNote")})`}
                        fill
                        unoptimized
                        sizes="(max-width: 768px) 50vw, 18vw"
                        className="object-cover"
                      />
                      <span
                        className={
                          "absolute top-2 left-2 rounded-full px-2.5 py-0.5 text-xs font-bold tracking-wide uppercase " +
                          (side.tone === "after"
                            ? "bg-cta text-cta-foreground"
                            : "bg-navy/80 text-white")
                        }
                      >
                        {side.label}
                      </span>
                    </div>
                  ))}
                </div>
                <figcaption className="border-t border-border px-5 py-3.5 font-heading text-sm font-semibold text-navy">
                  {title}
                </figcaption>
              </figure>
            </Reveal>
          );
        })}
      </div>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        {/* Placeholder disclaimer — replace with real before/after photos. */}
        {t("placeholderNote")}
      </p>
    </Section>
  );
}
