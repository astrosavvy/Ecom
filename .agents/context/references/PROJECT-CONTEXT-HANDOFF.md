# Younoya — Project Context / Handoff

Date prepared: 2026-09-20  
Workspace: `E:\Ecom_Test`  
Primary local URL: `http://127.0.0.1:5173/`

This document is the working context for another LLM or developer taking over the Younoya project. It records the user’s intent, the reasoning behind the visual and technical decisions, the experiments that were rejected, and the exact current state of the repository.

## 1. Project Overview

Younoya is a premium gifting brand and e-commerce experience. The desired homepage is not a conventional product grid or price-first store. It should feel like a dark, rich, cinematic brand film in which scrolling moves the visitor through a connected visual story.

The core homepage idea is:

1. A restrained Younoya introduction.
2. A scroll-scrubbed cinematic film made from four connected gift-intention scenes.
3. Category copy that changes in sync with the film.
4. A quiet closing brand statement.
5. Normal e-commerce functionality connected to the already-prepared Medusa backend at a later stage.

The four gift-intention categories are:

- **Love & Connection** — Connection • Affection • Emotional Presence
- **Confidence & Personal Power** — Confidence • Courage • Self-Expression
- **Vitality & Inner Balance** — Energy • Calm • Clarity • Grounding
- **Wealth & Prosperity** — Financial Intention • Stability • Growth Mindset

The repository is a Vite React application. The current app has a working homepage, cart context/drawer infrastructure, a fixed navigation bar, a cursor aura, and a scroll-driven film. The Medusa backend is considered prepared by the user, but the current visible app only has a `/` route; product/collection routes and real backend wiring are not yet complete in this workspace.

## 2. Vision & Philosophy

### Experience philosophy

The site should feel like a premium editorial object, not a SaaS dashboard or a normal catalogue. The visitor should discover meaning before seeing a list of products and prices.

The intended emotional progression is:

**curiosity → immersion → recognition → intention → purchase**

The first screen must be deliberately minimal. It should not attempt to explain the entire business, show every product, or expose every form. The video and a small amount of copy should carry the first impression.

### Visual philosophy

- Dark, warm, and rich rather than plain black-and-white.
- Gold/cream typography and accents with restrained ruby/red warmth.
- Editorial serif display type paired with small uppercase utility labels.
- Generous negative space.
- Product and scene imagery should feel sculptural and intentional.
- Interface chrome should remain quiet so the generated film is the hero.
- Motion should be cinematic and continuous, not a collection of unrelated card animations.

### Motion philosophy

The key interaction is scroll as a scrubber. Scroll position maps to video time. The visitor is effectively moving a camera through Younoya’s world.

The lets-scroll skill’s most important rule is the seam rule: each handoff must use actual frames from the preceding and following renders. A visually similar fresh scene is not enough; it produces a visible pop.

The implementation therefore fetches the video as a Blob and seeks the in-memory object URL. This is intentional. Static servers often expose a video with a useless seekable range, which causes scroll scrubbing to remain stuck at frame zero. Blob loading keeps the video seekable.

### Product philosophy

The experience should support two eventual shopping paths:

- ordinary Younoya products, browsed and purchased simply;
- optional personalized astrology/numerology gifting, which should feel premium and purposeful rather than mandatory.

The latest homepage decision is to remove the personalization form from the homepage entirely. This does not reject the personalization business idea; it rejects putting its data-entry UI on the first journey before the brand story and shopping flow are ready.

## 3. Important Ideas

### Brand story

The working story is a single journey through four emotional intentions, not a product-and-price carousel. The category words are the narrative chapters. The film should show one dominant visual idea at a time and let the copy name the emotional territory.

The current opening line is:

> A gift should feel inevitable.

The supporting line is:

> Four intentions. One continuous journey.

The closing line is:

> The object is beautiful. The meaning is yours.

These are current copy decisions, not immutable legal brand language.

### Astrology recommendation concept

The user described an engine that combines:

- name numerology;
- date of birth;
- time of birth;
- place of birth;
- Moon sign;
- Antardasha.

