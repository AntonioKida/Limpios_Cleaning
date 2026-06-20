import { cn } from "@/lib/utils";
import { Container } from "./container";

type Surface = "cool" | "white" | "navy" | "none";

const surfaceClass: Record<Surface, string> = {
  cool: "bg-cool",
  white: "bg-surface",
  navy: "bg-navy text-white",
  none: "",
};

interface SectionProps {
  id?: string;
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
  surface?: Surface;
  /** Wrap children in a max-width Container (default true). */
  container?: boolean;
  "aria-label"?: string;
  "aria-labelledby"?: string;
}

/** Consistent vertical rhythm + background surface for page sections. */
export function Section({
  id,
  children,
  className,
  innerClassName,
  surface = "none",
  container = true,
  ...aria
}: SectionProps) {
  const inner = container ? (
    <Container className={innerClassName}>{children}</Container>
  ) : (
    children
  );
  return (
    <section
      id={id}
      className={cn(
        "scroll-mt-24 py-16 sm:py-20 lg:py-24",
        surfaceClass[surface],
        className,
      )}
      {...aria}
    >
      {inner}
    </section>
  );
}
