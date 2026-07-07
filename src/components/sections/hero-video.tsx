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
 * Self-hosted, chrome-free accent: a muted, looping `<video>` with a poster.
 * `preload="none"` + no `autoPlay` — the poster shows on the server / with no JS
 * and nothing downloads until needed. It only plays (and thus loads) once it
 * scrolls into view AND the user hasn't asked for reduced motion, so the ~3MB
 * clip never competes with the initial page load and reduced-motion users get a
 * still poster. Pauses when scrolled away. Silent footage → no captions track.
 */
export function HeroVideo({ src, poster, label, className }: Props) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.25 },
    );
    io.observe(video);
    return () => io.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      aria-label={label}
      className={className}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
