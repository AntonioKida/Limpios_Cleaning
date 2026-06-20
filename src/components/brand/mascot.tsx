import Image from "next/image";
import mascot from "@/assets/mascot.jpeg";
import { cn } from "@/lib/utils";

/**
 * The Limpios mascot, framed on a navy backing so the source image's dark
 * background reads as an intentional emblem against the airy, light layout —
 * the deliberate "playful mascot in a calm frame" contrast.
 * TODO: replace with a transparent-background PNG of the mascot when available.
 */
export function Mascot({
  alt,
  priority = false,
  className,
  sizes = "(max-width: 768px) 75vw, 38vw",
}: {
  alt: string;
  priority?: boolean;
  className?: string;
  sizes?: string;
}) {
  return (
    <div
      className={cn(
        "relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-navy shadow-xl ring-1 ring-white/10",
        className,
      )}
    >
      <Image
        src={mascot}
        alt={alt}
        fill
        priority={priority}
        placeholder="blur"
        sizes={sizes}
        className="object-cover"
      />
    </div>
  );
}
