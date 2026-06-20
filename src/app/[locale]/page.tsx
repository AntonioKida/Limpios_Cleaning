import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";

// NOTE: temporary scaffold homepage to keep the build green while the real
// section-by-section homepage is assembled in a later step.
export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Home.hero");

  return (
    <main className="mx-auto flex max-w-3xl flex-1 flex-col items-center justify-center gap-6 px-6 py-24 text-center">
      <h1 className="font-heading text-4xl font-bold text-navy sm:text-5xl">
        {t("title")} <span className="text-sky">{t("titleAccent")}</span>
      </h1>
      <p className="text-lg text-muted-foreground">{t("subtitle")}</p>
    </main>
  );
}
