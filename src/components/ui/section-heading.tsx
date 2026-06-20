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
        <span className="inline-flex items-center gap-2 text-sm font-semibold tracking-wide text-royal uppercase">
          <span aria-hidden className="h-px w-6 bg-sky/60" />
          {eyebrow}
        </span>
      ) : null}
      <Heading
        className={cn(
          "font-heading text-3xl font-bold tracking-tight text-balance text-navy sm:text-4xl",
          titleClassName,
        )}
      >
        {title}
      </Heading>
      {subtitle ? (
        <p className="text-base text-pretty text-muted-foreground sm:text-lg">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
