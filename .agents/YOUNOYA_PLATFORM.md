# YOUNOYA Platform — Complete System Reference (for Agents)

> Last updated: 2026-08-24. This document supersedes any EverShop-era references.
> Read this before touching backend, frontend, database, or deployment.

---

## 1. Architecture

```
                        ┌─────────────────────────────┐
   younoya.com  ──────▶ │  Cloudflare Pages (frontend) │  younoya-web/  (Vite + React 19 + TS)
   *.pages.dev          │  auto-deploys on git push    │  cinematic film at "/", store under routes
                        └──────────────┬──────────────┘
                                       │  fetch https://api.younoya.com
                        ┌──────────────▼──────────────┐
   api.younoya.com ───▶ │  Cloudflare Tunnel (VPS)     │  cloudflared → nginx :80 → 127.0.0.1:9000
                        └──────────────┬──────────────┘
                                       │
                        ┌──────────────▼──────────────┐
                        │  VPS 140.245.7.165 (Oracle)  │  Ubuntu 22.04, 2 vCPU, 956MB RAM, 4GB swap
                        │  Medusa v2.18 (systemd)      │  /var/www/medusa/.medusa/server
                        │  PostgreSQL 14 (localhost)   │  db "younoya", user "younoya"
                        └─────────────────────────────┘
```

