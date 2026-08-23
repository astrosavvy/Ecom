#!/usr/bin/env python3
"""
YOUNOYA x lets-scroll -- build every render prompt + HANDOFF.md (manual asset path).

Writes into this directory:
  still_<name>.txt            x6   landscape scene stills   (3:2, >=1536px)
  dive_<name>.txt             x6   16:9 dive clips          (~8s, start-frame conditioned)
  conn_<i>.txt                x5   16:9 aerial connectors   (~5s, start+end frame conditioned)
  dive_<name>_portrait.txt    x6   9:16 native mobile dives (start = portrait canvas)
  conn_<i>_portrait.txt       x5   9:16 portrait connectors (frames from PORTRAIT renders only)

The style preamble is byte-identical in every file -- that is what makes the
world read as one place. Do not edit it per-file.
"""
import pathlib

HERE = pathlib.Path(__file__).parent

# ── Brand kit ────────────────────────────────────────────────────────────────
BG = "#0B0E18"
PALETTE = (
    "midnight #0B0E18, temple gold #D4AF37, parchment cream #F5EDE0, "
    "rose quartz pink #E8A0BF, jade green #34D399, moonstone blue #9BB5D6"
)
STYLE_TAIL = (
    f"Night miniature: isometric miniature at night, warm interior glow and neon "
    f"signage, moody rim light, wet reflective ground, soft matte toy-model shapes, "
    f"tilt-shift miniature look. Cohesive color palette of {PALETTE}."
)

STYLE_PREAMBLE = f"""Isometric low-poly 3D diorama floating as a small rounded island on a plain solid
{BG} background with a soft contact shadow beneath it. {STYLE_TAIL} Highly detailed,
centered composition, absolutely no text, no letters, no numbers, no logos."""

PORTRAIT_CLAUSE = (
    f"Vertical portrait composition, the diorama centered with generous {BG} space "
    f"above and below."
)

# ── Ordered sections (NAMES) ────────────────────────────────────────────────
SECTIONS = [
    {
        "name": "threshold",
        "subject": (
            "a tiny two-storey magical gift store with a curved golden awning, warm lit "
            "windows showing shelves of glowing trinkets, a small star-shaped neon sign "
            "above the door, floating gift boxes with ribbons drifting around the roof, "
            "a lantern-lit path leading to the door, a small white robot-ninja figure "
            "with a gold headband standing at the threshold looking up"
        ),
        "dive_focal": "the lantern-lit doorway glow",
        "dive_style": "building",  # roof opens
    },
    {
        "name": "intent",
        "subject": (
            "four floating crystal altars arranged around a round brass compass dais — "
            "a rose-pink heart-shaped crystal, a golden coin-and-bloom crystal, a jade "
            "ascending-stairs crystal, and a moonstone still-water crystal — each casting "
            "soft colored light upward, the small robot-ninja kneeling at the dais reading "
            "the compass needle"
        ),
        "dive_focal": "the glowing brass compass dais between the four crystals",
        "dive_style": "field",
    },
    {
        "name": "cosmos",
        "subject": (
            "an astronomical orrery chamber: a great slowly turning brass armillary sphere "
            "ringed by twenty-seven small moon-motif lamps, a star-map table with charts "
            "and an ink pen, drifting constellation motes, the small robot-ninja holding "
            "a candle while studying the rings"
        ),
        "dive_focal": "the glowing core of the great armillary sphere",
        "dive_style": "building",
    },
    {
        "name": "seek",
        "subject": (
            "a towering library of gift shelves climbing up into the dark, dozens of small "
            "keepsake boxes glowing from within in pink, gold, jade and blue, sliding "
            "ladders and rope pulleys between shelves, the small robot-ninja mid-leap "
            "between two shelves reaching for one glowing box"
        ),
        "dive_focal": "the leaping robot-ninja reaching for the brightest keepsake box",
        "dive_style": "field",
    },
    {
        "name": "reveal",
        "subject": (
            "a single opened gift box on a round marble pedestal under a soft spotlight "
            "beam, warm golden light rising from within, three small talismans orbiting "
            "it — a rose stone, a pyrite sun, a tiger-eye bead — the small robot-ninja "
            "presenting the box with both hands"
        ),
        "dive_focal": "the warm light rising out of the opened gift box",
        "dive_style": "hero",
    },
    {
        "name": "companion",
        "subject": (
            "the same little store seen from its rooftop at late dusk, the robot-ninja "
            "sleeping curled on the ridgeline beside a glowing paper lantern, a winding "
            "road of small lamps heading toward distant hills, fireflies drifting"
        ),
        "dive_focal": "the sleeping robot-ninja beside the paper lantern",
        "dive_style": "field",
    },
]

