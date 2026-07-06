# Role-flow audit: Operations manager, residential construction company

**Persona:** Ops manager at a residential builder putting up 15–30 homes/year around Lake County, FL.
I need rough + final post-construction cleans coordinated with my build schedule, and window
cleaning that gets stickers and paint specks off new glass. I vet subs on: scheduling reliability,
capacity, insurance (my GC requires COIs from every sub), phase understanding (rough vs. final),
and price predictability across repeated floor plans.

**Method:** Text-level walkthrough of the running site at `http://localhost:3000` (EN routes),
2026-07-06. No source files modified; quote form steps 2–4 read from
`src/components/quote/quote-form.tsx` + `messages/en.json` since the multi-step form only renders
step 1 server-side (I did not POST anything).

---

## 1. Landing (`/en`)

First screen: "Commercial cleaning your business can count on" with the subhead
"Offices, **post-construction sites**, turnovers, windows and carpets — cleaned to a written scope
by a **licensed, insured**, veteran-owned crew. Based in Lake County, serving all of Central
Florida." That's three of my checkboxes name-checked in the first paragraph — post-construction,
insured, Lake County. Good start.

Scrolling, the "Who we work with" section has a dedicated **Construction companies** card:

> "Rough and final cleans that turn a finished build into a handover-ready space, on your
> timeline." (`/en`, audience section)

This is the single line that tells me they know my world exists. "Rough and final" is the correct
vocabulary — most cleaning sites only know "post-renovation dust." The card links straight to
`/en/services/post-construction`. So yes: they clearly market to builders, not just homeowners
after a remodel.

Two things on the landing page cut the other way:

- The **before/after gallery** is almost entirely occupied-residential grime: "Rust-stained tub,"
  "Grimy, moldy fridge," "Filthy toilet and floor" (`/en`, Before & after section). That proves
  detail skill, but it's the wrong movie for me — a new build has no mold, it has drywall dust,
  sticker glue and paint overspray. Nothing in the gallery shows a construction clean.
- The footer license line reads **"License: LIC# 000000000"** (`/en`, footer — every page). A
  nine-zero placeholder is worse than no license line at all when a GC's compliance person looks;
  it reads as "not actually licensed yet."

The "How it works" section (walkthrough → written estimate usually within a day → clean) is clear
and low-pressure, and "after-hours if that's what your schedule needs" hints at flexibility.

## 2. Post-construction service page (`/en/services/post-construction`)

This page mostly speaks my language:

- Hero: "Specialized cleanup after a build or remodel… **on your schedule, coordinated with your
  trades**." — "coordinated with your trades" is exactly the promise I need; whoever wrote this
  has stood in a house where the painters come back Thursday.
- "Who it's for" leads with "**Contractors and builders needing a final clean**" and
  "**New-construction handoffs and model homes**." Model homes is a nice touch — that's a real
  builder pain point.
- "What shapes the estimate" explicitly lists "**Phase (rough vs. final clean)**." So phase
  pricing exists as a concept. But it's one bullet — nowhere on the site is rough vs. final
  actually *defined* (what's in a rough clean? do they do the sweep-out between drywall and
  trim, or only the final?). I'd have to ask on the phone.
- "What's included" covers fine-dust removal, "debris and sticker/residue removal," fixture/
  window/frame detailing, and "final walk-through touch-ups" — the punch-list mindset is right.
  Open question a builder will ask: **debris haul-off**. "Debris… removal" — to my dumpster, or
  do they haul? Unstated.

