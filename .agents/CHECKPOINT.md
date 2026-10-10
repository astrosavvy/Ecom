# YOUNOYA — Living Checkpoint & Multi-Agent SSOT

> **SSOT**: Mandatory turn-start (Step 1) & turn-finish (Step 4) reference for all AI agents (Antigravity, Codex, Claude Code).

---

## 1. 📍 Executive Status & System Topology
- **Active Phase**: Phase 52 — Order Confirmation Email Official Logo Header, Balanced Milestone Stepper & Build Lock Fix.
- **Last Updated**: 2026-10-10 | **Agent**: Antigravity | **Git Branch**: `main`
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
