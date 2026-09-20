---
name: modern-web-architect-engine
description: Interactive brand discovery, design theory synthesis, and custom step-by-step workflow generator for architecting high-converting modern motion websites (Aurora effects, Bento grids, cursor physics, scroll kinematics) based on MotionSites.ai patterns. Use this skill whenever the user wants to design or build a landing page, marketing site, SaaS website, or portfolio with modern "kinetic" motion design — Aurora/glow backgrounds, glassmorphism, Bento grids, magnetic buttons, cursor spotlight effects, or scroll-driven 3D animation — even if they just say "make my landing page feel more premium/modern" or describe a vibe rather than naming these techniques explicitly.
---

# Modern Motion Web Architect & Discovery Engine

An expert system and interactive workflow generator for designing and building new-age motion websites. This skill enforces a structured Discovery-First approach: it interviews the user across all brand identity, aesthetic, and technical pillars before formulating a tailored step-by-step master plan and MotionSites.ai-grade AI prompts.

## 1. Operating Workflow Architecture

```
┌────────────────────────────────────────────────────────┐
│ Stage 1: Brand & Aesthetic Discovery Intake            │
│ (Conducts structured intake across 5 core pillars)     │
└──────────────────────────┬─────────────────────────────┘
                           │ [User Provides Input]
┌──────────────────────────▼─────────────────────────────┐
│ Stage 2: Design Theory & Kinematic Token Synthesis     │
│ (Maps input to color tokens, spring physics & layout)  │
└──────────────────────────┬─────────────────────────────┘
                           │
┌──────────────────────────▼─────────────────────────────┐
│ Stage 3: Master Step-by-Step Implementation Blueprint  │
│ (Architectural roadmap, code recipes & builder prompts)│
└────────────────────────────────────────────────────────┘
```

## 2. Stage 1: The Brand & Theory Discovery Questionnaire

Before drafting any implementation plan or AI prompt, initiate discovery by asking the user the following structured questions:

### 1. Brand Essence & Emotional Tone
- **Core Value & Product**: What is the product, service, or brand? What is the single core transformation or promise it offers?
- **Emotional Archetype**: What should a visitor feel in the first 3 seconds? (Examples: Ultra-futuristic & Cyberpunk, Hyper-minimalist & Serene, High-velocity Developer Tool, Luxury Editorial, Warm Organic Wellness)
- **Target Audience**: Who is using this? (Enterprise buyers, indie developers, luxury consumers, Gen-Z creators?)

