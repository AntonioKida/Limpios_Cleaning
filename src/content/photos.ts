/**
 * Single job-site photos (round-3 batch) — real work-in-progress and finished
 * shots, NOT before/after pairs (those live in gallery.ts). Optimized at
 * native portrait aspect by `scripts/process-photos.mjs` into
 * /public/job-photos + blur placeholders in photo-blur.json.
 *
 * Alt text is translatable: `Photos.alts.<id>` in the message catalogs.
 * Curation + per-asset analysis: docs/fable-audit/10-media-catalog.md.
 * TODO: confirm publish consent for img16 (crew member partially identifiable
 * — mask + cap) with the owner before launch.
 */
import type { ServiceSlug } from "./services";
import blurData from "./photo-blur.json";

const blur = blurData as Record<
  string,
  { w: number; h: number; blurDataURL: string }
>;

/** Literal union so `Photos.alts.${JobPhotoId}` type-checks. */
export type JobPhotoId =
  | "img10"
  | "img11"
  | "img14"
  | "img15"
  | "img16"
  | "img18"
  | "img19"
  | "img20"
  | "img25"
  | "img26"
  | "img29"
  | "img30"
  | "img31"
  | "img32"
  | "img36"
  | "img37"
  | "img38";

export interface JobPhoto {
  id: JobPhotoId;
  src: string;
  width: number;
  height: number;
  blurDataURL: string;
  /** Service detail pages this photo appears on (order = display order). */
  services: ServiceSlug[];
  /** Shown in the About "team at work" strip. */
  about?: boolean;
}

interface Meta {
  id: JobPhotoId;
  services: ServiceSlug[];
  about?: boolean;
}

const META: Meta[] = [
  // Post-construction: during → equipment → finished (the page tells the arc)
  { id: "img11", services: ["post-construction"] },
  { id: "img18", services: ["post-construction"] },
  { id: "img25", services: ["post-construction"] },
  { id: "img26", services: ["post-construction"] },
  // Move-in/out
  { id: "img10", services: ["move-in-out"] },
  // Window cleaning
  { id: "img15", services: ["window-cleaning"] },
  { id: "img14", services: ["window-cleaning"] },
  // Detail standards (deep-detail proof) + About
  { id: "img16", services: ["deep-cleaning"], about: true },
  { id: "img19", services: ["move-in-out"] },
  // Carpet cleaning — this page's primary proof strip (order = strongest first,
  // process shot last). Residential jobs, captioned as carpet cleaning without
  // any commercial implication (owner: no commercial carpet work yet).
  { id: "img36", services: ["carpet-cleaning"] },
  { id: "img30", services: ["carpet-cleaning"] },
  { id: "img31", services: ["carpet-cleaning"] },
  { id: "img32", services: ["carpet-cleaning"] },
  { id: "img38", services: ["carpet-cleaning"] },
  { id: "img37", services: ["carpet-cleaning"] },
  // Brand / About only
  { id: "img20", services: [], about: true },
  { id: "img29", services: [], about: true },
];

export const jobPhotos: JobPhoto[] = META.map((m) => ({
  ...m,
  src: `/job-photos/${m.id}.webp`,
  width: blur[m.id].w,
  height: blur[m.id].h,
  blurDataURL: blur[m.id].blurDataURL,
}));

export function photosForService(slug: string): JobPhoto[] {
  return jobPhotos.filter((p) => p.services.includes(slug as ServiceSlug));
}

export const aboutPhotos: JobPhoto[] = jobPhotos.filter((p) => p.about);
