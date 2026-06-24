// Placeholder-leakage guard. Fails the commit / CI when TODO / FIXME / "(TODO
// confirm" / "LIC# 000000000" appear in shipped source or copy — UNLESS the match
// is one of the known, documented owner-content seams (see ALLOW below, which is
// the §5 OWNER list in docs/UX_UI_AUDIT_FINAL.md). The goal: known placeholders
// pass (they're waiting on Papo's real content), but any NEW placeholder is blocked
// so it can't silently ship.
//
// Escape hatch: `PLACEHOLDER_OK=1` downgrades a hard failure to a warning.
// Run: node scripts/check-placeholders.mjs   (npm run check:placeholders)
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

const ROOT = process.cwd();
const SCAN_DIRS = ["src", "messages"];
const EXTS = new Set([".ts", ".tsx", ".json"]);
const PATTERN = /\bTODO\b|\bFIXME\b|\(TODO confirm|LIC# 0{9}/;

// Known, accepted owner-content / documented dev seams. A match is allowed when:
//  - its file lives in the content layer (src/content/** — the designated home of
//    owner-pending data: license, pricing, founder, hours, GBP, gallery/media seams), OR
//  - its file is one of these documented owner/deploy seam files, OR
//  - the matched line is one of the known rendered-copy placeholders below.
const ALLOW_FILE_PREFIXES = [`src${sep}content${sep}`];
const ALLOW_FILES = new Set(
  [
    "src/app/api/lead/route.ts", // LEAD_FROM_EMAIL verified-sender note (deploy)
    "src/app/[locale]/about/page.tsx", // real owner photo (owner)
    "src/app/[locale]/contact/page.tsx", // real map embed (owner/deploy)
    "src/app/[locale]/reviews/page.tsx", // real Google review URL (owner)
    "src/components/brand/logo.tsx", // real vector mark (owner)
    "src/components/brand/mascot.tsx", // transparent mascot PNG (owner)
    "src/components/layout/footer.tsx", // real license number (owner)
    "src/components/sections/service-area.tsx", // real map embed (owner)
  ].map((p) => p.split("/").join(sep)),
);
// Known rendered-copy placeholders (allowed anywhere — they're the (TODO confirm
// with Papo) claims + the placeholder license, all on the §5 OWNER list).
const ALLOW_LINE = [/\(TODO confirm/, /LIC# 0{9}/];

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) out.push(...walk(full));
    else if (EXTS.has(name.slice(name.lastIndexOf(".")))) out.push(full);
  }
  return out;
}

function isAllowed(relPath, line) {
  if (ALLOW_FILE_PREFIXES.some((p) => relPath.startsWith(p))) return true;
  if (ALLOW_FILES.has(relPath)) return true;
  return ALLOW_LINE.some((re) => re.test(line));
}

const known = [];
const blocking = [];

for (const dir of SCAN_DIRS) {
  let files;
  try {
    files = walk(join(ROOT, dir));
  } catch {
    continue;
  }
  for (const file of files) {
    const rel = relative(ROOT, file);
    const lines = readFileSync(file, "utf8").split(/\r?\n/);
    lines.forEach((line, i) => {
      if (!PATTERN.test(line)) return;
      const entry = `${rel}:${i + 1}  ${line.trim().slice(0, 110)}`;
      (isAllowed(rel, line) ? known : blocking).push(entry);
    });
  }
}

if (known.length) {
  console.log(`\n⚠  ${known.length} known owner-content placeholder(s) (expected — on the §5 OWNER list):`);
  for (const e of known) console.log(`   · ${e}`);
}

if (blocking.length) {
  console.error(`\n✖  ${blocking.length} NEW placeholder(s) that must not ship:`);
  for (const e of blocking) console.error(`   ✗ ${e}`);
  if (process.env.PLACEHOLDER_OK) {
    console.error("\n   PLACEHOLDER_OK set → downgraded to a warning (not blocking).\n");
    process.exit(0);
  }
  console.error(
    "\n   Fix these, move them into the content layer (src/content/**), or — if genuinely\n" +
      "   a known owner item — add the file/line to ALLOW in scripts/check-placeholders.mjs.\n" +
      "   To bypass once: PLACEHOLDER_OK=1 git commit ...\n",
  );
  process.exit(1);
}

console.log(`\n✓ Placeholder guard: no new placeholder leakage (${known.length} known owner item(s) flagged).\n`);
