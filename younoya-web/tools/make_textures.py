#!/usr/bin/env python3
"""Encode the 6 master stills into production WebP scene textures.

Input : assets-src/stills/still_<id>.png   (1800x1200 masters)
Output: public/scenes/<id>-c.webp          1920w, q80  (desktop/hero)
        public/scenes/<id>-m-c.webp         960w, q78  (mobile srcset-ready)
"""
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).parent.parent
SRC = ROOT / "assets-src" / "stills"
OUT = ROOT / "public" / "scenes"
IDS = ["threshold", "intent", "cosmos", "seek", "reveal", "companion"]

OUT.mkdir(parents=True, exist_ok=True)

for sid in IDS:
    src = SRC / f"still_{sid}.png"
    im = Image.open(src).convert("RGB")

    for width, quality, suffix in ((1920, 80, ""), (960, 78, "-m")):
        h = round(im.height * width / im.width)
        resized = im.resize((width, h), Image.LANCZOS)
        dst = OUT / f"{sid}-c{suffix}.webp"
        resized.save(dst, "WEBP", quality=quality, method=6)
        print(f"{dst.name:28s} {width}x{h}  {dst.stat().st_size/1024:.0f} KB")
