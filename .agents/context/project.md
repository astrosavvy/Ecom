# Project Context & Infrastructure Background

> **Source of Truth**: Younoya Website Identity Document (Updated 2026-09-20)

---

## 1. Project Identity & Core Proposition

- **Brand Name**: YOUNOYA — For Every Chapter
- **Core Promise**: *“Astrology-backed gifting, curated for what matters.”*
- **Value Proposition**: Premium modern Indian gifting brand at the intersection of astrology, intentional gifting, and meaningful rituals. Curating gift hampers (2–3 products in a luxury basket or tray) and individual keepsakes chosen with intention and guided by astrological insight.
- **Repository**: `https://github.com/astrosavvy/Ecom.git` (branch: `main`)

---

## 2. Directory Layout & Roles

- [`younoya-web/`](file:///F:/Savvy_Ecom/younoya-web): Single canonical frontend storefront (Vite 6, React 19, Framer Motion, Lenis, React Router 7). Built with `npm run build` -> `dist/`.
- [`backend/`](file:///F:/Savvy_Ecom/backend): Medusa 2.18 commerce API, PostgreSQL 15, Redis, passwordless mobile OTP auth, custom modules (`younoya-otp`, `younoya-blog`, `younoya-astro`).
- [`creative/younoya-scroll-film/`](file:///F:/Savvy_Ecom/creative/younoya-scroll-film): Media production workspace containing 16:9 and 9:16 reference frames (`younoya-hamper-hero-landscape-16x9.jpg`, `younoya-hamper-hero-portrait-9x16.jpg`), video legs, prompts, and QA evidence.
- `2026_09_09/`: 283 raw camera photoshoot JPGs (~2.4 GB) from September 9, 2026 ("I Love You Aromatherapy candles"). Preserved and kept in `.gitignore`. Direct visual reference for authentic product modeling (apple candle `1A8A2284.JPG`, amethyst vessel `1A8A2075.JPG`, gold sacred swing `1A8A2150.JPG`).
- [`.agents/`](file:///F:/Savvy_Ecom/.agents): Living agent memory, hard system rules, domain specifications, and checkpoint handoff journal.

---

## 3. Server URLs & Credentials

- **Storefront Dev**: `http://localhost:5173/` (`npm --prefix younoya-web run dev` or root `npm run dev`)
- **Storefront Production Preview**: `http://localhost:3000/` (`node serve.js`)
- **Backend API**: `http://localhost:9000/`
- **Backend Admin Dashboard**: `http://localhost:9000/app`
- **Production Edge Storefront**: `https://younoya.com/` (Cloudflare Worker Static Assets)
- **Production Edge API**: `https://api.younoya.com/` (Cloudflare Tunnel -> VPS 140.245.7.165 port 80/9000)
- **Publishable API Key**: `pk_d4577228b532cf8c81a5b63e898652da2dbaf9730acd3f8f449ccda1f8482c75`
