# Role-flow audit: HOA board treasurer

**Persona:** Treasurer on the board of a 350-home community near Horizon West, FL. Amenities: clubhouse, fitness room, two pool restrooms. The board votes on vendors. I need: proof of insurance for the association's files, a written scope the board can approve, predictable monthly cost, and a vendor who won't ghost. I'm comparison-shopping three vendors for next month's meeting.

**Method:** Server-rendered HTML fetched from `http://localhost:3000/en/*` (curl, no JS). Quote-form steps 2–4 verified against `src/components/quote/quote-form.tsx` and `messages/en.json` since only step 1 renders server-side. No source files modified.

---

## First-person walkthrough

### 1. Landing — `/en`

The hero says "Commercial cleaning your business can count on … cleaned to a written scope by a licensed, insured, veteran-owned crew." Not aimed at me specifically, but "written scope" and "licensed, insured" are the first two words a board treasurer scans for, so I keep reading.

Then the "Who we work with" section names me outright:

> "Homeowners associations — Clubhouses, amenity centers and common areas kept resident-ready on a schedule your board approves." (`/en`, audience card)

"A schedule your board approves" is the single best line on the site for me. Whoever wrote it knows that HOA vendors don't get hired by one person — they get voted on. That's not superficial; that's the correct mental model. The footer blurb repeats it ("…for businesses, property managers, HOAs and builders…"), so HOAs aren't a one-off mention.

**But** — the repositioning is a promise the rest of the site only partially keeps (see below). Also on this page:

- The trust strip: "Veteran-owned since 2023 · South Lake Chamber member · English & Español." Chamber membership is quotable in a board packet. "Since 2023" is honest but young — three years old, so references matter even more.
- The footer shows **"License: LIC# 000000000."** As a treasurer, a string of zeros where a license number should be is *worse* than no license line at all — it reads like a template nobody finished. I would screenshot this for the board as a caution flag. (It's a known `TODO` in `src/content/site.ts:73`, but the persona doesn't know that.)
- The reviews carousel is candidly labeled: "the reviews shown are sample placeholders… not real customer reviews." I respect the honesty — many vendors would fake it — but it means the social-proof column of my comparison sheet is empty for this vendor.
- The property-manager card promises "photos and clear communication on every unit." I notice HOAs get no equivalent reporting promise. Boards live on reports.

The HOA card's "See how we help" links to `/en/services/commercial`. I click.

### 2. Service fit — `/en/services/commercial`

This is the right page for my scope, and it says so:

> "Who it's for … HOAs with clubhouses and amenity centers" (`/en/services/commercial`)

The "What's included" list maps to a clubhouse well: *reception/common areas, restrooms sanitized and restocked, break rooms/kitchenettes, floors, trash + touchpoints disinfected*. "Restrooms sanitized **and restocked**" is exactly the pool-restroom problem. "What shapes the estimate" (square footage, **number of restrooms**, frequency, specialty needs, daytime vs. after-hours) reads like someone who has actually priced a facility — asking about restroom count is a good sign.

