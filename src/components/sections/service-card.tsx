import { ArrowRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Icon } from "@/components/icon";
import { routes } from "@/lib/routes";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Service } from "@/content/services";

export function ServiceCard({
  service,
  className,
}: {
  service: Service;
  className?: string;
}) {
  const t = useTranslations("Services");
  const tc = useTranslations("Common");
  const locale = useLocale();

  const { price } = service;
  const priceLabel =
    price.model === "from" && price.amount
      ? tc("from", { amount: formatCurrency(price.amount, locale) })
      : price.model === "custom"
        ? tc("customQuote")
        : tc("requestQuote");

  return (
    <Link
      href={routes.service(service.slug)}
      className={cn(
        "group flex h-full flex-col gap-4 rounded-2xl border border-border bg-surface p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-sky/40 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <span className="grid size-12 place-items-center rounded-xl bg-secondary text-royal transition-colors group-hover:bg-royal group-hover:text-white">
          <Icon name={service.icon} className="size-6" />
        </span>
        <span className="text-sm font-semibold text-royal">{priceLabel}</span>
      </div>

      <div className="flex flex-col gap-1.5">
        <h3 className="font-heading text-lg font-semibold text-navy">
          {t(`items.${service.slug}.name`)}
        </h3>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {t(`items.${service.slug}.tagline`)}
        </p>
      </div>

      <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-royal">
        {t("labels.viewService")}
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}
