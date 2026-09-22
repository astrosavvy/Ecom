# Latest amendments — 2026-09-22

User now wants sparse captions and a transparent header (logo left, cart icon right) on the full-screen film. Four short captions fade at story boundaries. Scroll travel doubled from 5.2 to 10.4 initial viewport heights (section 11.4vh multiples); film progresses at half the previous rate per scroll without duplicating frames. Video source remains unchanged.

Final 2.5s show Explore the collection (/shop) and Let Younoya choose (/find-a-gift). Homepage still has no collection/finale sections. Cart drawer is accessible on homepage. Collection and new gift finder use light ivory styling. Finder provides explicit intention-based curated matches using the canonical PRODUCTS data.

Persistent user requirement: never use budget as a sort/filter/choosing option. Final finder contains no budget question, state or price-based filtering; all-products has no price sorting. Prices are displayed normally.

---
# Current implementation — 2026-09-22

The homepage is now video-only at the user's explicit request. Home.jsx renders only StoryFilm; App.jsx hides navigation/cart UI on home, preserving both on /shop and product routes. Collection/finale and all story copy/controls are absent. The prior implementation below is historical.

Active media: /media/younoya-diorama-film-mobile.mp4, composed in order from all seven four-second renders in creative/younoya-scroll-film/diorama/render. Web encode: 720x1280 H.264 yuv420p, 24fps, GOP4, faststart, no audio, 28.041667 seconds, 16.12 MB. Four /media/diorama-*.webp stills come from actual rendered frames. Original sources are unchanged. Source joins show some framing changes; no seamless-source guarantee.

The full sticky section is 6.2 initial viewport heights and maps its scroll range directly to video duration minus 0.05s, without an intro delay. Poster boundaries are 0/8/12/20 seconds. Object-fit cover fills every viewport; portrait footage is cropped on desktop. A native landscape master would be needed to avoid that crop while filling wide screens.

Blob fetch/cleanup, rAF seek coalescing, latest-target handling, touch priming, mobile height stability and media failure fallback remain. Reduced-motion and save-data modes render four static full-screen images and make zero MP4 requests. No video audio or visible text overlays.

Validation: root build exit 0, 2275 modules. Browser QA at 1440x900, 430x932, 390x844, 320x568 and 844x390: full viewport bounds, forward/reverse scrubbing, Blob seekability, no overflow/page errors. CPU throttling, height resize, no-text homepage, static/failure fallbacks and direct shop/product navigation passed. Real iOS not tested. No deployment or push.

---

# Historical implementation (superseded)
# Scroll Film Engine & Homepage Story

> Current implementation: 2026-09-20, Codex. The approved category film remains the production source.

## 1. Active homepage

`younoya-web/src/pages/Home.jsx` renders `StoryFilm` -> `FlowShowcase` -> `Finale`.
`src/components/StoryFilm.jsx` and `src/styles/StoryFilm.css` own the cinematic first tile. The finale CTA opens `/shop`, implemented by `src/pages/Shop.jsx` and `src/styles/Shop.css`, listing all eight canonical PRODUCTS with links to their product detail pages. Shop navigation and the product-page All products breadcrumb also lead to `/shop`.
The previous `VertexHero` remains available in source but is not mounted on the homepage.

- Opener: authentic hamper reference, desktop landscape and native portrait pictures, sparse editorial headline, and an Enter the story control.
- User-confirmed interaction: mouse wheel / trackpad / touch scrolling drives video time; pointer movement adds subtle depth to the desktop opening image. The normal cursor remains visible.
- Asset source: reuse the already approved four-leg continuous chain, `/media/younoya-category-film-mobile.mp4` (32 seconds, 720 x 1280). No new generation, encoding, or paid rendering was performed.
- The same approved portrait film serves desktop and mobile. Desktop frames it beside the copy; CSS scales out the source's baked letterbox bands and softly masks its edges. No native landscape chain is claimed.
- Opening imagery: `/media/younoya-hamper-hero-landscape-16x9.jpg` and `/media/younoya-hamper-hero-portrait-9x16.jpg`.

