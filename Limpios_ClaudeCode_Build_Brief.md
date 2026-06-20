# Limpios Cleaning — Website Build Brief (for Claude Code)

> Hand this file to Claude Code. It is the complete task spec for building the **frontend** of the Limpios Cleaning Management marketing website. Read it fully before starting. If anything is ambiguous, ask before scaffolding.

---

## 0. Mission (TL;DR)

Build a clean, professional, elegant, high-end ("WOW") marketing website for **Limpios Cleaning Management** — a veteran-owned, eco-friendly residential & commercial cleaning company in Clermont / Minneola, Central Florida.

- Initialize the project locally at: `C:\Users\Omen\Desktop\NextGenAI\16_Limpios`
- Create a **private GitHub repo**, commit, and push.
- Use the **latest stable** Next.js + modern toolchain (see §2).
- Populate with the real content provided (§8) and clearly-marked dummy data where real content is pending.
- Deliverable: a fully responsive, accessible, fast, polished site that runs locally and is ready to deploy to Vercel.

This is the **frontend phase only**. Do NOT configure DNS/email, and do NOT integrate a real booking provider yet — leave the documented integration seam (§11).

---

## 1. Repository & environment setup (do this first)

Target machine is **Windows** (use PowerShell-compatible commands; avoid bash-only syntax).

1. Confirm prerequisites: Node LTS (latest), `git`, and GitHub CLI (`gh`). Run `gh auth status` — if not authenticated, stop and tell the user to run `gh auth login`.
2. Create the project folder if needed and scaffold there: `C:\Users\Omen\Desktop\NextGenAI\16_Limpios`.
3. Scaffold with `npx create-next-app@latest` (App Router, TypeScript, Tailwind, ESLint, `src/` dir, import alias `@/*`).
4. Initialize git, make an initial commit.
5. Create the private repo and push:
   ```
   gh repo create limpios-cleaning --private --source=. --remote=origin --push
   ```
   (Repo name `limpios-cleaning` is a suggestion — confirm with user if they prefer `16_Limpios`.)
6. Add a meaningful `.gitignore` (the scaffold provides one; ensure `.env*` is ignored).
7. Commit in logical increments with clear messages as you build (not one giant commit).

Deliver a `README.md` (see §12) and an `.env.example`.

---

## 2. Tech stack (use latest stable versions)

Always install the **current latest stable** of each — do not pin to older versions from memory.

- **Framework:** Next.js (App Router, Server Components, Server Actions) — via `create-next-app@latest`.
- **Language:** TypeScript (strict mode on).
- **Styling:** Tailwind CSS (latest). Use a small design-token layer (CSS variables) for the brand palette so colors are centralized.
- **UI primitives:** shadcn/ui (Radix-based) for accessible components (accordion, dialog/sheet, etc.). Verify current-Tailwind compatibility during init.
- **Icons:** `lucide-react`.
- **Animation:** `motion` (Framer Motion) for entrance/scroll-reveal/hover micro-interactions. Respect `prefers-reduced-motion`.
- **Fonts:** `next/font` — headings **Poppins** (or **Sora**), body **Inter**.
- **Forms:** `react-hook-form` + `zod` validation.
- **Email (lead capture):** `resend` (server-side), behind env vars; safe no-op if keys absent in dev.
- **SEO:** Next.js Metadata API, `next/og` for OG images, JSON-LD structured data.
- **i18n:** `next-intl` with locale routing (`/en`, `/es`) — bilingual-ready (see §5/§8).
- **Analytics:** `@vercel/analytics` + a GA4 placeholder (env-gated).
- **Images:** `next/image` throughout.

Keep dependencies lean and intentional. Document any notable version choices in the README.

---

## 3. Client & positioning

- **Business:** Limpios Cleaning Management — residential + commercial cleaning, eco-friendly, **veteran-owned and operated**, licensed & insured. Also offers **interior painting** as a secondary service.
- **Location / market:** Based in Minneola, FL (1683 N Hancock Rd, Suite 103-272, Minneola, FL 34715). Serves Clermont and Central Florida / Lake County / west Orlando metro.
- **Phone:** (407) 680-2945 — **click-to-call only** (`tel:+14076802945`). This is a Google Voice line; do NOT build any SMS automation around it.
- **Email:** info@limpioscleaning.com
- **Domain (future):** limpioscleaning.com (will point to Vercel later — not in scope now).
- **Social:** Instagram `@limpioscleaning`, Facebook "Limpios Cleaning Management".
- **Tagline:** "Sit back, relax, and we will do the cleaning."

