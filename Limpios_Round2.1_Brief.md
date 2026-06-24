# Limpios Cleaning — Round 2.1 Brief (for Claude Code)

> Repo: `AntonioKida/Limpios_Cleaning` (private). Round 2 is complete and deployed to a Vercel preview (`limpios-cleaning.vercel.app`). Round 2.1 has three jobs — **(A) structural refinements, (B) integrate Papo's real photos/video, (C) analytics** — and then **(D) a final UX/UI audit as the closing gate** to verify the whole thing still makes sense.
>
> Work within the existing architecture (hybrid content model, next-intl, design tokens). Preserve the **Guardrails** (§E). Commit in logical increments. Keep `typecheck · lint · test · build` green throughout. **Do not run the final audit (§D) until A–C are done.**

---

## A. Structural refinements (from the UX length review)

The homepage isn't too long for the genre, but the top third repeats itself and the rhythm can tighten.

- **A1 — Kill the duplicate trust signals.** The hero trust line and the standalone trust bar directly below it state the same four claims (Veteran-owned · Licensed & insured · Eco-friendly · 5-star). Resolve the duplication: **either** fold the trust bar into the hero and delete the standalone band, **or** re-purpose the trust bar to carry *new* proof — a number, not a restatement (e.g. "500+ Central Florida homes cleaned," "serving since 20XX," or the real Google rating + count once reviews exist). Pick one; remove the redundancy.
- **A2 — Re-angle "Why Limpios."** It currently restates veteran-owned + eco a third time. Lead the cards with angles not already said: same vetted team every visit, room-by-room checklist, fast response/quote, and the concrete 24-hour free re-clean guarantee. Keep veteran/eco at most once more.
- **A3 — Tighten section padding.** Reduce vertical padding modestly and intentionally to cut scroll fatigue. Do **not** remove trust sections (reviews, FAQ, service area, credentials) — for an in-home-service purchase they're conversion-positive even though they add length.

---

## B. Real media integration (the high-impact work)

Papo provided 9 before/after photos (`Img1.jpeg`–`Img9.jpeg`) and 7 videos (`Vid1.mp4`–`Vid7.mp4`). These replace the placeholder media and are the biggest trust/de-AI upgrade available — real owner, real local team, real Central Florida homes.

### B0 — Asset manifest (content → placement)

