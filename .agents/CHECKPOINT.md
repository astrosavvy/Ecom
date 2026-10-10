# YOUNOYA — Living Checkpoint & Multi-Agent SSOT

> **SSOT**: Mandatory turn-start (Step 1) & turn-finish (Step 4) reference for all AI agents (Antigravity, Codex, Claude Code).

---

## 1. 📍 Executive Status & System Topology
- **Active Phase**: Phase 56 — Mobile UX Audit completed locally; awaiting explicit push permission.
- **Last Updated**: 2026-10-10 | **Agent**: Codex | **Git Branch**: `main`
- **Storefront**: `https://younoya.com` (Vite 6 + React 19 + Framer Motion + Lenis, deployed to Cloudflare Worker `ecom` via Git).
- **Backend API**: `https://api.younoya.com` (Medusa 2.18 + Node 20 + PostgreSQL 15 `younoya_db` + Redis on VPS `ubuntu@140.245.7.165` via CF Tunnel).
- **Admin Console**: Hosted exclusively on frontend edge (`https://younoya.com/admin/*`). ZERO VPS admin builds (956MB RAM OOM ceiling).
- **Photoshoot Master**: `2026_09_09/` (283 raw camera photos, ~2.4GB, preserved, gitignored).

---

## 2. 🛑 Hard System Constraints & Inviolable Laws
1. **Explicit Git Push Permission Law**: NEVER execute `git push` automatically. Always stop and ask the user: *"Would you like me to push these changes to GitHub now?"* Only push when explicitly approved.
2. **Single Final Semantic Commit**: NEVER make intermediate or micro-commits. Update `CHECKPOINT.md`, verify `npm run build` exits 0, and batch all changes into ONE final semantic commit.
3. **Backend Update Law (Zero GitHub Involvement)**: Backend changes are built locally (`npm --prefix backend run build`), packaged (`server-src.tar.gz`), copied via SCP (`ubuntu@140.245.7.165`), extracted into `/home/ubuntu/younoya/backend/.medusa/server/`, and restarted with PM2 `younoya-backend`. GitHub is never involved in backend deployments.
4. **Paise Money Convention**: All Medusa pricing and Razorpay amounts are stored and computed in paise (₹1,499 = 149900 paise).
5. **Security & Auth**: OTP auth via PBKDF2-SHA512 with 10-minute JWT session tokens and strict CORS.

---

## 3. 🏁 Consolidated Milestones (Phases 1–52)

### Foundations, Visuals & Cart (Phases 1–20)
- **Brand Architecture**: Grounded in 283 raw photoshoot photos. Scroll-scrubbed hero film chain, 7-tile Livora layout, and 10 authentic brand heirlooms (`productEditorial.js`).
- **Cart & Aesthetics**: Rounded warm ivory cart drawer, `Plus Jakarta Sans` tabular pricing, reactive `ASTER10` promotion, Cartier-grade spatial design tokens.

### Gift Guide & Aster Engine (Phases 21–30)
- **Aster Gift Conversation**: Articulated animated portrait stage (`AsterStage.jsx`), seamless forward-and-return video loop (7.958s, 24fps), adaptive responsive layout (`useGuideLayout`).
- **Gift Engine**: Intention-led Vedic gifting without synthetic budget filters. Edge admin bundle editor and private recommendation offer security guards.

### Admin Studio & Catalog Architecture (Phases 31–35)
- **Luxury Admin Console (`/admin/*`)**: Cartier warm ivory canvas (`#FAF7F2`), pearl cards (`#FFFFFF`), gold hairlines, and `lucide-react` iconography.
- **Management Studios**: Interactive Product Editor modal (lossless WebP compression), Hamper Recommendation Studio (`RecommendationRules.tsx`), and Sanity.io-style Journal Studio (`/admin/journal`) with split live preview.

