#!/usr/bin/env python3
"""
Step A after your stills render -- validates, converts, and builds portrait canvases.

Input : stills_raw/still_<name>.png   (any tool's output; 3:2-ish, >=1200px wide)
Output: ../assets/<name>.webp                    1800w site poster (replaces placeholder)
        portrait_canvas/<name>.png               1080x1920 canvas for the 9:16 chain
                                                 (island ~94% width, centre ~45% height)

Usage:
    python finalize_stills.py            # processes whatever is present
"""
import pathlib
import sys

from PIL import Image

HERE = pathlib.Path(__file__).parent
RAW = HERE / "stills_raw"
ASSETS = HERE.parent / "assets"
CANVAS_DIR = HERE / "portrait_canvas"

BG = (11, 14, 24)  # #0B0E18

NAMES = ["threshold", "intent", "cosmos", "seek", "reveal", "companion"]


def validate(img, name):
    w, h = img.size
    ratio = w / h
    if not (1.42 <= ratio <= 1.58):
        print(f"  [warn] {name}: aspect {ratio:.3f} not ~3:2 -- check your tool settings")
    if w < 1200:
        print(f"  [FAIL] {name}: width {w}px < 1200px minimum"); return False
    return True


def process(name):
    src = RAW / f"still_{name}.png"
    if not src.exists():
        # accept any extension the user's tool produced
        cands = list(RAW.glob(f"still_{name}.*"))
        if not cands:
            print(f"- {name}: no still found in stills_raw/ (skipped)")
            return False
        src = cands[0]

    img = Image.open(src).convert("RGB")
    if not validate(img, name):
        return False

    ASSETS.mkdir(exist_ok=True)
    out = ASSETS / f"{name}.webp"
    tw = 1800
    th = round(img.height * tw / img.width)
    img.resize((tw, th), Image.LANCZOS).save(out, "WEBP", quality=84, method=6)
    print(f"+ {name}: {src.name} -> assets/{out.name} ({tw}x{th})")

    # ---- §6b step 1: native portrait start canvas -------------------------
    CANVAS_DIR.mkdir(exist_ok=True)
    CW, CH = 1080, 1920
    canvas = Image.new("RGB", (CW, CH), BG)
    iw = int(CW * 0.94)
    ih = round(img.height * iw / img.width)
    island = img.resize((iw, ih), Image.LANCZOS)
    cx = (CW - iw) // 2
    cy = int(CH * 0.45) - ih // 2          # visual centre ~45% height
    canvas.paste(island, (cx, cy))
    cpath = CANVAS_DIR / f"{name}.png"
    canvas.save(cpath)
    print(f"  -> portrait canvas: render-handoff/portrait_canvas/{name}.png ({CW}x{CH})")
    return True


def main():
    ok = 0
    for n in NAMES:
        ok += bool(process(n))
    print(f"\n{ok}/6 stills finalized.")
    if ok < 6:
        print("Drop the remaining renders into render-handoff/stills_raw/ and re-run.")
        sys.exit(1)


if __name__ == "__main__":
    main()
