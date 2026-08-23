#!/usr/bin/env python3
"""
Focused bottom-right watermark scan for Gemini/Veo.
Watermark zone is typically within the last 20% width / last 10% height of the
frame and consists of semi-transparent light pixels clustered together.
"""
import pathlib, sys
from PIL import Image

if len(sys.argv) < 2:
    print("usage: detect_wm2.py <frame.png>"); sys.exit(1)

img = Image.open(sys.argv[1]).convert("RGB")
W, H = img.size
px = img.load()
print(f"image: {W}x{H}")

# ultra-focused zone: bottom 8% rows, right 22% cols
zone_x0 = int(W * 0.78)
zone_y0 = int(H * 0.90)
# gather luma
pts = []
for y in range(zone_y0, H):
    for x in range(zone_x0, W):
        r, g, b = px[x, y]
        l = 0.299 * r + 0.587 * g + 0.114 * b
        if l > 180:                # near-white pixels (watermark ink)
            pts.append((x, y, l))

if not pts:
    print(f"zone {zone_x0},{zone_y0}-{W},{H}: no near-white pixels (no watermark)")
    sys.exit(0)

xs = [p[0] for p in pts]; ys = [p[1] for p in pts]
pad = 8
x = max(0, min(xs) - pad)
y = max(0, min(ys) - pad)
w = min(W - x, max(xs) - min(xs) + pad * 2)
h = min(H - y, max(ys) - min(ys) + pad * 2)
print(f"watermark bbox: x={x} y={y} w={w} h={h}  ({len(pts)} near-white pixels)")
print(f"ffmpeg delogo: x={x}:y={y}:w={w}:h={h}")
