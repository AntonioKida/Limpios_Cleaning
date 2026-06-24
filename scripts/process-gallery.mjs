// Split each 1024x1024 before/after composite into two WebP halves (cropping the
// center divider) + generate blur placeholders. Source = /Media (gitignored);
// output = /public/gallery + src/content/gallery-blur.json. Run: node scripts/process-gallery.mjs
import sharp from "sharp";
import { writeFileSync, mkdirSync } from "node:fs";

mkdirSync("public/gallery", { recursive: true });
const ids = ["img1","img2","img3","img4","img5","img6","img7","img8","img9"];
// composite is 1024 wide; crop ~12px center divider; halves are equal (506 wide)
const HALF = 506, GAP = 12, H = 1024;
const blur = {};

async function half(src, left) {
  const buf = await sharp(src).extract({ left, top: 0, width: HALF, height: H }).toBuffer();
  return buf;
}
async function toWebp(buf, out) {
  await sharp(buf).webp({ quality: 80 }).toFile(out);
}
async function blurDataUrl(buf) {
  const b = await sharp(buf).resize(12).webp({ quality: 35 }).toBuffer();
  return `data:image/webp;base64,${b.toString("base64")}`;
}

for (const id of ids) {
  const src = `Media/${id.replace("img","Img")}.jpeg`;
  const beforeBuf = await half(src, 0);
  const afterBuf = await half(src, HALF + GAP); // 518
  await toWebp(beforeBuf, `public/gallery/${id}-before.webp`);
  await toWebp(afterBuf, `public/gallery/${id}-after.webp`);
  blur[id] = { before: await blurDataUrl(beforeBuf), after: await blurDataUrl(afterBuf) };
  console.log(`  ${id}: split + webp + blur`);
}
writeFileSync("src/content/gallery-blur.json", JSON.stringify(blur, null, 0));
console.log(`\nwrote ${ids.length*2} webp halves + gallery-blur.json (${HALF}x${H} each)`);
