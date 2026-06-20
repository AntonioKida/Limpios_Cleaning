import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { buildMetadata } from "@/lib/metadata";
import { PageHero } from "@/components/sections/page-hero";
import { Section } from "@/components/ui/section";
import { QuoteForm } from "@/components/quote/quote-form";
import { BookingEmbed } from "@/components/booking-embed";
import { PhoneLink } from "@/components/phone-link";
import { site, dayOrder } from "@/content/site";
import { formatTime } from "@/lib/format";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Meta.pages.contact" });
  return buildMetadata({
    title: t("title"),
    description: t("description"),
    locale,
    path: "/contact",
  });
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Contact");
  const tc = await getTranslations("Common");

  const mapsUrl = `https://maps.google.com/?q=${encodeURIComponent(
    `${site.address.street}, ${site.address.suite}, ${site.address.city}, ${site.address.region} ${site.address.postalCode}`,
  )}`;

  return (
    <main id="main-content">
      <PageHero eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />

      <Section surface="white">
        <div className="grid gap-10 lg:grid-cols-5 lg:gap-12">
          {/* Contact methods */}
          <div className="flex flex-col gap-6 lg:col-span-2">
            <div className="flex items-start gap-4 rounded-2xl border border-border bg-cool/50 p-5">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-secondary text-royal">
                <Phone className="size-5" aria-hidden />
              </span>
              <div>
                <h2 className="font-heading font-semibold text-navy">
                  {t("callTitle")}
                </h2>
                <p className="text-sm text-muted-foreground">{t("callBody")}</p>
                <PhoneLink className="mt-1 font-heading text-lg font-bold text-royal" />
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-2xl border border-border bg-cool/50 p-5">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-secondary text-royal">
                <Mail className="size-5" aria-hidden />
              </span>
              <div>
                <h2 className="font-heading font-semibold text-navy">
                  {t("emailTitle")}
                </h2>
                <p className="text-sm text-muted-foreground">{t("emailBody")}</p>
                <a
                  href={`mailto:${site.email}`}
                  className="mt-1 inline-block font-medium text-royal hover:underline"
                >
                  {site.email}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-2xl border border-border bg-cool/50 p-5">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-secondary text-royal">
                <MapPin className="size-5" aria-hidden />
              </span>
              <div>
                <h2 className="font-heading font-semibold text-navy">
                  {t("visitTitle")}
                </h2>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-block text-sm text-muted-foreground hover:text-royal hover:underline"
                >
                  {site.address.street}, {site.address.suite}
                  <br />
                  {site.address.city}, {site.address.region}{" "}
                  {site.address.postalCode}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-2xl border border-border bg-cool/50 p-5">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-secondary text-royal">
                <Clock className="size-5" aria-hidden />
              </span>
              <div className="w-full">
                <h2 className="font-heading font-semibold text-navy">
                  {t("hoursTitle")}
                </h2>
                <dl className="mt-2 space-y-1 text-sm text-muted-foreground">
                  {dayOrder.map((day) => {
                    const h = site.hours[day];
                    return (
                      <div key={day} className="flex justify-between gap-6">
                        <dt>{tc(`days.${day}`)}</dt>
                        <dd className="tabular-nums">
                          {h
                            ? `${formatTime(h.open, locale)} – ${formatTime(h.close, locale)}`
                            : tc("closed")}
                        </dd>
                      </div>
                    );
                  })}
                </dl>
              </div>
            </div>

            <BookingEmbed />
          </div>

          {/* Lead form */}
          <div className="lg:col-span-3">
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm sm:p-8">
              <h2 className="font-heading text-xl font-bold text-navy">
                {t("formTitle")}
              </h2>
              <p className="mt-1 mb-6 text-sm text-muted-foreground">
                {t("formIntro")}
              </p>
              <QuoteForm />
            </div>
          </div>
        </div>
      </Section>

      {/* Map placeholder. TODO: replace with a real embedded map. */}
      <Section surface="cool" className="pt-0">
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="relative block aspect-[21/9] overflow-hidden rounded-[1.75rem] border border-border bg-gradient-to-br from-cool to-secondary shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <div
            aria-hidden
            className="absolute inset-0 opacity-60 [background-image:linear-gradient(color-mix(in_srgb,var(--royal)_10%,transparent)_1px,transparent_1px),linear-gradient(90deg,color-mix(in_srgb,var(--royal)_10%,transparent)_1px,transparent_1px)] [background-size:42px_42px]"
          />
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full text-sky drop-shadow">
            <MapPin className="size-10 fill-sky/20" aria-hidden />
          </span>
          <span className="absolute inset-x-0 bottom-0 flex items-center gap-2 bg-surface/80 px-5 py-3 text-sm font-medium text-navy backdrop-blur">
            <MapPin className="size-4 text-royal" aria-hidden />
            {t("mapPlaceholder")}
          </span>
        </a>
      </Section>
    </main>
  );
}
