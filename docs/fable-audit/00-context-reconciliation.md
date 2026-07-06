# Context reconciliation — repo vs. independent research vs. Papo's new info

**Date:** 2026-07-06 · **Author:** Claude Fable 5 (auditor + implementer run)
**Sources compared:**
- **(a) Repo / site as built** — content layer (`src/content/*.ts`), message
  catalogs (`messages/{en,es}.json`), prior audit docs (`docs/*`). Ingested
  firsthand + via sub-agents (raw returns: `audit/fable/subagents/01,02`).
- **(b) Independent research** — Facebook, Instagram, South Lake Chamber
  directory + Best of South Lake 2026 nomination, Florida registries (Sunbiz
  mirrors), Yelp, City of Clermont directory, limpioscleaning.com. Raw notes:
  `audit/fable/research/web-research-raw.md`; summary:
  `audit/fable/subagents/03-web-research.md`.
- **(c) Papo's new info** — the owner's authoritative statement (services,
  audience, area, pricing, credentials) provided for this engagement.

## Verdict in one paragraph

The repo tells a **residential-first, price-anchored, city-enumerated** story.
The real business — per **both** independent research and the owner — is a
**commercial-first** cleaning company serving **Central Florida from Lake
County**, selling through a **walkthrough + free estimate** model, with
verified **South Lake Chamber membership** and a veteran-owned identity.
Research and Papo agree with each other on every material point and jointly
diverge from the repo; the repositioning is therefore corrective, not
speculative. The only place research adds beyond Papo: the legal entity
(Judean Services LLC, filed **2023**), the **real Facebook URL**, the
verified chamber listing, and confirmation that **zero public reviews exist**
(which makes the repo's honesty gate mandatory).

## Divergence table

| # | Topic | (a) Repo / site | (b) Independent research | (c) Papo | Divergence & action |
|---|-------|-----------------|--------------------------|----------|---------------------|
| D1 | Primary audience | Residential-first: hero "homes and offices", residential leads grid, pricing tiers residential | IG bio: "Central Florida Based Commercial Cleaning Services"; award self-desc: "We are a Commercial Cleaning Company… Move out cleaning services for Property Managers"; IG imagery commercial/office | Commercial businesses, property managers, HOAs, construction cos. | **Repo wrong.** Reposition B2B-first (implemented). |
| D2 | Service set | 6: residential, commercial, deep-cleaning, move-in-out, post-construction, interior-painting | Commercial + move-out for PMs; painting mentioned only on the GoDaddy lander ("4 years"); no window/carpet found | 5: commercial, post-construction, move-in-out, **window**, **carpet**; residential & painting dropped | **Gate G1.** Added window + carpet; demoted residential + painting reversibly (routes/content preserved). See 30-decision-gates.md. |
| D3 | Service area | 8 enumerated city pages + ZIP chips; "Clermont & Central Florida" everywhere | "Lake County and surrounding areas"; Clermont directory says "Lake and Orange County" | "Throughout Central Florida, based in Lake County. Keep it broad — no zip/city enumeration" | **Gate G2.** Copy reframed to Central Florida/Lake County; city pages kept for SEO but retoned; ZIP chips removed from city pages (data retained in `cities.ts`). |
| D4 | Pricing | Published anchors: from $120 / $200 / $99 per visit; FAQ quotes dollar figures | FB price range "$$" only; no published prices anywhere | Depends on sqft/scope/manpower/space/conditions → **walkthrough + free estimate**, no published prices | **Repo wrong.** All "from $X" anchors removed; estimate/walkthrough model implemented site-wide. |
| D5 | Credentials | "Licensed & insured", eco, HEPA, bilingual, veteran-owned, 24-hr re-clean; license `LIC# 000000000` placeholder | FB: "license and insured"; site claims SBA VetCert (low-med confidence), 28 yrs military, HEPA/eco; **chamber membership VERIFIED** | Licensed (city business license; no trade license required) + insured; veteran-owned; **Chamber member** | **Gate G3** wording implemented; chamber badge added (verified fact). HEPA/eco/re-clean/military stay on OWNER confirm list — not expanded. |
| D6 | Founding year | `foundedYear: 2021` (TODO placeholder), renders "Family-run since 2021" | LLC filed **2023-09-18**; DBA filed 2023-10-14 | (not stated) | Repo claim likely false. Updated to 2023 (evidence-based) + kept on OWNER confirm list. |
| D7 | Facebook URL | Placeholder `facebook.com/limpioscleaning` (TODO) | Real page: `facebook.com/LimpiosCleaningManagement` (verified) | (not stated) | Fixed from research. |
| D8 | Reviews/rating | Placeholder 5.0 × 27 + sample quotes, gated + disclaimed | **0 reviews found anywhere** (FB "Not yet rated (0 Reviews)"; Yelp unrated; no GBP trace) | (not stated) | Honesty gate stays mandatory. Sample quotes retoned B2B; disclaimer intact. OWNER: build GBP + collect reviews (top growth lever). |
| D9 | Google Business Profile | `g.page` review link placeholder assumes GBP exists | No indexed GBP trace found (medium confidence it doesn't exist) | (not stated) | OWNER action (high priority): create/verify GBP. Flagged in report. |
| D10 | Owner identity | founder.ts `TODO: Owner Name`; About story "I'm Papo" | Hubert C. "Papo" Noboa, President & RA of Judean Services LLC | Goes by Papo | OWNER decides public name usage; not asserted on-site by me. |
| D11 | Tagline/NAP | "Sit back, relax, and we will do the cleaning."; Minneola NAP | Matches FB verbatim; NAP consistent across 5+ sources | — | **Agreement** — no change. |
| D12 | Business hours | Placeholder M–F 8–18, Sat 9–15 (TODO) | No hours published anywhere | — | Stays OWNER TODO. |

## What research could NOT establish

- Whether a GBP exists at all (Maps requires JS; absence in index is only
  medium confidence). — OWNER should confirm/create.
- SBA VetCert (website-only claim). — Do not assert on-site.
- Any operational detail of window/carpet services (equipment, methods).
  Copy for the two new pages therefore describes *typical scope* without
  equipment/method claims, and is flagged for owner sign-off.
- Whether the "$$" Facebook price band or any past pricing was ever public —
  nothing beyond the repo's own placeholders anchors $120/$200; safe to remove.

## Consequences implemented (cross-refs)

- Repositioning change-set: `docs/fable-audit/40-repositioning-changes.md`
- Decision gates G1–G3: `docs/fable-audit/30-decision-gates.md`
- Media catalog + placements: `docs/fable-audit/10-media-catalog.md`
- Final consolidated report: `docs/fable-audit/FABLE_FINAL_REPORT.md`
