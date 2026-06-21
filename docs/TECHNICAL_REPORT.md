# Limpios Cleaning Management — Technical Architecture Report

**Prepared for:** Senior architecture review ("opus architect")
**Scope:** Full-stack technical audit of the Limpios Cleaning marketing website
**Date:** 2026-06-20
**Repo:** `AntonioKida/Limpios_Cleaning` (private, GitHub), branch `main`
**Method:** Direct source inspection + one clean production build (`npm run build`, exit 0). Every claim below is traced to a real file/path; placeholders and TODOs are reported as found, not idealized.

---

## 1. Executive Summary

Limpios is a **bilingual (EN/ES) marketing + lead-generation website** for a veteran-owned residential/commercial cleaning company serving Lake/Orange County, Central Florida. It is a **Next.js 16 App Router** application built almost entirely as **statically generated (SSG)** pages, with a thin dynamic surface (one API route, two on-demand pages, dynamic OG/Twitter images).

The defining architectural decision is a **hybrid content model**: all locale-neutral *structure* (slugs, icons, prices, relationships, NAP business facts) lives in a typed TypeScript content layer (`src/content/*.ts`), while all *translatable prose* lives in parallel message catalogs (`messages/en.json`, `messages/es.json`). Components are data-driven and carry no hardcoded copy. This cleanly separates "what the business is" from "how it reads in each language," and it makes the page set extensible by data entry rather than code.

**Maturity:** Frontend phase, production-ready to deploy to Vercel. The build passes type-check, lint, and static generation. It is *not* yet wired to live infrastructure: no DNS/sending-domain, no booking provider (a documented seam exists), and content contains clearly-marked `// TODO` placeholders (logo/photos/pricing/license/hours/reviews). Spanish is a machine-assisted draft pending native review. Crucially, the team avoided shipping anything dishonest: **AggregateRating structured data is gated off** while reviews are placeholders.

**Stack at a glance:** Next.js 16.2.9 (Turbopack) · React 19.2.4 · TypeScript 5 (strict) · Tailwind CSS v4 (CSS-variable tokens) · next-intl 4 · shadcn/Radix UI · react-hook-form 7 + zod 4 · motion 12 · resend 6 · Vercel Analytics.

**Code size (TS/TSX):** `src/app` 1,642 · `src/components` 3,147 · `src/content` 551 · `src/lib` 234 · `src/i18n` 44 lines. Message catalogs: 437 leaf keys each, **EN/ES at exact key parity (0 drift)**.

---

## 2. Tech Stack & Exact Versions

From `package.json`:

| Package | Version | Role |
|---|---|---|
| `next` | `16.2.9` | App Router framework, Turbopack build |
| `react` / `react-dom` | `19.2.4` | React 19 (Server Components, async APIs) |
| `next-intl` | `^4.13.0` | i18n routing, message catalogs, typed keys |
| `tailwindcss` / `@tailwindcss/postcss` | `^4` | CSS-variable design system (`@theme`) |
| `tw-animate-css` | `^1.4.0` | Animation utilities (imported in globals.css) |
| `shadcn` | `^4.11.0` | shadcn registry/css (`@import "shadcn/tailwind.css"`) |
| `radix-ui` | `^1.6.0` | Headless primitives (dialog, sheet, accordion, slot) |
| `class-variance-authority` | `^0.7.1` | Variant API (`buttonVariants`) |
| `clsx` + `tailwind-merge` | `^2.1.1` / `^3.6.0` | `cn()` class composition (`src/lib/utils.ts`) |
| `lucide-react` | `^1.21.0` | Icon set (registry in `src/components/icon.tsx`) |
| `motion` | `^12.40.0` | Scroll-reveal animation (`src/components/reveal.tsx`) |
| `react-hook-form` | `^7.80.0` | Multi-step quote form |
| `@hookform/resolvers` | `^5.4.0` | RHF ↔ zod bridge |
| `zod` | `^4.4.3` | Form + API server-side validation |
| `resend` | `^6.14.0` | Lead-notification email (server-side, env-gated) |
| `@vercel/analytics` | `^2.0.1` | Web analytics (no key required) |
| `eslint` + `eslint-config-next` | `^9` / `16.2.9` | Flat-config linting |
| `typescript` | `^5` | Strict-mode type checking |

### Next.js 16 specifics that shaped the build

These are visible in the code, not assumed:

