# YOUNOYA — Deployment Plan & Runbook

> Reference for deploying the Younoya platform (frontend + backend).
> System overview lives in `.agents/YOUNOYA_PLATFORM.md`.

---

## 1. Environments

| piece | where | how it deploys |
|---|---|---|
| Frontend (younoya-web) | Cloudflare Pages | **git push → auto-build** (repo `astrosavvy/Ecom`, branch `main`) |
| Backend (Medusa v2.18) | VPS 140.245.7.165 (Oracle, Ubuntu 22.04, 2 vCPU / 956MB / 4GB swap) | **direct scp from dev machine — never via GitHub, never build on VPS** |
| Database | PostgreSQL 14 on the VPS (localhost only) | migrations run during backend deploy |
| API ingress | Cloudflare Tunnel `younoya` → nginx :80 → 127.0.0.1:9000 | static config, rarely touched |

**Pages project settings (verify in Cloudflare dashboard):**
- Production branch: `main`
- **Root directory: `younoya-web`**
- Build command: `npm run build`
- Output directory: `dist`
- (Old setup pointed root at `storefront/` — that folder no longer exists.)

---

## 2. Frontend deploy (younoya-web)

```bash
cd F:\Savvy_Ecom
git add younoya-web/
git commit -m "..."
git push origin main          # Pages builds automatically (~2 min)
```

Auth: Windows Credential Manager holds the GitHub credential. If it holds the
wrong account (403 on push), push with the PAT explicitly:

```bash
git -c credential.helper= push https://x-access-token:<GITHUB_PAT>@github.com/astrosavvy/Ecom.git main
```

**After deploy, verify:**
1. `https://<project>.pages.dev/` loads the cinematic film
2. `/journey`, `/shop`, `/blog` render (SPA fallback via `public/_redirects`)
3. If a custom domain (younoya.com) is attached, product images
   (`/products/<handle>.webp`, seeded with `STOREFRONT_URL=https://younoya.com`) resolve.
   If using pages.dev only, either attach the domain or update `STOREFRONT_URL`
   on the VPS + re-run the catalog seed.

---

## 3. Backend deploy (Medusa)

### 3.1 Build locally (Windows dev machine)

```bash
cd F:\Savvy_Ecom\backend
$env:MEDUSA_ADMIN_ENABLED = "true"
npm run build                # → .medusa/server (compiled app) + .medusa/admin
tar -czf "$env:TEMP\medusa-deploy.tar.gz" .medusa src package.json package-lock.json medusa-config.ts tsconfig.json
```

### 3.2 Ship + activate

```bash
scp -i "$env:USERPROFILE\.ssh\id_ed25519_clean" "$env:TEMP\medusa-deploy.tar.gz" ubuntu@140.245.7.165:/tmp/
ssh -i "$env:USERPROFILE\.ssh\id_ed25519_clean" ubuntu@140.245.7.165
```

On the VPS:

```bash
cd /var/www/medusa
tar xzf /tmp/medusa-deploy.tar.gz
cp .env .medusa/server/.env          # keep env in both places
cd .medusa/server
npx medusa db:migrate                # ~1-3 min, idempotent
sudo systemctl restart younoya-medusa
sleep 30 && curl -s http://127.0.0.1:9000/health   # expect: OK
```

### 3.3 Seed (only when catalog/blog changed)

```bash
cd /var/www/medusa/.medusa/server
npx medusa exec ./src/scripts/seed-catalog.js     # idempotent
```

### 3.4 First-time setup (already done — reference only)

- Node 20 + PostgreSQL 14 installed via apt; db `younoya` owned by `younoya`
- Postgres tuning: `/etc/postgresql/14/main/conf.d/conservative.conf`
- nginx site: `/etc/nginx/sites-enabled/younoya` (proxy → 127.0.0.1:9000)
- Service: `/etc/systemd/system/younoya-medusa.service` (enabled)
- Env file: `/var/www/medusa/.medusa/server/.env` (chmod 600)
- Admin user: `npx medusa user -e admin@younoya.com -p '...'`
- Dead stack (php8.4-fpm, mariadb, docker, containerd) stopped + disabled
- journald capped at 50MB (`/etc/systemd/journald.conf.d/size.conf`)

---

## 4. Rollback

Backend keeps no history on the VPS — rebuild any previous commit locally and
re-run section 3.1–3.2. Migrations are forward-only; for a breaking migration,
restore the DB first:

```bash
sudo -u postgres pg_dump younoya > /tmp/younoya_$(date +%F).sql     # backup BEFORE deploys
sudo -u postgres psql younoya < /tmp/younoya_YYYY-MM-DD.sql        # restore
```

Frontend: revert the commit and push (`git revert HEAD && git push`).

---

## 5. Health checks & smoke tests

```bash
# on VPS
curl -s http://127.0.0.1:9000/health                                  # → OK
K="x-publishable-api-key: pk_fe6f25d425dbefc81508541538e1007d229a450f06697a1d58f4cda7bc390c35"
curl -s -H "$K" "http://127.0.0.1:9000/store/products?limit=3" | head -c 200
curl -s -X POST -H "$K" -H "Content-Type: application/json" \
  -d '{"phone":"9876543210"}' http://127.0.0.1:9000/store/otp/request  # mock: returns 1234
curl -s "http://127.0.0.1:9000/store/blog/posts?limit=1" -H "$K" | head -c 200
sudo systemctl status younoya-medusa --no-pager | head -5
free -h                                                               # watch RAM
```

Public: `https://api.younoya.com/health` → OK (via tunnel).

---

## 6. Troubleshooting (lessons learned)

| symptom | cause | fix |
|---|---|---|
| `medusa db:migrate` hangs forever, no DB connections | stale advisory locks from a killed migrate run | `SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname='younoya';` then re-run |
| CLI errors `Cannot find module 'ts-node'` | installed with `--omit=dev` | run full `npm ci` (dev deps required by the CLI at runtime) |
| `Cannot find module .../medusa-config` | running CLI from repo root | always run from `/var/www/medusa/.medusa/server` |
| "Variants do not have a price" on add-to-cart | products created via raw product module — it ignores variant prices; only `createProductsWorkflow` builds price sets | re-seed with the workflow (seed-catalog.ts handles: deletes unpriced, recreates) |
| Store API shows no prices | v2 returns prices only with region context | pass `region_id` query param → `variants.calculated_price` |
| Prices show ₹10.99 instead of ₹1,099 | amounts are paise | store `price * 100` |
| Admin login "auth provider emailpass not registered" | declaring the auth module replaces default providers | keep `@medusajs/auth-emailpass` listed in medusa-config providers |
| `relation "blog_post" does not exist` | module migration never generated | `npx medusa db:generate younoyaBlog` (needs SSH tunnel to a reachable DB) + rebuild |
| VPS build OOM / 30-35 min builds | 956MB RAM | never build on VPS — build locally, ship artifacts |
| Product images 404 | STOREFRONT_URL domain not serving the frontend | attach younoya.com to Pages, or update STOREFRONT_URL + re-seed |

---

## 7. Monitoring & ops

- Service logs: `journalctl -u younoya-medusa -f`
- RAM pressure: `free -h` (swap in use is normal; if swap >2GB consistently, scale up)
- DB backup (recommended weekly + before deploys):
  `sudo -u postgres pg_dump younoya | gzip > /var/backups/younoya_$(date +%F).sql.gz`
- Disk: `df -h /` (97GB volume — uploads and node_modules grow slowly)
