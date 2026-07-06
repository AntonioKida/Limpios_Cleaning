# Technical Integrity Verification — Post-Repositioning

- **Date:** 2026-07-06
- **Target:** http://localhost:3000 (production build, `npm run build && start`)
- **Verifier:** Fable 5 (read-only; no source files modified)
- **Method:** `curl` of rendered HTML into scratchpad, script-stripped "visible HTML" analysis (RSC `self.__next_f` payloads excluded where noted), `npm test` for parity.

## Result summary

| # | Check | Result |
|---|-------|--------|
| 1 | Sitemap + robots | **PASS** |
| 2 | Metadata (5 pages) | **PASS** |
| 3 | JSON-LD (home + window-cleaning) | **PASS** |
| 4 | Honesty gate (reviews disclaimer / no aggregateRating / no 5-star chip) | **PASS** (with a11y-label caveat, see 4.3) |
| 5 | Price anchors ($ + digits) | **PASS** |
| 6 | i18n parity (runtime + tests) | **PASS** |
| 7 | New media wiring | **PASS** |
| 8 | No TODO leakage | **PASS** |
| 9 | Internal links on /en | **PASS** (22/22 → 200) |

All pages fetched returned HTTP 200 at fetch time:

```
sitemap.xml -> 200 (18327 bytes)      robots.txt -> 200 (123 bytes)
en -> 200 (373897)   es -> 200 (379747)
en/pricing -> 200    es/pricing -> 200
en/reviews -> 200    en/about -> 200   es/about -> 200
en+es /services/{carpet-cleaning,commercial,deep-cleaning,interior-painting,
                 move-in-out,post-construction,residential,window-cleaning} -> all 200
```

---

## 1. Sitemap + robots — PASS

`curl http://localhost:3000/sitemap.xml` → 200, 48 `<url>` entries.

**New service routes present in both locales, each with en/es hreflang alternates:**

```xml
<url>
<loc>https://limpioscleaning.com/en/services/window-cleaning</loc>
<xhtml:link rel="alternate" hreflang="en" href="https://limpioscleaning.com/en/services/window-cleaning" />
<xhtml:link rel="alternate" hreflang="es" href="https://limpioscleaning.com/es/services/window-cleaning" />
<lastmod>2026-07-06T14:45:50.580Z</lastmod>
<changefreq>monthly</changefreq>
<priority>0.8</priority>
</url>
```
(identical structure for `/es/services/window-cleaning`, `/en/services/carpet-cleaning`, `/es/services/carpet-cleaning`)

**Demoted services still present (routes remain live):**

```
<loc>https://limpioscleaning.com/en/services/residential</loc>
<loc>https://limpioscleaning.com/es/services/residential</loc>
<loc>https://limpioscleaning.com/en/services/deep-cleaning</loc>
<loc>https://limpioscleaning.com/es/services/deep-cleaning</loc>
<loc>https://limpioscleaning.com/en/services/interior-painting</loc>
<loc>https://limpioscleaning.com/es/services/interior-painting</loc>
```

**robots.txt (sane — allows all, blocks /api/, declares sitemap):**

```
User-Agent: *
Allow: /
Disallow: /api/

Host: https://limpioscleaning.com
Sitemap: https://limpioscleaning.com/sitemap.xml
```

---

## 2. Metadata — PASS

