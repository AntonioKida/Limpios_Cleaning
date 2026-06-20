import { cn } from "@/lib/utils";

/** Centered max-width content wrapper with responsive gutters. */
export function Container({
  className,
  as: Tag = "div",
  ...props
}: React.ComponentProps<"div"> & { as?: React.ElementType }) {
  return (
    <Tag
      className={cn("mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8", className)}
      {...props}
    />
  );
}
