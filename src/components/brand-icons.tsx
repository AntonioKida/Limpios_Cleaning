import { cn } from "@/lib/utils";

/**
 * Brand-specific line icons drawn from the Limpios logo motifs (Panama hat,
 * spray bottle, sparkle) — not stock lucide. Consistent 24×24 / 1.8 stroke so
 * they sit alongside lucide where needed. Used in the hero and key sections to
 * de-default the iconography.
 */
export type BrandIconName = "hat" | "spray" | "sparkle" | "shield";

const PATHS: Record<BrandIconName, React.ReactNode> = {
  // Panama hat (the mascot's hat)
  hat: (
    <>
      <path d="M7.2 14c-.5-3.6 1.4-7.2 4.8-7.2S17.3 10.4 16.8 14" />
      <path d="M3.6 14.4c1.9 1.3 5 2 8.4 2s6.5-.7 8.4-2" />
      <path d="M5 14.2c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5" />
      <path d="M8 13.1c2.6.5 5.4.5 8 0" />
    </>
  ),
  // Spray bottle
  spray: (
    <>
      <path d="M9.6 9.7h4.2a1 1 0 0 1 1 1V19a1.5 1.5 0 0 1-1.5 1.5h-2.8A1.5 1.5 0 0 1 8.6 19v-8.3a1 1 0 0 1 1-1z" />
      <path d="M10.4 9.7V7h3.1" />
      <path d="M13.5 7l2.3-1.3" />
      <path d="M13.5 8.4h3.4" />
      <path d="M18.3 6.6l1.6-.9M18.8 8.5l1.8-.1M18.5 10.4l1.4.9" />
    </>
  ),
  // Sparkle / shine
  sparkle: (
    <>
      <path d="M11.5 3.5l1.7 4.8 4.8 1.7-4.8 1.7-1.7 4.8-1.7-4.8L5 10l4.8-1.7z" />
      <path d="M18.4 15.3l.7 1.9 1.9.7-1.9.7-.7 1.9-.7-1.9-1.9-.7 1.9-.7z" />
    </>
  ),
  // Shield (veteran)
  shield: (
    <>
      <path d="M12 3.2l6.8 2.3v5.1c0 4.3-2.9 7.4-6.8 8.8-3.9-1.4-6.8-4.5-6.8-8.8V5.5z" />
      <path d="M9.3 11.8l2 2 3.6-3.9" />
    </>
  ),
};

export function BrandIcon({
  name,
  className,
}: {
  name: BrandIconName;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("size-6", className)}
      aria-hidden
    >
      {PATHS[name]}
    </svg>
  );
}
