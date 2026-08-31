# Limpios Cleaning Management — Business Profile (source of truth)

> Purpose: the **single place** where confirmed business facts live, so nobody (human or agent) re-asks Papo for what he's already given. Read this first. Update it whenever Papo confirms something.
>
> **Status legend:** ✅ confirmed by Papo directly · 🔎 confirmed via his own public sources (FB / his site / chamber) · ⚠️ needs confirmation or has a conflict · ❌ still missing

## Change log
Decisions recorded here so the site and this doc cannot drift apart again. Each line
says what changed, when, and why — a later agent that only reads the site would
otherwise "helpfully" restore things Papo asked us to remove.

- **2026-07-14 — Residential cleaning REMOVED as a service.** Papo: *"We clean empty
  homes preparing for new tenants."* Recurring / occupied-home cleaning is **OUT**.
  The `/services/residential` page sold the opposite and contradicted the site's own
  FAQ. Folded into **move-in / move-out**, which already described exactly the work he
  does; the old route now 308s there.
- **2026-07-14 — "After-hours" REPLACED with "evenings and weekends."** Papo: *"most of
  our cleaning is done on weekends"*, and his cleaners *"work for county schools full
  time"*, so they clean off-hours. "After-hours" was vague and unverified; the new
  wording is his actual schedule model.
- **2026-07-14 — "Low-odor" REMOVED from all copy.** Neither Papo nor any of his own
  materials ever claimed it; it was a copy embellishment. **Eco-friendly stays** (it is
  on his own site).
- **2026-08-31 — SBA credential RESOLVED to "Veteran Owned Small Business."** Hube
  confirmed the exact SBA term: he is a **Veteran Owned Small Business**. That phrase
  now renders on the hero proof line, trust bar and Trusted By stack, paired with the
  "Veteran Owned Business" brand slogan. The old `sbaCertifiedConfirmed` gate is
  removed. We still never render **"SBA-certified"** as a phrase: that names the SBA
  VetCert *registration* specifically, a stronger and separately-verifiable claim the
  owner has not made. "Veteran Owned Small Business" (the self-certifiable status) is
  not a synonym for "SBA-certified".
- **2026-08-31 — Crew consistency claim CORRECTED (was false).** Hube: *"The crew
  rotates depending on locations."* The site had claimed the opposite ("the same
  vetted team… not a rotating cast… the same cleaners who learn your space"). All such
  "same faces / same team / same crew" copy is gone. The consistency story is now
  true: **vetted, background-checked cleaners + a written checklist every visit**, so
  the standard holds regardless of which crew is on site.
- **2026-08-31 — Carpet-cleaning photos added (residential jobs).** img30–img38
  delivered; **6 shipped** (img36, img30, img31, img32, img38, img37) to the Carpet
  Cleaning service page as its proof strip, **3 dropped** (img33 byte-identical to
  img32; img34 dim/tight closet; img35 busy background — both redundant with the
  stronger img30). Captioned honestly as carpet cleaning with **no commercial
  implication** (owner: **no commercial carpet work yet — residential only**). The
  batch contained **no "other-company logos" screenshot**, so there was nothing to
  exclude on that count. Not added to the homepage before/after gallery: those are
  genuine before/after pairs and these are single shots — forcing a fake pair would be
  dishonest.
- **2026-07-14 — "SBA-certified" was GATED OFF, pending Papo.** Superseded 2026-08-31
  (resolved to "Veteran Owned Small Business", above).
- **2026-07 — Street address REMOVED from the site, deliberately.** See Contact below.
- **2026-07 — Placeholder reviews DELETED** (not flagged off). There is no
  `reviewsArePlaceholder` flag any more and no `AggregateRating` is ever emitted. The
  `/reviews` page became **`/trusted-by`**: anonymized client categories live, named
  clients gated behind `clientsServedEnabled`, and **no client logos, ever**.

## Identity
- **Business name:** Limpios Cleaning Management ✅
- **Owner:** Papo Noboa 🔎
- **Legal entity:** Judean Services LLC (filed 2023, per state registry) 🔎 — DBA "Limpios Cleaning Management"; do **not** surface the LLC name on the site
- **Tagline:** "Sit back, relax, and we will do the cleaning." ✅🔎
- **Signature slogan:** **"Veteran Owned Business"** ✅ — treated as a fixed brand hook (the "Just do it" slot). Spelled exactly, no hyphen.

