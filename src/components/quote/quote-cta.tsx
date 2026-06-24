"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import type { VariantProps } from "class-variance-authority";
import { Button, type buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { QuoteDialog } from "./quote-dialog";

type ButtonVariant = VariantProps<typeof buttonVariants>["variant"];
type ButtonSize = VariantProps<typeof buttonVariants>["size"];

interface QuoteCTAProps {
  label?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  withIcon?: boolean;
  fullWidth?: boolean;
  className?: string;
  /** Optional service slug to prefill the quote form. */
  service?: string;
  /** Where this CTA lives, for conversion analytics (e.g. "hero", "service"). */
  location?: string;
}

/**
 * The single entry point for "Get a free quote". Progressive enhancement: it's a
 * real link to /quote (works without JS); when JS is available, clicking opens
 * the multi-step quote modal instead. Modifier/middle clicks still navigate.
 */
export function QuoteCTA({
  label,
  variant = "cta",
  size = "xl",
  withIcon = false,
  fullWidth = false,
  className,
  service,
  location = "page",
}: QuoteCTAProps) {
  const t = useTranslations("Quote");
  const [open, setOpen] = useState(false);
  const href = service ? `${routes.quote}?service=${service}` : routes.quote;

  function handleClick(e: React.MouseEvent) {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
      return; // let new-tab / modified clicks navigate to /quote
    }
    e.preventDefault();
    setOpen(true);
  }

  return (
    <>
      <Button
        asChild
        variant={variant}
        size={size}
        className={cn(fullWidth && "w-full", className)}
      >
        <Link
          href={href}
          onClick={handleClick}
          data-analytics="quote-cta"
          data-location={location}
        >
          {label ?? t("trigger")}
          {withIcon ? (
            <ArrowRight className="transition-transform group-hover/button:translate-x-0.5" />
          ) : null}
        </Link>
      </Button>
      <QuoteDialog open={open} onOpenChange={setOpen} defaultService={service} />
    </>
  );
}
