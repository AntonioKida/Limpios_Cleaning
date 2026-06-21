import { chromium } from "playwright";
import path from "node:path";
const BASE="http://localhost:3000";
const b=await chromium.launch();
async function shoot(device, vp){
  const ctx=await b.newContext({viewport:vp, reducedMotion:"reduce", deviceScaleFactor: device==="mobile"?2:1, isMobile: device==="mobile"});
  const routes = device==="mobile"
    ? ["/en","/en/pricing","/en/contact","/en/services/residential"]
    : ["/en","/en/services","/en/services/residential","/en/pricing","/en/service-areas","/en/service-areas/clermont","/en/about","/en/reviews","/en/contact","/en/quote","/es"];
  for(const r of routes){
    const page=await ctx.newPage();
    await page.goto(BASE+r,{waitUntil:"load"}); await page.waitForTimeout(900);
    const slug=(r.replace(/\//g,"_").replace(/^_/,"")||"home");
    await page.screenshot({path:path.join("audit/screenshots",device,slug+".png"),fullPage:true});
    await page.close();
  }
  await ctx.close();
}
await shoot("desktop",{width:1366,height:900});
await shoot("mobile",{width:390,height:844});
console.log("re-captured with reduced motion");
await b.close();
