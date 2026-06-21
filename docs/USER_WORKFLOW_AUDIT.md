# Limpios Cleaning — User Workflow & Information‑Architecture Audit

**Auditor:** Senior UX Engineer
**Method:** Playwright crawl → in‑locale link graph → BFS click‑depth from home; conversion‑path and journey analysis
**Scope:** EN locale graph (22 reachable pages); ES mirrors the structure 1:1
**Data:** `audit/results.json` → `graph` (adjacency, depth, inbound/outbound)

---

## 1. Executive summary

The information architecture is **flat, fully connected, and conversion‑oriented**.

| Metric | Value |
|---|---|
| Reachable pages from home | **22 / 22** (no orphans) |
| **Maximum click‑depth** | **2** |
| Pages at depth 1 (one click from home) | **19 of 22** |
| Pages at depth 2 | 2 (Montverde, Mascotte — non‑featured cities) |
| Conversion (quote) reachable from | **every page in 0–1 clicks** (persistent header CTA + click‑to‑call) |
| Typical inbound links / page | **21** (global footer + header) |
| Home outbound (in‑locale) | 19 internal page targets (54 total anchors incl. repeats) |
| Orphan / dead‑end pages | **none** |

**Verdict:** textbook small‑site IA. Nothing of value is more than two clicks away, the primary conversion action is omnipresent, and the global header/footer give every page a strong inbound link profile. The only weak nodes are the two non‑featured city pages (by design — long‑tail SEO landing pages).

---

## 2. Methodology

For each page the crawler captured every `<a href>`. We kept **in‑locale internal** links (`/en/*`), normalized (stripped `#`/`?`, trailing slash), removed self‑links, built an adjacency map over the 22 valid pages, then ran **breadth‑first search from `/en`** to compute click‑depth. Inbound = number of distinct pages linking to a node; outbound = distinct in‑locale targets.

> “Clicks away” counts shortest navigational path via visible links. The persistent header (Services, Service Areas, Pricing, About, Reviews + Quote CTA) and footer (all services, featured areas, company, contact) mean most depth‑1 numbers are driven by global chrome, which is exactly what you want for both users and crawlers.

---

## 3. Site map (information architecture)

```
/ (Home)
├─ Services (hub)
│  ├─ Residential
│  ├─ Commercial
│  ├─ Deep cleaning
│  ├─ Move‑in / move‑out
│  ├─ Post‑construction
│  └─ Interior painting
├─ Service Areas (hub)
│  ├─ Clermont · Minneola · Groveland · Winter Garden · Horizon West · Four Corners   (featured)
│  └─ Montverde · Mascotte                                                            (non‑featured)
├─ Pricing
├─ About
├─ Reviews
├─ Contact
└─ Quote   (also opens as a modal from any CTA)
+ Localized 404 + catch‑all; sitemap.xml / robots.txt
```

Two clean hub‑and‑spoke clusters (Services, Service Areas) hang off a flat top level. Every node also carries the global header + footer, so the graph is dense rather than strictly hierarchical.

---

## 4. Click‑depth analysis

| Page | Depth | Inbound | Outbound |
|---|---|---|---|
| Home | 0 | 21 | 19 |
| Services hub | 1 | 21 | 19 |
| Service Areas hub | 1 | 21 | 21 |
| Pricing | 1 | 21 | 19 |
| About | 1 | 21 | 19 |
| Reviews | 1 | 21 | 19 |
| Contact | 1 | 21 | 19 |
| Quote | 1 | 21 | 19 |
| Residential / Commercial / Deep / Move‑in‑out / Post‑construction / Interior painting | 1 | 21 | 19 |
| Clermont / Minneola / Groveland / Winter Garden / Horizon West / Four Corners | 1 | 21 | 19–20 |
| **Montverde** | **2** | **4** | 20 |
| **Mascotte** | **2** | **2** | 20 |

**Reading:** 19/22 pages are a single click from home (because they live in the header and/or footer). The 6 service pages are reachable directly from the footer “Services” column; the 6 featured cities from the footer “Service Areas” column. Montverde and Mascotte aren’t in the footer shortlist, so they sit one level deeper (reached via the Service‑Areas hub or a “nearby areas” link).

- Inbound to **Montverde** (4): Service‑Areas hub + Clermont, Minneola, Winter Garden (their “nearby areas”).
- Inbound to **Mascotte** (2): Service‑Areas hub + Groveland.

---

## 5. Internal‑linking analysis

**Hubs / strong nodes:** the **global footer** is the workhorse — it links to all 6 services, 6 featured cities, the 4 company pages, and contact from **every** page, giving most nodes 21 inbound links. The **Service Areas hub** has the highest outbound (21) because it lists all 8 cities. Home links broadly across services, areas, pricing, reviews, about, and the quote.

