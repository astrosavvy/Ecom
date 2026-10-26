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

## 4. VPS Backend Production & Deployment Law (Zero GitHub Involvement)
> [!IMPORTANT]
> **MANDATORY BACKEND UPDATE LIFECYCLE**: Whenever updating the Medusa backend server, execute this strict 3-step cycle. **DURING THIS WHOLE PROCESS NO GITHUB IS INVOLVED**:
> 1. **Build the updated backend code**: Build locally outside the VPS (`npm run build` in `backend/`).
> 2. **Push it via SSH to backend**: Package built artifacts (`.medusa`, `src`, `package.json`, `medusa-config.ts`) and transfer directly via `scp` to `ubuntu@140.245.7.165`.
> 3. **Deploy and run it there**: Extract on VPS, run database migrations (`npx medusa db:migrate`), and restart the process (`pm2 restart` / `systemctl restart younoya-medusa`).
>
> **Hard Constraints**:
> - **Zero GitHub Involvement**: Backend updates never trigger or depend on GitHub, GitHub Actions, or server-side `git pull`. All backend deployment is strictly local-to-VPS via direct SSH.
> - **ZERO BUILD ON VPS**: The VPS (140.245.7.165, Oracle 2vCPU / 956MB RAM) will immediately OOM crash if `npm run build` or compilers run on it.
> - **Cloudflare Tunnel**: `api.younoya.com` connects via Cloudflare Tunnel to port 80/9000 on the VPS.

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




## 9. Single-Product Recommendation Law (Zero Distraction / Zero Multi-Offer)
- **Single Curated Hero**: Following the Vedic Astrology & Gifting Guide, the recommendation engine (/store/gift-guide/recommend and /find-a-gift) MUST return strictly ONE curated piece or hamper (offers array length is strictly 1).
- **Zero Secondary Categories**: secondaryCategories is strictly empty [].
- **UI Excision**: <GuideCompanions /> is deprecated and removed from the results flow (GuideResult.jsx). The customer is shown one single, definitive, intentional gift piece with complete conviction.
- **Fallback Rule**: In fallback or numerology modes, only the single top-ranked product (offers[0]) is returned.

## 10. Universal Dual-Experience Awareness Protocol
- **Experience 01 — Gifting Someone Else (forWhom === 'other')**:
  - Narrative chapter: 'A Chapter Worth Celebrating'.
  - Emotional rationale: 'Why this was chosen for them'.
  - Sacred intent: 'The Giver's Intention' with decoded quote and celebratory blessing.
- **Experience 02 — Buying For Myself (forWhom === 'self')**:
  - Narrative chapter: 'The Chapter You're In'.
  - Emotional rationale: 'Why this was chosen for you'.
  - Sacred intent: 'Your Personal Intention' with self-permission statement and contemplative thought prompt.

## 11. Taurus Moon 9-Dasha Scoping Law (Strict Sign-Scoping)
- **Taurus Moon Scope**: The complete 9-Dasha Vimshottari progression (Ketu, Venus, Sun, Moon, Mars, Rahu, Jupiter, Saturn, Mercury) from the manuscript is strictly scoped to **Taurus Moon (TAURUS)**.
- **Non-Taurus Preservation**: The other 11 zodiac signs remain grounded in their approved Mercury & Ketu matrix records. Never leak or guess unmapped Dashas for non-Taurus signs.

## 12. Shareable QR & 'Inside the Box' Unboxing Protocol
- **Dual Query Resolution**: Route /reveal/:category/:rashi supports optional query parameters ?dasha=<name>&exp=<self|other>.
- **Inside the Box Content**: When scanned for a Taurus Dasha box, it renders the exact 'Inside the Box' chapter from the manuscript:
  - 'What This Gift Means'.
  - 'The Giver's / Personal Intention' with authenticated quotes.
  - 'Sanctuary Placement & Sacred Direction (Vastu)' (e.g. Northeast, East, Southwest, South, North).
  - 'Ritual & Care' usage instructions and official disclaimer.
- **100% Backward Compatibility**: Scanning or browsing without query params preserves the standard 48 canonical Mercury reveal editions.
