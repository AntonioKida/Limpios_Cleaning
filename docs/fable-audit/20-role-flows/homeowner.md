# Role flow: Homeowner (Minneola, FL)

**Persona:** Dual-income family in Minneola, two kids, a dog. Wants recurring biweekly house
cleaning, probably a one-time deep clean first. Heard about Limpios from a neighbor — arrives
typing the name in, or via a "cleaning services minneola" search.
**Context:** The site was just repositioned B2B-first. Residential is deliberately demoted.
This audit judges whether the demoted path is *coherent* — not whether it should be re-promoted.
**Date:** 2026-07-06 · Audited against `http://localhost:3000` (dev), EN locale.

---

## First-person walkthrough

### 1. Homepage (`/en`) — "Do they even clean houses anymore?"

The `<title>` says **"Commercial Cleaning in Central Florida"** and the hero says
*"Commercial cleaning your business can count on."* I don't have a business. I keep reading
because my neighbor swore by them.

I scan for anything that says "home": the five-card service grid (commercial, post-construction,
move-in/out, windows, carpets) — nothing. "Who we work with" — commercial businesses, property
managers, **Homeowners associations** (I half-see "Homeowners…" and my eye lights up, then I read
the rest — that's HOA clubhouses, not me), construction companies. The FAQ — nine questions,
every answer says "space," "site," "facility." The footer — five commercial services, no homes.

**Verified: the visible homepage contains zero residential mention.** The words
"residential"/"house cleaning" appear only in the Next.js flight payload, never in rendered text
(grep of `/en` HTML). The old "from $120" pricing answer is gone too — clean removal, no residue.

Two things keep me from bouncing:

- The **before/after gallery** is almost entirely *my* world: a rust-stained tub, a moldy fridge,
  a filthy toilet, a grimy kitchen, patio concrete, grout (`src/content/gallery.ts` — flagship
  items are all `deep-cleaning`/`residential`/`move-in-out` rooms). So the *photos* whisper
  "we clean homes" while the *copy* says "we clean businesses." Reassuring for me — but it's an
  inconsistency that cuts against the B2B repositioning too (a facilities manager sees bathtubs).
- The FAQ asks *"Are your products safe for offices, **kids and pets**?"* — kids and pets is
  household language. Another residual homeowner wink.

Net: nothing tells me they still clean homes. My only move is the **Services** nav item, on a
hunch. A less persistent visitor calls the number or leaves. Time-to-residential from landing:
2 clicks + a below-the-fold scroll — *if* I guess right.

### 2. Services hub (`/en/services`) — found it, with a raised eyebrow

Five commercial cards, then below them an **"Also available"** strip:

> "We also take on home cleaning and interior painting **for select clients — ask during your
> walkthrough**."

Relief — home cleaning exists. But read it as an outsider: *which* walkthrough? I haven't booked
anything. And "for select clients" — am I select? It reads like home cleaning is a favor extended
to existing commercial accounts, and the instruction ("ask during your walkthrough") is circular
for someone whose entire reason for being here is a house. The three quiet links underneath
(**Residential cleaning**, **Deep cleaning**, Interior painting) rescue it — I click Residential.

### 3. Residential page (`/en/services/residential`) — the copy respects me

Honestly, this page is good. *"The same standards, at home."* — that framing sells the demotion
as a strength rather than an apology. It has everything I need:

- **What's included:** kitchens, bathrooms, dusting, floors, "beds made on request" — house language.
- **Who it's for:** "Homeowners who want a consistent, trusted team / Busy families and
  professionals" — that's literally me.
- **What shapes the estimate:** "Home size (bedrooms, bathrooms, square footage)… How often you
  book (**recurring saves you more**)" — answers my biweekly question before I asked.
- Before/afters (kitchen, patio), a video titled *"How we clean a Central Florida home,"* and
  related links to **Deep cleaning** — whose page then says it's *"the right call before recurring
  service starts"* and is for *"offices and homes."* My exact plan (deep clean → biweekly) is
  described in their own words. No dead ends; both CTAs carry `?service=residential` /
  `?service=deep-cleaning` prefills.

One sour note: the shared FAQ block at the bottom is introduced with *"The things **facility and
property folks** usually ask before the first walkthrough"* (`messages/en.json:259`). On the
residential page, I am neither. It's the one place the page stops talking to me.

Also noted: once I leave this page, there's no footer link back — the only recurring path is
Services → scroll → "Also available." Bookmarkable, in the sitemap, indexable (checked: present
in `/sitemap.xml`, no robots noindex) — but inside the site it hangs off a single thread.

### 4. Pricing (`/en/pricing`) — a page where I don't exist

Nav says "Pricing," so I click it hoping for a number. Four cards: Commercial & recurring,
Post-construction, Turnovers & move-outs, Windows & carpets — all "Custom proposal."
**No residential card, and no line acknowledging homes at all.**

The "What shapes your estimate" section is actually persuasive (sqft, scope, condition, crew,
frequency) — but "Frequency" reads *"Recurring contracts (**nightly, weekly, monthly**)"*
(`messages/en.json:567`). Nightly is office cadence; **biweekly — the default house cadence — is
never mentioned on this page**, even though the quote form offers "Every 2 weeks." As a homeowner
I leave pricing with: (a) no number, (b) no evidence they price houses, (c) a frequency list that
doesn't include the one I want.

On the walkthrough model itself: for a 3-bed house, an in-person walkthrough before *any* number
is heavier than the market norm (national franchises quote by beds/baths over the phone in five
minutes). The FAQ softens it well — 15–30 minutes, free, written estimate usually same-day — and
"no flat rates, we look before we quote" is a defensible brand stance. It's proportionate *enough*
if scheduling is easy; it becomes friction if the walkthrough is the only door and my job is worth
~$150–250/visit. A middle path exists (phone/photo estimates for typical homes) but that's a
business-model call, not a copy bug.

### 5. Quote form (`/en/quote`) — the form still fits a house perfectly

This is the strongest part of the demoted path (`src/components/quote/quote-form.tsx`):

- **Step 1 — Service:** all eight services listed, including Residential cleaning and Deep
  cleaning. Arriving via the residential page's CTA, `?service=residential` is validated
  (`isServiceSlug`) and preselected.
- **Step 2 — "Your space":** property types include **House** and **Apartment / condo**
  (B2B-first order, fine); **Bedrooms** and **Bathrooms / restrooms** fields with house-scale
  placeholders ("e.g. 3", "e.g. 2"); sqft optional, hint even says it's mainly "for offices and
  larger spaces" — so I can skip it.
- **Step 3 — Frequency:** One-time / Weekly / **Every 2 weeks** / Monthly. My biweekly option
  exists — the form is the only place on the site that says so.
- **Step 4 — Contact:** normal fields, consent, honeypot hidden properly (the stray "Company"
  I saw in the HTML is the `aria-hidden` honeypot label — invisible in a real browser).

Success copy says *"we'll get back to you shortly to schedule your free walkthrough"* — consistent
with the model. End to end, a homeowner can complete this in the promised two minutes with zero
mismatched fields. No dead end anywhere in the funnel.

### 6. Side doors: Minneola page & reviews

Because I'm local, my likeliest *search* landing is `/en/service-areas/minneola` — and this is the
journey's weakest page for me:

- The title is the **generic** "Cleaning Services in Minneola, FL" (not "Commercial Cleaning…"),
  so it will catch homeowner queries like "house cleaning minneola" — and then the body is 100%
  commercial: "veteran-owned **commercial and property** cleaning… businesses and properties."
- It claims *"**Every** Limpios service is available in Minneola"* — and lists only the five
  commercial services. That statement is now literally false as rendered (three services exist
  that aren't shown), and there is no residential link anywhere on the page.
- Its hero CTA is `quote?service=commercial` — a homeowner who pushes through gets Commercial
  preselected (changeable, but one more wrong-fit signal).

Reviews (`/en/reviews`): all six placeholders are offices, rentals, builders, contracts. Not one
person describing their own house. They're placeholders slated for replacement with real Google
reviews, so this is a note for the replacement pass, not a copy bug.

About (`/en/about`) quietly holds the line: *"we work with businesses, property managers, builders
**and homeowners**."* If I read the story, I'm reassured — Papo started out "cleaning offices and
houses on the side."

---

## Verdict

**The demoted residential path works and the destination pages genuinely respect a homeowner —
but the *route* to them depends on one lucky click.** The homepage offers zero breadcrumb toward
homes; the pricing page pretends houses don't exist; the city pages (a homeowner's most likely
organic landing) carry a homeowner-attracting title over commercial-only content plus a now-false
"every service" claim; and the one signpost that does exist ("Also available… for select clients —
ask during your walkthrough") reads gatekeep-y and circular to someone with no walkthrough booked.
Meanwhile the homepage gallery and "kids and pets" FAQ still whisper *residential* under a
commercial headline — the inconsistency cuts both ways. Fixes are small: honest signposts, not
re-promotion.

## Findings

| # | Sev | Finding | Evidence | Suggested fix | Owner decision? |
|---|-----|---------|----------|---------------|-----------------|
| 1 | P2 | Homepage has **zero** visible signal that homes are served — no service card (intended), but also no FAQ line, no footer link, no passing mention. A neighbor-referred homeowner must guess that "Services" hides a home option below the fold; many will bounce or cold-call. | `/en` (rendered text + FAQ JSON-LD contain no "residential"/"home cleaning"); footer `Services` column | Add one quiet breadcrumb without re-promoting: a homepage FAQ item ("Do you clean homes?" → yes, link to `/services/residential`) and/or a footer link under Services. | Direction is owner's (how visible), but *zero* breadcrumb is a site defect. |
| 2 | P2 | Minneola (and sibling city) pages: generic title "Cleaning Services in Minneola, FL" attracts homeowner searches, then the body is commercial-only **and claims "Every Limpios service is available in Minneola" while listing only 5 of 8** — literally false as rendered. Hero CTA also preselects `?service=commercial` for all visitors. | `/en/service-areas/minneola`; heading "Services available in Minneola"; CTA `quote?service=commercial` | Either (a) reword the claim ("Every commercial service…") and title-match the B2B intent, or (b) append the services-hub "Also available" strip to city pages. The false "every service" line should be fixed regardless. | Direction (a) vs (b) is owner's; the false claim is site-fix. |
| 3 | P2 | Services-hub demotion copy is gatekeep-y and circular: "for **select clients** — **ask during your walkthrough**." A homeowner has no walkthrough to ask during, and "select clients" implies homes are a favor for existing accounts. The links below rescue it, but the sentence undermines the very pages it introduces. | `/en/services` "Also available" strip | Reword to something like: "We also take on home cleaning and interior painting — request a free estimate and we'll set up a walkthrough." Keeps the demotion, removes the circularity. | Only if "select clients" is deliberate capacity-gating — then keep "select" but still fix the circular CTA. |
| 4 | P2 | Pricing page has no acknowledgment that homes are estimated at all — four commercial cards, and the frequency copy says "nightly, weekly, monthly," omitting biweekly (the house cadence the quote form itself offers as "Every 2 weeks"). A homeowner leaves Pricing believing the page isn't for them. | `/en/pricing`; `messages/en.json:503,555,567` vs `Quote.fields.frequency.options.biweekly` | One line under the cards: "Home or deep cleaning? Same deal — free walkthrough, written estimate. Request one here." And add "every 2 weeks" (or "biweekly") to the frequency copy. | No — small copy fix consistent with positioning. |
| 5 | P3 | Shared FAQ intro mislabels homeowners on their own service pages: "The things **facility and property folks** usually ask…" renders on `/en/services/residential` and `/en/services/deep-cleaning`. | `messages/en.json:259` (`Home.faq.subtitle`, reused via `Faq` component on service pages) | Neutralize ("The things clients usually ask before the first walkthrough") or allow a per-page override. | No — copy fix. |
| 6 | P3 | Walkthrough-first pricing is heavier than market norm for a small house (in-person visit before any number, vs franchise phone quotes by beds/baths). Site copy handles it as well as copy can (15–30 min, free, same-day written estimate); residual friction is the model itself. | `/en/pricing`; homepage FAQ "What happens during the walkthrough?"; quote success copy | If owner wants residential volume: offer phone/photo estimates for typical homes on the residential page. If not: no change — current copy is honest. | **Yes — business-model call.** |
| 7 | P3 | Reversed inconsistency (over-targets homeowners under B2B positioning): homepage flagship before/after gallery is nearly all residential imagery (rust tub, moldy fridge, toilet, kitchen, patio) under a commercial hero, and the FAQ says "safe for offices, **kids and pets**." A B2B prospect sees bathtubs; a homeowner sees mixed signals. | `/en` gallery; `src/content/gallery.ts` (flagship items tagged `deep-cleaning`/`residential`); FAQ JSON-LD | Needs commercial before/after photography to match the new positioning; until then, lean captions toward turnover/inspection framing (some already do). "Kids and pets" phrasing is fine to keep (offices have both visitors and therapy dogs) but worth a conscious choice. | **Yes — requires new photo assets; owner priority call.** |
| 8 | P3 | Review placeholders contain zero owner-occupied-home voices (all six are offices/rentals/builders). Fine for B2B positioning, but if residential stays offered, the eventual real-review curation should keep at least one home clean represented. | `/en/reviews`, `/en` reviews band; placeholders gated by `reviewsArePlaceholder` | Note for the real-review replacement pass, not a code change now. | **Yes — curation call at review-replacement time.** |
| 9 | P3 | Frequency mismatch on the commercial side (flagged because inconsistencies cut both ways): pricing copy sells "nightly" contracts but the quote form's frequency options are One-time/Weekly/Every 2 weeks/Monthly — no nightly/daily. A commercial prospect can't express the cadence the pricing page advertised. | `messages/en.json:503` vs `FREQUENCIES` in `src/components/quote/quote-form.tsx:21` | Add a "Nightly / daily" (or "Multiple times a week") option, or soften pricing copy to "recurring (weekly, monthly or custom)." | No — alignment fix either way. |

## What already works (keep)

- **Residential page copy** — "The same standards, at home," included-scope list, "busy families,"
  bedrooms/baths/frequency estimate factors, home-specific video. Respectful, not an afterthought.
- **Deep-cleaning page** — "first-time clients before starting recurring service" matches the
  classic homeowner entry path (deep clean → biweekly) exactly.
- **Quote form** — House/Apartment property types, Bedrooms + "Bathrooms / restrooms," optional
  sqft with an offices-mainly hint, "Every 2 weeks" frequency, validated `?service=` prefill.
  A homeowner completes it with zero mismatched fields.
- **About page** — still names homeowners among the audiences; the origin story includes houses.
- **Residential/deep pages are in the sitemap and indexable** — the demotion is navigational,
  not an SEO burial.
- **"from $120" removal was clean** — no residue anywhere in rendered copy or messages.
