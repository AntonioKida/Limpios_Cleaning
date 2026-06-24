"use client";

import { useEffect, useRef } from "react";

interface Props {
  src: string;
  poster: string;
  /** Accessible name for the clip. */
  label: string;
  className?: string;
}

/**
 * Self-hosted, chrome-free hero accent: a muted, looping `<video>` with a poster.
 * No `autoPlay` attribute — the poster shows on the server / with no JS, and we
 * only call `.play()` after mount when the user hasn't asked for reduced motion
 * (so reduced-motion users get a still poster, never an autoplaying clip).
 * Silent footage, so no captions track is needed.
 */
export function HeroVideo({ src, poster, label, className }: Props) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduce) video.play().catch(() => {});
  }, []);

  return (
    <video
      ref={ref}
      poster={poster}
      muted
      loop
      playsInline
      preload="metadata"
      aria-label={label}
      className={className}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
