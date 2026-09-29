# YOUNOYA — Living Checkpoint & Multi-Agent Handoff Journal

> [!IMPORTANT]
> **MULTI-AGENT SSOT**:
> Any agent (**Codex**, **Antigravity**, **Claude Code**, or automated pipeline) MUST read this file at the start of every turn to know the current state and what to do next. When concluding a turn or completing a milestone, the agent MUST update this document.

---

## 1. 📍 Executive Project Status

- **Current Phase**: Phase 12 — Boxless Architectural Modernization (Livora SSOT Alignment)
- **Status**: Production-ready on `main`. Transformed `/shop` from enclosed card-in-card boxy containers to an open, continuous, and boxless editorial design directly matching the Livora reference (`media_1790693781175.png`): (1) Hero is completely unboxed — left text sits directly on open warm ivory canvas, right image is an architectural photograph with smooth corners; (2) USP Bar is completely boxless between two hairline dividers; (3) Purpose section transformed to Livora split layout with zero card boxes; (4) Reviews transformed to Livora split layout with soft unboxed cards; (5) Bento product visual floats freely without inner frame boxes. Build verified exit code 0; Wrangler dry run validated 166 assets. All components strictly under 85 lines.
- **Active Task**: All changes committed locally and verified. Ready for user push approval.
- **Last Updated**: 2026-09-29T20:33:00+05:30
- **Last Agent**: Antigravity
- **Primary URLs**: Dev `http://localhost:5173` | Preview `http://localhost:3000` | Prod `https://younoya.com` | API `https://api.younoya.com`

---

## 2. 🏁 Consolidated Milestone History

### [2026-09-29] Phase 12: Boxless Architectural Modernization (Livora SSOT Alignment)
- **100% Boxless Hero Section (`ShopHero.jsx`, `Shop.css`)**:
  - Removed enclosing card borders, card background wrappers, and drop shadows around the hero.
  - Left editorial text sits freely on the open warm ivory page canvas (`#FAF7F2`) with natural breathing room.
  - Right side is an architectural photography frame (`border-radius: var(--radius-xl)`) holding authentic photoshoot photography with floating collection pill badge.
- **100% Boxless USP Trust Row (`ShopUspBar.jsx`, `Shop.css`)**:
  - Completely excised the white card container, border, and drop shadow.
  - Transformed into an open, airy horizontal row framed only by hairline top and bottom borders (`border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); padding: 32px 0;`).
- **Livora Split Purpose Section (`ShopPurpose.jsx`, `Shop.css`)**:
  - Eliminated the 4 boxed cards (`.livora-purpose__card`).
  - Implemented the Livora 2-column split layout: Left headline (`✦ WHY CHOOSE YOUNOYA / Gifting with sacred purpose`), Right 4 inline items with clean line icons and concise descriptions without card backgrounds or borders.
- **Livora Split Reviews Section (`ShopTestimonials.jsx`, `Shop.css`)**:
  - Implemented the Livora split layout: Left lead column (`✦ WHAT OUR SEEKERS SAY / Loved by thousands of cherished seekers / View All Reviews →`), Right 3 soft review cards.
- **Floating Bento Visual (`ShopPhilosophyBento.jsx`, `Shop.css`)**:
  - Removed the inner box around the center product so the consecrated talisman floats freely on the canvas.
- **Strict File Length Law Compliance (< 85 lines)**:
  - `Shop.jsx`: 81 lines
  - `ShopHero.jsx`: 64 lines
  - `ShopUspBar.jsx`: 38 lines
  - `ShopIntentions.jsx`: 39 lines
  - `ShopPhilosophyBento.jsx`: 53 lines
  - `ShopAmbientBanner.jsx`: 34 lines
  - `ShopPurpose.jsx`: 45 lines
  - `ShopTestimonials.jsx`: 65 lines
- **Verification**:
  - `npm run build`: Exit code 0 (2,383 modules transformed, 16 route shells, 11 admin shells).
  - `npx wrangler deploy --dry-run`: Exit code 0 (166 assets validated).
