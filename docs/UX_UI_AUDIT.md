# Limpios Cleaning — UX/UI Audit

**Auditor:** Senior UX Engineer (automated + heuristic review)
**Method:** Playwright (Chromium) crawl + axe-core a11y engine + heuristic/visual review
**Build under test:** `next dev` on `localhost:3000` (commit on `main`)
**Scope:** 22 EN routes + 5 ES routes, desktop (1366×900) and mobile (390×844), forms, and interaction flows
**Harness:** `audit/run.mjs`, `audit/form.mjs`, `audit/summarize.mjs` → `audit/results.json`

---

## 1. Executive summary

The site is in **strong shape**: clean visual system, consistent layout language, fully responsive with **zero horizontal overflow** at mobile width, **zero console errors** across all pages, correct document semantics (one `<h1>` per page, all images with `alt`), and complete SEO metadata. Forms work end‑to‑end including validation, multi‑step navigation, prefill, and the success state.

The audit **found and fixed four real defects** during the engagement (details in §4). After fixes, **axe‑core reports zero WCAG 2.0/2.1 A/AA violations across every audited page.**

| Dimension | Result |
|---|---|
| Accessibility (axe A/AA) | ✅ 0 violations (post‑fix) across 27 pages |
| Document semantics | ✅ 1× h1/page, no heading skips (post‑fix), 0 images missing alt |
| Responsive (390px) | ✅ 0 pages with horizontal overflow |
| Console health | ✅ 0 errors / 0 warnings on any page |
| Forms | ✅ validation + happy path + prefill + contact all pass |
| SEO completeness | ✅ canonical + hreflang(en/es/x‑default) + OG image on every page (post‑fix) |
| Layout stability (CLS) | ✅ 0.000 measured (no layout shift) |
| Visual consistency | ✅ Strong; minor polish opportunities (§7) |

**Overall UX/UI grade: A‑** (A after the recommended polish in §12 and replacement of placeholder media).

---

## 2. Methodology

- **Crawl:** every route in both locales was loaded to `load` + 1.4s settle. Captured: HTTP status, console messages, `<title>`, meta description, canonical, hreflang count, OG image, heading outline (h1–h4), image/alt counts, all anchors (for the workflow graph), viewport vs. scroll width (overflow), and navigation/paint timings.
- **Accessibility:** `@axe-core/playwright` with tags `wcag2a, wcag2aa, wcag21a, wcag21aa` on every desktop page.
- **Responsive:** full‑page screenshots at desktop and mobile; overflow computed as `documentElement.scrollWidth > innerWidth`.
- **Forms:** scripted the quote modal (validation at step 1 and step 4, then full happy path to success), the standalone `/quote` page (with `?service=` prefill), and the contact page (form/booking‑seam/hours presence).
- **Caveat:** performance numbers are from a **dev server** and are indicative only — authoritative Core Web Vitals must be measured against the production Vercel deployment (Lighthouse/CrUX). Layout‑shift (CLS) and structural findings are valid regardless of environment.

---

## 3. Scope (pages audited)

Home, Services hub, 6 service detail pages, Pricing, Service‑areas hub, 8 city pages, About, Reviews, Contact, Quote (EN). ES sampled on Home, Services, a service detail, Pricing, Contact. 27 page‑loads × 2 breakpoints + form flows.

---

## 4. Issues found **and fixed** during this audit

> These were discovered by the harness, fixed in code, and re‑verified clean.

| # | Severity | Area | Finding | Fix | Verified |
|---|---|---|---|---|---|
| 1 | **High (UX)** | Quote form | Clicking **Next** with no radio selected showed the raw Zod error **“Invalid input: expected string, received null”** instead of the friendly localized message. Cause: react‑hook‑form returns `null` (not `""`) for an unselected radio group, so `z.string()` failed on type before the custom `.refine()` message ran. | Wrapped `service`/`propertyType`/`frequency` in `z.preprocess(v => v ?? "", …)`; also added friendly required messages for empty name/phone. | Now shows **“Please choose a service.”** |
| 2 | **High (SEO/social)** | Metadata | **`og:image` / `twitter:image` were missing on every subpage** (only the homepage had one). A page that sets `openGraph` without `images` suppresses the `opengraph-image` file convention. Social shares of any service/city/pricing page would have had no preview image. | `buildMetadata` now references the per‑locale OG image explicitly in `openGraph.images` + `twitter.images`. | OG image present on `/services`, `/about`, `/pricing`, `/es/contact`, … |
| 3 | **Serious (a11y)** | `/about` | One **color‑contrast** failure (axe `serious`): the team placeholder note used `text-muted-foreground/70`, too faint at `text-xs`. | Changed to full `text-muted-foreground`. | `/about` axe violations → **0**. |
| 4 | **Minor (a11y)** | `/services` | Heading order skipped **h1 → h3** (service cards are `h3` with no intervening section heading). | Added an `sr-only` `<h2>` section label before the grid. | Outline now `h1 → h2 → h3`. |