**Positioning angle (differentiator):** owner-forward, personal, *local*, veteran-owned, eco-friendly, and **bilingual (EN/ES)** — most local competitors are none of these. Lean into trust + "get your free time back."

---

## 4. Brand system

### Palette (extracted from the client's logo — blue-led, NOT green)
Define these as CSS variables / Tailwind theme tokens:

| Role | Hex |
|---|---|
| Deep navy (headings, depth, gravitas) | `#0A2359` |
| Royal blue (primary brand, nav, links) | `#1B5A9D` |
| Sky blue (accents, icons, highlights) | `#28A2EF` |
| Cyan (illustration, subtle fills) | `#5ED7F4` |
| **Glove orange — CTA buttons only** | `#F47B20` |
| Hat sand (warm accent, sparing) | `#E9C686` |
| Cool white (page base / section bg) | `#F4F9FB` |
| White (cards, surfaces) | `#FFFFFF` |

Rules: orange is reserved for primary CTAs only (it must "pop"). Test CTA label contrast (white or deep-navy text on orange) for WCAG AA. Body text = deep navy or a neutral slate on white; never pure black.

### Typography
- Headings: Poppins / Sora (friendly, rounded, professional). Weights 500–700.
- Body: Inter, 16–18px min on mobile, line-height ~1.6–1.7.
- The "Limpios" gaming-style logotype is part of the **logo only** — never use it as a UI font.

### Logo
- The client's logo is a **mascot/character** (a caricature of the owner in a Panama hat with a spray bottle, on a blue shield, with the "Limpios" logotype). The source file is `logo.jpeg` (the user will place it in the repo; if not present, ask).
- Place brand assets in `public/brand/`.
- **Logo usage system** (build the site to accommodate these slots even if only the JPEG exists today):
  - **Header:** wordmark/icon-forward, small — keep it crisp. If only the full JPEG is available, use it at a controlled size on a suitable backing; mark a TODO for transparent/vector variants.
  - **Hero:** the full mascot can appear as a "meet the owner" welcoming element (see §6).
  - **Favicon / mobile / avatar:** needs a simplified icon — for now derive a placeholder (e.g., a navy shield monogram "L") and mark TODO to replace with a real simplified mark.
  - **Footer / mono:** single-color (navy or white) treatment.
- Pending production assets (mark as TODOs, do not block): transparent-background PNG, vector (SVG) redraw, simplified icon, real team/work photography.

### Aesthetic / "WOW" direction
Airy, white, generous whitespace, crisp grid, confident type scale. The **playful mascot lives inside a calm, professional frame** — that contrast is the intended effect; do not make the whole site cartoonish. WOW comes from: polished motion (subtle scroll reveals, staggered cards, a sticky header that condenses on scroll, smooth anchor scrolling, tasteful hover lifts), high-quality imagery, and immaculate spacing/alignment — not from gradients/glow everywhere. Flat, modern, premium.

---

## 5. Information architecture (sitemap)

Locale-prefixed routes (`/en/...`, `/es/...`), with a language toggle in the header.

- `/` Home
- `/services` Services hub
  - `/services/residential`
  - `/services/commercial`
  - `/services/deep-cleaning`
  - `/services/move-in-out`
  - `/services/post-construction`
  - `/services/interior-painting`
- `/pricing` (or `/quote`) — pricing + quote request
- `/service-areas` hub
  - `/service-areas/[city]` — templated city pages (Clermont, Minneola, Groveland, Winter Garden, Horizon West, Four Corners, Montverde, Mascotte, …)
- `/about` — founder/veteran story, eco commitment, team
- `/reviews`
- `/contact` — form + click-to-call + booking seam
- Standard: `404`, `sitemap.ts`, `robots.ts`

---

## 6. Homepage — section-by-section spec