- **True Full-Width Hero Tile Bar (`ShopHero.jsx`, `Shop.jsx`, `Shop.css`)**:
  - Extracted `ShopHero` into a dedicated full-width container (`.livora-hero-full-wrap`, `width: 100%; padding: 0 clamp(16px, 2.5vw, 40px);`), eliminating narrow boxed container margins and letting the tile bar stretch across the screen matching Livora.
  - Completely excised `.livora-hero-bar__seam-blend`: eliminated the dirty, muddy grey gradient smudge down the center, achieving a clean, crisp architectural 50/50 midline junction.
  - Dedicated Mobile Engine: fluid typography (`clamp(2rem, 8vw, 2.5rem)`), touch-friendly full-width pill buttons (`min-height: 48px`), controlled image aspect ratio (`min-height: 300px; aspect-ratio: 16/10;`), and responsive floating badge positioning that never clips or causes horizontal overflow.
- **Authentic Luxury Intention Photography (`ShopIntentions.jsx`, `Shop.css`)**:
  - Completely eradicated the "absurd and unprofessional" 3D cartoon diorama doll mascot stills (`scene_1_start.jpg` ... `scene_4_start.jpg`).
  - Installed authentic, Cartier-grade physical photoshoot photography:
    - *Courage & Presence*: Golden Jaguar talisman on carved stone and wood pedestal (`confidence-personal-power.webp`)
    - *Growth & Vitality*: Five Sacred Crystal Consecration Jars on illuminated rotunda (`vitality-inner-balance.webp`)
    - *Love & Devotion*: Solid Metallic Ruby Apple Candles with dried botanical core (`love-connection.webp`)
    - *Instinct & Focus*: Raw Amethyst & Obsidian Eye Altar on brass pedestal (`wealth-prosperity.webp`)
  - Upgraded to 3:4 portrait cards with refined gradient scrims and floating pill tags (`Explore Courage →`, `Explore Vitality →`, etc.). Responsive 2x2 grid layout on mobile viewports.
- **Light Luxury Hamper Banner & Bento Typography Polish (`ShopAmbientBanner.jsx`, `ShopPhilosophyBento.jsx`, `Shop.css`)**:
  - Eliminated the jarring `#283328` dark forest green box. Rebuilt `ShopAmbientBanner` as an alabaster luxury card (`#FFFFFF` on `#FAF7F2` with hairline border `#E8E2D8`), rich dark ink serif typography (`#1F1914`), dark pill button (`Discover Curated Hampers →`), and clean macro hamper photography with light-mode carousel buttons.
  - Resolved bento text wrapping in `ShopPhilosophyBento` (`word-break: normal; hyphens: none`), ensuring natural editorial line breaks.
- **Strict File Length Law Compliance (< 85 lines)**:
  - `Shop.jsx`: 83 lines
  - `ShopHero.jsx`: 64 lines
  - `ShopIntentions.jsx`: 39 lines
  - `ShopAmbientBanner.jsx`: 34 lines
  - `ShopPhilosophyBento.jsx`: 53 lines
- **Verification**:
  - `npm run build`: Exit code 0 (2,383 modules transformed, 16 route shells, 11 admin shells).
  - `npx wrangler deploy --dry-run`: Exit code 0 (166 assets validated).
- **Full Tile Bar Hero (`ShopHero.jsx` & `Shop.css`)**:
  - Implemented the full-width architectural tile banner directly matching Livora Interiors (Image 3).
  - Left half: Light-themed warm cream background (`#FAF7F2`) with editorial typography, subtext, dual pill buttons, and avatar social proof.
  - Right half: Authentic luxury brand hamper image (`younoya-hamper-hero-landscape-16x9.jpg`) meeting the left side directly at the middle midline ("joining in mid") with a subtle seam blend gradient and floating rounded collection badge.
- **3-Column "Crafted to Inspire" Bento (`ShopPhilosophyBento.jsx`)**:
  - Exact 3-column split: Left philosophy text + process link, Center high-res brooch visual, Right product spotlight details, price, material swatches, and dark pill CTA.
- **Dark Forest Ambient Hamper Banner (`ShopAmbientBanner.jsx`)**:
  - Rich forest green container (`#283328`) with white typography, gold button, and slider arrows.