- **Turbopack is the default for `dev` and `build`.** Scripts are plain `next dev` / `next build` (`package.json:6-7`); the build banner confirms `▲ Next.js 16.2.9 (Turbopack)`.
- **Async request APIs.** Every page/route awaits `params`/`searchParams`: e.g. `params: Promise<{ locale: Locale }>` then `const { locale } = await params` (`src/app/[locale]/layout.tsx:72`, `src/app/[locale]/quote/page.tsx:32-33`).
- **`proxy.ts` replaces `middleware.ts`.** The i18n middleware lives at `src/proxy.ts` (the Next 16 file rename), exporting `createMiddleware(routing)` with a `config.matcher` (`src/proxy.ts:6-12`). The build labels it `ƒ Proxy (Middleware)`.
- **`images.qualities` is now required** for non-default quality. `next.config.ts:9` declares `qualities: [60, 75, 85, 100]` with an inline comment to that effect.
- **`data-scroll-behavior="smooth"`** is set on `<html>` (`layout.tsx:83`) because Next 16 only honors smooth scroll on navigation when the document opts in (noted in `globals.css:183-185`).

---

## 3. High-Level Architecture

### App Router structure

```
src/app/
├─ [locale]/                  ← the ONLY root layout (no app/layout.tsx)
│  ├─ layout.tsx              <html>, fonts, providers, header/footer, metadata
│  ├─ page.tsx                Homepage (section composition)
│  ├─ services/page.tsx + [service]/page.tsx
│  ├─ service-areas/page.tsx + [city]/page.tsx
│  ├─ pricing/ about/ reviews/ contact/ quote/ (page.tsx each)
│  ├─ not-found.tsx           Localized 404 boundary
│  ├─ [...rest]/page.tsx      Catch-all → notFound()
│  ├─ opengraph-image.tsx     Dynamic OG (next/og), per-locale
│  └─ twitter-image.tsx
├─ api/lead/route.ts          Lead capture (POST, Node runtime)
├─ sitemap.ts  robots.ts  icon.svg  globals.css
```

A notable structural choice: **there is no `src/app/layout.tsx`.** The `[locale]` segment *is* the root — `src/app/[locale]/layout.tsx` renders `<html>`/`<body>` directly (`layout.tsx:81-101`). This is valid because `proxy.ts` guarantees every user-facing path is locale-prefixed (`localePrefix: "always"`), so no request reaches the app outside a `[locale]` segment except file-convention routes (`sitemap.ts`, `robots.ts`, `icon.svg`, OG images) which carry their own rendering.

### Rendering strategy — real build route table

The single `npm run build` produced (exit code 0, 50 static pages generated):

| Route | Type | Notes |
|---|---|---|
| `/_not-found` | ○ Static | Framework 404 shell |
| `/[locale]` | ● SSG | `/en`, `/es` |
| `/[locale]/[...rest]` | ƒ Dynamic | Catch-all → localized 404 |
| `/[locale]/about` | ● SSG | `/en/about`, `/es/about` |
| `/[locale]/contact` | ● SSG | both locales |
| `/-/opengraph-image` | ƒ Dynamic | next/og generated |
| `/[locale]/pricing` | ● SSG | both locales |
| `/[locale]/quote` | ƒ Dynamic | reads `searchParams.service` |
| `/[locale]/reviews` | ● SSG | both locales |
| `/[locale]/service-areas` | ● SSG | both locales |
| `/[locale]/service-areas/[city]` | ● SSG | 16 paths (8 cities × 2 locales) |
| `/[locale]/services` | ● SSG | both locales |
| `/[locale]/services/[service]` | ● SSG | 12 paths (6 services × 2 locales) |
| `/-/twitter-image` | ƒ Dynamic | next/og generated |
| `/api/lead` | ƒ Dynamic | POST handler |
| `/icon.svg` | ○ Static | favicon |
| `/robots.txt` | ○ Static | from `robots.ts` |
| `/sitemap.xml` | ○ Static | from `sitemap.ts` |

Legend (from build output): `○ Static` · `● SSG (generateStaticParams)` · `ƒ Dynamic (server-rendered on demand)`. **Plus `ƒ Proxy (Middleware)`** for i18n.

> **Evidence note for the reviewer:** the Next 16 / Turbopack build output is condensed and **does not print a First Load JS / shared-bundle size column** in this project's output (captured verbatim — only the route tree + legend are emitted). Bundle-size figures therefore cannot be quoted from the build and are intentionally not fabricated here. If size budgets are needed, run `next build` with bundle analysis configured, or inspect `.next` output.

The split is deliberate: **everything that can be static is static.** Only `/quote` (depends on `?service=` query) and `[...rest]` (must run `notFound()` at request time) are dynamic page routes; the API route and OG/Twitter image generators are dynamic by nature.

---

## 4. Internationalization Architecture

next-intl is wired through five cooperating files plus a type augmentation:

