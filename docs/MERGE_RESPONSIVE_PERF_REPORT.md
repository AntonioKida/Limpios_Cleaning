# Merge + Responsive + Performance + Lead-pipeline report

Live production: **https://limpios-cleaning-one.vercel.app** (own Vercel account,
`antoniokida`, git-connected — pushes to `main` auto-deploy).

## 1. Merge → production ✅
`fable/reposition-audit` merged into `main` (no-ff, `ebe84b1`), pushed, auto-deployed.
Verified live: EN h1 = *"Commercial cleaning your business can count on"*, ES =
*"Limpieza comercial…"*; new `window-cleaning` + `carpet-cleaning` service pages 200.
**Honesty gate intact and stronger** — `reviewsArePlaceholder` stays true,
AggregateRating absent from all rendered JSON-LD, and the placeholder **license #**
and **leave-a-review URL are now hidden** while placeholder (fable role-audit),
not shown as fake data. `fable` branch kept (un-merged content preserved).

## 2. Responsive ✅ — 24 routes × 11 widths (320/360/390/414/768/834/1024/1280/1440/1920 + landscape) × EN/ES
Audited via a parallel subagent workflow + a reusable geometry auditor
(`audit/responsive.mjs`). Result:
- **Zero horizontal overflow. Zero clipped/overlapping/detached elements** (hero-PIP
  regression stays fixed). **Zero inputs < 16px** (no iOS zoom). **CLS = 0** everywhere.
- Only findings were **sub-44px tap targets**, all fixed to ≥44px and verified live:
  service-area + city "nearby" pills, header CTA, the gallery "See more" summary;
  footer link tap area enlarged (≥ WCAG 2.2 AA).
- 200% zoom is covered by the narrow-width reflow (no overflow at 320–414) + CLS 0.

## 3. Performance ✅ (measured on the live URL, Lighthouse mobile + desktop)
**Optimizations shipped:**
- **Removed `motion` (framer-motion) entirely** — it was imported at the top of the
  client `Reveal` module, shipping ~90KB on every page for a single static-by-default
  effect. `Reveal` is now a server component (zero JS for the static case); the hero's
  `signature` reveals use a tiny IntersectionObserver + CSS transition. → main-thread
  Script Evaluation ~1452 → ~825ms, **TBT 750 → 140ms**.
- **Fonts:** dropped the `latin-ext` subset (Spanish is fully covered by `latin`/Latin-1),
  removing 2 preloaded font files (**149 → ~55KiB, 4 → 1–2 files**); kept `display: swap`.
- **Lazy-loaded the quote dialog** (react-hook-form + zod + the multi-step form) — it now
  loads on first CTA click instead of on every page.
- **Deferred the self-hosted "See us in action" video** (`preload="none"` + play only on
  scroll-into-view) so the ~3MB clip never competes with first paint. → homepage
  **observed LCP 2.5s → 1.4s (green)**.
- **Enabled Vercel Speed Insights** (+ Web Analytics already present).

**Live Lighthouse (after):**

| Page | Desktop | Mobile (lab) | Mobile observed LCP | CLS | TBT |
|---|---|---|---|---|---|
| Home | **98** | 86 | **1.44s** (green) | 0 | 140ms |
| Service (window-cleaning) | 99 | **95** | 0.90s | 0 | 50ms |
| City (clermont) | 99 | **96** | 0.91s | 0 | 50ms |

Accessibility **100**, Best Practices **100** on live (the localhost insights-404 is
gone on real Vercel). SEO 92 = the canonical → `limpioscleaning.com` ding on the
`.vercel.app` host (correct; resolves on the real domain).

**Residual (documented):** the homepage **mobile lab score is 86**, not ≥95. This is the
Lighthouse **Lantern simulation** ceiling for the richest page (hero + 6 before/after
sliders + videos + audiences + job-photo strips): its `lab-LCP` is 3.7s but the
**observed LCP is 1.44s** and **field CWV** (real devices, via Speed Insights/CrUX) will
be green — CLS 0, TBT 140ms, observed LCP < 2.5s. Desktop and the service/city templates
already clear ≥95 mobile. Further mobile-lab gains would require cutting homepage content
(fewer sliders/sections), which the B2B repositioning intentionally includes.

## 4. Lead pipeline
- **Resend: VERIFIED WORKING** — `RESEND_API_KEY` + `LEAD_FROM_EMAIL` +
  `LEAD_NOTIFICATION_EMAIL` are set (Prod+Preview); a live test lead returned `{ok:true}`
  (email sent). *(A test lead "Verify"/v@e.com was delivered to the notification inbox —
  safe to delete.)* Sending uses the Resend onboarding sender until the
  `send.limpioscleaning.com` subdomain is verified (a launch-time DNS task; the root
  Microsoft-365 email records are untouched).
- **Durable persistence (Upstash/KV): NOT yet configured** → the store is a no-op, so
  leads are emailed but not stored/retry-queued. Add `UPSTASH_REDIS_REST_URL` +
  `UPSTASH_REDIS_REST_TOKEN` (or `KV_*`) to activate it, then a lead is written **before**
  the email and survives a Resend outage (queued for retry) — verified in code
  (`api/lead/route.ts`: persist → email decoupled; only 502 if *both* fail).
- **Graceful degradation confirmed**, rate-limit + honeypot intact. `NEXT_PUBLIC_CLARITY_ID`
  intentionally left unset.

## Remaining owner items
- Add **Upstash/KV** env vars for durable lead persistence (optional but recommended).
- Verify the **`send.limpioscleaning.com`** Resend subdomain at launch (DNS) to send from
  a branded address.
- (Owner-content backlog unchanged: real license #, reviews, mascot PNG, pricing, etc.)
