# YOUNOYA — Living Checkpoint & Multi-Agent SSOT

> **SSOT**: Mandatory turn start (Step 1) & turn finish (Step 4) reference for all agents (Codex, Antigravity, Claude Code).

## 1. 📍 Status & Topology
- **Phase**: Phase 24 — Backend completion handoff saved; implementation and handoff authorized for origin/main push. Live integrations await backend validation and release.
- **Last Update**: 2026-09-30T15:53:40+05:30 | **Agent**: Codex
- **URLs**: Dev `http://localhost:5173` | Preview `http://localhost:3000` | Prod `https://younoya.com` | API `https://api.younoya.com`
- **Stack**: Frontend Vite 6 + React 19 + Framer Motion + Lenis (Cloudflare Worker `ecom` Static Assets). Backend Medusa 2.18 + PG 15 + Redis (VPS 140.245.7.165 headless REST API via CF Tunnel). Zero VPS admin builds (956MB RAM OOM ceiling).

## 2. 🏁 Consolidated Milestones (Phases 1–20)
- **Phases 1–4 (Foundations)**: 283 raw photoshoot photos grounded (`2026_09_09/`, ~2.4GB). CF Worker assets deployment. Inviolable git laws codified.
- **Phase 5 (Story Film & Aster)**: Blob-scrubbed diorama hero film (`younoya-diorama-film-*.mp4`, GOP4). Aster 120-yr datepicker Vedic gift engine (`/find-a-gift`, strictly intention-only, zero budget filter).
- **Phase 6 (Edge Admin & Medusa)**: 16 React 19 admin modules (`/admin/*`) on edge. `@medusajs/dashboard` disabled on VPS. Permanent disk media (`backend/static/`) with CF CDN caching.
- **Phase 7 (Dual-Branch Strategy)**: `main` hosts Coming Soon facade (`/`) with direct routes; `prepare-to-launch` preserves full diorama film on `/`.
- **Phase 8 (TipTap Editor & Blog)**: Strapi v5-style rich text editor with popover backlinks in admin. Dynamic blog routing, WebP auto-compressor, JSON-LD schemas.
- **Phases 9–14 (10 Heirlooms & 7-Tile Architecture)**: Catalog aligned with documented specs (`productEditorial.js`, P55–P64). Excised fake claims and "Tax included". Built canonical 7-tile Livora layout: Nav, Arched Hero, Dual Features Bento, Trending Finds 5-card grid, Promo Banner, Inspiration Cards, Trust Bar.
- **Phases 15–19 (Shop Polish & Minimal Footer)**: 5 neutral studio product derivatives (`public/media/shop-*.webp`). Truthful symbolism copy. Compact 3-value brand footer with ivory hairlines. Mobile tile height equalization.
- **Phase 20 (Rounded Bag Drawer)**: Warm ivory bag overlay, rounded cards, `Plus Jakarta Sans` tabular numeral prices, reactive `ASTER10` 10% promo, honest inline checkout notice (no dummy alerts). Pushed `a2b5bfe`.
- **Phase 21 (Shop Closing Section & Favicon)**: Rebuilt `/shop` ending after Atelier Inspiration to follow the supplied reference: four truthful benefits in a light rounded band, a community email-request panel, and a warm cocoa footer with brand, shop, explore and help columns. Removed app-download links. Replaced `public/favicon.png` with user-provided `favicon1.png` and used the monogram before the footer wordmark. Email request opens the visitor's email app to contact the atelier because no mailing-list endpoint exists. `npm run build` exited 0 (existing >500KB chunk warning). Visually verified desktop, 430px and 360px layouts, no horizontal overflow, and no app-download links. Committed locally as `a5baaf1`; not pushed.
- **Phase 22 (Distinct Header Logo)**: The full `dist/brand-legacy.webp` wordmark is already present byte-for-byte in `younoya-web/public/brand-legacy.webp`. Changed the shared Navbar to use it instead of the favicon monogram, removed the redundant text wordmark and shop image filter, and sized the logo for the desktop and mobile header. The browser favicon remains `/favicon.png` (byte-for-byte `favicon1.png`); the footer monogram prefix remains. `npm run build` exited 0 on retry after a transient Windows write error in generated `dist/index.html` (existing >500KB chunk warning). Visually verified `/shop` at desktop and 430px; DOM reports distinct logo/favicon URLs and no horizontal overflow. Changes committed locally; explicit push permission still required.
- **Phase 23 (Orderable Gift Guide)**: Rebuilt `/find-a-gift` as a light, animated guest conversation with a procedural articulated 3D Aster, portrait fallback, date picker, place search, recommendation result and OTP login only for save/reopen/order. Added signed guest result, private recommendation offers and bundle editor/import in edge admin, GeoNames historical time-zone lookup, Moon/Antardasha plus numerology/intention paths, Mercury/Ketu matrix, rules-first product choice, optional OpenRouter wording, stock-aware offers, and customer-owned saved results without raw birth data. Added Medusa cart/India shipping/promotion/totals and Razorpay checkout with server signature/payment verification, idempotent callbacks, and browser-session payment recovery. Public product lists filter unlisted recommendation offers; collection/search/sitemap remain public-only. Removed synthetic payment success and placeholder checkout behavior. See `backend/GIFT_GUIDE.md` for release setup.
- **Phase 24 (Backend Agent Handoff)**: User explicitly requested a saved completion plan and push to origin. Created `.agents/handoffs/gift-guide-backend.md` covering baseline `72f4d3d`, implemented files/routes, configuration, completion sequence, acceptance checks and verification limits. It identifies release review items for money units, single-item inventory-link preservation, public-list pagination, revoked offer approval, payment concurrency/webhook/recovery, historical time zones, numerology/matrix rules, auth and ignored backend packaging. Backend agent must resolve these items and run real integration/test-payment checks before enabling live checkout.