The stated mapping is **12 Moon signs × 9 Antardashas → 4 gift-intention categories**. Name numerology is intended to complement the date-based astrology calculation. The user said the fields may not all be mandatory, but the experience may ask for all of them.

This is a product concept and business rule supplied by the user. It is not currently connected to a calculation service in the visible homepage.

### Mascot / personalization character

The original concept included an animated 3D mascot that would behave like a friendly character with eye and hand movement while asking questions. The user later rejected the existing mascot because it was not truly 3D and did not move convincingly. The existing `public/media/aster-mascot.png` remains in the repository but is intentionally not used.

The user suggested redesigning the character in Blender in the future. No Blender model, rig, animation, or interaction system has been accepted yet.

### References and inspiration

The user referenced:

- Leoparpeix — especially the cinematic, scroll-led feeling;
- Pulkit’s Claude directory;
- Motionsites’ Vertex prompt page;
- Nooe — especially the minimalist first tile/first screen direction;
- the supplied social media image, showing a black field, gold Younoya mark, red cinematic light, and restrained editorial copy;
- `E:\Ecom_Test\VertextPrompt.md` — a detailed Vertex-style visual/layout reference.

The Vertex prompt is reference material, not a literal instruction to copy its unrelated SaaS product, blue palette, or its “no video” constraint. Younoya’s film-driven requirements take precedence.

## 4. Decisions

### Confirmed decisions

1. **Use the lets-scroll approach.** The homepage is a scroll-scrubbed film, not an autoplay background video and not a standard carousel.
2. **Use four gift-intention chapters.** The category names and descriptors above are the current approved information architecture.
3. **Use the newest approved 32-second four-leg chain at every viewport for now.** There is no approved matching 16:9 chain. The old 12-second desktop prototype must not be silently selected.
4. **Use native portrait video on phones.** The approved chain is 720×1280, 24 fps, silent H.264, approximately 32 seconds total.
5. **Preserve the full portrait composition on desktop.** The current desktop stage uses `object-fit: contain` and a dark cinematic surround rather than cropping the portrait film into a landscape window.
6. **The mascot is absent from the current homepage.** Do not reintroduce `aster-mascot.png` as a substitute for a real animated 3D character.
7. **The repeated category gallery after the film is removed.** The video chapters already communicate the four categories; repeating them immediately afterwards diluted the cinematic story.
8. **The optional personalization form is removed from the homepage.** It should be reintroduced only as a deliberate future journey/route after the calculation service and product recommendation UX are defined.
9. **The header is intentionally restrained.** It contains the Younoya mark, two simple anchors, and the cart/bag control. Personalize is no longer a header item.
10. **The logo is brightened through CSS.** `favicon.png` remains the source asset, with larger sizing, brightness/saturation/contrast adjustment, and a restrained gold drop shadow.

### Decisions made because of constraints

- Seedance 2.0 Fast was attempted through Higgsfield but returned `Requires basic plan or higher` without spending credits. It was not used.
- The user had limited Higgsfield credits, so the workflow avoided speculative re-rolls and reused approved stills where possible.
- The first supplied four portrait clips were rejected because they had a lower-right generator watermark and did not frame-lock their seams. They were not merged or disguised.
- A replacement chain was generated using Higgsfield’s available fallback path (`veo3_1_lite`) with start-frame conditioning. The approved replacement has no visible watermark and passed visual seam review.

### Rejected or superseded ideas

- **The first carousel-heavy hero:** rejected because it put too many rings, cards, storefront UI, and product tiles on the first screen and obscured the film.
- **The old desktop landscape film:** superseded. It is still present at `public/media/younoya-category-film.mp4`, but it is only a 12-second prototype and is not the active homepage asset.
- **The first four generated portrait clips:** rejected due to watermark and seam problems.
- **Cropping the landscape film to mobile:** rejected as the primary mobile strategy. The lets-scroll instructions require a native 9:16 chain for phones when a mobile version is promised.
- **Putting astrology data capture on the homepage:** rejected in the latest pass to protect the first journey’s minimalism.
- **Using the current PNG mascot as the “3D” character:** rejected; it does not meet the interaction or animation requirement.

