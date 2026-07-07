// Playwright smoke test for CI. Requires a running server on BASE (default
// :3000) — e.g. `npm run build && npm run start` then `npm run test:smoke`.
// Covers key routes, the no-JS progressive-enhancement path, and reduced-motion.
import { chromium } from "playwright";

const BASE = process.env.SMOKE_BASE || "http://localhost:3000";
const ROUTES = [
  "/en",
  "/es",
  "/en/services",
  "/en/services/residential",
  "/en/service-areas/clermont",
  "/en/pricing",
  "/en/contact",
  "/en/quote",
];

let failures = 0;
const ok = (name) => console.log(`  ✓ ${name}`);
const bad = (name, detail) => {
  failures++;
  console.error(`  ✗ ${name}${detail ? " — " + detail : ""}`);
};

// Known infra-only failures that never occur in real production. Vercel Analytics
// (`/_vercel/insights/script.js`) and Speed Insights (`/_vercel/speed-insights/script.js`)
// are served by Vercel's edge in prod but 404 on a local `next start` — documented
// localhost artifacts, not real broken assets. A genuinely missing image/poster (any
// other 4xx/5xx) still fails the smoke.
const IGNORE_RESOURCE = [/\/_vercel\/insights\//, /\/_vercel\/speed-insights\//];

const browser = await chromium.launch();

// 1. Key routes: 200, single h1, no JS errors, no real broken resources.
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  for (const route of ROUTES) {
    const page = await ctx.newPage();
    const errors = [];
    const badResources = [];
    page.on("console", (m) => {
      if (m.type() !== "error") return;
      // Generic resource-load errors carry no URL in the text; those are judged
      // by the response listener below (which can see + whitelist the URL).
      if (/Failed to load resource/i.test(m.text())) return;
      errors.push(m.text());
    });
    page.on("pageerror", (e) => errors.push(String(e)));
    page.on("response", (r) => {
      if (r.status() >= 400 && !IGNORE_RESOURCE.some((re) => re.test(r.url()))) {
        badResources.push(`${r.status()} ${r.url()}`);
      }
    });
    const resp = await page.goto(BASE + route, { waitUntil: "load", timeout: 45000 });
    await page.waitForTimeout(400);
    const h1 = await page.locator("h1").count();
    const status = resp?.status();
    if (status !== 200) bad(`route ${route} status`, String(status));
    else if (h1 !== 1) bad(`route ${route} h1 count`, String(h1));
    else if (errors.length) bad(`route ${route} console`, errors[0]?.slice(0, 80));
    else if (badResources.length) bad(`route ${route} resource`, badResources[0]?.slice(0, 90));
    else ok(`route ${route}`);
    await page.close();
  }
  await ctx.close();
}

// 2. No-JS progressive enhancement: content renders, CTA is a real /quote link,
//    scroll-reveal content is not stuck hidden.
{
  const ctx = await browser.newContext({ javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto(BASE + "/en", { waitUntil: "load" });
  const h1 = (await page.locator("h1").first().textContent()) || "";
  const quoteHref = await page.locator('a[href*="/quote"]').first().getAttribute("href");
  const cardsVisible = await page.locator('a[href*="/services/"]').first().isVisible().catch(() => false);
  if (!h1.trim()) bad("no-JS: hero h1 renders");
  else ok("no-JS: hero h1 renders");
  if (!quoteHref || !quoteHref.includes("/quote")) bad("no-JS: CTA is a real /quote link", String(quoteHref));
  else ok("no-JS: CTA links to /quote");
  if (!cardsVisible) bad("no-JS: reveal content visible (scripting:none fallback)");
  else ok("no-JS: reveal content visible");
  await ctx.close();
}

// 3. Reduced motion: reveal content is visible (no stuck opacity:0).
{
  const ctx = await browser.newContext({ reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto(BASE + "/en", { waitUntil: "load" });
  await page.waitForTimeout(600);
  const visible = await page.evaluate(() => {
    const cards = [...document.querySelectorAll('a[href*="/services/"]')];
    return cards.length > 0 && cards.every((c) => parseFloat(getComputedStyle(c).opacity) > 0.5);
  });
  if (!visible) bad("reduced-motion: service cards visible");
  else ok("reduced-motion: service cards visible");
  await ctx.close();
}

await browser.close();
console.log(failures ? `\nSMOKE FAILED (${failures})` : "\nSMOKE PASSED");
process.exit(failures ? 1 : 0);