NAMES = [s["name"] for s in SECTIONS]


# ── Templates (keep byte-stable) ─────────────────────────────────────────────
def still_prompt(s):
    return f"""{STYLE_PREAMBLE}
Render a wide 3:2 landscape image, at least 1536 px wide. The background stays a plain
solid {BG} across the whole frame — a completely empty backdrop: no sky, no clouds,
no horizon, no gradient. Centered composition with a little headroom; the focal subject
horizontally centred and nothing essential at the far left/right edges. Absolutely no
text, no letters, no numbers, no logos.
Subject: {s['subject']}"""


def dive_prompt(s, portrait=False):
    if s["dive_style"] == "building":
        move = (
            "The camera slowly glides forward and descends toward it, sweeping in toward "
            f"{s['dive_focal']}, as if flying inside. As the camera pushes in, the roof and "
            "upper structure gently lift and open away to reveal the warm interior."
        )
    elif s["dive_style"] == "hero":
        move = (
            "The camera slowly glides forward and drifts down toward it, circling gently "
            f"closer to {s['dive_focal']} until the pedestal fills the lower frame."
        )
    else:
        move = (
            "The camera slowly glides forward and sweeps low across the scene, moving "
            f"toward {s['dive_focal']} without pulling back."
        )
    pre = f"{PORTRAIT_CLAUSE}\n" if portrait else ""
    return f"""{pre}Single continuous cinematic camera move, no cuts. Begin high and far, looking down at the
whole scene from outside like a tiny model. {move} The backdrop stays a plain solid
{BG} the whole time — completely empty, no sky, no clouds, no horizon, no ground.
{STYLE_TAIL}
Smooth, graceful, slow motion, subtle parallax. No text, no captions."""


def conn_prompt(i, portrait=False):
    a, b = SECTIONS[i - 1], SECTIONS[i]
    pre = f"{PORTRAIT_CLAUSE}\n" if portrait else ""
    return f"""{pre}Single continuous cinematic camera move, no cuts. The camera smoothly pulls up and back
out of the {a['name']} scene, rising into the sky, then glides forward across the connected
miniature world and arrives above the {b['name']} scene, beginning to descend toward it.
One connected night-lit miniature world floating in a plain solid {BG} void — empty
backdrop, no sky, no clouds — seamless flowing aerial transition. {STYLE_TAIL}
Smooth graceful slow motion. No text, no captions."""


def main():
    written = []

    def w(name, text):
        p = HERE / name
        p.write_text(text, encoding="utf-8")
        written.append(p.name)

    for s in SECTIONS:
        w(f"still_{s['name']}.txt", still_prompt(s))
        w(f"dive_{s['name']}.txt", dive_prompt(s))
        w(f"dive_{s['name']}_portrait.txt", dive_prompt(s, portrait=True))
    for i in range(1, len(SECTIONS)):
        w(f"conn_{i}.txt", conn_prompt(i))
        w(f"conn_{i}_portrait.txt", conn_prompt(i, portrait=True))

    print(f"wrote {len(written)} prompt files:")
    for n in written:
        print("  ", n)


if __name__ == "__main__":
    main()
