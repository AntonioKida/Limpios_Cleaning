import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

/** A list of strings rendered with brand check bullets. */
export function CheckList({
  items,
  className,
  columns = 1,
}: {
  items: string[];
  className?: string;
  columns?: 1 | 2;
}) {
  return (
    <ul
      className={cn(
        "grid gap-3",
        columns === 2 ? "sm:grid-cols-2" : "",
        className,
      )}
    >
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3">
          <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-secondary text-royal">
            <Check className="size-3.5" aria-hidden strokeWidth={3} />
          </span>
          <span className="text-sm leading-relaxed text-foreground">{item}</span>
        </li>
      ))}
    </ul>
  );
}