| File | Responsibility |
|---|---|
| `src/i18n/routing.ts` | `defineRouting({ locales: ["en","es"], defaultLocale: "en", localePrefix: "always" })` — single source of truth for locales. Exports `Locale` type. |
| `src/i18n/navigation.ts` | `createNavigation(routing)` → locale-aware `Link`, `redirect`, `usePathname`, `useRouter`, `getPathname`. |
| `src/i18n/request.ts` | `getRequestConfig` — per-request loader; validates with `hasLocale`, dynamically imports `messages/${locale}.json`. |
| `src/proxy.ts` | `createMiddleware(routing)` for locale negotiation + `/` → `/en` redirect; matcher excludes `api`, `_next`, `_vercel`, any path with a file extension. |
| `next.config.ts` | `createNextIntlPlugin("./src/i18n/request.ts")` wraps the config. |

**Provider & static rendering.** The locale layout wraps children in `NextIntlClientProvider` (`layout.tsx:87`) and calls **`setRequestLocale(locale)`** before reading translations (`layout.tsx:77`) — required so static rendering works with `getTranslations`. Every SSG page repeats this pattern (e.g. `page.tsx:23`, `services/[service]/page.tsx:62`). `generateStaticParams` in the layout (`layout.tsx:28-30`) prerenders both locales.

**Typed messages.** `src/global.ts` augments `next-intl`'s `AppConfig` so that `Locale = routing.locales[number]` and `Messages = typeof en.json`. This makes `useTranslations`/`getTranslations` keys **type-checked against the English catalog** — English is the source-of-truth shape; Spanish mirrors it.

**Why literal-union ids exist (the load-bearing reason).** Dynamic translation keys only type-check when the interpolated id is a *literal union*, not `string`. That is precisely why the content layer declares union types — e.g. `ServiceSlug` (`content/services.ts:17`), `CitySlug` (`content/cities.ts:11-19`), `ReviewId` (`content/reviews.ts:15`), `FaqId` (`content/faq.ts`), `PriceFactorId`/`PricePackageId` (`content/pricing.ts`). A call like `t(\`items.${service}.name\`)` (`services/[service]/page.tsx:71`) is only sound because `service` is a `ServiceSlug`. CLAUDE.md states this convention explicitly (`CLAUDE.md:13-15`).

**Key parity.** Verified programmatically: `messages/en.json` and `messages/es.json` each have **437 leaf keys, with zero missing on either side.** The README ships a one-liner parity checker (`README.md:144-146`). Top-level namespaces (15): `Meta, Common, Nav, Footer, Home, Services, Pricing, ServiceAreas, About, Reviews, Contact, Quote, Faq, Booking, NotFound`.

**The hybrid content model (core architectural pattern).**

| Lives in `src/content/*.ts` (structure, locale-neutral) | Lives in `messages/{en,es}.json` (translatable prose) |
|---|---|
| service slugs, icons, price models, related-service graph | service name/tagline/description/included/who/factors |
| city slugs, county keys, ZIPs, nearby graph | city blurb/intro/why copy |
| NAP, hours, geo, social, rating (`site.ts`) | day labels, UI strings, taglines |
| review ids, ratings, dates, featured flags | review quote text |
| faq id order | faq question/answer text |

Concrete proof: `Services.items.residential` has keys `["name","tagline","description","metaDescription","who","included","factors"]` (all prose) while `content/services.ts` holds only `{slug, icon, featured, related, price}`. The same string id (`"residential"`) joins the two halves. This is the project's central abstraction and it is applied consistently across services, cities, reviews, faq, pricing, founder, gallery, and home sections.

---

## 5. Content & Data Layer

`src/content/` (11 modules, 551 LOC) is a typed, framework-agnostic data layer with a barrel (`index.ts`) that re-exports everything for `@/content` imports.

| Module | Responsibility |
|---|---|
| `site.ts` | **NAP single source of truth** — name, url, email, phone (display/e164/href), address, geo, social, business `hours` (24h, `null`=closed), `license`, `rating` (with `isPlaceholder`), `foundedYear`. Exports `DayKey`/`dayOrder`. |
| `services.ts` | `serviceSlugs` union, `Service` interface, the 6-service catalog with icon/featured/related/price-model, plus `getService`/`isServiceSlug` guards. |
| `cities.ts` | `CitySlug`/`CountyKey` unions, 8 service-area cities with ZIPs + nearby graph; `getCity`, `citySlugs`. |
| `reviews.ts` | `reviewsArePlaceholder = true` flag, `ReviewId` union, 6 sample reviews. Header warns these are NOT real and gate structured data. |
| `faq.ts` | Ordered `faqIds` (drives accordion + FAQPage JSON-LD). |
| `pricing.ts` | `pricePackages` (4) + `priceFactorIds`; each package maps to a `serviceSlug`. |
| `founder.ts` | About meta (placeholder name/photo/video) + `valueCards`. |
| `home.ts` | `trustBadges` + `steps` (icon + id structures for homepage). |
| `gallery.ts` | before/after pairs pointing at local placeholder SVGs. |
| `icons.ts` | `IconName` union — the contract the UI `<Icon>` registry implements. |
| `index.ts` | Barrel export. |

