# Raw vision notes — round-3 media (Fable, 2026-07-06)

Method: every image viewed directly with vision (Read tool renders the file);
videos sampled via ffmpeg frame extraction (1 fps-ish grid: `select=not(mod(n,60))`,
6 frames each) + targeted timestamps (vid9 @ 8/10/12/13.5s for poster choice).
These are the unpolished per-asset observations behind
docs/fable-audit/10-media-catalog.md. Dimensions from sharp metadata.

## Images (all jpeg; img10–26,29 = 768×1024 portrait; img27/28 = 1024×1024 composites)

- img10 — bedroom of an upscale NEW BUILD (sage walls, tray ceiling, crown
  molding, ceiling fan); Werner fiberglass ladder center; rolling wardrobe
  rack packed with clothes; mattress on floor w/ items. Bright daylight.
  Read: mid move-in (or final staging of post-construction handover). No people.
- img11 — luxury bathroom: freestanding oval tub, frameless glass shower,
  bookmatched marble-look wall slabs, marble-look tile floor; paint bucket +
  jug + rags on floor by tub. Read: post-construction, pre/mid-clean. No people.
- img12 — double vanity, cabinet doors/drawers open, gallon jug + paint can on
  floor, mirror partially visible, bedroom beyond. Weaker framing than img11;
  reads cluttered. SKIP (redundant).
- img13 — bedroom w/ tray ceiling + big windows; mattress covered in strewn
  clothes/shoes; boxes. Too chaotic to flatter the brand. SKIP.
- img14 — crew member (back turned, ponytail, light-blue tee w/ small back
  print, jeans) using a flat pole pad on wall between two windows; new-build
  room; clothes pile in foreground bottom-left (slightly untidy but honest).
  Read: wall/window detail work. Not identifiable.
- img15 — crew member (back turned, on step stool/ladder) wiping window
  header/frame; gloves (blue nitrile); big picture window with dirt lot
  outside; beam ceiling. Strongest WINDOW proof still. Not identifiable.
- img16 — male crew member on tall Werner ladder wiping ceiling-fan blade with
  white cloth; N95-style mask, blue cap, black gloves, arm tattoos, athletic
  shoes; branded light-blue tee (front logo visible). Partially identifiable
  (eyes/brow visible above mask) → CONSENT FLAG. Great "standards/detail" shot.
- img17 — tighter angle of img16 (same scene); tattoos dominant; mask + cap.
  SKIP (img16 covers; tighter crop adds nothing).
- img18 — empty room, dark wood-look floor, two ladders (tall red + small
  step), shop vacuum center-left foreground, spray bottle + bucket staged
  right; mattress w/ items far side. Read: post-construction/turnover clean IN
  PROGRESS, equipment on site. No people.
- img19 — crew member crouched detailing toilet base/bowl edge w/ black
  gloves + cloth; marble-look tile; grey walls; used microfiber cloths on
  floor. Back turned, bun; not identifiable. Humble/credible detail proof.
- img20 — crew member on red ladder reaching INTO tall over-fridge-style grey
  cabinets in bathroom/laundry; back of branded tee fully legible: LIMPIOS
  (logo) + services list + phone + veteran-owned line. Cap. Not identifiable.
  Best BRAND shot of a person working.
- img21 — similar to img20, dusting cabinet top w/ yellow duster; branded tee
  back partially legible. Weaker angle, blown highlights near sconce. SKIP.
- img22 — pristine toilet, straight-on, marble tile floor, grey walls. Clean
  "after" detail; sterile composition. SKIP (img25 tells finished story better);
  available if a toilet-specific after is ever needed.
- img23 — freestanding tub clean + polished; TWO PAINT BUCKETS stacked behind
  (construction context); marble floor gleams. Almost-after. SKIP (img25 better).
- img24 — long double vanity w/ quartz top cleaned, sconces on, unfinished
  plywood panel section visible (mid-construction), floor gleaming. Good but
  img25 fuller. SKIP.
- img25 — WIDE finished bathroom: gleaming marble floor w/ visible ceiling-
  light reflections, tub + glass shower + vanity edge, door to bedroom. THE
  money "after" shot. Ship as post-construction flagship.
- img26 — empty bedroom, glossy dark wood floor w/ strong window light
  reflection, red ladder remaining by wall, mattress + covered items far left.
  Read: post-construction after (same room as img18, cleaned). Ship.
- img27 — COMPOSITE 1024² (left/right): grimy porcelain fixture base + tile w/
  brown staining → same area spotless. Left half slightly warmer WB. True
  before/after pair, matches Img1–9 convention (~12px divider). Ship (gallery).
- img28 — COMPOSITE 1024²: toilet base w/ dirty grey microfiber on floor →
  clean marble floor + toilet base. Ship (gallery, disclose tier).
- img29 — royal-blue structured cap w/ woven LIMPIOS Cleaning Management patch
  (spray-bottle L logo), on butcher-block surface; shallow DoF. Brand texture
  shot. Ship (About).

## Videos

- vid8.mp4 — 19.00s, 528×944@30, h264 + AAC. INSTAGRAM REPOST: overlay
  "@LIMPIOSCLEANING" + music credit "Rick Ross · Hustlin'" fades in ~1.5s and
  persists (baked into pixels, right side). Content: t0 pan of move-in bedroom
  (wardrobe rack, ladder, fan) → walkthrough to marble bathroom (open vanity
  drawers) → crew member (back turned, squatting) detailing toilet (~t10-19).
  Audio = copyrighted track → DO NOT self-host/publish as-is. Poster taken at
  t=0.15s (pre-overlay). Decision: url-less facade seam on move-in-out page;
  OWNER re-uploads clean original muted to unlisted YT (Vid1–7 pattern).
- vid9.mp4 — 14.30s, 464×832@59.94, h264 + AAC. Clean footage (no overlay/
  watermark). Content: gloved hand w/ scrub pad working soaped exterior glass
  (t0-6 heavy suds), then clearer squeegee-adjacent passes; sunny yard behind
  glass; window sill visible from t8+. Best poster frame t=10s (hand + pane +
  sill all legible). Muted 10s 432×768 CRF31 self-hosted clip (1.39 MB) for
  the Window Cleaning page (vid4-hero small-silent-committed precedent).

## Poster/clip generation

See scripts/video-processing-commands.ps1 (exact commands + first-attempt
rejects: vid9 poster t=0.5 too dark/ambiguous; clip full-length CRF27 = 3.57MB
too heavy → trimmed/24fps/CRF31 = 1.39MB).
