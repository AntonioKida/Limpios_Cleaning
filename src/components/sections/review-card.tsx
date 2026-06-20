import { Quote } from "lucide-react";
import { StarRating } from "@/components/star-rating";
import { cn } from "@/lib/utils";

/** Presentational testimonial card. Quote text is passed in (resolved by the
 *  parent), so the card stays reusable across the homepage and reviews page. */
export function ReviewCard({
  name,
  city,
  rating,
  quote,
  className,
}: {
  name: string;
  city: string;
  rating: number;
  quote: string;
  className?: string;
}) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");

  return (
    <figure
      className={cn(
        "flex h-full flex-col gap-4 rounded-2xl border border-border bg-surface p-6 shadow-sm",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <Quote className="size-7 text-sky/50" aria-hidden />
        <StarRating rating={rating} />
      </div>
      <blockquote className="flex-1 text-[0.95rem] leading-relaxed text-foreground">
        {quote}
      </blockquote>
      <figcaption className="flex items-center gap-3 border-t border-border pt-4">
        <span
          aria-hidden
          className="grid size-10 place-items-center rounded-full bg-secondary font-heading text-sm font-bold text-royal"
        >
          {initials}
        </span>
        <span className="flex flex-col">
          <span className="font-semibold text-navy">{name}</span>
          <span className="text-sm text-muted-foreground">{city}</span>
        </span>
      </figcaption>
    </figure>
  );
}
