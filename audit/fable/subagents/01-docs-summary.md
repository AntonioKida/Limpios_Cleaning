# Sub-agent 01 — prior-docs summarizer (Explore)

## Task definition (verbatim prompt)

> You are summarizing prior audit documentation in the repo… Read ALL of these
> files fully: docs/TECHNICAL_REPORT.md, docs/UX_UI_AUDIT.md,
> docs/USER_WORKFLOW_AUDIT.md, docs/LIGHTHOUSE.md, docs/UX_UI_AUDIT_R21.md,
> docs/UX_UI_AUDIT_FINAL.md, README.md. Return a structured brief: (1) how the
> site currently presents the business (services, audience, area, pricing,
> credentials — exact wording); (2) prior audit baseline; (3) three-bucket
> status; (4) known TODOs/placeholders; (5) media handling conventions;
> (6) SEO strategy, esp. city pages rationale. Quote exact wording for claims;
> file:line references.

## Raw return (verbatim)

### 1. HOW THE SITE CURRENTLY PRESENTS THE BUSINESS

**Services offered (exact as presented):** Residential, Commercial, Deep
cleaning, Move-in / move-out, Post-construction, Interior painting
(`content/services.ts`; messaging under `Services.items.*`).

**Target audience:** Primary residential (hero, homepage grid, pricing tier
prominence); secondary commercial. Tone addresses "homeowner" and "business
owner" journeys equally.

**Service area:** Featured: Clermont · Minneola · Groveland · Winter Garden ·
Horizon West · Four Corners; non-featured: Montverde · Mascotte. Geography:
"Central Florida," "Lake/Orange County" (TECHNICAL_REPORT.md:13); "Florida"
in structured data (json-ld.ts:57). ZIPs tracked in cities.ts:28.

**Pricing model:** "from $X" framing — residential from $120, deep $200,
recurring $99/visit; pricing page "4 tiers, honest 'starting at' framing +
disclaimer" (UX_UI_AUDIT.md:100). All amounts market-estimate placeholders
(TECHNICAL_REPORT.md:344, README.md:289).

**Credentials/trust claims:** "veteran-owned"; "licensed & insured"
(UX_UI_AUDIT.md:140); "eco-friendly" incl. HEPA vacuums, eco/low-odor products
(UX_UI_AUDIT_R21.md:131-132); "bilingual"; "24-hr re-clean"
(UX_UI_AUDIT_FINAL.md:132, pending Papo confirmation); military service in
About copy; rating/reviews placeholder-gated (`reviewsArePlaceholder = true`);
license `LIC# 000000000` placeholder (TECHNICAL_REPORT.md:348).

### 2. PRIOR AUDIT BASELINE

- axe-core: 0 WCAG A/AA violations across all pages (44 routes).
- One h1/page, no heading skips; skip link; landmarks.
- CLS 0.000 measured on all pages incl. real media.
- i18n: 437 leaf keys per catalog, zero drift; parity test in CI.
- Honesty gates: AggregateRating gated off; "sample reviews" disclaimer;
  booking seam "coming soon"; no fake data shipped.
- Structured data: LocalBusiness (full NAP/geo/hours/areaServed), Service
  (+provider backref, areaServed Florida), FAQPage, BreadcrumbList (all main
  pages), per-page hreflang (en/es/x-default) + canonical.
- Form: client zod + server zod + honeypot + per-step gating.

### 3. THREE-BUCKET STATUS (UX_UI_AUDIT_FINAL.md)

- **CODE: EMPTY** — all P0/P1 fixed + re-verified; high-value P2s fixed.
- **OWNER (28 items):** license #, founding year, hours, geo, Facebook URL,
  founder name/photo/video/experience, real Google reviews + rating/URL,
  military/HEPA/eco/re-clean confirmations, publishable pricing, higher-res
  before/after originals, Img7 subject confirm, team-face consent, YouTube ID
  playback confirm, real Google Maps embeds, mascot PNG + vector logo,
  native-speaker ES review.
- **DEPLOY:** Lighthouse ≥95 on Vercel preview, DNS, Resend domain +
  LEAD_FROM_EMAIL, Clarity/GA IDs, Upstash KV, video playback on deployed origin.

### 4. KNOWN TODOs (consolidated table)

license number site.ts:63 · founding year site.ts:78 · hours site.ts:52-59 ·
geo site.ts:38 · Facebook URL site.ts:44 · founder.ts:9-13 all placeholders ·
reviews.ts:30-37 samples · rating site.ts:70-74 · pricing amounts
services.ts:43,57,64 + pricing.ts · military/HEPA/eco/re-clean claims in
catalogs · gallery higher-res originals · Img7 subject · team-face consent
(Vid2/3/5/7) · YouTube IDs playback · mascot PNG · vector logo/favicon ·
ES native review · Clarity/GA IDs · Google Maps embeds ·
booking provider seam.

### 5. MEDIA HANDLING CONVENTIONS

- Gallery: `scripts/process-gallery.mjs` splits 1024×1024 composites into
  left=before/right=after 506×1024 WebP q80 + blur placeholders
  (`gallery-blur.json`); dimension-identical pairs (no CLS);
  `before-after-slider.tsx` (range input, static 50% no-JS fallback);
  homepage flagships + "see more" disclosure; bilingual alt/captions.
- Video: 7 clips, silent re-uploads on unlisted YouTube, youtube-nocookie
  click-to-load facade (poster-first, never autoplay); Vid4 exception:
  self-hosted `/public/video/vid4-hero.mp4` (3.1MB, muted loop) because Shorts
  player chrome unacceptable in hero; posters committed in
  /public/video-posters; raw MP4s (38MB) gitignored (`/Media`,
  `/public/Youtube`, `/public/trimmed`).

### 6. SEO STRATEGY / CITY PAGES RATIONALE

- Per-route metadata (canonical, hreflang en/es/x-default, OG), dynamic OG
  images, JSON-LD stack, sitemap = every route × locale with alternates.
- 6 service pages ×2 locales; each: Service schema + FAQ + breadcrumb; quote
  prefill `?service=<slug>`; related-service cross-links.
- 8 city pages ×2 locales for long-tail local SEO: 6 featured get footer links
  (depth-1); Montverde/Mascotte depth-2 long-tail; templated copy with
  city/county interpolation (thin-content risk acknowledged
  TECHNICAL_REPORT.md:356); each city page: LocalBusiness + Breadcrumb schema.
- Self-propagating content: add service/city in content file → hub, homepage,
  detail page, sitemap, quote options update automatically.

### Summary statistics (as returned)

50 static pages; 2 locales; 6 services; 8 cities; 437-key parity; axe 0;
CLS 0.000; 0 console errors; 43 components; stack: Next.js 16 · React 19 ·
TS 5 strict · Tailwind v4 · next-intl · shadcn/Radix · RHF+zod · motion · resend.