Order matches the approved blueprint. Every CTA routes to the quote flow (§11); a primary CTA must be reachable above the fold and repeated down the page.

1. **Header (sticky):** logo, nav (Services, Service Areas, About, Reviews), phone click-to-call, primary CTA "Get a free quote" (orange), EN/ES toggle. Condenses on scroll. Mobile: hamburger → sheet.
2. **Hero:** strong headline (e.g., "Veteran-owned cleaning you can trust — Clermont & Central Florida"), benefit-led subhead, primary CTA + "Call now" secondary, a trust signal (e.g., "Licensed & insured · 5★ rated"). Feature the **mascot** as a welcoming visual on a clean backdrop. Tasteful entrance animation.
3. **Trust bar:** pill row — Veteran-owned · Licensed & insured · Eco-friendly products · Google rating. Icons via lucide.
4. **Services overview:** 4–6 cards (Residential, Commercial, Deep/Move-out, Post-construction, Interior painting) with icon, short benefit copy, **starting price where applicable**, link to the service page. Staggered reveal.
5. **How it works:** 3 steps — Book / Get a quote → We clean → You relax.
6. **Why Limpios:** founder/veteran story snippet + eco commitment + satisfaction guarantee; placeholder slot for a 30–60s founder video.
7. **Before / after gallery:** image pairs (placeholder images, clearly marked; ideally a slider or grid).
8. **Reviews:** 3–5 testimonials with name + city + stars. **Clearly mark these as placeholder/sample data** in code comments and visually flag in the README that real Google reviews must replace them before launch (no fake reviews in production).
9. **Service area:** short blurb + neighborhood list linking to city pages + a simple map (static/placeholder is fine).
10. **FAQ:** accordion (shadcn). Also output as `FAQPage` JSON-LD.
11. **Repeat CTA band:** "Get my free quote" (orange).
12. **Footer:** phone, hours, email, address (NAP for local SEO), license # (placeholder), social links, service-area links, copyright. Mono logo.

---

## 7. Other pages (build with the same components)

- **Service pages:** hero, what's-included checklist, who it's for, pricing factors/range, related services, FAQ, CTA.
- **Pricing/Quote:** packages or "factors that affect price" + the quote form. Favor transparency (show starting prices / ranges) per the research.
- **Service-area pages:** templated, data-driven (one data object per city), locally-flavored copy, local CTA, link back to services. Built for local SEO scale.
- **About:** founder story (veteran-owned), mission, eco values, team, mascot featured.
- **Reviews:** fuller list (placeholder), with a "leave a review" link (placeholder URL).
- **Contact:** form + click-to-call + hours + map + booking seam.

---

## 8. Content & data

Centralize content in typed data files (e.g., `src/content/*.ts`) and i18n message catalogs so it is trivial to edit and translate. Use the **real data** below; fill gaps with clearly-labeled placeholders.

**Real / known:**
- Name, tagline, address, phone, email, social handles (see §3).
- Services list (see §5).
- Service-area cities (see §5).
- Veteran-owned, licensed & insured, eco-friendly, bilingual.

**Dummy / placeholder (mark each with `// TODO: replace with real content`):**
- Pricing: use realistic ranges from market research — e.g., residential standard "from ~$120" (3BR ~$120–$180), deep clean "from ~$200", commercial "custom quote", interior painting "quote". Label as estimates/placeholder.
- Reviews/testimonials: 3–5 sample reviews — **explicitly labeled placeholder**.
- Photography: high-quality placeholder images via `next/image`. Either local gradient/labeled placeholders in `public/placeholders/`, or curated stock configured via `next.config` `images.remotePatterns`. Mark all as TODO for the client's real team/work photos.
- Founder bio + video: placeholder text + empty video slot.
- License #, hours, Google rating/count, map embed: placeholders.

**i18n:** Architect bilingual from the start (all UI strings + content keyed by locale). Fully populate **English**. For **Spanish**, mirror the structure and provide draft translations for at least the homepage and global UI, clearly marked for native-speaker review (the owner is a Spanish speaker and will refine).

---

## 9. Components to build (reusable)

