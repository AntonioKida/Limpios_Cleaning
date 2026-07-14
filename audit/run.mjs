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

/**
 * Routes come from the live sitemap, not a hardcoded list. The old hardcoded list
 * silently went stale (it was still auditing /reviews months after that page was
 * deleted, and never covered /trusted-by), which is exactly the failure a route
 * audit is supposed to catch. Deriving from sitemap.xml means the audit surface
 * follows the app automatically. /quote is unioned in because it is a modal route
 * that is intentionally not in the sitemap.
 */
async function discoverRoutes() {
  const res = await fetch(`${BASE}/sitemap.xml`);
  if (!res.ok) throw new Error(`sitemap.xml -> ${res.status}`);
  const xml = await res.text();
  const paths = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((m) => new URL(m[1]).pathname.replace(/\/$/, ""))
    .filter(Boolean);
  const all = new Set([...paths, "/en/quote", "/es/quote"]);
  const en = [...all].filter((p) => p.startsWith("/en")).sort();
  const es = [...all].filter((p) => p.startsWith("/es")).sort();
  return { en, es };
}

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
      // wcag22aa is here because its absence hid a real bug: `target-size` is a
      // WCAG 2.2 rule, so axe reported 0 violations while 90 controls sat under
      // 44px and some under the 24x24 AA floor. Only the geometry harness caught
      // it. axe now checks it too, so the two agree.
      const r = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
        .analyze();
      axe = r.violations.map((v) => ({ id: v.id, impact: v.impact, help: v.help, nodes: v.nodes.length }));
    } catch (e) {
      axe = [{ id: "axe-error", impact: "n/a", help: String(e).slice(0, 140), nodes: 0 }];
    }
  }

  try { await page.screenshot({ path: path.join(SHOTS, device, slug(route) + ".png"), fullPage: true }); } catch {}
  await page.close();
  return { route, device, status, consoleMsgs, axe, ...data };
}

/**
 * Quote-form E2E for the 3-step audience fork (you -> details -> contact).
 *
 * This is deliberately a REGRESSION test for the validation bugs the client
 * reported, not just a happy path. The rule we are enforcing: a step the user has
 * merely *arrived at* must never show red error text. Errors are earned, by
 * touching a field or by attempting to submit. Three ways that broke before:
 *   - freshStepClean:  landing on the contact step pre-yelled "Please enter your name".
 *   - audienceErrorClears: the audience error stuck around after you picked an option.
 *   - summaryDoesNotStick: the error summary reappeared every time you stepped back
 *     and forward again, because RHF's global isSubmitted never resets.
 * If any of these regress, the flag flips false and the audit reports it.
 */
async function testQuoteFlow(ctx) {
  const out = {
    modalOpens: false,
    step0FreshClean: false,
    step0Validation: false,
    audienceErrorClears: false,
    step1FreshClean: false,
    contactFreshClean: false,
    submitEmptyShowsSummary: false,
    summaryDoesNotStick: false,
    success: false,
    errors: [],
  };
  const page = await ctx.newPage();
  try {
    await page.goto(BASE + "/en/quote", { waitUntil: "load" });
    await page.waitForTimeout(1200);
    const dialog = page.locator("[role=dialog]").first();
    const form = (await dialog.count()) ? dialog : page.locator("form").first();
    await form.waitFor({ state: "visible", timeout: 15000 });
    out.modalOpens = true;

    // Any visible "Please …" string is a validation error being shown.
    const errs = () => form.locator("text=/Please /i").count();
    const next = () => form.getByRole("button", { name: /^Next$/i }).click();

    // 1. Fresh step 0: nothing touched, nothing submitted -> zero errors.
    out.step0FreshClean = (await errs()) === 0;

    // 2. Next with no audience picked -> the audience error appears.
    await next();
    await page.waitForTimeout(400);
    out.step0Validation = (await form.locator("text=/who you are/i").count()) > 0;

    // 3. Pick an audience -> that error must clear immediately (was sticky).
    await form.locator('label:has(input[type=radio][value="business"])').click();
    await page.waitForTimeout(300);
    out.audienceErrorClears = (await form.locator("text=/who you are/i").count()) === 0;

    // 4. Details step: every field optional, so arriving must be silent.
    await next();
    await page.waitForTimeout(500);
    out.step1FreshClean = (await errs()) === 0;

    // 5. Contact step: arriving must be silent (the bug the client reported).
    await next();
    await page.waitForTimeout(500);
    out.contactFreshClean = (await errs()) === 0;

    // 6. Now actually submit empty -> the calm summary is expected.
    const submit = () => form.getByRole("button", { name: /free estimate/i }).last().click();
    await submit();
    await page.waitForTimeout(600);
    out.submitEmptyShowsSummary =
      (await form.locator("text=/complete the required fields/i").count()) > 0;

    // 7. Step back and forward -> the summary must NOT follow you around.
    await form.getByRole("button", { name: /^Back$/i }).click();
    await page.waitForTimeout(400);
    await next();
    await page.waitForTimeout(500);
    out.summaryDoesNotStick =
      (await form.locator("text=/complete the required fields/i").count()) === 0;

    // 8. Happy path.
    await form.locator("#name").fill("Audit User");
    await form.locator("#email").fill("audit@example.com");
    await form.locator("#phone").fill("4075551234");
    await form.locator("input[type=checkbox]").last().check();
    await submit();
    await page.waitForTimeout(3000);
    // Scope to the PAGE, not the form: on success the component unmounts the form
    // and renders the confirmation panel in its place, so a form-scoped locator
    // would always find nothing and report a false failure.
    out.success = (await page.locator("text=/Request received/i").count()) > 0;
    try { await page.screenshot({ path: path.join(SHOTS, "desktop", "_quote-success.png") }); } catch {}
  } catch (e) {
    out.errors.push(String(e).slice(0, 200));
  }
  await page.close();
  return out;
}

