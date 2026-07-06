# Decision gates G1–G3 — implemented defaults + owner recommendations

**Rule followed:** no destructive resolution. Each gate got the recommended
default, implemented *reversibly*, and is flagged here for the owner's final
call. Reversal instructions are exact.

---

## G1 — Residential, deep cleaning & interior painting: demoted, not deleted

**The question.** Papo's new service list is five B2B services (commercial,
post-construction, move-in/out, window, carpet). It drops residential and
interior painting — and, implicitly, the standalone "deep cleaning" offering.
Remove them or demote them?

**What was implemented (default = demote).**
- `src/content/services.ts`: the three carry `secondary: true` +
  `featured: false`. `primaryServices` / `secondaryServices` exports drive
  every surface.
- Homepage grid, footer services nav, city-page service grids: **primary five
  only**.
- Services hub: primary five as full cards + an "Also available" strip
  (compact pill links) for the three demoted services, with copy positioning
  them as "for select clients — ask during your walkthrough".
- Routes `/services/residential`, `/services/deep-cleaning`,
  `/services/interior-painting` remain live with full retoned copy (EN+ES),
  quote-form options intact, sitemap entries intact (no broken URLs, no lost
  SEO equity).

**To reverse** (re-promote any of them): flip `secondary: false, featured:
true` in `services.ts` — every surface updates automatically.
**To go further** (hard-remove): delete the entries + their catalog blocks and
add redirects — NOT done, on purpose.

**Recommendation.** Keep the demotion. Research shows the business already
sells itself as commercial-first; painting was only ever a website-lander
mention. But because the site still *offers* them quietly, no revenue door is
closed while the brand story stays sharp. Owner should confirm: (a) is
residential still genuinely accepted? (b) is painting still offered at all?
If painting is fully dead, hard-remove it in a follow-up.

---

## G2 — City pages vs. broad "Central Florida"

**The question.** Papo wants broad "Central Florida" messaging with no
city/ZIP enumeration; the repo has 8 city pages built for local SEO.

**What was implemented (default = keep pages, reframe messaging).**
- All *messaging* now leads with "Central Florida, based in Lake County"
  (hero, meta titles/descriptions, service-area hub, footer blurb,
  `Common.serviceAreaLabel`, FAQ "area" answer).
- The 8 city pages stay (16 routes × SEO value preserved), retoned to
  commercial/property language and framed as "areas we're in most often"
  rather than an exhaustive coverage list.
- **ZIP-code chips removed from city pages** (the most literal violation of
  "don't enumerate"); the ZIP data itself stays in `cities.ts` for
  reversibility. The aside now sells the free walkthrough instead.
- JSON-LD `areaServed` still lists the 8 cities (structured data is *for
  machines*, aids local relevance, and does not contradict broad messaging;
  Service schema stays `areaServed: Florida`).

**Trade-off, honestly stated.** Keeping city pages costs a little "pure
broadness" but preserves the only local-SEO surface a business with **no
Google Business Profile and zero reviews** currently has. Deleting them would
throw away indexed routes for a messaging preference the visitor never
experiences (nobody reads 8 city pages in a row).

**Recommendation.** Keep pages + broad messaging (as implemented). Revisit
consolidation only after a GBP exists and starts ranking. If the owner insists
on full consolidation: 301 the 8 city routes to `/service-areas` and remove
the footer city links — a 30-minute change, documented here for whoever does it.

---

## G3 — Licensing wording (truth-in-advertising)

**The question.** "Licensed & insured" must not imply a specialized cleaning
trade license — Papo's license is a city business license (cleaning services
need no trade license in Florida).

**What was implemented (chosen wording, for sign-off):**
- Badges/short lines keep the industry-standard **"Licensed & insured"**
  (`Common.licensedInsured`) — defensible because a business license + insurance
  genuinely back it, and the site itself defines the term precisely:
- FAQ "insured" answer (EN): *"Yes. Limpios holds a business license and
  carries insurance, and everyone on the team is vetted and background-checked
  before they ever set foot on your site. (Florida doesn't require a specialty
  trade license for cleaning services — our license is the standard business
  license to operate.)"* — ES mirrors it exactly.
- Nothing anywhere says "certified", "trade-licensed", "bonded" (never
  claimed), or names a license type we can't verify.
- The footer license number remains the gated placeholder (`LIC# 000000000`)
  until Papo supplies the real number — it never renders as a real claim
  (existing guard).

**Recommendation.** Approve wording as implemented. When Papo provides the
actual license number/jurisdiction, put it in `site.ts` verbatim. If counsel
prefers maximal caution, swap the short badge to "Business-licensed & insured"
— one key in two catalogs (`Common.licensedInsured`).

---

## Bonus flags resolved in the same spirit (not gates, but same rule)

- **"5-star rated" hero chip + reviews-hero star glyphs: removed** — zero
  public reviews exist (verified); replaced with the *verified* chamber
  membership chip. Restore trivially once real reviews exist.
- **foundedYear 2021 → 2023** per Florida registry (LLC filed 2023-09-18);
  still on the owner-confirm list.
- **vid8 not published as-is** (baked-in Instagram overlay + copyrighted
  music credit): poster-only seam until the owner re-uploads a clean, muted
  original to unlisted YouTube.
