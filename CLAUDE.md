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
  `cta` Button variant ONLY (navy text for AA). Don't add a dark theme.
- **Locale-aware nav:** import `Link`/`redirect` from `@/i18n/navigation`, not
  `next/*`. Routes come from `src/lib/routes.ts`.
- **Quality gate:** `npm run typecheck && npm run lint && npm run build` must all
  pass. Reviews are placeholders — keep `reviewsArePlaceholder` true (gates
  rating structured data) until real Google reviews replace them.
- All placeholders are marked `// TODO`; the README has the replacement checklist.
