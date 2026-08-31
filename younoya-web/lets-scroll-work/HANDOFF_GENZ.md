# YOUNOYA — GenZ Thriller 10s Single Video (Portrait-First)

**Art:** Glossy vinyl-toy, neon-night rim, wet reflective, high contrast (not soft clay). Palette #07080E / #D4AF37 / #F5EDE0 (tokens.css). Logo: YOUNOYA brushed steel wordmark submerged as desk inlay / lid emboss.

**Story:** Overload (generic) → Holographic intel (birth → Rashi/Dasha) → Drop (curated toolkit) — "Generic is easy. Personal is meaningful." Thrill via pace + contrast, not myth.

**Work (Manual):**

| Prompt File | Start | End | Save As | Status |
|---|---|---|---|---|
| `story_start.txt` | — | — | `story_start.png` (9:16 ≥1080×1920) | pending |
| `story_end.txt` | — | — | `story_end.png` (9:16) | pending |
| `story_10s.txt` | `story_start.png` | `story_end.png` | `story_10s.mp4` (9:16, 10s, muted) → `story_10s-m.mp4` (720, -g 4, crf23) | pending |

**Specs:** 9:16 portrait, solid #07080E, no text, centered, logo only as physical inlay. Video: --start-image + --end-image, 10s.
**Encode:** `ffmpeg -i story_10s.mp4 -an -vf "scale=720:-2,unsharp=5:5:0.8:5:5:0.0" -c:v libx264 -preset slow -crf 23 -pix_fmt yuv420p -g 4 -keyint_min 4 -sc_threshold 0 -movflags +faststart story_10s-m.mp4`
**Poster:** `ffmpeg -ss 0 -i story_10s-m.mp4 -frames:v 1 story_poster.webp`

**Wiring (HomePage hero pinned scrub):**
```js
mountLetsScroll(document.getElementById("younoya-hero"), {
  brand:{name:"YOUNOYA"},
  sections:[{id:"hero", still:"assets/story_poster.webp", stillMobile:"assets/story_poster.webp", clip:"assets/vid/story_10s.mp4", clipMobile:"assets/vid/story_10s-m.mp4", scroll:1.3, linger:0.45, accent:"#D4AF37", eyebrow:"YOUNOYA", title:"Generic is easy. Personal is meaningful.", body:"Overload → intel → curated drop.", tags:["Thriller","Personalised"] }],
  connectors:[]
})
```

Render `story_start.png` + `story_end.png` now (keep GenZ preamble byte-identical), drop into `lets-scroll-work/` and tell me — I’ll validate ffprobe 9:16 + frame 0 ≡ start-image, then you render `story_10s.mp4`.
