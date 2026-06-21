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
  /**
   * Motion restraint: reveals are STATIC by default. Pass `signature` only on
   * the one or two moments worth animating (the hero entrance, a key section).
   * Everything else stays still. Honors `prefers-reduced-motion` (static) and
   * no-JS (the `@media (scripting: none)` rule keeps [data-reveal] visible).
   */
  signature?: boolean;
}

export function Reveal({
  children,
  className,
  delay = 0,
  y = 14,
  once = true,
  signature = false,
}: RevealProps) {
  const reduceMotion = useReducedMotion();

  if (!signature || reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      data-reveal
      className={cn(className)}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-60px" }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