**Proof:** The "On the job" strip has 4 real photos ("Real photos from recent Limpios jobs — no
stock imagery"): a marble bathroom with freestanding tub pre-clean, an empty room mid-clean with
ladders staged, the finished marble bathroom gleaming, and a cleaned bedroom with glossy wood
floors. These **do land** — they are recognizably new-build interiors, not someone's lived-in
kitchen, and the mid-clean ladder shot reads as "crew that actually works sites." What's missing
for full conviction: a true before shot (drywall dust / sticker-covered glass) and anything
suggesting they've done more than one house at a time.

What's **not** on this page: crew size, how many homes they can turn in a week, COI language,
any builder-program / volume framing. The FAQ block at the bottom is the same generic 9-question
set as every page ("Are your products safe for offices, kids and pets?") — zero
construction-specific questions.

## 3. Window cleaning page (`/en/services/window-cleaning`)

Better than I expected on the residue question:

- "What's included": "**Sticker and paint-speck removal on request**."
- "Who it's for": "**Post-construction builds with labeled or dusty glass**."
- "What shapes the estimate": "**Construction residue (stickers, paint, mortar)**" and
  "Access (ladder work, upper floors)."

That's precisely my use case, stated in my words — "labeled glass" is what new-construction
windows actually look like. The copy convinced me they've scraped a sticker before.

Caveat: "on request" makes residue removal sound like an add-on rather than the default for a
construction job, and the two job photos (crew member on a step ladder at a window frame; pole-pad
detailing) plus the "scrub and squeegee" video show technique but not a residue before/after —
the one photo that would close this sale (razor + sticker glue coming off new glass) isn't there.

## 4. Pricing (`/en/pricing`)

Headline: "**Priced from a walkthrough, not a rate card**." The Post-construction card says
"Rough and final cleans for builders and remodelers, **coordinated with your timeline**" — Custom
proposal — with fine-dust, debris/residue, fixture/glass detailing and walk-through touch-ups
bullets. The "What shapes your estimate" factors (sqft, scope, condition, crew & equipment,
frequency) are honest and sensible, and "Frequency: recurring contracts price lower per visit than
one-time projects" at least signals volume discounting exists as a concept.

But here's my scale problem: **I build the same 4 floor plans 25 times a year.** A
walkthrough-per-job model means either (a) they walk every single house — which doesn't scale and
burns my superintendent's time — or (b) after house #1 we settle a per-plan rate. The site never
says (b) is possible. There is no "builder program," no "standing rates for repeat floor plans,"
no master-agreement or per-plan pricing language anywhere. For a one-off remodeler the pricing
page is reassuring; for me it reads as 25 separate negotiations. This is the single biggest
conversion gap for my persona.

## 5. Estimate path (`/en/quote` — form inspected via source, not submitted)

Four steps: Service → Property → Frequency → Contact.

- **Step 1 (Service):** radio cards — Post-construction and Window cleaning both present (and the
  service pages deep-link with `?service=post-construction` preselected — nice).
- **Step 2 (Property):** Property type options are Office/commercial, "**Construction site / new
  build**," HOA/community, House, Apartment/condo, Other — the construction option exists and is
  second in a B2B-first order. Then Bedrooms, Bathrooms/restrooms, and sqft ("e.g. 1800",
  optional). Reasonable per-house; nothing asks *how many homes*.
- **Step 3 (Frequency):** One-time / Weekly / Every 2 weeks / Monthly. **None of these describe my
  cadence.** I need "2–3 homes a month as they finish, rough + final per home." I'd pick
  "One-time" and feel like I'm lying, or "Monthly" and misrepresent the job. There's no
  "recurring projects / per-phase / multiple properties" option.
- **Step 4 (Contact):** name/email/phone, address, free-text "Anything else?" ("Scope notes,
  access, preferred walkthrough times…") — this textarea is where my entire actual requirement
  (volume, phases, schedule coordination, COI) has to live. No company-name field (ironically,
  the only `company` input is the hidden honeypot), no target-date field, no "how did you hear."

Friction verdict: for job #1 the form is genuinely fast (~2 min as promised). For repeat/volume
work it has no vocabulary — but the phone number is everywhere and honestly that's what I'd use.

## 6. Trust & paperwork (persona checklist)

| My requirement | What the site says | Verdict |
| --- | --- | --- |
| Insurance / COI | FAQ: "Limpios holds a business license and carries insurance… (Florida doesn't require a specialty trade license for cleaning — our license is the standard business license)." Honest and clear — but no COI-on-request line, no GL/workers'-comp mention, no "additional insured" language. Grep confirms zero COI/W-9 mentions in the whole codebase. | Partial — enough to call, not enough to hand my GC |
| License number | "LIC# 000000000" in the footer | Placeholder — actively hurts |
| Phase understanding | "Rough and final cleans" (home + pricing), "Phase (rough vs. final clean)" (service page) | Vocabulary yes, definition no |
| Scheduling coordination | "on your timeline," "coordinated with your trades," "after-hours available," tight-deadline language on turnovers | Good promises, no mechanism (no "we hold your slot" / lead-time statement) |
| Capacity / crew size | Nothing anywhere (crew size only appears as an estimate *factor*) | Missing |
| Volume / repeat pricing | "Recurring contracts price lower per visit" is the closest line | Missing for project-based volume |
| Relevant proof | 4 real new-build photos on the service page (land well); builder testimonial exists but is a **labeled placeholder** ("They did the final clean on two of our builds this spring… zero punch-list items" — Brandon T., Horizon West, `/en/reviews`) | Directionally right, not yet real |
| Bilingual crew | Prominent everywhere | Genuine plus — half my trades are Spanish-first |

Also spotted en route: the contact page heading "**Call or text-free line**" (`/en/contact`,
`messages/en.json:730` `callTitle`) is garbled — presumably "Call or text — free line" or
"Call or text: (407)…". Small, but it's the first heading on the page I'd use to reach them.

## Would I call?

Yes — cautiously. The post-construction and window pages say enough of the right words ("rough vs.
final," "coordinated with your trades," "stickers, paint, mortar," "model homes") that I believe
they've done this work, and the real job photos back it up. But I'd arrive at the phone call
carrying every commercial question the site didn't answer: COI naming us as additional insured,
workers' comp, capacity per week, per-plan pricing after the first walkthrough, and haul-off. A
competitor whose site pre-answers those gets my call first. Nothing here would survive my GC's
vendor-packet checklist (COI + W-9) without a phone call, and the placeholder license number would
raise a flag if compliance saw it.

---

## Findings

| # | Sev | Finding | Evidence | Suggested fix | Owner decision? |
| --- | --- | --- | --- | --- | --- |
| 1 | P1 | No COI / insurance-detail language anywhere. B2B construction buyers must produce a certificate of insurance (often with additional-insured endorsement) before a sub sets foot on site; the FAQ only says "carries insurance." | `/en` FAQ "Are you licensed and insured?"; grep: no COI/W-9/workers-comp strings in `messages/` or `src/` | Add one sentence to the insurance FAQ and the post-construction page: "Certificate of insurance available on request — we can name your company as additional insured." Add W-9/vendor-packet mention if true. | Yes — Papo must confirm actual coverage (GL limits, workers' comp) before any claim is published. Site can add "COI on request" only once confirmed. |
| 2 | P1 | Walkthrough-per-job pricing model has no answer for volume/repeat work. A builder with 15–30 similar homes/year reads "priced from a walkthrough, not a rate card" as 25 negotiations; no builder program, per-floor-plan rate, or master-agreement language exists. | `/en/pricing` hero + process copy; `/en` "How it works" | Add a short "Builders & repeat floor plans" note on `/en/pricing` and `/en/services/post-construction`: e.g. "Building the same plans? After the first walkthrough we can set a standing per-plan rate for rough and final cleans." | Yes — pricing policy is Papo's call; the site should surface whatever he decides, but the gap itself is a site fix. |
| 3 | P2 | Footer license number is a visible placeholder: "LIC# 000000000" on every page. For a compliance-minded B2B buyer this undermines the "licensed" claim in the hero. | `/en` (and all pages) footer | Replace with the real business-license number, or drop the LIC# line until it's available (the FAQ already explains FL licensing honestly). | Yes — real number must come from Papo (known TODO). |
| 4 | P2 | Quote form frequency step can't describe project-based volume work. Options are One-time / Weekly / Biweekly / Monthly; a builder's cadence ("2–3 homes/month, rough + final each") fits none, and nothing asks number of homes/units or target dates. | `/en/quote` step 3; `src/components/quote/quote-form.tsx` (`FREQUENCIES`), `messages/en.json` `Quote.fields.frequency` | Add a fifth option like "Recurring projects (multiple properties)" or a conditional "How many properties/homes?" field when propertyType = construction. Keep it one field — don't bloat the form. | No — pure site fix. |
| 5 | P2 | Rough vs. final is name-dropped but never defined, and debris scope is ambiguous ("Debris and sticker/residue removal" — haul-off or to on-site dumpster?). Buyer must call to learn what each phase includes. | `/en/services/post-construction` "What shapes the estimate" + "What's included" | Add 2 construction-specific FAQ items on the post-construction page: "What's the difference between a rough and a final clean?" and "Do you haul debris?" | Partly — wording is a site fix, but haul-off policy and phase scope need Papo's confirmation. |
| 6 | P2 | No capacity or scheduling-mechanism signal: crew size, homes-per-week throughput, and lead time are absent; hours (Mon–Fri 8–6) plus "after-hours available" is all a scheduler gets. | site-wide; footer hours; `/en` process section | Add one confirmable line to the post-construction page, e.g. "Crews sized to the job — we can run multiple homes in a week" + typical booking lead time. | Yes — capacity numbers must come from Papo; don't invent. |
| 7 | P3 | Homepage before/after gallery is 100% occupied-residential grime (rusty tub, moldy fridge, dirty toilets); no construction clean is represented in the main proof section, which mis-targets the B2B/builder positioning of the hero. | `/en` "Before & after" gallery alts | Add at least one post-construction pair (dusty/sticker-glass before → handover-ready after) to the homepage gallery once photos exist; meanwhile the 4 new-build photos on the service page do land. | Yes — needs real photos from Papo's jobs. |
| 8 | P3 | Window page frames construction-residue removal as "on request," and has no residue before/after despite it being the top construction use case the page itself targets ("labeled or dusty glass"). | `/en/services/window-cleaning` "What's included" / "On the job" | Reword to "Sticker and paint-speck removal (standard on construction cleans)" if true; add a sticker-glue/paint-speck before-after photo when available. | Partly — wording tweak is site-side; whether it's standard vs. add-on is Papo's call. |
| 9 | P3 | The only builder testimonial is a placeholder (correctly labeled as sample). Fine pre-launch, but the persona's most relevant proof is currently fictional — prioritize getting a real builder review first. | `/en/reviews` (Brandon T., Horizon West); `/en` reviews note | When collecting launch reviews, ask a builder/GC client first — one real "final clean on our builds" quote outweighs three office reviews for this segment. | Yes — real reviews must exist; keep `reviewsArePlaceholder` true until then. |
| 10 | P3 | Contact-page heading copy is garbled: "Call or text-free line" (reads as "text-free" = no texting). | `/en/contact`; `messages/en.json:730` (`Contact…callTitle`) | Change to "Call or text — it's free" / "Call or text us" (mirror fix in `es.json`). | No — copy fix. |
| 11 | P3 | Quote form has no company-name field for B2B leads (the only "Company" input is the hidden honeypot), so a builder's lead arrives looking like a homeowner's. | `/en/quote` step 4; `src/components/quote/quote-form.tsx` honeypot + contact step | Add an optional visible "Company (optional)" field on the contact step — note it must NOT collide with the `company` honeypot field name (rename honeypot if needed, and update `src/lib/lead-schema.ts`). | No — site fix, small. |

### What already works for this persona (keep)
- "Rough and final cleans… on your timeline" audience card on `/en` — correct vocabulary, correct link.
- "Coordinated with your trades" (`/en/services/post-construction` hero) — best line on the site for this buyer.
- "Construction residue (stickers, paint, mortar)" + "labeled or dusty glass" (`/en/services/window-cleaning`) — exactly the window use case.
- "Construction site / new build" property type in the quote form, pre-selected service via `?service=` deep links.
- Honest licensing FAQ (explains FL has no specialty cleaning license instead of hand-waving).
- Real, no-stock job photos on the service pages — the new-build bathroom/bedroom set reads authentic.
- Bilingual service, prominently — a real operational advantage on construction sites.
