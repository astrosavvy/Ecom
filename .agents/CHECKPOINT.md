# YOUNOYA — Living Checkpoint & Multi-Agent Handoff Journal

> [!IMPORTANT]
> **MULTI-AGENT SSOT**:
> Any agent (**Codex**, **Antigravity**, **Claude Code**, or automated pipeline) MUST read this file at the start of every turn to know the current state and what to do next. When concluding a turn or completing a milestone, the agent MUST update this document.

---

## 1. 📍 Executive Project Status

- **Current Phase**: Phase 5 — Younoya Diorama Story & /lets-scroll Architecture
- **Status**: Mobile film joins have short blends and seek throttling. The homepage ends in centred fluid choices; `/shop` is an editorial light collection; `/find-a-gift` has a boutique representative, conversational steps and a bounded birth calendar.
- **Active Task**: Current 2026-09-23 storefront/media changes are verified locally and prepared in one final local commit. The seven desktop prompt files are written; their native 16:9 endpoints and video renders remain to be produced. Budget remains excluded from all sorting/filtering/selection. No authorization to push this new work has been given.
- **Last Updated**: 2026-09-23T15:41:35+05:30
- **Last Agent**: Codex
- **Primary Development URL**: `http://localhost:5173/` (`npm --prefix younoya-web run dev` or root `npm run dev`)
- **Primary Production Build**: younoya-web/dist and root dist verified; 2,277 modules, build exit 0, 5.43 seconds (2026-09-23).

---

## 2. 🏁 Checkpoint History & Completed Milestones

### [2026-09-23] Desktop Prompts, Seam Repair & Editorial Storefront (Codex)
- Authored seven desktop 16:9 prompts at `creative/younoya-scroll-film/diorama/video-prompts/desktop_*.txt` plus `DESKTOP_VIDEO_PROMPTS.md`. Each preserves the exact mobile image pair and action. Existing PNG references are near-square, so landscape-expanded first/last frames and desktop renders are still required before website integration. Updated `.gitignore` to track only this prompt package under the otherwise ignored creative media tree.
- Measured original 28.041667-second mobile master at 24 fps: five of six joins showed one-frame mean RGB jumps around 27–34/255 against ordinary median motion around 9.7. Re-encoded the seven legs with five-frame blends across all six joins into a 26.75-second, 720×1280 H.264 seekable master; full-frame-delta scan found no isolated original-size join spike. Source-camera mismatches are softened, not physically repaired; native rerenders are needed for perfect continuity.
- Snapped scroll targets to video frames and limited random video seeks to about 20 per second, reducing decoder churn on mobile. Preserved Blob playback and reduced-motion still fallback. Updated caption timing to the new duration and centred the final two magnetic, organic glass choices over the handover frame.
- Rebuilt `/shop` as a light editorial catalog with a signature feature, richer materials/intention/product information, eight product links and intention-only filters. No budget sorting or selection. Removed visible “Chapter” labels from active storefront routes.
- Replaced Aster in `/find-a-gift` with three transparent-background representative expressions based on the boutique film; added pointer-follow and speech/listening/blink transitions. Reworked the flow as animated answer bubbles and conversation history. Built a month/year calendar limited from today back exactly 120 years, with older and future days disabled. Recommendations use occasion, relationship and solar-sign element; result explicitly discloses that birth time/place are not used by the local preview and that no full Vedic/AI service is connected.
- Verified both self and other recipient journeys through linked product results; 120-year date boundary (1906-09-22 disabled, 1906-09-23 enabled), mobile 358px overflow, collection links/filters and ending choices in the in-app browser. Blob video loaded and sought to its 26.75-second end. Root `npm run build` passed (2,277 modules, 5.43 seconds). Desktop film, real-device iOS seek performance, authenticated astrology/AI and production deployment remain unverified.
- Removed temporary encode tools and obsolete root build hashes. Changes are bundled in one final local commit; no push or deployment this turn.

### [2026-09-22] Interactive Aster Gift Journey & Fluid Story Choices (Codex)
- Replaced the generic intention radio form at `/find-a-gift` with a cinematic five-stage conversation: occasion, recipient, relationship, name, and birth date/time/place. Self-gifting skips the relationship step; unknown birth time is supported.
- Added the user-requested Aster mascot experience on the dedicated route with floating/tilting motion, orbital halo, constellation sparks, changing guide status, animated scene transitions, and responsive split-screen/mobile staging. This route-specific request supersedes the older blanket checkpoint constraint against using the mascot PNG in the UI.
- Added a short animated reading state and a contextual recommendation sentence. Current results combine occasion with a clearly disclosed Western solar-sign element preview; the UI does not claim to calculate a Vedic chart or call AI. The disclosure points toward the existing authenticated birth-chart service for the complete future computation.
- Recommendation results show three clickable real products and retain visible prices. No budget question, range, sort, filter, or recommendation signal was introduced.
- Redesigned the two final film links as asymmetric, fluid glass controls with editorial overlines, circular moving arrows, animated fill, and compact mobile stacking. Labels remain “Explore the collection” and “Let Younoya choose.”
- Browser QA passed through the full mobile sequence and into `/product/confidence-personal-power`; ending choices were visually checked at the bottom of the scroll film with no clipping. Browser console had zero warnings/errors.
- Root `npm run build` passed: 2,277 modules, 4.76 seconds. `git diff --check` passed apart from existing line-ending notices. No commit, push, deployment, or external data transmission.
- User subsequently gave explicit `git push` authorization. The final repository sync uses the required single-commit workflow and targets `origin/main`; Cloudflare CI deployment is expected to start from that push.

