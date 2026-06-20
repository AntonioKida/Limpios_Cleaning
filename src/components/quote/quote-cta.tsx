"use client";

import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import type { VariantProps } from "class-variance-authority";
import type { buttonVariants } from "@/components/ui/button";

type ButtonVariant = VariantProps<typeof buttonVariants>["variant"];
type ButtonSize = VariantProps<typeof buttonVariants>["size"];

interface QuoteCTAProps {
  label?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  withIcon?: boolean;
  fullWidth?: boolean;
  className?: string;
  /** Optional service slug to prefill the quote (read by the quote page). */
  service?: string;
}

/**
 * The single entry point for "Get a free quote". Centralizing it means the
 * modal upgrade and any prefill logic live in one place. Renders a real link to
 * /quote (works without JS); the quote experience is progressively enhanced.
 */
export function QuoteCTA({
  label,
  variant = "cta",
  size = "xl",
  withIcon = false,
  fullWidth = false,
  className,
  service,
}: QuoteCTAProps) {
  const t = useTranslations("Quote");
  const href = service
    ? { pathname: routes.quote, query: { service } }
    : routes.quote;

  return (
    <Button
      asChild
      variant={variant}
      size={size}
      className={cn(fullWidth && "w-full", className)}
    >
      <Link href={href}>
        {label ?? t("trigger")}
        {withIcon ? (
          <ArrowRight className="transition-transform group-hover/button:translate-x-0.5" />
        ) : null}
      </Link>
    </Button>
  );
}
