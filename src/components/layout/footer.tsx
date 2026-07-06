import { Landmark, Mail, MapPin } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/brand/logo";
import { PhoneLink } from "@/components/phone-link";
import { routes } from "@/lib/routes";
import { site, dayOrder } from "@/content/site";
import { primaryServices } from "@/content/services";
import { cities } from "@/content/cities";
import { formatTime } from "@/lib/format";

function InstagramGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" aria-hidden fill="none">
      <rect x="2.5" y="2.5" width="19" height="19" rx="5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.4" cy="6.6" r="1.2" fill="currentColor" />
    </svg>
  );
}

function FacebookGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" aria-hidden fill="currentColor">
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06C2 17.06 5.66 21.2 10.44 22v-7.03H7.9v-2.9h2.54V9.85c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.9h-2.34V22C18.34 21.2 22 17.06 22 12.06Z" />
    </svg>
  );
}

const linkClass =
  "text-cool/70 transition-colors hover:text-white focus-visible:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky rounded-sm";

export async function Footer() {
  const locale = await getLocale();
  const t = await getTranslations("Footer");
  const tn = await getTranslations("Nav");
  const ts = await getTranslations("Services.items");
  const tc = await getTranslations("Common");
  const year = new Date().getFullYear();

  const featuredCities = cities.filter((c) => c.featured);

  return (
    <footer className="mt-auto bg-navy text-white">
      <Container className="py-14 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-12">
          {/* Brand */}
          <div className="flex flex-col gap-5 lg:col-span-4">
            <Logo tone="white" />
            <p className="max-w-sm text-sm leading-relaxed text-cool/70">
              {t("blurb")}
            </p>
            <div className="flex items-center gap-3">
              <a
                href={site.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="grid size-10 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky"
              >
                <InstagramGlyph />
              </a>
              <a
                href={site.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="grid size-10 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky"
              >
                <FacebookGlyph />
              </a>
            </div>
          </div>

          {/* Services */}
          <nav aria-label={t("servicesTitle")} className="lg:col-span-2">
            <h2 className="font-heading text-sm font-semibold tracking-wide text-white uppercase">
              {t("servicesTitle")}
            </h2>
            {/* G1: primary five only — demoted services stay reachable from the hub. */}
            <ul className="mt-4 space-y-2.5 text-sm">
              {primaryServices.map((s) => (
                <li key={s.slug}>
                  <Link href={routes.service(s.slug)} className={linkClass}>
                    {ts(`${s.slug}.name`)}
                  </Link>
                </li>
              ))}
              <li>
                <Link href={routes.services} className={linkClass}>
                  {t("allServicesLink")}
                </Link>
              </li>
            </ul>
          </nav>

          {/* Service areas */}
          <nav aria-label={t("areasTitle")} className="lg:col-span-2">
            <h2 className="font-heading text-sm font-semibold tracking-wide text-white uppercase">
              {t("areasTitle")}
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {featuredCities.map((c) => (
                <li key={c.slug}>
                  <Link href={routes.city(c.slug)} className={linkClass}>
                    {c.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href={routes.serviceAreas} className={linkClass}>
                  {t("allAreas")}
                </Link>
              </li>
            </ul>
          </nav>

          {/* Company + Contact */}
          <div className="flex flex-col gap-8 sm:flex-row sm:gap-10 lg:col-span-4">
            <nav aria-label={t("companyTitle")}>
              <h2 className="font-heading text-sm font-semibold tracking-wide text-white uppercase">
                {t("companyTitle")}
              </h2>
              <ul className="mt-4 space-y-2.5 text-sm">
                <li>
                  <Link href={routes.about} className={linkClass}>
                    {tn("about")}
                  </Link>
                </li>
                <li>
                  <Link href={routes.reviews} className={linkClass}>
                    {tn("reviews")}
                  </Link>
                </li>
                <li>
                  <Link href={routes.pricing} className={linkClass}>
                    {tn("pricing")}
                  </Link>
                </li>
                <li>
                  <Link href={routes.contact} className={linkClass}>
                    {tn("contact")}
                  </Link>
                </li>
              </ul>
            </nav>

            <div className="text-sm">
              <h2 className="font-heading text-sm font-semibold tracking-wide text-white uppercase">
                {t("contactTitle")}
              </h2>
              <address className="mt-4 space-y-3 text-cool/70 not-italic">
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(
                    `${site.address.street}, ${site.address.suite}, ${site.address.city}, ${site.address.region} ${site.address.postalCode}`,
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-start gap-2.5 ${linkClass}`}
                >
                  <MapPin className="mt-0.5 size-4 shrink-0 text-sky" aria-hidden />
                  <span>
                    {site.address.street}, {site.address.suite}
                    <br />
                    {site.address.city}, {site.address.region}{" "}
                    {site.address.postalCode}
                  </span>
                </a>
                <PhoneLink
                  showIcon
                  iconClassName="text-sky"
                  className={`gap-2.5 ${linkClass}`}
                />
                <a href={`mailto:${site.email}`} className={`flex items-center gap-2.5 ${linkClass}`}>
                  <Mail className="size-4 shrink-0 text-sky" aria-hidden />
                  <span>{site.email}</span>
                </a>
              </address>

              <h3 className="mt-6 font-heading text-sm font-semibold tracking-wide text-white uppercase">
                {t("hoursTitle")}
              </h3>
              <dl className="mt-3 space-y-1 text-cool/70">
                {dayOrder.map((day) => {
                  const h = site.hours[day];
                  return (
                    <div key={day} className="flex justify-between gap-4">
                      <dt>{tc(`daysShort.${day}`)}</dt>
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
        </div>

        {/* Chamber membership — verified credential (see content/site.ts). */}
        <p className="mt-10 flex items-center gap-2.5 text-sm text-cool/75">
          <Landmark className="size-4 shrink-0 text-sky" aria-hidden />
          <a
            href={site.chamber.url}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            {t("chamberLine")}
          </a>
        </p>

        {/* Bottom bar */}
        <div className="mt-6 flex flex-col gap-2 border-t border-white/10 pt-6 text-sm text-cool/75 sm:flex-row sm:items-center sm:justify-between">
          <p>{t("rights", { year })}</p>
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span>{t("credit")}</span>
            {/* TODO: replace with the real license number. Hidden while the
                number is a placeholder — a visibly fake "LIC# 000000000"
                erodes trust with vendor-vetting buyers (role-audit P1). */}
            {!site.licenseIsPlaceholder ? (
              <>
                <span aria-hidden>·</span>
                <span>
                  {t("licenseLabel")}: {site.license}
                </span>
              </>
            ) : null}
          </p>
        </div>

        {/* Analytics / privacy disclosure */}
        <p className="mt-4 text-xs leading-relaxed text-cool/55">
          {t("privacyNote")}
        </p>
      </Container>
    </footer>
  );
}
