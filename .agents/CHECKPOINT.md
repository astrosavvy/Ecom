# YOUNOYA — Living Checkpoint & Multi-Agent Handoff Journal

> [!IMPORTANT]
> **MULTI-AGENT SSOT**:
> Any agent (**Codex**, **Antigravity**, **Claude Code**, or automated pipeline) MUST read this file at the start of every turn to know the current state and what to do next. When concluding a turn or completing a milestone, the agent MUST update this document.

---

## 1. 📍 Executive Project Status

- **Current Phase**: Phase 3 — 3D Spatial Perspective Hero & Scroll-to-Expand Storefront Window Complete
- **Status**: 🟢 Healthy (Zero build errors, 3D cylinder ring active, scroll-to-expand window live)
- **Active Task**: Local changes verified and committed; awaiting user push permission
- **Last Updated**: 2026-09-20T12:05:00+05:30
- **Last Agent**: Antigravity
- **Primary Development URL**: `http://localhost:5173/` (`npm --prefix younoya-web run dev` or root `npm run dev`)
- **Primary Production Build**: `younoya-web/dist` and root `dist/` (verified: 2,276 modules built in 6.27s, zero errors)

---

## 2. 🏁 Checkpoint History & Completed Milestones

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

When starting the next turn or feature, proceed in this exact sequence:

1. **Task 1: Storefront Commerce Route Expansion**
   - Connect the luxury cart drawer (`src/components/CartDrawer.jsx`) to Medusa 2.18 cart endpoints (`POST /store/carts`, `POST /store/carts/:id/line-items`).
   - Add routes in `younoya-web/src/App.jsx` for `/shop`, `/product/:handle`, and `/checkout`.
   - Ensure products in the 4 gift-intention categories link to real Medusa product data.

2. **Task 2: Dedicated Personalization Route (`/personalise`)**
   - Implement the sacred birth parameters intake (DOB, TOB, POB, Name).
   - Wire with ephemeris & numerology calculation engine (12 Moon signs × 9 Antardashas -> 4 intentions).
   - Keep the homepage clean and cinematic while making the personalization journey an intentional, dedicated route.

3. **Task 3: Production Sync & Deploy**
   - Test `npm run build` in `younoya-web/`.
   - Push to `main` branch to trigger Cloudflare Pages auto-deploy.
   - Verify edge delivery at `https://younoya.com/`.

---

## 4. ⚠️ Inviolable Architectural & Media Constraints

> [!WARNING]
> DO NOT violate these rules without explicit user instructions:
> 1. **No Catalog Slop on First Screen**: The first screen must stay sparse: brand mark, one thought ("A gift should feel inevitable"), and the cinematic film. Do not re-add large product carousels or form inputs to the hero.
> 2. **Never Swap Out the 32-Second Portrait Master Silently**: The active video master is `younoya-category-film-mobile.mp4`. Do not revert to the obsolete 12s landscape prototype (`younoya-category-film.mp4`).
> 3. **Preserve Blob Video Seeking**: Always load the film as a `Blob` in `Home.jsx` to prevent seek-range lockups on static servers.
> 4. **No Mascot PNG in UI**: `aster-mascot.png` is rejected as a 3D solution. Keep it out of the UI until a real 3D animated model is approved.
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
