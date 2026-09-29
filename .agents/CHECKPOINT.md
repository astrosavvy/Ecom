# YOUNOYA — Living Checkpoint & Multi-Agent Handoff Journal

> [!IMPORTANT]
> **MULTI-AGENT SSOT**:
> Any agent (**Codex**, **Antigravity**, **Claude Code**, or automated pipeline) MUST read this file at the start of every turn to know the current state and what to do next. When concluding a turn or completing a milestone, the agent MUST update this document.

---

## 1. 📍 Executive Project Status

- **Current Phase**: Phase 8 — Strapi-Grade TipTap Block Editor, Backlinks Engine, Image Compression & Storefront Live on `main`
- **Status**: Production-ready on `main`. Deployed TipTap rich text block editor (the same engine powering Strapi v5) in `younoya-web/src/admin` with zero VPS RAM overhead. Features visual block editing, floating link modal with `Ctrl+K`, quick internal route presets (`/shop`, `/find-a-gift`), and smart copy-paste from Google Docs/Word with all hyperlinks preserved. Resolved Cloudflare deploy infinite-loop error [code: 100324] (`"not_found_handling": "single-page-application"` in `wrangler.jsonc`). Storefront direct links (`/shop`, `/find-a-gift`, `/blog`, `/blog/:slug`, `/product/:handle`, `/admin/*`) active with zero 404s. Build verified exit code 0; Wrangler dry-run passed (126 assets).
- **Active Task**: Build verified locally and validated with Wrangler dry run. Ready for single final commit and user push approval.
- **Last Updated**: 2026-09-29T16:32:00+05:30
- **Last Agent**: Antigravity
- **Primary URLs**: Dev `http://localhost:5173` | Preview `http://localhost:3000` | Prod `https://younoya.com` | API `https://api.younoya.com`

---

## 2. 🏁 Consolidated Milestone History

### [2026-09-29] Phase 8: TipTap Editor (Strapi v5 Engine), Backlinks, Cloudflare Deploy Fix & Storefront Direct Links
- **TipTap Rich Block Editor Deployment (`younoya-web/src/admin`)**:
  - Installed `@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-link`, `@tiptap/extension-image`, and `@tiptap/extension-placeholder`.
  - Authored `RichTextEditor.tsx` and `editor.css` with quiet luxury aesthetics.
  - Floating backlink popover + `Ctrl+K` hotkey with internal preset chips (`/shop`, `/find-a-gift`, `/blog`, `/product/*`).
  - Native `linkOnPaste: true`: pasting rich text from Google Docs, Word, or Notion preserves all hyperlinks, bolding, and lists.
  - Built-in converter `convertLegacyMarkdownToHtml` seamlessly opens existing markdown articles in the visual editor.
  - Replaced raw textarea in `JournalEdit.tsx` with `RichTextEditor` and wired real-time styled preview.
  - **Zero Server RAM**: 100% client-side React execution, zero additional memory on the 956MB VPS. Saves clean HTML/JSON directly to the existing Medusa `younoya-blog` module and PostgreSQL database.
- **Storefront & Backlink Typography Polish (`BlogPost.jsx` & `Blog.css`)**:
  - `renderFormattedContent` handles both native TipTap HTML and legacy Markdown without double-wrapping.
  - Click delegation routes internal links via React Router `navigate()` without browser reloads.
  - Updated `.article-backlink` and `.article-prose a` with `display: inline`, warm amber/gold color `#A37B24`, subtle underline, and hover glow matching user reference. Removed disruptive trailing icon.
- **Cloudflare Deploy Infinite-Loop Fix**:
  - Removed lines 6–7 (`/blog/*` and `/admin/*` rewrites to `/index.html 200`) from `public/_redirects` which triggered Cloudflare's canonicalizer loop [code: 100324].
  - Cloudflare natively serves `index.html` for client routing via `"not_found_handling": "single-page-application"` in `wrangler.jsonc`.
  - Tested `npx wrangler deploy --dry-run` (exit code 0 across both root and `younoya-web/`).
