# Project Context & Infrastructure Background

## 1. Project Identity
- **Name**: YOUNOYA — For Every Chapter
- **Value Proposition**: Premium personalized gifting brand and e-commerce experience fusing Cartier spatial aesthetic with Vedic astrology/numerology consecration.
- **Repository**: `https://github.com/astrosavvy/Ecom.git` (branch: `main`)

## 2. Directory Layout & Roles
- [`younoya-web/`](file:///F:/Savvy_Ecom/younoya-web): The active storefront (Vite 6, React 19, Framer Motion, Lenis, React Router 7). Built with `npm run build` -> `dist/`.
- [`backend/`](file:///F:/Savvy_Ecom/backend): Medusa 2.18 commerce API, PostgreSQL 15, Redis, passwordless mobile OTP auth.
- [`creative/younoya-scroll-film/`](file:///F:/Savvy_Ecom/creative/younoya-scroll-film): Approved four-leg lets-scroll film chain, prompt packages, seam-grid QA evidence, and stills.
- `2026_09_09/`: 283 raw camera photoshoot JPGs (~2.4 GB) from September 9, 2026 ("I Love You Aromatherapy candles"). Preserved and kept in `.gitignore`.
- [`.agents/`](file:///F:/Savvy_Ecom/.agents): Living agent memory, hard system rules, domain specifications, and checkpoint handoff journal.

## 3. Server URLs & Credentials
- **Storefront Dev**: `http://localhost:5173/`
- **Storefront Production Preview**: `http://localhost:3000/` (`node serve.js`)
- **Backend API**: `http://localhost:9000/`
- **Backend Admin Dashboard**: `http://localhost:9000/app`
- **Production Edge Storefront**: `https://younoya.com/` (Cloudflare Pages)
- **Production Edge API**: `https://api.younoya.com/` (Cloudflare Tunnel -> VPS 140.245.7.165 port 80/9000)
- **Publishable API Key**: `pk_d4577228b532cf8c81a5b63e898652da2dbaf9730acd3f8f449ccda1f8482c75`