- **Strict File Length Standards (< 85 lines)**:
  - All updated components measured strictly under 85 lines (e.g. `ShopHero` 63 lines, `ShopPhilosophyBento` 49 lines, `ShopAmbientBanner` 32 lines).
- **Verification**:
  - `npm run build` compiled 2,383 modules with exit code 0.
  - `npx wrangler deploy --dry-run` passed on 166 assets.
- **Livora Interiors (Image 3) Design Language & Rounded Boxes**:
  - Implemented quiet luxury eggshell palette (`#FAF7F2` canvas, `#FFFFFF` rounded card surfaces, `#E8E2D8` hairline borders, `#241C17` ink).
  - Enforced rounded box styling across all elements (`border-radius: 1.25rem–2rem` on cards; `9999px` on pills and buttons).
- **Strict File Length Standards (< 125 Lines Per File)**:
  - Eliminated monolithic files by decomposing into 17 isolated sub-components:
    - `Shop.jsx` (73 lines) orchestrates `ShopHero` (64 lines), `ShopUspBar` (37 lines), `ShopIntentions` (36 lines), `ShopPhilosophyBento` (53 lines), `ShopAmbientBanner` (29 lines), `ShopCatalog` (60 lines), `ProductCard` (82 lines), `ShopPurpose` (33 lines), `ShopTestimonials` (57 lines), `ShopNewsletter` (45 lines), `ShopFooter` (51 lines).
    - `ProductDetail.jsx` (125 lines) orchestrates `ProductGallery` (60 lines), `ProductBuyBox` (120 lines), `ProductPersonalization` (56 lines), `ProductHighlights` (37 lines), `ProductTabs` (123 lines), `ProductReviews` (55 lines), `ProductRelated` (56 lines), `ProductStickyBar` (17 lines).
    - `Navbar.jsx` (47 lines) with quiet luxury light-mode navigation and `Consult Aster` pill button.
- **Brand Philosophy Bento Banner**:
  - Integrated YOUNOYA's authentic Vedic consecration story with our brand photoshoot hamper (`younoya-hamper-hero-landscape-16x9.jpg`, `younoya-hamper-macro-detail-16x9.jpg`) and a spotlight product card with material swatches.
- **Verification**:
  - `npm run build` compiled 2,383 modules with exit code 0.
  - `npx wrangler deploy --dry-run` validated 166 assets without errors.
- The verified storefront redesign was committed once as `a1114e1` and pushed successfully to `origin/main` (`c6572a3..a1114e1`) after the user explicitly requested `git push`. Cloudflare deployment status remains to be checked.
- Rebuilt the light `/shop` editorial collection and shared product detail page for all ten brooches. Matched P55–P64 source folders to each physical object and prepared 29 optimized gallery WebPs plus ten card derivatives in `public/media/products/`. The original `New_Edited_Pics/` archive remains untouched and untracked.
- Extracted the ten product entries from `YOUNOYA_Brooch_Collection_Updated_Dimensions_Weights_Pricing.docx` into `productEditorial.js`, with documented prices, dimensions, weights, colour, symbolism, astrological framing and wear guidance. Replaced the former Solar Embrace dragonfly with the P55 jaguar as Wild Poise (₹ 2,499); the legacy URL redirects to `/product/wild-poise`. Retained other existing URL handles for link compatibility.
- Replaced unrelated SVG/diorama product imagery, fabricated ratings, ritual/mantra, metal, certification and shipping assertions in the product template with the documented facts and photos. All product pages now have a prominent inline `Personalize me` flow for recipient name and message; distinct notes create distinct bag lines. Removed gallery tabs, story accordions and the personalization popup per user direction.
- Applied warm ivory to the product route, document overscroll, header/cart icon and bag drawer. Removed the cart's unsupported delivery/certification promises and fake order-confirmation screen; the bag clearly states checkout opens soon until a real order endpoint is wired.
- Updated gift recommendations, SEO metadata/route shells, sitemap and `SITE_LINKS.md` for the ten-piece catalog. Verified `npm run build` exit 0 (2,364 modules, 16 crawlable route shells), ten documented prices and 29 gallery paths, filter selection, legacy redirect, responsive light product view and inline personalization-to-bag behavior in the local browser. The Vite >500KB bundle-size warning remains pre-existing/non-blocking.