- **Storefront Direct Links on `main`**:
  - Root `/` remains exclusively the luxury Coming Soon facade (bottom-half gradient, diorama arrival still).
  - Merged authentic catalog from `prepare-to-launch`: 10 authentic brooches (`products.js`), 10 vector SVG glyphs (`public/media/brooches/*.svg`), Aster gift consultation flow (`/find-a-gift`), and luxury light catalog (`/shop`).
  - All direct links (`/shop`, `/find-a-gift`, `/blog`, `/blog/:slug`, `/product/:handle`, `/admin/*`) load cleanly with zero 404s.
- **Dynamic Blog Post 404 Resolution**:
  - Enabled SPA routing fallback on Cloudflare edge. Dynamic database-published posts (e.g. `/blog/why-younoya-is-different-from-a-traditional-astrology-store`) resolve without 404 trapping.
  - Added crawlable static route shells, JSON-LD `BlogPosting` schemas, and updated `sitemap.xml`, `robots.txt`, and `llms.txt`.
- **Backlinks Engine**:
  - Added "🔗 Add Link" dialog with store shortcuts (`+ Shop Link`, `+ Gift Finder`) in `JournalEdit.tsx`.
  - Authored regex markdown `[text](url)` and HTML `<a>` parser in `BlogPost.jsx`: internal links route via React Router `<Link to="..." className="article-backlink">`; external links open safely in a new tab.
- **Removed Products from Blog Articles**:
  - Excised `.article-keepsakes` product grid from `BlogPost.jsx` per user direction. Articles end cleanly with author attribution and Aster consultation callout.
- **Image Compression Pipeline**:
  - Compressed existing blog covers from ~1.6MB–2.1MB down to ~103KB–119KB WebP (94% reduction) preserving exact dimensions ((1672×941) & (1536×1024)).
  - Built client-side Canvas WebP compressor (`imageCompressor.ts`) in Admin to auto-compress all future uploads before sending to disk.
- **Editorial Blog Redesign**:
  - Streamlined `Blog.jsx` with quiet luxury header, dynamic category pills hiding empty categories, and 16:9 thumbnail grid with reading times.

### [2026-09-26] Phase 7: Production Coming Soon Facade & Full Platform Preservation
- **Coming Soon Landing Page (`main`)**:
  - Authored `ComingSoon.jsx` on `/` with diorama arrival still, multi-stop dark gradient scrim, golden Younoya crest, and VIP private email invite form.
  - Eliminated text carets on typography (`user-select: none`, `caret-color: transparent`) and removed rectangular input outline artifact on focus.
- **Full Platform Preservation (`prepare-to-launch`)**:
  - Preserved complete interactive e-commerce platform (scroll diorama film, 3D cylinder, cart drawer, blog, Aster journey, admin console) on branch `origin/prepare-to-launch`.

### [2026-09-25] Phase 6: Edge-Hosted React Admin Console & Headless Server Architecture
- **Edge-Hosted Admin Console (`younoya-web/src/admin`)**:
  - 16 custom React 19 management modules: `AdminApp.tsx`, `api.ts`, `Login.tsx`, `Journal.tsx`, `JournalEdit.tsx`, `Orders.tsx`, `Customers.tsx`, `Products.tsx`, `ThemeManager.tsx`, `RecommendationRules.tsx`, `Team.tsx`.
- **Backend Headless Enforcement & OOM Protection**:
  - Disabled `@medusajs/dashboard` on VPS (`admin: { disable: true }` in `medusa-config.ts`), protecting the 956MB RAM VPS from OOM crashes.
  - Uploaded media saved permanently to backend disk (`backend/static/`) and served with aggressive Cloudflare edge caching (`max-age=31536000`). Zero frontend rebuilds on content updates.
  - Pre-rendered 11 static admin shells so direct navigation on Cloudflare serves HTTP 200 without redirect loops.

### [2026-09-22 – 2026-09-23] Phase 5: Scroll-Scrubbed Story Film & Aster Gift Consultation
- **Story Film Engine**:
  - Master desktop film: `younoya-diorama-film-desktop.mp4` (24.375s, 1920×1080, GOP4, Blob seeking).
  - Master mobile film: `younoya-diorama-film-mobile.mp4` (26.75s, 720×1280, GOP4, Blob seeking).
  - Responsive viewport switching, frame-snapped seeking throttled to ~20 seeks/sec, and reduced-motion WebP poster fallbacks.
