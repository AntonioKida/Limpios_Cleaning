"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  /** Stagger helper — seconds of delay before this element animates. */
  delay?: number;
  /** Vertical travel distance in px. */
  y?: number;
  once?: boolean;
}

/**
 * Subtle scroll-reveal. Honors `prefers-reduced-motion` (renders static) and
 * falls back to fully visible when JavaScript is disabled (see the
 * `@media (scripting: none)` rule in globals.css targeting [data-reveal]).
 * Use for below-the-fold content only — never wrap the LCP hero element.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 18,
  once = true,
}: RevealProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      data-reveal
      className={cn(className)}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-80px" }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
