"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * The one signature entrance (hero). Lightweight IntersectionObserver + CSS
 * transition — no animation library (framer-motion was ~90KB of client JS for
 * this single effect). Renders `data-reveal` so the `@media (scripting: none)`
 * safety net keeps it visible with no JS; under reduced-motion it shows instantly.
 */
export function SignatureReveal({
  children,
  className,
  delay = 0,
  y = 14,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Reveal when in view. Under prefers-reduced-motion the global CSS rule makes
    // the transition instant, so the observer covers both cases (no synchronous
    // setState needed) and no-JS is handled by the `scripting: none` safety net.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -60px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-reveal
      className={cn(
        "transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
        className,
      )}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "none" : `translateY(${y}px)`,
        transitionDelay: shown ? `${delay}s` : "0s",
      }}
    >
      {children}
    </div>
  );
}