**Consumption pattern.** Components import structure from `@/content` and prose via `useTranslations`/`getTranslations`, joined by id. Example in `services/[service]/page.tsx`: `getService(service)` for price model + `t(\`items.${service}.included\`)` for the checklist. NAP is read directly from `site` everywhere it appears — header (`header.tsx:8`), footer, contact page, and the LocalBusiness JSON-LD (`lib/json-ld.ts:17-24`) — guaranteeing one canonical NAP across the page and structured data, which is essential for local-SEO consistency.

**Dependency direction is clean:** content owns `IconName`; the UI (`components/icon.tsx`) *implements* the registry against it. Content never imports from components.

---

## 6. Design System / Theming

**Token layer.** `src/app/globals.css` is the brand single-source. It imports Tailwind v4, `tw-animate-css`, and `shadcn/tailwind.css`, then defines a two-tier token system:

1. **Raw brand palette** in `:root` (`globals.css:75-88`) as HEX (client-editable): `--navy #0A2359`, `--royal #1B5A9D`, `--sky #28A2EF`, `--cyan #5ED7F4`, `--cta #F47B20` (glove orange), `--cta-foreground #0A2359`, `--sand`, `--cool-white`, `--surface`.
2. **Tailwind `@theme inline` block** (`globals.css:16-73`) exposes them as utilities (`bg-navy`, `text-royal`, `bg-cta`) and maps shadcn semantic tokens (`--color-primary`, `--color-background`, etc.) onto the brand palette. Radius scale derived from a single `--radius: 0.75rem`.

**Brand discipline.** Orange is **reserved for primary CTAs only** — encoded as the `cta` Button variant (`components/ui/button.tsx:15`), not a general utility. A `.dark` block exists (`globals.css:133-152`) purely so shadcn primitives remain valid, but **is never activated** (no class ever added; CLAUDE.md:17 forbids adding a dark theme).

**AA contrast rationale.** CTA labels use **navy text on orange** (`--cta-foreground`), explicitly because white-on-orange fails WCAG AA. The comment quantifies it: navy-on-orange ≈ **5.5:1** vs white-on-orange ≈ 2.7:1 (`globals.css:13`, `button.tsx:14-15`). Body copy `--muted-foreground #50607a` is annotated ≈6.4:1; royal links on white ≈7:1 (README:186-188). Focus is handled globally via `:focus-visible` outline (`globals.css:173-176`) and a skip link (`layout.tsx:88-93`).

**Fonts via next/font.** `Poppins` (headings, weights 400–700) and `Inter` (body) are loaded in the layout with `display:"swap"` and exposed as CSS variables `--font-poppins`/`--font-inter` (`layout.tsx:14-25`), bound to `--font-heading`/`--font-sans` in the theme. Self-hosted, no layout shift, no external font request.

---

## 7. Component Architecture

43 `.tsx` components (3,147 LOC), organized by a clear taxonomy:

| Folder | Contents | Server/Client |
|---|---|---|
| `components/ui/` | shadcn atoms: `button, badge, container, section, section-heading, input, label, textarea, select, radio-group, accordion, dialog, sheet` | mostly server-safe primitives |
| `components/sections/` | Page sections: `hero, trust-bar, services-overview, service-card, how-it-works, why-us, before-after, testimonials, review-card, service-area, city-card, faq, cta-section, page-hero` | mostly server components |
| `components/layout/` | `header`, `footer` | `header` is `"use client"` (scroll state, mobile sheet) |
| `components/brand/` | `logo` (inline SVG placeholder), `mascot` (next/image) | server |
| `components/quote/` | `quote-form`, `quote-dialog`, `quote-cta` | all `"use client"` |
| `components/` (root) | `icon, reveal, json-ld, booking-embed, locale-toggle, phone-link, star-rating, check-list` | mixed |
| `components/analytics/` | `google-analytics` (env-gated `next/script`) | client |

**Server vs client split.** The default is **Server Components**; `"use client"` is opted into only where interactivity demands it — `header.tsx:1` (scroll/sheet state), all of `quote/*`, `reveal.tsx:1` (motion + reduced-motion hook), `locale-toggle.tsx:1`. Pages are async server components that compose section components and inject JSON-LD.

**Notable patterns:**

