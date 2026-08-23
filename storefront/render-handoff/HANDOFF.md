# YOUNOYA × lets-scroll — Render Handoff (manual asset path)

> **STATUS UPDATE — first batch processed**
> ✅ Table A stills: 6/6 rendered, validated (3:2, ≥1200px), posters live, portrait canvases built
> ✅ Table C dives: 6/6 rendered — all 8s @720p, frame-0 vs still match verified (`check_seams.py`: 9–15 diff, no re-rolls), encoded to `assets/vid/*.mp4`
> ⏳ Table D connectors: 5 pending — seam frames are EXTRACTED and waiting in `frames/` (see table below)
> ⏳ Tables E/F portrait chain: 11 pending — canvases ready in `portrait_canvas/`
> ℹ️ index.html currently nulls connector slots + mobile variants; restore after encoding.
> ℹ️ ffmpeg 9.0 installed via winget — `extract_frames.py` / `encode_all.py` now work from any new shell.

You render, the pipeline does everything else. This file is the contract: every
prompt file exists in this folder, each table says exactly which conditioning
frame(s) a clip assumes and the exact filename to save as. Keep the Status column
current (`pending → rendered → accepted`).

## The three laws (break these and seams pop)

1. **One style preamble everywhere** — it is byte-identical inside all 28 prompt
   files. Never edit it per-file; that's what makes 6 scenes read as one world.
2. **Connectors chain ACTUAL rendered frames** — start = previous dive's *rendered*
   last frame, end = next dive's *rendered* first frame — never the original still.
   `python extract_frames.py` pulls them for you after dives land.
3. **Portrait is its own complete chain** — 9:16 connectors frame-lock against
   9:16 renders only (§6b step 3). Never mix landscape frames into the portrait chain.

## Tool requirements

| Asset | Requirement |
|---|---|
| Stills | any image tool · wide 3:2 landscape · ≥1536 px · solid #0B0E18 background · no text |
| Dives | video tool that accepts a **first/start frame** · ~8 s · 16:9 (desktop) / 9:16 (mobile) |
| Connectors | video tool that accepts **start AND end frames** (e.g. Kling start/end-frame mode, Seedance first/last-frame) · ~5 s |
| Audio | none anywhere |

Suggested params when your tool exposes them: mode std, 1080p desktop masters,
native portrait for mobile, highest quality available.

## Table A — Landscape stills (6)

Prompt file | Save PNG into `stills_raw/` as | Status
---|---|---
`still_threshold.txt` | `still_threshold.png` | pending
`still_intent.txt` | `still_intent.png` | pending
`still_cosmos.txt` | `still_cosmos.png` | pending
`still_seek.txt` | `still_seek.png` | pending
`still_reveal.txt` | `still_reveal.png` | pending
`still_companion.txt` | `still_companion.png` | pending

Then: `python finalize_stills.py`
→ validates aspect/width, writes site posters `assets/<name>.webp`, and auto-builds
`portrait_canvas/<name>.png` (1080×1920, island at 94% width, centre 45% height)
for Table E starts.

Review cohesion before diving: same angle, same palette, same night-light logic.
Off-style? Re-roll that one still, optionally feeding an approved sibling as a
style reference image.

## Table C — Dive clips, 16:9 (6)

Start frame = the still you just accepted. Save into `raw/`.

Prompt file | Start frame | Duration | Save as | Status
---|---|---|---|---|
`dive_threshold.txt` | accepted `still_threshold` | ~8 s | `raw/dive_threshold.mp4` | pending
`dive_intent.txt` | accepted `still_intent` | ~8 s | `raw/dive_intent.mp4` | pending
`dive_cosmos.txt` | accepted `still_cosmos` | ~8 s | `raw/dive_cosmos.mp4` | pending
`dive_seek.txt` | accepted `still_seek` | ~8 s | `raw/dive_seek.mp4` | pending
`dive_reveal.txt` | accepted `still_reveal` | ~8 s | `raw/dive_reveal.mp4` | pending
`dive_companion.txt` | accepted `still_companion` | ~8 s | `raw/dive_companion.mp4` | pending