### [2026-09-22] Slower Film, Transparent Header & Intention-Only Gift Finder (Codex)
- Added four short editorial captions with scroll-driven fades, preserving the full-screen film. Increased section height from 6.2 to 11.4 viewports: scroll travel doubles from 5.2 to 10.4 viewports, halving film advancement per scroll. No duplicated frames or video re-encoding; source duration stays 28.041667s.
- Restored transparent header with logo left and icon-only shopping bag right; no pill, menu or descriptive navigation. Cart drawer available on homepage again. Light routes use dark cart icon and subdued gold logo.
- Final 2.5 seconds reveal two actual links: Explore the collection -> /shop; Let Younoya choose -> /find-a-gift. Final static fallback includes these links too. User rejected generic Shop all / Find my gift labels.
- Restyled /shop to warm ivory with dark text and muted gold, preserving eight real product cards and product routes.
- Created /find-a-gift with required intention selection and curated matches linked to real product detail pages. No external AI/astrology API or data submission is claimed.
- Explicit persistent user rule: budget will never be a sorting filter or choosing option. Removed initial budget field, budget state/filtering, budget copy and unused select CSS. Final gift finder uses intention only; collection has no budget filter or price sorting. Product prices remain visible.
- Verified actual in-app preview: transparent header and final links visible; collection light theme and eight links; cart button opens drawer; finder returns two celebration matches with no budget field. Verified earlier half-speed geometry: at 855px viewport, travel is 8892px and former end scroll maps to roughly 14s. Caption placement visually checked on mobile.
- Root build passed: 2277 modules, 4.26 seconds; git diff --check passed. No source media changes, commit, push, deployment or transactions. Existing unrelated working-tree changes preserved.
### [2026-09-22] Existing In-App Preview Refreshed (Codex)
- Inspected the user's actual in-app tab at http://127.0.0.1:5173/: it still held the old category-film DOM, copy, navigation and collection. Source files and live Vite server were already current.
- Reloaded that same tab, verified the new video-only DOM with empty visible body text, a loaded Blob video, readyState 4 and duration 28.041667 seconds. Visually confirmed final handover and then opening boutique frames; scrolling back reached time approximately zero.
- Left the user's existing tab open at the new opening scene. No application code changes were needed. An attempted redundant strict-port server startup exited because the original server was already listening; no duplicate server was started.
- Root build verification rerun. No commit, push or deployment.
### [2026-09-22] Rendered Diorama Integration & Video-Only Homepage (Codex)
- Located all seven user renders in creative/younoya-scroll-film/diorama/render. Each is 1080x1920 H.264, 24fps, four seconds, with AAC audio. Sampled first/last and intermediate frames of every clip in a review sheet. Several joins change framing; product handling is fast. No claim of perfect source continuity.
- Concatenated numbered clips without reordering into public/media/younoya-diorama-film-mobile.mp4: 720x1280, H.264 yuv420p, 24fps, GOP4, faststart, no audio, 28.041667 seconds, 16,120,822 bytes. Original renders preserved. Four WebP fallback posters extracted from actual frames.
- User steered to full-screen video with no words, then explicitly selected entire homepage video-only. Home now renders only StoryFilm; no collection/finale, copy, CTA, chapter controls, scrim or opening overlay. Global navbar/cart UI hidden only on home. Shop and product routes and their navbar remain functional; removed links to deleted homepage sections.
- Preserved scroll-controlled Blob seeking, coalesced latest-target updates, touch priming and stable touch height geometry. Film fills viewport using object-fit cover: portrait source is materially cropped on wide screens. No landscape footage generated.
- Reduced-motion/data-saving users receive four full-screen stills without MP4 requests; failed video retains a visible scene still. Accessibility labels describe the film without visible copy.
- Root production build exit 0: 2,275 modules in 4.61 seconds. Superseded intermediate root build assets created this turn removed explicitly; unrelated source logo deletions and untracked skill/media preserved.
- Browser verification passed at 1440x900, 430x932, 390x844, 320x568 and 844x390: full viewport video, no visible story text, muted Blob source, full seekable duration, forward/reverse seeking, no overflow or page errors. Four-times CPU rapid-scroll and mobile height-change stability passed. Reduced-motion/save-data/failure checks passed.
- Additional route check: homepage body has no visible text, navbar, collection or finale; direct /shop and a product link work with navigation present. QA scripts, reports and screenshots stored in current Codex visualization directory (fullscreen-qa.json, video-only-routes.cjs, diorama-review.jpg).
- Local Vite preview running at http://127.0.0.1:5173/. No commit, push, deployment, paid generation or production transaction performed. Real iOS hardware remains untested.
### [2026-09-22] Gemini Omni Flash Skill Prompt Rewrite (Codex)
- Read explicitly invoked gemini-omni-flash-prompts SKILL.md plus prompt-formula, chaining-and-continuity and advanced-editing references.
- Rebuilt all seven video-prompts/mobile_*.txt files with four-sentence camera-first prompts covering reference style, lighting, connecting action and explicit silence. Moved setup, exact first/last PNG inputs and continuity notes outside pasteable prompt text.
- Preserved the user's seven exact image pairs, mobile-first framing and prior proposed 4/4/4/6/8/6/8-second timing (40 seconds). Used paired-frame generation rather than substituting native extension; user endpoint requirements remain authoritative.
- Added GEMINI_OMNI_FLASH_PROMPTS.md with seven individually copyable blocks and continuity notes. Updated VIDEO_PROMPTS_V1.md to revision 3, retaining image audit and source/framing/physical-action caveats.
- Verified exactly seven TXT prompts, four-sentence copy blocks, camera lead, silence instructions, separate continuity notes and all eight existing PNG endpoints in the correct order. Text-only change; no runtime build required.
- Specific model availability, API schema, keyframe support and duration controls were not verified; deliverables do not assert the skill's version/API/extension-cap claims as current facts.
- No image changes, video generation, website changes, commit or push. Complex actions may need longer same-pair renders after preview; actual endpoint and motion continuity remain to be tested.
### [2026-09-21] Corrected Exact Image-Pair Video Prompts (Codex)
- User rejected the invented eight-take workflow and explicitly required scene_1_start -> scene_1_end -> scene_2_start -> scene_2_end -> scene_3_start -> scene_3_end -> scene_4_start -> scene_4_end. This supersedes the preceding no-end-image architecture-A plan.
- Individually viewed all eight original PNGs again and reread the storyboard. Rewrote video-prompts/mobile_01_arrival.txt and replaced the remaining obsolete TXT files with six correctly numbered pair prompts. Exactly seven active TXT prompts now exist.
- Each prompt specifies existing start/end PNGs, first AND last frame conditioning, visible endpoint observations, camera/action direction and strict story boundaries. First clip contains only mascot/exterior/threshold; representative first appears at the distant counter in the second clip.
- Preserved actual pictured product designs, long gallery, empty tray at scene_3_start, filled tray at scene_3_end, separate open rigid box at scene_4_start, and BOTH characters supporting the final gift. Removed adjacent-counter curation and pre-tied ribbon sleeve inventions.
- Replaced VIDEO_PROMPTS_V1.md contents with revision 2: seven-row handoff table, eight-image visual audit, source differences/inferred travel notes, PNG/mobile fitting limitations and actual rendered seam QA. User's explicit two-frame workflow takes precedence over the skill's previous architecture-A default.
- Recommended durations are 4/4/4/6/8/6/8 seconds (40 seconds initial total); complex selection/packing/wrapping may require longer same-pair takes. No claim that all actions fit naturally in four seconds or that prompts guarantee seamless footage.
- Validation passed: exactly seven complete prompts, all eight referenced PNGs exist, each pair and shared boundary match requested order. No build needed for text-only changes.
- No source-image edits, paid generation, website changes, commit or push. Creative prompt directory remains gitignored; existing public diorama assets and logo deletions preserved.
### [2026-09-21] Mobile Diorama Video Prompt Handoff (Codex)
- User confirmed continuous boutique walkthrough and mobile 9:16 first. Applied lets-scroll architecture A manual handoff: sequential clips with actual preceding final-frame PNG as each next hard start, no end-image constraint.
- Authored creative/younoya-scroll-film/diorama/VIDEO_PROMPTS_V1.md plus eight complete video-prompts/mobile_*.txt files. Recommended four-second takes, approximately 32 seconds across four story chapters; split the two-product placement if preview requires more time.
- Standardized existing STORY_AND_PROMPTS_V3.md scene references from JPG to PNG. Existing eight source assets are already PNG; no image conversion or edits performed. Video outputs remain MP4.
- Proposed adjacent-counter curation alcove and pre-tied ribbon sleeve to keep short-shot physical actions plausible. These staging changes need matching prepared references; existing images were not silently changed.
- Handoff includes exact output filenames, pending start-frame dependencies, original storyboard references, manual tool settings and forward/backward seam QA. Current PNG framing and product fidelity still need correction before production renders.
- Validation passed: eight complete prompts with duration and continuity instructions; all eight original PNGs exist; no stale scene JPG references in the storyboard. No build needed for text-only deliverables.
- No paid generations, website edits, commit or push. Preserved existing logo deletions and untracked public diorama assets. Creative directory is gitignored; this package is delivered locally.
### [2026-09-21] Diorama V3 Visual & Story Review (Codex)
- Reviewed `creative/younoya-scroll-film/diorama/STORY_AND_PROMPTS_V3.md` and all eight PNG keyframes, plus the three specified raw product photos and current favicon logo.
- Narrative approved in principle: arrival, occasion consultation, curation, wrapping/handover. Strongest emotional compositions: scene_2_end and scene_4_end. This is still-image review, not video/seam acceptance.
- Product fidelity correction recommended: generated apple is glass-like with an ornate gold lid instead of the photographed smooth metallic red candle; amethyst is a cut-crystal arrangement in a goblet rather than raw mineral in the carved vessel; gold altar omits the reference's broad base/side elements and changes its structure.
- Frame sizes are inconsistent: scene_1_start 1214x1295, scene_1_end 1145x1374, all six remaining scenes 1312x1199. None is native 16:9 or 9:16. Recompose for the target viewport and reserve copy/navigation space before video work.
- Continuous-camera plan needs explicit bridges at 1-end/2-start and 2-end/3-start; scene 3 covers selection plus return to the counter, requiring intermediate beats. Use actual generated end frames for chained starts; independent storyboard pairs are not verified seamless endpoints.
- Packaging review: broad three-product tray becomes a smaller-looking box; depict the physical transfer and keep scale believable. Consider arriving without a branded shopping bag to strengthen the first-visit story. Bag/medallion logos drift between monogram and star-only marks.
- Art direction refinement: reduce pervasive amber/gold glow, retain plum/navy shadows, simplify generic window merchandise, and make the customer's occasion legible with a small visual cue.
- Documentation mismatch: story names .jpg files while actual assets are .png. The proposed Personalization Toolkit CTA has no current route in App.jsx; `/shop` exists.
- Tests: image dimensions measured and visual comparison completed; no runtime/build verification required for this review. Assets, source code, and other existing working-tree changes preserved. No generation, commit, or push performed.
### [2026-09-21] All 8 Canonical Master Diorama Keyframes Generated & Deployed (V3)
- **All User Feedback Fully Resolved Across All 8 Frames**:
  1. **Scene 1 (Start & End)**: Facade features official golden YU monogram crest, sparkle star, and "YOUNOYA for every chapter" branding (`scene_1_start.jpg`); over-the-shoulder threshold entry (`scene_1_end.jpg`).
  2. **Scene 2 (Start & End)**: Grand Italian marble-floored luxury boutique with high lantern chandeliers, clean Younoya logo on counter and rear arch wall, authentic photoshoot keepsakes on shelves (`scene_2_start.jpg`); mascot sharing occasion while representative listens attentively with notebook (`scene_2_end.jpg`).
  3. **Scene 3 (Start & End)**: Representative alone in the vaulted gallery curating items into the empty hamper tray (`scene_3_start.jpg`); ends back at the counter where the mascot joyfully views the open hamper with the 3 authentic photoshoot products (`scene_3_end.jpg`).
  4. **Scene 4 (Start & End)**: Clean luxury gift wrapping with dark plum tissue paper and satin ribbon (no stamping) (`scene_4_start.jpg`); handover across the counter of the midnight-navy box featuring the **golden Younoya logo emblem only** (no text) to the happy, consistent mascot (`scene_4_end.jpg`).
  5. **Scene 5 Purged**: Completely removed obsolete Scene 5 assets from public media and creative archives.
