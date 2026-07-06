# Sub-agents 04 — audit fan-out (5 role walkthroughs + integrity verifier)

Six general-purpose agents ran in parallel against the production build on
http://localhost:3000 (curl-based; no source modification except each agent's
own report file). Full task definitions were per-persona variants of: "role-play
buyer X, walk landing → offer → trust → estimate path, quote the copy that
convinced/lost you with paths, judge messaging/proof/friction/missing,
distinguish site-fix vs owner-decision, write the first-person report +
P1/P2/P3 findings table to docs/fable-audit/20-role-flows/<role>.md, return
compact findings." The integrity agent verified 9 technical checks with an
evidence log to audit/fable/integrity-verification.md.

Their full reports are committed under docs/fable-audit/20-role-flows/ and
audit/fable/integrity-verification.md. Compact returns, verbatim:

## Property manager (agent a486bb…)
> Verdict: messaging genuinely speaks to property managers … and earns the
> phone call — but the estimate form fights portfolio buyers at steps 2–3, and
> every vendor-onboarding question (COI, W-9, terms, SLA, verifiable reviews,
> real license) is left to the phone.
Findings: P1 placeholder license footer · P2 no per-turnover frequency ·
P2 no portfolio-scale capture · P2 no visible company field (honeypot name
collision) · P2 no COI language · P2 no vendor paperwork signals · P2 dead
"Leave a review" g.page link · P2 no turnover SLA · P3 photo-doc promised but
unconfirmed · P3 "Call or text-free line" garbled · P3 8 quote options dilute
· P3 no PM landing page · P3 repeat-walkthrough economics unexplained.

## Construction company (agent acb922…)
> Would call, cautiously. … nothing on the site survives a GC's vendor-packet
> checklist without a phone call, and the walkthrough-per-job pricing model
> has no answer for 25 similar homes/year.
Findings: P1 no COI/insurance detail · P1 no volume/repeat pricing story ·
P2 license placeholder · P2 frequency can't express "2–3 homes/month" ·
P2 rough-vs-final undefined, haul-off ambiguous · P2 no capacity/lead-time ·
P3 residential-toned gallery under B2B hero · P3 window residue "on request"
framing · P3 only builder testimonial is placeholder · P3 "text-free line" ·
P3 no company field.

## Commercial business (agent a9927f…)
> This buyer would call — commercial positioning is genuinely strong … but two
> P1s nearly cost the call.
Findings: P1 frequency mismatch (no nightly/2-3×) · P1 LIC# placeholder ·
P2 no night-access trust content (keys/alarms/QC) · P2 no company field ·
P2 residential-skewed proof · P2 insurance asserted not substantiated ·
P2 zero real social proof · P3 contract terms absent · P3 bedrooms shown to
offices · P3 "text-free line" · P3 hours vs after-hours unreconciled ·
P3 FAQ answers not SSR'd (accordion).

## HOA board member (agent ada4c0…)
> HOA repositioning is real but thin — HOAs are named but not served (no
> amenity scope, no board documents). … the vendor loses the board vote on
> paperwork, not price.
Findings: P1 no proof-of-insurance path · P1 license placeholder · P2 HOA card
→ generic commercial page · P2 frequency mismatch · P2 no board-quotable proof
· P3 bedrooms after selecting HOA type · P3 Horizon West copy thin on
community language · P3 weak commercial before/after · P3 PM-only reporting
promise.

## Homeowner (agent a158e1…)
> The demoted residential pages themselves respect a homeowner and the quote
> form fits a house end-to-end — but the route to them depends on one lucky
> click on "Services." No dead ends found; the failures are signposting.
Findings: P2 zero homepage breadcrumb to homes · P2 city pages misfire for
homeowner queries + FALSE "Every service available" claim · P2 circular
demotion copy · P2 pricing page erases homes + biweekly omission · P3 FAQ
intro mislabels · P3 walkthrough proportionality (owner) · P3 reverse
inconsistency: residential-toned gallery + kids/pets FAQ under B2B hero ·
P3 no owner-occupied sample voice · P3 no nightly option (symmetry).

## Integrity verifier (agent ad4246…)
> 9/9 PASS (sitemap/robots · metadata · JSON-LD incl. memberOf + NAP ·
> honesty gates · zero price anchors · i18n runtime + tests · media wiring ·
> TODO leakage · link crawl). Caveat: "5 out of 5 stars" persists only as the
> aria-label of the disclaimed sample review cards.

## Disposition
Every finding above was triaged in docs/fable-audit/50-findings.md: 17 fixed
in code (F1–F17), 6 accepted with rationale (A1–A6), remainder routed to the
OWNER bucket (FABLE_FINAL_REPORT §7).
