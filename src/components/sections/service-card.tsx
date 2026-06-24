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
        "group relative flex h-full flex-col gap-4 overflow-hidden rounded-xl border border-border bg-surface p-6 transition duration-200 hover:-translate-y-0.5 hover:border-sky/50 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:hover:translate-y-0",
        className,
      )}
    >
      {/* Custom hover affordance: an accent rule that draws in (not a uniform lift). */}
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-sky transition-transform duration-300 group-hover:scale-x-100"
      />

      <div className="flex items-start justify-between gap-3">
        <span className="text-royal transition-transform duration-300 group-hover:-translate-y-0.5">
          <Icon name={service.icon} className="size-9" strokeWidth={1.75} />
        </span>
        <span className="rounded-full bg-cool px-3 py-1 text-sm font-semibold text-royal">
          {priceLabel}
        </span>
      </div>

      <div className="flex flex-col gap-1.5">
        <h3 className="font-heading text-xl font-bold text-navy">
          {t(`items.${service.slug}.name`)}
        </h3>
        <p className="leading-relaxed text-muted-foreground">
          {t(`items.${service.slug}.tagline`)}
        </p>
      </div>

      <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-royal">
        {t("labels.viewService")}
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
      </span>
    </Link>
  );
}
