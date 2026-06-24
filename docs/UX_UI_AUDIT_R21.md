# UX/UI Audit — Round 2.1 (closing gate)

**Scope.** Final verification after Round 2.1 shipped (A) structural refinements,
(B) Papo's real photos + video, and (C) analytics. This is both the automated
harness re-run **and** a holistic "does it still make sense" review, per §D of the
Round-2.1 brief. It is the last step, so it reflects the finished state.

**Method.** Audited against a **local production build** (`next build` →
`next start` on `:3100`), Playwright + axe-core (`audit/run.mjs`), the focused
form harness (`audit/form.mjs`), the CI smoke test (`audit/smoke.mjs`, incl. no-JS
+ reduced-motion), Vitest (parity + zod), and Lighthouse 13 (mobile / simulated
throttling). 49 page-audits (27 desktop incl. ES sample + 22 mobile EN).
Screenshots (reveals neutralised) in [`docs/screenshots/`](screenshots).

---

## Verdict

**Ship-ready pending the documented pre-launch content items.** Every baseline
check stayed green, every Round-2.1 risk (media CLS/LCP, slider a11y, portrait
video containment, placeholder leakage, honesty gate) verified clean, and the
only Lighthouse dings are the same three localhost-only artifacts from Round 2
that resolve on Vercel. No P0 launch-blockers introduced by this round. The
remaining items are pre-existing content placeholders awaiting Papo's input
(license #, the `(TODO confirm with Papo)` copy markers, real reviews) — all
intentional and listed below.

---

## 1. Baseline (had to stay green)

| Check | Result |
|---|---|
| axe-core WCAG 2.0/2.1 A/AA — 27 desktop routes EN+ES | **0 violations** |
| One `<h1>` per page (49 audits) | ✓ all = 1 |
| Heading-order skips | ✓ none |
| Images missing `alt` | ✓ 0 |
| Console errors (excl. localhost Vercel-insights 404) | ✓ none |
| Mobile horizontal overflow @ 390px (22 routes) | ✓ none |
| Horizontal overflow @ 320px (6 media-heavy spot routes) | ✓ none |
| Cumulative Layout Shift (max across 49 audits) | **0** |
| Quote modal — step-1 + step-4 validation, happy path, dev-note | ✓ all pass |
| Standalone `/quote?service=` prefill + submit | ✓ pass |
| Contact form + booking seam + hours | ✓ pass |
| Honeypot (hidden field drops bots) | ✓ in lead-schema + route |
| EN/ES key + ICU parity (Vitest) | ✓ pass |
| zod lead-schema unit tests | ✓ pass |
| Smoke (8 routes + no-JS PE + reduced-motion) | ✓ **SMOKE PASSED** |
| `typecheck · lint · test · build` | ✓ all green |

A real broken asset would still fail the smoke test — only the proven
Vercel-edge-served `/_vercel/insights/script.js` 404 (a localhost artifact) is
whitelisted, by URL, via the response listener (`audit/smoke.mjs`).

## 2. Real media (the round's actual risk)

**Before/after gallery + wipe slider** (`before-after-slider.tsx`)
- ✓ A transparent full-size `input[type=range]` drives the wipe → **mouse-drag,
  click-to-jump, touch, and keyboard (arrows)** all work, with a real slider role
  + label.
- ✓ **Static fallback:** renders at 50% on the server, so with no-JS /
  reduced-motion the comparison is still a labelled split (no autoplay, nothing
  stuck hidden).
- ✓ **Correct pairing:** all 9 pairs split left=before / right=after; before/after
  halves are dimension-identical (506×1024) so no mismatched/half-shifted frames.
  Verified visually (bathroom, fridge, shower) — grime left, clean right.
- ✓ **No CLS:** fixed `aspect-ratio` box + blur placeholders; max CLS = 0.
- ✓ Bilingual `alt` + caption per pair; flagships (img5/img2/img3) lead the
  homepage set; service pages pull their relevant pairs via `galleryForService`.

**Portrait video facade** (`portrait-video.tsx`)
- ✓ **9:16 portrait containers everywhere** — never forced into a 16:9 crop;
  contained cleanly on desktop (no letterbox) and mobile.
- ✓ **Poster-first, click-to-load:** the committed poster shows immediately
  (lazy, not the LCP element), the streamed player (YouTube-nocookie/Vimeo) only
  mounts on click → **never autoplays, reduced-motion safe, never blocks LCP**.
- ✓ **Live embeds:** the unlisted-YouTube IDs are wired
  (`youtube-nocookie.com/embed/<id>?autoplay=1&mute=1&rel=0&modestbranding=1&playsinline=1`).
  Verified the play button → iframe mount on click, and that every facade page
  renders its expected number of active play buttons (about 2, commercial 3,
  residential/deep-cleaning/move-in-out 1; homepage Why-us 1) with zero
  decorative-only stills.
- ✓ **"See us in action" showcase (self-hosted, chrome-free):** the clips were
  uploaded as YouTube Shorts, so the `/embed/` player inherits the cramped Shorts
  UI — unacceptable for a prime slot. Vid4 is served as a committed 3.1 MB muted
  MP4 (`/public/video/vid4-hero.mp4`) via a native `<video>` (`hero-video.tsx`).
  It lives in its **own centered section below the hero** (`see-in-action.tsx`,
  warm-neutral surface) — the hero is mascot-only again (single anchor, no
  competing focal points). Verified: muted autoplay-loop on capable devices
  (t advancing, src = the MP4) and **poster + no autoplay under reduced-motion**
  (paused at t=0); poster on no-JS. The headline stays the hero LCP element. The
  other placements stay on the YouTube facade.
- ✓ **Captions:** the clips are silent (muted re-uploads) → no subtitle track
  needed; the `spokenCaptions` cc-param seam remains for any future spoken clip.
- ✓ Placements per brief: Vid4 hero accent (mascot stays anchor), Vid3 Why-us +
  About standards, Vid7 About team, Vid1/4/6 commercial, Vid2 residential, Vid5
  move-in/out, Vid3 deep-cleaning.

**Performance protection**
- Gallery WebP halves ≈ 704 KB total; posters ≈ 448 KB; all via `next/image`
  (responsive srcset, blur). Raw source MP4s (38 MB) are **gitignored** — streamed
  off-repo, not served from Vercel.

## 3. Structural refinements (Round 2.1-A) landed

- ✓ **Trust-signal duplication gone** — no repeated trust band; the homepage runs
  Hero → TrustBar (4 stats, once) → Services → How-it-works → Why-us (4 distinct
  points) → Gallery → Reviews → Service area → FAQ → CTA.
- ✓ **"Why Limpios" re-angled** — no longer triple-states veteran/eco; the four
  points are team / checklist / quote-clarity / guarantee.
- ✓ **Padding tightened** (`section.tsx` `py-12 sm:py-16 lg:py-20`) without
  breaking rhythm or introducing overflow at any breakpoint.

## 4. Analytics (Round 2.1-C)

- ✓ Microsoft Clarity env-gated on `NEXT_PUBLIC_CLARITY_ID` (absent → no script
  emitted; verified the tag is **not** in output without the env). `afterInteractive`.
- ✓ `lib/analytics.ts` `track()` fans out to Vercel Analytics + GA4 + Clarity,
  each guarded — clicking a CTA fires tracking **and** still opens the modal; 0
  runtime errors observed.
- ✓ Scroll-depth (25/50/75/100%) + per-section in-view on the homepage's 7 id'd
  sections; conversion events for tap-to-call (`tel:`) and every quote CTA
  (`data-location`: hero / nav / nav-mobile / final-cta / service).
- ✓ Footer privacy/analytics disclosure (EN+ES). No consent gate (not legally
  required for a small FL service business; seam to add one is documented).

## 5. Lighthouse (local production build, `/en`)

| Category | Local | On Vercel (expected) |
|---|---|---|
| Accessibility | **100** | 100 |
| Best Practices | 96 | **100** — only ding is the insights-404 localhost artifact |
| SEO | 92 | **100** — only ding is `canonical` → production domain (correct) |
| Performance | 83 | **≥95** — LCP is the mascot under cold local `next/image`; CDN-served on Vercel |

**Core Web Vitals (local):** FCP 1.1 s · **CLS 0** · TBT 50 ms · LCP 4.7 s.
The media did **not** regress CLS (still 0) and is **not** the LCP element — the
hero video is a lazy poster; LCP is the hero mascot image, inflated only by
cold local image optimisation + Lighthouse throttling (same artifact as Round 2's
4.4 s). See [`docs/LIGHTHOUSE.md`](LIGHTHOUSE.md) for the three localhost-only
artifacts. **The authoritative ≥95 run must be re-done on the Vercel preview
after this push deploys.**

## 6. Conversion path

- ✓ Quote reachable in **0–1 clicks from every page**: the header CTA is global;
  hero + final-CTA on content pages.
- ✓ Tap-to-call works (every `tel:` resolves to `site.phone.href`); tracked.
- ✓ Service CTAs prefill (`?service=` → preselected radio, verified for commercial).

## 7. Placeholder / honesty inventory

Grep of catalogs + rendered EN/ES output for `TODO`, `placeholder`, `coming soon`,
`sample`, `LIC# 000000000`. Every hit is **intentional and pre-launch**, not a
defect:

| Item | Where | Status |
|---|---|---|
| `LIC# 000000000` | Footer license line | **Intentional** — real license # pending (P1) |
| Reviews disclaimer + sample reviews | `/reviews` | **Required** — honesty gate; real Google reviews pending |
| `AggregateRating` JSON-LD | site-wide | ✓ **Suppressed** (`reviewsArePlaceholder = true`); absent from rendered output |
| "Online booking — coming soon" / booking note | Contact / Booking seam | **Intentional** — no provider wired (click-to-call only, per guardrails) |
| `(TODO confirm with Papo)` in copy | Home services, About story/eco, FAQ supplies | **Intentional flag** — claims (military service, HEPA, eco brands) await confirmation (P1) |
| `Common.placeholderTag` | catalog only | Dead key, **not rendered** anywhere (P2: delete) |

No video "coming soon", no "founder video coming soon", no lorem, no broken media.

## 8. Prioritised punch-list

**P0 — launch-blockers:** _none._ This round introduced no blockers.

**P1 — before public launch (content, needs Papo):**
1. Replace `LIC# 000000000` with the real license number (`src/content/site.ts`).
2. Confirm the `(TODO confirm with Papo)` claims and remove the parentheticals —
   military service, HEPA vacuums, specific eco brands (Home/About/FAQ catalogs).
3. Swap sample reviews for verified Google reviews, then flip
   `reviewsArePlaceholder` to `false` (re-enables AggregateRating).
4. ~~Paste the unlisted YouTube embed URLs into `src/content/media.ts`~~ —
   **done:** all 7 IDs wired; facades are live click-to-play (silent clips).
5. Set `NEXT_PUBLIC_CLARITY_ID` (+ `NEXT_PUBLIC_GA_ID`) in Vercel and re-run
   Lighthouse on the preview to confirm Perf/BP/SEO ≥ 95.

**P2 — polish (non-blocking):**
6. Swap the ~506px gallery halves for higher-res **separate** originals when Papo
   provides them (`scripts/process-gallery.mjs` is ready); current halves are from
   pre-composited squares.
7. Confirm Img7 is a coated/painted floor (→ interior-painting gallery) vs. a
   cleaned patio; confirm consent to publish team faces (Vid2/3/5/7).
8. Delete the unused `Common.placeholderTag` catalog key.
9. Consider trimmed on-site versions of clips with baked-in outros (Vid1/2/5/7);
   Vid6 stays whole (it is the explainer).

## 9. Definition-of-done (brief §G)

- [x] A–C implemented; guardrails held (hybrid content model + parity, honesty
      gate, no bulk media in Git, click-to-call only, no DNS changes).
- [x] Baseline green; new media/slider/portrait-video/structural/analytics checks pass.
- [x] No unintended placeholder leakage (all remaining items intentional + listed).
- [x] CLS 0; LCP not regressed by media (lazy poster, not the LCP element).
- [x] Corrected screenshots captured to `docs/screenshots/`.
- [x] This report committed to `docs/`.
- [ ] Lighthouse ≥ 95 **on the Vercel preview** — re-run after this push deploys
      (local build shows the expected localhost artifacts only).