### [2026-09-29] Shop and Product Detail Redesign Plan (Codex)
- Audited live `/shop` and `/product/the-golden-flight` alongside `Shop.jsx`, `ProductDetail.jsx`, their styles, product data, cart state and brand tokens. The existing light collection has functional intention filters and ten linked products; the dark detail template uses a large symbolic SVG as its lead image, unrelated diorama stills in its gallery, heavy bordered panels and inline note/seal inputs below the initial purchase information. No dedicated `Personalize me` CTA exists.
- Planned a photo-led warm-ivory editorial collection and one reusable detail template for all ten product handles, with restrained reveal, gallery and filter motion; a prominent personalization action opening a focused note/seal editor; and separate personalized cart lines for distinct inscriptions. Keep intention-only filtering, prices, routes, SEO, Coming Soon `/` and reduced-motion behavior.
- Product photo mapping is a prerequisite: the ten current products point primarily to symbolic SVGs while untracked `New_Edited_Pics/` contains 70 numbered photo groups; a sampled P1 image depicts a different object and cannot be blindly assigned. Verify every product-to-image match before publishing. Verify ratings, certification, ritual and delivery claims before retaining them as sales assurances. No build or deployment was run because this was a planning-only request.

### [2026-09-29] Phase 8: TipTap Editor (Strapi v5 Engine), Backlinks, Cloudflare Deploy Fix & Storefront Direct Links
- **Master Site Navigation & Verification Ledger (`SITE_LINKS.md`)**:
  - Authored canonical URL index document in root with direct clickable Markdown links for Production (`https://younoya.com`), Local Development (`http://localhost:5173`), and Local Preview (`http://localhost:3000`).
  - Covers 5 Core Storefront routes, 10 authentic Consecrated Brooches, Editorial stories with backlink validation, 11 Edge-hosted Admin modules (including TipTap block editor), 4 SEO/LLM discovery endpoints, and 9 Medusa headless REST API endpoints.
- **TipTap Rich Block Editor Deployment (`younoya-web/src/admin`)**:
  - Installed `@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-link`, `@tiptap/extension-image`, and `@tiptap/extension-placeholder`.
  - Authored `RichTextEditor.tsx` and `editor.css` with quiet luxury aesthetics.
  - Floating backlink popover + `Ctrl+K` hotkey with internal preset chips (`/shop`, `/find-a-gift`, `/blog`, `/product/*`).
  - Native `linkOnPaste: true`: pasting rich text from Google Docs, Word, or Notion preserves all hyperlinks, bolding, and lists.
  - Built-in converter `convertLegacyMarkdownToHtml` seamlessly opens existing markdown articles in the visual editor.
  - Replaced raw textarea in `JournalEdit.tsx` with `RichTextEditor` and wired real-time styled preview.
  - **Zero Server RAM**: 100% client-side React execution, zero additional memory on the 956MB VPS. Saves clean HTML/JSON directly to the existing Medusa `younoya-blog` module and PostgreSQL database.
- **Storefront & Backlink Typography Polish (`BlogPost.jsx` & `Blog.css`)**:
  - `renderFormattedContent` handles both native TipTap HTML and legacy Markdown without double-wrapping.
  - Click delegation routes internal links via React Router `navigate()` without browser reloads.
  - Updated `.article-backlink` and `.article-prose a` with `display: inline`, warm amber/gold color `#A37B24`, subtle underline, and hover glow matching user reference. Removed disruptive trailing icon.
- **Cloudflare Deploy Infinite-Loop Fix**:
  - Removed lines 6–7 (`/blog/*` and `/admin/*` rewrites to `/index.html 200`) from `public/_redirects` which triggered Cloudflare's canonicalizer loop [code: 100324].
  - Cloudflare natively serves `index.html` for client routing via `"not_found_handling": "single-page-application"` in `wrangler.jsonc`.
  - Tested `npx wrangler deploy --dry-run` (exit code 0 across both root and `younoya-web/`).
