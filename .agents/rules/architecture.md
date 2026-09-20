# Architecture Rules (Hard Constraints)

## 1. Storefront & Commerce Separation
- **Storefront**: Single source of truth is [`younoya-web/`](file:///F:/Savvy_Ecom/younoya-web) (Vite 6 + React 19 + TypeScript/JSX + react-router 7).
- **Commerce API**: Single source of truth is [`backend/`](file:///F:/Savvy_Ecom/backend) (Medusa 2.18, PostgreSQL 15, Redis).
- **Creative Pipeline**: Single source of truth is [`creative/younoya-scroll-film/`](file:///F:/Savvy_Ecom/creative/younoya-scroll-film).
- **Raw Photoshoot Material**: Ignored directory `2026_09_09/` contains 283 raw camera photos (~2.4 GB). Never delete or alter original DSLR product photos.

## 2. Ports & Local Routing
- **Storefront Local Dev**: `http://localhost:5173` (Vite dev server).
- **Storefront Preview / Serve**: `http://localhost:3000` (`node serve.js` serving `younoya-web/dist`).
- **Medusa Backend**: `http://localhost:9000` (`backend/`, `npm run dev`).
- **PostgreSQL**: `localhost:5432/younoya` (`postgres:postgres_prod_pass_123`).
- **Redis**: `localhost:6379`.

## 3. Cloudflare Pages & Edge Delivery
- **Pages Project Root**: `younoya-web`.
- **Build Command**: `npm run build` (outputs to `dist/`).
- **Routing**: SPA routing handled by `not_found_handling: "single-page-application"` in `wrangler.jsonc`.
- **Redirects**: `public/_redirects` must stay 2-3 lines only (e.g. `/gifts / 301`). NEVER add catch-all `/* /index.html 200` (causes infinite redirect loop 100324).
- **Static Assets**: Edge cache rules pinned in `public/_headers` for `/assets/*` and `/media/*`.

## 4. VPS Backend Production Rules
- **ZERO BUILD ON VPS**: The VPS (140.245.7.165, Oracle 2vCPU / 956MB RAM) will OOM crash if `npm run build` is run on it.
- **Local Packaging**: Always build locally (`npm run build` in `backend/`) -> package `.medusa`, `src`, `package.json`, `medusa-config.ts` into a tar archive -> transfer via `scp` -> extract on VPS -> run migrations -> restart PM2.
- **Cloudflare Tunnel**: `api.younoya.com` connects via Cloudflare Tunnel to port 80/9000 on the VPS.
