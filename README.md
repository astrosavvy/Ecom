# YOUNOYA — For every chapter.

Premium editorial personalised-gifting atelier. DashCreative magnetic commerce replica retaining YOUNOYA identity (`younoya-gold.svg` gold `YU` foil, Vedic dasha, 108× consecration). Commit `778ba99` live at `https://younoya.com` (Pages) + `https://api.younoya.com` (VPS tunnel).

```text
younoya-web/          Vite 7 + React 19 + TS + react-router 7 (Dash replica)
├── public/
│   ├── younoya-gold.svg  600×340 gold YU monogram — brand SSOT
│   ├── zodiac/*.png      27 mesha→meena normalized (12 alias)
│   ├── products/*.webp   14 keepsakes static 4/3
│   ├── _redirects        /gifts→/shop 200, /blog/*→/journal/:splat 301 (no SPA catch-all)
│   └── scenes/           OGL 6×c+d WebP (FilmStage lazy)
├── src/
│   ├── main.tsx          tokens→global + error suppression beacon/startTime + scrollRestoration manual
│   ├── App.tsx           routes: / (HomePage dash), /shop, /product/:handle, /personalise?chapter=, /journal*, /admin/*, /film lazy, *→404
│   ├── styles/tokens.css #SSOT --yn-canvas #07080E --yn-gold #D4AF37 --yn-cream #FFFBF0
│   ├── store/pages/HomePage.tsx  dash-hero 42-88px Outfit 300 + workGrid 6 cases + bento + marquee
│   ├── admin/pages/JournalEdit.tsx dual 16:9 cover + 1:1 list upload POST /admin/files
│   └── lib/api.ts        BlogPost {cover_image list_image} + pk_d4577228...
└── wrangler.jsonc        not_found_handling single-page-application; vite cssCodeSplit 751k gz233k

backend/              Medusa 2.18 Node20+ PG15 younoya_db + Redis
├── medusa-config.ts  modules younoya-otp/blog/astro/themes/toolkits/recipients + auth emailpass+mobile-otp
├── src/modules/younoya-blog/  BlogPost cover_image+list_image + Migration20260901120000
└── src/api/          middlewares: /admin/files* fileGuard, /admin/blog* blogRoleGuard, /admin/users/me usersGuard

docs/DEPLOYMENT.md     full VPS + Pages runbook
.agents/YOUNOYA_PLATFORM.md  complete system reference
```

## Run it

Any static server for the built storefront, or dev:

```bash
cd younoya-web
npm install
npm run dev          # http://localhost:5173  (VITE_API_URL defaults to https://api.younoya.com)
npm run build        # dist/ 218 modules 751k — verify no TS errors before push
npx wrangler deploy  # Cloudflare Pages via wrangler.jsonc
```

Backend (Medusa — never build on VPS 956MB):

```bash
cd backend
npm install
$env:DATABASE_URL="postgres://postgres:postgres@localhost:5432/younoya"
npx medusa db:migrate   # migrations in src/modules/*/migrations
npx medusa develop      # http://localhost:9000  admin at /app
```

Docker compose only for local PG/Redis mirror (`docker-compose.yml`); production uses host PG + PM2.

## Deploy

* **Frontend**: `git add younoya-web/` → `git commit` → `git push origin main` — Cloudflare Pages auto-builds (`younoya-web` root, `npm run build`, `dist`). See `CLOUDFLARE_PAGES_SETUP.md:1` and `docs/DEPLOYMENT.md:22`.
* **Backend**: build locally → `tar .medusa src package.json medusa-config.ts` → `scp` to `ubuntu@140.245.7.165` → `npx medusa db:migrate` → `pm2 restart younoya-backend` — see `docs/DEPLOYMENT.md:52` + `.agents/YOUNOYA_PLATFORM.md:169`. `backend/` is `.gitignore:26` — use `git add -f` for blog/migrations.

## Admin

`https://younoya.com/admin` → `owner@younoya.com` `Younoya@Owner2026!` (admin), `marketing@younoya.com` `Younoya@Market2026!` (blog/files), `support@younoya.com` (read-only). Role checks in `backend/src/api/utils/roles.ts:11` + `middlewares.ts:93`.

## Journal with photos (2026-09-01)

`778ba99` fixes `younoya.com/admin/journal` empty-state `+ New post` → `JournalEdit.tsx:140` grid `Cover 16:9` (`POST /admin/files` `files` field) + `List 1:1` — stored as `cover_image` / `list_image` (`store/pages/Journal.tsx:54` 1:1 grid, `JournalArticle.tsx:33` 16:9 hero). Earlier live was singular `/admin/file` 404.

## Docs

* `.agents/AGENTS.md` — agent rules, brand MSP, deployment guardrails
* `.agents/YOUNOYA_PLATFORM.md` — full architecture, DB, VPS, CORS, credentials
* `docs/DEPLOYMENT.md` — step-by-step runbook + troubleshooting (advisory locks, ts-node, paise, 403 PAT)
* `implementation_plan.md` — P0-P4 + dash replica phases (all shipped)
* `workflow.md` — local setup, OTP state machine, API routes
