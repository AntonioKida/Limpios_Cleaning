// One-off: identify the site-wide 404'd resource surfaced by run.mjs.
import { chromium } from "playwright";
const browser = await chromium.launch();
const page = await browser.newPage();
page.on("response", (r) => {
  if (r.status() >= 400) console.log(r.status(), r.url());
});
await page.goto("http://localhost:3000/en", { waitUntil: "networkidle" });
await page.waitForTimeout(1500);
await browser.close();
