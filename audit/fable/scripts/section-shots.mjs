// Fable audit: element-level captures of the sections CHANGED by the
// repositioning, at mobile + desktop widths, reveals neutralized.
//   node audit/fable/scripts/section-shots.mjs
import { chromium } from "playwright";
import fs from "node:fs";

const BASE = process.env.AUDIT_BASE || "http://localhost:3000";
const OUT = "audit/fable/screenshots/sections";
fs.mkdirSync(OUT, { recursive: true });

const TARGETS = [
  // [route, selector, name]
  ["/en", "section:has(h1)", "hero"],
  ["/en", "section[aria-label]", "trustbar"],
  ["/en", "#audiences", "audiences"],
  ["/en", "#services", "services-grid"],
  ["/en", "#how-it-works", "steps"],
  ["/en/services", "main > section:nth-of-type(2)", "hub-grid-plus-secondary"],
  ["/en/services/window-cleaning", "main", "window-page"],
  ["/en/services/post-construction", "main", "postcon-page"],
  ["/en/pricing", "main > section:nth-of-type(2)", "pricing-cards"],
  ["/en/service-areas/clermont", "main > section:nth-of-type(1)", "city-top"],
  ["/en/about", "main > section:nth-of-type(3)", "about-mission-eco-chamber"],
  ["/en/about", "main > section:nth-of-type(5)", "about-team"],
  ["/en/reviews", "main", "reviews-page"],
];

const browser = await chromium.launch();
for (const width of [320, 390, 1440]) {
  const ctx = await browser.newContext({
    viewport: { width, height: 900 },
    reducedMotion: "reduce",
    deviceScaleFactor: 1,
    isMobile: width < 768,
    hasTouch: width < 768,
  });
  for (const [route, selector, name] of TARGETS) {
    // main-level pages only at 390 to keep the set focused
    if (selector === "main" && width === 320) continue;
    const page = await ctx.newPage();
    await page.goto(BASE + route, { waitUntil: "load", timeout: 60000 });
    await page.waitForTimeout(700);
    try {
      const el = page.locator(selector).first();
      await el.screenshot({ path: `${OUT}/${width}_${name}.jpg`, type: "jpeg", quality: 62 });
    } catch (e) {
      console.log("MISS", width, name, String(e).slice(0, 80));
    }
    await page.close();
  }
  await ctx.close();
  console.log("sections captured @", width);
}
await browser.close();
console.log("done ->", OUT);