Extracted from rendered `<head>` of each page. No `$<digit>` price figures in any title or description. Titles/descriptions lead with commercial/B2B + Central Florida positioning. (Note: `hrefLang` attribute casing is React's camelCase serialization — HTML attributes are case-insensitive, valid.)

### /en
```
TITLE:     Commercial Cleaning in Central Florida | Veteran-Owned
DESC:      Limpios Cleaning Management — veteran-owned commercial cleaning across Central
           Florida, based in Lake County. Offices, post-construction, move-outs, windows
           and carpets. Licensed, insured and bilingual. Free walkthrough & estimate.
CANONICAL: https://limpioscleaning.com/en
HREFLANG:  <link rel="alternate" hrefLang="en" href="https://limpioscleaning.com/en"/>
           <link rel="alternate" hrefLang="es" href="https://limpioscleaning.com/es"/>
           <link rel="alternate" hrefLang="x-default" href="https://limpioscleaning.com/en"/>
OG:IMAGE:  https://limpioscleaning.com/en/opengraph-image?6c012b306d5dec82  (endpoint → 200 image/png)
PRICES:    none
```

### /es
```
TITLE:     Limpieza Comercial en Florida Central | Empresa de Veterano
DESC:      Limpios Cleaning Management — limpieza comercial en toda Florida Central, con base
           en el condado de Lake y propiedad de un veterano. Oficinas, post-construcción,
           mudanzas, ventanas y alfombras. Con licencia, asegurados y bilingües. Visita y
           presupuesto gratis.
CANONICAL: https://limpioscleaning.com/es
HREFLANG:  en → /en, es → /es, x-default → /en
OG:IMAGE:  https://limpioscleaning.com/es/opengraph-image?6c012b306d5dec82
PRICES:    none
```

### /en/services/window-cleaning
```
TITLE:     Window cleaning | Limpios Cleaning Management
DESC:      Window cleaning in Central Florida — storefronts, offices and homes. Glass, frames,
           sills and tracks, streak-free. Licensed & insured. Free walkthrough and estimate.
CANONICAL: https://limpioscleaning.com/en/services/window-cleaning
HREFLANG:  en → /en/services/window-cleaning, es → /es/services/window-cleaning,
           x-default → /en/services/window-cleaning
OG:IMAGE:  https://limpioscleaning.com/en/opengraph-image
PRICES:    none
```

### /es/services/carpet-cleaning
```
TITLE:     Limpieza de alfombras | Limpios Cleaning Management
DESC:      Limpieza de alfombras en Florida Central — oficinas, áreas comunes y casas. Líneas
           de tráfico, manchas y olores a cargo de un equipo asegurado. Presupuesto gratis.
CANONICAL: https://limpioscleaning.com/es/services/carpet-cleaning
HREFLANG:  en → /en/services/carpet-cleaning, es → /es/services/carpet-cleaning,
           x-default → /en/services/carpet-cleaning
OG:IMAGE:  https://limpioscleaning.com/es/opengraph-image
PRICES:    none
```

### /en/pricing
```
TITLE:     Pricing — Free Walkthrough & Estimate | Limpios Cleaning Management
DESC:      No flat rates and no surprises: your price is built from a free walkthrough of your
           space — square footage, scope, condition and crew. Get a written estimate at no cost.
CANONICAL: https://limpioscleaning.com/en/pricing
HREFLANG:  en → /en/pricing, es → /es/pricing, x-default → /en/pricing
OG:IMAGE:  https://limpioscleaning.com/en/opengraph-image
PRICES:    none
```

---

## 3. JSON-LD — PASS

### /en homepage (`application/ld+json` blocks: LocalBusiness, FAQPage)

LocalBusiness (key fields verbatim):

```json
{
 "@type": "LocalBusiness",
 "@id": "https://limpioscleaning.com/#business",
 "name": "Limpios Cleaning Management",
 "telephone": "+14076802945",
 "email": "info@limpioscleaning.com",
 "priceRange": "$$",
 "address": {
  "@type": "PostalAddress",
  "streetAddress": "1683 N Hancock Rd, Suite 103-272",
  "addressLocality": "Minneola",
  "addressRegion": "FL",
  "postalCode": "34715",
  "addressCountry": "US"
 },
 "areaServed": [
  {"@type":"City","name":"Clermont"}, {"@type":"City","name":"Minneola"},
  {"@type":"City","name":"Groveland"}, {"@type":"City","name":"Winter Garden"},
  {"@type":"City","name":"Horizon West"}, {"@type":"City","name":"Four Corners"},
  {"@type":"City","name":"Montverde"}, {"@type":"City","name":"Mascotte"}
 ],
 "memberOf": {
  "@type": "Organization",
  "name": "South Lake Chamber of Commerce",
  "url": "https://www.southlakechamber-fl.com/"
 }
}
```

- `memberOf` South Lake Chamber: **present** ✔
- NAP: phone `+14076802945` ✔, address `1683 N Hancock Rd, Suite 103-272, Minneola FL 34715` ✔
- `areaServed` cities: **present** (8 cities) ✔
- `aggregateRating`: **absent** — `grep -il aggregateRating *.html` over all 23 fetched pages → `NONE FOUND` ✔
- (`priceRange: "$$"` is a schema.org relative band, not a published price figure.)

### /en/services/window-cleaning — Service + FAQPage + BreadcrumbList all present and coherent

```json
{"@type":"Service","serviceType":"Window cleaning","name":"Window cleaning",
 "url":"https://limpioscleaning.com/en/services/window-cleaning",
 "provider":{"@type":"LocalBusiness","@id":"https://limpioscleaning.com/#business",
   "telephone":"+14076802945",
   "address":{"streetAddress":"1683 N Hancock Rd, Suite 103-272","addressLocality":"Minneola",
              "addressRegion":"FL","postalCode":"34715"}},
 "areaServed":{"@type":"State","name":"Florida"}}
```
```json
{"@type":"BreadcrumbList","itemListElement":[
 {"position":1,"name":"Home","item":"https://limpioscleaning.com/en"},
 {"position":2,"name":"Services","item":"https://limpioscleaning.com/en/services"},
 {"position":3,"name":"Window cleaning","item":"https://limpioscleaning.com/en/services/window-cleaning"}]}
```
FAQPage: 7+ Question/acceptedAnswer pairs (pricing, walkthrough, areas, licensing, eco products, supplies, satisfaction). Provider `@id` matches the homepage LocalBusiness `@id` — coherent graph. ✔

---

## 4. Honesty gate — PASS (with one a11y-label caveat)

**4.1 Sample-reviews disclaimer on /en/reviews — present (visible copy):**

```
Note: the reviews shown are sample placeholders for design purposes and are not real
customer reviews. They will be replaced with verified Google reviews before launch.
```
The same disclaimer also renders visibly on the /en homepage testimonials section (1 visible occurrence).

**4.2 No aggregateRating anywhere:**

```
$ grep -il 'aggregateRating' *.html   # all 23 fetched pages (en+es, all routes)
NONE FOUND
```

**4.3 "5-star" / "5 star" on /en:**

- Hero: H1 = `Commercial cleaning your business can count on`; **no rating chip** in hero — the unsubstantiated chip is confirmed gone.
- Visible `5-star` (hyphenated): **0** occurrences.
- Visible "Rated …" summary copy: **0** occurrences.
- Caveat: the literal substring `5 star` matches 3 times in visible HTML, but every match is inside the accessibility attribute `aria-label="5 out of 5 stars"` on the star-icon rows of the three sample review cards (section "What Central Florida says" — the same section that carries the visible sample-reviews disclaimer). This is an a11y label describing the sample cards' star graphics, not marketing copy, and no rating claim is rendered as text:

```
...<span class="inline-flex items-center gap-0.5" role="img"
   aria-label="5 out of 5 stars"><svg ...
```

Verdict: the intent of the check (unsubstantiated hero chip removed, no rating claims in copy) is satisfied. If a zero-tolerance literal reading is required, the remaining surface is the `aria-label` on the disclaimed sample cards' star icons.

---

## 5. Price anchors — PASS (zero published prices)

Raw grep of `\$[0-9]` over all 23 fetched pages produced matches (e.g. `$1 $14 $16 $28 …`), but **100% of them live inside `<script>` RSC flight payloads** — they are React Server Component reference tokens (`"$1"`, `"$L14"`, `"$undefined"`), not prices.

After stripping all `<script>` blocks (visible HTML only):

```
=== $digit in VISIBLE (script-stripped) HTML ===
NONE
```

Checked pages: `/en`, `/es`, `/en/pricing`, `/es/pricing`, `/en/reviews`, `/en/about`, `/es/about`, and all 8 `/en/services/*` + all 8 `/es/services/*`. **Zero published price figures anywhere.**

---

## 6. i18n parity (runtime + tests) — PASS

**html lang attributes:**

```
es.html:                     <html lang="es"
en.html:                     <html lang="en"
es-svc-window-cleaning.html: <html lang="es"
```

**Spanish copy spot-check, /es/services/window-cleaning (visible HTML):**

```
H1: Limpieza de ventanas
"Limpieza de ventanas": 12   "ventana": 16   "presupuesto": 13   "gratis": 10
English fallback probes — "Window cleaning": 0, "Free walkthrough": 0, "What we clean": 0
```
No English fallback leakage.

**npm test (Vitest, includes `tests/parity.test.ts` i18n key-parity gate):**

```
> limpios-cleaning@0.1.0 test
> vitest run

 Test Files  2 passed (2)
      Tests  10 passed (10)
   Duration  653ms
```
Exit code 0. Test files: `tests/parity.test.ts`, `tests/lead-schema.test.ts`.

---

## 7. New media wiring — PASS

**/en/services/window-cleaning:**

```
vid9-window.mp4  -> referenced (1x, in RSC payload for the client video component)
Vid9_poster.jpg  -> 9 visible refs, e.g.
   /_next/image?url=%2Fvideo-posters%2FVid9_poster.jpg&w=3840&q=75
img15.webp / img14.webp -> 9 visible refs each, e.g.
   /_next/image?url=%2Fjob-photos%2Fimg15.webp&w=3840&q=75
```

**/en/services/post-construction:** `img11`, `img18`, `img25`, `img26` → 9 visible refs each. ✔
**/en/about:** `img29`, `img20`, `img16` → 9 visible refs each. ✔

**/en/services/carpet-cleaning (known no-photo gap):** page renders fine —

```
img tags in visible HTML: 0        (no broken <img>, none expected)
h2 headings: ['What's included', 'Who it's for', 'What shapes the estimate',
              'Related services', 'Frequently asked questions',
              'Ready to hand off the cleaning?', 'Services', 'Service Areas',
              'Company', 'Contact']
empty h2/h3: []                    (no orphaned/empty section headings)
```

**All referenced media assets serve 200:**

```
/video/vid9-window.mp4 -> 200        /video-posters/Vid9_poster.jpg -> 200
/job-photos/img15.webp -> 200        /job-photos/img14.webp -> 200
/job-photos/img11.webp -> 200        /job-photos/img18.webp -> 200
/job-photos/img25.webp -> 200        /job-photos/img26.webp -> 200
/job-photos/img29.webp -> 200        /job-photos/img20.webp -> 200
/job-photos/img16.webp -> 200
```

---

## 8. No placeholder leakage — PASS

Visible (script-stripped) HTML grep for `TODO`:

```
en.html       -> visible TODO count: 0
en-about.html -> visible TODO count: 0
```

---

## 9. Internal links on /en — PASS (22/22 → 200)

All internal `href`s collected from visible HTML of /en (excluding `/_next/*`), each curled once:

```
200 /en                              200 /en/service-areas/minneola
200 /en/about                        200 /en/service-areas/winter-garden
200 /en/contact                      200 /en/services
200 /en/pricing                      200 /en/services/carpet-cleaning
200 /en/quote                        200 /en/services/commercial
200 /en/reviews                      200 /en/services/move-in-out
200 /en/service-areas                200 /en/services/post-construction
200 /en/service-areas/clermont       200 /en/services/window-cleaning
200 /en/service-areas/four-corners   200 /es
200 /en/service-areas/groveland      200 /favicon.ico?favicon.0hwb3mg230le9.ico
200 /en/service-areas/horizon-west   200 /icon.svg?icon.1fwx7wuuzwc87.svg
```

No non-200 responses. (Note: homepage nav links only 5 of 8 service pages — residential, deep-cleaning, interior-painting are demoted from the homepage but remain live and in the sitemap, consistent with the repositioning.)

---

*End of report. No source files were modified during this verification.*
