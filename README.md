# Limpios Cleaning Management — Website

Marketing website for **Limpios Cleaning Management**, a veteran‑owned, eco‑friendly
residential & commercial cleaning company serving Clermont / Minneola and Central
Florida. Bilingual (English / Spanish), fast, accessible, and built to convert.

> **Status:** Frontend phase. The site runs locally and is ready to deploy to
> Vercel. DNS/email are not configured here, and no real booking provider is
> integrated yet (a documented seam is in place). See the
> [placeholder checklist](#-placeholder-replacement-checklist) before launch.

---

## ✨ Highlights

- **Bilingual** (`/en`, `/es`) with locale routing, hreflang, and a language toggle.
- **Content‑driven**: every string lives in a typed content layer or message
  catalog — no copy hardcoded in components.
- **Conversion‑focused**: multi‑step quote form (modal + standalone page),
  click‑to‑call everywhere, repeated CTAs.
- **SEO‑complete**: per‑route metadata, canonical + hreflang, dynamic OG/Twitter
  images, JSON‑LD (LocalBusiness, Service, FAQPage, Breadcrumb), sitemap & robots.
- **Accessible (WCAG AA)**: semantic landmarks, keyboard nav, visible focus,
  contrast‑checked CTAs, `prefers-reduced-motion` honored, skip link.

---

## 🧱 Tech stack

| Area | Choice |
|---|---|
| Framework | **Next.js 16** (App Router, Server Components, Turbopack) |
| Language | **TypeScript** (strict) |
| Styling | **Tailwind CSS v4** (CSS‑variable design tokens) |
| UI primitives | **shadcn/ui** (Radix) — accordion, dialog, sheet, form fields |
| Icons | **lucide-react** |
| Animation | **motion** (Framer Motion) — reduced‑motion aware |
| Fonts | **next/font** — Poppins (headings) + Inter (body) |
| Forms | **react-hook-form** + **zod** |
| Email | **resend** (server‑side, env‑gated) |
| i18n | **next-intl** (locale routing) |
| Analytics | **@vercel/analytics** + env‑gated GA4 placeholder |

> Next.js 16 makes Turbopack the default for `dev` **and** `build`, and request
> APIs (`params`, `searchParams`, `cookies`, `headers`) are async. The i18n
> middleware uses the Next 16 `proxy.ts` file convention.

---

## 🚀 Quick start

**Prerequisites:** Node.js LTS (≥ 20.9), npm, and (for pushing) `git` + GitHub CLI.

```powershell
# Install dependencies
npm install

# Copy env template (optional in dev — leads log to the console without keys)
copy .env.example .env.local

# Start the dev server (http://localhost:3000 → redirects to /en)
npm run dev
```

### Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start the dev server (Turbopack). |
| `npm run build` | Production build. |
| `npm run start` | Serve the production build. |
| `npm run lint` | ESLint (flat config). |
| `npm run typecheck` | `tsc --noEmit` type checking. |

---

## 🔐 Environment variables

All are **optional in development** — with no `RESEND_API_KEY`, quote submissions
are logged to the server console and the UI still shows success. See
[`.env.example`](.env.example).

| Variable | Purpose |
|---|---|
| `RESEND_API_KEY` | Resend key for lead‑notification emails. |
| `LEAD_NOTIFICATION_EMAIL` | Inbox for new quote requests (default `info@limpioscleaning.com`). |
| `LEAD_FROM_EMAIL` | Verified sender for lead emails (set a real domain sender in prod). |
| `NEXT_PUBLIC_GA_ID` | Optional GA4 measurement ID (`G-XXXXXXX`). Blank disables GA. |

Never commit real keys — `.env*` is gitignored (except `.env.example`).

---

## 📁 Project structure

```
src/
├─ app/
│  ├─ [locale]/                 # All localized routes (root layout lives here)
│  │  ├─ layout.tsx             # <html>, fonts, providers, header/footer, metadata
│  │  ├─ page.tsx               # Homepage (section-by-section)
│  │  ├─ services/              # Services hub + [service] detail (generateStaticParams)
│  │  ├─ service-areas/         # Areas hub + [city] templated pages
│  │  ├─ pricing/ about/ reviews/ contact/ quote/
│  │  ├─ not-found.tsx          # Localized 404
│  │  ├─ [...rest]/page.tsx     # Catch-all → localized 404
│  │  ├─ opengraph-image.tsx    # Dynamic OG image (per locale)
│  │  └─ twitter-image.tsx
│  ├─ api/lead/route.ts         # Lead capture endpoint (Resend, env-gated)
│  ├─ sitemap.ts  robots.ts  icon.svg  globals.css
├─ components/
│  ├─ ui/                       # Atoms: button, container, section, badge, …
│  ├─ sections/                 # Page sections: hero, services, faq, cta-section, …
│  ├─ layout/                   # header, footer
│  ├─ brand/                    # logo (SVG), mascot (image)
│  └─ quote/                    # quote-form, quote-dialog, quote-cta
├─ content/                     # Typed content layer (structure + non-translatable data)
│  ├─ site.ts                   # NAP single source of truth
│  ├─ services.ts cities.ts pricing.ts reviews.ts faq.ts founder.ts …
├─ i18n/                        # next-intl: routing, navigation, request config
├─ lib/                         # routes, metadata, json-ld, format helpers
├─ proxy.ts                     # i18n middleware (Next 16 proxy convention)
└─ global.ts                    # next-intl typed messages augmentation
messages/
├─ en.json   es.json            # Message catalogs (parallel key structure)
public/
├─ brand/logo.jpeg              # Source logo
└─ placeholders/                # Labeled placeholder images (before/after, founder)
```

**Architecture in one line:** structural & non‑translatable data (slugs, icons,
prices, NAP, relationships) lives in `src/content/*.ts`; all translatable prose
lives in `messages/{en,es}.json`; components are content‑driven.

---

## ✏️ Editing content

### Plain text / UI strings

Edit `messages/en.json` and `messages/es.json`. **Keep both files' key structures
identical** (a quick check):

```powershell
node -e "const e=require('./messages/en.json'),s=require('./messages/es.json');const p=(o,k='')=>o&&typeof o=='object'&&!Array.isArray(o)?Object.keys(o).flatMap(x=>p(o[x],k+'.'+x)):[k];const a=p(e),b=p(s);console.log('missing es:',a.filter(x=>!b.includes(x)));console.log('missing en:',b.filter(x=>!a.includes(x)))"
```

### Prices, services, business facts

- **Business NAP / hours / social / rating:** `src/content/site.ts`.
- **Service pricing & relationships:** `src/content/services.ts` and
  `src/content/pricing.ts` (prose lives in `messages` under `Services.items.*`).

### Add a service‑area city

1. Add an entry to `src/content/cities.ts` and the `CitySlug` union.
2. Add a `ServiceAreas.cities.<slug>` block (`blurb`, `intro`) to **both**
   `messages/en.json` and `messages/es.json`.

The hub, homepage shortlist, `[city]` route, sitemap, and internal links all
update automatically.

### Add a service

1. Add a slug to `serviceSlugs` in `src/content/services.ts` (+ the `Service`
   entry with icon/price/related).
2. Add a `Services.items.<slug>` block to both catalogs.
3. If you use a new icon, add its name to `src/content/icons.ts` and register it
   in `src/components/icon.tsx`.

### Translations (Spanish)

The Spanish catalog (`messages/es.json`) is a **machine‑assisted draft for
native‑speaker review**. To refine: edit values in `es.json` only (don't change
keys). The owner is a native Spanish speaker and should review the full file.

---

## 🎨 Brand system

All brand colors are CSS variables in `src/app/globals.css` (the `@theme` /
`:root` blocks). Change a hex once and it propagates everywhere.

- Palette is **blue‑led** (deep navy, royal, sky, cyan) with **glove orange
  reserved for primary CTAs only** (`Button variant="cta"`).
- CTA labels use **navy text on orange** for WCAG AA (~5.5:1; white on orange
  fails). Royal blue links on white are ~7:1.
- Headings: Poppins. Body: Inter. The gaming‑style "Limpios" logotype is part of
  the **logo only**, never a UI font.

---

## 📨 Forms & lead capture

- Primary CTAs open the multi‑step **quote form** in a modal (`QuoteCTA` →
  `QuoteDialog`). Without JavaScript, the same CTA is a real link to `/quote`.
- Submissions `POST` to `/api/lead`, which validates with zod, drops honeypot
  spam, and emails the lead via **Resend** when `RESEND_API_KEY` is set
  (otherwise logs to the console and returns `{ dev: true }`).
- **Booking seam:** `src/components/booking-embed.tsx` is the single documented
  place to embed a real provider (BookingKoala / Launch27 / Jobber / Housecall
  Pro) later. No provider is integrated now.

---

## 🔎 SEO

Per‑route metadata (`src/lib/metadata.ts`), canonical + `en`/`es`/`x-default`
hreflang, dynamic OG/Twitter images (`next/og`), JSON‑LD
(`src/lib/json-ld.ts`: LocalBusiness, Service, FAQPage, Breadcrumb), `sitemap.ts`,
and `robots.ts`. **AggregateRating/Review structured data is intentionally gated
off** until real reviews replace the placeholders (`reviewsArePlaceholder`).

---

## ♿ Accessibility & performance

- Semantic landmarks, one `<h1>` per page, descriptive `alt` text, skip link.
- Keyboard‑navigable; visible `:focus-visible` rings; ARIA on icons/controls.
- `prefers-reduced-motion` disables animation; reveals fall back to visible
  when JS is off (`@media (scripting: none)`).
- Static generation (SSG) for all content pages; `next/image` + `next/font`;
  LCP hero renders immediately (no opacity animation on the headline/mascot).

---

## ✅ Placeholder replacement checklist

Everything below is clearly marked `// TODO` in code. Replace before launch:

**Brand & media**
- [ ] Transparent‑background PNG + **vector (SVG)** of the mascot logo
      (`src/components/brand/mascot.tsx`, `public/brand/`).
- [ ] Real **simplified icon / favicon** (`src/app/icon.svg`,
      `src/components/brand/logo.tsx`).
- [ ] Real **before/after** photos (`public/placeholders/*`, `src/content/gallery.ts`).
- [ ] Real **founder photo + team photos/bios** (`src/content/founder.ts`,
      About page).
- [ ] **Founder video** (30–60s) — slots on the homepage "Why" section and About.

**Business data** (`src/content/site.ts`)
- [ ] Florida **license / registration number**.
- [ ] Confirmed **business hours**.
- [ ] Real **Google Business Profile** rating, review count, and "leave a review" URL.
- [ ] Real **Facebook** page URL.
- [ ] Confirm **founding year** and exact **geo** coordinates.

**Pricing & areas**
- [ ] Confirm **publishable pricing** (`src/content/services.ts`, `pricing.ts`).
- [ ] Confirm final **service‑area cities and exact ZIPs** (`src/content/cities.ts`).

**Reviews**
- [ ] Replace **sample testimonials** with real Google reviews
      (`src/content/reviews.ts` + `Reviews.items.*`), then set
      `reviewsArePlaceholder = false` to enable rating structured data.

**Content**
- [ ] Real **founder story** and About copy (`About.story` in the catalogs).
- [ ] **Spanish review** by a native speaker (`messages/es.json`).

**Integrations**
- [ ] Choose & embed a **booking provider** (`src/components/booking-embed.tsx`).
- [ ] Set `LEAD_FROM_EMAIL` to a **verified‑domain sender** in Resend.
- [ ] Replace the **map placeholders** with a real embedded map (Contact + homepage).

---

## ▲ Deploy to Vercel

1. Push to GitHub (already done — private repo).
2. In Vercel, **Import** the repo. Framework preset auto‑detects **Next.js**;
   no build settings to change (`npm run build`).
3. Add environment variables (Project → Settings → Environment Variables):
   `RESEND_API_KEY`, `LEAD_NOTIFICATION_EMAIL`, `LEAD_FROM_EMAIL`, and optionally
   `NEXT_PUBLIC_GA_ID`.
4. Deploy. Vercel Analytics works automatically once the project is deployed.
5. **Later phase (out of scope here):** point `limpioscleaning.com` at Vercel and
   verify a sending domain in Resend.

---

## 📌 Open items for the client

Provide these when available (the site ships with labeled placeholders until then):
transparent/vector logo + real photography, confirmed pricing, final ZIP list,
license #, hours, Google review link, founder bio/video, Spanish review, and the
chosen booking tool. (See the [checklist](#-placeholder-replacement-checklist).)

---

*Built clean, fast, accessible, and bilingual. The mascot brings the warmth; the
layout brings the trust.*