### Current assumptions

These are practical assumptions, not confirmed external facts:

- The current approved portrait film is acceptable as a temporary cross-viewport delivery while a dedicated desktop chain is not available.
- The existing `CartContext`/`CartDrawer` can be preserved while real Medusa product data is connected.
- The four category labels and lines are stable enough for the current homepage copy.

## 5. Instructions & Constraints

### Brand and asset constraints

- Brand name: **Younoya**.
- Do not change the user-provided asset paths:
  - `E:\Ecom_Test\favicon.png`
  - `E:\Ecom_Test\brand.webp`
  - `E:\Ecom_Test\brand-legacy.webp`
- Existing photoshoot/product assets should receive only minor cleanup or enhancement. Do not unnecessarily alter the physical products.
- Do not put generator watermarks, text, prices, UI, mascots, people, or literal astrology symbols inside the cinematic film.
- The mascot is not part of the current homepage.

### Video/lets-scroll constraints

- Read `E:\Ecom_Test\.agents\skills\lets-scroll\SKILL.md` before changing the film pipeline.
- Use one coherent camera grammar and one qualified model for a chain.
- For a continuous forward chain (architecture A), each next leg must start from the previous leg’s actual final frame.
- For a dive-plus-connector chain (architecture B), connector start/end frames must come from the actual neighboring rendered clips, never from fresh stills.
- Do not hide or crop a watermark to make a clip appear usable.
- A native mobile chain is 9:16; do not silently ship a center crop and call it native mobile.
- Preserve Blob loading for reliable seeking unless a replacement implementation proves equivalent seekability.
- Validate frame continuity, `videoWidth/videoHeight`, duration, seekable range, and scroll/time synchronization after media changes.

### UX constraints

- The first screen should remain minimal and video-led.
- Do not re-add a large product grid directly after the film unless the user explicitly wants a new shopping section.
- Do not re-add the personalization form to the homepage without a clear product recommendation flow.
- Normal browsing/purchasing must remain simple even if a personalized astrology journey is added later.
- Keep header/navigation visually quiet and ensure the gold mark is readable on dark backgrounds.

### Code and workspace constraints

- Project root: `E:\Ecom_Test`.
- Use `apply_patch` for source edits.
- Preserve unrelated user work in the workspace.
- Run `npm run build` after meaningful source changes.
- Use the local Vite server for visual QA:
  - `npm run dev -- --host 0.0.0.0`
  - `http://127.0.0.1:5173/`
- The app currently has only a `/` React Router route. Do not claim that Medusa product routes are complete unless they are actually implemented.

## 6. Current State

### Completed

- Vite/React project runs locally.
- `npm run build` passed after the latest cleanup.
- The homepage is a dark cinematic Younoya experience.
- Scroll-scrubbed film is implemented in `src/pages/Home.jsx`.
- The film uses `/media/younoya-category-film-mobile.mp4` at all viewports until a matching landscape chain is approved.
- The film loads as a Blob/object URL and maps scroll progress to video time.
- Category switching now uses four equal progress bands with `Math.floor(progress * CATEGORIES.length)`.
- Opening copy and chapter copy are overlaid without the former 3D carousel/storefront layers.
- The repeated `CategoryGallery` and `Personalization` components were removed from the homepage.
- The final brand section remains as a quiet closing beat with `id="finale"`.
- Navbar no longer exposes Personalize and now contains only intention/story and Younoya anchors plus the bag control.
- Header logo visibility was improved in `src/styles/Navbar.css`.
- Cursor dot/ring interaction remains on desktop and hides on coarse pointers.
- Mobile layout was tested at 390×844:
  - no horizontal overflow;
  - video source is the portrait chain;
  - video dimensions are 720×1280;
  - duration is 32 seconds;
  - seekable range reaches 32 seconds;
  - category copy follows scroll.
- Desktop visual QA showed the film and chapter overlay working at a wide viewport.
- Browser console QA returned no errors/warnings in the latest test.

### Important current files