- All 8 canonical images synchronized to `younoya-web/public/media/diorama/` and `creative/younoya-scroll-film/diorama/`.
- Updated `storyboard_review.md` artifact for user inspection.

### [2026-09-20] All-Products Page & Finale Routing
- Added `/shop` using the canonical eight-product dataset, with responsive product cards linking to `/product/:handle`.
- The finale Explore the Sanctums button now opens `/shop`; added Shop/All products navigation and changed the product breadcrumb to return to the complete collection.
- Verification: root build exit 0 (2,278 modules); browser checks at 430px, 320px, and 1440px cover the finale link, all eight product names/routes, return breadcrumbs, direct reload, no overflow, and zero page errors.
- User explicitly requested apply and push; GitHub origin/main was checked before the final commit and push. Previous local story/navigation commits are included in the authorized push.
- Removed an embedded access token from the legacy deployment guide without using it. Token rotation remains a user action because historical commits retain it.
- Next: verify the GitHub push result and allow the existing Cloudflare CI deployment to complete. No direct production deployment or checkout transaction performed.
### [2026-09-20] Collection Click Targets, Mobile Footer & Chapter Navigation
- Second-section cards now link to their product pages across photo, title, and body. Reserve and Discover remain separate controls. Delayed pointer capture and drag suppression distinguish browsing from tapping.
- Mobile price and buttons use separate rows, with fully visible 40px-tall actions; verified at 430px and 320px as well as desktop.
- Replaced the numbered chapter bar with a translucent panel showing the current chapter in editorial type, subtle direct-jump markers, and previous/next controls. The final arrow continues into the collection. Compact phones retain chapter access via arrows.
- Verification: root production build passed; desktop/mobile browser checks cover card clicks/taps, Reserve bag action, keyboard routing, drag suppression, navigation in both directions, button bounds, and no horizontal overflow. No production transactions.
- Next: review locally, then explicit push approval. No push or deployment performed.
### [2026-09-20] Scroll-Controlled Story Homepage Implemented (Codex)
- User confirmed mouse-wheel/trackpad scrolling controls the story, with subtle pointer depth.
- Replaced the mounted VertexHero with StoryFilm; preserved the existing approved 32-second portrait master, product routes, collection, and bag.
- Added an authentic hamper opener, four editorial chapters timed to actual product arrivals, keyboard-accessible chapter navigation, collection exit, and native cursor visibility.
- Hardened Blob seeking, touch priming, media failure handling, URL-bar resize geometry, reduced-motion and data-saving still experiences; fixed Lenis animation cleanup and homepage hash entry.
- Added keyboard collection browsing and protected product/button clicks from drag capture. No production checkout or backend writes.
- Verification: root build exit 0; full 32-second seek range and no overflow/page errors at 1440x900, 390x844, 320x568, and 844x390; forward/backward seek, 4x CPU rapid-scroll, media failure, reduced-motion/data-saver, product link, local bag add, and hash navigation passed. Three original clip seams visually inspected.
- Updated `.agents/memory/scroll_film_engine.md` with the actual active engine and separated the future hamper-film brief from production media.
- Limitations: same approved portrait source is framed on desktop; real iOS device QA remains outstanding; existing checkout is a frontend demo. No new video generation, push, or deployment performed.
- Previous handoff recorded `f9f84ff` pushed by Antigravity; this note preserves that prior milestone and does not imply these new changes were pushed.
- Next: user review of the local preview, explicit push permission, then deployment verification if authorized. Existing commerce/backend roadmap remains below.
### [2026-09-20] `/lets-scroll` Architecture, 48 FPS Analysis, Macro/Climax Keyframes & Video Prompts Deployed
- **48 FPS vs 24 FPS vs GIF Architectural Decision**:
  - **GIFs Rejected**: Completely unusable for scroll scrubbing. HTML `<img>` elements playing GIFs cannot be scrubbed to arbitrary timestamps via JS; file size balloons to 120–300 MB; 256-color limit causes catastrophic banding on dark celestial gradients.
  - **48 FPS AI-Interpolated Video Recommended**: Doubles frame density (480 frames over 10s = ~5px per frame), providing buttery micro-scroll fluidity on 120Hz ProMotion displays (MacBooks, iPhones). File size increases only 25–35% (~3.8 MB) due to H.264 temporal compression. Decoded with zero CPU load via GPU silicon.