The electrostatic-disinfection videos ("Electrostatic disinfection of a commercial office," "Disinfecting a conference room") are a genuine differentiator for a **fitness room** — I'd mention that in my packet. What's missing is any amenity-specific language: nothing about fitness equipment wipe-downs, locker/pool restrooms, furniture in a rentable clubhouse hall, or seasonal frequency (our pool restrooms need daily service June–August, monthly won't cut it). The one before/after on this page is "Toilet base and floor, hand-detailed for turnover" — a residential-looking bathroom. On the *commercial* page, a single house-bathroom photo undercuts the commercial claim.

`/en/services/carpet-cleaning` also names me — "Who it's for … HOA clubhouses and community common areas" — and the bundling line on `/en/pricing` ("Bundle with any service") tells me clubhouse carpet can ride on the same contract. Good.

So the HOA repositioning verdict: **real, not decorative** — HOAs appear in the audience section, two service pages' "who it's for" lists, the quote form, and the footer/meta. But it's *naming*, not yet *serving*: there is no HOA-specific scope language, no board-facing document, and the HOA card dumps me on a generic commercial page where I have to self-assemble the clubhouse story from office-cleaning bullets.

### 3. Board-packet readiness — `/en/about`, `/en/reviews`, FAQ

What I can actually put in the packet from this site:

| Packet item | Available? | Source |
| --- | --- | --- |
| Written scope commitment | Yes — "written scope," "written checklist," estimate "with the scope spelled out line by line" | `/en`, `/en/pricing` |
| Insurance claim | Claim only — "carries insurance," "vetted, trained and insured" | FAQ, `/en/about` |
| **Certificate of insurance / COI** | **No** — never mentioned anywhere on the site | — |
| License number | Placeholder zeros | footer, all pages |
| Guarantee | Yes — concrete: "call us within 24 hours and we'll come back and re-clean it, free" | FAQ |
| Chamber membership | Yes — "Member, South Lake Chamber of Commerce" | `/en/about`, footer |
| Veteran-owned | Yes, with a credible personal story (Papo) | `/en/about` |
| References / real reviews | No — placeholders, honestly labeled | `/en/reviews` |
| Background checks | Yes — "background-checked before they ever set foot on your site" | FAQ |
| NAP / hours | Yes, consistent on every page | footer, `/en/contact` |

The insurance FAQ deserves quoting because it's the most treasurer-respecting copy on the site:

> "Yes. Limpios holds a business license and carries insurance… (Florida doesn't require a specialty trade license for cleaning services — our license is the standard business license to operate.)" (FAQ, all service pages)

Preempting the "where's your trade license?" question honestly is exactly right — I *would* have checked Sunbiz. But the answer stops one sentence short of what an association needs: **can I get a COI, and will your carrier name the association as additional insured?** That's not a nice-to-have; our management company won't onboard a vendor without it. The site is silent, so this vendor goes in my packet with a hole where the other two vendors (if competent) will have "COI on request" printed.

The About page is warm and specific ("the crews they'd used before would cut corners, show up late, or just stop answering the phone") — it speaks directly to my "won't ghost" requirement, and "a phone that gets answered" is the promise I'd read aloud at the meeting. But it's all self-attestation; nothing verifiable beyond the Chamber.

### 4. Pricing predictability — `/en/pricing`

No published prices — every package says "Custom proposal." How do I feel about that? Honestly: **fine, because this is normal for commercial cleaning**, and the page works hard to make the walkthrough model feel rigorous rather than evasive:

> "Square footage, scope, condition and crew are different on every job — so we look before we quote. The walkthrough and the written estimate are always free." (`/en/pricing`)

> "You'll get a clear written estimate — usually within a day — with the scope spelled out line by line." (`/en/pricing`)

"Line by line" is board language. "No surprises on invoice day" speaks to a treasurer's actual fear. And "Recurring contracts (nightly, weekly, monthly) price lower per visit than one-time projects" tells me the model rewards exactly what I'm buying. The word **"proposal"** (not just "estimate") on the commercial package is the right instinct — a proposal is what I attach to meeting minutes.

What's missing for predictability: any signal that the monthly number is *fixed* once quoted (annual contract? month-to-month? escalation?), and any sample of what the written proposal looks like. I can't cite a dollar range in my packet, but with a free walkthrough and a same-week written number, I can realistically have a real quote before next month's meeting — the timeline works. What loses me is not the absence of prices; it's that both of my other candidate vendors will also do a free walkthrough, so the tie-breaker becomes documents (COI, references) — where this site is weakest.

One inconsistency I noticed as a detail person: the pricing page sells "nightly, weekly or custom," but the quote form only offers One-time / Weekly / Every 2 weeks / Monthly (see next section). Our pool restrooms need more-than-weekly service in summer; the form can't say that.

### 5. Local proof — `/en/service-areas/horizon-west`

"Orange County Cleaning Services in Horizon West, FL … Horizon West is home turf." Coverage confirmed, correct county, and the page repeats licensed/insured/bilingual. But Horizon West is essentially *made of* master-planned HOA communities — Hamlin, Independence, Summerlake — and this page never says the word HOA, clubhouse, or community. The audience repositioning didn't reach the city pages. Missed layup.

### 6. Estimate path — `/en/quote` (fields inspected in source; not submitted)

Four steps, honest "about two minutes" claim, progress bar. Step by step as the treasurer:

1. **Service** — "Commercial cleaning" is first. Fine.
2. **Your space** — property type options: Office/commercial, Construction site, **"HOA / community facility"**, House, Apartment/condo, Other (`messages/en.json` → `Quote.fields.propertyType.options.community`). Finding my exact situation as a radio option is the strongest single signal on the whole site that they actually want this work — most competitors' forms force "Other." Then it asks **Bedrooms** ("e.g. 3") — for a clubhouse? The field is optional and "Bathrooms / restrooms" is worded to cover me, but "Bedrooms" appearing after I chose "HOA / community facility" is the one moment the form stops feeling commercial-grade. Sqft field with "helpful for offices and larger spaces" — good.
3. **Frequency** — One-time / Weekly / Every 2 weeks / Monthly. No daily/nightly, no "multiple times per week," no "custom" — despite `/en/pricing` advertising "nightly, weekly or custom." I'd pick Weekly and explain the pool restrooms in the message box.
4. **Contact** — name/email/phone required, address and message optional, consent checkbox. Message placeholder "Scope notes, access, preferred walkthrough times…" is well-aimed. No role/organization field, so "I'm the treasurer, decision is by board vote in July" also goes in the message box.

Total friction: **low**. Nothing here would stop me from submitting. The contact page's "Online booking — coming soon" is honestly framed and doesn't block anything.

### Verdict

Would I put Limpios in front of the board? **Yes, as the walkthrough-pending candidate** — the written-scope/checklist language, the 24-hour re-clean guarantee, the background-check claim, the "schedule your board approves" copy, and an HOA option in the quote form all clear the first bar, and the bilingual + veteran story differentiates. But in a three-vendor comparison table, today this site leaves me with empty cells for **insurance documentation, license number, and references** — the three columns a board actually votes on. A competitor with worse cleaning and better paperwork beats them at the meeting.

---

## Findings table

| # | Sev | Description | Evidence | Suggested fix | Owner decision? |
| --- | --- | --- | --- | --- | --- |
| 1 | P1 | No path to proof of insurance anywhere: no "COI on request," no mention of naming the association/client as additional insured, no coverage type or carrier. This is the #1 gating document for an HOA (and most PM/commercial) buyer. | FAQ "Are you licensed and insured?" on `/en`, `/en/services/commercial`, etc.; site-wide grep of `messages/en.json` — zero hits for COI/certificate/additional insured | Add one sentence to the insured FAQ and to `/en/services/commercial`: "Need a certificate of insurance for your files? We'll send one — and can name your association or company as additional insured." Only publish what's true. | **Yes** — Papo must confirm coverage, carrier, and that additional-insured endorsements are available before this is written. |
| 2 | P1 | Footer license reads "License: LIC# 000000000" on every page. A visible placeholder actively damages credibility with exactly the diligence-minded buyers (boards, PMs) the site targets. | Footer, all `/en/*` pages; `src/content/site.ts:73` (`TODO`) | Replace with the real FL business registration number before launch; until then, hide the license line rather than render zeros. | **Yes** — real number from Papo. (Hiding-until-real is a site decision that needs no facts.) |
| 3 | P2 | HOA positioning is named but not served: the HOA audience card links to the generic commercial page; no amenity-specific scope (fitness-equipment wipe-down, pool/locker restrooms, clubhouse event turnover, seasonal frequency) anywhere. | `/en` audience card → `href="/en/services/commercial"`; `/en/services/commercial` "What's included" is office-generic | Add an HOA/amenity block to `/en/services/commercial` (or a dedicated audience section): clubhouse, fitness room, pool restrooms, and a line about board-approval timelines. Reuse existing electrostatic-disinfection media — it's ideal for gyms. | Partly — copy structure is a site fix; whether pool areas/fitness rooms are actually serviced needs Papo's confirmation. |
| 4 | P2 | Quote-form frequency options (One-time / Weekly / Every 2 weeks / Monthly) contradict the pricing page's "nightly, weekly or custom" and can't express amenity scopes needing daily or mixed-frequency service. | `src/components/quote/quote-form.tsx:21` (`FREQUENCIES`); `/en/pricing` "nightly, weekly or custom" | Add "Several times a week / daily" and/or "Custom — describe below" options (update `Quote.fields.frequency.options` in both locales + keep lead-schema compatible). | No — pure site fix. |
| 5 | P2 | Zero usable social proof for a board packet: reviews are (honestly labeled) placeholders, none reference an HOA/community, and there is no "references available on request" line. | `/en/reviews` placeholder note; `/en` reviews section; `Reviews.items.*` in `messages/en.json` | Short-term: add "References from commercial and community clients available on request" to `/en/about` or FAQ — if true. Long-term: replace placeholders with real Google reviews (already planned; `reviewsArePlaceholder` gate). | **Yes** — references and real reviews only exist if Papo has them. |
| 6 | P3 | "Bedrooms" field renders in quote step 2 even when "HOA / community facility" (or Office/Construction) is selected — the one residential seam in an otherwise B2B-first form. | `src/components/quote/quote-form.tsx:268-285` (unconditional render); label `Quote.fields.bedrooms` | Show bedrooms only for house/apartment property types (bathrooms/restrooms + sqft stay for all). | No — pure site fix. |
| 7 | P3 | Horizon West city page never mentions HOAs, clubhouses, or communities, despite the area being almost entirely master-planned HOA communities. Same likely true of other city pages. | `/en/service-areas/horizon-west`; `ServiceAreas.cityPage.*` in `messages/en.json` | Add a community/amenity sentence to the city-page template or a Horizon-West-specific intro (the per-city `intro` mechanism already exists, cf. Minneola). | No — copy fix; avoid naming specific communities as clients unless real. |
| 8 | P3 | The only before/after on the commercial service page is a residential-style bathroom ("Toilet base and floor, hand-detailed for turnover"), weakening the commercial/HOA claim at the exact moment of evaluation. | `/en/services/commercial` before/after section | Swap in commercial-space imagery (office, restroom block, lobby) when available; until then the electrostatic videos carry more proof — consider ordering them above the before/after. | **Yes** — requires real commercial job photos from Papo. |
| 9 | P3 | Property managers are promised reporting ("photos and clear communication on every unit") but HOAs get no reporting/communication commitment — boards need something to file (photo log, visit checklist copy). | `/en` audience cards: PM card vs. HOA card | If offered, extend the promise to the HOA card/commercial page: e.g. "checklist signed off every visit, photos on request." | **Yes** — only if Papo actually provides per-visit documentation. |

### What already works for this persona (keep)

- "…on a schedule your board approves" (`/en` HOA card) — best line on the site for this buyer.
- "HOA / community facility" property type in the quote form (`Quote.fields.propertyType.options.community`) — rare, high-signal.
- The honest Florida-license explanation in the insured FAQ — preempts a diligence check.
- Pricing-page framing: "scope spelled out line by line," "Custom proposal," "no surprises on invoice day" — as board-friendly as a no-price page gets.
- Concrete 24-hour re-clean guarantee; background-check claim; consistent NAP; candid placeholder-review labeling.
