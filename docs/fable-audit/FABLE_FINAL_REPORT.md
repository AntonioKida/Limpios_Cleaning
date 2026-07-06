# FABLE FINAL REPORT — repositioning + audit of limpioscleaning.com (repo)

**Run:** 2026-07-06 · Claude Fable 5, auditor + implementer mode
**Branch:** `fable/reposition-audit` · all gates green (`typecheck · lint · test · build`)
**Trail:** human-readable in `docs/fable-audit/` · raw harness in `audit/fable/`
(sub-agent task definitions + verbatim returns, research notes, media vision
notes, scripts + raw outputs, screenshots at 320/390/768/1024/1440 with
reveals neutralized, integrity evidence log). The prior harness
(`audit/run.mjs` + `audit/results.json`) was extended and re-run — final
results.json reflects the shipped build.

---

## 1. Verdict in five sentences

The repo told a residential-first, price-anchored, city-enumerated story; the
real business — per the owner AND my independent research (which agree on
every material point) — is a **commercial-first cleaning company serving
Central Florida from Lake County, selling through free walkthroughs + written
estimates**. The site now tells that story coherently in both languages: five
B2B services (window + carpet added with real proof media), a
who-we-work-with section for the four buyer segments, the walkthrough model
everywhere prices used to be, and verified credentials (South Lake Chamber
membership) in place of unsubstantiated ones ("5-star rated" with zero
reviews anywhere — removed). All three decision gates were implemented as
reversible defaults and are flagged below for the owner's sign-off. The prior
quality baseline held after every change: axe 0, CLS 0.000, one h1, no
overflow, parity green, honesty gates intact, quote flow green end-to-end.
The CODE bucket is empty again; what remains is owner truth (reviews, license
number, COI facts, proof imagery) and the unchanged DEPLOY list.

## 2. Context reconciliation (full doc: `00-context-reconciliation.md`)

Independent research (Facebook, Instagram, chamber directory + Best of South
Lake nomination, Florida registries, Yelp, the GoDaddy lander) established:
the business self-describes as **"a Commercial Cleaning Company… commercial
cleaning solutions throughout Lake County and surrounding areas… Move out
cleaning services for Property Managers"**; IG bio: "Central Florida Based
Commercial Cleaning Services". Legal entity **Judean Services LLC** (filed
2023-09-18; DBA 2023-10-14), president Hubert C. "Papo" Noboa. **Chamber
membership verified.** **Zero public reviews found anywhere** and **no
discoverable Google Business Profile** — which makes the repo's review
honesty-gate factually mandatory and GBP creation the single highest-leverage
owner action. Divergences fixed: audience (D1), service set (D2/G1), area
framing (D3/G2), pricing anchors (D4), credentials (D5/G3), founding year
(2021→2023, registry-based), Facebook URL (real page), rating placeholder
(kept gated).

## 3. What was repositioned (full change-set: `40-repositioning-changes.md`)

- **Services:** primary five = commercial · post-construction · move-in/out ·
  **window (new)** · **carpet (new)**; residential, deep-cleaning and
  interior-painting demoted reversibly (G1) — routes, copy, quote options and
  sitemap entries all preserved.
- **Pricing:** every "from $X" removed (repo-wide, EN+ES, verified zero `$`
  anchors in rendered HTML); walkthrough + written estimate model on every
  surface; pricing page = engagement types + the owner's own estimate factors
  (sqft · scope · condition · crew · frequency).
- **Area:** "Central Florida, based in Lake County" everywhere; city pages
  kept for SEO but retoned; ZIP chips removed (G2).
- **Credentials:** chamber membership (verified) as hero chip, trust-bar item,
  footer line, About card, JSON-LD `memberOf`; precise licensing language (G3);
  placeholder license number and dead review link now hidden until real.
- **Copy:** hero, audiences section (new), steps (walkthrough→estimate→clean),
  why-us, FAQ (walkthrough/area/homes items new; dollar figures gone), About
  story retuned B2B; full ES parity maintained (11 tests green).
- **Lead pipeline:** B2B property types (office/construction/HOA), custom +
  per-turnover frequencies, real Company field (honeypot safely renamed),
  estimate-language throughout.

## 4. Media integrated (full catalog: `10-media-catalog.md`)

All 20 new images + 2 videos analyzed with vision. Shipped: **11 job photos**
(native-aspect WebP + blur, new `process-photos.mjs` pipeline) placed by
service (post-construction arc: during→equipment→after; window proof;
detail/brand shots on About); **2 new gallery pairs** (img27/28 via the
existing split pipeline); **Vid9** = muted 1.39 MB self-hosted window clip +
poster (native playback added to the facade component); **Vid8** = poster-only
seam — the on-hand copy is an Instagram repost with a baked-in overlay and a
copyrighted music credit ("Hustlin'"), so it must NOT be published as-is;
owner re-uploads the clean original muted to unlisted YouTube (Vid1–7
pattern). Not shipped (redundant/weaker, documented per-asset): img12, 13,
17, 21, 22, 23, 24. **Gaps:** no carpet footage and no new commercial-interior
imagery exist yet — the two proof holes only the owner can fill. **Consent
flag:** img16 (crew member partially identifiable in mask/cap).

