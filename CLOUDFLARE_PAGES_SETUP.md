# Cloudflare Pages — younoya-web Configuration (2026-09-01, commit 778ba99)

Vite 7 React 19 storefront decoupled from VPS, auto-deploys on push to `astrosavvy/Ecom main`. Replaces old Next.js/storefront docs.

---

## 1. Cloudflare Pages Setup (2 min)

1. **Cloudflare Dashboard** → **Compute (Workers & Pages)** → **Create Application** → **Pages** → **Connect to Git** → repo `astrosavvy/Ecom`.
2. **Build Settings:**
   - **Framework Preset:** `Vite` (not Next.js)
   - **Root directory:** `younoya-web`
   - **Build command:** `npm run build` (runs `tsc -b && vite build` → `dist/`, `cssCodeSplit:true` `751k`)
   - **Output directory:** `dist`
   - **Node:** `>=20`
3. **Environment Variables** (Pages → Settings → Variables):
   - `VITE_API_URL`: `https://api.younoya.com`
   - `VITE_PUBLISHABLE_KEY`: `pk_d4577228b532cf8c81a5b63e898652da2dbaf9730acd3f8f449ccda1f8482c75` (public by design, fallback baked in `lib/api.ts:3`)
   - Optional: `VITE_API_BASE` alias (code reads `VITE_API_BASE` || `VITE_API_URL`)
4. **Save and Deploy** — verify `https://<project>.pages.dev/` loads dash hero (#FFFBF0, Outfit 42-88px), `/shop`, `/journal`, `/admin/journal` (needs auth).

---

## 2. Routing — SPA + Redirects (critical fix 17b5923)

`younoya-web/wrangler.jsonc:5`:
```json
{ "assets": { "directory": "dist", "not_found_handling": "single-page-application" } }
```
`younoya-web/public/_redirects:1` (must stay 2 lines — no SPA catch-all):
```
/gifts       /shop            200
/blog/*      /journal/:splat  301
```
* Do NOT re-add `/* /index.html 200` — duplicates `not_found_handling` and caused infinite loop `100324`.
* Do NOT add `/products/* /product/*` — broke static `*.webp` (`301→404`), fixed `38291b0` to serve `public/products/*.webp` 200.

---

## 3. Cloudflare Zero Trust Tunnel for Backend API

**Cloudflare Zero Trust Dashboard** → **Networks → Tunnels → `younoya`:**
- **Public Hostname:** `api` + `younoya.com` → **Service:** `HTTP` → **URL:** `http://localhost:80` (VPS `cloudflared` → `nginx :80` → `socat TCP 80→9000` → `127.0.0.1:9000` + `iptables REDIRECT`).
- Token lives on VPS `/etc/cloudflared/config.yml` + `cloudflared token eyJhI...`.

Verify: `curl -s https://api.younoya.com/health` → `OK`; `curl -s -H "x-publishable-api-key: pk_d45..." "https://api.younoya.com/store/products?limit=3"` → 200.

---

## 4. Push Authentication

Windows Credential Manager often holds `lenvthank-source` → push `403`. Use PAT explicitly:
```bash
git -c credential.helper= push https://x-access-token:<GITHUB_PAT_TOKEN>@github.com/astrosavvy/Ecom.git main
```
PAT issued 2026-08-18 expires 2026-11-16 — permissions `Contents: Read & write` on `astrosavvy/Ecom`.

---

## 5. Why This Split

* **Edge Speed:** 300+ PoPs <35ms TTFB India, `immutable` on `/scenes/*` + `/products/*`.
* **VPS Isolation:** 956MB reserved for PG/Redis/PM2, never builds (`docs/DEPLOYMENT.md:52`).
* **Correct Domain:** Seeded product images point at `https://younoya.com/products/...` (`STOREFRONT_URL` on VPS) — requires `younoya.com` attached to Pages, else update + re-seed.
