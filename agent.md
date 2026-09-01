# YOUNOYA Agent Execution Guidelines — 2026-09-01

> Supersedes all EverShop-era rules. Single source of truth for stack is `.agents/YOUNOYA_PLATFORM.md` and `docs/DEPLOYMENT.md`.

## Core Rules for Agent Behavior

1. **User Edit Approval First**
   - For any edit/feature, research relevant files first, write or update `implementation_plan.md`, **STOP and wait for explicit user approval** before executing code changes.
   - `implementation_plan.md:1` is the gate — no code without approval.

2. **2-Step Error Loop Limit**
   - Do not loop >2 execution attempts on the same error.
   - After 2 fails, STOP, emit a diagnostic report with exact root cause (`file_path:line_number`, logs, repro), and propose a fix plan. Wait for direction.

3. **Single Commerce Backend & Conventions**
   - **Commerce is Medusa v2.18 only** (`F:\Savvy_Ecom\backend\`, PostgreSQL 15 `younoya_db`, Redis). No EverShop, no `themes/younoya/`, no `extensions/`.
   - **Storefront is `younoya-web/` only** (Vite 7 + React 19 + TS + react-router 7, `younoya-web/src/styles/tokens.css:7` is SSOT for `#07080E/#D4AF37/#FFFBF0`). No `storefront/` Next.js folder.
   - Business logic belongs in Medusa workflows/modules, not route handlers (`backend/AGENTS.md:1`).
   - `/admin/files*` uploads require `fileGuard` (`backend/src/api/middlewares.ts:93`, `roles.ts:57`), `/admin/blog*` uses `blogRoleGuard`, `/admin/users/me` is open to all staff via `usersGuard:62`.

## Stack Snapshot (2026-09-01 — dash replica live)

- Frontend `younoya-web/`: Vite 7 `cssCodeSplit:true` + React 19, GSAP/Lenis/OGL film (`/film` lazy `FilmStage 61.6k`), Tiptap, `younoya-gold.svg:1` + `StoreHeader.tsx:42` + `HomePage.tsx:1` dash replica (magnetic hero `88vh` `#FFFBF0`, work grid 1fr 1fr 6 cases, bento 1.6fr 1fr, marquee 28s). Build `✓ 218 modules 751k (gz 233k)`.
- Backend `backend/`: `medusa-config.ts:1` modules `younoya-otp|blog|astro|themes|toolkits|recipients + auth emailpass+younoya-mobile-otp + younoya-razorpay` (dormant). `pk_d4577228b532cf8c81a5b63e898652da2dbaf9730acd3f8f449ccda1f8482c75`.
- Infra: VPS `ubuntu@140.245.7.165` key `~/.ssh/id_ed25519_clean` `/home/ubuntu/younoya` `PM2 younoya-backend PORT=9000` `DATABASE_URL=postgres://postgres:postgres_prod_pass_123@localhost:5432/younoya` `JWT production_jwt_secret_younoya_987654321`; Tunnel `api.younoya.com → localhost:80` (`cloudflared token eyJhI...` + `socat TCP 80→9000` + `iptables REDIRECT`); Cloudflare Pages `astrosavvy/Ecom main` `wrangler.jsonc:5 not_found_handling single-page-application` + `public/_redirects:1` (`/gifts→/shop`, `/blog/*→/journal/*` — no `/*→/index.html` infinite loop, no `/products/*→/product/*` that broke `*.webp` `301→404`).
- Admin roles: `owner@younoya.com admin`, `marketing@younoya.com marketing`, `support@younoya.com support` (`roles.ts:62 usersGuard` checks `originalUrl||url||path` `includes(/admin/users/me)`; `ADMIN_CORS https://younoya.com,https://www.younoya.com,https://api.younoya.com` in `ecosystem.config.js:1` verified `OPTIONS /admin/users/me 204`).
- Blog: `blog_post:9 cover_image 16:9` + `list_image 1:1` (`Migration20260901120000.ts:5 alter table if exists`) `backend/src/api/admin/blog/posts/route.ts:46` + `[id]/route.ts:10` `younoya-web/src/admin/pages/JournalEdit.tsx:140` dual grid `Journal.tsx:54 list_image||cover_image 1:1` `JournalArticle.tsx:33 cover_image||list_image 16:9` `main.tsx:12 window error startTime/beacon` suppression.

## Deployment

- **Backend never builds on VPS** (956 MB RAM OOM). Build locally `npm run build` → tar `.medusa src package.json medusa-config.ts` → `scp` → `tar xzf` → `cp .env .medusa/server/.env` → `npx medusa db:migrate` → `pm2 delete/start/save` — see `docs/DEPLOYMENT.md:52` and `.agents/YOUNOYA_PLATFORM.md:169`.
- **Frontend auto-deploys on push** to `astrosavvy/Ecom main` (`younoya-web` root, `npm run build && npx wrangler deploy`). If `git push` `403 lenvthank-source`, use PAT explicit: `git -c credential.helper= push https://x-access-token:<PAT>@github.com/astrosavvy/Ecom.git main` (see `.agents/AGENTS.md:125`). `backend/` is `.gitignore:26` ignored — blog/migration changes must be `git add -f` (`git ls-files --others --exclude-standard` check).
- Always run `npm run build` in `younoya-web/` before push; `backend/` must satisfy `eslint.config.ts` `@medusajs/*` (never disable, fix shape).
