// Copy guard. Fails the commit / CI on two classes of leakage in shipped source:
//
//   1. PLACEHOLDERS. TODO / FIXME / "(TODO confirm" / "LIC# 000000000" — UNLESS the
//      match is one of the known, documented owner-content seams (see ALLOW below,
//      which is the §5 OWNER list in docs/UX_UI_AUDIT_FINAL.md). Known placeholders
//      pass (they're waiting on Papo's real content); any NEW one is blocked so it
//      can't silently ship.
//
//   2. EM-DASHES (—) IN COPY. The em-dash cadence is the most recognizable
//      "written by an AI" tell, and the client asked for it gone. All 142 were swept
//      out of messages/{en,es}.json, so the baseline is ZERO and this guard keeps it
//      there. Scope is deliberate: every line of messages/** (it is pure copy), but
//      only NON-COMMENT lines of src/** — dev comments and JSDoc may use em-dashes
//      freely, since nobody ships them. That is why this file strips comments before
//      testing instead of grepping raw lines.
//
// Escape hatch: `PLACEHOLDER_OK=1` downgrades a hard failure to a warning.
// Run: node scripts/check-placeholders.mjs   (npm run check:placeholders)
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

const ROOT = process.cwd();
const SCAN_DIRS = ["src", "messages"];
const EXTS = new Set([".ts", ".tsx", ".json"]);
const PATTERN = /\bTODO\b|\bFIXME\b|\(TODO confirm|LIC# 0{9}/;
const EM_DASH = /—/;

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
    "src/components/brand/mascot.tsx", // transparent mascot PNG (owner)
  ].map((p) => p.split("/").join(sep)),
);
// Known rendered-copy placeholders (allowed anywhere — they're the (TODO confirm
// with Papo) claims + the placeholder license, all on the §5 OWNER list).
const ALLOW_LINE = [/\(TODO confirm/, /LIC# 0{9}/];

// Intentional em-dashes in copy, if a real one ever earns its place. Entries are
// "relativePath:line". Empty on purpose: the copy baseline is zero.
const EM_DASH_ALLOW = new Set([]);

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

/**
 * Blank out comments so the em-dash check only ever sees code + copy. Handles
 * `//`, `/* *\/` (including multi-line JSDoc) and JSX `{/* *\/}`. Line-comment
 * stripping skips `://` so URLs survive. JSON has no comments, so it passes
 * through untouched.
 */
function stripComments(text, isJson) {
  if (isJson) return text.split(/\r?\n/);
  let inBlock = false;
  return text.split(/\r?\n/).map((raw) => {
    let line = raw;
    if (inBlock) {
      const end = line.indexOf("*/");
      if (end === -1) return "";
      line = line.slice(end + 2);
      inBlock = false;
    }
    line = line.replace(/\/\*[\s\S]*?\*\//g, ""); // closed block comment(s)
    const open = line.indexOf("/*");
    if (open !== -1) {
      line = line.slice(0, open); // block comment opens and runs on
      inBlock = true;
    }
    return line.replace(/(^|[^:"'`])\/\/.*$/, "$1"); // trailing line comment
  });
}

function isAllowed(relPath, line) {
  if (ALLOW_FILE_PREFIXES.some((p) => relPath.startsWith(p))) return true;
  if (ALLOW_FILES.has(relPath)) return true;
  return ALLOW_LINE.some((re) => re.test(line));
}

const known = [];
const blocking = [];
const emDashes = [];

for (const dir of SCAN_DIRS) {
  let files;
  try {
    files = walk(join(ROOT, dir));
  } catch {
    continue;
  }
  for (const file of files) {
    const rel = relative(ROOT, file);
    const src = readFileSync(file, "utf8");
    const rawLines = src.split(/\r?\n/);
    const codeLines = stripComments(src, file.endsWith(".json"));

    rawLines.forEach((line, i) => {
      if (PATTERN.test(line)) {
        const entry = `${rel}:${i + 1}  ${line.trim().slice(0, 110)}`;
        (isAllowed(rel, line) ? known : blocking).push(entry);
      }
      // Em-dash: comment lines are exempt (stripped above) — only copy counts.
      if (EM_DASH.test(codeLines[i]) && !EM_DASH_ALLOW.has(`${rel}:${i + 1}`)) {
        emDashes.push(`${rel}:${i + 1}  ${line.trim().slice(0, 110)}`);
      }
    });
  }
}

if (known.length) {
  console.log(`\n⚠  ${known.length} known owner-content placeholder(s) (expected — on the §5 OWNER list):`);
  for (const e of known) console.log(`   · ${e}`);
}

if (emDashes.length) {
  console.error(`\n✖  ${emDashes.length} em-dash(es) in shipped copy (the "written by AI" tell):`);
  for (const e of emDashes) console.error(`   ✗ ${e}`);
  console.error(
    "\n   Rewrite with a period, comma or colon — do not swap in an en-dash (–) or a\n" +
      "   double hyphen. Dev comments may use em-dashes freely; only copy is checked.\n" +
      "   If one is genuinely intentional, add \"path:line\" to EM_DASH_ALLOW.\n",
  );
}

if (blocking.length) {
  console.error(`\n✖  ${blocking.length} NEW placeholder(s) that must not ship:`);
  for (const e of blocking) console.error(`   ✗ ${e}`);
  console.error(
    "\n   Fix these, move them into the content layer (src/content/**), or — if genuinely\n" +
      "   a known owner item — add the file/line to ALLOW in scripts/check-placeholders.mjs.\n",
  );
}

if (blocking.length || emDashes.length) {
  if (process.env.PLACEHOLDER_OK) {
    console.error("   PLACEHOLDER_OK set → downgraded to a warning (not blocking).\n");
    process.exit(0);
  }
  console.error("   To bypass once: PLACEHOLDER_OK=1 git commit ...\n");
  process.exit(1);
}

console.log(
  `\n✓ Copy guard: no new placeholder leakage (${known.length} known owner item(s) flagged), no em-dashes in copy.\n`,
);