**Cross‑linking depth:**
- Service detail pages → related services (2–3) + global FAQ + quote CTA (prefilled with that service).
- City pages → all 6 services (so a city visitor can convert into any service) + “nearby areas” + a city‑scoped quote CTA.
- This creates a healthy mesh: service ↔ area ↔ quote, which is excellent for local SEO and for letting users pivot between “what” and “where.”

**Weak nodes (by design):** Montverde (4 inbound) and Mascotte (2 inbound). These are long‑tail local‑SEO pages. They’re reachable and indexed (in the sitemap), just not promoted.

**No dead ends:** every page ends with a CTA band linking onward (quote) and carries the full footer, so there are no terminal pages.

---

## 6. Conversion‑path / CTA reachability

The primary conversion (request a quote) is **reachable from every page in 0–1 clicks**, three redundant ways:

1. **Persistent header** “Get a free quote” (orange) — on every page, desktop and mobile (in the sheet). → opens the quote modal in place (**0 navigation clicks**) or, without JS, links to `/quote` (**1 click**).
2. **Click‑to‑call** in the header (and footer, hero, CTA bands) — **0 clicks**, immediate `tel:` action.
3. **Repeated CTA band** near the bottom of every page + section CTAs.

Secondary paths reinforce intent:
- Service pages’ CTA **prefills the quote** with that service (`/quote?service=…` or modal default), shortening the form.
- Pricing tier CTAs map to the relevant service and prefill likewise.
- City pages offer a city‑scoped “Get a free quote in {city}”.

**Funnel summary:** Home/any page → (CTA, 0–1 click) → Quote wizard (4 short steps) → success. The shortest convert path is effectively **one interaction** from anywhere. Phone conversion is **zero‑click** (tap‑to‑call).

---

## 7. Key user‑journey walkthroughs

| Journey | Path | Clicks |
|---|---|---|
| “I want a quote, now” (any entry) | Header CTA → modal → submit | 1 (+ form) |
| “Call them” | Header phone (tap‑to‑call) | 0 |
| Homeowner → recurring residential | Home → Services card *Residential* → CTA (prefilled) | 2 → quote |
| “Do they serve Clermont?” | Home → footer *Clermont* (or Service Areas → Clermont) → city CTA | 1–2 |
| Price‑checker | Home → header *Pricing* → tier CTA (prefilled) | 1 → quote |
| Trust‑checker | Home → *About* (veteran story) and/or *Reviews* | 1 each |
| Bilingual visitor | Any page → language toggle (EN⇄ES) preserves the exact path | 1, no dead‑ends |
| Move‑out renter in Groveland | Home → Service Areas → *Groveland* → *Move‑in/out* (services list) → CTA | 2–3 |

Every journey terminates at a quote or a call within ≤3 clicks; most within 1–2.

---

## 8. Cross‑locale workflow

The ES tree mirrors EN 1:1; the **language toggle preserves the current path** (e.g., `/en/services/deep-cleaning` ⇄ `/es/services/deep-cleaning`) via real, crawlable locale‑aware links, and each page emits `hreflang` (en/es/x‑default). There are **no locale dead‑ends** — a user can switch language anywhere without being bounced to the homepage.

---

## 9. Findings & recommendations

**Strengths to preserve**
- Flat IA (max depth 2), zero orphans, omnipresent conversion CTA, dense footer cross‑linking, service↔area↔quote mesh, prefilled quote paths, lossless language switching.

**Recommendations**

| Priority | Recommendation |
|---|---|
| **P1** | **Lift the two depth‑2 cities.** If Montverde/Mascotte are real target markets, add them to the footer “Service Areas” shortlist (makes them depth‑1 with ~21 inbound) or add reciprocal “nearby areas” links. If they’re purely long‑tail SEO, leave as‑is — current state is fine. |
| **P2** | **Breadcrumbs UI.** BreadcrumbList JSON‑LD already ships on service pages; consider a *visible* breadcrumb on service/city detail pages to reinforce the hub relationship for users (currently only a single “← All services / All areas” back link). |
| **P2** | **Cross‑sell area↔service links on detail pages.** Service pages could list “Available in {top cities}” and city pages already list services — tightening this two‑way mesh further helps both UX and local SEO. |
| **P3** | **Sticky mobile quote bar.** Optional: a persistent bottom “Get a quote / Call” bar on mobile content pages can lift conversion (the header CTA already covers this, so this is incremental). |
| **P3** | **Footer “Quote” link.** Quote is reachable via every CTA but isn’t a footer text link; adding it to the footer “Company” column gives it an explicit, crawlable inbound from the footer too. |

**Bottom line:** the navigation model is excellent for a local‑service marketing site — shallow, fully connected, and engineered so the money action (quote/call) is never more than a click (or a tap) away. The only structural nuance is the two intentionally‑deprioritized city pages, which is a strategy decision, not a defect.
