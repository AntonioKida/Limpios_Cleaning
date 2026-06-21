import fs from "node:fs";
const r = JSON.parse(fs.readFileSync("audit/results.json","utf8"));
const desk = r.pages.filter(p=>p.device==="desktop" && p.route.startsWith("/en"));
const mob = r.pages.filter(p=>p.device==="mobile");

// axe
const axeAll = {};
for (const p of desk) for (const v of (p.axe||[])) { const k=`${v.id}|${v.impact}`; axeAll[k]=axeAll[k]||{id:v.id,impact:v.impact,help:v.help,pages:[],nodes:0}; axeAll[k].pages.push(p.route.replace('/en','')||'/'); axeAll[k].nodes+=v.nodes; }
console.log("=== AXE violations (desktop EN) ===");
console.log(Object.values(axeAll).length? Object.values(axeAll).map(v=>`  [${v.impact}] ${v.id} — ${v.nodes} nodes on ${v.pages.length} page(s): ${v.pages.join(', ')}\n     ${v.help}`).join("\n") : "  none");

// console
const con = {};
for (const p of r.pages) for (const m of (p.consoleMsgs||[])) { const t=m.text.replace(/\d+/g,'#').slice(0,80); con[t]=(con[t]||0)+1; }
console.log("\n=== Console errors/warnings (unique, all pages) ===");
console.log(Object.keys(con).length? Object.entries(con).map(([t,n])=>`  (${n}x) ${t}`).join("\n"):"  none");

// h1 / alt
console.log("\n=== Heading/alt issues ===");
const h1bad = desk.filter(p=>p.h1Count!==1).map(p=>`${p.route}(h1=${p.h1Count})`);
const altbad = desk.filter(p=>p.imgNoAlt>0).map(p=>`${p.route}(${p.imgNoAlt})`);
console.log("  pages with h1!=1:", h1bad.length?h1bad.join(", "):"none");
console.log("  pages with img missing alt:", altbad.length?altbad.join(", "):"none");
// heading order skips (h1->h3 etc)
const skips = [];
for (const p of desk){ const ls=p.headings.map(h=>h.l); for(let i=1;i<ls.length;i++){ if(ls[i]-ls[i-1]>1){ skips.push(`${p.route}: h${ls[i-1]}->h${ls[i]}`); break; } } }
console.log("  heading-level skips:", skips.length?skips.join(" | "):"none");

// SEO presence
console.log("\n=== SEO presence (desktop EN) ===");
const noCanon = desk.filter(p=>!p.canonical).map(p=>p.route);
const noDesc = desk.filter(p=>!p.metaDesc).map(p=>p.route);
const noHl = desk.filter(p=>p.hreflang<3).map(p=>`${p.route}(${p.hreflang})`);
const noOg = desk.filter(p=>!p.ogImage).map(p=>p.route);
console.log("  missing canonical:", noCanon.length?noCanon.join(", "):"none");
console.log("  missing meta description:", noDesc.length?noDesc.join(", "):"none");
console.log("  hreflang<3:", noHl.length?noHl.join(", "):"none (all have en/es/x-default)");
console.log("  missing og:image:", noOg.length?noOg.join(", "):"none");
console.log("  jsonld blocks by page:", desk.map(p=>`${p.route.replace('/en','')||'/'}:${p.jsonldBlocks}`).filter(x=>!x.endsWith(':0')).join(", "));

// mobile overflow
console.log("\n=== Mobile (390px) ===");
const ovf = mob.filter(p=>p.scrollW>p.innerW+1).map(p=>`${p.route}(${p.scrollW}>${p.innerW})`);
console.log("  horizontal overflow:", ovf.length?ovf.join(", "):"NONE");

// graph
console.log("\n=== Navigation graph (in-locale, EN) ===");
const g=r.graph;
const depths={}; for(const [route,d] of Object.entries(g.depth)) (depths[d]=depths[d]||[]).push(route.replace('/en','')||'/');
for(const d of Object.keys(depths).sort()) console.log(`  depth ${d} (${depths[d].length}): ${depths[d].join(", ")}`);
console.log("  max click-depth:", Math.max(...Object.values(g.depth)));
console.log("  reachable:", Object.keys(g.depth).length, "/ valid:", g.validCount);
console.log("  orphans (unreachable from home):", g.orphans.length?g.orphans.join(", "):"none");
const inboundSorted=Object.entries(g.inbound).sort((a,b)=>a[1]-b[1]);
console.log("  lowest inbound links:", inboundSorted.slice(0,6).map(([r,n])=>`${r.replace('/en','')||'/'}:${n}`).join(", "));
console.log("  link counts per page (out):", desk.map(p=>`${p.route.replace('/en','')||'/'}:${(p.links||[]).length}`).slice(0,3).join(", "),"...");

// perf (dev — indicative)
console.log("\n=== Perf (DEV server — indicative only, NOT production) ===");
const num=a=>a.filter(x=>x!=null);
const avg=a=>a.length?Math.round(a.reduce((s,x)=>s+x,0)/a.length):0;
console.log("  FCP avg/max ms:", avg(num(desk.map(p=>p.fcp))), "/", Math.max(...num(desk.map(p=>p.fcp))));
console.log("  LCP avg/max ms:", avg(num(desk.map(p=>p.lcp))), "/", Math.max(...num(desk.map(p=>p.lcp))));
console.log("  CLS avg/max:", (num(desk.map(p=>p.cls)).reduce((s,x)=>s+x,0)/desk.length).toFixed(3), "/", Math.max(...desk.map(p=>p.cls||0)).toFixed(3));
const clsBad=desk.filter(p=>(p.cls||0)>0.1).map(p=>`${p.route.replace('/en','')||'/'}:${p.cls}`);
console.log("  pages CLS>0.1:", clsBad.length?clsBad.join(", "):"none");