- **Frontend repo path**: `F:\Savvy_Ecom\younoya-web` → GitHub `astrosavvy/Ecom` (branch `main`)
- **Backend repo path**: `F:\Savvy_Ecom\backend` (Medusa v2.18, deployed via direct rsync/scp — NOT via GitHub)
- **edge-bff**: Cloudflare Worker proxy in `F:\Savvy_Ecom\edge-bff` — OPTIONAL, currently unused (its `/api/v1/*` patterns do not match Medusa's `/store/*`; fix before enabling)

---

## 2. Database (PostgreSQL 14 on VPS, localhost-only)

### Core Medusa tables (~120, auto-managed by migrations)
products, product_variant, price, price_set, region, sales_channel, api_key,
cart, order, customer, auth_identity, promotion, shipping_option, stock_location,
fulfillment_set, blog_post (custom), astro_profile (custom), otp_challenge (custom) …

### Custom module tables

**`otp_challenge`** (module `younoyaOtp`)
| column | notes |
|---|---|
| identifier | phone (+91…) or email |
| identifier_type | mobile / email |
| otp_hash, salt | PBKDF2-SHA512, 100k iters |
| attempts, max_attempts | default 5 |
| expires_at, consumed_at | expiry via OTP_EXPIRY_MINUTES (10) |
| status | pending / verified / expired / rate_limited |

**`otp_rate_limit`** — sliding 60-min windows per identifier/ip.

**`astro_profile`** (module `younoyaAstro`)
| column | notes |
|---|---|
| owner_customer_id | Medusa customer id |
| full_name, relationship, is_self | self or gift recipient |
| dob (YYYY-MM-DD), tob (HH:MM or null), pob + pob_lat/lng/tz | birth data |
| sun_sign | western tropical |
| moon_sign | vedic sidereal (Lahiri ayanamsa) — Mesha…Meena |
| nakshatra, nakshatra_index | 27 mansions |
| element | Fire/Earth/Air/Water |
| ruling_planet | lord of moon sign |
| chart | full computed chart JSON |

**`blog_post`** (module `younoyaBlog`) — title, slug, content, excerpt, cover_image, published, published_at, author.

### Migrations — CRITICAL RULES
- Custom module migrations live in `src/modules/<module>/migrations/`.
- Generate with: `$env:DATABASE_URL="postgres://younoya:…@localhost:15432/younoya"; npx medusa db:generate younoyaAstro` (SSH tunnel `ssh -N -L 15432:localhost:5432 ubuntu@VPS` required).
- **Every new model needs `db:generate`** — the younoyaBlog module once shipped without one and silently had no table.
- Run migrations on the VPS at deploy: `cd /var/www/medusa/.medusa/server && npx medusa db:migrate`.
- If migrate hangs forever: stale advisory locks from a killed run —
  `SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname='younoya';` then re-run.

---

## 3. Backend (Medusa v2.18)

### Modules registered in `medusa-config.ts`
| module | path | purpose |
|---|---|---|
| younoyaOtp | src/modules/younoya-otp | OTP challenges + rate limits |
| younoyaBlog | src/modules/younoya-blog | blog posts |
| younoyaAstro | src/modules/younoya-astro | astro profiles + recommender |
| auth providers | @medusajs/medusa/auth | `emailpass` (admin) + `younoya-mobile-otp` (customers) — **emailpass MUST stay listed or admin login breaks** |
| payment | younoya-razorpay | dormant until payments go live |

### Store API routes (all require `x-publishable-api-key` header)
| route | method | auth | purpose |
|---|---|---|---|
| /store/otp/request | POST | public | send OTP (mobile/email); `OTP_MODE=mock` returns `mock_otp: "1234"` |
| /store/otp/resend | POST | public | alias of request |
| /store/otp/verify | POST | public | returns short-lived signed `ticket` (10 min JWT) |
| /auth/customer/younoya-mobile-otp | POST | public | `{ticket}` → Medusa customer JWT |
| /store/customers, /store/customers/me | POST/GET | JWT | create/read customer |
| /store/astro/profiles | GET/POST | customer JWT | list/create astro profiles (chart computed server-side) |
| /store/astro/profiles/:id | GET/DELETE | customer JWT | read/delete own profile |
| /store/astro/recommend | POST | customer JWT | `{profile_id, sender_profile_id?, occasion?}` → main + 3 suggestions + reasons |
| /store/cities?q= | GET | public | Indian city autocomplete (~130 cities bundled) |
| /store/products, /store/carts, /store/... | standard Medusa | — | catalog/cart/checkout (prices need `region_id` query param) |
| /store/blog/posts, /store/blog/posts/:slug | GET | public | published posts, paginated |

### Admin API (JWT from admin login)
- `/admin/blog/posts` GET/POST, `/admin/blog/posts/:id` GET/PUT/DELETE — guarded by `authenticate("admin")` in `src/api/middlewares.ts`.
- Admin dashboard: `https://api.younoya.com/app`

### Recommender rules (src/modules/younoya-astro/recommender.ts)
score = 20 base + 40 moon-rashi match + 25 sun-sign match + 15 ruling-planet + 15 element + 10 occasion + 8/6 sender↔recipient synergy (same/complementary element), capped 100. Product astro data lives in **product metadata** (compatible_rashis, compatible_sun_signs, astrology_elements, ruling_planets, gemstone_crystal, sacred_deity, consecration_mantra, synergy_tags, occasions, mrp_inr).

### Chart engine (src/modules/younoya-astro/utils/chart.ts)
`astronomy-engine` (pure JS). Sun = tropical ecliptic longitude. Moon = geocentric ecliptic − Lahiri ayanamsa (23.853° @J2000, +50.29″/yr). Nakshatra = moon_sid / 13°20′. TOB unknown → noon chart, `approximate: true`. Unknown POB → New Delhi default.

### Seed scripts (run via `npx medusa exec ./src/scripts/<name>.js` from .medusa/server)
- `seed-catalog.ts` — idempotent: store (INR default), India region + tax region, publishable key, stock location + India shipping (free), 7 categories, **14 products** (via `createProductsWorkflow` — the raw product module IGNORES variant prices, must use the workflow), 3 blog posts.
- `seed-india.ts`, `seed-products.ts` — legacy helpers.
- **Prices are in paise** (₹1,099 = amount 109900).

---

## 4. Frontend (younoya-web)

- **Stack**: Vite 7 + React 19 + TS, react-router-dom 7, GSAP ScrollTrigger + Lenis + OGL (film only).
- **Routes**: `/` cinematic film (preloader → 5-scene scroll film → finale CTA) · `/journey` (4-step tiles: mobile OTP → birth details+city autocomplete → self/gift+occasion → recipient) · `/explore` (main + 3 suggestions, reasons, add-to-cart) · `/shop` · `/product/:handle` · `/cart` · `/checkout` · `/order/:id` · `/account` (profiles + orders) · `/blog` · `/blog/:slug`
- **API client**: `src/lib/api.ts` — base URL + publishable key from `VITE_API_BASE` / `VITE_PUBLISHABLE_KEY` (sane defaults baked in). Customer JWT in `localStorage.younoya_customer_token`. Cart id in `younoya_cart_id`.
- **State**: `src/lib/store.tsx` — StoreProvider (cart, customer, profiles, lastResult).
- **Prices**: always INR. Store API needs `region_id` query param → `variants.calculated_price.calculated_amount` (paise) → `formatINR` divides by 100.
- **Design system**: bg `#0B0E18`/`#070912`, gold `#D4AF37`, rose `#E8A0BF`, mint `#34D399`; Cormorant (display) / Tenor Sans (body) / Manrope (labels). Store pages reuse these tokens (see "store" section at the end of `global.css`).
- **Product images**: `public/products/<handle>.webp` — generated by `backend/src/scripts/gen-product-images.py`. Seeded URLs point at `https://younoya.com/products/...` (STOREFRONT_URL env on VPS) — requires the frontend to be served on younoya.com, else update STOREFRONT_URL + re-seed.
- **SPA fallback**: `public/_redirects` → `/* /index.html 200` (required for Cloudflare Pages routes).

---

## 5. Security flags & posture

| item | state |
|---|---|
| OTP_MODE | `mock` on VPS (fixed code 1234, returned in response). Set `OTP_MODE=sms` + wire a provider before launch. |
| OTP storage | salted PBKDF2 hashes only; attempts capped 5; rate limit 20/hr per identifier, 40/hr per IP |
| Auth tickets | 10-min JWT, single purpose (`otp-login`), exchanged once at /auth |
| Customer passwords | none (passwordless) |
| Admin | emailpass at /app — **change the default password before launch** |
| Publishable key | public by design (pk_fe6f…) |
| JWT/COOKIE secrets | random 32-byte, live ONLY in VPS `.env` — never commit |
| CORS | STORE/AUTH CORS: localhost:5173, https://younoya.com, https://younoya-web.pages.dev — tighten to the final domain at launch |
| DB | postgres listens on 127.0.0.1 only; port not exposed |
| Payments | NOT live — checkout completes orders with pending payment (system provider). Razorpay module dormant. |
| VPS SSH | key `~/.ssh/id_ed25519_clean`, user ubuntu@140.245.7.165 |
| PHP/MariaDB/Docker | stopped & disabled on VPS (dead stack — do not restart) |

---

## 6. Credentials (SENSITIVE — private repo only)

| what | value |
|---|---|
| VPS | `ubuntu@140.245.7.165`, key `id_ed25519_clean` |
| VPS Postgres | db `younoya`, user `younoya`, pw `yn_pg_Kx8mQ2vT7wZ9` (localhost only) |
| Medusa admin | `admin@younoya.com` / `Younoya@Admin2026!` → https://api.younoya.com/app |
| Publishable key | `pk_fe6f25d425dbefc81508541538e1007d229a450f06697a1d58f4cda7bc390c35` |
| Mock OTP | `1234` |
| JWT/COOKIE secrets | on VPS only: `/var/www/medusa/.medusa/server/.env` |
| GitHub | repo `astrosavvy/Ecom` (main). PAT in old docs is TRUNCATED — store the full PAT in Windows Credential Manager or ask the owner. |
| Cloudflare | tunnel `younoya` runs on VPS (token in /etc/cloudflared); Pages project connected to the GitHub repo |

---

## 7. Deployment (summary — full runbook in `docs/DEPLOYMENT.md`)

- **Backend**: build locally (`npm run build` in backend/) → tar `.medusa src` → scp → extract on VPS → `npx medusa db:migrate` (+ seed if needed) → `systemctl restart younoya-medusa`. NEVER build on the VPS (1GB RAM).
- **Frontend**: commit `younoya-web/` → push `astrosavvy/Ecom main` → Cloudflare Pages auto-builds. Pages project must have **root directory `younoya-web`, build `npm run build`, output `dist`**.
- **Gotchas**: see Troubleshooting section of docs/DEPLOYMENT.md (advisory locks, ts-node, price sets, paise).

---

## 8. Known gaps / next steps
1. Payments (Razorpay) — module exists; wire checkout + webhook.
2. Real SMS OTP (MSG91/Twilio) — replace mock.
3. Real product photography — replace generated placeholders.
4. Admin UI widget for blog (currently REST-only via /admin/blog).
5. edge-bff path fix + enable (optional caching layer).
6. Custom domain on Pages (younoya.com) so seeded product image URLs resolve.