Acceptance rule per dive: frame 0 must match the handed-over still exactly
(composition identical); last frame should read like a calm forward glide — if it
looks mid-orbit or blurred sideways, re-roll before using it for Table D.

## Table D — Aerial connectors, 16:9 (5)

Run `python extract_frames.py` once dives land, then fill these slots:

Prompt file | Start frame (`frames/`) | End frame (`frames/`) | Save as | Status
---|---|---|---|---|
`conn_1.txt` | `last_threshold.png` | `first_intent.png` | `raw/conn_1.mp4` | pending
`conn_2.txt` | `last_intent.png` | `first_cosmos.png` | `raw/conn_2.mp4` | pending
`conn_3.txt` | `last_cosmos.png` | `first_seek.png` | `raw/conn_3.mp4` | pending
`conn_4.txt` | `last_seek.png` | `first_reveal.png` | `raw/conn_4.mp4` | pending
`conn_5.txt` | `last_reveal.png` | `first_companion.png` | `raw/conn_5.mp4` | pending

Acceptance: start frame obeyed exactly; end frame must land on the end-image
*composition* (a near-miss is fine — the engine crossfades a few frames).

## Table E — Native 9:16 dives (6) · mobile opt-in

Start frame = the auto-built canvas from `finalize_stills.py`. Same prompts with
the portrait clause already prepended. Save into `raw/`.

Prompt file | Start frame (`portrait_canvas/`) | Save as | Status
---|---|---|---|
`dive_<name>_portrait.txt` (×6, same names as Table C) | `<name>.png` | `raw/dive_<name>-m.mp4` | pending

## Table F — Native 9:16 connectors (5)

Frames come from the PORTRAIT renders only (extract_frames.py handles both chains).

Prompt file | Start frame (`frames/`) | End frame (`frames/`) | Save as | Status
---|---|---|---|---|
`conn_1_portrait.txt` | `m_last_threshold.png` | `m_first_intent.png` | `raw/conn_1-m.mp4` | pending
`conn_2_portrait.txt` | `m_last_intent.png` | `m_first_cosmos.png` | `raw/conn_2-m.mp4` | pending
`conn_3_portrait.txt` | `m_last_cosmos.png` | `m_first_seek.png` | `raw/conn_3-m.mp4` | pending
`conn_4_portrait.txt` | `m_last_seek.png` | `m_first_reveal.png` | `raw/conn_4-m.mp4` | pending
`conn_5_portrait.txt` | `m_last_reveal.png` | `m_first_companion.png` | `raw/conn_5-m.mp4` | pending

## Finish line

```bash
python encode_all.py      # raw/*.mp4 -> storefront/assets/vid/*.{mp4,-m.mp4}
```

The site needs zero code changes — filenames are already wired. Until clips land,
the engine gracefully scrubs the stills (Ken-Burns drift + crossfades), so the
storefront is presentable from minute one.

## Gotchas worth your credits

- **NSFW false positives**: innocuous interiors get flagged by some filters.
  Re-roll first (often non-deterministic); strip trigger words ("bed", "pool");
  as a last resort render just that clip on a different model with the SAME
  start/end frames. If a connector truly can't pass, delete its entry from the
  `connectors:` array in index.html — the engine crossfades that seam directly.
- **Model mixing**: keep ONE video model for the whole chained sequence; mixing
  render characters mid-chain reads as a subtle pop even when frames hand off.
- **ffmpeg**: needed only for `extract_frames.py` + `encode_all.py`
  (`winget install Gyan.FFmpeg`).
- Stills are cheap insurance: they remain the poster/fallback layer forever, so
  spend quality time there first.

## QA checklist (after encoding)

1. Serve (`npx serve storefront` or `python -m http.server`) and scroll through:
   no visible pops at the 5 seams; motion reverses cleanly scrolling up.
2. DevTools console: no errors; confirm clips load as blobs (Network panel).
3. Phone or emulated viewport: `-m.mp4` variants are served; fast flick doesn't
   freeze the scene; no blank flash on iOS Safari.
4. `prefers-reduced-motion`: falls back to stills, no scrubbing.
