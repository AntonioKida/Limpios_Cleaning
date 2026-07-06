# Audit findings — fixed vs. accepted (Fable run, 2026-07-06)

Sources: Playwright+axe harness (`audit/results.json`, 53 pages), five
role-based walkthroughs (`docs/fable-audit/20-role-flows/`), independent
integrity verification (`audit/fable/integrity-verification.md`), my own
vision review of breakpoint/section screenshots (`audit/fable/screenshots/`).

## Baseline re-verified after all changes (held ✅)

| Bar | Result |
|-----|--------|
| axe WCAG 2.x A/AA | **0 violations** on all 24 EN desktop routes (incl. 2 new service pages) |
| h1 per page / heading order | 1 everywhere, no skips |
| Images missing alt | 0 |
| CLS | **0.000** max across 53 page-loads (incl. new job-photo strips + video facades) |
| Mobile overflow @390 | 0 pages |
| Console errors | 0 — except the known `/_vercel/insights/script.js` 404, a localhost-only artifact (script exists only on Vercel origins) |
| Link graph | 0 orphans; every page ≤2 clicks from home |
| Quote flow (E2E) | opens → step validation → submit → success, all green |
| i18n parity | 2 files / 11 tests green; ES spot-checks fully Spanish |
| Honesty gates | AggregateRating absent everywhere; sample-review disclaimer present; no TODO leakage in rendered copy; zero `$<amount>` price anchors EN+ES |
| typecheck · lint · test · build | all green |

## Fixed during this run (CODE — all verified on the rebuilt server)

| # | Sev | Finding (source) | Fix |
|---|-----|------------------|-----|
| F1 | P1 | "5-star rated" hero chip + reviews-hero star glyphs with zero real reviews anywhere (my sweep + research) | Removed; hero chip now shows the *verified* chamber membership |
| F2 | P1 | Quote-form frequency couldn't express nightly/2-3×-week contracts or per-turnover cadence — the site's own headline use-cases (PM, HOA, commercial, construction walkthroughs) | Added "Custom schedule (nightly, 2–3× a week…)" + "Per turnover / as needed" options (EN/ES) |
| F3 | P1 | Footer rendered placeholder "LIC# 000000000" under a "licensed" claim — trust-eroding for vendor-vetting buyers (all three B2B walkthroughs) | License line now gated behind `site.licenseIsPlaceholder`; hidden until the real number lands |
| F4 | P2 | No company/organization field on a B2B estimate form — and the hidden honeypot squatted on the name `company` (a real business name would have silently dropped the lead if ever wired) (PM, commercial, construction) | Honeypot renamed → `website`; real optional "Company / organization" field added to step 4; schema/API/email/tests updated + regression test |
| F5 | P2 | "**Every** Limpios service is available in {city}" above a 5-of-8 grid — false claim post-demotion (homeowner walkthrough) | Reworded to "Our core services are all available in {city} — and the rest of the catalog is too, on request" (EN/ES) |
| F6 | P2 | Hub demotion copy was circular ("ask during your walkthrough" — a new visitor has none) (homeowner) | "…request a free estimate and we'll set up a walkthrough" |
| F7 | P2 | Homepage had zero breadcrumb toward residential after the demotion (homeowner) | New quiet FAQ item "Do you also clean homes?" (EN/ES) — discoverable without re-promoting |
| F8 | P2 | Dead "Leave a review" button pointed at a placeholder g.page URL (PM) | Gated behind `site.rating.isPlaceholder` — hidden until the real GBP link exists |
| F9 | P2 | My own new copy claimed "photo-documented results" / "with photos on every unit" — an unconfirmed practice (PM walkthrough caught it) | Softened both instances; moved to OWNER list ("confirm + restore if true — it's a strong differentiator") |
| F10 | P2 | "Bedrooms" field shown to office/construction/HOA property types (commercial, HOA) | Bedrooms now hidden for non-residential property types (`useWatch`-driven) |
| F11 | P3 | "Call or text-free line" garbled contact heading (3 walkthroughs) | "Call us" + explicit "calls only, no texts" body (EN/ES) |
| F12 | P3 | Pricing copy said "nightly, weekly, monthly", omitting the biweekly the form offers (homeowner) | Factor copy now lists all four (EN/ES) |
| F13 | P3 | FAQ intro said "facility and property folks" — mislabeled on residential pages (homeowner) | Neutralized to "clients" |
| F14 | P3 | Hours block implied business hours conflict with "after-hours available" (commercial) | Relabeled "Phone & office hours" (footer + contact, EN/ES) |
| F15 | P3 | No volume/portfolio acknowledgement anywhere in the pricing model (PM, construction) | Neutral invitation line added to pricing page (no pricing-policy claims) |
| F16 | P3 | Mission card lacked the icon its two siblings have (my vision pass on the new 3-card About grid) | ShieldCheck icon added |
| F17 | P3 | Quote-flow harness itself broke on the 8-option step (sr-only radio unactionable) | Harness now clicks the visible label card, like a real user |

## Accepted (documented, deliberately not changed)

| # | Finding | Why accepted |
|---|---------|--------------|
| A1 | FAQ answers not in DOM until expanded (Radix accordion) → no-JS users see questions only | Answers ship to crawlers via FAQPage JSON-LD on every page that renders the accordion; forceMount would change collapse/animation semantics site-wide for a marginal audience. Revisit if no-JS traffic matters. |
| A2 | `aria-label="5 out of 5 stars"` inside the disclaimed sample review cards | The cards are explicitly labeled placeholders; the label accurately describes the sample graphic. Dies naturally when real reviews land. |
| A3 | Homepage before/after gallery remains residential-toned (tubs/fridges) under a B2B hero | Real work is real proof and the intro copy now frames it as "the standard we hold". The actual fix is owner-supplied commercial/post-construction before-afters — OWNER list, top priority. |
| A4 | 5 primary cards leave a ragged 2-card second row at desktop | Standard grid behavior; alternatives (asymmetric spans) cost more coherence than they buy. |
| A5 | `/_vercel/insights/script.js` 404 in local prod | Exists only on Vercel origins; DEPLOY-bucket verification item. |
| A6 | Sample reviews contain no HOA voice; walkthrough-vs-phone-quote proportionality for small homes; nightly-crew trust content (key/alarm handling) | All owner-decision content — parked in the OWNER bucket with recommendations, not inventable. |

## OWNER-bucket additions from this audit (see FABLE_FINAL_REPORT for the full refreshed list)

COI/insurance-details language · night-access/key/alarm/QC facts · volume &
per-floor-plan pricing policy · capacity/lead-time numbers · photo-documentation
policy (restore F9 copy if real) · commercial + carpet + construction proof
imagery · real reviews incl. builder/HOA/PM voices · GBP creation (no profile
found at all) · real license number (unhides footer line) · window/carpet
included-scope sign-off · vid8 clean re-upload (muted) · img16 consent.
