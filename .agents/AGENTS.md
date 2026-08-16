# YOUNOYA — Project Rules & Architecture Specifications

Rules for all AI agents, engineers, and automated workflows modifying code, configuration, or design in this repository.

---

## 1. Brand Mission & Core Value Proposition (MSP)

**YOUNOYA** is a sacred Vedic Astrological Guidance and Energized Keepsake Sanctuary with **zero-password authentication**.

> [!IMPORTANT]
> **Our Core MSP (Mystery & Astro-First Guidance)**:
> 1. **No generic catalog disclosures or rakhi mentions upfront**: We do not sell generic items. Seekers provide their sacred birth parameters (DOB, Time of Birth, Place of Birth), and our Vedic ephemeris engine calculates their exact planetary transit, lunar Rashi, and Nakshatra to prescribe personalized consecrated keepsakes.
> 2. **Zero-Password OTP Verification**: Secure, single-use mobile OTP with salted cryptographic hashes (SHA-256) and discrete guest fallback for instant onboarding.
> 3. **Conversion Path**:
>    - Fullscreen Cursor-Tracked Video Hero → "✦ Calculate Kundali" → Stacked Card Onboarding Deck (Mobile OTP → Personal Birth Details → Recipient Intent → Astral Synergy Calculation) → Fluid Bubble Dissolve → Personalized Consecrated Talisman Reveal & 1-Click Express Checkout.

---

## 2. Technology Stack

| Layer | Technology |
|---|---|
| Frontend Storefront | **Next.js 16+ (App Router, Turbopack, React, TypeScript)** |
| Styling & Theme | **Vanilla CSS + Modern Tailwind v4, Glassmorphism Tokens** |
| Motion & Kinematics | **Framer Motion spring physics, 3D Depth Layering, SVG Gooey Metasphere Filters** |
| Commerce & Astrology API | **PHP 8.4-FPM + Nginx on Ubuntu VPS (`140.245.7.165`)** |
| Database | **MariaDB 10.11+ (`customer_profiles`, `gift_recipients`, `otp_challenges`, `products`)** |
| Payments & Logistics | **Razorpay Gateway + Shiprocket Free Express Air Dispatch across India** |
| Hosting & Edge CDN | **Cloudflare Pages / Edge Network (Frontend) + Dedicated VPS (Backend)** |

---

## 3. Project Structure

```
Savvy_Ecom/
├── storefront/                  # Next.js 16 Storefront Application
│   ├── public/
│   │   ├── zodiac/              # 12 Astrological Rashi Cards (9:16 PNG)
│   │   ├── younoya_celestial_gold_clean.png  # Transparent Golden Emblem Logo
│   │   └── younoya_cosmic_theme_banner.jpg   # Brand Reference Artwork
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx       # Root layout & Google Fonts (Instrument Serif, Inter)
│   │   │   ├── page.tsx         # Video Hero, Zodiac Marquee, Onboarding trigger
│   │   │   ├── globals.css      # Design tokens, marquee & spin animations
│   │   │   └── cart/ checkout/ products/  # Checkout & order confirmations
│   │   ├── components/
│   │   │   ├── layout/          # Header (Logo, Nav, Kundali CTA) & Footer
│   │   │   ├── astrology/       # ZodiacMarquee.tsx (Twitch-style infinite stream)
│   │   │   └── onboarding/      # OnboardingDeckModal.tsx, GooeyFilterDefs.tsx
│   │   │       ├── cards/       # Card1MobileLogin, Card1BOtpDetached, Card2PersonalAstro, Card3GiftIntent, Card4RecipientAstro
│   │   │       └── transitions/ # FluidBubbleDissolve.tsx (Metaball bubble burst)
│   │   └── lib/                 # astrologyEngine.ts, CartContext.tsx, api.ts
│   └── package.json
├── backend/                     # High-Performance API Engine
│   ├── deploy/sql/              # MariaDB migrations (astrology_auth_migration.sql)
│   └── public/index.php         # REST Endpoints (Mobile OTP, Kundali, Synergy, OMS, Admin)
├── .agents/
│   ├── AGENTS.md                # Agent rules & constraints (this document)
│   └── workflows/               # Automated development & deployment workflows
└── README.md
```

---

## 4. Visual Identity & Luxury Design Tokens

- **Midnight Obsidian Canvas**: `#07080E`, `#080A10`, `#040508`
- **Sacred Celestial Amber**: `#D4AF37`, `#F59E0B`, `#B8860B`
- **Kumkum Nebula Red**: `#DC2626`, `#991B1B`
- **Cosmic Astral Blue**: `#0E2A47`, `#0D9488`
- **Glass Surfaces**: `rgba(8, 10, 16, 0.95)` with `1px` subtle gold border `rgba(212, 175, 55, 0.35)` and `backdrop-blur-3xl`.
- **Typography**:
  - Headings: `'Outfit', 'Instrument Serif', Georgia, serif`
  - Technical / Badges: `'JetBrains Mono', 'Fira Code', monospace`
  - Body: `'Inter', sans-serif`

---

## 5. Security & Mobile OTP Specifications

| Rule | Value |
|---|---|
| Format | 6-digit numeric, cryptographic `random_int(100000, 999999)` |
| Storage | Salted SHA-256 Hash only (`hash('sha256', OTP . salt)`) — never store raw plaintext |
| Salt | 32-character hexadecimal per challenge |
| Expiry | ≤ 10 minutes |
| Max Attempts | 5 attempts per challenge with timing-safe `hash_equals()` |
| Resend Cooldown | 60 seconds sliding window |
| Rate Limits | Max 5 OTPs/hour per mobile, Max 20 OTPs/hour per IP |
| Guest Fallback | Discrete "OTP not received? Proceed with Guest Pass" bypass allowed |
| Session Token | 64-character cryptographically secure token set in `HttpOnly, Secure, SameSite=Lax` cookie |

---

## 6. VPS Backend Deployment Rules (Rule 9 — Direct SCP Transfer)

1. **No Git Pull on VPS**: The VPS backend does not pull from git.
2. **Transfer via SCP as `ubuntu` user**:
   ```bash
   scp -i "C:\Users\Palak\.ssh\id_ed25519_clean" backend/public/index.php ubuntu@140.245.7.165:/tmp/index.php
   ```
3. **Move & Restart Services**:
   ```bash
   ssh -i "C:\Users\Palak\.ssh\id_ed25519_clean" ubuntu@140.245.7.165 "sudo cp /tmp/index.php /var/www/younoya/backend/public/index.php && sudo chown www-data:www-data /var/www/younoya/backend/public/index.php && sudo systemctl restart php8.4-fpm nginx"
   ```

---

## 7. Development & Quality Assurance Rules

1. **Maintain Zero Build Errors**: Always run `npm run build` in `storefront/` prior to pushing to `main`.
2. **Preserve Fluid Card Motion**: Keep 3D perspective (`perspective: 1600px`), spring physics (`stiffness: 300, damping: 26`), and backing silhouette cards for depth cues.
3. **Preserve MSP Positioning**: Never add generic product buttons, shop collections, or rakhi disclosures to the initial browsing view.
