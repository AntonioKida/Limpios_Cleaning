// Bundle-size visibility for the Turbopack build (which omits First Load JS).
// Reads .next/static/chunks, reports total + largest client JS (raw + gzip),
// and fails if a budget is exceeded. Run after `npm run build`.
//   node scripts/bundle-report.mjs            (report only)
//   BUNDLE_BUDGET_KB=320 node scripts/...      (fail if total gzip > budget)
// For per-route First Load JS, run `npm run build:sizes` (next build --webpack).
import { readdirSync, statSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { gzipSync } from "node:zlib";

const DIR = ".next/static/chunks";
if (!existsSync(DIR)) {
  console.error(`No build found at ${DIR}. Run \`npm run build\` first.`);
  process.exit(1);
}

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const s = statSync(p);
    if (s.isDirectory()) out.push(...walk(p));
    else if (name.endsWith(".js")) out.push({ p, size: s.size });
  }
  return out;
}

const files = walk(DIR).map((f) => ({
  ...f,
  gzip: gzipSync(readFileSync(f.p)).length,
}));

const totalRaw = files.reduce((a, f) => a + f.size, 0);
const totalGzip = files.reduce((a, f) => a + f.gzip, 0);
const kb = (n) => (n / 1024).toFixed(1) + " KB";

files.sort((a, b) => b.gzip - a.gzip);

console.log("\nClient JS chunks (.next/static/chunks)\n");
console.log("  gzip     raw      file");
for (const f of files.slice(0, 12)) {
  console.log(
    `  ${kb(f.gzip).padStart(8)} ${kb(f.size).padStart(8)}  ${f.p.replace(DIR + "/", "").replace(DIR + "\\", "")}`,
  );
}
console.log(`\n  ${files.length} JS chunks · total ${kb(totalRaw)} raw · ${kb(totalGzip)} gzip\n`);

const budgetKb = Number(process.env.BUNDLE_BUDGET_KB || 0);
if (budgetKb > 0 && totalGzip / 1024 > budgetKb) {
  console.error(`✗ Bundle budget exceeded: ${kb(totalGzip)} gzip > ${budgetKb} KB`);
  process.exit(1);
}