`Header`, `Footer`, `Hero`, `TrustBar`, `ServiceCard` + `ServicesGrid`, `HowItWorks`, `WhyUs`, `BeforeAfterGallery`, `Testimonials`/`ReviewCard`, `ServiceAreaSection`/`CityCard`, `FAQ` (accordion), `CTASection`, `QuoteForm` (multi-step, RHF+Zod), `BookingEmbed` (placeholder seam — §11), `LocaleToggle`, `PhoneLink` (click-to-call), `SectionHeading`, `Container`. Build a small set of UI atoms (Button with `primary`/orange + `secondary` variants, Badge, etc.).

Keep components typed, composable, and content-driven (props from the content data layer, not hardcoded copy).

---

## 10. SEO & metadata

- Per-route `metadata` (title, description, canonical, OG/Twitter).
- Dynamic OG images via `next/og`.
- JSON-LD: `LocalBusiness` (with NAP, geo, hours, areaServed), `Service` (per service), `FAQPage`, `Review`/`AggregateRating` (only once real reviews exist — gate behind real data).
- `sitemap.ts`, `robots.ts`.
- Semantic HTML, one `h1` per page, descriptive `alt` text.
- `hreflang` for en/es.
- Strict NAP consistency with §3.

---

## 11. Forms & lead capture (booking integration seam)

- Primary CTAs ("Get a free quote" / "Book now") open the **multi-step `QuoteForm`** (modal/sheet or `/quote`): service type → home/property details (beds/baths or sqft) → frequency → contact info. Validate with Zod.
- On submit: a **Server Action / Route Handler** that emails the lead to `info@limpioscleaning.com` via Resend (env-gated; in dev with no key, log to console and show success UI). Include a honeypot field for spam.
- Provide a `BookingEmbed` placeholder component with a clear comment marking it as the **future integration point** for BookingKoala / Launch27 / Jobber / Housecall Pro (the client will choose). Do not integrate a real provider now.
- `tel:` click-to-call everywhere via `PhoneLink`.

Env vars (in `.env.example`): `RESEND_API_KEY`, `LEAD_NOTIFICATION_EMAIL`, `NEXT_PUBLIC_GA_ID` (optional). Never commit real keys.

---

## 12. Quality bar / acceptance criteria

- `npm run build`, `lint`, and typecheck all pass with no errors.
- Fully responsive (mobile-first), tested at common breakpoints.
- Accessibility: WCAG AA — semantic landmarks, keyboard nav, focus states, color-contrast-checked (especially orange CTAs), reduced-motion honored, alt text present.
- Performance: target Lighthouse 95+ (perf/SEO/best-practices/a11y); optimized images, fonts, no layout shift.
- Clean architecture: typed content layer, reusable components, no copy hardcoded in JSX, sensible folder structure.
- All placeholder/dummy content clearly marked (`// TODO`) and listed in the README.
- **README.md** includes: project overview, setup/run scripts, folder structure, how to edit content & add a service-area page, how to add/edit translations, env var list, the placeholder-replacement checklist, and Vercel deploy notes.
- Repo created (private), committed in logical steps, and pushed.

---

## 13. What NOT to do

- Do NOT touch DNS or email configuration (separate later phase).
- Do NOT integrate a real booking/payment provider yet (leave the seam).
- Do NOT build SMS automation (Google Voice = click-to-call only).
- Do NOT ship fake reviews — placeholders must be clearly labeled and listed for replacement.
- Do NOT overuse the mascot or apply gradients/glow everywhere — keep the frame clean and premium.
- Do NOT commit secrets.

---

## 14. Open items to surface to the user (ask, don't block)

If these aren't provided, proceed with placeholders and list them:
1. Transparent/vector logo + simplified icon, and real team/work photos.
2. Confirmed pricing/packages the client is willing to publish.
3. Final service-area city list and exact ZIPs.
4. License #, business hours, Google Business Profile review link/rating.
5. Founder bio + any video.
6. Spanish translations review (owner is a native speaker).
7. Repo name preference (`limpios-cleaning` vs `16_Limpios`).
8. Which booking tool the client intends to use (for the future seam).

---

*Build it clean, fast, accessible, and genuinely impressive. The mascot brings the warmth; the layout brings the trust.*