- `src/pages/Home.jsx` — homepage film, category copy, cursor, finale.
- `src/components/Navbar.jsx` — fixed header and navigation.
- `src/styles/CinematicHome.css` — film stage, overlays, responsive layout, cursor styling.
- `src/styles/Navbar.css` — header appearance and logo visibility.
- `public/media/younoya-category-film-mobile.mp4` — active 32-second approved portrait master.
- `public/media/younoya-category-film.mp4` — obsolete 12-second landscape prototype; not active.
- `public/media/aster-mascot.png` — unused mascot asset; intentionally not used.
- `creative/younoya-scroll-film/current-video-handoff/README.md` — active video handoff notes.
- `creative/younoya-scroll-film/current-video-handoff/QA-REPORT.md` — clip rejection and approved replacement QA.
- `creative/younoya-scroll-film/current-video-handoff/IMAGE-PROMPTS.md` — still-generation prompt package.
- `creative/younoya-scroll-film/current-video-handoff/mobile/` — native portrait prompt/handoff package.
- `creative/younoya-scroll-film/current-video-handoff/renders/stills/` — approved visual references.
- `creative/younoya-scroll-film/current-video-handoff/incoming/hf_mobile_leg_*.mp4` — approved individual Higgsfield portrait legs.
- `creative/younoya-scroll-film/current-video-handoff/handoff/higgsfield-qa/seam-grid.jpg` — seam review evidence.

### In progress or intentionally incomplete

- Medusa backend integration is not visible in the current route tree.
- Product/collection pages are not implemented in `App.jsx`; old links from the removed gallery should not be assumed to work.
- The astrology calculation engine is only a defined product concept, not a working service in this homepage.
- No true animated 3D mascot exists yet.
- No approved desktop 16:9 lets-scroll chain exists yet.
- Old CSS for removed gallery/personalization/card-ring classes remains in `CinematicHome.css`; it is harmless but can be cleaned later after confirming no other component uses it.

## 7. Problems & Open Questions

### Media questions

1. Should the team spend credits or use another renderer to create a matching 16:9 desktop chain? This is the most important media decision before replacing the current cross-viewport portrait delivery.
2. Is the visual character of the four accepted Higgsfield legs consistent enough for the final brand launch, or are some product details too stylized?
3. Should a connector be added between legs if future renders reveal a perceptible velocity break? Current seam-grid composition review passed, but a live review should still judge motion continuity, not only still-frame similarity.
4. Is the 32-second film too long or too short once actual product shopping links are present?

### Commerce questions

1. What exact Medusa API endpoint/client is already prepared?
2. Which products map to each of the four intentions?
3. What are the product detail, collection, bag, checkout, inventory, and pricing routes?
4. Should “Intentions” link to an eventual collections index, or remain a hash link into the film until that route exists?

### Astrology questions

1. What is the authoritative numerology system and name normalization rule?
2. How are Moon sign and Antardasha calculated, and what timezone/ephemeris provider is authoritative?
3. Which fields are truly required by the engine versus merely helpful?
4. Does the recommendation return one category, a ranked list, or a specific hamper/product?
5. Where should the journey live once implemented: a dedicated `/personalize` experience, a gift-finder entry point, or a product/collection pre-checkout step?
6. What privacy/consent language is needed for birth data?

### Mascot questions

1. Is the future character a Blender-rendered 3D asset, a WebGL/Three.js scene, or a pre-rendered interactive video/animation?
2. What are the exact user questions and how should eye/hand animation respond to idle, hover, typing, and answer states?
3. Does the mascot belong in a dedicated personalization route instead of the homepage?

## 8. Future Plan

### Immediate next steps

1. Keep the local server running and review the simplified first screen on both a wide viewport and a real phone.
2. Confirm the logo treatment is readable against both the opening video frame and the scrolled chapter frames.
3. Remove stale gallery/personalization CSS only after a repository-wide search confirms it is unused.
4. Decide whether to keep the “Younoya” footer anchor or replace it with a real shop/collection route once commerce routes are available.
5. Add a dedicated 16:9 chain only after the four-leg prompt/handoff contract is satisfied and the output is visually approved.

