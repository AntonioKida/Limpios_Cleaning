import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { BeforeAfterSlider } from "./before-after-slider";
import type { GalleryPair } from "@/content/gallery";

/**
 * Before/after grid. Leads with the dramatic-but-clean `lead` pairs; any `more`
 * pairs sit behind a native `<details>` "See more transformations" disclosure
 * (works without JS, keyboard-accessible, no ARIA wiring needed) so the gunkier
 * shots aren't front-loaded but stay reachable. Captions come from Home.beforeAfter.
 *
 * Aspect: the source halves are all 9:16-ish portrait (split from pre-composited
 * squares), so we present them PORTRAIT (3:4) — never landscape-cropped, which
 * would butcher the genuinely vertical pairs (tub, shower, fridge drawer). True
 * per-image aspect ratios (some wide) need Papo's separate hi-res originals (§5).
 */
export function GalleryGrid({
  lead,
  more = [],
}: {
  lead: GalleryPair[];
  more?: GalleryPair[];
}) {
  const t = useTranslations("Home.beforeAfter");

  const card = (pair: GalleryPair) => {
    const caption = t(`captions.${pair.id}`);
    return (
      <figure key={pair.id} className="flex flex-col gap-3">
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
        <figcaption className="font-heading text-sm font-semibold text-navy">
          {caption}
        </figcaption>
      </figure>
    );
  };

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {lead.map(card)}
      </div>

      {more.length > 0 ? (
        <details className="group mt-8">
          <summary className="mx-auto flex w-fit cursor-pointer list-none items-center gap-2 rounded-full border border-border bg-surface px-5 py-2.5 text-sm font-semibold text-royal shadow-sm transition-colors hover:border-sky/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
            <span className="group-open:hidden">{t("seeMore")}</span>
            <span className="hidden group-open:inline">{t("seeLess")}</span>
            <ChevronDown
              className="size-4 transition-transform group-open:rotate-180"
              aria-hidden
            />
          </summary>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {more.map(card)}
          </div>
        </details>
      ) : null}
    </>
  );
}
