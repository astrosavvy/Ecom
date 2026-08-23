#!/usr/bin/env python3
"""
Prepares the Younoya logo for the dark storefront:
  1. Knocks the white background out to true alpha (un-multiply from white),
     preserving the soft smoke edges and the gold/dark ink.
  2. Auto-crops to content with a little padding.
Overwrites assets/younoya-logo.png in place and prints the final aspect ratio
to paste into index.html (.sw-brand__mark).
"""
import pathlib

from PIL import Image

ASSET = pathlib.Path(__file__).parent.parent / "assets" / "younoya-logo.png"
PADDING = 24          # px around content bbox
ALPHA_FLOOR = 8       # kill residual jpeg noise


def main():
    img = Image.open(ASSET).convert("RGB")
    w, h = img.size
    px = img.load()

    out = Image.new("RGBA", (w, h))
    opx = out.load()
    for y in range(h):
        for x in range(w):
            r, g, b = px[x, y]
            # un-multiply from white: observed = c*a + 255*(1-a), assume a = 255-min
            a = 255 - min(r, g, b)
            if a <= ALPHA_FLOOR:
                opx[x, y] = (0, 0, 0, 0)
                continue
            af = a / 255.0
            cr = max(0, min(255, int((r - 255 * (1 - af)) / af)))
            cg = max(0, min(255, int((g - 255 * (1 - af)) / af)))
            cb = max(0, min(255, int((b - 255 * (1 - af)) / af)))
            opx[x, y] = (cr, cg, cb, a)

    bbox = out.getbbox()
    if bbox:
        l = max(0, bbox[0] - PADDING)
        t = max(0, bbox[1] - PADDING)
        r_ = min(w, bbox[2] + PADDING)
        b_ = min(h, bbox[3] + PADDING)
        out = out.crop((l, t, r_, b_))

    out.save(ASSET)
    nw, nh = out.size
    print(f"logo prepared: {nw}x{nh}  aspect={nw/nh:.3f}")
    print(f".sw-brand__mark -> width: {int(40*nw/nh)}px; height: 40px;")
    # sanity: corners must be fully transparent now
    corners = [out.getpixel(p)[3] for p in [(0, 0), (nw - 1, 0), (0, nh - 1), (nw - 1, nh - 1)]]
    print("corner alphas:", corners)


if __name__ == "__main__":
    main()
