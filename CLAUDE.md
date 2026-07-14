@AGENTS.md

# Limpios Cleaning — project notes

Bilingual (EN/ES) marketing site for a veteran-owned cleaning company. See
`README.md` for the full guide. Key conventions:

- **Next.js 16** (App Router, Turbopack default, async `params`/`searchParams`).
  i18n middleware uses `src/proxy.ts` (the Next 16 rename of `middleware.ts`).
- **i18n architecture:** translatable prose lives in `messages/{en,es}.json`
  (keep keys parallel); structure + non-translatable data (slugs, icons, prices,
  NAP, relationships) lives in `src/content/*.ts`. Components are content-driven.
- **Typed message keys:** `src/global.ts` augments next-intl against `en.json`.
  Dynamic keys only type-check when the id is a literal union — that's why
  service/city/review/pricing ids are union types in `src/content/*`.
- **Brand tokens** are CSS variables in `src/app/globals.css`. Orange is the
  `cta` Button variant ONLY (navy text for AA). Base neutral is warm `#f7f6f3`.
  No gradient "blob" glows — flat / shield-grid motifs. Don't add a dark theme.
- **Type:** headings Bricolage Grotesque, body Public Sans (next/font, bound to
  `--font-heading`/`--font-sans`). Fluid `clamp()` scale in `@theme` (body
  16→18). Nothing user-facing < 14px; inputs ≥16px; no light body weights.
- **Motion:** `Reveal` is static by default; only `<Reveal signature>` animates
  (the hero entrance). Keep reduced-motion + `@media (scripting: none)` fallbacks.
- **Locale-aware nav:** import `Link`/`redirect` from `@/i18n/navigation`, not
  `next/*`. Routes come from `src/lib/routes.ts`.
- **Lead pipeline:** `/api/lead` rate-limits, validates (`src/lib/lead-schema.ts`),
  persists (`src/lib/lead-store.ts`, Upstash/KV env-gated) BEFORE emailing
  (Resend). Don't make a Resend failure drop the lead or 502 the user.
- **Quality gate:** `typecheck && lint && test && build` must all pass (plus
  `check:placeholders`, which blocks new TODOs *and* any em-dash in copy). The
  Vitest parity test fails on i18n key drift.
- **Honesty gate:** there are no reviews and no ratings. The placeholder reviews
  and the `reviewsArePlaceholder` flag are gone; `/reviews` is now `/trusted-by`
  (anonymized client categories live, named clients gated behind
  `clientsServedEnabled`, no logos ever). Never emit `AggregateRating` until real
  attributable reviews exist.
- **Turbopack dev cache** can serve stale CSS after token edits — `rm -rf .next`
  and restart if a change doesn't show. The production `build` is authoritative.
- Placeholders are marked `// TODO` (and `(TODO confirm with Papo)` in copy); the
  README has the replacement checklist. The owner goes by **Papo**.
