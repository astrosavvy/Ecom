# YOUNOYA — Living Checkpoint & Multi-Agent SSOT

> **SSOT**: Mandatory turn start (Step 1) & turn finish (Step 4) reference for all agents (Codex, Antigravity, Claude Code).

## 1. 📍 Status & Topology
- **Phase**: Phase 20 — Rounded bag drawer redesign verified on `origin/main` (`a2b5bfe`).
- **Last Update**: 2026-09-29T23:33:22+05:30 | **Agent**: Codex
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
- `npm run build`: Exits 0 (builds frontend, generates 16 crawlable route shells + 11 admin shells, syncs `dist/`).
- `npx wrangler deploy --dry-run`: Exits 0 (validates 171 assets).
- **Roadmap**: (1) Connect storefront bag to live Medusa 2.18 REST checkout endpoints on `api.younoya.com`. (2) Public launch: merge `prepare-to-launch` to `main`.
