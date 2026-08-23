#!/usr/bin/env python3
"""
Connector endpoint QA: does each connector actually start on the previous
dive's ACTUAL last frame, and land on the next dive's first-frame composition?

start check : frames/last_<prev>.png   vs frames/conn<i>_first.png   (must be ~identical)
end check   : frames/first_<next>.png  vs frames/conn<i>_last.png    (composition match)

diff guide: <14 excellent · 14-22 fine · 22-35 visible pop likely · >35 hard cut
"""
import pathlib
import subprocess
import shutil
import sys

from PIL import Image

HERE = pathlib.Path(__file__).parent
FRAMES = HERE / "frames"
RAW = HERE / "raw"
GW, GH = 48, 32

PAIRS = [
    ("threshold", "intent"),
    ("intent", "cosmos"),
    ("cosmos", "seek"),
    ("seek", "reveal"),
    ("reveal", "companion"),
]


def sig(path):
    img = Image.open(path)
    return list(img.convert("RGB").resize((GW, GH), Image.LANCZOS).getdata())


def mad(a, b):
    return sum(abs(pa[i] - pb[i]) for pa, pb in zip(a, b) for i in range(3)) / (len(a) * 3)


def extract(mp4, png, tail):
    args = (
        ["-sseof", "-0.15", "-i", str(RAW / mp4)]
        if tail
        else ["-ss", "0", "-i", str(RAW / mp4)]
    ) + ["-frames:v", "1", "-q:v", "2", str(FRAMES / png)]
    r = subprocess.run(["ffmpeg", "-v", "error"] + args, capture_output=True, text=True)
    return r.returncode == 0


def verdict(d):
    if d < 14: return "excellent"
    if d < 22: return "fine"
    if d < 35: return "VISIBLE POP - consider re-roll"
    return "HARD CUT - re-roll"


def main():
    if shutil.which("ffmpeg") is None:
        print("[FAIL] ffmpeg not on PATH"); sys.exit(1)
    FRAMES.mkdir(exist_ok=True)
    print(f"{'connector':<10} {'start diff':>10}  {'verdict':<28} {'end diff':>8}  verdict")
    for i, (a, b) in enumerate(PAIRS, 1):
        mp4 = f"conn_{i}.mp4"
        if not (RAW / mp4).exists():
            print(f"{mp4:<10}  MISSING"); continue
        ok1 = extract(mp4, f"conn{i}_first.png", tail=False)
        ok2 = extract(mp4, f"conn{i}_last.png", tail=True)
        if not (ok1 and ok2):
            print(f"{mp4:<10}  EXTRACT FAILED"); continue
        ds = mad(sig(FRAMES / f"last_{a}.png"), sig(FRAMES / f"conn{i}_first.png"))
        de = mad(sig(FRAMES / f"first_{b}.png"), sig(FRAMES / f"conn{i}_last.png"))
        print(f"{mp4:<10} {ds:>10.1f}  {verdict(ds):<28} {de:>8.1f}  {verdict(de)}")


if __name__ == "__main__":
    main()
