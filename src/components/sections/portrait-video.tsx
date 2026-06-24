"use client";

import { useState } from "react";
import Image from "next/image";
import { useLocale } from "next-intl";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";
import type { VideoProvider } from "@/content/media";

interface Props {
  poster: string;
  /** youtube-nocookie / vimeo embed URL. Absent → poster renders as a still. */
  url?: string;
  provider?: VideoProvider;
  /** Visible + accessible label for the clip. */
  caption: string;
  playLabel: string;
  /** Force EN/ES captions on the embed (spoken clips). */
  spokenCaptions?: boolean;
  /** Hide the figcaption + shrink the play button (e.g. hero accent). */
  compact?: boolean;
  className?: string;
  sizes?: string;
}

/**
 * 9:16 portrait video presented as a lightweight click-to-load facade: the
 * committed poster shows immediately (blur-free, lazy, never blocks LCP and never
 * autoplays — reduced-motion safe), and the streamed player (YouTube-nocookie /
 * Vimeo) only mounts on click. With no URL yet the poster is a clean still with a
 * decorative play glyph — no dead control, no "coming soon" text.
 */
export function PortraitVideo({
  poster,
  url,
  provider = "youtube",
  caption,
  playLabel,
  spokenCaptions = false,
  compact = false,
  className,
  sizes = "(max-width: 640px) 80vw, (max-width: 1024px) 40vw, 22vw",
}: Props) {
  const locale = useLocale();
  const [playing, setPlaying] = useState(false);
  const playable = Boolean(url);

  const join = (base: string, params: string) =>
    `${base}${base.includes("?") ? "&" : "?"}${params}`;
  const embedSrc = !url
    ? ""
    : provider === "youtube"
      ? join(
          url,
          `autoplay=1&rel=0&modestbranding=1&playsinline=1${
            spokenCaptions ? `&cc_load_policy=1&cc_lang_pref=${locale}` : ""
          }`,
        )
      : join(url, `autoplay=1${spokenCaptions ? "&texttrack=" + locale : ""}`);

  const circle = compact ? "size-12" : "size-16";
  const glyph = compact ? "size-5" : "size-7";

  return (
    <figure className={cn("flex flex-col gap-3", className)}>
      <div className="relative aspect-[9/16] overflow-hidden rounded-2xl border border-border bg-navy shadow-md ring-1 ring-black/5">
        {playing && playable ? (
          <iframe
            src={embedSrc}
            title={caption}
            allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
            allowFullScreen
            loading="lazy"
            className="absolute inset-0 size-full"
          />
        ) : (
          <>
            <Image
              src={poster}
              alt={caption}
              fill
              sizes={sizes}
              className="object-cover"
            />
            {playable ? (
              <button
                type="button"
                onClick={() => setPlaying(true)}
                aria-label={`${playLabel}: ${caption}`}
                className="group/btn absolute inset-0 grid place-items-center bg-navy/5 transition-colors hover:bg-navy/15 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-inset"
              >
                <span
                  className={cn(
                    "grid place-items-center rounded-full bg-white/90 text-royal shadow-lg ring-1 ring-black/10 transition-transform group-hover/btn:scale-105",
                    circle,
                  )}
                >
                  <Play className={cn("translate-x-0.5 fill-current", glyph)} aria-hidden />
                </span>
              </button>
            ) : (
              // No URL yet → decorative glyph signals "video", not a dead control.
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 grid place-items-center"
              >
                <span
                  className={cn(
                    "grid place-items-center rounded-full bg-white/85 text-royal shadow-lg ring-1 ring-black/10",
                    circle,
                  )}
                >
                  <Play className={cn("translate-x-0.5 fill-current", glyph)} />
                </span>
              </span>
            )}
          </>
        )}
      </div>
      {!compact ? (
        <figcaption className="text-sm font-medium text-navy">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
