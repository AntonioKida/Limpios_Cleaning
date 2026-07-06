# Role-flow audit: Commercial business owner (wellness clinic + retail, Clermont FL)

**Persona:** Owner of a ~3,800 sqft dental-adjacent wellness clinic with attached retail in Clermont.
Needs recurring after-hours cleaning 2–3×/week, restrooms done properly. Cares about: trust (who's in
my space at night?), insurance, crew consistency, low-odor products (patients on site), and a
professional, responsive vendor. Currently burned by an unreliable solo cleaner.

**Method:** Server-rendered HTML fetched via curl from `http://localhost:3000` on 2026-07-06.
Client-only content (FAQ accordion answers, quote-form steps 2–4) verified against the page's
FAQPage JSON-LD and `src/components/quote/quote-form.tsx` + `messages/en.json`. No source files
modified; no form POSTs sent.

---

## First-person walkthrough

### 1. Landing (`/en`) — "Is this for a business like mine?"

Yes, immediately. The `<title>` is "Commercial Cleaning in Central Florida | Veteran-Owned" and the
H1 is **"Commercial cleaning your business can count on."** After a string of residential-first maid
sites, this is the first one that leads with me. The subhead — *"cleaned to a written scope by a
licensed, insured, veteran-owned crew"* — hits three of my checkboxes (insurance, accountability,
discipline) in one sentence.

The "Who we work with" section names me almost exactly: *"Commercial businesses — Offices, clinics,
retail and facilities — recurring or one-time, scheduled around your hours."* **"Clinics"** and
**"scheduled around your hours"** are the two words I was scanning for. The card links straight to
`/en/services/commercial`.

The "Why Limpios" block answers my solo-cleaner trauma directly:

> "The same vetted team — Not a rotating cast. You get the same background-checked cleaners who
> learn your space and your standards." (`/en`)

and

> "A written scope & checklist — Every visit follows a written checklist, so nothing gets skipped."

That's precisely the failure mode I'm escaping. The 24-hour free re-clean guarantee and "a phone
that gets answered" positioning also land well.

**What cooled me off on the same page:**

- The before/after gallery is almost entirely residential: *"Rust-stained tub,"* *"Grimy, moldy
  fridge,"* *"Filthy toilet,"* *"Cluttered, grimy kitchen,"* *"Toilet base and floor, hand-detailed
  for turnover."* The work quality is evident, but I'm hiring for a clinic + retail space, and the
  proof section reads like a house-cleaning portfolio. Not one office, lobby, or commercial restroom
  in the set.