### Vedic Astrology & Celestial Intelligence (Phases 36–40)
- **VedAstro API**: Lahiri ayanamsa integration for real-time Vimshottari Mahadasha/Bhukti and Moon Sign with FIFO queue and 24h caching.
- **OpenCage Geocoder**: Real-time coordinates search with 500ms debounce and query suppression (<4 chars).
- **96 Vedic Combinations**: Mercury & Ketu 96-combination matrix cataloged from source manuscripts with AI Aster synthesis via OpenRouter (`inclusionai/ling-3.0-flash-sante:free`).
- **Divination Ceremony**: 3-stage animated divination ceremony (`AsterDivinationCeremony.jsx`) with latency-aware hold state.

### Checkout, Shipping & Shiprocket Production (Phases 41–50)
- **Checkout Flow**: OTP-authenticated and guest-cart unified checkout with Razorpay SDK integration.
- **Shiprocket Production Integration**: Live API authentication for `order@younoya.com`, pickup location nickname `"warehouse"` (Company: `YOUNOYA HOUSE OF ASTRO PRIVATE LIMITED`, PIN: `110024`), automated order creation via `POST /v1/external/orders/create/adhoc`, verified live order `#YOU-2026-0004` (Shiprocket ID `1641627893`).

### Packaging, Latency & Email Polish (Phases 51–52)
- **Navratri Box Packaging Persistence**: Length 13" ($33.02\text{ cm}$), Width 9" ($22.86\text{ cm}$), Height 3.5" ($8.89\text{ cm}$), Weight 700g ($0.70\text{ kg}$ dead weight, $1.342\text{ kg}$ volumetric), HSN `62149090` (Sacred ritual textiles). Persisted to PostgreSQL `product_variant`, `product.metadata`, and `commerce_setting.parcels` on VPS.
- **Home Facade & Bubbly Button**: Excised policy links from Coming Soon home facade; added cursor-repelling `BubblyRepelButton` with champagne glassmorphism and spring physics.
- **Checkout Latency Optimization**: Added `preloadCheckout()` on checkout mount to prefetch Razorpay SDK and credentials, dropping checkout launch time from 4–6s to ~1s.
- **Order Confirmation Email Template (`emails.ts`)**:
  - Replaced text header with official gold brand logo `<img src="https://younoya.com/brand.png" width="150" height="87" />` linking to `https://younoya.com`.
  - Rebuilt milestone stepper using a mathematically balanced 3-column table ($33.33\%$, $33.34\%$, $33.33\%$) with 50% internal connecting lines and centered labels, ensuring 100% equal distance between nodes in Gmail, Apple Mail, and Outlook.
  - Zero "View order" button; authentic customer address, item breakdown, and carbon-offset ribbon.
- **Build System Resilience**: Added `safeWriteFile` exponential retry in `generate-seo.mjs` to eliminate transient Windows file-locking errors on `index.html`.

---

## 4. 🗄️ Database & Environment Reference
- **VPS Host**: `ubuntu@140.245.7.165` (SSH key: `$HOME/.ssh/id_ed25519_clean`).
- **PostgreSQL**: `younoya_db` on VPS localhost:5432 (`user: postgres`).
- **Shiprocket**: API user `order@younoya.com`, pickup location nickname `"warehouse"`.
- **Navratri Box SKU**: `YN-NAVRATRI-9D-001`, HSN `62149090`, Dimensions: $33.02 \times 22.86 \times 8.89\text{ cm}$, Weight: $0.70\text{ kg}$.
- **Brand Logo Asset**: `https://younoya.com/brand.png` (276×160px, transparent PNG).

---

## 5. 🎯 Verification & Build Status
- **Backend Build**: `npm --prefix backend run build` exited 0; deployed via SCP and restarted PM2 `younoya-backend` (status `online`).
- **Frontend Build**: `npm run build` exited 0 (22 crawlable route shells, 12 admin shells, synced `dist/`).
- **Visual Verification**: Tested email HTML in Chromium via Puppeteer; confirmed balanced stepper and crisp logo.
- **Commit History**: Single semantic commits following the Inviolable Git Protocol.

