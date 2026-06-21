// Visual sign-off captures with reveals neutralized (reducedMotion makes the
// hero's signature reveal static; everything else is already still), so every
// section renders visible. Writes a curated set to docs/screenshots.
//   (server must be running) node audit/shots.mjs
import { chromium } from "playwright";
import path from "node:path";
import fs from "node:fs";

const BASE = process.env.AUDIT_BASE || "http://localhost:3000";
const OUT = "docs/screenshots";
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();

async function shoot(device, vp, routes, fullPage) {
  const ctx = await browser.newContext({
    viewport: vp,
    reducedMotion: "reduce",
    deviceScaleFactor: device === "mobile" ? 2 : 1,
    isMobile: device === "mobile",
  });
  for (const r of routes) {
    const page = await ctx.newPage();
    await page.goto(BASE + r, { waitUntil: "load" });
    await page.waitForTimeout(900);
    const slug = device + "-" + (r.replace(/\//g, "_").replace(/^_/, "") || "home");
    await page.screenshot({ path: path.join(OUT, slug + ".png"), fullPage });
    await page.close();
  }
  await ctx.close();
}

await shoot(
  "desktop",
  { width: 1366, height: 900 },
  ["/en", "/en/services", "/en/services/residential", "/en/pricing", "/en/about", "/en/contact", "/es"],
  true,
);
await shoot("mobile", { width: 390, height: 844 }, ["/en", "/en/pricing"], true);

await browser.close();
console.log("captured ->", OUT);
