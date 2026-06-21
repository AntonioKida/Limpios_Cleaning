import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  align?: "center" | "left";
  /** Heading level for correct document outline (defaults to h2). */
  as?: "h1" | "h2" | "h3";
  className?: string;
  titleClassName?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  as: Heading = "h2",
  className,
  titleClassName,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex max-w-2xl flex-col gap-3",
        align === "center" ? "mx-auto items-center text-center" : "items-start text-left",
        className,
      )}
    >
      {eyebrow ? (
        <span className="inline-flex items-center gap-2.5 text-sm font-bold tracking-[0.1em] text-royal uppercase">
          <span aria-hidden className="h-0.5 w-7 bg-sky" />
          {eyebrow}
        </span>
      ) : null}
      <Heading
        className={cn(
          "font-heading text-4xl font-bold text-balance text-navy",
          titleClassName,
        )}
      >
        {title}
      </Heading>
      {subtitle ? (
        <p className="max-w-[60ch] text-lg text-pretty text-muted-foreground">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