- **Storefront Direct Links on `main`**:
  - Root `/` remains exclusively the luxury Coming Soon facade (bottom-half gradient, diorama arrival still).
  - Merged authentic catalog from `prepare-to-launch`: 10 authentic brooches (`products.js`), 10 vector SVG glyphs (`public/media/brooches/*.svg`), Aster gift consultation flow (`/find-a-gift`), and luxury light catalog (`/shop`).
  - All direct links (`/shop`, `/find-a-gift`, `/blog`, `/blog/:slug`, `/product/:handle`, `/admin/*`) load cleanly with zero 404s.
- **Dynamic Blog Post 404 Resolution**:
  - Enabled SPA routing fallback on Cloudflare edge. Dynamic database-published posts (e.g. `/blog/why-younoya-is-different-from-a-traditional-astrology-store`) resolve without 404 trapping.
  - Added crawlable static route shells, JSON-LD `BlogPosting` schemas, and updated `sitemap.xml`, `robots.txt`, and `llms.txt`.
- **Backlinks Engine**:
  - Added "🔗 Add Link" dialog with store shortcuts (`+ Shop Link`, `+ Gift Finder`) in `JournalEdit.tsx`.
  - Authored regex markdown `[text](url)` and HTML `<a>` parser in `BlogPost.jsx`: internal links route via React Router `<Link to="..." className="article-backlink">`; external links open safely in a new tab.
- **Removed Products from Blog Articles**:
  - Excised `.article-keepsakes` product grid from `BlogPost.jsx` per user direction. Articles end cleanly with author attribution and Aster consultation callout.
- **Image Compression Pipeline**:
  - Compressed existing blog covers from ~1.6MB–2.1MB down to ~103KB–119KB WebP (94% reduction) preserving exact dimensions ((1672×941) & (1536×1024)).
  - Built client-side Canvas WebP compressor (`imageCompressor.ts`) in Admin to auto-compress all future uploads before sending to disk.
- **Editorial Blog Redesign**:
  - Streamlined `Blog.jsx` with quiet luxury header, dynamic category pills hiding empty categories, and 16:9 thumbnail grid with reading times.

### [2026-09-26] Phase 7: Production Coming Soon Facade & Full Platform Preservation
- **Coming Soon Landing Page (`main`)**:
  - Authored `ComingSoon.jsx` on `/` with diorama arrival still, multi-stop dark gradient scrim, golden Younoya crest, and VIP private email invite form.
  - Eliminated text carets on typography (`user-select: none`, `caret-color: transparent`) and removed rectangular input outline artifact on focus.
- **Full Platform Preservation (`prepare-to-launch`)**:
  - Preserved complete interactive e-commerce platform (scroll diorama film, 3D cylinder, cart drawer, blog, Aster journey, admin console) on branch `origin/prepare-to-launch`.

### [2026-09-25] Phase 6: Edge-Hosted React Admin Console & Headless Server Architecture
- **Edge-Hosted Admin Console (`younoya-web/src/admin`)**:
  - 16 custom React 19 management modules: `AdminApp.tsx`, `api.ts`, `Login.tsx`, `Journal.tsx`, `JournalEdit.tsx`, `Orders.tsx`, `Customers.tsx`, `Products.tsx`, `ThemeManager.tsx`, `RecommendationRules.tsx`, `Team.tsx`.
- **Backend Headless Enforcement & OOM Protection**:
  - Disabled `@medusajs/dashboard` on VPS (`admin: { disable: true }` in `medusa-config.ts`), protecting the 956MB RAM VPS from OOM crashes.
  - Uploaded media saved permanently to backend disk (`backend/static/`) and served with aggressive Cloudflare edge caching (`max-age=31536000`). Zero frontend rebuilds on content updates.
  - Pre-rendered 11 static admin shells so direct navigation on Cloudflare serves HTTP 200 without redirect loops.

### [2026-09-22 – 2026-09-23] Phase 5: Scroll-Scrubbed Story Film & Aster Gift Consultation
- **Story Film Engine**:
  - Master desktop film: `younoya-diorama-film-desktop.mp4` (24.375s, 1920×1080, GOP4, Blob seeking).
  - Master mobile film: `younoya-diorama-film-mobile.mp4` (26.75s, 720×1280, GOP4, Blob seeking).
  - Responsive viewport switching, frame-snapped seeking throttled to ~20 seeks/sec, and reduced-motion WebP poster fallbacks.
