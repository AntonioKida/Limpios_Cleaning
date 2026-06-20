import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

/** Decorative star row with an accessible label. */
export function StarRating({
  rating = 5,
  className,
  starClassName,
  label,
}: {
  rating?: number;
  className?: string;
  starClassName?: string;
  label?: string;
}) {
  return (
    <span
      className={cn("inline-flex items-center gap-0.5", className)}
      role="img"
      aria-label={label ?? `${rating} out of 5 stars`}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          aria-hidden
          className={cn(
            "size-4",
            i < Math.round(rating)
              ? "fill-[#f5a623] text-[#f5a623]"
              : "fill-none text-border",
            starClassName,
          )}
        />
      ))}
    </span>
  );
}