## 6. Latest completed turn — 2026-10-10 / Codex
- Edited all four actual box photos from `F:/Savvy_Ecom/9inone` with built-in imagegen: warm ivory surfaces, marigolds and softly blurred brass-toned Durga idols. Main photo retried for a quieter background; product contents and printed branding visually compared with originals.
- Gallery now has ten images: IMG_6055, IMG_6067, IMG_6066, IMG_6060, then the six existing kit details. New main image also used on the Shop tile, with contain sizing to retain the box edges.
- Added original-photo fallbacks, actual intrinsic dimensions, responsive WebP exports (600px / up to 1200px without upscaling), source hashes and recorded prompts. Styling props are explicitly excluded in captions. Originals remain untouched/untracked in `9inone/`.
- Added the requested product heading/subtitle, devotional introduction, five key features, complete contents, product details and gifting copy. Preserved exact daily kit contents, price ₹1,499, SKU, saved identity and checkout. Uses approved wording 'nine devotional offerings'; no unverified material claims or GST-inclusive storefront text.
- Verification: root frontend build exit 0, 22 route shells / 12 admin shells. Fixed Node SEO generator's JSON import attribute. Source whitespace checks passed; existing Vite chunk-size warning remains. Published policy snapshots retained.
- Browser: 360px / 430px / 1024px / 1920px without horizontal overflow; all ten selections, mobile three-column day selector, keyboard Enter on Day 8, saved toggle and add-to-bag verified. Bag restored to original one set / ₹1,499 after testing; no checkout/payment started.
- Failure test: temporarily hidden edited hero files triggered successful original-photo fallback; files restored and no test residue remains. Shop tile loaded with object-fit contain. Metadata/schema includes the new title, description and all ten photographs.
- Evidence: `.tmp/navratri-festive-{desktop,mobile,description}.png`; documentation/prompts/source provenance and verification in `creative/younoya-navratri/`.
- One final local commit prepared. Next: obtain fresh explicit push permission before GitHub/production frontend release. No backend/API changes or SSH deployment needed.

