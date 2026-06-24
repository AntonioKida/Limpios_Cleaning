import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Bricolage_Grotesque, Public_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { routing, type Locale } from "@/i18n/routing";
import { site } from "@/content/site";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import { MicrosoftClarity } from "@/components/analytics/clarity";
import { ConversionTracker } from "@/components/analytics/conversion-tracker";
import "../globals.css";

// Headings: Bricolage Grotesque — a humanist grotesque with a little hand-drawn
// irregularity (reads "drawn by a person," not generated). Variable, with the
// optical-size axis so large display headings get the right treatment.
const fontHeading = Bricolage_Grotesque({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  axes: ["opsz"],
  variable: "--font-bricolage",
});

// Body: Public Sans — the USWDS/government typeface. Clear and credible, with a
// quiet civic undertone that suits a veteran-owned business, and full Spanish
// diacritic coverage.
const fontBody = Public_Sans({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-public-sans",
});

// Pre-render both locales at build time (static).
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: "#0A2359",
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Meta" });
  return {
    metadataBase: new URL(site.url),
    title: {
      template: `%s | ${t("siteName")}`,
      default: t("defaultTitle"),
    },
    description: t("defaultDescription"),
    alternates: {
      canonical: `/${locale}`,
      languages: { en: "/en", es: "/es", "x-default": "/en" },
    },
    openGraph: {
      type: "website",
      siteName: t("siteName"),
      locale: locale === "es" ? "es_ES" : "en_US",
    },
    twitter: { card: "summary_large_image" },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  // Enable static rendering for this locale.
  setRequestLocale(locale);
  const t = await getTranslations("Common");

  return (
    <html
      lang={locale}
      data-scroll-behavior="smooth"
      className={`${fontHeading.variable} ${fontBody.variable}`}
    >
      <body className="flex min-h-dvh flex-col bg-background text-foreground">
        <NextIntlClientProvider>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-lg focus:bg-surface focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-navy focus:shadow-lg focus:outline-2 focus:outline-offset-2 focus:outline-ring"
          >
            {t("skipToContent")}
          </a>
          <Header />
          {children}
          <Footer />
        </NextIntlClientProvider>
        <Analytics />
        <GoogleAnalytics />
        <MicrosoftClarity />
        <ConversionTracker />
      </body>
    </html>
  );
}
