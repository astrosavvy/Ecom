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

## 5. Admin Console Hosting Law (Zero Admin UI on VPS Backend)
- **Frontend-Hosted Console**: The Admin management dashboard (`/admin/*`) MUST ALWAYS be built and hosted exclusively on the Frontend edge (`younoya-web` on Cloudflare Workers Static Assets).
- **Prohibition on Backend UI**: NEVER enable, compile, or mount full-stack admin dashboards (such as `@medusajs/dashboard`) on the backend Node server or VPS. `admin.disable` in `medusa-config.ts` must ALWAYS be `true` for the backend server.
- **Pure Headless API**: The backend (`api.younoya.com`) MUST strictly operate as a headless JSON REST API, servicing authenticated database CRUD queries without any HTML/UI rendering overhead.
- **Enforcement Reason**: The VPS has a strict 956MB RAM cap. Running a dashboard on Node consumes 200MB+ of scarce server RAM and crashes compiler processes with Out Of Memory (OOM) errors.

## 6. Server-Side Dynamic Media Storage, Lossless Compression & Edge Caching
- **Permanent Server Storage**: Media uploaded via Admin (`/admin/journal`, `/admin/products`, etc.) MUST be stored permanently on the backend server (`backend/static/` / persistent storage).
- **Zero Frontend Rebuild Mandate**: Adding blog posts, images, products, or themes via Admin MUST NEVER require a frontend code rebuild, git commit, or redeployment. The publishing workflow must be 100% runtime-instant.
- **One-Time Lossless Compression**: Uploaded media must be compressed losslessly once upon upload on the server to optimize storage space and transfer payload without quality degradation.
- **Aggressive Edge Caching (Cloudflare Tunnel)**: Server-stored media endpoints (`api.younoya.com/static/*`) MUST serve aggressive HTTP cache headers (`Cache-Control: public, max-age=31536000, stale-while-revalidate=86400`), so that Cloudflare's global edge network caches the images on first request and shields the VPS from repetitive fetch load.

## 7. Anti-Purge & Operational Route Preservation Law
- **No Accidental Purging**: Core platform operational routes and subsystems (`/admin/*`, `/blog/*`, `/shop`, `/find-a-gift`) MUST NOT be purged, deleted, or omitted during visual redesigns, homepage diorama iterations, or styling updates.
- **Router Audit Requirement**: Any modification to `younoya-web/src/App.jsx` or router structure must verify that all operational consoles and public endpoints remain fully routed.

## 8. Dual Branch Strategy: `prepare-to-launch` vs `main`
- **`prepare-to-launch` Branch (GitHub Remote & Local Full Platform)**:
  - Preserves the full-fledged, interactive Younoya e-commerce experience (10 handcrafted brooches collection, elevated Aster gift finder, scroll-scrubbed hero film, 3D perspective cylinder, luxury cart drawer, blog, and admin console).
  - Use this branch for ongoing local feature development, photos integration, and staging before public launch:
    ```bash
    git checkout prepare-to-launch
    npm run dev
    ```
- **`main` Branch (Production Deployment)**:
  - Serves the production Coming Soon landing page at `https://younoya.com` (`/`), featuring the boutique facade diorama with dark bottom shading and luxury typography.
  - Keeps operational staff route active (`/admin` for management console).
  - Use this branch to verify the live production experience:
    ```bash
    git checkout main
    npm run dev
    ```


