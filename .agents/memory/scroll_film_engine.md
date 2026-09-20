# Scroll Film Engine & Homepage Story

> Current implementation: 2026-09-20, Codex. The approved category film remains the production source.

## 1. Active homepage

`younoya-web/src/pages/Home.jsx` renders `StoryFilm` -> `FlowShowcase` -> `Finale`.
`src/components/StoryFilm.jsx` and `src/styles/StoryFilm.css` own the cinematic first tile.
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

The chapter rail supports native button keyboard interaction and jumps slightly inside each chapter. The collection link exits the pinned story to `#intentions`. Hidden chapter text uses the native hidden attribute; the faded intro becomes inert. Route-entry hash handling in `App.jsx` supports returning from product pages to homepage sections.

## 3. Seeking and fallback contract

- Fetch once per mount into a Blob object URL, validate the HTTP response, abort on cleanup, and revoke the URL. Never start with a second direct HTTP video source.
- Coalesce scroll updates through requestAnimationFrame. Do not seek while `video.seeking`; the seeked event processes the newest target. No perpetual film animation loop.
- Keep the chapter still visible until video data is ready. First touch primes muted inline playback; rejected priming may retry. Failure keeps the still story usable.
- Touch devices preserve initial scroll geometry on height-only URL-bar resize; width/orientation changes recompute it.
- Reduced motion and data-saving mode use ordinary static chapter sections and do not fetch the film. Motion preference changes are observed.
- `SmoothScroll.jsx` owns Lenis, cancels its latest animation frame, tears it down for reduced motion, and intercepts only valid same-page anchors.
- `FlowShowcase` retains the existing 3D collection, with arrow-key browsing and interactive links excluded from drag capture. Reduced motion uses immediate card positioning.

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
