// UX/UI + workflow audit harness (Playwright + axe-core).
// Usage: node audit/run.mjs   (dev server must be running on :3000)
import { chromium } from "playwright";
import { AxeBuilder } from "@axe-core/playwright";
import fs from "node:fs";
import path from "node:path";

const BASE = process.env.AUDIT_BASE || "http://localhost:3000";
const OUT = "audit";
const SHOTS = path.join(OUT, "screenshots");
for (const d of ["desktop", "mobile"]) fs.mkdirSync(path.join(SHOTS, d), { recursive: true });

const services = ["residential", "commercial", "deep-cleaning", "move-in-out", "post-construction", "interior-painting"];
const cities = ["clermont", "minneola", "groveland", "winter-garden", "horizon-west", "four-corners", "montverde", "mascotte"];
const paths = [
  "", "/services", ...services.map((s) => `/services/${s}`),
  "/pricing", "/service-areas", ...cities.map((c) => `/service-areas/${c}`),
  "/about", "/reviews", "/contact", "/quote",
];
const enRoutes = paths.map((p) => `/en${p}`);
const esSample = ["", "/services", "/services/deep-cleaning", "/pricing", "/contact"].map((p) => `/es${p}`);

const DESKTOP = { width: 1366, height: 900 };
const MOBILE = { width: 390, height: 844 };
const slug = (r) => (r.replace(/\//g, "_").replace(/^_/, "") || "home");

const INIT_PERF = `
window.__cls = 0; window.__lcp = 0;
try { new PerformanceObserver((l)=>{for(const e of l.getEntries()){ if(!e.hadRecentInput) window.__cls += e.value; }}).observe({type:'layout-shift', buffered:true}); } catch(e){}
try { new PerformanceObserver((l)=>{const es=l.getEntries(); window.__lcp = es[es.length-1].startTime;}).observe({type:'largest-contentful-paint', buffered:true}); } catch(e){}
`;

async function auditPage(ctx, route, device) {
  const page = await ctx.newPage();
  await page.addInitScript(INIT_PERF);
  const consoleMsgs = [];
  page.on("console", (m) => { if (m.type() === "error" || m.type() === "warning") consoleMsgs.push({ type: m.type(), text: m.text().slice(0, 240) }); });
  page.on("pageerror", (e) => consoleMsgs.push({ type: "pageerror", text: String(e).slice(0, 240) }));

  let status = 0;
  try {
    const resp = await page.goto(BASE + route, { waitUntil: "load", timeout: 60000 });
    status = resp ? resp.status() : 0;
  } catch (e) {
    consoleMsgs.push({ type: "nav-error", text: String(e).slice(0, 200) });
  }
  await page.waitForTimeout(1400);

  const data = await page.evaluate(() => {
    const nav = performance.getEntriesByType("navigation")[0] || {};
    const fcp = (performance.getEntriesByName("first-contentful-paint")[0] || {}).startTime || null;
    const links = [...document.querySelectorAll("a[href]")].map((a) => ({ href: a.getAttribute("href"), text: (a.textContent || "").trim().slice(0, 50) }));
    const headings = [...document.querySelectorAll("h1,h2,h3,h4")].map((h) => ({ l: +h.tagName[1], t: (h.textContent || "").trim().slice(0, 70) }));
    const imgs = [...document.querySelectorAll("img")];
    const buttons = [...document.querySelectorAll("button")].length;
    return {
      title: document.title,
      lang: document.documentElement.lang,
      metaDesc: document.querySelector("meta[name=description]")?.content || null,
      canonical: document.querySelector("link[rel=canonical]")?.href || null,
      hreflang: document.querySelectorAll("link[rel=alternate][hreflang]").length,
      ogImage: document.querySelector('meta[property="og:image"]')?.content || null,
      h1Count: document.querySelectorAll("h1").length,
      headings,
      imgCount: imgs.length,
      imgNoAlt: imgs.filter((i) => !i.hasAttribute("alt") || i.getAttribute("alt") === null).length,
      links,
      buttons,
      scrollW: document.documentElement.scrollWidth,
      innerW: window.innerWidth,
      ttfb: Math.round(nav.responseStart || 0),
      domContentLoaded: Math.round(nav.domContentLoadedEventEnd || 0),
      load: Math.round(nav.loadEventEnd || 0),
      fcp: fcp ? Math.round(fcp) : null,
      lcp: window.__lcp ? Math.round(window.__lcp) : null,
      cls: window.__cls ? +window.__cls.toFixed(4) : 0,
      jsonldBlocks: document.querySelectorAll('script[type="application/ld+json"]').length,
    };
  });

  let axe = null;
  if (device === "desktop") {
    try {
      const r = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
      axe = r.violations.map((v) => ({ id: v.id, impact: v.impact, help: v.help, nodes: v.nodes.length }));
    } catch (e) {
      axe = [{ id: "axe-error", impact: "n/a", help: String(e).slice(0, 140), nodes: 0 }];
    }
  }

  try { await page.screenshot({ path: path.join(SHOTS, device, slug(route) + ".png"), fullPage: true }); } catch {}
  await page.close();
  return { route, device, status, consoleMsgs, axe, ...data };
}

async function testQuoteFlow(ctx) {
  const page = await ctx.newPage();
  const out = { modalOpens: false, step1Validation: false, step4Validation: false, success: false, errors: [] };
  try {
    await page.goto(BASE + "/en", { waitUntil: "load" });
    await page.waitForTimeout(1000);
    await page.locator('main a[href*="/quote"]').first().click();
    const dialog = page.locator('[role=dialog]');
    await dialog.waitFor({ state: "visible", timeout: 10000 });
    out.modalOpens = true;

    // Step 1 validation (Next with nothing selected)
    await dialog.getByRole("button", { name: /^Next$/i }).click();
    await page.waitForTimeout(500);
    out.step1Validation = (await dialog.locator("text=/choose a service/i").count()) > 0;

    // Walk steps
    await dialog.locator('input[type=radio][value="deep-cleaning"]').check();
    await dialog.getByRole("button", { name: /^Next$/i }).click();
    await page.waitForTimeout(400);
    await dialog.locator('input[type=radio][value="house"]').check();
    await dialog.getByRole("button", { name: /^Next$/i }).click();
    await page.waitForTimeout(400);
    await dialog.locator('input[type=radio][value="biweekly"]').check();
    await dialog.getByRole("button", { name: /^Next$/i }).click();
    await page.waitForTimeout(400);

    // Step 4 validation (submit empty)
    await dialog.getByRole("button", { name: /free quote/i }).last().click();
    await page.waitForTimeout(500);
    out.step4Validation = (await dialog.locator("text=/enter your name/i").count()) > 0;

    // Fill + submit
    await dialog.locator("#name").fill("Audit User");
    await dialog.locator("#email").fill("audit@example.com");
    await dialog.locator("#phone").fill("4075551234");
    await dialog.locator('input[type=checkbox]').check();
    await dialog.getByRole("button", { name: /free quote/i }).last().click();
    await page.waitForTimeout(2000);
    out.success = (await dialog.locator("text=/Request received/i").count()) > 0;
    try { await page.screenshot({ path: path.join(SHOTS, "desktop", "_quote-success.png") }); } catch {}
  } catch (e) {
    out.errors.push(String(e).slice(0, 200));
  }
  await page.close();
  return out;
}

function buildGraph(pages) {
  // Use desktop EN pages
  const enPages = pages.filter((p) => p.device === "desktop" && p.route.startsWith("/en"));
  const valid = new Set(enPages.filter((p) => p.status === 200).map((p) => p.route));
  const adj = {};
  for (const p of enPages) {
    const set = new Set();
    for (const l of p.links || []) {
      let href = l.href || "";
      if (!href.startsWith("/en")) continue; // in-locale internal only
      href = href.split("#")[0].split("?")[0].replace(/\/$/, "");
      if (href === "") href = "/en";
      if (href !== p.route && valid.has(href)) set.add(href);
    }
    adj[p.route] = [...set];
  }
  // BFS from /en
  const depth = { "/en": 0 };
  const q = ["/en"];
  while (q.length) {
    const cur = q.shift();
    for (const n of adj[cur] || []) {
      if (depth[n] === undefined) { depth[n] = depth[cur] + 1; q.push(n); }
    }
  }
  const orphans = [...valid].filter((r) => depth[r] === undefined);
  // inbound link counts
  const inbound = {};
  for (const r of valid) inbound[r] = 0;
  for (const from of Object.keys(adj)) for (const to of adj[from]) inbound[to] = (inbound[to] || 0) + 1;
  return { adj, depth, orphans, inbound, validCount: valid.size };
}

(async () => {
  const browser = await chromium.launch();
  const results = { generatedAt: new Date().toISOString(), base: BASE, mode: "next dev (perf indicative only)", pages: [], graph: {}, quoteForm: {} };

  const deskCtx = await browser.newContext({ viewport: DESKTOP, deviceScaleFactor: 1 });
  const mobCtx = await browser.newContext({ viewport: MOBILE, deviceScaleFactor: 2, isMobile: true, hasTouch: true });

  console.log("== Desktop EN crawl ==");
  for (const r of enRoutes) { const res = await auditPage(deskCtx, r, "desktop"); results.pages.push(res); console.log(`  ${res.status} ${r} (axe:${res.axe ? res.axe.length : "-"})`); }
  console.log("== Mobile EN crawl ==");
  for (const r of enRoutes) { const res = await auditPage(mobCtx, r, "mobile"); results.pages.push(res); console.log(`  ${res.status} ${r} overflow:${res.scrollW > res.innerW}`); }
  console.log("== ES sample (desktop) ==");
  for (const r of esSample) { const res = await auditPage(deskCtx, r, "desktop"); results.pages.push(res); console.log(`  ${res.status} ${r}`); }

  console.log("== Quote form flow ==");
  results.quoteForm = await testQuoteFlow(deskCtx);
  console.log("  ", JSON.stringify(results.quoteForm));

  results.graph = buildGraph(results.pages);

  await browser.close();
  fs.writeFileSync(path.join(OUT, "results.json"), JSON.stringify(results, null, 2));
  console.log("\nWrote audit/results.json; screenshots in audit/screenshots/");
})();