| File | What it is | Primary placement |
|---|---|---|
| Img1 | B/A shower glass: soap-scum → clear | Before/after gallery (supporting) |
| **Img2** | B/A tub+toilet: rust/grime → gleaming | Gallery **flagship**; Deep cleaning |
| Img3 | B/A shower tile + corroded hose → cleaned | Gallery (detail) |
| Img4 | B/A kitchen: cluttered/dirty → cleared | Gallery; Residential / Move-out |
| **Img5** | B/A full bathroom: stained → bright | Gallery **flagship**; Deep cleaning |
| Img6 | B/A kitchen/stove: → empty clean | Move-in/out |
| Img7 | B/A screened patio concrete → clean/**coated** | Interior painting/floors *(confirm)*; outdoor range |
| **Img8** | B/A refrigerator interior: moldy → spotless | Gallery **flagship**; Deep clean/appliance |
| Img9 | B/A fridge drawer: gunk/mold → pristine | Deep cleaning *(strong; use tastefully)* |
| Vid1 | Commercial electrostatic disinfection, office (36s, branded outro) | Commercial / disinfection |
| Vid2 | "This is how we do it" residential montage (18s, CTA outro) | How-it-works / Residential / social |
| Vid3 | Detail + "Operating Principles" standards, blinds/windows (14s) | Why-us / About (standards) |
| **Vid4** | Commercial disinfection, conference room (16s, 60fps, clean, no outro) | **Hero portrait accent** + Commercial |
| Vid5 | "Moving in or moving out? Book…" montage (16s, CTA outro) | Move-in/out page |
| Vid6 | "Benefits of Electrostatic Disinfection" motion-graphic flyer (10s) | Commercial **explainer** (not hero/ambient) |
| **Vid7** | Team selfie + careful move-out clean (19s, mascot outro) | **About / Meet-the-team** (human moment) |

### B1 — Before/after gallery (the #1 "wow" slot)
- Replace placeholder SVGs with real pairs; implement a **draggable wipe slider** (handle drags to reveal before↔after).
- **The uploaded images are pre-composited side-by-side squares** (~512px per half). For a true wipe slider you need each pair as **two separate images**. Until Papo supplies higher-res originals, **split each composite down the middle programmatically** into `*-before` / `*-after`. Mark a TODO to swap in higher-res originals when available.
- Lead the gallery with the flagships (Img2, Img5, Img8); include Img1/3/4/6/9; route Img7 to painting/outdoor.
- Every image: bilingual `alt` + caption; `next/image` with explicit dimensions + blur placeholder (no CLS).
- Slider must be **keyboard-operable, touch-operable, and have a sensible static fallback** under `prefers-reduced-motion` / no-JS.

### B2 — Hero portrait video accent
- Use **Vid4** (smoothest, cleanest, no baked-in outro) as a **contained portrait accent** beside/with the mascot — it's an accent, not a replacement; the mascot stays the brand anchor.
- Muted, `autoPlay loop playsInline`, with a **poster image**; **do not autoplay under `prefers-reduced-motion`** (show poster). Lazy-load so it never blocks LCP.

### B3 — Service-page media
Residential → Vid2 + Img4. Commercial → Vid1, Vid4, Vid6 (explainer). Deep cleaning → Img2, Img8, Img9 + Vid3. Move-in/out → Vid5 + Img4, Img6, Img7. Interior painting → Img7 *(pending confirmation it's a coated floor)*.

### B4 — About / Meet-the-team
Replace "Founder video coming soon" with **Vid7** (the human selfie + team clip — cashes in the owner-forward positioning). Use **Vid3** to evidence standards/process.

### B5 — Optional social-proof strip
A portrait-video module or an Instagram (`@limpioscleaning`) embed using Vid2 / Vid5 / Vid7 — native vertical, ongoing social proof.

### B6 — Video handling rules (apply to all)
- **All clips are vertical 9:16** — present them in **portrait containers** (phone-frame mockup or portrait module). **Never force them into a 16:9 hero/crop.**
- **Stream video; do not serve raw MP4 from Vercel** (bandwidth cost + no adaptive streaming). Host on **Mux / Cloudflare Stream** (brandless player) or **YouTube-nocookie / Vimeo**; embed via a lightweight facade (load player on interaction) to protect performance.
- For clips with **baked-in outro/CTA cards** (Vid2, Vid5, Vid1, Vid7), prefer a lightly **trimmed on-site version** (the site already has CTAs/contact); keep originals for social. Vid6 stays whole (it *is* the explainer).
- **Captions/subtitles on any spoken clip, EN + ES.** Never autoplay with sound. Posters on everything.

### B7 — Asset pipeline / repo hygiene
- **Do not commit the bulk media into Git** (keeps the repo — your maintenance asset — lean and fast to clone).
- Photos through `next/image` (WebP/AVIF, responsive, blur); store the originals in **Vercel Blob or Cloudinary** (free tier) and reference them, rather than dumping everything in `/public`. Video lives on the streaming host, not the repo.

### B8 — Open items (proceed with what we have; mark TODOs)
1. Higher-res **separate** before/after originals from Papo (current halves are ~512px).
2. Confirm **Img7** is painted/coated floor (→ painting) vs. cleaning.
3. Confirm consent to publish **team members' faces** (Vid2/3/5/7).

---

## C. Analytics (validate the site with real data)
- Add **Microsoft Clarity** (free heatmaps + session recordings) alongside Vercel Analytics; env-gated IDs in `.env.example`.
- Emit **scroll-depth events** on the homepage sections (e.g. 25/50/75/100% and per-section in-view) so page length and drop-off can be judged empirically post-launch, not by guesswork.
- Track quote-CTA clicks and tap-to-call as conversion events.
- Note any cookie/consent obligation (Clarity records sessions) — at minimum reference it in a privacy note; add a lightweight consent gate if required for FL/US compliance.

---

## D. FINAL UX/UI AUDIT — the closing gate (do this LAST, after A–C)

After everything above is built, run a full audit to verify the site still makes sense end-to-end. This is both the existing automated harness **and** a holistic coherence review. Produce an updated report in `docs/UX_UI_AUDIT_R21.md` (same rigor as the Round-1 reports) listing what was checked, anything found, and the fix.

**Re-run the baseline (must stay green):**
- axe-core WCAG 2.0/2.1 A/AA across all EN + ES routes → 0 violations.
- One `<h1>`/page, no heading-order skips, all images have `alt`.
- 0 console errors/warnings; 0 mobile horizontal overflow (390px); CLS ≈ 0.
- All form flows (quote modal validation + happy path, `?service=` prefill, contact, honeypot) pass.
- EN/ES key + ICU parity test passes; zod + Playwright smoke (incl. no-JS + reduced-motion) pass.

**New checks specific to this round (the real risks introduced):**
- **Real media renders correctly:** no broken images/videos, correct aspect ratios, posters present, **no CLS** from images/video, and **LCP not regressed** by the hero video (it must be lazy/posters, not blocking). Re-run **Lighthouse on the Vercel preview** and confirm Perf/SEO/BP/A11y ≥ 95 (or document any real residual).
- **Before/after slider:** works via mouse, touch, AND keyboard; sensible static fallback under reduced-motion/no-JS; before/after images correctly paired (no mismatched halves).
- **Portrait video on desktop:** contained cleanly (no ugly letterbox/crop), behaves on mobile, respects reduced-motion (poster, no autoplay), captions present.
- **Structural refinements landed:** the trust-signal duplication is gone (no leftover repeated band), "Why Limpios" no longer triple-states veteran/eco, padding changes didn't break section rhythm or introduce overflow.
- **No placeholder/TODO leakage:** grep the catalogs and rendered output for `TODO`, `placeholder`, `(TODO confirm`, `LIC# 000000000`, "coming soon", "sample" — and confirm each is either resolved or *intentionally* still flagged (and listed in the report as a known pre-launch item). The reviews honesty disclaimer and the placeholder license # are expected to remain until real data arrives — confirm the **AggregateRating honesty gate is still suppressed**.
- **Conversion path intact:** quote reachable in 0–1 clicks from every page; tap-to-call works; CTAs prefill correctly.
- **"Does it make sense" pass:** every section earns its place, copy reads human (em-dash discipline held, EN/ES parallel), nothing visually broken at 320/390/desktop and 200% zoom.
- **Re-capture corrected screenshots** (reveals neutralized) into `docs/screenshots/` as the visual sign-off artifacts.

**Output:** the updated audit report + a short prioritized punch-list (P0 launch-blockers vs. P1/P2 polish). If the audit surfaces real defects, fix them and re-verify before declaring done.

---

## E. Guardrails — do NOT break
- Hybrid content model + i18n key parity intact; new copy/media go through the content layer, not hardcoded.
- **Honesty gate stays:** reviews remain placeholder with disclaimer; `AggregateRating` suppressed until real reviews exist. No fake data.
- **Performance must not regress** from media: posters, lazy-load, optimized images, streamed video — protect LCP/CLS.
- WCAG AA preserved (media alt text, video captions, slider + video a11y, reduced-motion, focus states).
- SSG-first; no booking provider integrated; click-to-call only (Google Voice, no SMS automation); no DNS/sending-domain changes.
- Keep the repo lean (no bulk media in Git). Keep `typecheck · lint · test · build` green.

---

## F. Sequence
1. **A** structural refinements (smallest, touches layout the new media will sit in).
2. **B** media integration (gallery/slider → hero accent → service pages → about → pipeline).
3. **C** analytics.
4. **D** final UX/UI audit + Lighthouse + screenshots — **last**, so it reflects the finished state.

## G. Definition of done
A–C implemented; all Guardrails held; the **final UX/UI audit (§D) run and its report committed to `docs/`**, with the baseline green, the new media/slider/portrait-video/structural checks passing, no unintended placeholder leakage, Lighthouse ≥ 95 on preview, corrected screenshots captured, and a prioritized punch-list of any remaining pre-launch items. Committed and pushed.

---

*The media is the moment this becomes Papo's site instead of a template. Integrate it so it performs (fast, no layout shift, accessible) and looks effortless — then let the audit prove the whole thing still hangs together.*
