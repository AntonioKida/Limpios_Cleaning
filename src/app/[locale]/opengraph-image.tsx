import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { site } from "@/content/site";

export const alt = "Limpios Cleaning Management — veteran owned cleaning in Central Florida";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Localized, brand-styled Open Graph image generated at build time per locale.
export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Meta" });
  const tc = await getTranslations({ locale, namespace: "Common" });

  const pills = [
    tc("veteranOwned"),
    tc("licensedInsured"),
    tc("ecoFriendly"),
    tc("bilingual"),
  ];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #0A2359 0%, #1B5A9D 100%)",
          padding: "72px",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "22px" }}>
          <div
            style={{
              width: 88,
              height: 88,
              borderRadius: 22,
              background: "rgba(255,255,255,0.10)",
              border: "2px solid rgba(255,255,255,0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 56,
              fontWeight: 800,
              color: "#5ED7F4",
            }}
          >
            L
          </div>
          <div style={{ fontSize: 46, fontWeight: 800 }}>Limpios</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div
            style={{
              fontSize: 64,
              fontWeight: 800,
              lineHeight: 1.08,
              maxWidth: 960,
            }}
          >
            {t("defaultTitle")}
          </div>
          <div style={{ fontSize: 30, color: "#bcd6f0", maxWidth: 900 }}>
            {t("tagline")}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "24px",
          }}
        >
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", flex: 1 }}>
            {pills.map((pill) => (
              <div
                key={pill}
                style={{
                  display: "flex",
                  padding: "9px 16px",
                  borderRadius: 999,
                  background: "rgba(94,215,244,0.18)",
                  color: "#d6f2fb",
                  fontSize: 20,
                  fontWeight: 600,
                }}
              >
                {pill}
              </div>
            ))}
          </div>
          <div
            style={{
              display: "flex",
              flexShrink: 0,
              whiteSpace: "nowrap",
              fontSize: 28,
              fontWeight: 800,
              color: "#F47B20",
            }}
          >
            {site.phone.display}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
