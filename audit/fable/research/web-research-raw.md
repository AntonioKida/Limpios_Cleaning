# Web research — Limpios Cleaning (raw notes)

Researcher: independent web sweep, no repo/internal sources used.
All access on **2026-07-06, ~07:45–08:10 (UTC-6)** via WebSearch + WebFetch (Claude Code).
Tooling notes: Google Maps, Yelp, Facebook (full), Instagram reels, Sunbiz direct, Bizapedia,
GovTribe, D&B, CorporationWiki, Mojeek, Startpage all block or JS-wall the fetcher; DuckDuckGo
HTML endpoint worked until CAPTCHA kicked in; Brave Search HTML worked. Snippets quoted verbatim
where captured.

---

## 1. Website — limpioscleaning.com

- URL: https://limpioscleaning.com/ — fetched 2026-07-06 ~07:47 and again ~07:52. **Page body renders empty to the fetcher** (client-side JS). Via r.jina.ai proxy (~08:00): "GoDaddy-hosted website with minimal content displayed… hidden iframes… landing page or placeholder." → Site is a **GoDaddy website-builder one-pager**.
- Sitemap https://limpioscleaning.com/sitemap.xml (~07:59): contains exactly **one URL: `https://limpioscleaning.com/lander`** (classic GoDaddy Airo/Website Builder pattern). `/lander` also renders empty to the fetcher.
- Content is indexed by search engines though. Search-snippet content attributed to limpioscleaning.com (Google via WebSearch ~07:45–07:50; Brave ~08:05):
  - Title tag: **"Professional Cleaning Solutions | Cleaning Specialists"**
  - "Limpios is based out of Minneola, FL. We provide services in Lake County and the surrounding areas. We are a certified Veteran Owned Business with the Small Business Administration." (verbatim from Brave snippet)
  - "28 years of military experience… proficient in logistics, attention to detail, and mission accomplishment" (Google snippet paraphrase)
  - "Limpios specializes in providing commercial cleaning services to businesses of all sizes, offering both daily cleaning and periodic deep cleaning services" (site: query snippet)
  - "committed to using environmentally-friendly cleaning products and methods to reduce carbon footprint"; "non-toxic and eco-friendly cleaning products"
  - "HEPA vacuums and microfiber cloths" (modern cleaning technology claim)
  - "also provide interior painting services, with **4 years of painting experience**"
  - Licensed and insured (claimed)
  - Contact: **(407) 680-2945**, **info@limpioscleaning.com**, **1683 N Hancock Rd Suite 103-272, Minneola, FL 34715**
