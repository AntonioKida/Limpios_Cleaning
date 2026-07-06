// Responsive geometry audit. Loads each route at every breakpoint and reports
// horizontal overflow (+ the offending elements), sub-44px tap targets on primary
// controls, sub-16px inputs, and CLS. Geometry is the source of truth.
//   BASE=https://… ROUTES="/en,/es,/en/pricing" node audit/responsive.mjs
import { chromium } from "playwright";

const BASE = process.env.BASE || "https://limpios-cleaning-one.vercel.app";
const ROUTES = (process.env.ROUTES || "/en,/es").split(",").map((r) => r.trim()).filter(Boolean);
const WIDTHS = [320, 360, 390, 414, 768, 834, 1024, 1280, 1440, 1920];
const LANDSCAPE = { w: 740, h: 360, name: "landscape" };

const MEASURE = () => {
  const doc = document.documentElement;
  const iw = window.innerWidth;
  const overflow = doc.scrollWidth - iw;
  // elements extending past the right edge (overflow offenders)
  const offenders = [];
  if (overflow > 1) {
    for (const el of document.querySelectorAll("body *")) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;
      if (r.right > iw + 2) {
        const cls = (typeof el.className === "string" ? el.className : "").slice(0, 40);
        offenders.push({ tag: el.tagName.toLowerCase(), cls, right: Math.round(r.right), w: Math.round(r.width) });
      }
    }
    offenders.sort((a, b) => b.right - a.right);
  }
  // primary interactive controls under 44px (buttons, toggles, inputs, slider, summary)
  const primarySel = "button, [role=button], summary, input:not([type=hidden]), select, textarea, a[data-analytics], a.inline-flex";
  const smallTap = [];
  for (const el of document.querySelectorAll(primarySel)) {
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue; // hidden
    const style = getComputedStyle(el);
    if (style.visibility === "hidden" || style.display === "none") continue;
    if (Math.min(r.width, r.height) < 44) {
      smallTap.push({ tag: el.tagName.toLowerCase(), label: (el.getAttribute("aria-label") || el.textContent || "").trim().slice(0, 24), w: Math.round(r.width), h: Math.round(r.height) });
    }
  }
  // inputs below 16px (iOS zoom)
  const smallInputs = [];
  for (const el of document.querySelectorAll("input:not([type=hidden]), select, textarea")) {
    const fs = parseFloat(getComputedStyle(el).fontSize);
    if (fs && fs < 16) smallInputs.push({ tag: el.tagName.toLowerCase(), fs: Math.round(fs * 10) / 10 });
  }
  return { iw, scrollW: doc.scrollWidth, overflow, offenders: offenders.slice(0, 5), smallTap, smallInputs };
};

const CLS_INIT = `window.__cls=0;try{new PerformanceObserver(l=>{for(const e of l.getEntries()){if(!e.hadRecentInput)window.__cls+=e.value;}}).observe({type:'layout-shift',buffered:true});}catch(e){}`;

const results = [];
const browser = await chromium.launch();

async function audit(route, vp, label, isMobile) {
  const ctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h }, isMobile, hasTouch: isMobile, deviceScaleFactor: isMobile ? 2 : 1 });
  const page = await ctx.newPage();
  await page.addInitScript(CLS_INIT);
  try {
    await page.goto(BASE + route, { waitUntil: "load", timeout: 45000 });
    await page.waitForTimeout(500);
    const data = await page.evaluate(MEASURE);
    const cls = await page.evaluate(() => +(window.__cls || 0).toFixed(4));
    results.push({ route, width: label, ...data, cls });
  } catch (e) {
    results.push({ route, width: label, error: String(e).slice(0, 80) });
  }
  await ctx.close();
}

for (const route of ROUTES) {
  for (const w of WIDTHS) await audit(route, { w, h: 900 }, String(w), w < 768);
  await audit(route, { w: LANDSCAPE.w, h: LANDSCAPE.h }, LANDSCAPE.name, true);
}

await browser.close();

// Summarize: only report rows with problems.
const problems = results.filter((r) => r.error || r.overflow > 1 || (r.smallTap && r.smallTap.length) || (r.smallInputs && r.smallInputs.length) || (r.cls || 0) > 0.1);
console.log(JSON.stringify({ base: BASE, routesAudited: ROUTES.length, totalChecks: results.length, problems }, null, 1));