- **Keyframe Assets Generated for Video Conditioning (`generate_image` + `2026_09_09/`)**:
  - `younoya-hamper-macro-detail-16x9.jpg`: Macro close-up on opened ruby apple candle and raw amethyst crystal brass urn.
  - `younoya-hamper-radiance-climax-16x9.jpg`: Climax illumination with glowing golden constellation arcs, fine stardust, and sacred gold Jhula swing altar.
  - Synced to `creative/younoya-scroll-film/` and `younoya-web/public/media/`.
- **Production Prompts & FFmpeg Pipeline Authored (`creative/younoya-scroll-film/PROMPTS_AND_FPS_GUIDE.md`)**:
  - Architecture A (Single-Take 10–12s Hero Video for Seedance 2.0 / Kling / Runway).
  - Architecture B (2-Leg Seamless Dive & Climax Chain).
  - Mobile 9:16 Native Portrait Prompt.
  - FFmpeg `minterpolate` 48 FPS command and small GOP (`-g 8` desktop / `-g 4` mobile) seek-friendly encoding pipeline with in-memory Blob seek.
- **Build Verification**:
  - `npm run build` compiled 2,276 modules with exit code 0.

### [2026-09-20] Brand Identity System Synchronization & Real Photoshoot Reference Frames Deployed
- **Real Photoshoot Conditioning Frames Rebuilt (`generate_image` + `2026_09_09/`)**:
  - Rebuilt the first-tile hero conditioning imagery directly using authentic physical products from the camera photoshoot archive (`F:\Savvy_Ecom\2026_09_09/`):
    - `1A8A2284.JPG`: Signature metallic ruby-red apple candle (opened with botanical wax blend & decorative lid).
    - `1A8A2075.JPG`: Ornate carved brass vessel crowned with a natural raw purple amethyst cluster.
    - `1A8A2150.JPG`: Consecrated gold sacred heirloom swing altar with peacock motif and ceremonial cups.
  - Curated the 2–3 products inside a handcrafted dark woven tray with brushed brass trim on midnight ink navy and royal deep plum satin velvet.
  - Floating golden constellation arcs and fine stardust in deep celestial atmosphere.
  - Formatted strictly to brand guidelines:
    - **Landscape (`16:9`)**: Hamper framed on the right half with clean dark negative space on the left for hero typography & CTA overlay.
    - **Portrait (`9:16`)**: Hamper framed in the lower-middle with clean vertical breathing room at top and bottom for mobile UI.
    - Zero baked-in text, typography, or logos.
  - Generated and copied to:
    - `creative/younoya-scroll-film/younoya-hamper-hero-landscape-16x9.jpg`
    - `creative/younoya-scroll-film/younoya-hamper-hero-portrait-9x16.jpg`
    - `younoya-web/public/media/younoya-hamper-hero-landscape-16x9.jpg`
    - `younoya-web/public/media/younoya-hamper-hero-portrait-9x16.jpg`