## 7. Latest completed turn — 2026-10-10 / Codex
- Added user-supplied Meta Pixel ID `1812138199833737` for `/product/navratri-shringaar-box` only. Loads the official asynchronous fbevents script on first Navratri visit and initializes once per document.
- Router observer sends one PageView per pathname visit, suppresses React StrictMode effect replay and tracks return visits after leaving the page. No purchase, checkout or customer-field events were added.
- Generated the supplied hidden image fallback inside only the Navratri route shell's noscript content. Other page shells and the global HTML template remain free of this fallback.
- Verification: root frontend build exit 0, 22 crawlable route shells / 12 admin shells, clean distribution synchronized. Existing chunk-size warning remains. Three Node tests pass: delayed provider queue / StrictMode replay / return visit, existing-loader reuse, and route-specific fallback across every built HTML shell.
- Browser: Shop initially has zero pixel scripts; SPA navigation to Navratri loads one; leaving and returning retains one script. No console errors/warnings observed. No bag, checkout or backend changes. Screenshot: `.tmp/navratri-pixel-page.png`.
- One final local commit prepared with implementation, tests, generated output and checkpoint. Next: obtain fresh explicit permission before GitHub push / frontend release; Meta Events Manager receipt should be checked after release. No backend deployment required. Original `9inone/` photographs remain untouched and untracked.
## 8. Push completion — 2026-10-10 / Codex
- User explicitly authorized push. `git push origin main` exited 0; GitHub main advanced from `ba6fa0c` to `15195d8`, including the festive photography/content and Navratri Meta Pixel changes.
- No implementation changes or additional commit created on this push-only turn; previous successful build and three pixel tests remain applicable. This checkpoint note is retained in the working tree for the next implementation commit, respecting the no follow-up checkpoint-only commit rule.
- Original `9inone/` source photos remain untracked and were not pushed. Next: confirm frontend release and Meta Events Manager PageView receipt; backend deployment is not required for these frontend changes.
## 9. Planning-only mobile UX audit — 2026-10-10 / Codex
- User clarified this task must be planned, not edited/built. All implementation edits made earlier in this turn were reverted. Frontend source and distribution match HEAD `15195d8`; no build, commit, push or deployment on this turn. Existing push checkpoint note and untracked `9inone/` originals preserved.
- Read-only audit at 360x800: Shop, Navratri and brooch product pages, checkout, Journal/list/article shells, all five policy routes, gift-guide recipient/name/occasion/intention/birth forms, calendar/time dialogs, private-offer unavailable state, 404, and signed-out order/login screen. Full loaded Journal/home content, authenticated orders and guide results need follow-up verification during the implementation audit; initial snapshots showed loading states for some remote content.
- Root cause of outdated Shop hero: `components/shop/ShopHero.jsx` still hard-codes red-kit images; tile and Navratri gallery use the approved festive-open-box image from `data/navratriPhotos.json`. Plan to source hero from the same first gallery record with responsive sizes, original-photo fallback and contain framing.
- Findings: brooch grid min-content causes overflow (350px scroll width in a 345px content viewport); varied mobile gutters (18/19/20/22/24px and 8vw); generic header taller than Shop/guide and cart/icon controls under 44px; footer form controls below 44px and footer sub-section gutters differ; gift-guide time and city share narrow columns and visibly truncate; calendar month controls 32px wide; brooch gallery/wish/quantity and cart controls undersized; fixed buy bars need safe-area-aware content clearance.
- Plan: unify mobile spacing tokens and header offset; fix intrinsic grid widths and wrapping at their source; align footer/card/form padding; stack birth time/city fields; preserve dialog focus/keyboard behavior and responsive calendar; verify sticky bars, drawers and forms at 320/360/390/430px, short-height mobile, and desktop 1024/1920px.
- Next: present the implementation plan and wait for user authorization to implement. Retain brand palettes, price, product identity, bag/saved selections, guest checkout and Meta Pixel behavior. No backend/API changes expected. Temporary audit browser tab closed and viewport reset.
## 10. Mobile UX audit implementation — 2026-10-10 / Codex
- User authorized completing the remaining implementation. Saved the reviewable plan at `docs/mobile-ux-audit-plan.md` and findings/verification at `docs/mobile-ux-audit-results.md`.
- Corrected the outdated Shop hero: replaced hard-coded red-kit paths with the first approved Navratri gallery record, responsive sources, actual dimensions and original-photo fallback. Contain framing preserves the box; mobile price card sits below the image.
- Added a shared mobile spacing stylesheet after existing page styles: consistent 20px safe-area-aware gutters, 72px header, page clearance, footer edges and input sizing. Fixed narrow brooch grids, wrapped search filters, checkout promotion row, personalization controls, cart controls and safe-area purchase-bar clearance. Aligned policies, Journal, private offers, orders and 404 layouts.
- Stacked gift-guide time/city fields; made calendar labels readable at 320/360px while preserving arrow targets. Short-height guide collapses the portrait; login uses tighter spacing and native scroll. Calendar/time Escape restores trigger focus; sign-in dismisses with Escape.
- Browser checks: 320/360/390/430px and 360x480 short viewport; all ten brooch routes, Navratri, Shop/search/saved, checkout, loaded Coming Soon/Journal/article, five policies, private-offer unavailable, 404, cart, personalization and guide/login controls. Desktop regression checks at 1024x768 and 1920x1080. No horizontal document overflow; decorative promotional background remains clipped. Purchase bar does not cover footer information.
- Hero fallback verified by temporarily renaming edited sources; original photo loaded successfully. Sources restored and approved hero confirmed loading afterward. No console errors/warnings observed on the final page. Evidence: `.tmp/mobile-ux-shop.png`, `.tmp/mobile-ux-shop-desktop.png`.
- Final root build exited 0: 22 crawlable route shells, 12 admin shells, root distribution synchronized. Existing Vite chunk-size advisory remains. All three Meta Pixel tests pass; source whitespace check passed; no temporary hidden image files remain.
- Authenticated order data, protected offers and generated guide results reviewed in source only; physical-device keyboard/autofill/safe-area validation remains manual. No OTP, recommendation submission, payment or order created. Bag remains one Navratri set / ₹1,499; `9inone/` originals untouched and untracked. No backend/API changes or deployment.
- Single final local commit includes source, documentation, distribution and checkpoint. Next immediate action: obtain fresh explicit permission before GitHub push/frontend release. No backend SSH update required.
