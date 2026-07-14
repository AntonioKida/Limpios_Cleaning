import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Brand lockup: the navy spray-bottle "L" badge (public/brand/logo-l.png) + the
 * "Limpios" wordmark set in the heading font. The badge is a self-contained mark
 * that reads on both the light header and the navy footer. The gaming-style
 * logotype from the raster logo is intentionally NOT used as a UI font.
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
      <Image
        src="/brand/logo-l.png"
        alt=""
        width={32}
        height={32}
        className={cn("size-8 shrink-0 object-contain", badgeClassName)}
      />
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