- **Full Brand Identity Document Synchronization Across All Documentation**:
  - Updated `AGENTS.md` and `.agents/AGENTS.md`: Core mission, core promise (*“Astrology-backed gifting, curated for what matters”*), 2–3 product gift hamper curation, and authentic photoshoot grounding.
  - Updated `.agents/context/domain.md`: Brand essence, positioning statement, What Younoya Is vs What Younoya Is NOT, 22–45 target demographic, 8 primary collections by intention, 5-step toolkit flow, and ethical guardrails (no fear-mongering, no medical claims, astrology in background).
  - Updated `.agents/context/glossary.md`: Comprehensive Brand Color Palette (Ink Navy `#080B14`, Deep Plum `#1A0A17`, Dark Aubergine `#120712`, Mauve Plum `#2D1429`, Warm Ivory `#FAF6EE`, Muted Gold `#D6B06A`, Highlight Gold `#F0D08F`, Ruby Signal `#A41517`, Celestial Blue `#8CA8C8`), typography rules, and 3 image styles.
  - Updated `.agents/context/project.md`: Product photoshoot grounding (`2026_09_09/`), updated proposition, media reference paths.
  - Updated `.agents/memory/gift_intentions.md`: Curated gift hamper architecture (candle + crystal in vessel + sacred gold heirloom), 8 primary collections, 5 sacred sanctums table, and 5-step personalisation toolkit flow.
  - Updated `.agents/memory/scroll_film_engine.md`: First tile hero concept, 4-stage scroll scrubbing progression (0–20%, 20–50%, 50–80%, 80–100%), video duration (10–12s), static poster fallback, and blob seeking architecture.
  - Updated `.agents/YOUNOYA_PLATFORM.md`: Platform system overview aligned with website identity document.
- **Build Verification**:
  - Verified with `npm run build`: 2,276 modules compiled cleanly in 6.62s with exit code 0. Root `dist/` and `younoya-web/dist/` fully synced.

### [2026-09-20] Unified Default Header, Desktop 3D Cards Shift, Mobile 14% Window Peek & Luxury Typography Deployed
- **Unified Default Header Across Whole Site & First Tile**:
  - Made `Navbar.jsx` the single canonical header across the entire website from `scrollY = 0`, removing `isHiddenOnHome` and `navbar--hero-hidden`.
  - Removed duplicate `.vertex-nav` from `VertexHero.jsx` and `VertexHero.css`.
  - Raised `.navbar` to `z-index: 1000` with subtle frosted transition on scroll.
- **Desktop 3D Rolling Cards Shifted Above**:
  - Shifted `.ring-card` from `top: 616px` to `top: 535px` (an 81px upward shift) and adjusted `perspective-origin: 586px 835px`.
  - Cards now orbit with over 170px prominently displayed in the open space between the CTA button and the floating browser window.
- **Mobile 10–15% Window Peek & Scroll Reveal Animation**:
  - Changed mobile `.vertex-browser` rest state from `top: 46vh / height: 54vh` (which covered half the screen) to `top: 86vh / height: 14vh` (showing only a 14% peek from the bottom).
  - Recalibrated scroll kinematics: `currentTop` glides smoothly from `86vh -> 0px` and `currentH` expands from `14vh -> 100vh`.
  - Repositioned mobile `.hero-stack` (`top: 76px`) and `.vertex-ring` (`top: 285px`), giving the 3D cards the entire middle of the mobile screen to orbit unobstructed.
- **Cartier-Grade Editorial Typography & Decluttered Copy**:
  - Elevated H1 typography from heavy `Cinzel 700` uppercase to `Cormorant Garamond` with Roman & italic pairing: `Objects of Affection` / *`for every chapter.`*
  - Decluttered copy to a single evocative line: *"Astrological guidance & 108× consecrated heirlooms."*
  - Expanded 3D card spacing from 37 cards down to 24 cards ($15^\circ$ step), widening the gap between adjacent cards to $\approx 103\text{px}$.
- **Build Verification**:
  - `npm --prefix younoya-web run build` and root `npm run build` compiled 2,276 modules cleanly in 6.36s with zero errors. All assets synced to root `dist/`.
- **Mobile 3D Ring Orbit & Framing Fixed**:
  - Repositioned `.vertex-ring` on mobile to `top: 172px` with `perspective: 440px` and responsive radius `R = Math.min(320, window.innerWidth * 0.82)`. Cards (`74px × 154px`) now orbit majestically in 3D right behind the headline, fully visible at rest.
  - Adjusted mobile `.vertex-nav` to `width: calc(100vw - 20px); max-width: 390px; height: 46px; border-radius: 23px;` with compact button sizing (`height: 28px`), guaranteeing zero clipping on any phone.
  - Compacted mobile `.hero-stack` (badge 26px, H1 `clamp(18px, 5.4vw, 23px)`, sub 8.5px, button 32px) so text and 3D cards frame each other with Cartier-grade spatial hierarchy.
