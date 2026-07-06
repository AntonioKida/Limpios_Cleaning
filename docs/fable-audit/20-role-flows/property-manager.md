# Role-flow audit: Property manager (~40 rental units + 2 HOA common areas, Central Florida)

**Auditor persona:** I manage roughly 40 scattered-site rentals across Clermont / Winter Garden / Four Corners plus two small HOA common areas. I need move-out turnover cleaning between tenants on hard deadlines, occasional carpet cleaning, and a vendor I can onboard: COI, W-9, consistent crews, inspection-ready quality, and someone who answers the phone the day a tenant hands back keys.

**Method:** server-rendered HTML fetched from `http://localhost:3000` on 2026-07-06; every quote is copied from the rendered page. The quote form's steps 2–4 are client-rendered, so those were read from `src/components/quote/quote-form.tsx` and `messages/en.json` (`Quote.*`) — described, not submitted.

---

## 1. Landing on the homepage (`/en`)

The `<title>` is **"Commercial Cleaning in Central Florida | Veteran-Owned"** and the H1 is **"Commercial cleaning your business can count on."** My first read: this is a commercial outfit, not a maid service — good start. The subhead names my job in the first sentence:

> "Offices, post-construction sites, **turnovers**, windows and carpets — cleaned to a written scope by a **licensed, insured**, veteran-owned crew." (`/en`)

Then the "Who we work with" section does something most cleaning sites never do — it has a card literally titled **"Property managers"**:

> "Reliable move-out turnovers and common-area cleaning, **with photos and clear communication on every unit**." (`/en`)

That's my language. "Photos... on every unit" is exactly the artifact I forward to owners. The neighboring **"Homeowners associations"** card ("Clubhouses, amenity centers and common areas kept resident-ready on a schedule your board approves") covers my two HOA commons, too. Within one scroll I know they want my business. **Messaging: pass.**

Two more things on the homepage that land with me:

- **"The same vetted team — Not a rotating cast. You get the same background-checked cleaners"** (`/en`). Consistent crews is a line-item on my vendor scorecard; they said it unprompted.
- The before/after gallery includes captions like **"Toilet base and floor, hand-detailed for turnover"** (`/en`) — actual turnover-context proof, not stock kitchens.

