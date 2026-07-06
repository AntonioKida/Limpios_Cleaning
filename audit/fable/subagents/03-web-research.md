# Sub-agent 03 — independent web research (general-purpose, web tools)

## Task definition (summary of verbatim prompt)

> Independently research the real business Limpios Cleaning ("Limpios Cleaning
> Management"), Lake County FL, owner "Papo". Do NOT assume the prompt is
> accurate — verify. Sources: Google Business Profile/Maps, Facebook page,
> Instagram @limpioscleaning, South Lake Chamber directory, Sunbiz/registries,
> Yelp/Thumbtack/Angi/Nextdoor/news, limpioscleaning.com. Record per-source
> findings with URLs + timestamps, including inaccessible sources (absence of
> evidence is a finding). Distinguish verified vs inferred. Write RAW notes to
> audit/fable/research/web-research-raw.md; return a structured summary with
> confidence levels.

## Raw return (verbatim)

(All accessed 2026-07-06, ~07:45–08:10 UTC-6.)

**1. Google Business Profile / Maps — NOT FOUND (key negative finding).**
Google Maps requires JS and couldn't be rendered; more tellingly, no query in
the entire session surfaced any indexed trace of a GBP (no maps link, rating,
hours, or knowledge panel). Either no GBP exists, or it's unverified/too new to
index. No Google reviews could be captured. Confidence in "no visible GBP
footprint in search": high; in "GBP does not exist at all": medium.

**2. Facebook — facebook.com/LimpiosCleaningManagement (verified via cached
snippets; page itself login-walled).** Name "Limpios Cleaning Management",
Minneola FL. Intro verbatim: "Veteran Owned and Operated, attention to detail,
license and insured. Fair prices and committed to our customers." Tagline:
"Sit back, relax, and we will do the cleaning." Price range "$$", email
info@limpioscleaning.com, phone (407) 680-2945, links to limpioscleaning.com.
"Not yet rated (0 Reviews)" in two independent snippets. Like-count conflicting
(3 vs 55) — small either way.

**3. Instagram @limpioscleaning (fetched directly, public).** Display name
"Limpios Cleaning Management"; bio: "Central Florida Based Commercial Cleaning
Services" (+"Veteran Owned" per one snippet). 79 followers, 175 following;
post count uncertain (~13 visible, one snippet said 72). Content:
holiday/promo graphics, service-demo videos (light fixtures, windows, office
spaces), work carousels. Imagery is commercial/office — no residential or
post-construction content observed.

**4. South Lake Chamber — VERIFIED MEMBER.** Listed on the chamber's
GrowthZone directory (members.southlakechamber-fl.com) under "Cleaning
Services: Residential & Commercial" with matching NAP. Also a claimed-and-
verified nominee for "Best Cleaning Services" in the chamber-affiliated Best
of South Lake 2026 contest, self-described verbatim: "We are a Commercial
Cleaning Company. We provide commercial cleaning solutions throughout Lake
County and surrounding areas. We also provide Move out cleaning services for
Property Managers." Nominee page links FB+IG but no website. ("Mean to Clean"
is a competitor in the category, not a Limpios tagline.)

**5. Registries — legal identity established (high confidence, multi-source).**
Legal entity JUDEAN SERVICES LLC, Florida LLC L23000434299, filed 2023-09-18,
Active, FEI 93-3720885, annual reports 2024 & 2025; Hubert C. Noboa is
President and Registered Agent — facebook.com/papo.noboa is captioned "Owner of
Limpios Cleaning Management", so "Papo" = Hubert C. Noboa (high confidence).
"LIMPIOS CLEANING MANAGEMENT" is an Active Florida fictitious name filed
2023-10-14 (Bizapedia). GovTribe lists the LLC with NAICS 561720 Janitorial
Services (implies SAM.gov registration; no federal awards found). Address
1683 N Hancock Rd "Suite 103-272", Minneola FL 34715 likely a mailbox suite
(inference). Sunbiz direct fetch 403'd; corroborated via BisProfiles + D&B +
Sunbiz SERP snippet.

**6. Other.** Website limpioscleaning.com is a JS-only GoDaddy one-pager
(sitemap = single `/lander` URL; unrenderable to fetchers — an SEO liability).
Its indexed copy claims: certified Veteran Owned Business with the SBA, 28
years of military experience, licensed & insured, eco-friendly/non-toxic
products, HEPA vacuums/microfiber, commercial cleaning for "businesses of all
sizes" (daily + periodic deep cleaning), plus interior painting (4 years'
experience). Yelp listing exists (yelp.com/biz/limpios-minneola, category
"Office Cleaning") with no rating — likely 0 reviews. City of Clermont
directory: veteran-owned, commercial cleaning across Lake and Orange County.
Nothing on Thumbtack/Angi/HomeAdvisor/Nextdoor/BBB/news. Look-alikes ruled
out: "Limpio Services" (Lakeland), "Limpio House Cleaning" (Norfolk VA).

## Independent picture

A very young (est. Sept–Oct 2023), one-principal, veteran-owned commercial
cleaning micro-business run by Hubert "Papo" C. Noboa from Minneola, FL
(mailbox-suite address), serving Lake County + surrounding areas. Presents
consistently as commercial-first — office/janitorial plus move-out cleans for
property managers — with interior painting as a side service, leaning on the
veteran identity. Real legitimacy-building (active LLC, chamber membership,
award nomination, SAM/NAICS) but an almost nonexistent review footprint
(0 reviews everywhere found), tiny social following (~79 IG / ≤55 FB), no
discoverable GBP, and a website search engines can barely read. NAP fully
consistent across all sources.

## Confidence table

| Claim | Confidence |
|---|---|
| Judean Services LLC (L23000434299), DBA Limpios Cleaning Management, Active | High |
| Owner/president/agent: Hubert C. Noboa = "Papo" | High |
| NAP: 1683 N Hancock Rd Ste 103-272, Minneola FL 34715 / (407) 680-2945 / info@limpioscleaning.com | High |
| Commercial-cleaning emphasis; move-outs for property managers; Lake County + surrounding | High |
| Chamber member; Best of South Lake 2026 nominee | High |
| Veteran-owned | Medium-high |
| SBA VetCert certification | Low-medium (website claim only) |
| Zero reviews on Google/Facebook/Yelp | Medium-high |
| No Google Business Profile exists | Medium |
| Interior painting service (4 yrs experience) | Medium (website snippet only) |
| Address is a mailbox suite | Medium (inference) |

Sources: limpioscleaning.com · facebook.com/LimpiosCleaningManagement ·
instagram.com/limpioscleaning · members.southlakechamber-fl.com (category 668) ·
thebestofsouthlake.com/contender/38994 + /category/10348 ·
bisprofiles.com/fl/judean-services-l23000434299 ·
bizapedia.com/fl/limpios-cleaning-management.html ·
govtribe.com/vendors/judean-services-llc-9qb60 · yelp.com/biz/limpios-minneola ·
cityofclermontflorida.com/listing/limpios-cleaning-management ·
southlakechamber-fl.com. Raw notes: audit/fable/research/web-research-raw.md.
