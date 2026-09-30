"""Extract the 12×2×4 editorial set titles from the supplied recommendation brief.

Run from the repository root after changing the source document. Product SKUs and
prices are deliberately not inferred here; admin-approved Medusa offers supply them.
"""
import json
import re
from pathlib import Path

source = Path("YOUNOYA_Mercury_Antardasha_x_Zodiacs_Revised (1).md").read_text(encoding="utf-8")
signs = "ARIES TAURUS GEMINI CANCER LEO VIRGO LIBRA SCORPIO SAGITTARIUS CAPRICORN AQUARIUS PISCES".split()
intentions = ["love-connection", "confidence-power", "vitality-balance", "wealth-prosperity"]
result = {}

for planet in ("Mercury", "Ketu"):
    for sign in signs:
        if planet == "Mercury":
            match = re.search(r"(?m)^# [^\n]*\b" + sign + r" MOON × [^\n]*MERCURY DASHA", source)
        else:
            match = re.search(r"(?m)^([^#\n]*\b" + sign + r" MOON × KETU DASHA[^\n]*)$", source)
        if not match:
            raise ValueError(f"Missing {sign} {planet}")
        next_sign = re.search(r"(?m)^(?:# [^\n]*\b[A-Z]+ MOON × [^\n]*MERCURY DASHA|[^#\n]*\b[A-Z]+ MOON × KETU DASHA[^\n]*)$", source[match.end():])
        section = source[match.end():match.end() + next_sign.start()] if next_sign else source[match.end():]
        if planet == "Mercury":
            blocks = re.split(r"(?m)^## [1-4]\\\. [^\n]+$", section)
            if len(blocks) < 5:
                raise ValueError(f"Missing Mercury intentions for {sign}")
            for intention, block in zip(intentions, blocks[1:5]):
                title = re.search(r"\*\*_([^\n]+?)_\*\*", block)
                if not title:
                    raise ValueError(f"Missing title: {sign}, {intention}")
                result[f"{sign}-{planet}-{intention}"] = title.group(1).strip()
        else:
            markers = [
                ("love-connection", r"(?m)^[^\n]*LOVE & RELATIONSHIPS\s*$"),
                ("wealth-prosperity", r"(?m)^[^\n]*(?:FINANCE|WEALTH) & PROSPERITY\s*$"),
                ("vitality-balance", r"(?m)^[^\n]*VITALITY & INNER BALANCE\s*$"),
                ("confidence-power", r"(?m)^[^\n]*CAREER & CONFIDENCE\s*$"),
            ]
            for intention, pattern in markers:
                hit = re.search(pattern, section)
                if not hit:
                    raise ValueError(f"Missing Ketu intention: {sign}, {intention}")
                after = [line.strip() for line in section[hit.end():].splitlines() if line.strip()]
                result[f"{sign}-{planet}-{intention}"] = after[0].strip("*_ ")

assert len(result) == 96, len(result)
target = Path("backend/src/modules/younoya-astro/data/matrix.json")
target.parent.mkdir(parents=True, exist_ok=True)
target.write_text(json.dumps(result, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
print(f"Wrote {len(result)} matrix descriptions to {target}")