### 2. Visual Style & Luminescence Profile
- **Canvas Foundation**: Deep Dark Mode (#030712, #08090a), Frosted High-Key Light Mode, or Dual Adaptive?
- **Aurora Color Palette**: What are the 2–3 glowing accent colors? (Examples: Electric Indigo + Neon Cyan + Magenta; Emerald Green + Cyber Lime; Obsidian + Warm Amber Gold)
- **Surface Styling**: Heavy Glassmorphism (backdrop-blur-xl), Minimal Flat with 1px Highlight borders, or Retro-Terminal wireframe?

### 3. Typography & Information Architecture
- **Heading & Body Fonts**: Neo-Grotesque Sans (Inter, Geist, Satoshi), Luxury Editorial Serif (Playfair, PP Editorial New), or Technical Monospace (JetBrains Mono)?
- **Layout Structure**: Modular Bento Grid, Split-Screen Narrative Hero, Fullscreen 3D Scroll Journey, or Card-based SaaS funnel?

### 4. Motion & Kinematic Preferences
- **Cursor Dynamics**: Radial Spotlight Cone, Magnetic CTA Button Pull, Custom Cursor Follower, or 3D Card Hover Tilt?
- **Ambient Background**: Organic Floating Aurora Mesh Blobs, Dynamic Particle Mesh, Liquid Shader Canvas, or Subtle Static Grid?
- **Scroll Dynamics**: Viewport Parallax, Sticky Section Stacking, 3D Device Expansion, or Horizontal Feature Scroll?

### 5. Implementation Stack & Target Environment
- **Framework**: Next.js (App Router), React + Vite, Astro, or SvelteKit?
- **Libraries**: Tailwind CSS, Framer Motion, GSAP + ScrollTrigger, Lucide Icons, Three.js / R3F?
- **AI Prompt Target (if applicable)**: Optimized for Cursor Composer, Lovable.dev, Bolt.new, v0 by Vercel, or Claude?

## 3. Stage 2: Synthesis of Brand Tokens & Physics Parameters

Upon receiving the user's responses, translate them into a standardized design specification:

- **Color & Luminescence System**:
  - Base Canvas: Primary dark/light token
  - Aurora Stops: Radial mesh blurs (`from-color-1/30 via-color-2/20 to-color-3/20 blur-[130px]`)
  - Border Gradient: `linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.02))`
- **Kinematic Spring Profile**:
  - Magnetic Pull: `stiffness: 350, damping: 20`
  - Aurora Cursor Follower: `stiffness: 150, damping: 25, mass: 0.5`
  - 3D Card Hover Tilt: `maxTilt: 10deg, spring: { damping: 20 }`

## 4. Stage 3: Master Step-by-Step Implementation Workflow

Deliver an end-to-end plan organized into actionable steps:

1. **Project Scaffolding & Design Tokens** — Set up Next.js / React + Tailwind CSS with custom blur filters, keyframe animations, and color tokens.
2. **Global Canvas & Reactive Aurora Background** — Code the mouse-following Aurora mesh using Framer Motion `useMotionValue` + `useSpring` over a masked background grid.
3. **Floating Frosted Header & Magnetic Navigation** — Build a frosted glass navigation pill with animated hover pills and magnetic CTA button.
4. **High-Conversion Hero Section** — Implement high-contrast typography, live pulsing status badges, and interactive action buttons.
5. **Bento Grid Feature Showcase with Cursor Spotlight** — Build an asymmetric CSS Grid with dynamic `useMotionTemplate` cursor spotlights revealing card borders and glowing gradients.
6. **Scroll-Driven 3D Interactive Showcase** — Build a product preview component that scales and un-tilts on scroll via `useScroll` + `useTransform`.
7. **Infinite Marquee & Micro-Interactions** — Add a social proof marquee with gradient edge masks and interactive tab switchers.
8. **60fps Optimization & Reduced-Motion Accessibility** — Ensure transforms run strictly on the GPU and provide `@media (prefers-reduced-motion)` fallbacks.

## 5. Master AI Prompt Template (MotionSites.ai Format)

Synthesize the final discovery data into a ready-to-use prompt for AI code generators:

```
### MASTER PROMPT: [Project Name] High-Kinetic Modern Landing Page

1. Brand Core & Tech Stack:
   - Project: [Brand Name] - [One-Sentence Value Prop]
   - Stack: Next.js 14+ / React 19 + Tailwind CSS + Framer Motion + Lucide React

2. Visual Style & Luminescence:
   - Canvas: [Canvas Color, e.g., #030712] with masked 4rem grid background.
   - Aurora Mesh: [Color 1] + [Color 2] + [Color 3] ambient mesh glows.
   - Glassmorphism: Cards with backdrop-blur-xl, 1px white/10 borders, and radial hover spotlights.
   - Typography: [Heading Font] (tight tracking, gradient text) + [Mono Font] for badges.

3. Kinematics & Physics:
   - Aurora Follower: Background blur mesh tracks cursor with spring damping (damping: 25, stiffness: 150).
   - Bento Spotlight: Interactive radial spotlight tracks local mouse (x,y) over each card.
   - Magnetic Buttons: CTAs pull toward cursor on hover within a 50px threshold.
   - Scroll Transform: Hero preview scales from 0.9 to 1.0 with 3D rotation flattening as user scrolls.

4. Page Structure & Components:
   - [Nav]: Floating glass pill with magnetic CTA.
   - [Hero]: Value badge, headline, dual magnetic CTAs, reactive Aurora canvas.
   - [Bento Grid]: 3-column asymmetric layout with interactive feature visualizers.
   - [Social Proof]: Infinite marquee with gradient edge fade masks.
   - [Footer]: Ambient horizon glow, CTA banner, and minimal sitemap.

5. Performance Rules:
   - Animate only transform/opacity for 60fps GPU acceleration.
   - Implement reduced-motion media query fallbacks.
```