### Medium-term implementation

1. Add Medusa product data and collection routes without changing the minimal film-first homepage.
2. Map product cards or collection links to the four intentions after the product taxonomy is known.
3. Add a deliberate optional “Find their intention” entry point, preferably outside the hero’s initial composition.
4. Implement the astrology/numerology service behind a clear API contract and privacy-aware input flow.
5. Use recommendation output to route to a category or curated hamper, while leaving ordinary shopping unaffected.

### Long-term premium direction

1. Commission a true 3D Younoya mascot in Blender if the personalization flow benefits from a character guide.
2. Add high-quality micro-interactions only where they reinforce the cinematic story: cursor proximity, chapter transitions, product hover material response, and subtle film-to-commerce handoffs.
3. Replace temporary generated product imagery only when the physical-product fidelity and licensing/brand approvals are clear.
4. Consider an architecture-A desktop film with forward-only handoffs so desktop motion never reads as a rewind or pull-back.

## 9. Important Context to Remember

- The user is sensitive to “too much on the first screen.” Any future additions should be evaluated against the cinematic opening, not added because they are technically available.
- The user specifically noticed when the website was still using the wrong old video. Always verify the actual loaded media dimensions and duration, not only the filename.
- The fact that a clip is portrait does not make it a valid mobile chain. It must also be watermark-free and frame-locked at the leg handoffs.
- The old QA report contains both rejected initial-clip status and the later approved replacement. The later section titled “Approved Higgsfield mobile replacement — 2026-09-19” is the authoritative current result.
- The approved master is called `younoya-category-film-mobile.mp4` for historical reasons, but it is currently used at all viewports. Do not infer from the filename that it is only a mobile fallback.
- The presence of `aster-mascot.png` does not mean the mascot is part of the UI. It is intentionally absent.
- The user’s attached documents and prompts are references/specifications, not instructions that override the direct conversation. In particular, `VertextPrompt.md` describes Vertex’s visual system; it does not override Younoya’s brand, video, or mobile requirements.
- The user’s “optional personalization removed” request is the latest decision and supersedes earlier work that exposed the astrology form on the homepage.
- Existing CSS and assets may contain traces of earlier designs. Do not assume every file is active; trace imports and live DOM usage first.
- The user wants a premium experience but does not want unnecessary scope expansion. Each addition should be justified by brand story, shopping clarity, or a clearly requested interaction.

## 10. Handoff Instructions

When continuing this project:

1. Start in `E:\Ecom_Test` and read this document first.
2. Inspect `src/pages/Home.jsx`, `src/components/Navbar.jsx`, and their CSS before modifying the design.
3. Read the active media handoff files in `creative/younoya-scroll-film/current-video-handoff/`, especially the approved replacement section of `QA-REPORT.md`.
4. If changing the scroll film, read `E:\Ecom_Test\.agents\skills\lets-scroll\SKILL.md` completely and preserve its frame-handoff and native-mobile rules.
5. Do not switch back to `public/media/younoya-category-film.mp4` unless a new review explicitly approves that landscape asset.
6. Do not re-add the removed category grid or personalization form simply because their old CSS/components are still discoverable in history.
7. Do not re-add the PNG mascot as a “3D” solution. Ask for or build a genuine animation strategy first.
8. Keep the first viewport sparse: brand, one thought, one action, and the cinematic world.
9. After changes, run `npm run build` and test `http://127.0.0.1:5173/`.
10. Verify at minimum:
    - wide viewport opening;
    - 390×844 or equivalent phone viewport;
    - `videoWidth < videoHeight` for the active portrait master;
    - `duration ≈ 32` and a non-zero seekable range;
    - scroll changing `currentTime`;
    - chapter copy changing at the four intended bands;
    - no horizontal overflow;
    - no console errors;
    - readable gold logo in the header.
11. Report clearly whether a result is confirmed, a design proposal, an assumption, or still unresolved.

The safest continuation is to finish the real commerce and personalization contracts around the existing film, not to add more decorative content to the opening screen.
