"use client";

import { useState } from "react";
import Image from "next/image";
import { MoveHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImgSide {
  src: string;
  blurDataURL: string;
}

interface Props {
  before: ImgSide;
  after: ImgSide;
  /** CSS aspect-ratio for the box (reserves space → no CLS). Both halves are
   *  object-cover, so they crop identically and stay aligned. */
  aspect?: string;
  beforeAlt: string;
  afterAlt: string;
  beforeLabel: string;
  afterLabel: string;
  dragHint: string;
  sizes?: string;
  className?: string;
}

/**
 * Draggable before/after wipe comparison. A full-size, transparent
 * `input[type=range]` drives the divider, which gives mouse-drag, click-to-jump,
 * touch, AND keyboard (arrow keys) for free, with a proper slider role + label.
 * Renders at 50% on the server, so with no JS the comparison is still visible
 * (both halves shown, labelled). No motion is auto-played (reduced-motion safe);
 * fixed aspect-ratio box + blur placeholders mean no CLS.
 */
export function BeforeAfterSlider({
  before,
  after,
  aspect = "3 / 4",
  beforeAlt,
  afterAlt,
  beforeLabel,
  afterLabel,
  dragHint,
  sizes = "(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw",
  className,
}: Props) {
  const [pos, setPos] = useState(50);

  return (
    <div
      className={cn(
        "group relative isolate touch-none overflow-hidden rounded-2xl border border-border bg-muted select-none",
        className,
      )}
      style={{ aspectRatio: aspect }}
    >
      {/* AFTER (base layer) */}
      <Image
        src={after.src}
        alt={afterAlt}
        fill
        sizes={sizes}
        placeholder="blur"
        blurDataURL={after.blurDataURL}
        className="object-cover"
      />

      {/* BEFORE (clipped to the left `pos`%) */}
      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      >
        <Image
          src={before.src}
          alt={beforeAlt}
          fill
          sizes={sizes}
          placeholder="blur"
          blurDataURL={before.blurDataURL}
          className="object-cover"
        />
      </div>

      {/* Labels */}
      <span className="pointer-events-none absolute top-2.5 left-2.5 rounded-full bg-navy/80 px-2.5 py-0.5 text-xs font-bold tracking-wide text-white uppercase">
        {beforeLabel}
      </span>
      <span className="pointer-events-none absolute top-2.5 right-2.5 rounded-full bg-cta px-2.5 py-0.5 text-xs font-bold tracking-wide text-cta-foreground uppercase">
        {afterLabel}
      </span>

      {/* Range input — the actual control. Transparent + full-size; gives
          drag/click/touch/keyboard. `peer` so the handle can show focus. */}
      <input
        type="range"
        min={0}
        max={100}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        aria-label={`${dragHint} — ${beforeAlt}`}
        className="peer absolute inset-0 z-20 m-0 h-full w-full cursor-ew-resize appearance-none bg-transparent opacity-0"
      />

      {/* Divider line (sibling of the input) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 z-10 w-0.5 -translate-x-1/2 bg-white shadow-[0_0_0_1px_rgba(10,35,89,0.15)]"
        style={{ left: `${pos}%` }}
      />
      {/* Handle — sibling of the input so it can reflect keyboard focus */}
      <span
        aria-hidden
        className="pointer-events-none absolute top-1/2 z-10 grid size-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-royal shadow-md ring-1 ring-black/10 transition-transform group-hover:scale-105 peer-focus-visible:ring-2 peer-focus-visible:ring-ring"
        style={{ left: `${pos}%` }}
      >
        <MoveHorizontal className="size-5" />
      </span>

      {/* Drag hint, fades once the user interacts */}
      <span className="pointer-events-none absolute bottom-2.5 left-1/2 z-10 -translate-x-1/2 rounded-full bg-surface/85 px-3 py-1 text-xs font-semibold text-navy shadow-sm backdrop-blur transition-opacity group-hover:opacity-0 peer-focus-visible:opacity-0">
        {dragHint}
      </span>
    </div>
  );
}