- **Interactive Aster Consultation Flow (`/find-a-gift`)**:
  - Multi-stage guided conversation with transparent boutique representative expressions, 120-year date picker, and solar-sign preview.
  - Strictly intention-only: budget was explicitly barred as a filter, sorting criteria, or form input.
- **Light Editorial Catalog (`/shop`)**:
  - Restyled to warm ivory (`#FAF6EE`), dark typography, and muted gold.

### [2026-09-19 – 2026-09-21] Phases 1–4: Foundation, Photoshoot Grounding & Agentic Memory
- **Physical Photoshoot Grounding**: Preserved `2026_09_09/` (283 raw camera photos, ~2.4GB) as authentic visual basis for ruby apple candle (`1A8A2284.JPG`), raw amethyst brass urn (`1A8A2075.JPG`), and sacred gold swing altar (`1A8A2150.JPG`).
- **Cloudflare Worker Static Assets (`ecom`)**: Standardized deployment via `npx wrangler deploy` with `assets: { directory: "dist", ... }`.
- **Inviolable Governance Rules Codified**:
  - Explicit push permission required before any `git push`.
  - Single final commit rule (no micro-commits).
  - Monorepo directory structure established with 7-subsystem `.agents/` memory architecture.

---

## 3. 🎯 Active Roadmap & Immediate Next Steps

1. **Verify Cloudflare CI Deployment**: Confirm build passes on Cloudflare Workers Static Assets without `_redirects` errors following the push to `origin main`.
2. **Medusa Commerce & Auth Sync**: Connect live storefront cart and checkout to Medusa 2.18 REST endpoints on `api.younoya.com`.
3. **Full Launch Transition**: When ready for full public launch, merge `prepare-to-launch` into `main` to replace `/` Coming Soon facade with the scroll diorama film.

---

## 4. ⚠️ Inviolable Architectural & Operational Constraints

1. **Explicit Git Push Permission Law**: NEVER execute `git push` without explicit user permission. Always ask first.
2. **Single Final Commit Law**: Group all code, static assets, dist, configs, and checkpoint updates into ONE single final semantic commit. Never create follow-up micro-commits.
3. **Dual Branch Strategy**:
   - `main`: Production branch serving Coming Soon on `/` with all other routes active via direct links.
   - `prepare-to-launch`: Feature-complete platform with scroll diorama hero film active on `/`.
4. **Zero Admin UI on VPS**: Admin console runs purely on frontend edge (`/admin/*`). Never build, compile, or serve Medusa dashboard on the VPS (956MB RAM OOM limit).
5. **Dynamic Media & Zero Rebuilds**: Admin media uploads save to backend server disk (`backend/static/`) and are cached via Cloudflare CDN. Adding content must never require frontend rebuilds or commits.
6. **No Budget Filtering**: Budget will NEVER be used as a filter, sorting mechanism, or recommendation criteria on `/shop` or `/find-a-gift`.
7. **Blob Video Scrubbing**: Always load scroll video via in-memory `Blob` in `StoryFilm.jsx` to ensure smooth frame-by-frame seeking across all browsers.
8. **Cloudflare SPA Routing Law**: Do NOT add `200` rewrites to `/index.html` in `_redirects`. Use `"not_found_handling": "single-page-application"` in `wrangler.jsonc`.

---

## 5. 🛠️ Verification & Health Commands

| Command | Directory | Purpose | Expected Result |
|---|---|---|---|
| `npm run build` | Root (`F:\Savvy_Ecom`) | Full production build & static shell generation | Exits 0, writes to `dist/` |
| `npx wrangler deploy --dry-run` | Root / `younoya-web` | Cloudflare Worker Static Assets validation | Exits 0, validates 126 assets |
| `npm run dev` | Root (`F:\Savvy_Ecom`) | Storefront development server | Runs on `http://localhost:5173` |
| `npm run serve` | Root (`F:\Savvy_Ecom`) | Production preview server | Serves `dist/` on `http://localhost:3000` |
| `npm run dev` | `backend/` | Medusa commerce backend | Runs API on port 9000 |
