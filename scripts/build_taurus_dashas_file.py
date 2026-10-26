import json
from ingest_taurus_dashas import DASHAS_DATA

def build_taurus_dashas():
    taurus_dict = {}
    for dasha_name, record in DASHAS_DATA.items():
        base_record = {
            "combinationId": record["combinationId"],
            "profile": f"MOON_TAURUS • DASHA_{dasha_name.upper()}",
            "sign": "Taurus",
            "signCode": "TAU",
            "signSymbol": "♉",
            "dasha": dasha_name,
            "collection": record["collection"],
            "setTitle": record["setTitle"],
            "productsSummary": record["productsSummary"],
            "tagline": record["tagline"],
            "story": record["story"],
            "whatYouMightBeGoingThrough": record["whatYouMightBeGoingThrough"],
            "whyChosen": record["whyChosen"],
            "intentionShift": record["intentionShift"],
            "challenge": record["challenge"],
            "desiredShift": record["desiredShift"],
            "keepsake": record["keepsake"],
            "ritual": record["ritual"],
            "vastuPlacement": record["vastuPlacement"],
            "experiences": record["experiences"],
            "disclaimer": "YOUNOYA products are curated for their craftsmanship, traditional symbolism and ability to encourage personal expression and meaningful everyday rituals. Crystal associations are symbolic and do not guarantee emotional, relationship, health or other outcomes."
        }
        # Direct lookup by dasha name (e.g. "Ketu", "ketu")
        taurus_dict[dasha_name] = base_record
        taurus_dict[dasha_name.lower()] = base_record
        taurus_dict[f"TAURUS-{dasha_name}"] = base_record

        # By intention
        for int_slug in ["love-connection", "confidence-power", "vitality-balance", "wealth-prosperity"]:
            taurus_dict[f"TAURUS-{dasha_name}-{int_slug}"] = {
                **base_record,
                "category": int_slug,
                "categoryName": int_slug.replace("-", " ").title()
            }

    for path in ["younoya-web/src/data/taurusDashas.json", "backend/src/modules/younoya-astro/data/taurusDashas.json"]:
        with open(path, "w", encoding="utf-8") as f:
            json.dump(taurus_dict, f, indent=2, ensure_ascii=False)
        print(f"Generated {path} with {len(taurus_dict)} lookup keys.")

if __name__ == "__main__":
    build_taurus_dashas()