## 3. ⚠️ Inviolable System Rules
1. **Explicit Git Push Permission**: NEVER run `git push` without explicit user approval. Always ask first.
2. **Single Final Semantic Commit**: Group all edits, dist, configs, and checkpoint updates into ONE commit. No micro-commits.
3. **Dual Branches**: `main` (production Coming Soon facade) vs `prepare-to-launch` (launch-ready scroll film).
4. **Zero VPS Admin UI**: Medusa dashboard strictly disabled on VPS (`admin: { disable: true }`) to prevent 956MB RAM OOM crashes.
5. **Dynamic Media / Zero Rebuilds**: Admin uploads persist to `backend/static/`, served via CF Tunnel. No frontend rebuilds for content.
6. **No Budget Filtering**: Budget is never an input, filter, or sorting option across the platform.
7. **Blob Video Scrubbing**: Desktop/mobile videos must load via in-memory `Blob` in `StoryFilm.jsx` for smooth frame seeking.
8. **Cloudflare SPA Routing**: No `/index.html 200` rewrite loops in `_redirects`. Use `"not_found_handling": "single-page-application"` in `wrangler.jsonc`.
9. **Strict File Length Law**: Keep components modular, strictly < 100–120 lines (target < 80 lines).

## 4. 🛠️ Verification & Next Tasks
- `npm run build`: Exits 0 (frontend, 16 crawlable route shells, 11 admin shells, synced `dist/`; existing >500KB chunk warning remains).
- Backend `npx tsc --noEmit`, `npm run build`: Exit 0. Focused Jest: 11 tests pass (gift paths, historical time zone, matrix, age boundary, fallback, signed result, product-list visibility, payment validation/idempotency). `npm run lint` could not run because the backend lacks `eslint`.
- `npx wrangler deploy --dry-run`: Exits 0 against the final 178 static assets; no deploy.
- Browser visual test was unavailable because the in-app browser blocked the local dev URL. Backend at port 9000 was unavailable, so OTP, GeoNames, admin catalog, cart and Razorpay could not be exercised end-to-end. No live payment or production deployment attempted.
- **Next release tasks**: Follow `.agents/handoffs/gift-guide-backend.md`, starting with its release review items and backend packaging. Then configure services, verify SMTP, approved offers/stock/location, India INR checkout and Razorpay test payments before backend release. Review the procedural Aster separately. The user authorized this implementation/handoff push to origin on 2026-09-30; future changes still follow explicit push permission rules.