- NOT observed on the site (couldn't render): pricing, testimonials, hours, staff names, ES-language content.
- Wayback Machine: fetch blocked by tooling ("unable to fetch from web.archive.org") — not checked.

## 2. Google Business Profile / Google Maps

- https://www.google.com/maps/search/Limpios+Cleaning+Minneola+FL (~07:55): only "Google Maps" heading renders; **JS required — listing not verifiable directly**.
- WebSearch "Limpios Cleaning Minneola Google Maps rating reviews hours" (~08:06): no GBP knowledge-panel data surfaced; no maps.google.com/g.co/maps.app.goo.gl link to a Limpios listing found in ANY query all session.
- Brave "Limpios Cleaning Minneola google reviews" (~08:07): only the Facebook page surfaced; no Google review data.
- **Finding (absence of evidence): no indexed trace of a Google Business Profile for Limpios Cleaning was found.** Either the GBP doesn't exist, is unverified/new, or simply isn't indexed — cannot distinguish without a JS browser. No Google rating/review count/hours/photos could be captured.

## 3. Facebook — facebook.com/LimpiosCleaningManagement

- Direct fetch (~07:47): login-walled; only page title visible: "Limpios Cleaning Management", "Minneola, FL".
- DDG snippet (~07:57): intro text verbatim: **"Veteran Owned and Operated, attention to detail, license and insured. Fair prices and committed to our customers."**
- DDG snippet (~08:03): "Page shows **55 likes** with active engagement." / Brave snippet (~08:07): "Minneola, Florida. **3 likes**." → **conflicting like-counts across cached snippets** (different snapshot dates, most likely; or page vs post likes). Unresolved.
- Brave snippet (~08:07), more page fields: tagline/CTA **"Sit back, relax, and we will do the cleaning"**; address 1683 N Hancock Rd Suite 103-272, Minneola, FL; phone (407) 680-2945; email info@limpioscleaning.com; website limpioscleaning.com; **price range "$$"**; **"Not yet rated (0 Reviews)"**.
- Google search snippet (~07:50) also reported FB "Not yet rated (0 Reviews)".
- Secondary URL seen in results: facebook.com/61556695352261/page_completion_meter/ (page ID 61556695352261 — an ID range from 2023+ era new pages).
- Post topics: not retrievable (login wall). One photos URL surfaced in results (photos/122299138946223178) but content not accessible.
- Owner's personal profile surfaced: **facebook.com/papo.noboa — "Papo Noboa — Owner of Limpios Cleaning Management"** (DDG snippet ~07:57; profile itself login-walled, not fetched).

## 4. Instagram — @limpioscleaning

- https://www.instagram.com/limpioscleaning/ fetched (~07:47) — public, rendered:
  - Display name: **Limpios Cleaning Management**
  - Bio: **"Central Florida Based Commercial Cleaning Services"** (a search snippet ~07:50 appended "Veteran Owned" to the bio text)
  - **79 followers / 175 following**; fetch showed ~13 visible posts; a search snippet claimed "72 posts" (unresolved discrepancy — 13 was 'visible in grid on first render', 72 may be the actual post count; treat post count as uncertain).
  - Link in bio: limpioscleaning.com
  - Content themes seen: **holiday/promotional graphics** (Independence Day, Mother's Day, Memorial Day), **service-demo videos** (light fixtures, window cleaning, office spaces), carousels of cleaning work. Imagery reads **commercial** (offices), not residential.
- Reel https://www.instagram.com/reel/DSRG_wUDT4a/ (~08:09): fetch returned only "Instagram" — not accessible.
- No post-construction content observed (not proof of absence; only grid previews seen).

## 5. South Lake Chamber of Commerce

- https://www.southlakechamber-fl.com/ (~07:53): confirmed the chamber serves "Clermont, Groveland, Mascotte, Minneola, Montverde, and Four Corners". Directory at /member-business-directory.
- /member-business-directory (~07:56): Webflow page showcasing **trustee-level members only** — Limpios not among them; no cleaning companies shown at that tier.
- **Members directory (GrowthZone subdomain)** https://members.southlakechamber-fl.com/list/category/cleaning-services-residential-commercial-668 (~07:58): **Limpios Cleaning Management IS a listed member** under category **"Cleaning Services: Residential & Commercial"** with address 1683 N Hancock Rd Suite 103-272, Minneola FL 34715 and phone 407-680-2945. No description/website/contact person in the listing. 12 members in category incl. Pink's Windows Orlando, C&J's Custom Cleaning, Clean Surface Solutions, English Laundry & Cleaners, Everything clean & Pressure Washing, Horizon West Cleaning Services, K & S Cleaning Services, **Mean to Clean** (a separate company — an earlier compressed snippet made "Mean to Clean" look like a Limpios tagline; it is NOT), Sagecraft, Southern Green, Testerman's Pro Wash.
- **Best of South Lake 2026** (chamber-affiliated contest, thebestofsouthlake.com):
  - Nominee page https://www.thebestofsouthlake.com/contender/38994/limpios-cleaning-management (~07:58): category **"Best Cleaning Services" 2026**; listing **claimed and verified** by the business; self-description verbatim: **"We are a Commercial Cleaning Company. We provide commercial cleaning solutions throughout Lake County and surrounding areas. We also provide Move out cleaning services for Property Managers."** Links to FB + IG only — **no website URL given on the nominee page**. No vote counts / winner status shown.
  - Category page https://www.thebestofsouthlake.com/category/10348/best-cleaning-services (~08:07): 7 contenders: Southern Green, K & S, Mean to Clean, **Limpios Cleaning Management**, Pink's Windows Orlando, C&J's Custom Cleaning, Janitouch. Limpios tagged "South Lake Chamber Member".

## 6. Business registries (Sunbiz etc.)

- search.sunbiz.org direct: **HTTP 403 to fetcher** (~07:48) — checked via aggregators + search snippets instead.
- **Fictitious name:** Bizapedia (bizapedia.com/fl/limpios-cleaning-management.html, snippet ~07:57; page itself behind security check ~07:58): "LIMPIOS CLEANING MANAGEMENT … **Assumed Name** organized under the laws of the State of Florida. The business was **filed on October 14, 2023** and is currently listed as **Active**."
- **Legal entity: JUDEAN SERVICES LLC** —
  - D&B snippet (~08:01): "JUDEAN SERVICES LLC … Doing Business As: LIMPIOS CLEANING MANAGEMENT … key principal HUBERT C NOBOA".
  - BisProfiles https://bisprofiles.com/fl/judean-services-l23000434299 (fetched ~08:04): Florida LLC, **document L23000434299**, **filed September 18, 2023**, **Active**, principal address 1683 North Hancock Road, Minneola FL 34715 (mailing same), **Registered Agent: Hubert C Noboa** (Minneola 34715), **Officer: Hubert C Noboa, President**, **FEI/EIN 93-3720885**, annual reports filed 2024-02-19 and 2025-02-16.
  - Sunbiz record exists (search.sunbiz.org SearchResultDetail URL surfaced in DDG snippet ~08:02 with matching doc number + address).
- **Federal vendor trace:** GovTribe https://govtribe.com/vendors/judean-services-llc-9qb60 (page 403; DDG snippet ~08:02): "Primary NAICS Category **561720 — Janitorial Services**" → implies a SAM.gov registration exists. No federal contract awards surfaced. SBA VetCert status **not independently verifiable** (VetCert search is JS-only; WebSearch found nothing specific ~08:08).
- CorporationWiki (corporationwiki.com/p/3g7xg2/hubert-noboa): 403 — other Noboa entities unchecked.
- Note: the address "Suite 103-272" at 1683 N Hancock Rd is a **UPS Store / mailbox-suite pattern** (inference from format; not verified).

## 7. Other mentions / absences

- **Yelp:** https://www.yelp.com/biz/limpios-minneola exists (403 to fetcher, ~07:52). SERP title (Google ~07:50, Brave ~08:07): "LIMPIOS - Updated August 2025 - Request a Quote - Minneola, Florida - **Office Cleaning** - Phone Number". No star rating or review count appears in any snippet → very likely **0 reviews** (inference). "Request a Quote" enabled.
- **City of Clermont business directory (third-party "CFBD", cityofclermontflorida.com — NOT the official clermontfl.gov):** listing exists at /listing/limpios-cleaning-management/ (403 direct, ~07:58). DDG snippets (~07:57, ~08:03): "Veteran-owned small business" specializing in "commercial cleaning services" across **Lake and Orange County**; verbatim: "Keep your business spotless and professionally maintained with Limpios Cleaning Management. We specialize in high-quality commercial cleaning services designed to meet the unique needs of your workspace."
- **BBB:** appears in bbb.org Clermont/Minneola cleaning-category SERPs, but no dedicated BBB profile for Limpios found.
- **Thumbtack / Angi / HomeAdvisor / Nextdoor:** no listings found (searches ~07:50–08:06). The similarly-named **"Limpio Services, LLC" (Lakeland, Polk County)** and "Limpio House Cleaning" (Norfolk VA) are **different companies** — easy to conflate, ruled out by address/phone.
- **Phone reverse search** "(407) 680-2945" (~08:09): no third-party directory hits — the number's citation footprint is limited to the sources above.
- **News/press:** none found.

## Cross-source consistency

- NAP identical everywhere found (site, FB, chamber, Best of South Lake, LLC registry): Limpios Cleaning Management / 1683 N Hancock Rd Suite 103-272, Minneola FL 34715 / (407) 680-2945. **Consistent.**
- Timeline coheres: LLC 2023-09-18 → DBA 2023-10-14 → FB page ID era 2023/24 → chamber member + 2026 award nominee.
- "Veteran owned" claimed on site, FB, IG (snippet), Clermont directory. SBA certification claimed **only on the website**; not externally corroborated.
- Emphasis is uniformly **commercial** (office cleaning, businesses, property-manager move-outs) except the chamber category which is the generic "Residential & Commercial" bucket. Interior painting mentioned only on the website.