---

## 5. Accessibility audit (post‑fix)

| Check | Result |
|---|---|
| axe‑core WCAG 2.0/2.1 A & AA | **0 violations** on all 27 pages |
| One `<h1>` per page | ✅ all pages |
| Heading order (no skips) | ✅ all pages (post §4.4) |
| Images with `alt` | ✅ 0 missing across all pages |
| Landmarks | ✅ `header`/`nav`/`main#main-content`/`footer`; **skip link** to `#main-content` |
| Keyboard / focus | ✅ visible `:focus-visible` ring globally; modal + sheet are focus‑trapped (Radix); tab order follows DOM |
| Color contrast | ✅ CTA = navy‑on‑orange (~5.5:1), royal links on white (~7:1), body navy/slate on white (>6:1) |
| Reduced motion | ✅ `Reveal` renders **static** when `prefers-reduced-motion: reduce` (verified: 12/12 cards visible, opacity 1); global CSS also zeroes transitions/animations |
| No‑JS resilience | ✅ scroll‑reveal content forced visible via `@media (scripting: none)`; primary CTA is a real `/quote` link |
| Dialog a11y | ✅ quote dialog has Title + Description; mobile sheet has Title + (added) `sr-only` Description |
| `lang` attribute | ✅ correct per locale (`<html lang="en|es">`) |

**Verdict:** WCAG **AA‑clean** by automated testing. Automated tools cover ~30–50% of WCAG; a manual screen‑reader pass (NVDA/VoiceOver) is recommended before launch as due diligence, but no structural blockers remain.

---

## 6. Responsive audit

- **No horizontal overflow** on any of the 22 EN pages at 390px (decorative background blobs are correctly clipped by `overflow-hidden` parents).
- Mobile header collapses the primary nav into a hamburger → **sheet** containing all nav links + “Get a free quote” + click‑to‑call + language toggle (verified open/contents).
- Sticky header **condenses on scroll** (taller→shorter, gains shadow/opacity).
- Grids reflow sensibly: services 3→2→1 col, pricing 4→1 col, city/service cards 3→2→1.
- Touch targets (CTAs, nav rows, form controls) are comfortably sized (≥40px height on primary actions).

**Recommendation (low):** spot‑check 320px (older/smaller phones) and very large 4K displays; current `max-w-7xl` container caps line length well, but hero type could be tuned at ≥1536px.

---

## 7. Visual & layout audit

**Strengths**
- Cohesive, premium “airy white + blue‑led” system; orange is disciplined to CTAs only, so it genuinely pops.
- Strong, consistent **section rhythm** (eyebrow → title → subtitle → content), alternating cool/white surfaces for cadence.
- The mascot framed on a navy “emblem” card resolves the source image’s black background elegantly — the playful character sits inside a calm frame exactly as intended.
- Typography hierarchy (Poppins headings / Inter body) is clear; `text-balance`/`text-pretty` improve wrapping.
- Pricing page reads well: 4 tiers, a single highlighted “Most popular” (royal border + orange CTA), honest “starting at” framing + disclaimer.
- Service detail pages are information‑rich without clutter (included / who‑for / factors / related / FAQ / CTA).

**Polish opportunities** (cosmetic, low severity)
| Sev | Item |
|---|---|
| Low | Hero mascot card: the source JPEG’s near‑black background is slightly darker than the navy frame at the corners. A transparent‑PNG mascot (already a TODO) removes this entirely; until then consider a marginally darker frame (`#06122b`) to blend. |
| Low | Below‑the‑fold sections animate in on scroll; ensure the first reveal isn’t perceptible as a “pop” on fast scroll — current 0.55s ease is fine, just confirm on a 60Hz mid‑range phone. |
| Low | Service‑area “map” and contact “map” are stylized placeholders (clearly a TODO). They look intentional, but a real embedded map will materially lift trust. |
| Low | Reviews page leads with a prominent, honest “sample reviews” disclaimer — good. Once real Google reviews land, surface the **rating number + count** (currently withheld to avoid asserting unverified figures). |