## Contact & location
- **Address: NONE PUBLISHED — deliberate (2026-07).** The old "1683 N Hancock Rd, Suite
  103-272, Minneola, FL 34715" was a **UPS Store mailbox**, not a place of business.
  Papo asked for it to come off. Limpios is modelled as a **service-area business**: the
  site publishes `areaServed` + phone + email, and there is **no `PostalAddress` in the
  JSON-LD** and no address in the footer or contact page. **Do not re-add it.**
- **Phone:** (407) 680-2945 (Google Voice; click-to-call only) ✅
- **Email:** info@limpioscleaning.com ✅
- **Based in:** Lake County, FL 🔎 · **Serves:** all of Central Florida (kept broad, no ZIP enumeration) ✅
- **Hours:** Mon–Fri 8 AM–6 PM, Sat 9 AM–3 PM, Sun closed ✅ (confirmed by Papo)
- **When the cleaning actually happens:** **evenings and weekends** ✅ — most work is done
  on weekends; his cleaners work full-time for the county schools during the day.

## Credentials & trust
- **Veteran Owned** ✅ — **28 years of military experience** ✅
- **Veteran Owned Small Business** ✅ **(confirmed by owner 2026-08-31).** This is the
  SBA term Hube confirmed, and it is what renders on the hero proof line, trust bar and
  Trusted By stack: *"A Veteran Owned Small Business with 28 years of military
  experience."* The "Veteran Owned Business" brand slogan stays as the hook above it.
- **"SBA-certified": do NOT render.** It is a stronger, distinct claim — it points at
  the SBA VetCert *registration* specifically, which the owner has not asserted. There
  is no gate any more; the confirmed "Veteran Owned Small Business" wording simply
  renders. Do not reintroduce "SBA-certified" without the VetCert in hand.
- **Licensed** ✅ — **License #L2600319** (city business license). Cleaning services don't
  require a trade licence in FL, so phrase carefully and never imply a specialised one.
- **Insured** ✅ — **General Liability**, and a **certificate of insurance (COI) is
  available on request** ✅ (every B2B buyer asks).
- **Workers' compensation: DO NOT MENTION, ANYWHERE.** ✅ Papo's cleaners are **1099**
  and he is **workers'-comp exempt**. This also means **no copy may describe the
  *people* as insured** — the *company* carries the coverage, the individuals do not.
  Describe the crew as **vetted and background-checked**, which is confirmed.
- **Background-checked crew** ✅
- **Bilingual English / Español** ✅
- **48-hour re-clean guarantee** ✅ (it is 48 hours, not 24)
- **Member, South Lake Chamber of Commerce** ✅🔎 (verified in chamber directory)
- **Eco-friendly products & methods** 🔎 (stated on his own site). **"Low-odor" is NOT a
  claim we make** — he never said it.

## Services (canonical set Papo sent)
1. Commercial cleaning ✅
2. Post-construction cleaning ✅
3. Move-in / move-out cleaning ✅ — **this is also the vacant-unit / tenant-turnover
   service.** Empty homes and units prepared for new tenants, to pass a property
   manager's or realtor's inspection.
4. Window cleaning ✅
5. Carpet cleaning ✅
- **Residential / occupied-home cleaning:** ❌ **NOT OFFERED.** Removed 2026-07-14 (see
  Change log). He cleans **empty** homes at turnover, which is #3. Nothing on the site
  may imply routine cleaning of lived-in homes.
- **Deep cleaning** — kept as a demoted, reachable service (a top-to-bottom reset for
  offices, facilities and vacant units). Not one of the canonical five.
