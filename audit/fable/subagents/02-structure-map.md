# Sub-agent 02 — structure map (Explore, very thorough)

## Task definition (summary of verbatim prompt)

> Map the Next.js 16 App Router site: (1) route map incl. SSG params; (2)
> component tree with one-liners; (3) content-layer wiring; (4) nav structure
> with file:line; (5) messages key hierarchy + parity test; (6) lead/quote
> flow files; (7) media dirs/scripts/component references; (8) tests.

## Raw return (condensed verbatim — full detail preserved where load-bearing)

### Routes
[locale]/page (home) · services + services/[service] (generateStaticParams over
serviceSlugs) · pricing · service-areas + service-areas/[city] (params over
citySlugs) · about · reviews · contact · quote · [...rest] 404 ·
api/lead (POST; rate-limit → zod → honeypot → persist → Resend) · sitemap.ts
(all routes × locales + hreflang alternates) · robots.ts ·
opengraph-image/twitter-image per locale. Middleware = src/proxy.ts.

### Components (dirs + load-bearing ones)
- layout/header.tsx (185 LOC): sticky header; `navItems` at :24–30 =
  services, serviceAreas, pricing, about, reviews; mobile sheet adds contact
  (:158); quote CTA; locale toggle.
- layout/footer.tsx (218 LOC): brand blurb, services nav (:77–90 maps ALL
  services), featured-cities nav (:93–111), company nav (:115–140), contact
  block (:143–193), license line, socials.
- sections/: hero, hero-video (self-hosted muted loop), trust-bar (4 stats),
  see-in-action, services-overview (featured grid), how-it-works (3 steps),
  why-us (4 points), before-after(+slider, gallery-grid), testimonials,
  service-area (featured cities), faq, cta-section, page-hero, service-card,
  city-card, review-card, portrait-video (facade; url-less → decorative still).
- quote/: quote-form (4-step RHF+zod+honeypot), quote-cta, quote-dialog.
- ui/: shadcn primitives incl. section (surface: white/cool/none), container,
  section-heading, button (variant cta = orange w/ navy text).
- brand/logo, brand/mascot, icon.tsx (lucide registry), json-ld,
  breadcrumb-json-ld, booking-embed, analytics/*.

### Content wiring
site.ts (NAP/hours/rating/foundedYear) → header/footer/contact/JSON-LD.
services.ts (slug union + price models) → hub/detail/footer/quote/pricing.
cities.ts → city pages/footer/hub. pricing.ts (4 packages + 5 factors) →
pricing page. reviews.ts (placeholder flag) → reviews/testimonials.
faq.ts (8 ids) → FAQ UI + FAQPage JSON-LD. gallery.ts (9 pairs, flagships,
galleryForService) → home + service galleries. media.ts (7 YT clips + hero
self-host exception) → hero/see-in-action/service pages/about. home.ts
(trustStats/steps/whyPoints). founder.ts (TODO placeholders + valueCards).

### Messages
16 top-level namespaces (Meta, Common, Nav, Footer, Home, Services, Pricing,
ServiceAreas, About, Contact, Quote, Reviews, Faq, Booking, NotFound, Video);
tests/parity.test.ts enforces EN/ES key + ICU-placeholder parity.

### Lead flow
quote-form.tsx → POST /api/lead → ip → rate-limit (Upstash or in-memory) →
zod (lead-schema.ts) → honeypot silent-accept → persistLead (lead-store.ts,
Redis 90d, BEFORE email) → Resend send → markEmailStatus → 200 if persisted.

### Media
public/gallery (18 WebP halves committed) · public/video-posters (7 jpg) ·
public/video/vid4-hero.mp4 (committed exception) · public/Youtube +
public/trimmed + /Media gitignored. scripts/process-gallery.mjs (sharp split
1024² composites → 506×1024 WebP q80 + blur json). hero.tsx references
self-hosted loop; portrait-video renders facade.

### Tests
tests/parity.test.ts (key + ICU parity) · tests/lead-schema.test.ts
(validation + honeypot + bounds). Plus typecheck/lint/build gates;
audit/smoke.mjs.

### Load-bearing unions
serviceSlugs (services.ts:8–15) · CitySlug (cities.ts:11–19) ·
PricePackageId (pricing.ts:10) · faqIds (faq.ts:6–15) ·
locales en/es (i18n/routing.ts) · GalleryId (gallery.ts) · VideoId (media.ts) ·
IconName (icons.ts).