- **Scroll-to-Expand Kinematics & Navbar Coordination**:
  - Wired `navRef` to fade out the top Atelier nav pill together with `heroCopy` (`heroOpacity`), preventing hero pill from awkwardly overlapping the expanding window.
  - Configured `Navbar.jsx` to reveal the global sticky navbar on home only when `window.scrollY > window.innerHeight * 0.8`, providing a pristine transition into the permanent site header.
- **Seamless Website Continuation After Scroller ("New Window Opens Should Be Continued The Main Window")**:
  - Replaced duplicate static card list inside `.vertex-browser` with the **Five Sacred Sanctums Gateway** (`Love & Connection`, `Confidence & Power`, `Vitality & Balance`, `Wealth & Prosperity`, `Sacred Threshold`) and a downward continuation beacon (`ENTER 3D SANCTUMS ↓`).
  - Tuned mobile track height from `220vh` to `160vh` (`min-height: 1100px`) and reduced `FlowShowcase` top padding, completely eliminating empty black voids.
  - As the window finishes expanding to 100vw × 100vh full screen, natural document scrolling immediately glides the user straight into the interactive 3D spatial carousel (`<FlowShowcase />`). The opened window literally continues as the main website.
- **Desktop Visual Polish & Bug Fixes**:
  - Fixed desktop `heroCopy.style.transform` bug where an extraneous horizontal `translate(-50%)` shifted the 1172px wide stack 586px off-center to the left. Hero is now centered on all desktop viewports.
  - Removed Windows default white browser scrollbar from `.browser-pagebody` by enforcing `scrollbar-width: none; overflow-x: hidden; ::-webkit-scrollbar { display: none; }`.
- **Automated Headless CDP Verification**:
  - Captured full responsive scroll timelines on Edge headless at `390×844` (mobile: 0px, 250px, 450px, 650px, 850px) and `1440×900` (desktop: 0px, 400px, 800px).
- **Build Verification**:
  - `npm --prefix younoya-web run build` and root `npm run build` compiled 2,276 modules cleanly in 6.49s with zero errors. All assets synced to root `dist/`.

### [2026-09-20] 3D Perspective Cylinder Hero & Scroll-to-Expand Storefront Window Deployed
- **Architectural Transformation**:
  - Implemented the 3D perspective spatial cylinder stage authored at fixed `1172×657px` canvas scaled via `k = min(vw / W, vh / 560)`:
    - **Top Atelier Nav Pill**: Celestial gold orbit mark, `YOUNOYA / OBJECTS OF AFFECTION`, navigation links, and signature foot-glow CTA button.
    - **Pixel Contract A (Sacred Badge)**: Exact 250×39px dark glass tile (`12px` radius) with gold icon tile and left-aligned `✦ Consecrated Vedic Keepsakes` label (starting at x=45px, zero overlap).
    - **Pixel Contract B (Signature Foot-Glow Button)**: Multi-stop gold/amber gradient pooled at button foot, clipped by button's rounded corners, side-light mask, and top highlight streak on nav button.
    - **3D Cylinder Card Ring**: True 3D perspective cylinder ($R = 891\text{px}$, perspective $891\text{px}$, 37 cards) rotating at $1.9^\circ/\text{s}$ with angular culling at $|a| > 42^\circ$ for 60fps performance.
    - **Local Photoshoot Integration**: Loaded all 10 card creatives from project photoshoot archives (`/media/*.webp`), completely bypassing external CloudFront URLs.
- **Scroll-to-Expand Kinematics ("Window Comes Out As The Website Window")**:
  - Housed hero inside a sticky scroll track (`height: 230vh`).
  - As user scrolls (`progress: 0.0 -> 1.0`):
    - Headline, badge, and 3D background cards gently dissolve into z-depth (`opacity: 1 -> 0`, `translateY: 0 -> -45px`).
    - Floating macOS browser window mockup (`younoya.com / sacred-sanctums`) sitting in front of the ring scales up, translates from `top: 558px -> 0px`, flattens its border radius (`28px -> 0px`), and expands to $100\text{vw} \times 100\text{vh}$ full viewport!
    - Internal storefront preview becomes the live, full-screen website storefront, seamlessly flowing into `FlowShowcase` and `Finale`.
- **Global Navbar Coordination**:
  - Configured `Navbar.jsx` with `navbar--hero-hidden` state: hidden while at rest at the top of the homepage to showcase the 3D canvas pill, then smoothly fades into view once scrolled past the hero threshold. Always visible on dedicated PDPs (`/product/:handle`).
- **Files Created & Modified**:
  - `younoya-web/src/components/VertexHero.jsx` (React 19 spatial hero component).
  - `younoya-web/src/styles/VertexHero.css` (Exact coordinate table, 3D perspective styles, foot-glow buttons, tablet ramp, mobile flow layout).
  - `younoya-web/src/pages/Home.jsx` (Integrated `VertexHero` as 1st tile).
  - `younoya-web/src/components/Navbar.jsx` & `younoya-web/src/styles/Navbar.css` (Hero scroll-fade transition).
  - `vertex-hero.html` (Standalone, self-contained single-file prototype in repository root).
- **Build Verification**:
  - `npm --prefix younoya-web run build` and root `npm run build` exited with code 0 (2,276 modules built in 6.27s).