---

## 8. Forms & interaction audit

| Flow | Result |
|---|---|
| Quote **modal** opens from hero/header/CTA band | ✅ (progressive enhancement — real `/quote` link upgraded to modal when JS on) |
| Step 1 validation (no service) | ✅ blocks + shows friendly message (post §4.1) |
| Step 4 validation (empty contact) | ✅ blocks + shows field errors |
| 4‑step happy path → submit | ✅ reaches **“Request received!”** success state |
| Dev‑mode notice (no Resend key) | ✅ shows “lead logged to server console” note |
| Standalone `/quote` page | ✅ works; **`?service=` prefill** confirmed (e.g. `?service=commercial` pre‑selects Commercial) |
| Contact page | ✅ embedded lead form + booking seam + full hours present |
| Honeypot | ✅ filled honeypot is silently accepted server‑side and **not** emailed |
| Progress affordance | ✅ “Step X of 4” + progress bar + per‑step titles |

**Strengths:** the wizard is short (4 steps), uses large radio‑card targets, validates per step (not all‑at‑once), and degrades gracefully without JS. Server + client both validate; honeypot + HTML‑escaped emails.

**Recommendations (low):**
- Add an **inline error summary / focus‑to‑first‑error** on submit for screen‑reader users (currently errors render adjacent to fields, which is acceptable but a focus jump is friendlier).
- Consider a “required”/“optional” hint on the contact step fields (address/message are optional — make that explicit).
- Persist partial input if the user closes the modal accidentally (nice‑to‑have).

---

## 9. Content & microcopy

- Bilingual coverage is complete and parallel (437 leaf keys each, zero drift). Spanish is a **machine‑assisted draft pending native review** — flagged in code and README. A native‑speaker pass is the single most important content task before ES launch.
- CTAs are benefit‑led (“Get your free time back”, “Get a free quote”), consistent, and repeated at the right cadence.
- Trust signals (veteran‑owned, licensed & insured, eco‑friendly, bilingual) are reinforced without overclaiming; the rating is deliberately soft until verified.

---

## 10. Performance signals (dev — indicative only)

| Metric (dev) | Value | Note |
|---|---|---|
| FCP (avg/max) | ~356 / 752 ms | Dev server; production will be faster |
| LCP (avg/max) | ~358 / 752 ms | Indicative |
| **CLS (avg/max)** | **0.000 / 0.000** | **No layout shift** — meaningful even in dev |

Architecturally performance‑positive: SSG for all content routes, `next/image` (fixed dimensions, blur‑up), self‑hosted `next/font`, LCP hero rendered immediately (no opacity animation on headline/mascot), no render‑blocking third parties. **Action:** run Lighthouse on the Vercel preview to confirm the 95+ targets and capture real LCP.

---

## 11. What the harness verified green (regression baseline)

0 console errors · 0 axe violations · 1 h1/page · 0 missing alt · 0 mobile overflow · canonical + 3× hreflang + OG image on every page · JSON‑LD present (LocalBusiness+FAQPage on home; Service+FAQPage+Breadcrumb on service pages) · all form flows pass. This `audit/` harness can be re‑run as a lightweight pre‑deploy gate.

---

## 12. Prioritized recommendations

**P0 — before launch (content/trust, not code):** replace placeholder media (transparent/vector logo, real photos, before/after), confirm publishable pricing, license #, hours, and **real Google reviews**; native‑speaker ES review.

**P1 — UX polish (low‑effort, high‑polish):**
1. Real embedded maps (contact + service‑area) — trust lift.
2. Focus‑to‑first‑error on form submit (a11y nicety).
3. Manual screen‑reader smoke test (NVDA + VoiceOver).
4. Lighthouse run on production preview; confirm CWV ≥ 95.

**P2 — enhancements:**
5. Transparent‑PNG mascot to remove the hero frame edge.
6. Reveal animation timing check on low‑end mobile.
7. Optional: persist quote‑form input across accidental modal close.

---

## 13. Scorecard

| Category | Score |
|---|---|
| Accessibility | 9.5 / 10 |
| Responsive design | 9.5 / 10 |
| Visual design & consistency | 9 / 10 |
| Forms & interaction | 9 / 10 |
| Content & i18n | 8.5 / 10 (ES draft pending review) |
| Performance (architecture) | 9 / 10 (confirm on prod) |
| **Overall** | **A‑ (9/10)** |

*Bottom line: production‑ready engineering and UX. The remaining gap to “A” is content/media replacement and a native ES review — not structural work.*