- **`Reveal` (motion + graceful degradation).** `components/reveal.tsx` wraps content in a `motion.div` with `whileInView` fade/translate. It (a) early-returns a static `<div>` when `useReducedMotion()` is true (`reveal.tsx:31-33`), and (b) carries `data-reveal` so the CSS `@media (scripting: none)` rule forces `opacity:1; transform:none` when JS is off (`globals.css:205-210`). Documented constraint: never wrap the LCP hero (`reveal.tsx:20`).
- **Progressive-enhancement `QuoteCTA`.** `components/quote/quote-cta.tsx` renders a *real* `<Link>` to `/quote` (works with no JS). When JS is present, a click handler calls `e.preventDefault()` and opens the multi-step modal instead — but **modifier/middle clicks fall through to navigation** (`quote-cta.tsx:45-51`). Optional `service` slug prefills the form and is propagated as `?service=` in the href. This is the single entry point for "Get a free quote" across the site (hero, header, sections, service/city pages).
- **Icon registry.** `components/icon.tsx` maps the content-owned `IconName` union to lucide components via a `Record<IconName, LucideIcon>` registry, with a11y-aware `aria-hidden`/`aria-label`/`role` defaults. Content references icons by name; the UI resolves them — type-safe end to end.
- **LocaleToggle** renders real locale-aware `<Link href={pathname} locale={...}>` (SEO/keyboard friendly), preserving the current path across language switches (`locale-toggle.tsx:29-44`).

---

## 8. Lead Capture & Forms

### Multi-step wizard (`components/quote/quote-form.tsx`, client)

A 4-step RHF + zod wizard. Steps and their field groups are declared in `STEP_FIELDS` (`quote-form.tsx:37-42`): (0) service → (1) property type + bedrooms/bathrooms/sqft → (2) frequency → (3) contact (name/email/phone/address/message/consent).

- **Schema** is built with `useMemo` so zod error messages are *localized* via `useTranslations("Quote.validation")` (`quote-form.tsx:59-91`); resolver is `zodResolver(schema)`, mode `"onTouched"`.
- **Per-step validation:** `next()` calls `form.trigger(STEP_FIELDS[step])` and only advances if the current step's fields pass (`quote-form.tsx:120-123`), so users can't skip ahead invalid.
- **Client honeypot:** a visually-hidden, `aria-hidden`, `tabIndex={-1}` "Company" field (`quote-form.tsx:204-210`); the schema constrains it to `max(0)` and `onSubmit` short-circuits to fake success if filled (`quote-form.tsx:130-134`).
- **Submission:** strips the honeypot, POSTs `{...lead, locale}` to `/api/lead` (`quote-form.tsx:137-146`), then renders a success panel (with a `devNote` when the API reports dev mode) or an inline error block.
- **Prefill:** `defaultService` flows from `QuoteCTA`'s `service` prop (modal) or from `searchParams.service` on the standalone `/quote` page (`quote/page.tsx:37-38`, guarded by `isServiceSlug`).

The form is reused verbatim in both surfaces: inside `QuoteDialog` (modal) and directly on `/quote` (page), via the `onClose?` prop toggling the modal-only "Done" button.

### API route (`src/app/api/lead/route.ts`, Node runtime)

Server-side, defense-in-depth pipeline:

