# YOUNOYA — Scroll-Through Storefront

A **video-scrubbed cinematic storefront** built with the
[lets-scroll](lets-scroll-main/lets-scroll-main/skills/lets-scroll/SKILL.md) technique:
scroll position drives time through one unbroken camera flight across a neon-night
miniature gift store — guided by a robot-ninja mascot. No product catalog yet; the
storefront *is* the experience.

```text
storefront/               static site (no build step)
├── index.html            page + engine config (6 scenes, 5 connectors, mobile chain)
├── scrub-engine.js       verbatim lets-scroll scrub engine (blob-loading, seek-safe)
├── assets/               posters (.webp) + clips land in assets/vid/
└── render-handoff/       28 render prompts + HANDOFF.md spec tables + pipeline scripts
```

## Run it

Any static server from `storefront/`:

```bash
cd storefront
python -m http.server 4173      # or: npx serve .
```

Open http://localhost:4173. The site works today on placeholder posters (Ken-Burns
drift + crossfades); it upgrades itself the moment real renders are dropped in.

## Fill it with the real film (manual asset path)

No Monid/Higgsfield/Codex CLIs are installed here, so assets render in tools of your
choice. Full contract: [`storefront/render-handoff/HANDOFF.md`](storefront/render-handoff/HANDOFF.md).

1. Render the 6 landscape stills from `render-handoff/still_*.txt` → drop into `stills_raw/`
2. `python finalize_stills.py` → site posters + native 9:16 portrait canvases
3. Render 6 dives + 5 connectors (16:9) and the 9:16 portrait twins → `raw/`
   (`extract_frames.py` pulls the seam frames your connectors must start/end on)
4. `python encode_all.py` (needs ffmpeg) → everything lands wired in `assets/vid/`

Locked creative direction: **fly-through camera (dives + aerial hops) · neon-night
miniature art · midnight #0B0E18 / temple gold #D4AF37 palette · desktop + native 9:16**.

## Backend (dormant)

The Medusa v2 stack (`backend/`, docker-compose files) is untouched and dormant — no
products are wired into this storefront yet. When commerce returns, the engine's copy
layer and CTA slots are the integration points.