And one thing that stops me cold: the footer on **every page** reads **"License : LIC# 000000000"** (`/en`, footer). Nine zeros. I verify vendor licenses; an obviously fake number reads worse than no number. (I understand this is a tracked placeholder — but as the buyer, if I saw this live, I'd assume the "licensed" claim is decorative.)

## 2. Finding my service (`/en/services` → `/en/services/move-in-out`)

The services index (`/en/services`) lists five services; **"Move-in / move-out cleaning — Turnovers that pass the walk-through"** is unambiguous. The detail page is the strongest page on the site for me:

> "Detailed cleaning for empty units and homes at turnover time, **built to pass a property manager's or agent's inspection. Fast scheduling between tenants, and photo-documented results when you need them.**" (`/en/services/move-in-out`)

"Who it's for" leads with **"Property managers turning units between tenants."** The "What's included" list (inside cabinets/drawers/closets, inside oven/fridge, baseboards/doors/switches, floors) matches my inspection checklist. "What shapes the estimate" even names **"Same-day or tight-deadline scheduling"** — they know turnovers have deadlines.

Nit: the hero promises "photo-documented results when you need them," but photo documentation does **not** appear in the "What's included" bullets, and no page says what the policy actually is (before/after every unit? only on request? delivered how?). I'd ask on the phone; the site could answer it.

**Carpet cleaning** (`/en/services/carpet-cleaning`) also checks out for my use: "Who it's for" includes **"HOA clubhouses and community common areas"** and **"Property turnovers"** — both of my needs named. **Commercial** (`/en/services/commercial`) lists "Property managers and facility directors" and "HOAs with clubhouses and amenity centers" under Who it's for, and offers after-hours service.

## 3. Trust and proof

- **Insurance:** "licensed and insured" appears on essentially every page, and the FAQ (`/en`, FAQ JSON-LD/accordion) is refreshingly straight: *"Limpios holds a business license and carries insurance... (Florida doesn't require a specialty trade license for cleaning services — our license is the standard business license to operate.)"* I respect the honesty. But my property-management software won't onboard a vendor on the word "insured": I need a **COI naming my company as certificate holder**, and I'd want to see general liability + workers' comp mentioned. The words "certificate of insurance," "COI," "liability," "workers' comp," and "bonded" appear nowhere on the site (grep of `messages/en.json`). Nothing says they *don't* have it — the site just never closes the loop.
- **Consistency:** "Same insured crew each visit" is a bullet on the pricing page's Commercial card (`/en/pricing`); "The same vetted team" on `/en`; "You'll see the same faces on your site" on `/en/about`. Consistently claimed. Good.
- **Reviews (`/en/reviews`):** The page openly says **"the reviews shown are sample placeholders for design purposes and are not real customer reviews."** One placeholder is aimed squarely at me ("I manage several rental units and their move-out turnovers are the best I've used — inspection-ready every time, with photos when I ask"). I actually appreciate the disclosure — it beats fake stars — but net social proof for a vetting PM today is **zero**, and the **"Leave a review"** button links to `https://g.page/r/limpios-cleaning/review`, a placeholder URL (marked `// TODO: real GBP link` in `src/content/site.ts:84`). If I click through to verify them on Google and land nowhere, that's a trust dent.
- **Photos/video:** Real job photos ("no stock imagery" claimed), turnover-captioned before/afters, and crew videos on `/en/services/move-in-out` ("A move-in / move-out clean, start to finish"). For a company this size, this is above-average proof.
- **About (`/en/about`):** Papo's story — "the crews they'd used before would cut corners, show up late, or just stop answering the phone... So I built Limpios to run like that. Same crew, a written checklist... and a phone that gets answered." That is verbatim my pain with cleaning vendors. Chamber membership is a nice local-legitimacy signal.
- **Guarantee:** "tell us within 24 hours and we re-clean it free" (`/en`, `/en/about`). For turnovers this matters — a failed final inspection needs a same-week fix.

## 4. How pricing works (`/en/pricing`)

The model is clear and honestly framed: **"Priced from a walkthrough, not a rate card... The walkthrough and the written estimate are always free"** with a dedicated **"Turnovers & move-outs — Custom proposal"** card ("Inspection-ready cleans between tenants or owners, scheduled to your deadline... Tight-deadline scheduling"). "What shapes your estimate" (sqft, scope, condition, crew, frequency) tells me the quote will be defensible to my owners. "No surprises on invoice day" is a good instinct.

Two gaps for my volume:

1. **The frequency logic doesn't fit turnover work.** "Recurring contracts (nightly, weekly, monthly) price lower per visit than one-time projects" — turnovers are recurring *as-needed*, not calendar-based. Nothing tells me whether 3–5 turnovers/month earns contract treatment or whether each unit is a fresh one-time job.
2. **Walkthrough-per-space doesn't scale to 40 units.** A free walkthrough is great for job one, but no page says what happens on unit #7 of the same floor plan — do I get standing per-unit-type rates, or does every 2BR need a fresh walkthrough? The FAQ ("How much does cleaning cost?") never addresses repeat/portfolio clients.

Neither is a dealbreaker — I'd ask on the phone — but the site makes me do that work.

## 5. The estimate path (`/en/quote`, form described — not submitted)

Entry is easy: every service page CTA carries a prefill (`/en/quote?service=move-in-out`), and the page promises "about two minutes." It's a 4-step wizard (`Step 1 of 4` visible in the SSR HTML; steps 2–4 read from `src/components/quote/quote-form.tsx` + `messages/en.json`):

1. **Service** — 8 radio cards: the 5 core services plus Residential cleaning, Deep cleaning, and **Interior painting**. (Painting on a cleaning estimate form made me blink — `/en/services` explains it as "also available... for select clients," but at the decision moment it slightly dilutes the commercial positioning.)
2. **Your space** — Property type: *Office / commercial space, Construction site / new build, HOA / community facility, House, Apartment / condo, Other* — B2B-first ordering, and "HOA / community facility" covers my commons. Then **Bedrooms / Bathrooms / Approx. square footage** — clearly a *single unit's* anatomy. There is **no field for number of units, portfolio size, or turnover volume**. My actual request — "~40 units, 5–8 turnovers a month, mixed 1–3BR, plus two clubhouses" — has nowhere to live until...
3. **Frequency** — *One-time project / Weekly / Every 2 weeks / Monthly*. **None of these is true for turnover work.** I'd grudgingly pick "One-time project," which tells them exactly the wrong thing about my lifetime value and mis-frames the estimate conversation before it starts.
4. **Contact** — Name, Email, Phone, "Property address or city" (optional), **"Anything else?"** free-text ("Scope notes, access, preferred walkthrough times…"), consent checkbox. Note: **no company/organization field.** The only input named "Company" in the form is the hidden anti-bot honeypot (`aria-hidden`, `className="hidden"`, rejected if filled — `quote-form.tsx:222-228`, `src/lib/lead-schema.ts:27-29`). So a B2B lead arrives with a personal name and whatever I remembered to type in the message box. (Engineering note: if a visible Company field is added, the honeypot **must** be renamed first — today `name=company` is the bot trap, and the server flags any non-empty value as spam. A browser that autofills organization fields into the hidden input would silently kill a real lead; the risk is low given `autocomplete="off"` + `display:none`, but it's exactly the B2B persona whose autofill profile has a company name.)

Success state promises "We'll get back to you shortly" — no committed response time. The contact page (`/en/contact`) does say email gets a reply "within one business day" and the estimate FAQ says "usually within a day," which is decent; but there's no promise about the thing I actually sweat: **how fast can you be in a unit once I call.** Also on `/en/contact`: the card heading **"Call or text-free line"** is garbled copy — as written it parses as "a line free of texting." Presumably "Call or text — it's the fastest way" was intended, and whether the number actually receives SMS is unstated.

Friction verdict: for a single unit, genuinely frictionless (2 minutes, sensible steps, prefill works). For a 40-unit portfolio, the form actively fights me at steps 2–3 and under-captures who I am at step 4.

## 6. What's missing for a property manager

**Site should add (no new facts required):**
- A "per turnover / as needed" frequency option, and a units/quantity field or at least step-2 hint text ("managing multiple units? tell us how many").
- A visible Company/organization field on the quote form (with the honeypot renamed).
- Photo-documentation mentioned in move-in-out "What's included" (the hero already claims it).
- Fix "Call or text-free line" copy; hide/replace the placeholder "Leave a review" link until the real GBP URL exists.

**Owner must decide/confirm before the site can say it (do NOT invent):**
- COI available on request; GL/workers'-comp coverage details; bonded or not.
- W-9 / vendor-onboarding cooperation; invoicing terms (net-30? per-unit invoices? consolidated monthly billing?).
- Volume/portfolio pricing: standing per-unit-type rates after an initial walkthrough? Turnover-contract discount?
- A turnover scheduling SLA ("in the unit within X business days") and weekend availability (hours show Sat 9–3, Sun closed; turnovers love weekends).
- Photo-documentation policy (every unit vs. on request; how delivered).
- Whether the phone line takes SMS; the real license number; real Google reviews.

## 7. Verdict

Would I call them? **Yes — the messaging and the move-in-out page earn the call**, and that's rare; most cleaning sites make PMs translate residential copy. But everything after the call is on trust: no verifiable reviews yet, a placeholder license number, no COI/W-9/net-30 signals, and an estimate form shaped for one space at a time. The site wins the *interest* of a property manager and then leaves the *vendor-onboarding* questions — the ones that decide whether I can even issue them work orders — entirely to the phone.

---

## Findings

| # | Sev | Finding | Evidence | Suggested fix | Owner decision? |
|---|-----|---------|----------|---------------|-----------------|
| 1 | P1 | Footer shows placeholder license "LIC# 000000000" on every page — reads as fake to anyone who vets vendors; undermines the ubiquitous "licensed" claim | `/en` (all pages, footer); `src/content/site.ts:72` TODO | Replace with real number before launch; until then, drop the number and keep "Licensed & insured" | Yes — owner supplies real license number |
| 2 | P2 | Quote form frequency step (One-time / Weekly / Every 2 weeks / Monthly) has no option matching turnover work; PMs must mislabel themselves "One-time project" | `/en/quote` step 3; `quote-form.tsx:21` `FREQUENCIES` | Add "Per turnover / as needed" option (update `Quote.fields.frequency.options`, lead handling) | No |
| 3 | P2 | No way to express portfolio scale: step 2 captures one unit's bedrooms/bathrooms/sqft; no units-count field, no multi-property hint | `/en/quote` step 2; `quote-form.tsx:251-296` | Add optional "Number of units/properties" field or hint text pointing multi-unit buyers to describe volume | No |
| 4 | P2 | No company/organization field for real users (the only "company" input is the hidden honeypot); B2B leads arrive without firm identity | `/en/quote` step 4; `quote-form.tsx:222-228`; `lead-schema.ts:21,27-29` | Add visible "Company (optional)" field — MUST rename honeypot field first (currently `name=company`, non-empty ⇒ silently dropped as bot) | No |
| 5 | P2 | Insurance claims never mature into vendor-onboarding proof: no COI-on-request line, no GL/workers'-comp/bond mention anywhere | site-wide "licensed and insured"; FAQ answer on `/en`; grep of `messages/en.json` (0 hits for COI/certificate/workers) | Add one line ("COI available on request; general liability + workers' comp") to FAQ + move-in-out/commercial pages — only after owner confirms coverage | Yes — coverage facts |
| 6 | P2 | No invoicing/paperwork signals a PM needs: W-9, net-30, per-unit or consolidated billing never mentioned | grep of `messages/en.json` (only "no surprises on invoice day", `/en/pricing`) | Add a short "Working with property managers & HOAs" blurb (terms as owner confirms them) | Yes — terms |
| 7 | P2 | Zero verifiable social proof: reviews are disclosed placeholders AND the "Leave a review" button points to a placeholder GBP URL (dead end for verification) | `/en/reviews`; `src/content/site.ts:84` TODO | Keep the honest disclosure; hide the review button until the real `g.page` link exists; replace reviews at launch (already gated by `reviewsArePlaceholder`) | Yes — real reviews/GBP link |
| 8 | P2 | No turnover-response promise: estimate turnaround is stated ("usually within a day") but nothing about how fast a crew gets into a unit; weekend hours (Sat 9–3, Sun closed) unaddressed for turnover deadlines | `/en` FAQ; `/en/contact` hours; `/en/services/move-in-out` ("Fast scheduling" — unquantified) | Add a scheduling-SLA line to move-in-out page/FAQ once owner commits to one | Yes — SLA + weekend policy |
| 9 | P3 | Photo documentation is promised in hero copy ("photo-documented results when you need them"; homepage PM card "with photos... on every unit") but absent from "What's included" and no policy stated | `/en/services/move-in-out`; `/en` PM card | Add a "Photo documentation available" bullet to What's included; state policy (every unit vs. on request) after owner confirms | Partly — policy detail |
| 10 | P3 | Contact card heading "Call or text-free line" is garbled (reads as "a line without texting"); SMS capability of the number never confirmed | `/en/contact`; `messages/en.json:730` | Fix copy ("Call or text us" / "Call us"); confirm the line accepts SMS before advertising texting | Yes — SMS capability |
| 11 | P3 | Quote form's 8 service options include Residential / Deep cleaning / Interior painting, softening the commercial-first positioning at the decision moment | `/en/quote` step 1; `/en/services` "Also available" | Acceptable as-is (B2B options listed first); consider visually grouping the three under an "Also available" divider | No |
| 12 | P3 | No dedicated property-manager/portfolio page: the homepage PM card deep-links to the move-in-out service, which covers units but not the portfolio relationship (turnovers + carpets + HOA commons + billing under one vendor) | `/en` "Who we work with" → `/en/services/move-in-out` | Consider a "For property managers" page or a portfolio section on move-in-out consolidating findings 2–8 | Partly — commitments on it |
| 13 | P3 | Walkthrough-first pricing never explains repeat/portfolio economics (does unit #7 of the same floor plan need a new walkthrough? standing per-unit rates?) | `/en/pricing`; `/en` FAQ "How much does cleaning cost?" | Add a FAQ line for repeat clients once owner defines the practice | Yes — pricing practice |

**What already works well (keep):** "Property managers" audience card on `/en`; "built to pass a property manager's or agent's inspection" and "Same-day or tight-deadline scheduling" on `/en/services/move-in-out`; "Same insured crew each visit" (`/en/pricing`); turnover-captioned before/afters; 24-hour re-clean guarantee; honest placeholder-review disclosure; honest license FAQ; `?service=` CTA prefills; bilingual service; Papo's anti-"stopped answering the phone" story on `/en/about`.