## 2. Timeline and navigation

The sticky track is 6.2 initial viewport heights. The first 12% introduces the hamper; the remaining 88% maps linearly to the film's full duration minus 0.05 seconds.

Copy follows the actual product arrivals, distinct from the source clip seams:

| Film time | Intention | Product route |
|---|---|---|
| 0-10 seconds | Connection | `/product/love-connection` |
| 10-20 seconds | Confidence | `/product/confidence-personal-power` |
| 20-27 seconds | Balance | `/product/vitality-inner-balance` |
| 27-32 seconds | Prosperity | `/product/wealth-prosperity` |

The chapter navigation uses a translucent panel with current-chapter typography, direct-jump markers, and previous/next buttons. On narrow phones markers are hidden while arrows retain access to every chapter. The final forward control links to the collection. All controls support keyboard interaction; chapter jumps land slightly inside each chapter. The collection link exits the pinned story to `#intentions`. Hidden chapter text uses the native hidden attribute; the faded intro becomes inert. Route-entry hash handling in `App.jsx` supports returning from product pages to homepage sections.

## 3. Seeking and fallback contract

- Fetch once per mount into a Blob object URL, validate the HTTP response, abort on cleanup, and revoke the URL. Never start with a second direct HTTP video source.
- Coalesce scroll updates through requestAnimationFrame. Do not seek while `video.seeking`; the seeked event processes the newest target. No perpetual film animation loop.
- Keep the chapter still visible until video data is ready. First touch primes muted inline playback; rejected priming may retry. Failure keeps the still story usable.
- Touch devices preserve initial scroll geometry on height-only URL-bar resize; width/orientation changes recompute it.
- Reduced motion and data-saving mode use ordinary static chapter sections and do not fetch the film. Motion preference changes are observed.
- `SmoothScroll.jsx` owns Lenis, cancels its latest animation frame, tears it down for reduced motion, and intercepts only valid same-page anchors.
- `FlowShowcase` retains the 3D collection with arrow-key browsing. Full-card links open each product page; Reserve stays independent. Capture starts after a horizontal drag threshold and suppresses accidental navigation after dragging. Mobile footers put price above a full-width button row to prevent clipping. Reduced motion uses immediate card positioning.

## 4. Brand and future media

Maintain ink navy `#080B14`, deep plum `#1A0A17`, warm ivory `#FAF6EE`, muted gold `#D6B06A`, and Cormorant Garamond regular/italic display typography. Keep astrology supportive and avoid outcome promises.

The planned 10-12 second hamper film is a future asset, not the active film. Existing conditioning references (hero, macro detail, and radiance climax) and the 48 FPS proposal remain in `creative/younoya-scroll-film/PROMPTS_AND_FPS_GUIDE.md`. Rendering or replacing the approved master requires a separate agreed media brief. Preserve the raw photoshoot archive.

## 5. Verification recorded this turn

- Root `npm run build`: passed, storefront output copied to root dist.
- Headless Edge: 1440 x 900, 390 x 844, 320 x 568, and 844 x 390; full 32-second Blob seekable range, no horizontal overflow or page errors.
- Forward/reverse scrolling and chapter buttons reach the expected timestamps; 4x CPU-throttled mobile rapid scrolling settles at the latest target.
- Height-only touch resize retains scroll geometry; portrait and landscape layouts visually inspected.
- Visual seam samples at 7.96/8.04, 15.96/16.04, and 23.96/24.04 seconds retain composition continuity.
- Product navigation, collection keyboard selection, local cart add, direct hash entry, reduced-motion, data-saving, and HTTP failure fallbacks checked. No checkout transaction or production writes.
- Real iOS hardware has not been tested. Existing checkout remains a frontend demo and is outside this story change.
- Screenshots and QA scripts/results live outside the repository in the current Codex visualization directory.
