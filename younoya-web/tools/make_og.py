#!/usr/bin/env python3
"""One-shot: crop the threshold still into a 1200x630 OG share image."""
from pathlib import Path
from PIL import Image

SRC = Path(__file__).parent.parent / "assets-src" / "stills" / "still_threshold.png"
DST = Path(__file__).parent.parent / "public" / "og.jpg"

im = Image.open(SRC).convert("RGB")
tw, th = 1200, 630
ratio = tw / th
w, h = im.size
if w / h > ratio:
    nw = int(h * ratio)
    x = (w - nw) // 2
    im = im.crop((x, 0, x + nw, h))
else:
    nh = int(w / ratio)
    y = (h - nh) // 2
    im = im.crop((0, y, w, y + nh))
im = im.resize((tw, th), Image.LANCZOS)
im.save(DST, "JPEG", quality=82, optimize=True, progressive=True)
print(f"{DST} {DST.stat().st_size/1024:.0f} KB")
