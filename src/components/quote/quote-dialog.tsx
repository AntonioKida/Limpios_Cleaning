"use client";

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
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultService?: string;
}) {
  const t = useTranslations("Quote");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92dvh] gap-5 overflow-y-auto sm:max-w-lg">
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