- **Interactive Aster Consultation Flow (`/find-a-gift`)**:
  - Multi-stage guided conversation with transparent boutique representative expressions, 120-year date picker, and solar-sign preview.
  - Strictly intention-only: budget was explicitly barred as a filter, sorting criteria, or form input.
- **Light Editorial Catalog (`/shop`)**:
  - Restyled to warm ivory (`#FAF6EE`), dark typography, and muted gold.

### [2026-09-19 – 2026-09-21] Phases 1–4: Foundation, Photoshoot Grounding & Agentic Memory
- **Physical Photoshoot Grounding**: Preserved `2026_09_09/` (283 raw camera photos, ~2.4GB) as authentic visual basis for ruby apple candle (`1A8A2284.JPG`), raw amethyst brass urn (`1A8A2075.JPG`), and sacred gold swing altar (`1A8A2150.JPG`).
- **Cloudflare Worker Static Assets (`ecom`)**: Standardized deployment via `npx wrangler deploy` with `assets: { directory: "dist", ... }`.
- **Inviolable Governance Rules Codified**:
  - Explicit push permission required before any `git push`.
  - Single final commit rule (no micro-commits).
  - Monorepo directory structure established with 7-subsystem `.agents/` memory architecture.

---

## 3. 🎯 Active Roadmap & Immediate Next Steps

1. **Review and Push**: Review the light collection/PDP in local preview, then request explicit user permission before any push to `origin main`. Verify Cloudflare CI after an authorized push.
2. **Medusa Commerce & Auth Sync**: Connect live storefront cart and checkout to Medusa 2.18 REST endpoints on `api.younoya.com`; remove the checkout-unavailable state only after real order placement is verified.
3. **Full Launch Transition**: When ready for full public launch, merge `prepare-to-launch` into `main` to replace `/` Coming Soon facade with the scroll diorama film.

---

## 4. ⚠️ Inviolable Architectural & Operational Constraints

1. **Explicit Git Push Permission Law**: NEVER execute `git push` without explicit user permission. Always ask first.
2. **Single Final Commit Law**: Group all code, static assets, dist, configs, and checkpoint updates into ONE single final semantic commit. Never create follow-up micro-commits.
3. **Dual Branch Strategy**:
   - `main`: Production branch serving Coming Soon on `/` with all other routes active via direct links.
   - `prepare-to-launch`: Feature-complete platform with scroll diorama hero film active on `/`.
4. **Zero Admin UI on VPS**: Admin console runs purely on frontend edge (`/admin/*`). Never build, compile, or serve Medusa dashboard on the VPS (956MB RAM OOM limit).
5. **Dynamic Media & Zero Rebuilds**: Admin media uploads save to backend server disk (`backend/static/`) and are cached via Cloudflare CDN. Adding content must never require frontend rebuilds or commits.
6. **No Budget Filtering**: Budget will NEVER be used as a filter, sorting mechanism, or recommendation criteria on `/shop` or `/find-a-gift`.
7. **Blob Video Scrubbing**: Always load scroll video via in-memory `Blob` in `StoryFilm.jsx` to ensure smooth frame-by-frame seeking across all browsers.
8. **Cloudflare SPA Routing Law**: Do NOT add `200` rewrites to `/index.html` in `_redirects`. Use `"not_found_handling": "single-page-application"` in `wrangler.jsonc`.

---

## 5. 🛠️ Verification & Health Commands

| Command | Directory | Purpose | Expected Result |
|---|---|---|---|
| `npm run build` | Root (`F:\Savvy_Ecom`) | Full production build & static shell generation | Exits 0, writes to `dist/` |
| `npx wrangler deploy --dry-run` | Root / `younoya-web` | Cloudflare Worker Static Assets validation | Exits 0, validates 126 assets |
| `npm run dev` | Root (`F:\Savvy_Ecom`) | Storefront development server | Runs on `http://localhost:5173` |
| `npm run serve` | Root (`F:\Savvy_Ecom`) | Production preview server | Serves `dist/` on `http://localhost:3000` |
| `npm run dev` | `backend/` | Medusa commerce backend | Runs API on port 9000 |
