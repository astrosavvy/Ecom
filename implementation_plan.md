# YOUNOYA — Premium Rehaul Implementation Plan

**Approved sequence:** Design System → Cinematic Homepage (lets-scroll) → Product/Toolkit → Catalog/Editorial

---

## Context

Brand brief (§1-43) demands premium editorial gifting, not generic crystal shop. Current `younoya-web` is worst version: `global.css:1` monolith, inline `style={{}}` in `HomePage.tsx:24`, `Shop.tsx:38`, weak hierarchy. Backend 70% done (`younoya-themes|toolkits|recipients`, `dasha.ts:1`, 12 routes) but DB reseeded fresh (4 products, 0 themes). `lets-scroll` skill unused on hero.

## Phase 0 — Design System (2-3 days) — IN PROGRESS

**Goal:** Extract reusable tokens + primitives before any page rebuild.

- **Tokens** `younoya-web/src/styles/tokens.css`:
  - Midnight: `#07080E`, `#0B0E18`, `#080A10` (AGENTS.md:4)
  - Celestial Amber: `#D4AF37`, `#B8860B`, Kumkum Red `#DC2626`, Astral Blue `#0E2A47`
  - Glass: `rgba(8,10,16,0.95)` + `1px rgba(212,175,55,0.35)` + `backdrop-blur-3xl`
  - Typography: `Outfit/Instrument Serif` headings, `Inter` body, `JetBrains Mono` badges
  - Replace `global.css:1` `--bg`, `--gold` etc with new tokens, keep Lenis + film stage untouched

- **Primitives** `younoya-web/src/components/ui/`:
  - `Button` (cta-personal/outline/ghost, fluid shine from `global.css:1708` `.fbtn`)
  - `Card` (glass `fc` + aurora blobs `global.css:1552`)
  - `Field`/`OtpInput` (from `global.css:1591` `.ff`)
  - `ProductCard` (unify `store/components/ProductCard.tsx:1` + `shopcard` `global.css:1060`)

- **Refactor** `StoreHeader.tsx:1`, `StoreLayout.tsx:1`, `HomePage.tsx:1` to use primitives + tokens (remove inline styles)

**Verify:** `npm run build` in `younoya-web` passes, visual regression on Home.

## Phase 1 — Cinematic Homepage (lets-scroll)

**Interview (SKILL.md:84):**
- Subject: YOUNOYA personalised gifting (open question)
- Brand kit: `higgsfield marketing-studio brand-kits fetch --url https://younoya.com`
- Art: clay diorama soft matte low-poly isometric tilt-shift (default)
- Camera: **B fly-through** (diorama) vs A walkthrough — ask
- Journey: N=6 (hero + curated + personal + intentions + featured + journal)
- Mobile: 9:16 native portrait chain? (2× credits)
- Asset source: Automatic (Monid Seedance 2.0) vs Manual
- Budget: 1080p ~$27 for N=6

**Deliver:** `still_*.png` → `dive_*.mp4` + `conn_*.mp4` → `scrub-engine.js` wired in `HomePage.tsx:24` hero, `FilmStage` retired to `/film`.

## Phase 2 — Product & Personalisation (§3, §7-10, §33)

- Rebuild `Product.tsx:1` per §33 (story, symbolic, `MAKE IT PERSONAL` CTA → `/personalise`)
- Rebuild `PersonaliseFlow.tsx:1` to glimpsing UX (§8) + WHO (§10) + progress + explanation
- Toolkit reveal `result.main + suggestions` with rationale, placement, gift message

## Phase 3 — Catalog & Editorial (§15-17, §35-36)

- Seed 27 products §2 via `seed-products.js`, `seed-themes.ts` fix
- Shop filters `theme`, sort, `Journal` categories, SEO schema

## Phase 4 — Dashboard & Admin (§21-26)

- Split `Account.tsx` → `My Profile | Astrology | Recipients | Toolkits History`
- Admin `RecommendationRules` rule builder `IF Rashi=X AND Dasha=Y THEN Theme`

---

## Risks

- VPS 1GB OOM already fixed (local build + host PM2) — keep `backend/Dockerfile:1` optimized
- Higgsfield credits/balance check before Phase 1 (Step 0)

## Next Immediate Code

- Create `tokens.css`, `components/ui/*`, refactor `StoreHeader` first (visible win)
