#!/usr/bin/env python3
"""
Post-process all clips: comprehensive watermark removal + connector visual unification.

MULTI-REGION WATERMARK REMOVAL
  Covers all common Gemini/Veo watermark positions at 1280x720:
    - bottom-right (standard):     x=1080 y=660 w=180 h=40
    - bottom-left (alt):           x=20   y=660 w=180 h=40
    - bottom-center (centered):    x=550  y=660 w=180 h=40
    - top-right (rare):            x=1080 y=20   w=180 h=40

  Adjust WM_REGIONS below if marks appear elsewhere.
"""
import argparse, shutil, subprocess, sys
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).parent.parent
RAW = ROOT / "render-handoff" / "raw"
VID = ROOT / "assets" / "vid"
BAK = RAW / "_pre_fix"
FRAMES = ROOT / "render-handoff" / "_inspect"

NAMES = ["threshold", "intent", "cosmos", "seek", "reveal", "companion"]

# ---- MULTI-REGION WATERMARK ZONES (1280x720) ----
# edit this list if watermarks appear in other corners
WM_REGIONS = [
    (1080, 660, 180, 40),  # bottom-right (standard)
    (20,   660, 180, 40),  # bottom-left
    (550,  660, 180, 40),  # bottom-center
    (1080, 20,   180, 40), # top-right (rare)
]

FFMPEG = shutil.which("ffmpeg")
if FFMPEG is None:
    print("[FAIL] ffmpeg not on PATH"); sys.exit(1)


def run(args):
    r = subprocess.run([FFMPEG] + args, capture_output=True, text=True)
    if r.returncode != 0:
        print("FFMPEG ERROR:", r.stderr[-400:]); return False
    return True


def extract_frame(mp4, png, ts=2.0):
    FRAMES.mkdir(exist_ok=True)
    return run(["-v", "error", "-ss", str(ts), "-i", str(mp4),
                "-frames:v", "1", "-q:v", "2", "-y", str(png)])


def mean_rgb(png):
    im = Image.open(png).convert("RGB")
    im = im.resize((64, 36), Image.LANCZOS)
    pixels = list(im.getdata())
    n = len(pixels)
    r = sum(p[0] for p in pixels) / n
    g = sum(p[1] for p in pixels) / n
    b = sum(p[2] for p in pixels) / n
    return r, g, b, sum((0.299*p[0]+0.587*p[1]+0.114*p[2]) for p in pixels)/n


def build_delogo_vf():
    parts = []
    for (x, y, w, h) in WM_REGIONS:
        parts.append(f"delogo=x={x}:y={y}:w={w}:h={h}:show=0")
    return ",".join(parts) + ",noise=alls=2:allf=t"


def watermark_pass(src, dst):
    vf = build_delogo_vf() + ",scale=854:-2:flags=lanczos"
    return run([
        "-v", "error", "-y", "-i", str(src),
        "-an", "-vf", vf,
        "-c:v", "libx264", "-preset", "slow", "-crf", "26", "-pix_fmt", "yuv420p",
        "-g", "4", "-keyint_min", "4", "-sc_threshold", "0",
        "-movflags", "+faststart", str(dst),
    ])


def colour_match_pass(src, dst, target_r, target_g, target_b):
    """Shift colour balance toward target mean (0-255)."""
    frame = FRAMES / f"_c_{Path(src).stem}.png"
    if not extract_frame(src, frame, ts=2.0):
        return False
    s = Image.open(frame).convert("RGB").resize((64, 36), Image.LANCZOS)
    pixels = list(s.getdata())
    n = len(pixels)
    cr = sum(p[0] for p in pixels) / n
    cg = sum(p[1] for p in pixels) / n
    cb = sum(p[2] for p in pixels) / n
    def off(c, t):
        d = (t - c) / 255.0
        return max(-0.3, min(0.3, d * 0.7))
    rs = off(cr, target_r); gs = off(cg, target_g); bs = off(cb, target_b)
    vf = (
        f"colorbalance=rs={rs:.3f}:gs={gs:.3f}:bs={bs:.3f},"
        "eq=saturation=1.05:contrast=1.03:brightness=0,scale=854:-2:flags=lanczos"
    )
    return run([
        "-v", "error", "-y", "-i", str(src),
        "-an", "-vf", vf,
        "-c:v", "libx264", "-preset", "slow", "-crf", "26", "-pix_fmt", "yuv420p",
        "-g", "4", "-keyint_min", "4", "-sc_threshold", "0",
        "-movflags", "+faststart", str(dst),
    ])


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    BAK.mkdir(parents=True, exist_ok=True)
    print(f"watermark removal: {len(WM_REGIONS)} regions at 1280x720")
    for x,y,w,h in WM_REGIONS:
        print(f"  x={x} y={y} w={w} h={h}")
    print("edit WM_REGIONS in fix_videos.py if marks appear elsewhere\n")

    for n in NAMES:
        src = RAW / f"dive_{n}.mp4"
        dst = VID / f"{n}.mp4"
        if not src.exists():
            print(f"- dive {n}: missing"); continue
        if not args.dry_run:
            shutil.copy2(src, BAK / f"dive_{n}.mp4")
            ok = watermark_pass(src, dst)
            print(("+ " if ok else "X ") + f"dive {n}: multi-region watermark stripped -> {dst.name}")
        else:
            print(f"  would watermark-strip dive_{n}.mp4")

    for i in range(1, len(NAMES)):
        a, b = NAMES[i - 1], NAMES[i]
        src = RAW / f"conn_{i}.mp4"
        if not src.exists():
            print(f"- conn {i}: missing"); continue
        if args.dry_run:
            print(f"  would fix conn_{i}.mp4"); continue
        shutil.copy2(src, BAK / f"conn_{i}.mp4")

        fp_a = FRAMES / f"_t_{a}.png"; fp_b = FRAMES / f"_t_{b}.png"
        extract_frame(VID / f"{a}.mp4", fp_a, ts=4)
        extract_frame(VID / f"{b}.mp4", fp_b, ts=4)
        ra, ga, ba, _ = mean_rgb(fp_a); rb, gb, bb, _ = mean_rgb(fp_b)
        tr = (ra + rb) / 2; tg = (ga + gb) / 2; tb = (ba + bb) / 2

        tmp = ROOT / "render-handoff" / "_inspect" / f"_wmkfree_conn_{i}.mp4"
        if watermark_pass(src, tmp):
            ok = colour_match_pass(tmp, VID / f"conn{i}.mp4", tr, tg, tb)
            tmp.unlink(missing_ok=True)
            print(("+ " if ok else "X ") + f"conn {i}: wmk + colour-match -> conn{i}.mp4 "
                  f"(target ~ RGB {tr:.0f},{tg:.0f},{tb:.0f})")

    print("\nbackup of originals at render-handoff/raw/_pre_fix/")

def mean_rgb(png):
    im = Image.open(png).convert("RGB").resize((64, 36), Image.LANCZOS)
    pixels = list(im.getdata())
    n = len(pixels)
    r = sum(p[0] for p in pixels) / n
    g = sum(p[1] for p in pixels) / n
    b = sum(p[2] for p in pixels) / n
    return r, g, b, sum((0.299*p[0]+0.587*p[1]+0.114*p[2]) for p in pixels)/n


if __name__ == "__main__":
    main()