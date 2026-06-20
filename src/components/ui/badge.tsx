import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full text-xs font-semibold whitespace-nowrap",
  {
    variants: {
      variant: {
        soft: "bg-secondary text-royal",
        outline: "border border-border bg-surface text-foreground",
        sand: "bg-[color-mix(in_srgb,var(--sand)_35%,white)] text-navy",
        success: "bg-[color-mix(in_srgb,var(--cyan)_22%,white)] text-navy",
        cta: "bg-cta/12 text-[color-mix(in_srgb,var(--cta)_55%,var(--navy))]",
      },
      size: {
        sm: "px-2.5 py-0.5",
        md: "px-3 py-1",
      },
    },
    defaultVariants: { variant: "soft", size: "md" },
  },
);

export interface BadgeProps
  extends React.ComponentProps<"span">,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, size }), className)} {...props} />
  );
}
