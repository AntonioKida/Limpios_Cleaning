"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { QuoteForm } from "./quote-form";

export function QuoteDialog({
  open,
  onOpenChange,
  defaultService,
  triggerRef,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultService?: string;
  /** Focus returns here when the dialog closes (WCAG 2.4.3) — Radix can't
   *  restore it automatically because the dialog is controlled, not trigger-opened. */
  triggerRef?: React.RefObject<HTMLElement | null>;
}) {
  const t = useTranslations("Quote");
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        ref={contentRef}
        tabIndex={-1}
        className="max-h-[92dvh] gap-5 overflow-y-auto sm:max-w-lg"
        onOpenAutoFocus={(e) => {
          // Radix focuses the first tabbable node on open, which here is the
          // sr-only audience radio. The moment anything else takes focus, that
          // radio blurs, `mode: "onTouched"` marks it touched, and the form yells
          // "Please tell us who you are" at someone who has not done anything yet.
          // Focus the dialog itself: the title and description are still announced
          // (aria-labelledby/describedby), and no field is touched on open.
          e.preventDefault();
          contentRef.current?.focus();
        }}
        onCloseAutoFocus={(e) => {
          if (triggerRef?.current) {
            e.preventDefault();
            triggerRef.current.focus();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle className="font-heading text-xl text-navy">
            {t("modalTitle")}
          </DialogTitle>
          <DialogDescription>{t("modalDescription")}</DialogDescription>
        </DialogHeader>
        <QuoteForm
          defaultService={defaultService}
          onClose={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