1. **JSON parse guard** → 400 `invalid_json` on malformed body (`route.ts:77-81`).
2. **Server-side zod validation** — independent `leadSchema` with length caps and `email()` (`route.ts:10-25`); `safeParse` failure → 400 `validation`. The client cannot bypass this.
3. **Server honeypot** — if `company` is non-empty, **silently return `{ ok: true }`** without sending (don't tip off bots) (`route.ts:89-92`).
4. **Env-gated Resend** — if no `RESEND_API_KEY`, log the lead to the server console (honeypot field nulled) and return `{ ok: true, dev: true }` so the UI still shows success in local dev (`route.ts:94-104`).
5. **Email send** — `Resend.emails.send` with `replyTo: lead.email`, `to` from `LEAD_NOTIFICATION_EMAIL` (default `info@limpioscleaning.com`), `from` from `LEAD_FROM_EMAIL`. Errors → 502 `send_failed`; unexpected → 500 `server_error` (`route.ts:106-130`).
6. **HTML escaping** — `escapeHtml()` escapes `& < > "` on every label and value before interpolating into the email HTML table (`route.ts:29-35, 62-63`). A plain-text alternative is built alongside.

**Data flow:** `QuoteForm` (client zod) → `POST /api/lead` (server zod + honeypot + escape) → Resend email to the business inbox (or console in dev). The route is excluded from i18n middleware via the `proxy.ts` matcher.

**Booking seam.** `components/booking-embed.tsx` is the single documented integration point for a real online-booking provider (BookingKoala / Launch27 / Jobber / Housecall Pro). It currently renders a "coming soon" placeholder and explicitly instructs not to wire a provider in the frontend phase (`booking-embed.tsx:4-12`).

---

## 9. SEO Architecture

**Metadata.** `src/lib/metadata.ts` `buildMetadata()` produces per-page `Metadata` with a **canonical URL** (`{site.url}/{locale}{path}`) and **hreflang alternates** generated for every locale plus `x-default` → default locale (`metadata.ts:30-36`). It sets Open Graph (`type/url/title/description/siteName/locale`) and Twitter (`summary_large_image`). The og:image is intentionally *not* set here — it's supplied by the `opengraph-image` file convention (`metadata.ts:11-14`). The layout sets `metadataBase` and a title template `"%s | {siteName}"` (`layout.tsx:46-62`).

**Dynamic OG/Twitter images.** `src/app/[locale]/opengraph-image.tsx` uses `next/og` `ImageResponse` to render a brand-gradient 1200×630 PNG **per locale**, pulling localized pills + tagline + the NAP phone from the catalog/`site` (`opengraph-image.tsx`). Build marks `/-/opengraph-image` and `/-/twitter-image` as dynamic (`ƒ`).

**JSON-LD builders** (`src/lib/json-ld.ts`), rendered via the `JsonLd` component which `<`-escapes `<` to prevent script-context breakout (`components/json-ld.tsx:11`):

- `localBusinessSchema` — full NAP, geo, `openingHoursSpecification` (mapped from `site.hours`), `areaServed` (all cities), `sameAs` socials. **AggregateRating is conditionally spread only when `!reviewsArePlaceholder`** (`json-ld.ts:64-72`) — the central honesty gate.
- `serviceSchema` — `Service` with `provider` back-reference to the LocalBusiness `@id`, `areaServed: Florida`.
- `faqPageSchema` — `FAQPage` from the ordered `faqIds`.
- `breadcrumbSchema` — `BreadcrumbList` (used on service detail pages).

The homepage emits LocalBusiness + FAQPage (`page.tsx:34-39`); service pages emit Service + FAQPage + Breadcrumb (`services/[service]/page.tsx:95-108`).

**Sitemap & robots.** `src/app/sitemap.ts` programmatically emits **every route × every locale** with per-entry `changeFrequency`/`priority` and **`alternates.languages`** for each URL (`sitemap.ts:37-49`), iterating `serviceSlugs` and `citySlugs` so new content auto-appears. `src/app/robots.ts` allows `/`, disallows `/api/`, and points to `sitemap.xml` + `host` (both from `site.url`).

---

## 10. Security Posture

| Control | Implementation |
|---|---|
| **Secrets management** | `.env*` gitignored (except `.env.example`); `.gitignore:33-35`. Keys read via `process.env` server-side only. README:90 reinforces "never commit real keys." |
| **Env-gating** | Resend (`route.ts:94`) and GA4 (`google-analytics.tsx:9-10`) both no-op without keys — safe defaults, nothing breaks unconfigured. |
| **Honeypot (defense in depth)** | Hidden `company` field, enforced both client-side (`quote-form.tsx:131`) and server-side (`route.ts:90`); bots silently "succeed." |
| **Server-side validation** | Independent zod schema on the API (`route.ts:10-25`) — the client schema is not trusted. |
| **HTML escaping** | `escapeHtml()` on all email content (`route.ts:29-35`); JSON-LD `<`-escaping (`json-ld.tsx:11`). |
| **No SMS automation** | The Google Voice line is explicitly **click-to-call only** — `site.ts:18-19` warns against building SMS on it. |
| **No fabricated structured data** | `reviewsArePlaceholder` gate prevents emitting AggregateRating/Review schema for sample reviews (`json-ld.ts:64`, `reviews.ts:1-13`). No fake reviews shipped to production. |
| **robots** | `/api/` disallowed from crawl (`robots.ts:9`). |

The API runs on the Node.js runtime (uses `resend`). There is no auth surface, database, or PII storage — leads are transient (emailed, not persisted), which minimizes the attack/compliance surface for this phase.

---

## 11. Build, Tooling & Quality Gates

**Scripts** (`package.json:5-11`): `dev` (`next dev`), `build` (`next build`), `start` (`next start`), `lint` (`eslint`), `typecheck` (`tsc --noEmit`). The documented quality gate (CLAUDE.md:18-20) is `typecheck && lint && build` must all pass — confirmed: the build ran TypeScript and generated all 50 pages with exit 0.

**ESLint flat config** (`eslint.config.mjs`): composes `eslint-config-next/core-web-vitals` + `/typescript`, customizes `no-unused-vars` to allow `_`-prefixed identifiers, and re-declares default ignores (`.next`, `out`, `build`, `next-env.d.ts`).

**TypeScript** (`tsconfig.json`): `strict: true`, `noEmit`, `moduleResolution: "bundler"`, `paths: { "@/*": ["./src/*"] }`, Next plugin enabled. `target ES2017`.

**Line-endings/git hygiene.** `.gitattributes` normalizes text to LF (`* text=auto eol=lf`) and marks binary asset types so they skip EOL conversion — important on this Windows host. `.gitignore` covers `node_modules`, `.next`, `.env*`, `*.tsbuildinfo`, `.vercel`, and per-user `.claude/settings.local.json`.

**Repo.** Private GitHub repo `AntonioKida/Limpios_Cleaning`, single `main` branch. Recent history shows a phased build (homepage+form → all pages → lead backend+GA → SEO → docs/a11y polish):

```
8a6029d docs+chore: README, project CLAUDE.md, a11y polish
af88cc8 feat: SEO — OG/Twitter images, JSON-LD, sitemap, robots, hreflang
613cb19 feat: lead-capture backend + GA4 placeholder
845393c feat: all remaining pages (...)
293d3a6 feat: full homepage sections + multi-step QuoteForm
```

**shadcn config** (`components.json`): style `radix-nova`, RSC + TSX enabled, CSS variables, lucide icons, aliases mapped to `@/components`, `@/lib`, etc.

---

## 12. Rendering & Performance Considerations

- **SSG coverage is the headline.** 50 pages prerendered; all content pages (`home, services + 6 details, service-areas + 8 cities, pricing, about, reviews, contact`) are `●` SSG across both locales. Only `/quote`, `[...rest]`, the API, and OG/Twitter generators are dynamic.
- **`next/image`** for the mascot (`brand/mascot.tsx`): `fill`, `priority`, `placeholder="blur"` (static import enables a blur data URL), responsive `sizes`. Quality tiers declared in `next.config.ts`. Before/after gallery uses local placeholder SVGs today.
- **`next/font`** self-hosts Poppins/Inter with `display:"swap"` → no external request, minimal CLS.
- **LCP strategy.** The hero headline and CTA row are **not** wrapped in opacity animation — `Reveal` is used only for the eyebrow/secondary rows, and its docstring forbids wrapping the LCP element (`reveal.tsx:20`, `hero.tsx:30,45`). The mascot image carries `priority`. Animations universally respect `prefers-reduced-motion` (global rule `globals.css:192-201` + `useReducedMotion()` in `Reveal`).
- **Why `/quote` is dynamic:** it reads `searchParams.service` to prefill — request-time input (`quote/page.tsx:33`). **Why `[...rest]` is dynamic:** it must invoke `notFound()` per request to render the localized 404 inside the locale layout (`[...rest]/page.tsx`, `not-found.tsx`).
- **Header** uses a passive scroll listener (`{ passive: true }`) and CSS `backdrop-filter` for the sticky transition (`header.tsx:38-43`).

---

## 13. Extensibility

The hybrid model makes the three most common growth operations **data edits, not code changes** — and each propagates automatically.

**Add a service** (propagates to: services hub, homepage grid, service detail page + its SSG params, sitemap, quote-form options, related-service links):
1. Append a slug to `serviceSlugs` + a `Service` entry (icon/price/related/featured) in `content/services.ts`.
2. Add a `Services.items.<slug>` block (name/tagline/description/metaDescription/who/included/factors) to **both** catalogs.
3. If a new icon: add to `IconName` (`content/icons.ts`) and register it in `components/icon.tsx`.

**Add a service-area city** (propagates to: areas hub, homepage shortlist, `[city]` page + SSG params, sitemap, nearby-city internal links):
1. Append a `City` entry + extend the `CitySlug` union in `content/cities.ts`.
2. Add a `ServiceAreas.cities.<slug>` block to both catalogs.
(README:154-162 documents this; the `[city]` route's `generateStaticParams` reads `citySlugs` directly.)

**Add a locale** (the heaviest, but still mostly centralized):
1. Add the code to `routing.locales` in `i18n/routing.ts` — this single change flows to middleware, navigation, `generateStaticParams`, hreflang (`metadata.ts` loops `routing.locales`), and sitemap alternates.
2. Add `messages/<locale>.json` at full key parity (437 keys).
3. Add an `OG_LOCALE` entry in `metadata.ts:5-8` and the OG image's locale handling.

---

## 14. Technical Debt, Risks & Limitations

**Placeholder `// TODO`s (all clearly marked; README has the full checklist:227-265):**

| Area | Placeholder | Location |
|---|---|---|
| Logo/favicon | Simplified SVG mark is a placeholder; needs real vector | `brand/logo.tsx:7`, `app/icon.svg:1-2` |
| Mascot | Source JPEG on a navy frame; needs transparent PNG | `brand/mascot.tsx:8` |
| Photos | Founder + before/after are placeholder SVGs | `content/founder.ts:9-10`, `content/gallery.ts` |
| Pricing | All amounts are market-estimate placeholders | `content/services.ts:33`, `content/pricing.ts:3` |
| Business facts | License `000000000`, hours, geo, founding year, Facebook URL unconfirmed | `content/site.ts:37,62,77,44` |
| Reviews | Sample testimonials, `reviewsArePlaceholder=true` | `content/reviews.ts` |
| Booking | No provider integrated (seam only) | `booking-embed.tsx` |
| Email sender | `LEAD_FROM_EMAIL` is `onboarding@resend.dev` until domain verified | `route.ts:108-110`, `.env.example:17` |

**Other limitations & risks:**
- **Spanish is a machine-assisted draft** awaiting native review (README:171-175). Key parity is perfect, but copy quality is unverified.
- **Build output omits bundle-size reporting** in this Turbopack configuration — performance budgets aren't currently observable from CI output. No bundle-analyzer is wired.
- **Programmatic city pages are a thin-content risk at scale.** Today 8 cities × largely templated copy (`[city]/page.tsx` interpolates `{city}` into shared strings). Adding many more cities with the same template could trigger doorway/thin-content concerns; per-city unique prose would be needed.
- **Message-catalog growth.** A flat-file catalog (437 keys, ~37–40 KB each) is fine now but scales linearly with content; there's no CMS, so non-technical content edits require JSON editing and parity discipline.
- **No automated tests.** No unit/integration/visual-regression tests exist; the quality gate is type-check + lint + build only. The progressive-enhancement and reduced-motion behaviors are untested in CI.
- **Leads are not persisted** — if the Resend send fails after the 502, the lead is lost (no queue/retry/DB).

**Deferred phases (explicitly out of scope now):** DNS / pointing `limpioscleaning.com` at Vercel, Resend sending-domain verification, and choosing+embedding a booking provider (README:268-287).

---

## 15. Recommendations for Next Phases

Prioritized, architect-level:

**P0 — Launch blockers (content/infra, not code):**
1. Replace all `// TODO` business data (license, hours, geo, real GBP rating + review URL, Facebook) in `content/site.ts`; confirm publishable pricing.
2. Replace sample reviews with real Google reviews and flip `reviewsArePlaceholder = false` to enable AggregateRating — only after real data exists.
3. Verify a Resend sending domain and set `LEAD_FROM_EMAIL`; configure prod env vars on Vercel.
4. Native-speaker review of `messages/es.json`.
5. Drop in real brand assets (transparent mascot PNG + vector favicon) and real before/after photography; consider an image pipeline (AVIF/WebP, sized variants) for real photos once they exist.

**P1 — Resilience & observability:**
6. **Persist/queue leads** before/after the email send (e.g. a lightweight store or a Vercel queue) with retry, so a Resend outage doesn't drop a lead. Add basic rate-limiting to `/api/lead`.
7. Add **bundle-size visibility** (bundle analyzer or a size budget in CI) since the Turbopack build output doesn't surface it.
8. Add a minimal **test layer**: zod schema unit tests, a parity test asserting EN/ES key equality in CI (codify the README one-liner), and a smoke/visual-regression pass (Playwright) on key routes — including no-JS and reduced-motion paths.

**P2 — Performance & scale:**
9. Evaluate **Next 16 Partial Prerendering / `cacheComponents`** for `/quote` (static shell + dynamic prefill island) to recover SSG benefits on the one dynamic page that matters.
10. Integrate the chosen **booking provider** at the documented `BookingEmbed` seam; treat its script as a third-party perf cost (lazy/`afterInteractive`).
11. If the service-area list grows substantially, move city copy toward **per-city unique content** (or introduce a CMS) to avoid thin/doorway-page SEO risk; reassess **flat-file vs headless CMS** for the message catalogs once non-developers need to edit copy regularly.
12. Replace the homepage/contact **map placeholders** with a real embedded map, and add the founder video slot's real asset.

---

### Appendix — Verification facts

- Build: `next build` exit 0; **50 static pages** generated; route types per the table in §3.
- Catalogs: **437 leaf keys** in each of `en.json`/`es.json`, **0 parity drift** (verified by recursive key diff).
- LOC (TS/TSX): app 1,642 · components 3,147 · content 551 · lib 234 · i18n 44.
- Inventory: 11 page routes, 43 component `.tsx`, 11 content modules, 13 UI primitives.
- Public assets: `public/brand/logo.jpeg`, 7 placeholder SVGs, `src/assets/mascot.jpeg`, `src/app/icon.svg` (placeholder).
- Git: private repo `AntonioKida/Limpios_Cleaning`, branch `main`.
