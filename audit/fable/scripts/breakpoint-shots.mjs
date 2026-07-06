// Fable audit: full-page captures at the 5 rubric breakpoints (320/390/768/
// 1024/1440), reveals neutralized via reducedMotion (the hero's signature
// reveal renders static; everything else is already still). JPEG q55 keeps the
// committed trail reviewable without bloating the repo.
//   (production server must be running)  node audit/fable/scripts/breakpoint-shots.mjs
import { chromium } from "playwright";
import path from "node:path";
import fs from "node:fs";

const BASE = process.env.AUDIT_BASE || "http://localhost:3000";
const OUT = "audit/fable/screenshots";
fs.mkdirSync(OUT, { recursive: true });

const EN_ROUTES = [
  "/en",
  "/en/services",
  "/en/services/window-cleaning",
  "/en/services/carpet-cleaning",
  "/en/services/post-construction",
  "/en/services/commercial",
  "/en/pricing",
  "/en/service-areas",
  "/en/service-areas/clermont",
  "/en/about",
  "/en/reviews",
  "/en/contact",
  "/en/quote",
];
const ES_ROUTES = ["/es", "/es/services", "/es/pricing", "/es/services/window-cleaning"];

const WIDTHS = [320, 390, 768, 1024, 1440];

const browser = await chromium.launch();

for (const width of WIDTHS) {
  const ctx = await browser.newContext({
    viewport: { width, height: 900 },
    reducedMotion: "reduce",
    deviceScaleFactor: 1,
    isMobile: width < 768,
    hasTouch: width < 768,
  });
  const routes = width === 390 || width === 1440 ? [...EN_ROUTES, ...ES_ROUTES] : EN_ROUTES;
  for (const r of routes) {
    const page = await ctx.newPage();
    await page.goto(BASE + r, { waitUntil: "load", timeout: 60000 });
    await page.waitForTimeout(900);
    const slug = (r.replace(/\//g, "_").replace(/^_/, "") || "home");
    await page.screenshot({
      path: path.join(OUT, `${width}_${slug}.jpg`),
      fullPage: true,
      type: "jpeg",
      quality: 55,
    });
    await page.close();
  }
  await ctx.close();
  console.log(`captured ${width}px`);
}

await browser.close();
console.log("done ->", OUT);
