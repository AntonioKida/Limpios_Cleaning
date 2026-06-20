import { cn } from "@/lib/utils";

/**
 * Brand lockup: a crisp SVG badge (the placeholder simplified mark) + the
 * "Limpios" wordmark set in the heading font. The gaming-style logotype from the
 * raster logo is intentionally NOT used as a UI font (per brand guidance).
 * TODO: swap the SVG badge for the client's real vector/simplified mark.
 */
export function Logo({
  tone = "color",
  withWordmark = true,
  className,
  badgeClassName,
}: {
  tone?: "color" | "white";
  withWordmark?: boolean;
  className?: string;
  badgeClassName?: string;
}) {
  const isWhite = tone === "white";
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <svg
        viewBox="0 0 32 32"
        className={cn("size-8 shrink-0", badgeClassName)}
        fill="none"
        aria-hidden
      >
        <rect
          width="32"
          height="32"
          rx="7"
          fill={isWhite ? "rgba(255,255,255,0.12)" : "#0A2359"}
          stroke={isWhite ? "rgba(255,255,255,0.45)" : "none"}
          strokeWidth="1"
        />
        <path
          d="M12 8 V21 H21"
          stroke={isWhite ? "#FFFFFF" : "#5ED7F4"}
          strokeWidth="3.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="22.6" cy="9.8" r="2.2" fill="#F47B20" />
      </svg>
      {withWordmark ? (
        <span
          className={cn(
            "font-heading text-xl leading-none font-bold tracking-tight",
            isWhite ? "text-white" : "text-navy",
          )}
        >
          Limpios
        </span>
      ) : null}
    </span>
  );
}
