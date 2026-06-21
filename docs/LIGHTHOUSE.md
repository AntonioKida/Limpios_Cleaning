# Lighthouse — Round 2

**Measured against a local production build** (`npm run build && npm run start`, Lighthouse 12, mobile/simulated-throttling, route `/en`). A Vercel preview run is the authoritative target (see [§Deploy](#deploy-the-preview--re-run-on-vercel)); several local dings are platform artifacts that resolve there.

## Scores (local production build)

| Category | Score | Notes |
|---|---|---|
| **Accessibility** | **100** | 0 contrast failures (fixed the editorial ghost numbers). |
| **Best Practices** | 96 | Only ding: a 404 on `/_vercel/insights/script.js` — **served by Vercel in production**, 404s only locally. → expect **100** on Vercel. |
| **SEO** | 92 | Only ding: `canonical` points to `https://limpioscleaning.com/...`. That is correct (canonical → production domain). It flags on any non-production host (localhost or `*.vercel.app`). → **100** on the live domain. |
| **Performance** | 85 | See CWV below. LCP is inflated by cold local `next/image` optimization + Lighthouse throttling; Vercel serves CDN-optimized, cached images. |

## Core Web Vitals (local)

| Metric | Value | Verdict |
|---|---|---|
| First Contentful Paint | 1.1 s | Good |
| **Cumulative Layout Shift** | **0** | Excellent (no layout shift) |
| Total Blocking Time | 60 ms | Good |
| Largest Contentful Paint | 4.4 s | Image-bound; local cold-optimization + throttling artifact (the hero mascot). Expected to drop well under 2.5 s on Vercel's image CDN. |

## What was fixed for Lighthouse in Round 2

- **Accessibility 96 → 100:** the How-It-Works "ghost" numbers used `text-border` (~1.1:1). Lighthouse flags low-contrast text even when `aria-hidden` (it's a visual issue, not just an AT one). Bumped to a subtle slate that clears the large-text 3:1 threshold; kept `aria-hidden` (the `<ol>` already conveys order). 0 contrast failures.
- **Console 404 (favicon):** added a real `favicon.ico` (matches `icon.svg`) so the browser's default `/favicon.ico` probe no longer 404s.

## Localhost-only artifacts (resolve on Vercel)

1. `/_vercel/insights/script.js` 404 → the Vercel Analytics script is injected by the platform; only 404s off-Vercel.
2. `canonical` "points to another domain" → the canonical correctly references the production domain; it will pass on `limpioscleaning.com`.
3. Inflated LCP → `next/image` optimizes on first request locally (no CDN). Vercel caches optimized images at the edge.

## Deploy the preview & re-run on Vercel

The repo isn't linked to Vercel yet (this phase intentionally skips DNS/Vercel). One‑time setup (needs the account owner):

**Option A — Git integration (recommended):** In the Vercel dashboard → Add New → Project → import `AntonioKida/Limpios_Cleaning`. Every push to `main` then auto-builds a deployment; PRs get preview URLs. Add env vars (see `.env.example`).

**Option B — CLI:**
```bash
npm i -g vercel
vercel login           # interactive
vercel                 # deploy a preview, prints the URL
```

Then run Lighthouse against the preview URL:
```bash
npx lighthouse https://<preview>.vercel.app/en \
  --only-categories=performance,accessibility,best-practices,seo \
  --output=html --output-path=./lighthouse-preview.html
```

**Expected on Vercel:** Accessibility 100, Best Practices 100, SEO 92 on the preview host / 100 on the live domain, Performance materially higher than 85 (CDN-optimized images). CLS stays 0.
