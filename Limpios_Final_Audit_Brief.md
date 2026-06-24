# Limpios Cleaning — Final UX/UI Audit + Fix Batch (for Claude Code)

> Repo: `AntonioKida/Limpios_Cleaning` (private). The build is feature-complete and previously audited. This brief has two jobs: **(1)** ship a small fix batch, then **(2)** run an exhaustive, designer-grade UX/UI audit across **every menu, section, subsection, and form** using an **orchestrator + subagent** workflow.
>
> **End-state goal (read this first):** when you're done, the **only** things left should be *Papo's real content to paste in* (and deploy-dependent checks). In other words, drive the **CODE bucket to empty**. Anything within your control that's wrong gets fixed in this pass — not just reported.
>
> Preserve the **Guardrails** (§4). Keep `typecheck · lint · test · build` green. Commit in logical increments.

---

## Part 1 — Fix batch (do first, it's small)

1. **Whole service card clickable.** On the "Cleaning services for every space" grid, the entire card should be the link target, not just "View details →". Wrap each card in `next/link`, add a hover affordance (`hover:shadow-md hover:-translate-y-0.5 transition`), keep the inner link keyboard-focusable without nested-anchor issues (use a card-level link with the heading as accessible name; avoid `<a>` inside `<a>`).
2. **Dynamic copyright year.** Footer shows a stale year. Replace the hardcoded year with `new Date().getFullYear()` (server component) so it never goes stale. Verify it renders 2026.
3. **Pre-commit / CI guard against placeholder leakage.** Add a check (husky pre-commit + a CI step) that **fails on `TODO|FIXME` and on the literal `(TODO confirm` and `LIC# 000000000`** appearing in shipped source/copy (`src/**`, `messages/**`). This is the safety net so placeholder copy can never silently reach production. (It should currently *flag* the known placeholders — that's expected; they're owner-content items, see §5. Configure it to **warn loudly** but you may allow an explicit allowlist for the known-pending strings so commits aren't blocked, OR gate them behind a `PLACEHOLDER_OK` env. Decide and document.)
4. **Curate the before/after gallery.** Six raw transformations in a row can read as *disgust* rather than *desire*. Lead with **2–3 dramatic-but-clean** pairs (suggest: tub rust→gleaming, full bathroom stained→bright, fridge interior moldy→spotless), and put the rest — especially the gunky fridge-drawer pair — behind a **"See more transformations"** expand/disclosure. Keep all pairs accessible; just don't front-load the most stomach-turning ones.
   - **Aspect ratio nuance:** do NOT blanket-convert to landscape. Some pairs are genuinely vertical (shower door, tub/toilet, fridge drawer) and would crop badly at 4:3. Respect each pair's **native aspect ratio**, or pick per-image; horizontal shots (kitchens, patio, fridge) can go wider.

Plus one confirm: **How-It-Works must be a semantic `<ol><li>`** (numbered steps), not `<p>` tags — fix if needed, ignore if already a list.

---

## Part 2 — The comprehensive audit (orchestrator + subagents)

### 2.0 Your role: orchestrator, not rubber-stamp

You are the **orchestrator**. You will spawn parallel **subagents**, each owning one audit slice. **Do not trust their self-reports.** For every issue a subagent marks "fixed" or "verified," you **independently re-verify** before accepting it (re-run the tool, re-view the file at the cited line, re-capture the screenshot, re-grep). A subagent's job is to find/fix and report; *your* job is to prove each claim is true and that no fix regressed anything else. Reconcile overlaps, dedupe, resolve conflicts, and own the final verdict.

### 2.1 Build the coverage inventory FIRST (so nothing is skipped)

Before dispatching subagents, enumerate the full surface and hand each subagent its slice of it:
- **Every route**, both locales: home, services hub + 6 service pages, service-areas hub + all city pages, pricing/quote, about, reviews, contact, 404 — in `/en` and `/es`.
- **Every section** within each route (hero, trust strip, "See us in action," services, how-it-works, why-us, gallery, reviews, service-area, FAQ, CTA, footer, etc.).
- **Every interactive element**: header nav, mobile sheet, language switcher, all CTAs, quote modal (all steps), contact form, before/after sliders, FAQ accordions, video facades, card links.
Confirm **100% of this inventory is assigned** and later **100% covered**. Track it.

### 2.2 The subagents (dispatch in parallel)

Each subagent must return findings as: `severity · route/section · file:line · what's wrong · proposed fix`, then implement fixes in its slice. Severities: **P0** (broken/blocker), **P1** (real defect), **P2** (polish).

| # | Subagent | Scope & checklist (the "senior eye") |
|---|---|---|
| **A** | **Visual design & coherence** (the lead designer eye) | Per-section *and* cross-section: alignment to a consistent grid, consistent spacing scale (no random offsets), section-padding consistency, vertical rhythm, surface-alternation cadence, **corner-radius and shadow-elevation consistency**, icon stroke/size consistency, color-token discipline (flag any off-palette hex), type scale + hierarchy consistency, optical alignment, balanced negative space, no orphaned/floating/detached elements, no widow/orphan headlines, image crop quality. Capture screenshots **with reveals neutralized** (reduced-motion / scroll-and-settle — full-page live captures blank out reveal content) at **320 / 390 / 768 / 1024 / 1440** for every route, and judge each against this rubric. Flag anything that looks "off," misaligned, mis-offset, or incoherent. |
| **B** | **Layout & responsive** | Every route at 320/375/768/1024/1280/1536: zero horizontal overflow, **zero overlap / no detached floating elements** (regression-guard the old hero-PIP bug), no clipped/cut content, correct reflow of every grid, image/video aspect handling, **CLS = 0**, sticky-header condense-on-scroll, tap targets ≥44px, safe-area/notch. Verify via screenshots **and** element geometry (positions, gaps, overlaps) — geometry is the source of truth when captures are flaky. |
| **C** | **Navigation & IA** | Crawl all menus/sections/subsections. **Every internal link resolves** (no 404 / dead end), correct locale target, header + footer nav, mobile sheet open/contents, language switcher preserves path (EN⇄ES), active states, back/breadcrumb links, anchor scrolls, conversion CTA reachable in 0–1 clicks from every page. Build the link graph; report any orphan or broken edge. |
| **D** | **Forms & interaction** | Quote modal: every step, per-step validation, `?service=` prefill, success state, **error state, loading/pending state + double-submit prevention**, honeypot, **date-not-in-past, min bed/bath counts**, focus trap, ESC/close, focus-on-open and focus-return. Contact form same rigor. Before/after slider: mouse + touch + **keyboard** + reduced-motion/no-JS fallback + ARIA (`role`/`aria-label`). FAQ accordion: keyboard, no CLS. Inputs ≥16px (no iOS zoom). |
| **E** | **Accessibility** | axe (WCAG 2.0/2.1 A/AA) on **all** routes EN+ES → 0 violations. One h1/route, heading order, landmarks, skip link, all `alt`, **How-It-Works is `<ol>`**, card headings have accessible names, slider/dialog ARIA, focus-visible everywhere, reduced-motion honored, no-JS resilience, `lang` per locale. Re-check the contrast the external critics flagged: **orange CTA + the "from $120" pill** and **body text on the warm-neutral surface** — prove AA with numbers. |
| **F** | **Content & i18n integrity** | EN/ES key + rendered parity (no untranslated leakage, no mixed-language strings). **Grep for and report every `TODO`, `FIXME`, `(TODO confirm`, `LIC# 000000000`, "coming soon", "sample", lorem.** Verify dynamic copyright year. **Honesty gate intact:** `reviewsArePlaceholder = true`, AggregateRating suppressed and absent from rendered JSON-LD. NAP consistent everywhere; brand name consistent; em-dash discipline held. **Produce the definitive owner-content placeholder list** (this becomes §5). |
| **G** | **Performance & SEO (static)** | `next/image` everywhere (WebP/AVIF, explicit sizes, `priority` on the LCP, lazy below fold), **LCP element is the headline (not the mascot/video)**, video lazy + poster, fonts self-hosted, bundle-size report. Per-route metadata, JSON-LD (LocalBusiness/Service/FAQPage/Breadcrumb), sitemap/robots, hreflang(en/es/x-default), OG images. Note: authoritative Lighthouse/CWV needs the Vercel preview (owner/deploy-side) — flag it, but verify all *static* SEO/perf structure here. |

### 2.3 Orchestrator reconciliation + verification loop

1. Collect all subagent findings; **dedupe and reconcile** (e.g., a spacing issue flagged by A and B is one item).
2. **Fix every P0 and P1 in the CODE bucket** (you or the owning subagent). P2 polish: fix if cheap, else log.
3. **Independently verify each fix** — re-run the relevant check yourself, re-view file:line, re-capture the screenshot, re-grep. A fix isn't "done" until *you* reproduced the green result. Confirm no regression (re-run the full baseline: axe, parity, zod, smoke, build).
4. Confirm **100% inventory coverage** (every route/section/form from §2.1 was actually audited).
5. Loop until the **CODE bucket is empty** — nothing in your control remains broken or off.

---

## Part 3 — (reserved) — n/a

## Part 4 — Guardrails (do NOT break)

- **Honesty gate stays:** reviews placeholder + disclaimer; AggregateRating suppressed until real reviews exist. No fake data.
- i18n key parity preserved; all copy via the content layer, not hardcoded.
- WCAG AA preserved; SSG-first; no booking provider added; click-to-call only; **no DNS/email changes**.
- Don't add bulk media to Git (videos stay on YouTube/host; only the 3MB self-hosted hero clip + posters + ~1MB gallery WebP belong in-repo).
- Keep `typecheck · lint · test · build` green.

---

## Part 5 — Final deliverable: the three-bucket verdict

Produce **`docs/UX_UI_AUDIT_FINAL.md`** (same rigor as prior reports) that ends with every remaining item sorted into exactly one bucket:

- **CODE — must be empty.** Anything in your control. If this bucket has entries at the end, you're not done — fix them.
- **OWNER (Papo content) — the paste-in list.** The exhaustive, specific list of what's still placeholder and waiting on real content: real **license #**, the `(TODO confirm with Papo)` copy claims (HEPA vacuums / 24-hr re-clean / eco products), **real Google reviews** (→ flip `reviewsArePlaceholder`), **transparent mascot PNG + favicon** (also unlocks the deferred hero badge), **higher-res separate before/after originals**, **Img7 painting-vs-cleaning** confirmation, real **service-area map / GBP**, and confirmation the **YouTube embeds play** (URLs already wired). Each item: where it lives in the code and exactly what to paste/replace.
- **DEPLOY (needs Vercel) .** Lighthouse-on-preview, video playback confirmation on the deploy, Deployment Protection, and `NEXT_PUBLIC_CLARITY_ID` (intentionally deferred to launch — leave it here, don't treat as outstanding now).

Include: the coverage inventory (100% checked), the consolidated findings table with what was fixed, before/after screenshots at the breakpoints, and the green baseline.

## Definition of done
Fix batch (Part 1) shipped; full audit run via subagents with **you independently verifying every fix**; **CODE bucket empty**; baseline green (axe 0, parity, zod, smoke, build); `docs/UX_UI_AUDIT_FINAL.md` committed with the three-bucket verdict and 100% coverage; pushed.

---

*Success looks like: a reviewer who has both the page and the codebase open finds nothing left to change that isn't Papo's real content. That's the bar — get the CODE bucket to zero.*