/**
 * The MODAL path, which is what every CTA on the site actually opens. The /quote
 * page is the no-JS fallback and behaves differently, so testing it alone proved
 * nothing: a QC pass caught the reported bug still reproducing here after the page
 * flow was green. Radix autofocuses the first tabbable node on open — the sr-only
 * audience radio — and blurring it marked the field touched, so onTouched
 * validation painted an error at someone who had done nothing. Asserts three
 * things: clean on open, clean after an innocent click, and STILL errors when the
 * user actually tries to advance with nothing selected.
 */
async function testQuoteModal(ctx, locale, errorRe) {
  const out = { opens: false, cleanOnOpen: false, cleanAfterNeutralClick: false, errorsWhenEarned: false, autofocus: null };
  const page = await ctx.newPage();
  try {
    await page.goto(`${BASE}/${locale}`, { waitUntil: "load" });
    await page.waitForTimeout(1200);
    await page.locator('a[data-analytics="quote-cta"]').first().click();
    const dlg = page.locator("[role=dialog]");
    await dlg.waitFor({ state: "visible", timeout: 10000 });
    await page.waitForTimeout(600);
    out.opens = true;
    out.autofocus = await page.evaluate(() => document.activeElement?.tagName ?? "none");
    out.cleanOnOpen = (await dlg.locator(`text=${errorRe}`).count()) === 0;
    await dlg.getByRole("heading").first().click({ force: true });
    await page.waitForTimeout(400);
    out.cleanAfterNeutralClick = (await dlg.locator(`text=${errorRe}`).count()) === 0;
    await dlg.getByRole("button", { name: /^(Next|Siguiente)$/i }).click();
    await page.waitForTimeout(500);
    out.errorsWhenEarned = (await dlg.locator(`text=${errorRe}`).count()) > 0;
  } catch (e) {
    out.error = String(e).slice(0, 160);
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
  const { en: enRoutes, es: esRoutes } = await discoverRoutes();
  const browser = await chromium.launch();
  const results = { generatedAt: new Date().toISOString(), base: BASE, mode: "next start (production build)", pages: [], graph: {}, quoteForm: {} };

  const deskCtx = await browser.newContext({ viewport: DESKTOP, deviceScaleFactor: 1 });
  const mobCtx = await browser.newContext({ viewport: MOBILE, deviceScaleFactor: 2, isMobile: true, hasTouch: true });

  console.log(`== Routes from sitemap: ${enRoutes.length} EN + ${esRoutes.length} ES ==`);
  console.log("== Desktop EN crawl (axe) ==");
  for (const r of enRoutes) { const res = await auditPage(deskCtx, r, "desktop"); results.pages.push(res); console.log(`  ${res.status} ${r} (axe:${res.axe ? res.axe.length : "-"})`); }
  console.log("== Mobile EN crawl ==");
  for (const r of enRoutes) { const res = await auditPage(mobCtx, r, "mobile"); results.pages.push(res); console.log(`  ${res.status} ${r} overflow:${res.scrollW > res.innerW}`); }
  // ES gets the same axe treatment as EN. It used to be a 5-route sample, which
  // meant a Spanish-only a11y regression (longer strings, different labels) could
  // ship unseen on 17 of 22 pages.
  console.log("== Desktop ES crawl (axe) ==");
  for (const r of esRoutes) { const res = await auditPage(deskCtx, r, "desktop"); results.pages.push(res); console.log(`  ${res.status} ${r} (axe:${res.axe ? res.axe.length : "-"})`); }
  console.log("== Mobile ES crawl ==");
  for (const r of esRoutes) { const res = await auditPage(mobCtx, r, "mobile"); results.pages.push(res); console.log(`  ${res.status} ${r} overflow:${res.scrollW > res.innerW}`); }

  console.log("== Quote form flow (page) ==");
  results.quoteForm = await testQuoteFlow(deskCtx);
  console.log("  ", JSON.stringify(results.quoteForm));

  console.log("== Quote modal (the path every CTA opens) ==");
  results.quoteModal = {
    en: await testQuoteModal(deskCtx, "en", /Please tell us who you are/i),
    es: await testQuoteModal(deskCtx, "es", /qui[eé]n es usted/i),
  };
  console.log("  ", JSON.stringify(results.quoteModal));

  results.graph = buildGraph(results.pages);

  await browser.close();
  fs.writeFileSync(path.join(OUT, "results.json"), JSON.stringify(results, null, 2));
  console.log("\nWrote audit/results.json; screenshots in audit/screenshots/");
})();
