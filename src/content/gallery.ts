/**
 * Real before/after gallery. Each source composite (Papo's photos) was split
 * into two equal WebP halves by `scripts/process-gallery.mjs` (left = before,
 * right = after), with blur placeholders in `gallery-blur.json`. Captions live in
 * the catalogs at `Home.beforeAfter.captions.<id>`.
 * TODO: swap in higher-res *separate* originals from Papo when available
 * (current halves are ~506px from the pre-composited squares).
 */
import blurData from "./gallery-blur.json";

const blur = blurData as Record<string, { before: string; after: string }>;

/** Every half is the same dimension (no CLS). */
export const GALLERY_W = 506;
export const GALLERY_H = 1024;

export type GalleryRoom =
  | "bathroom"
  | "shower"
  | "fridge"
  | "kitchen"
  | "patio";

/** Literal union so `captions.${GalleryId}` type-checks against the catalogs.
 *  img27/img28 = round-3 composites (docs/fable-audit/10-media-catalog.md). */
export type GalleryId =
  | "img1"
  | "img2"
  | "img3"
  | "img4"
  | "img5"
  | "img6"
  | "img7"
  | "img8"
  | "img9"
  | "img27"
  | "img28";

export interface GalleryPair {
  id: GalleryId; // also the caption key
  room: GalleryRoom;
  flagship: boolean;
  /** Service slugs this pair is relevant to (service-page galleries). */
  services: string[];
  before: { src: string; blurDataURL: string };
  after: { src: string; blurDataURL: string };
}

interface Meta {
  id: GalleryId;
  room: GalleryRoom;
  flagship: boolean;
  services: string[];
}

// Order = gallery order. Flagships are the dramatic-but-CLEAN transformations
// (lead the gallery with these); the gunkier pairs (caked fridge drawers, etc.)
// follow and sit behind a "See more transformations" disclosure so the section
// reads as desire, not disgust. `services` drives service-page media.
const META: Meta[] = [
  { id: "img5", room: "bathroom", flagship: true, services: ["deep-cleaning"] }, // rust tub → bright
  { id: "img2", room: "fridge", flagship: true, services: ["deep-cleaning"] }, // moldy fridge → spotless
  { id: "img8", room: "bathroom", flagship: true, services: ["deep-cleaning", "move-in-out"] }, // bathroom → fresh
  { id: "img4", room: "shower", flagship: false, services: ["deep-cleaning"] },
  { id: "img7", room: "kitchen", flagship: false, services: ["residential", "move-in-out"] },
  { id: "img1", room: "patio", flagship: false, services: ["residential"] },
  { id: "img6", room: "shower", flagship: false, services: ["deep-cleaning"] },
  { id: "img3", room: "fridge", flagship: false, services: ["deep-cleaning"] }, // caked drawer (disclose)
  { id: "img9", room: "kitchen", flagship: false, services: ["move-in-out"] },
  // Round-3 pairs — bathroom detail work (toilet base + tile), modest drama →
  // behind the disclosure; strong proof for turnover/detail standards.
  { id: "img27", room: "bathroom", flagship: false, services: ["deep-cleaning", "move-in-out"] },
  { id: "img28", room: "bathroom", flagship: false, services: ["move-in-out", "commercial"] },
];

export const galleryPairs: GalleryPair[] = META.map((m) => ({
  ...m,
  before: { src: `/gallery/${m.id}-before.webp`, blurDataURL: blur[m.id].before },
  after: { src: `/gallery/${m.id}-after.webp`, blurDataURL: blur[m.id].after },
}));

/** Lead the homepage gallery with the dramatic-but-clean flagships. */
export const homepageLead: GalleryPair[] = galleryPairs.filter((p) => p.flagship);

/** The rest — shown behind the "See more transformations" disclosure. */
export const homepageMore: GalleryPair[] = galleryPairs.filter((p) => !p.flagship);

export function galleryForService(slug: string): GalleryPair[] {
  return galleryPairs.filter((p) => p.services.includes(slug));
}