## 5. Audit (full findings: `50-findings.md`; role reports: `20-role-flows/`)

Method: Playwright+axe harness over 53 page-loads (EN desktop+mobile, ES
sample) + E2E quote flow; five persona walkthroughs (homeowner, property
manager, HOA board, construction ops, commercial owner) as parallel
sub-agents; independent 9-point integrity verification (sitemap, metadata,
JSON-LD, honesty gates, price sweep, i18n, media wiring, TODO leakage, link
crawl) — **9/9 PASS**; my own vision review of section captures at
320/390/1440. **17 findings fixed** (3×P1, 7×P2, 7×P3 — table in
50-findings.md), **6 accepted with rationale**. Personas' shared verdict: the
B2B messaging genuinely lands ("would call" ×3), but vendor-onboarding
*documents* (COI, W-9, references, real license) all currently resolve to a
phone call — those are owner facts, parked below.

## 6. Decision gates — for Papo's sign-off (full write-ups: `30-decision-gates.md`)

- **G1 (residential/deep/painting):** demoted, not deleted; reversible with
  two flag flips. **Recommend keeping the demotion**; owner confirms whether
  painting is still offered at all.
- **G2 (city pages):** kept + retoned broad; ZIP chips removed. **Recommend
  keeping pages** at least until a GBP exists; consolidation path documented.
- **G3 (licensing wording):** "Licensed & insured" badges backed by a precise
  FAQ explanation (business license; Florida requires no cleaning trade
  license; nothing implies otherwise). **Wording awaits owner sign-off**;
  cautious alternative documented (one key).

## 7. Three-bucket status

**CODE — EMPTY.** Every audit finding is either fixed (17) or accepted with
written rationale (6). Gates green; baseline re-verified post-fix.

**OWNER — refreshed for the new positioning** (was 28 items; now organized by
leverage):

*Highest leverage (growth-blocking):*
1. **Create + verify a Google Business Profile** — none exists; with 0 reviews
   anywhere this is the #1 lever. Then paste the real review URL
   (`site.ts rating.reviewUrl`) and start collecting reviews (aim for PM /
   builder / HOA / office voices; replace the disclaimed samples).
2. **Real license number** → `site.ts license` + flip `licenseIsPlaceholder`
   (footer line un-hides itself).
3. **Insurance facts for the site:** COI-on-request? GL + workers' comp?
   additional-insured for HOAs? → unlocks the single most-requested trust
   content from all three B2B personas.
4. **Proof imagery:** commercial-interior and carpet before/afters; a
   construction-site pair. (Current gallery is residential-toned — the last
   visual holdover of the old positioning.)

*Sign-offs on this run's choices:*
5. G1/G2/G3 calls above. 6. Window + carpet "what's included" scope lists.
7. Founded year 2023 (registry) — confirm. 8. img16 publish consent.
9. Vid8: re-upload clean original, muted, unlisted YouTube → paste ID.
10. Photo-documentation policy for turnovers (if real, restore the stronger
    copy that was softened in F9 — it's a differentiator).

*Carried over unchanged:* hours, geo, founder name/photo/video, mascot PNG,
vector logo, HEPA/eco/24h-re-clean/military-story confirmations, higher-res
gallery originals, ES native-speaker review, booking provider, real map embeds.

**DEPLOY — unchanged:** DNS → Vercel, Resend domain + `LEAD_FROM_EMAIL`,
Upstash KV, Clarity/GA IDs, Lighthouse ≥95 re-check on a Vercel preview,
video playback check on the deployed origin (incl. the `_vercel/insights`
404 disappearing).

## 8. What to improve next (prioritized)

1. GBP + first 10 real reviews (owner; everything else compounds on this).
2. COI/vendor-packet content block once facts land (site work, ~1 day).
3. Commercial proof imagery → swap into gallery flagships (site work, trivial
   once photos exist).
4. A dedicated property-manager landing page (the PM persona's only structural
   ask; current deep-link to move-in-out is serviceable).
5. Booking integration (existing seam) once volume justifies it.
6. Consider per-city unique prose if city pages start ranking (thin-content
   risk documented since the prior audit).

## 9. Success-bar self-check

(a) The site now reads commercial-first in both languages with the owner's
five services, walkthrough pricing and verified credentials — reconciled
against independent research, not just the brief. (b) Every investigative
step is inspectable: sub-agent prompts + verbatim returns, raw research notes
with URLs/timestamps, per-asset vision notes, exact ffmpeg/sharp commands,
harness outputs, screenshots, and the integrity evidence log are all
committed. (c) The CODE bucket contains nothing that isn't an owner decision
or real content — verified by re-running the full gate + harness after the
final fix batch.
