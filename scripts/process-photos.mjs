// Optimize single job-site photos (round-3 batch) at their NATIVE aspect ratio
// (no landscape-cropping of portraits) into WebP + blur placeholders.
// Source = /Media (gitignored); output = /public/job-photos +
// src/content/photo-blur.json. Companion to process-gallery.mjs (which handles
// only the pre-composited before/after squares). Run: node scripts/process-photos.mjs
import sharp from "sharp";
import { writeFileSync, mkdirSync, existsSync } from "node:fs";

mkdirSync("public/job-photos", { recursive: true });

// The curated ship-list (see docs/fable-audit/10-media-catalog.md for the full
// catalog incl. assets deliberately NOT shipped). All are 768x1024 portraits.
const ids = [
  "img10", // move-in: new-build bedroom mid-move (ladder, wardrobe rack)
  "img11", // post-construction: marble bath + freestanding tub, pre-clean
  "img14", // window/detail: crew wiping window-adjacent wall + track, pole pad
  "img15", // window: crew detailing window frame & glass from a step ladder
  "img16", // detail: crew high-dusting a ceiling fan (mask + gloves)
  "img18", // post-construction: empty room mid-clean, ladders + vacuum staged
  "img19", // detail: crew hand-detailing a toilet, gloves + microfiber
  "img20", // brand: crew on ladder, Limpios-branded shirt, tall cabinets
  "img25", // post-construction AFTER: finished marble bath, floors gleaming
  "img26", // post-construction AFTER: cleaned room, glossy wood floor
  "img29", // brand: Limpios Cleaning Management cap, close-up
];

const MAX_W = 768; // native width of the round-3 shots; never upscale
const blur = {};

for (const id of ids) {
  const src = existsSync(`Media/${id}.jpeg`) ? `Media/${id}.jpeg` : `Media/${id.replace("img", "Img")}.jpeg`;
  const img = sharp(src).rotate(); // respect EXIF orientation
  const meta = await img.metadata();
  const buf = await img
    .resize({ width: Math.min(MAX_W, meta.width ?? MAX_W), withoutEnlargement: true })
    .toBuffer();
  await sharp(buf).webp({ quality: 78 }).toFile(`public/job-photos/${id}.webp`);
  const out = await sharp(`public/job-photos/${id}.webp`).metadata();
  const b = await sharp(buf).resize(12).webp({ quality: 35 }).toBuffer();
  blur[id] = {
    w: out.width,
    h: out.height,
    blurDataURL: `data:image/webp;base64,${b.toString("base64")}`,
  };
  console.log(`  ${id}: ${out.width}x${out.height} webp + blur`);
}

writeFileSync("src/content/photo-blur.json", JSON.stringify(blur, null, 0));
console.log(`\nwrote ${ids.length} job photos + photo-blur.json`);
