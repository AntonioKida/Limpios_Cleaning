"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import type { VariantProps } from "class-variance-authority";
import { Button, type buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

// Lazy: the quote dialog pulls in react-hook-form + zod + the multi-step form.
// It only ever opens on click, so defer that JS off the initial page load.
const QuoteDialog = dynamic(
  () => import("./quote-dialog").then((m) => ({ default: m.QuoteDialog })),
  { ssr: false },
);

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
  // Only mount (and thus load) the dialog after the first open.
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef<HTMLAnchorElement>(null);
  const href = service ? `${routes.quote}?service=${service}` : routes.quote;

  function handleClick(e: React.MouseEvent) {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
      return; // let new-tab / modified clicks navigate to /quote
    }
    e.preventDefault();
    setMounted(true);
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
          ref={triggerRef}
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
      {mounted ? (
        <QuoteDialog
          open={open}
          onOpenChange={setOpen}
          defaultService={service}
          triggerRef={triggerRef}
        />
      ) : null}
    </>
  );
}
