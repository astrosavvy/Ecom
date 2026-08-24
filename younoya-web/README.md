# Younoya — Living Paintings

Cinematic scroll-driven storefront built with **zero video**: six AI-rendered
"neon-night miniature" paintings become living dioramas via monocular depth
maps + WebGL displacement shaders. Scroll scrubs the camera; scenes hand off
through noise-displacement dissolves.

## Architecture

| Layer | Tech | Weight (gz) |
|---|---|---|
| Build | Vite 7 + React 19 + TypeScript | — |
| Smooth scroll | Lenis | ~3 kB |
| Scroll story | GSAP ScrollTrigger (free) | ~28 kB |
| UI animation | Motion (`motion/react`) | ~31 kB |
| Scene renderer | OGL (one fullscreen quad + custom GLSL) | ~10 kB |
| Scene textures | 6 × WebP 1920w (~970 kB total) | — |
| Depth maps | 6 × WebP 640w grayscale (~60 kB total) | — |

**Total page weight ≈ 2 MB** (vs 38.8 MB of video in the previous build).
First paint needs only HTML+CSS+JS chunks; textures stream behind the preloader.

## The film

`src/scene/SceneCanvas.tsx` mounts one OGL canvas that lives through all six
chapters. A single `ScrollTrigger` scrubs a mutable `{ t, vel }` ref (no React
re-renders). The render loop maps global progress → scene pair + uniforms:

- **Dive-in** — within a chapter, zoom eases 1.17 → 1.0 (`uDrift`)
- **Parallax** — per-pixel UV offset weighted by the depth map; near pixels move more. Mouse adds ±micro-parallax so frames feel alive at rest
- **Scene handoff** — last 22 % of each chapter: value-noise displacement dissolve between scene A and B (no seams to maintain, ever)
- **Velocity kick** — scroll speed feeds a decaying uniform that skews the offset
- **Grade** — vignette + faint animated grain

Fallbacks: no WebGL or `prefers-reduced-motion` → static poster stack,
word-reveal animations skipped, native scroll kept.

## Asset pipeline

```bash
# masters live in assets-src/stills/ (1800×1200 PNG)
python tools/make_textures.py   # → public/scenes/<id>-c.webp (+ -m mobile)
python tools/make_depth.py      # → public/scenes/<id>-d.webp (Depth Anything V2, local CPU)
```

Depth maps are generated once offline; nothing ML runs in the browser.

## Develop / build / deploy

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # dist/
npx wrangler pages deploy dist --project-name=younoya   # Cloudflare Pages
```

`public/_headers` pins immutable caching for `/scenes/*`.

## Sections

1. Preloader — texture progress bar, curtain exit
2. Film stage — sticky canvas, 6 chapters, word-by-word type reveals
3. Collection — shoppable grid, scroll-in cards (placeholder `PRODUCTS` in `src/lib/data.ts`)
4. Your Chart — birth-date intake → client-side zodiac reading
5. Ritual — three-step story strip
6. Footer
