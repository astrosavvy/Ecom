# YOUNOYA — Premium Rehaul Implementation Plan — 2026-09-01

**Live commit `778ba99`** (dash replica + cream admin + blog dual image). Legacy `P0-P4` plan retained for history; current status marked SHIPPED.

---

## Context

Brand brief demands editorial "for every chapter" atelier, not crystal shop. `younoya-web` was `global.css:1` monolith + inline `style={{}}` + weak hierarchy. Backend 70% (`younoya-themes|toolkits|recipients`, `dasha.ts:1`, 12 routes) but fresh DB (4 products). `lets-scroll` hero upgraded to OGL film then dash magnetic replica `https://dashcreative.co/`.

## SHIPPED — What landed (2026-08-08 → 2026-09-01)

### P0 Tokens & Plumbing — SHIPPED `70b0373` + `agents/AGENTS.md:125`
- `younoya-web/src/styles/tokens.css:7` SSOT `--yn-canvas #07080E --yn-gold #D4AF37 --yn-cream #FFFBF0 --yn-ink-on-cream #1a1a1e`, deleted duplicate `:root #0b0e18` in `global.css:1`, `vite.config.ts:6 cssCodeSplit:true` `218 modules 751k`.
- Routes `/products→/product` `/gifts→/shop` `/blog→/journal` `Navigate` in `App.tsx:88`, `Fetch 32` artifacts cleaned.

### P1 Dash Header/Hero/Bento — SHIPPED `51748ec` + `38291b0`
- `StoreHeader.tsx:42` 28px `younoya-gold.svg` + pill `WORK About Journal Personalise` + `Begin your chart →→` black CTA; `HeroCinematic.tsx:1` `88vh video story_10s.mp4 brightness 0.98 scrim 0.38` single CTA `Shop YOUNOYA`; `HomePage.tsx:1` `#FFFBF0` `dash-hero 120px 42-88px Outfit 300` + `dash-work-grid 1fr 1fr 6 cases pearl/guru/yantras` + `yn-bento 1.6fr 1fr Love♡ Becoming↗ Shelter⌂` + marquee `28s` 14 keepsakes·108 chants; `zodiac 27 PNG mesha→meena` alias.

### P2 Cartier Configurator — SHIPPED `70b0373`
- `Configurator.tsx:1 ?chapter=threshold|cosmos|intent|reveal&dob&rashi&occasion&for&sankalpa` `useSearchParams debounce 120ms` live sankalpa foil + wraps `Journey.tsx:509` `FluidCard` keep `personalise-legacy`.

### P3 Heritage + Shop + Product — SHIPPED `70b0373`
- `HeritageStrip.tsx:1 Vimshottari 120y + Canonical + Atelier Jaipur` + `Shop` chapter filter love/becoming/shelter + `Product` `Enquire vs Cart purchaseType ≥349900/Sapphire→enquire` deep-craft placeholder.

### P4 SEO + Perf + A11y — SHIPPED `70b0373` + `17b5923`
- `index.html:6 For every chapter` `canonical` `Store LD younoya-gold.svg` `robots.txt` `sitemap.xml 6` `theme #FFFBF0`; film lazy `FilmStage 61.6k Preloader 0.83k` `Suspense` `755k→751k`; `App.tsx:112 404 *` + `aria-current` header.

### Dash Replica Polish — SHIPPED `51748ec/38291b0/3d1be0e/13ff1ab`
- `dash-header 255,251,240 0.92 blur12`, `dash-card 4/3 radius12 scale1.03`, image fix `public/_redirects` remove `/products/*` → `curl 200 19762`, admin `roles.ts:62 usersGuard originalUrl includes /admin/users/me` (`pm2 restart 189476`) + `index.html:41` preload removal + admin cream `#FFFBF0 side rgba255,251,240 0.96` `global.css:1907`.

### Blog Dual Image — SHIPPED `778ba99` (fixes empty admin journal)
- `backend/src/modules/younoya-blog/models/blog-post.ts:9` `cover_image 16:9` + `10 list_image 1:1` + `Migration20260901120000.ts:5` add column + `backend/src/api/admin/blog/posts/route.ts:46` / `[id]/route.ts:10` pass-through + `younoya-web/src/admin/pages/JournalEdit.tsx:140` dual grid `UploadImage → POST /admin/files files[0].url` + `main.tsx:12` `window error beacon/startTime` suppression + `store/pages/Journal.tsx:54 1:1` `JournalArticle.tsx:33 16:9`. Old live `POST /admin/file` 404 → "no photos" report fixed.

---

## Next — Only polish left (P5)

| Item | Status | Note |
|---|---|---|
| Razorpay webhook live | OPEN | Module dormant, checkout pending payment |
| Real SMS OTP | OPEN | `OTP_MODE=mock 1234` on VPS |
| Real product photography | OPEN | Replace `gen-product-images.py` placeholders |
| edge-bff `/api/v1/*` vs `/store/*` | OPEN | Fix paths before enabling |
| `younoya.com` custom domain attached to Pages | VERIFY | Seeded `STOREFRONT_URL` requires it |

---

## Risks — Closed

* VPS 1GB OOM fixed (`docs/DEPLOYMENT.md:52` local build + host PM2 `Dockerfile:1` optimized).
* Higgsfield render not needed — dash replica is CSS-only editorial.
* Infinite loop `_redirects` fixed `17b5923`; product `*.webp` 301 fixed `38291b0`; admin 403 fixed `3d1be0e`.
