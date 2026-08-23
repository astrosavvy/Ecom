#!/usr/bin/env python3
"""
Extracts the boundary frames that make every seam frame-identical (SKILL Step 5).

Reads   raw/dive_<name>.mp4        and raw/conn_<i>.mp4        (16:9 chain)
        raw/dive_<name>-m.mp4      and raw/conn_<i>-m.mp4      (9:16 chain)
Writes  frames/first_<name>.png  last_<name>.png          (from DIVES, never stills)
        frames/m_first_<name>.png  m_last_<name>.png       (portrait chain)

Run AFTER each batch of dives lands -- connectors need the previous dive's
actual last frame as their start frame and the next dive's actual first frame
as their end frame.

Requires ffmpeg on PATH.  Usage:  python extract_frames.py
"""
import pathlib
import subprocess
import shutil
import sys

HERE = pathlib.Path(__file__).parent
RAW = HERE / "raw"
FRAMES = HERE / "frames"

NAMES = ["threshold", "intent", "cosmos", "seek", "reveal", "companion"]
NCONN = 5


def ffmpeg(args):
    if shutil.which("ffmpeg") is None:
        print("[FAIL] ffmpeg not on PATH — install it first (winget install Gyan.FFmpeg)")
        sys.exit(1)
    r = subprocess.run(["ffmpeg", "-v", "error"] + args, capture_output=True, text=True)
    if r.returncode != 0:
        print("ffmpeg error:", r.stderr[-500:])
        return False
    return True


def extract(video, png, tail=False):
    if not (RAW / video).exists():
        print(f"- {video}: not present (skipped)")
        return False
    if tail:
        args = ["-sseof", "-0.15", "-i", str(RAW / video), "-frames:v", "1", "-q:v", "2", str(FRAMES / png)]
    else:
        args = ["-ss", "0", "-i", str(RAW / video), "-frames:v", "1", "-q:v", "2", str(FRAMES / png)]
    ok = ffmpeg(args)
    if ok:
        print(f"+ {video} -> frames/{png}")
    return ok


def main():
    FRAMES.mkdir(exist_ok=True)
    for n in NAMES:
        extract(f"dive_{n}.mp4", f"first_{n}.png")
        extract(f"dive_{n}.mp4", f"last_{n}.png", tail=True)
    for i in range(1, NCONN + 1):
        # portrait chain: frames must come from PORTRAIT renders only (§6b step 3)
        extract(f"dive_{NAMES[i - 1]}-m.mp4", f"m_last_{NAMES[i - 1]}.png", tail=True)
        extract(f"dive_{NAMES[i]}-m.mp4", f"m_first_{NAMES[i]}.png")
    print("\nDone. Feed these frames to your connector renders per HANDOFF.md tables D/F.")


if __name__ == "__main__":
    main()