- **Interior painting** ⚠️ — his own site advertises it (4 yrs' experience) 🔎, but his new
  list to us **dropped it**. **CONFIRM: still offered, or fully out?** (Currently demoted,
  and reframed toward turnover work rather than homeowners.)
- **What's-included scope for Window & Carpet** ⚠️ — copy drafted conservatively; Papo to confirm what each actually covers.

## Who he works with (audience)
Commercial businesses · Property managers · Homeowners associations (HOAs) · Construction companies ✅

## Pricing model
- **No published prices.** Every job priced from a **free walkthrough → written estimate** ✅
- Depends on: square footage, scope of work, manpower, structure/space, and conditions ✅
- (His FB lists price range "$$" 🔎 — directional only; the site correctly shows no rate card.)

## Team
- **The crew ROTATES depending on location** ✅ (confirmed by Hube 2026-08-31). The
  cleaners are 1099 and work day jobs at the county schools, so who is on a given job
  varies. Background checks are confirmed. **Do NOT claim "same faces / same team /
  same crew every visit"** — that was on the site and is false. Consistency is framed
  as vetted, background-checked people + a written checklist every visit.

## Claims the site currently ASSERTS — status
- 48-hour free re-clean guarantee ✅ confirmed
- Background-checked / vetted crew ✅ confirmed
- Evenings & weekends availability ✅ confirmed (replaced the vague "after-hours")
- Eco-friendly products ✅🔎 (low-odor removed — never claimed by Papo)
- Bilingual English/Español ✅ confirmed
- Consistency via checklist, **not** "same faces" ✅ (crew rotates — corrected 2026-08-31)
- Veteran Owned Small Business ✅ confirmed (replaced the gated SBA claim)
- Any equipment specifics (e.g., HEPA) — none remain in the copy ✅

## Online presence
- **Website (old, still indexed):** limpioscleaning.com (GoDaddy; has real owner-written copy) 🔎 — being replaced by the new build
- **Instagram:** @limpioscleaning ✅🔎
- **Facebook:** facebook.com/LimpiosCleaningManagement ✅🔎 — **0 reviews**
- **Google Business Profile:** exists (per Papo) ⚠️ — but **~0 visible reviews**. Get the **real GBP URL + "leave a review" link**. Collecting reviews there is the **#1 growth lever**, and the site currently links to no GBP at all.

## Brand & media
- **Logo:** new "L" mark shipped (favicon + app icons done) ✅
- **Mascot:** cartoon caricature of the owner (currently a **JPEG with black background**) — ❌ need a **transparent PNG**
- **Photos/videos provided:** Img1–29, Vid1–9 (placed) ✅
- **Proof-imagery gaps** ❌: real **commercial/office**, **carpet**, and **construction-cleanup** before/afters (the gallery still reads residential-toned under a commercial hero — now a sharper mismatch, since residential is no longer offered)
- **vid8** ❌: needs clean re-upload (muted, no Instagram overlay/music) → unlisted YouTube ID
- **Consent** ⚠️: confirm OK to publish team faces (img16, Vid2/3/5/7)
- **Founder on About** ⚠️: does Papo want his photo / a founder video? (mascot stands in now; the copy already says "Hi, I'm Papo")

---

## STILL NEEDED FROM PAPO (the minimized ask)
**Launch-critical:**
1. **SBA VetCert** — only if we ever want to state "SBA-certified" specifically. The
   confirmed "Veteran Owned Small Business" wording is already live and does not need it.
2. **Real Google reviews** — the GBP review link, and start collecting.
3. **Interior painting: in or out?**
4. **Proof photos** — commercial/office and construction-cleanup jobs. (Carpet is now
   covered by the img30–img38 residential batch; still no *commercial* carpet work.)
5. **Transparent mascot PNG.**

**Nice-to-have / pre-launch:**
7. Confirm the **founding year** (registry says the LLC filed 2023-09-18; nothing on the site claims a founding year today, and none should be added until he confirms).
8. **Window & carpet** what's-included confirmation.
9. **vid8** clean re-upload → YouTube ID.
10. Consent to publish team faces; founder photo/video preference for About.
11. Higher-res separate before/after originals.

## Recommended site changes off this profile (not asks — improvements)
- **Add a Google Business Profile link + a "leave a review" CTA** once the GBP URL lands. This is the single highest-leverage addition available, and it is what eventually unlocks real reviews (and only then, `AggregateRating`).
- **Put "COI on request" on the Commercial and Post-construction service pages**, not just the FAQ — that is where a facilities manager actually decides.
- **Surface the lockbox / key-control protocol** on property-manager-facing pages, not only in the FAQ.
- **Use his own tagline as a headline.** "Sit back, relax, and we will do the cleaning" is owner-written and verified, and currently appears once, paraphrased, at the bottom of the footer.
