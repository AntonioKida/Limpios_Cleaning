import { CalendarClock } from "lucide-react";
import { useTranslations } from "next-intl";

/**
 * BookingEmbed — FUTURE INTEGRATION SEAM.
 *
 * This is the single, documented place to embed a real online-booking provider
 * (BookingKoala, Launch27, Jobber, or Housecall Pro — the client will choose).
 * Until then it renders a friendly "coming soon" placeholder. Do NOT wire a real
 * provider yet (frontend phase only). When ready, replace the inner content with
 * the provider's embed/iframe/script.
 */
export function BookingEmbed() {
  const t = useTranslations("Booking");

  return (
    <div
      data-booking-embed
      className="rounded-2xl border border-dashed border-border bg-cool p-6"
    >
      <div className="flex items-start gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-secondary text-royal">
          <CalendarClock className="size-5" aria-hidden />
        </span>
        <div>
          <h3 className="font-heading font-semibold text-navy">{t("title")}</h3>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            {t("body")}
          </p>
        </div>
      </div>
    </div>
  );
}
