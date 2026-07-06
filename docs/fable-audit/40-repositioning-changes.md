# Repositioning change-set — what changed and where

Companion to `30-decision-gates.md` (the *why*); this is the *what/where*.
Commits: see `fable/reposition-audit` branch history.

## Content layer (`src/content/`)

| File | Change |
|------|--------|
| `services.ts` | Slug union reordered B2B-first; added `window-cleaning` (icon Grid2x2) + `carpet-cleaning` (Waves); `secondary` flag + `primaryServices`/`secondaryServices` exports; ALL price models → `quote` (no amounts); `related` webs rebuilt around the five. |
| `pricing.ts` | Package ids → `commercial · post-construction · move-in-out · specialty` (engagement types, all `custom`, no amounts); factors → `size · scope · condition · crew · frequency` (the owner's own estimate drivers). |
| `home.ts` | trustStats: `eco` → `chamber` (Landmark); NEW `audiences` list (commercial/property-managers/hoa/construction → target service each); steps → `walkthrough · estimate · clean`; whyPoints `quote` → `estimate`. |
| `site.ts` | Facebook URL → real page (verified); `chamber` block (name+URL, verified); `foundedYear` 2021 → 2023 (registry-based, owner-confirm flagged). |
| `faq.ts` | Order/set → `pricing · walkthrough(NEW) · area(NEW) · insured · eco · supplies · satisfaction · bilingual · booking`; `pets` retired (restorable via git). |
| `gallery.ts` | + `img27`, `img28` pairs (round-3 composites, non-flagship). |
| `photos.ts` **NEW** | 11 curated job photos, service + About mapping, blur data; consent TODO for img16. |
| `media.ts` | + `vid8` (poster-only seam; owner re-upload TODO) + `vid9` (self-hosted muted clip via new `selfSrc`); `VideoClip.selfSrc` added. |
| `icons.ts` | + Grid2x2, Waves, Landmark, Handshake, Building, ClipboardList, FileText. |

## Message catalogs (`messages/{en,es}.json`) — full rework, parity intact

- Meta: all titles/descriptions → commercial-first, Central Florida, no prices.
- Hero: "Commercial cleaning your business can **count on**"; CTAs → free
  estimate; trust chip → chamber membership (was "5-star rated" — removed as
  unsubstantiated).
- NEW `Home.audiences.*`; steps/why/pricing/faq blocks reworked per above.
- Services: full blocks for window-cleaning + carpet-cleaning (scope drafted
  conservatively — no equipment/method claims; flagged for owner sign-off);
  commercial/post-construction/move-in-out `who` lists retargeted to PM/HOA/
  builder buyers; demoted services retoned as secondary.
- `Photos.alts.*` NEW; `Video.captions.vid8/vid9` NEW; footer chamber line;
  `Footer.allServicesLink` NEW; `zipsLabel`/`chipRating`/`pets` removed both
  locales.

## Components / pages (`src/`)

| File | Change |
|------|--------|
| `sections/hero.tsx` | Star glyphs removed (honesty); chamber chip; shield icon on trust line. |
| `sections/audiences.tsx` **NEW** | Who-we-work-with card grid. |
| `sections/job-photos.tsx` **NEW** | Native-aspect job-photo strip (blur, translatable alts). |
| `sections/services-overview.tsx` | Maps `primaryServices`. |
| `sections/how-it-works.tsx` | Step icon map → walkthrough/estimate/clean; border-t vs audiences. |
| `sections/portrait-video.tsx` | `selfSrc` native muted playback branch (used by vid9). |
| `[locale]/page.tsx` | `<Audiences/>` inserted after services grid. |
| `[locale]/services/page.tsx` | Primary grid + "Also available" strip (G1). |
| `[locale]/services/[service]/page.tsx` | Job-photos section; `selfSrc` pass-through. |
| `[locale]/service-areas/[city]/page.tsx` | ZIP chips → walkthrough aside (G2); quote prefill residential→commercial; grid → primary five. |
| `[locale]/pricing/page.tsx` | Factor icon map for new ids (cards auto-adapt to custom model). |
| `[locale]/about/page.tsx` | Chamber card (3-up grid); crew-photos strip. |
| `[locale]/reviews/page.tsx` | Hero star glyphs removed (honesty gate). |
| `layout/footer.tsx` | Primary services + "All services" link; chamber credential line above bottom bar. |
| `quote/quote-form.tsx` | PROPERTY_TYPES → office/construction/community/house/apartment/other (B2B-first). |
| `lib/json-ld.ts` | `memberOf` chamber on LocalBusiness. |
| `components/icon.tsx` | Registry extended for the 7 new icons. |

## Scripts / assets

- `scripts/process-gallery.mjs`: + img27/img28, lowercase-filename support.
- `scripts/process-photos.mjs` **NEW**: native-aspect WebP + blur pipeline.
- `public/gallery/`: +4 halves (img27/28 before+after).
- `public/job-photos/` **NEW**: 11 WebPs (768×1024).
- `public/video-posters/`: + Vid8_poster.jpg (pre-overlay frame), Vid9_poster.jpg.
- `public/video/vid9-window.mp4` **NEW**: 10s muted 432×768 clip, 1.39 MB.
- Raw commands + probe data: `audit/fable/scripts/video-processing-commands.ps1`.

## What did NOT change (guardrails held)

- `reviewsArePlaceholder = true`; AggregateRating still suppressed; sample
  disclaimer intact.
- Unconfirmed claims (HEPA, eco brands, 24-hr re-clean, military story) not
  expanded — still awaiting owner confirmation (OWNER list).
- No DNS/email changes; click-to-call only; SSG architecture; bulk media out
  of Git; i18n parity (tests green); reduced-motion / no-JS fallbacks.