### [2026-09-20] Dedicated Cartier-Grade PDPs Deployed & Mobile/Spatial Flow Issues Fixed
- **FlowShowcase Polish (Screenshot 1 Fix)**:
  - Removed bottom controls (`← 01 02 03 04 05 →`) and instruction text (`DRAG • SCROLL • GLIDE...`) in [`FlowShowcase.jsx`](file:///F:/Savvy_Ecom/younoya-web/src/components/FlowShowcase.jsx) and [`FlowShowcase.css`](file:///F:/Savvy_Ecom/younoya-web/src/styles/FlowShowcase.css).
  - Removed stray `CursorAura` component and its span elements from [`Home.jsx`](file:///F:/Savvy_Ecom/younoya-web/src/pages/Home.jsx), completely eliminating the frozen gold ring and dot.
  - Added "Discover Sanctum ↗" link on each 3D card navigating to `/product/:handle`.
- **First Tile Mobile Scroll Black Void Fix (Screenshot 2 Fix)**:
  - Updated `.film__sticky` in [`CinematicHome.css`](file:///F:/Savvy_Ecom/younoya-web/src/styles/CinematicHome.css) from `100svh` to `height: 100vh; height: 100dvh; min-height: 100dvh;` so expanding mobile viewports on scroll never reveal a void.
  - Recalibrated mobile `.film__video` to `top: -24%; height: 148%; width: 100%; object-fit: cover; object-position: 50% 50%;` to push baked-in video letterboxes off-screen on tall 19.5:9 and 20:9 mobile displays.
  - Adjusted `.film__chapter` and `.film__progress` bottom positioning with `clamp()` for safe gesture-bar clearance.
- **Dedicated Luxury Product Detail Page (PDP) System**:
  - Created canonical dataset [`younoya-web/src/data/products.js`](file:///F:/Savvy_Ecom/younoya-web/src/data/products.js) containing all 8 keepsakes (`love-connection`, `confidence-personal-power`, `vitality-inner-balance`, `wealth-prosperity`, `hero-threshold`, `beetle-keepsake`, `toucan-keepsake`, `dream-jar`) with Vedic consecration specs, materials, unboxing details, and INR pricing.
  - Created [`younoya-web/src/pages/ProductDetail.jsx`](file:///F:/Savvy_Ecom/younoya-web/src/pages/ProductDetail.jsx) with Cartier-grade interactive gallery, astrological resonance pill, custom scroll inscription intake, 4 wax seal choices, and 4 expandable accordions.
  - Created [`younoya-web/src/styles/ProductDetail.css`](file:///F:/Savvy_Ecom/younoya-web/src/styles/ProductDetail.css) with responsive mobile & desktop styles.
  - Registered `/product/:handle` in [`younoya-web/src/App.jsx`](file:///F:/Savvy_Ecom/younoya-web/src/App.jsx) with a `ScrollToTop` listener.
  - Updated [`Navbar.jsx`](file:///F:/Savvy_Ecom/younoya-web/src/components/Navbar.jsx) to link brand mark cleanly to `/`.
- **Build Verification**: Ran `npm --prefix younoya-web run build` and root `npm run build`; 2,274 modules compiled cleanly in 5.90s with zero errors.

### [2026-09-20] Transitioned to OpenAI Codex & Enforced Push Permission Hard Rule
- **Cursor Files Removed**: Deleted `.cursorrules` and `.cursor/` directory.
- **Codex Native Configuration Deployed**: Created root [`CODEX.md`](file:///F:/Savvy_Ecom/CODEX.md) (auto-loaded by OpenAI Codex CLI) and root [`AGENTS.md`](file:///F:/Savvy_Ecom/AGENTS.md) pointing directly into `.agents/` SSOT.
- **Enforced NON-NEGOTIABLE HARD RULE**:
  1. **Never Push Without Explicit User Permission**: No agent or script may run `git push` automatically. On every change, after local build verification and committing, the agent MUST ask the user: *"Would you like me to push these changes to GitHub now?"* Without explicit user approval, do NOT push.
  2. **Single Final Commit Only**: No incremental micro-commits for scratch edits or checkpoint hash updates.
- **Updated All System Rules**: Updated `.agents/rules/git.md`, `.agents/rules/checkpoint-protocol.md`, `.agents/AGENTS.md`, `.agents/workflows/git_workflow.md`, and `.agents/workflows/checkpoint_handoff_workflow.md`.

### [2026-09-20] Enforced Single Final Commit Law (No Micro-Commits) Across All Agent Rules
- **Rule Codified**: Prohibited incremental micro-commits for individual file edits and separate follow-up commits for commit hash updates.
- **Root Rationale**: Every commit pushed to `origin main` triggers a Cloudflare Workers CI build and attempts a production deployment. Multiple micro-commits waste CI build slots and risk deploying incomplete states.
- **Updated Specifications**:
  1. Updated `.agents/rules/git.md`: Added mandatory Single Final Commit Law section and consolidated 5-step commit/push sequence.
  2. Updated `.agents/rules/checkpoint-protocol.md`: Added Rule 4 requiring atomic bundle commits.
  3. Updated `.agents/AGENTS.md`: Updated Section 6 with Single Final Commit Law.
  4. Updated `.cursorrules` and `.cursor/rules/agentic-scaffold.mdc`: Aligned Cursor rules so Cursor and Antigravity follow the exact same single-commit discipline.
  5. Updated `.agents/workflows/git_workflow.md`: Standardized step-by-step instructions.

### [2026-09-20] Configured Cloudflare Worker Static Assets (`npx wrangler deploy`)
- **Dashboard Analysis**: User shared Cloudflare dashboard showing project `ecom` is a **Cloudflare Worker with Static Assets** (using Version History & Traffic Splitting), NOT legacy Pages.
- **Root Cause Identified**: Previous commits used `wrangler pages deploy` (which failed with code 10000 because `ecom` is not a Pages project) or a no-op deploy (which succeeded in build logs but didn't register a new version in Version History, keeping the active deployment stuck at `3d76e91f` from 16h ago).
- **Resolution**:
  1. Configured `younoya-web/package.json`: `"deploy": "npx wrangler deploy"`. When Cloudflare CI runs `npm run deploy`, Wrangler uploads the static assets in `dist/` and registers a new active version in Version History.
  2. Restored `younoya-web/wrangler.jsonc` and root `wrangler.jsonc` to the Worker Static Assets schema (`assets: { directory: "dist", html_handling: "auto-trailing-slash", not_found_handling: "single-page-application" }`).
  3. Tested `npx wrangler deploy --dry-run` in `younoya-web/`: successfully read all 30 files from `dist/` with zero errors.
  4. Updated documentation in `CLOUDFLARE_PAGES_SETUP.md`.

### [2026-09-20] Merged "Replace Existing Frontend" (`965a36ca-d445-4600-a7fa-0abb9e982227`)
- **Native React `FlowShowcase` Component**: Extracted the Léo Parpeix 3D spatial flow animation from the injected bundle in conversation `965a36ca-d445-4600-a7fa-0abb9e982227` and converted it into a first-class, maintainable React component ([`younoya-web/src/components/FlowShowcase.jsx`](file:///F:/Savvy_Ecom/younoya-web/src/components/FlowShowcase.jsx)) and CSS module ([`younoya-web/src/styles/FlowShowcase.css`](file:///F:/Savvy_Ecom/younoya-web/src/styles/FlowShowcase.css)).
- **Integrated into `Home.jsx`**: Rendered `<FlowShowcase />` seamlessly between `<ScrollFilm />` and `<Finale />`.
- **Integrated Sacred Sanctum Stills**: Copied the 5 optimized WebP intention stills to [`younoya-web/public/media/`](file:///F:/Savvy_Ecom/younoya-web/public/media):
  1. `love-connection.webp` (SANKALPA I — Love & Connection, ₹4,800)
  2. `confidence-personal-power.webp` (SANKALPA II — Confidence & Power, ₹5,400)
  3. `vitality-inner-balance.webp` (SANKALPA III — Vitality & Balance, ₹4,200)
  4. `wealth-prosperity.webp` (SANKALPA IV — Wealth & Prosperity, ₹6,200)
  5. `hero-threshold.webp` (SANCTUARY — Sacred Threshold, ₹7,500)
- **Direct Cart Hookup**: Clicking "Reserve Keepsake ↗" invokes `useCart().addToCart(...)` and automatically slides open the `CartDrawer`.
- **Hero Video Edge-to-Edge Fix**: Applied full-bleed video scaling (`top: -21.1%; height: 142.2%; object-fit: cover`) and refined gradient shade in `CinematicHome.css` to eliminate letterboxing voids across all viewports.
- **Build Verified**: Verified `npm run build` in `younoya-web` and from root (2,271 modules built in 4.12s, zero errors).

### [2026-09-20] Codebase Unification & 7-Subsystem Architecture
- **Consolidated Storefront**: Migrated active React 19 application from untracked `Ecom_Test/` into canonical [`younoya-web/`](file:///F:/Savvy_Ecom/younoya-web). Cleaned up dependencies, package naming, and Vite build configuration. Verified `npm run build` exits 0.
- **Eliminated Redundancies**:
  - Deleted untracked duplicate workspace `Ecom_Test/`.
  - Deleted 50.6 MB `creative/younoya-scroll-film.zip`.
  - Deleted redundant root `younoya-scroll-film/` folder (consolidated under `creative/younoya-scroll-film/`).
  - Deleted unused Python wheels `imageio-ffmpeg` (6.5 MB).
  - Deleted obsolete August 2026 legacy docs (`workflow.md`, `agent.md`) after capturing all relevant knowledge.
- **Preserved Valuable Assets**:
  - Safely preserved `2026_09_09/` (283 raw camera photoshoot JPGs, ~2.4 GB).
  - Preserved design specs and handoff notes under `.agents/context/references/`.
- **Deployed Agentic Architecture Scaffold**: Created full 7-subsystem `.agents/` structure (`rules/`, `context/`, `memory/`, `checklists/`, `workflows/`, `agents/`) plus root [`.cursorrules`](file:///F:/Savvy_Ecom/.cursorrules).

### [2026-09-19] 4-Leg Portrait Scroll-Scrubbed Hero Film Approved & Integrated
- Active video master: `/media/younoya-category-film-mobile.mp4` (32s, 720×1280, 24fps H.264).
- Seam validation passed: 4 legs frame-locked with zero watermark.
- Video loads as Blob object URL to ensure reliable seekability across viewports.
- 4 Intention bands synchronized to scroll progress.
- Mascot and personalization form removed from homepage to preserve cinematic minimalism.

---

## 3. 🎯 Active Roadmap & Immediate Next Steps

1. **Desktop film production**: Extend all eight original story endpoints to consistent native 16:9 without cropping, render the seven authored desktop pairs, measure seams, then add responsive source selection and measured timing. The current desktop viewport still crops the portrait master.
2. **Commerce and astrology integration**: Connect cart and product data to Medusa, then replace the guide's disclosed local solar-sign preview with authenticated birth-chart and conversational services. Preserve the user's rule against budget-based choice or filtering.
3. **Production sync**: Review current working-tree diff, prepare one final commit with code/assets/checkpoint, and request explicit user authorization before any new `git push` or deployment. Verify on real iOS hardware for video seek performance.

---

## 4. ⚠️ Inviolable Architectural & Media Constraints

> [!WARNING]
> DO NOT violate these rules without explicit user instructions:
> 1. **No Catalog Slop on First Screen**: The first screen must stay sparse: brand mark, one thought ("A gift should feel inevitable"), and the cinematic film. Do not re-add large product carousels or form inputs to the hero.
> 2. **Preserve the Current Story Film**: The active portrait master is `younoya-diorama-film-mobile.mp4` (26.75s, seven source legs with six blended joins). Do not revert to the old category film or obsolete landscape prototype.
> 3. **Preserve Blob Video Seeking**: Always load the film as a `Blob` in `StoryFilm.jsx` (mounted by `Home.jsx`) to prevent seek-range lockups on static servers.
> 4. **Guide Scope**: The homepage film keeps its pictured mascot, but `/find-a-gift` now uses transparent expression images of the boutique representative. Do not reintroduce the Aster PNG into the active guide.
> 5. **No Build on VPS**: Never run `npm run build` on the VPS (956MB RAM OOM).

---

## 5. 🛠️ Verification & Health Commands

| Command | Working Directory | Expected Result |
|---|---|---|
| `npm run build` | Root (`F:\Savvy_Ecom`) | Compiles `younoya-web` to `dist/` with 0 errors |
| `npm run dev` | Root (`F:\Savvy_Ecom`) | Starts Vite dev server at `http://localhost:5173` |
| `npm run serve` | Root (`F:\Savvy_Ecom`) | Serves production build at `http://localhost:3000` |
| `npm run build` | `younoya-web/` | Builds ~2,271 modules in <5s |
| `npm run dev` | `backend/` | Starts Medusa backend on port 9000 |
