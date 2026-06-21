# Limpios Cleaning — Round 2 Brief (for Claude Code)

> Repo: `AntonioKida/Limpios_Cleaning` (private), branch `main`. The Round-1 build is complete, audited (see `docs/`), and engineering-sound. Round 2 has two goals: **(A) make the site stop reading as "AI-generated"** and **(B) harden the engineering** flagged in review. Work within the existing architecture — do NOT rewrite the hybrid content model, i18n, or the design-token system; refine them.
>
> Read the whole brief before starting. Preserve everything in the **Guardrails** section (§C). Commit in logical increments. Update `README.md` / `CLAUDE.md` where conventions change.

---

## A. De-AI / de-template workstream (the priority)

The site is clean but currently pattern-matches to "made by a generator." Each item below removes a specific tell. Implement all of them.

### A1. Re-typeface (highest-leverage change) — COMMITTED, do not re-litigate

Replace **Poppins + Inter** (the #1 AI-default pairing) everywhere with:

- **Headings → Bricolage Grotesque** (variable; humanist, slightly irregular — reads "drawn by a person," which is the point).
- **Body → Public Sans** (variable; the USWDS/government typeface — clarity + a quiet civic/credible undertone that reinforces *veteran-owned*; full Spanish diacritic coverage).

Implementation:
- Load both via `next/font/google` (self-hosted, `display:"swap"`), bound to the existing CSS variables `--font-heading` / `--font-sans` in the theme. Remove the Poppins/Inter imports entirely (no leftover references in `layout.tsx`, `globals.css`, or anywhere).
- Use Bricolage's optical-size axis where appropriate for large display headings.
- Fallback stacks: headings → `"Bricolage Grotesque", "Hanken Grotesk", system-ui, sans-serif`; body → `"Public Sans", system-ui, -apple-system, sans-serif`.
- Verify EN **and** ES render correctly (ñ, á/é/í/ó/ú, ¿, ¡) at all weights used.

**Escape hatch (only if needed):** if, at real size on the page, Bricolage headings feel like too much character next to the mascot, swap headings to **Hanken Grotesk** and keep Public Sans for body. Do not change body away from Public Sans. Flag it in the PR/commit if you take this path.

### A2. Type SIZE & legibility mandate (explicit requirement — must pass)

Standard, comfortable sizing across the **entire** site. Nothing cramped, nothing tiny, no faint-gray micro-text. This is a hard spec, not a preference.

**Rules:**
- **Do not shrink the root font-size.** Keep the browser default 16px root so user zoom / accessibility settings work. No `html { font-size: 14px }` or rem-hacking the base down.
- **Body copy:** 16px minimum on mobile, **17–18px on desktop** (use the responsive/fluid scale below). Line-height **1.6–1.7** for body.
- **Absolute minimum for any text a user reads:** **14px** (footer links, helper text, disclaimers, captions — all ≥14px). The only thing allowed below that is nothing; if you're tempted to go 12px, it's wrong.
- **All-caps eyebrows/labels:** ≥13px with letter-spacing ~0.08–0.12em and **AA-contrast color** (not a faint tint). These are the one place small is acceptable, but keep them readable.
- **Form inputs:** font-size **≥16px** (prevents iOS auto-zoom on focus) — applies to `input`, `textarea`, `select`.
- **Body weight:** 400 minimum. **No 300/light weights for body or any small text.**
- **Measure:** cap body text blocks at ~66–70ch so lines don't run edge-to-edge.
- **Tap targets:** ≥44×44px for all interactive elements.
- **Audit + fix:** grep the codebase for `text-xs`, `text-[1*px]`, `text-sm`, low-opacity/muted text, and any `font-light`/`font-thin`. Bump anything carrying real content to meet the rules above. Disclaimers and the pricing fine-print currently render small/faint — fix those specifically.

**Suggested fluid scale** (implement with `clamp()`; values are the target, tune visually):

| Token | Mobile → Desktop | Line-height | Notes |
|---|---|---|---|
| Display / H1 | 40px → 60px | 1.05–1.15 | tracking ~ -0.02em |
| H2 | 30px → 44px | 1.1–1.2 | tracking ~ -0.015em |
| H3 | 22px → 28px | 1.2 | |
| H4 | 19px → 22px | 1.25 | |
| Lead / intro ¶ | 18px → 20px | 1.5 | |
| **Body (base)** | **16px → 18px** | **1.6–1.7** | the default everywhere |
| Small / meta | 14px → 15px | 1.5 | floor = 14px |
| Eyebrow (caps) | 13px → 14px | — | tracking +0.1em, AA color |

After implementing, spot-check at 320px, 390px, and desktop, and at 200% browser zoom (text must reflow, nothing clipped).

### A3. Kill the gradient "blobs" + warm the base neutral

- Remove the pale radial-gradient glows in hero corners and behind section headings — they're *the* template/Framer visual signature. Replace with intentional treatment: flat color, a subtle geometric motif derived from the logo's **shield** silhouette, a light paper/texture, or a real photo bleed. When in doubt, clean flat color beats a blob.
- Warm the base neutral: the current `--cool-white #F4F9FB` reads cold/synthetic. Shift section backgrounds toward a warmer off-white (e.g. around `#F7F6F3`/`#F6F5F2` — tune against the blues so it still feels clean, not cream). Re-check AA contrast for text on the new surface.

### A4. Copy pass (EN + ES) — de-LLM the prose

The copy has a recognizable model cadence. Fix the patterns, keep the meaning:
- **Em-dashes:** cut ~70%. They're in nearly every subhead in both languages. Replace with periods, commas, or restructured sentences.
- **Break the rule-of-three.** Not every line needs three parallel clauses. Vary it.
- **Break the section symmetry.** Right now every section is eyebrow → title → one-sentence subtitle. Let some sections open differently — a blunt one-liner, a longer paragraph, a question, a direct quote from Papo.
- **Add specificity** (the strongest anti-AI signal). Where we have facts, use them; where we're awaiting Papo's answers, insert clearly-marked `// TODO` placeholders with realistic stand-in text:
  - Papo's first-person voice on About/Why-us ("Hi, I'm Papo — I started Limpios after…").
  - Named neighborhoods, concrete guarantee wording (e.g. "not happy? we re-clean within 24 hours, free" — TODO confirm), actual products/equipment ("we bring our own HEPA vacuums and eco, low-odor products" — TODO confirm).
- Keep ES parallel in meaning but apply the same de-LLM treatment; it remains a machine-assisted draft pending native review (don't claim it's finalized).
- Preserve all i18n keys and parity (see Guardrails).

### A5. Icons — de-default them

Current state = stock lucide line-icons in soft rounded-square tinted containers (the canonical template card). Choose one:
- **Preferred:** introduce a small set of **brand-specific icons** drawn from the logo motifs (spray bottle, Panama hat, gloves, peace sign) for the key spots (services, how-it-works, trust bar). SVG, consistent stroke/scale, registered through the existing `IconName`/`<Icon>` registry.
- **Minimum:** keep lucide but give it a single distinctive brand treatment (duotone or brand-colored, consistent) and **drop the tinted-square container cliché** or redesign it so it isn't the default soft-rounded tile.

### A6. De-template 2–3 sections + vary the surface treatment

Convention aids usability, so don't nuke everything — but break the "I've seen this page 500 times" monotony:
- Make **one** section genuinely asymmetric/editorial (off-center, an image bleeding off-grid, a 60/40 split — not another centered 3-card grid).
- **Vary card treatments** across the page instead of identical `rounded-xl` + soft-shadow tiles everywhere. Vary radius and elevation **with intent** (uniform radius/shadow on every element is itself a tell).
- Restyle the **floating hero pills** ("5-star rated," "Veteran-owned") so they feel anchored/custom rather than the default glassy Framer-hero trope — or replace with one strong real proof element.

### A7. Motion — restraint over uniform fade-up

Every block currently does the same scroll fade-up (the default generator motion). Replace with: **one or two signature moments** (e.g. a considered hero entrance, a single tasteful reveal on a key section) and **stillness everywhere else**. Keep `prefers-reduced-motion` and no-JS fallbacks intact (they're good — don't regress them).

---

## B. Engineering hardening workstream

From the architecture/UX review. These are mostly independent of A and can proceed in parallel.

### B1. Resolve the "1 Issue" dev-overlay warning
The Next.js dev overlay shows `1 Issue` on every page, which is unreconciled with the audit's "0 warnings." Identify the underlying issue (open the overlay / check `next dev` output — likely a metadata, image, or hydration notice), fix it, and confirm the overlay reads **0 issues**. If it's a benign framework notice that can't be removed, document exactly what it is in the README.

### B2. Lead persistence + rate-limiting (highest-value resilience fix)
Today a Resend failure returns 502 and the lead is **lost** — unacceptable for a lead-gen site.
- Persist every lead **durably before/independently of** the email send (a lightweight store — e.g. Vercel KV/Postgres, or at minimum a second notification channel) with a retry path so a Resend outage doesn't drop the lead.
- Add basic **rate-limiting** to `POST /api/lead` (per-IP, sane window) to blunt spam/abuse.
- Keep the existing honeypot + server-side zod + HTML-escaping intact.

### B3. Bundle-size visibility
Turbopack's build output doesn't surface First Load JS. Wire a bundle analyzer (or a size-budget check) so bundle growth is observable. Report the current key route sizes in the PR.

### B4. Minimal CI test layer
- **EN/ES key-parity test** (codify the README one-liner so it fails CI on drift).
- **Zod schema unit tests** for the lead/quote schemas (valid/invalid cases, honeypot).
- **Playwright smoke** on key routes including the **no-JS** and **reduced-motion** paths (build on the existing `audit/` harness).

### B5. Corrected visual-QA screenshots
The Round-1 screenshots are full-page captures of a scroll-reveal site, so below-the-fold sections render blank (opacity 0) — the visual review couldn't actually see them. Re-capture with reveals neutralized: run with `prefers-reduced-motion`/`scripting:none`, OR scroll-and-settle each section before capture, so every section is actually visible. These become the real visual sign-off artifacts.

### B6. Vercel preview deploy + Lighthouse
Deploy a **preview** to Vercel and run **Lighthouse against the preview URL** (not dev). Confirm Performance/SEO/Best-Practices/Accessibility ≥ 95 and capture real LCP/CLS. Fix any regressions the new fonts/layout introduce (e.g. font loading, CLS). Include the Lighthouse summary in `docs/`.

---

## C. Guardrails — do NOT break these

- **Hybrid content model** (typed structure in `src/content/*.ts` + prose in `messages/{en,es}.json`) stays. New copy/icons go through it, not hardcoded in JSX.
- **i18n key parity:** EN/ES must remain at exact key parity (the new parity test enforces this).
- **Honesty gate:** keep `reviewsArePlaceholder = true` and the `AggregateRating` suppression until real reviews exist. Do not ship fake reviews, ratings, or fabricated structured data.
- **Accessibility:** stay WCAG AA. Preserve navy-on-orange CTA contrast, skip link, `:focus-visible`, reduced-motion + no-JS fallbacks. The new type scale must keep contrast AA on the new warmer surface.
- **SSG-first** rendering; don't make static pages dynamic.
- **Booking:** leave the `BookingEmbed` seam as a placeholder — no provider integrated this phase.
- **Phone:** click-to-call only (Google Voice) — no SMS automation.
- **No DNS / sending-domain changes** this phase.
- Keep `typecheck && lint && build` green as the gate.

---

## D. Suggested sequence

1. **Typography (A1) + sizing mandate (A2)** first — it touches the most and changes how everything else reads.
2. **Surface + layout de-templating (A3, A6)**, then **icons (A5)** and **motion (A7)**.
3. **Copy pass (A4)** once layout is stable.
4. **Engineering hardening (B1–B4)** — can run in parallel with 1–3.
5. **Corrected screenshots (B5)** and **Vercel preview + Lighthouse (B6)** **last**, so QA reflects the final state.

---

## E. Definition of done

- `typecheck`, `lint`, `build` all green; committed in logical increments; README/CLAUDE.md updated for any new conventions.
- **No Poppins/Inter anywhere**; Bricolage Grotesque + Public Sans self-hosted via `next/font`, EN/ES verified.
- **Type scale enforced:** body ≥16px (17–18 desktop), nothing user-facing below 14px, inputs ≥16px, no light body weights; verified at 320/390/desktop and 200% zoom.
- **No gradient blobs**; base neutral warmed; contrast re-checked AA.
- **Em-dash usage cut ~70%** and section rhythm varied (EN + ES); specificity added with marked placeholders where awaiting Papo.
- Icons de-defaulted (brand set or distinct treatment); ≥2 sections de-templated; card radius/elevation varied with intent; hero pills restyled; motion restrained.
- **"1 Issue" resolved** (overlay reads 0) or documented.
- **Lead persistence + retry + rate-limiting** in place; honeypot/zod/escaping preserved.
- **Bundle analyzer** wired + route sizes reported; **CI tests** (parity, zod, Playwright smoke incl. no-JS/reduced-motion) passing.
- **Corrected full-section screenshots** captured; **Vercel preview deployed**; **Lighthouse ≥95** on the preview with LCP/CLS captured in `docs/`.

---

*North star: someone who builds these sites for a living should look at it and think "a real shop hired a designer," not "a model generated this." Type with character at a comfortable size, intentional surfaces, specific human copy, and a couple of moments that don't come out of a template.*