- The footer says **"License: LIC# 000000000."** A visibly fake license number directly under
  "licensed and insured" claims is worse than no number at all — it made me re-read every other
  claim on the page with more suspicion. (I understand this is a pre-launch placeholder, but as a
  buyer I can't know that.)

### 2. Commercial service page (`/en/services/commercial`) — my core needs

Strong page for my checklist:

- **After-hours:** covered twice — hero (*"on a schedule built around your business — after-hours or
  daytime"*) and "Who it's for" (*"Businesses that need flexible, after-hours service"*).
- **Restrooms:** explicitly in scope — *"Restrooms sanitized and restocked"* — and the estimate
  factors include *"Square footage and number of restrooms."* Someone here has actually priced
  commercial jobs; restroom count as a pricing driver is an insider signal.
- **Clinic sensitivity:** *"Offices, clinics, salons and retail storefronts"* in "Who it's for," and
  the three videos are the most relevant proof on the whole site for me: *"Electrostatic
  disinfection of a commercial office," "Disinfecting a conference room," "Why electrostatic
  disinfection works."* Electrostatic disinfection is exactly the vocabulary a health-adjacent buyer
  wants to hear.
- **Products (FAQ, expanded):** *"We use eco-friendly, low-odor products… If anyone on site has
  allergies or sensitivities, tell us and we'll adjust."* Low-odor named explicitly — that's my
  patient-comfort concern answered verbatim.
- **Vetting (FAQ):** *"everyone on the team is vetted and background-checked before they ever set
  foot on your site."* The license FAQ answer is also refreshingly honest: *"(Florida doesn't
  require a specialty trade license for cleaning services — our license is the standard business
  license to operate.)"* — that candor buys back some of the trust the footer placeholder spent.

**Weak spot:** the page's single before/after is *"Toilet base and floor, hand-detailed for
turnover"* — a residential turnover shot on the commercial page. The videos carry the commercial
proof; the photo undercuts it.

**Unanswered for a night-access buyer (nothing on the page, FAQ, or About):** key/alarm/access-code
handling, whether anyone supervises or spot-checks the crew's work, what the background check
actually covers, and whether I'm signing an annual contract or month-to-month. These are the exact
questions I'd grill them on during the walkthrough — a vendor who answers them *on the site* would
have won the call before it started.

### 3. Trust path: About (`/en/about`) and Reviews (`/en/reviews`)

The About page is the best trust asset on the site. Papo's story is specific and first-person
(*"the crews they'd used before would cut corners, show up late, or just stop answering the
phone… So I built Limpios to run like that. Same crew, a written checklist we actually follow, and
a phone that gets answered"*), and — critically for me — *"I'm usually out on jobs myself."*
Owner-on-site is the single strongest supervision signal a small vendor can offer, and it's here,
though it's framed as personality rather than as a QC commitment. The Chamber of Commerce
membership and "Every Limpios cleaner is vetted, trained and insured" round it out.

Reviews: the disclaimer — *"the reviews shown are sample placeholders for design purposes and are
not real customer reviews. They will be replaced with verified Google reviews before launch"* — is
handled about as well as fake reviews can be. As a buyer I respect the honesty and it's consistent
with the plain-talk brand. But the net effect is that **the site currently offers zero social
proof**, and only two of the six samples even model my use case (Jessica M.'s weekly office clean,
Ana L.'s recurring contract). For a 2–3×/week contract worth thousands a year, I'd want at least
one real commercial reference or a "call these two clients" offer. Until real reviews land, the
honest disclaimer means the *reviews page argues against visiting it*.

### 4. Pricing (`/en/pricing`)

No sticker price, but the page earns the omission. *"Priced from a walkthrough, not a rate card"*
plus the five named estimate drivers (sqft, scope, condition, crew, frequency) reads like how a
serious commercial vendor actually prices, and *"Recurring contracts (nightly, weekly, monthly)
price lower per visit than one-time projects"* tells me my recurring job gets contract pricing.
The "Most requested — Commercial & recurring" card is aimed straight at me: *"nightly, weekly or
custom… After-hours available… Same insured crew each visit."* I stopped looking for a price and
started looking for the walkthrough button — the page did its job.

One catch: this card promises **"nightly, weekly or custom"** frequency. Remember that phrase for
the next section.

### 5. Estimate path (`/en/quote`) — where friction lives

Four steps, ~2 minutes as advertised. Step 1 (service) is fine. Then:

- **Step 2 "Your space":** property types are B2B-first (*"Office / commercial space"* is the top
  option — good), and the restroom count I expected is asked (*"Bathrooms / restrooms"*). But I'm
  also shown a **"Bedrooms"** field for my clinic. It's optional, but it's a residential tell in
  the one flow that's supposed to be commercial-first.
- **Step 3 "Frequency" — the real problem.** Options are exactly: *One-time project / Weekly /
  Every 2 weeks / Monthly*. I need **2–3× per week**. The pricing page just told me "nightly,
  weekly or custom" is the *most requested* plan, and the form physically cannot capture it. My
  choices are to lie (pick "Weekly") and correct it in the free-text box, or abandon. A frequency
  mismatch between the flagship pricing card and the lead form is the kind of thing that makes a
  buyer wonder how buttoned-up the operation really is.
- **Step 4 "Contact":** asks name / email / phone / address / message / consent. There is **no
  business or company name field** — as a commercial lead I have nowhere structured to say who we
  are (ironically, the form's hidden anti-bot honeypot field is labeled "Company"). No "preferred
  contact window" or "after-hours walkthrough OK?" option either, though the message placeholder
  (*"Scope notes, access, preferred walkthrough times…"*) at least gestures at it.

The fallback path is solid: phone number in the header of every page, and the contact page is
honest about *"Online booking — coming soon."*

### Verdict

I would call them. The positioning ("clinics," after-hours, restrooms-as-pricing-driver, low-odor,
same background-checked crew, owner on jobs, electrostatic disinfection) is the strongest
commercial fit I've seen from a small local outfit, and the honesty (placeholder reviews
disclaimed, Florida license candor) builds more trust than it costs. But I'd arrive at the
walkthrough with a list of questions the site could have pre-answered — access/keys/alarm,
background-check depth, QC, contract flexibility, COI — and the fake license number plus the
missing 2–3×/week option are the two things that nearly cost them the call.

---

## Findings

| # | Sev | Finding | Evidence | Suggested fix | Owner decision? |
|---|-----|---------|----------|---------------|-----------------|
| 1 | P1 | Quote form frequency options (One-time / Weekly / Every 2 weeks / Monthly) cannot express the advertised flagship plan: pricing's "Most requested — Commercial & recurring" card promises "nightly, weekly or custom," and a 2–3×/week buyer has no valid choice. | `/en/pricing` ("nightly, weekly or custom") vs `/en/quote` step 3; `src/components/quote/quote-form.tsx` `FREQUENCIES`, `messages/en.json` `Quote.fields.frequency.options` | Add "2–3× per week / Nightly" and/or a "Custom — tell us" option (custom can reveal a small text input or route to the message field). | No — pure site fix. |
| 2 | P1 | Footer shows "License: LIC# 000000000" on every page, directly under "licensed and insured" claims. A visibly fake number actively erodes the trust the rest of the site builds. Known TODO, but it is a launch blocker for a trust-driven commercial buyer. | All pages, e.g. `/en`, `/en/services/commercial` footer; `src/content/site.ts:73` | Replace with the real business license/registration number before launch; until then, hide the line entirely rather than show a placeholder. | Yes — owner must supply the real number (site should hide the placeholder meanwhile). |
| 3 | P2 | No night-access trust content anywhere: nothing on key/alarm/access-code handling, background-check depth (what's checked, how often), or supervision/QC (who inspects the work). "I'm usually out on jobs myself" (About) is the only implicit QC signal and it isn't framed as one. For an after-hours buyer these are the deciding questions. | `/en/services/commercial`, `/en/about`, FAQ (all pages); no matches for key/alarm/COI/supervision in `messages/en.json` | Add a short "How after-hours access works" block or 2–3 FAQ items (keys/alarms, what the background check covers, how quality is checked between visits). Copy only what's true. | Yes — owner must confirm actual key/alarm protocol, check type, and QC practice before anything is published. Site should add the section once confirmed. |
| 4 | P2 | No structured "Business / company name" field on the quote form, so commercial leads arrive looking like residential ones. (The only field named "Company" is the hidden anti-spam honeypot.) | `/en/quote` step 4; `src/components/quote/quote-form.tsx` (honeypot `company`, no visible business field) | Add an optional "Business / company name" field (shown always, or when propertyType is office/community/construction). Rename the honeypot's internal key to avoid confusion. | No — site fix. |
| 5 | P2 | Commercial proof is residential-skewed: the homepage before/after gallery is tubs, fridges, toilets and kitchens (no office/lobby/commercial restroom), and the commercial page's single before/after is "Toilet base and floor, hand-detailed for turnover." The disinfection videos carry all the commercial proof. | `/en` before/after section; `/en/services/commercial` before/after | Curate at least 2–3 commercial before/afters (office restroom, break room, lobby floor, glass storefront) and lead the commercial page with those; keep residential shots on residential pages. | Partly — needs real commercial job photos from the owner; placement is a site fix. |
| 6 | P2 | Insurance claims are asserted but never substantiated: no "COI available on request," no bonding statement, no coverage type. A clinic owner (or their landlord) will require a certificate; saying so on-site removes a sales-call step. | FAQ "Are you licensed and insured?" (all service pages); `/en/pricing` "Same insured crew each visit" | Add one sentence: "Certificate of insurance available on request" (and bonding status if applicable) to the insurance FAQ. | Yes — owner must confirm coverage/bonding facts; never invent amounts. |
| 7 | P2 | Zero real social proof and no substitute: placeholder reviews are honestly disclaimed (good), but only 2 of 6 samples model commercial recurring work, and there is no "references available" offer for contract buyers anywhere. | `/en/reviews` disclaimer; `/en` reviews strip | Until verified Google reviews land, add a "Commercial references available on request" line on the commercial + pricing pages; when replacing samples, prioritize recurring-commercial testimonials. | Yes — owner must obtain real reviews/references; the interim "references on request" line needs owner sign-off that they can honor it. |
| 8 | P3 | No contract-terms signal: a buyer leaving an unreliable vendor wants to know they're not trapped (month-to-month? cancel notice? trial period?). Site is silent, and "Custom proposal" gives no hint. | `/en/pricing` cards; FAQ | If true, one line — e.g. "Recurring service is month-to-month; no long-term lock-in" — on the pricing page or FAQ. | Yes — entirely an owner business decision; do not add until confirmed. |
| 9 | P3 | "Bedrooms" field shows for commercial property types on quote step 2, a residential tell in a B2B-first flow (labels are otherwise well adapted: "Bathrooms / restrooms", sqft "helpful for offices"). | `/en/quote` step 2; `src/components/quote/quote-form.tsx` step 1 fieldset | Conditionally hide Bedrooms (or relabel the pair) when propertyType is office/construction/community. | No — site fix. |
| 10 | P3 | Contact card title "Call or text-free line" is garbled — reads as "a line without texting." Presumably meant "Call or text — toll-free line" or just "Call or text." Small, but it's the first line of the contact page for a buyer judging professionalism. | `/en/contact`; `messages/en.json` `Contact.callTitle` | Fix the copy (and mirror in `es.json`). Confirm whether the number actually receives texts. | Partly — owner confirms whether texting is supported; wording is a site fix. |
| 11 | P3 | Business hours (Mon–Fri 8–6, Sun closed) sit next to heavy "after-hours service" messaging with no reconciliation; a literal reader may wonder if after-hours is real. | Footer + `/en/contact` hours vs "after-hours" claims on `/en`, `/en/services/commercial`, `/en/pricing` | Label the hours "Office / phone hours" and add "cleaning crews work after-hours by arrangement." | No — clarification copy, assuming after-hours service is real (it's claimed repeatedly). |
| 12 | P3 | FAQ answers are not in the server-rendered HTML (Radix accordion renders content only when opened; the hidden regions ship empty). The FAQPage JSON-LD does contain full answers, so SEO is covered, but no-JS users and some crawlers see questions with no answers. | `curl` of `/en/services/commercial` — empty `data-slot="accordion-content"` divs; answers present only in JSON-LD | Force-mount accordion content (Radix `forceMount`) or render answers server-side with CSS-only collapse. | No — site fix. |

### What convinced me (keep these)

- "Commercial cleaning your business can count on" + "clinics" named in the audience card (`/en`).
- "Restrooms sanitized and restocked" in scope and "number of restrooms" as a pricing driver (`/en/services/commercial`, `/en/pricing`).
- "Eco-friendly, low-odor products… allergies or sensitivities, tell us and we'll adjust" (FAQ).
- "The same vetted team — not a rotating cast… same background-checked cleaners" (`/en`).
- Electrostatic disinfection videos on the commercial page — best clinic-relevant proof on the site.
- Papo's About story and "I'm usually out on jobs myself" (`/en/about`).
- Honest disclaimers (sample reviews, Florida license explanation, "online booking coming soon").
