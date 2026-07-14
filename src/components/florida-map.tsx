import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

/**
 * Stylized Florida silhouette with the Central Florida service area highlighted
 * and the featured cities pinned roughly where they sit. Deliberately a static
 * inline SVG: no Google/Mapbox embed, so no API key, no JS weight, no per-load
 * cost, and it renders identically with JS disabled. Replaces the old abstract
 * grid-with-pins, which read as an unrendered wireframe.
 *
 * Only rendered once per page, so the title/desc ids can be static.
 */
/**
 * City pins, projected from real coordinates then nudged apart: the six cities
 * sit within ~30km of each other, so at this scale they would otherwise overlap.
 */
const PINS = [
  { id: "minneola", x: 238, y: 196 },
  { id: "clermont", x: 236, y: 206 },
  { id: "groveland", x: 227, y: 213 },
  { id: "winter-garden", x: 251, y: 198 },
  { id: "horizon-west", x: 254, y: 210 },
  { id: "four-corners", x: 244, y: 221 },
] as const;

/**
 * Florida outline, projected from real lon/lat boundary points into the viewBox
 * (equirectangular): panhandle across the top-left, peninsula hanging south-east.
 */
const FLORIDA_PATH =
  "M 10 20 L 113 20 L 113 38 L 223 50 L 255 42 L 271 153 L 286 212 L 306 315 L 304 404 L 271 452 L 265 454 L 239 378 L 211 293 L 201 242 L 199 168 L 190 157 L 168 101 L 136 90 L 113 116 L 85 83 L 53 64 L 22 68 Z";

export function FloridaMap({ className }: { className?: string }) {
  const t = useTranslations("Home.serviceArea");

  return (
    <svg
      viewBox="0 0 320 520"
      role="img"
      aria-labelledby="fl-map-title fl-map-desc"
      className={cn("h-auto w-full", className)}
    >
      <title id="fl-map-title">{t("mapTitle")}</title>
      <desc id="fl-map-desc">{t("mapDesc")}</desc>

      {/* State silhouette */}
      <path
        d={FLORIDA_PATH}
        fill="var(--secondary)"
        stroke="var(--royal)"
        strokeWidth="2"
        strokeLinejoin="round"
      />

      {/* Central Florida / Lake County service area */}
      <ellipse cx="242" cy="208" rx="38" ry="31" fill="var(--sky)" opacity="0.25" />
      <ellipse
        cx="242"
        cy="208"
        rx="38"
        ry="31"
        fill="none"
        stroke="var(--royal)"
        strokeWidth="1.5"
        strokeDasharray="5 4"
        opacity="0.7"
      />

      {/* Featured cities */}
      {PINS.map((p) => (
        <circle
          key={p.id}
          cx={p.x}
          cy={p.y}
          r="4.5"
          fill="var(--cta)"
          stroke="#ffffff"
          strokeWidth="1.6"
        />
      ))}

      <text
        x="242"
        y="262"
        textAnchor="middle"
        fill="var(--navy)"
        fontSize="13"
        fontWeight="700"
      >
        {t("mapRegion")}
      </text>
    </svg>
  );
}
