# Fable run plan — repositioning + audit (2026-07-06)

Operator: Claude Fable 5 (auditor + implementer mode), branch `fable/reposition-audit`.
This file is the staged plan + reasoning trail. Sub-agent task definitions and raw
returns live in `audit/fable/subagents/`. Raw research notes in `audit/fable/research/`.
Media analysis raw notes in `audit/fable/media-analysis/`. Screenshots (reveals
neutralized) in `audit/fable/screenshots/`.

## Stages

1. **Ingest existing context** — docs/, README, content layer, component tree.
   Delegated two Explore agents (docs summary; structure map) + read the full
   content layer + `messages/en.json` firsthand. DONE — see subagents/01, /02.
2. **Independent research** — delegated a web-research agent (GBP, Facebook,
   Instagram, South Lake Chamber, Sunbiz, Yelp, misc). DONE — see subagents/03
   and research/web-research-raw.md. Key outcome: research *independently
   corroborates* Papo's B2B-first framing; chamber membership verified; legal
   entity Judean Services LLC (2023); real Facebook URL found; zero public
   reviews anywhere (honesty gate must stay).
3. **Media analysis (vision)** — I viewed all 20 new images (img10–29) with
   vision myself, and extracted frames from vid8/vid9 with a local ffmpeg
   (OBS-bundled binary; no system install). Catalog → docs/fable-audit/10-media-catalog.md.
4. **Reposition implementation** — content layer + EN/ES catalogs + components.
   Decision gates G1/G2/G3 implemented as reversible defaults (see
   docs/fable-audit/30-decision-gates.md).
5. **Media integration** — extend gallery script (img27/28 composites), new
   job-photos pipeline (native aspect, WebP + blur), posters for vid8/vid9,
   small muted self-hosted clip for vid9 (window proof), YouTube seam for vid8.
6. **Audit** — parallel sub-agents (visual/geometry, UX flows, role walkthroughs
   ×5, a11y/SEO/i18n baseline) + my own independent re-verification.
7. **Fix + verify** — implement findings; `typecheck · lint · test · build` green.
8. **Report + trail** — docs/fable-audit/FABLE_FINAL_REPORT.md, commit everything, push.

## Standing constraints honored

- Honesty gate: `reviewsArePlaceholder=true` stays; AggregateRating suppressed
  (research found 0 real reviews — the gate is factually required, not optional).
- Truth-in-advertising: no invented facts; licensing wording per G3; unverified
  claims (HEPA/eco/24h re-clean/military years) stay on the OWNER confirm list.
- G1–G3 reversible defaults, never silent deletion.
- i18n EN/ES parity; WCAG AA; SSG-first; click-to-call only; no DNS changes;
  bulk media out of Git (posters + small muted clips only).
