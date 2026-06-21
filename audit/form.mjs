// Focused form audit: quote modal (validation + happy path), standalone /quote
// page, and contact-page form. Radio inputs are sr-only (a11y pattern), so we
// click their labels / use force. Patches audit/results.json -> quoteForm.
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const BASE = "http://localhost:3000";
const SHOTS = "audit/screenshots/desktop";

async function selectRadio(scope, value) {
  // Click the label wrapping the sr-only radio (real user action).
  const label = scope.locator(`label:has(input[type=radio][value="${value}"])`);
  if (await label.count()) { await label.first().click(); return; }
  await scope.locator(`input[type=radio][value="${value}"]`).check({ force: true });
}

async function quoteModal(ctx) {
  const out = { modalOpens: false, step1Validation: false, step4Validation: false, success: false, devNote: false, errors: [] };
  const page = await ctx.newPage();
  try {
    await page.goto(BASE + "/en", { waitUntil: "load" });
    await page.waitForTimeout(1000);
    await page.locator('main a[href*="/quote"]').first().click();
    const dlg = page.locator('[role=dialog]');
    await dlg.waitFor({ state: "visible", timeout: 10000 });
    out.modalOpens = true;

    await dlg.getByRole("button", { name: /^Next$/i }).click();
    await page.waitForTimeout(600);
    out.step1Validation = (await dlg.getByText(/choose a service/i).count()) > 0;

    await selectRadio(dlg, "deep-cleaning");
    await dlg.getByRole("button", { name: /^Next$/i }).click();
    await page.waitForTimeout(500);
    await selectRadio(dlg, "house");
    await dlg.getByRole("button", { name: /^Next$/i }).click();
    await page.waitForTimeout(500);
    await selectRadio(dlg, "biweekly");
    await dlg.getByRole("button", { name: /^Next$/i }).click();
    await page.waitForTimeout(500);

    await dlg.getByRole("button", { name: /free quote/i }).last().click();
    await page.waitForTimeout(600);
    out.step4Validation = (await dlg.getByText(/enter your name/i).count()) > 0;

    await dlg.locator("#name").fill("Audit User");
    await dlg.locator("#email").fill("audit@example.com");
    await dlg.locator("#phone").fill("4075551234");
    await dlg.locator('input[type=checkbox]').check();
    try { await page.screenshot({ path: path.join(SHOTS, "_quote-step4.png") }); } catch {}
    await dlg.getByRole("button", { name: /free quote/i }).last().click();
    await page.waitForTimeout(2200);
    out.success = (await dlg.getByText(/Request received/i).count()) > 0;
    out.devNote = (await dlg.getByText(/server console/i).count()) > 0;
    try { await page.screenshot({ path: path.join(SHOTS, "_quote-success.png") }); } catch {}
  } catch (e) { out.errors.push(String(e).slice(0, 200)); }
  await page.close();
  return out;
}

async function standaloneQuote(ctx) {
  const out = { prefillsService: false, submits: false, errors: [] };
  const page = await ctx.newPage();
  try {
    await page.goto(BASE + "/en/quote?service=commercial", { waitUntil: "load" });
    await page.waitForTimeout(900);
    // commercial preselected -> its radio checked
    out.prefillsService = await page.locator('input[type=radio][value="commercial"]').isChecked().catch(() => false);
    const main = page.locator("main");
    await main.getByRole("button", { name: /^Next$/i }).click();
    await page.waitForTimeout(400);
    await selectRadio(main, "office");
    await main.getByRole("button", { name: /^Next$/i }).click();
    await page.waitForTimeout(400);
    await selectRadio(main, "monthly");
    await main.getByRole("button", { name: /^Next$/i }).click();
    await page.waitForTimeout(400);
    await main.locator("#name").fill("Audit Two");
    await main.locator("#email").fill("two@example.com");
    await main.locator("#phone").fill("4075550000");
    await main.locator('input[type=checkbox]').check();
    await main.getByRole("button", { name: /free quote/i }).last().click();
    await page.waitForTimeout(2200);
    out.submits = (await main.getByText(/Request received/i).count()) > 0;
  } catch (e) { out.errors.push(String(e).slice(0, 200)); }
  await page.close();
  return out;
}

async function contactForm(ctx) {
  const out = { hasForm: false, hasBookingSeam: false, hasHours: false, errors: [] };
  const page = await ctx.newPage();
  try {
    await page.goto(BASE + "/en/contact", { waitUntil: "load" });
    await page.waitForTimeout(700);
    out.hasForm = (await page.locator("form").count()) > 0;
    out.hasBookingSeam = (await page.locator("[data-booking-embed]").count()) > 0;
    out.hasHours = (await page.getByText(/Monday|Hours/i).count()) > 0;
  } catch (e) { out.errors.push(String(e).slice(0, 200)); }
  await page.close();
  return out;
}

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1366, height: 900 } });
  const quoteForm = await quoteModal(ctx);
  const standalone = await standaloneQuote(ctx);
  const contact = await contactForm(ctx);
  await browser.close();

  const merged = { quoteModal: quoteForm, standaloneQuote: standalone, contact };
  console.log(JSON.stringify(merged, null, 2));

  const p = "audit/results.json";
  if (fs.existsSync(p)) {
    const r = JSON.parse(fs.readFileSync(p, "utf8"));
    r.quoteForm = merged;
    fs.writeFileSync(p, JSON.stringify(r, null, 2));
    console.log("\nPatched audit/results.json -> quoteForm");
  }
})();
