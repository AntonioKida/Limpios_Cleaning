import { setRequestLocale, getTranslations } from "next-intl/server";

// NOTE: temporary scaffold homepage to verify the i18n + tokens + fonts
// pipeline. The real section-by-section homepage is built in a later step.
export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("HomePage");

  return (
    <main className="mx-auto flex max-w-3xl flex-1 flex-col items-center justify-center gap-6 px-6 py-24 text-center">
      <span className="rounded-full bg-secondary px-4 py-1.5 text-sm font-medium text-royal">
        Veteran-owned · Licensed &amp; insured · Eco-friendly
      </span>
      <h1 className="font-heading text-4xl font-bold text-navy sm:text-5xl">
        {t("heroTitle")}
      </h1>
      <p className="text-lg text-muted-foreground">{t("heroSubtitle")}</p>
      <button className="rounded-lg bg-cta px-6 py-3 font-heading font-semibold text-cta-foreground shadow-sm transition hover:brightness-105">
        Get a free quote
      </button>
    </main>
  );
}
