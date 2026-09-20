# Gift Intentions, Hampers & Keepsake Specification

> **Source of Truth**: Younoya Website Identity Document (Updated 2026-09-20)

---

## 1. Core Offering: Curated Gift Hampers (2–3 Products)

The primary commercial offering of Younoya is the **Curated Gift Hamper**:
- **Format**: 2–3 products arranged inside a handcrafted luxury basket or dark woven tray with brushed gold/brass trim, resting on ink navy or deep plum satin velvet.
- **Composition**:
  1. **Aromatherapy / Ritual Candle**: (e.g., Signature metallic ruby-red apple candle `1A8A2284.JPG` with pure botanical wax blend).
  2. **Raw Crystal Talisman in Sacred Vessel**: (e.g., Ornate carved brass urn crowned with a raw purple amethyst cluster `1A8A2075.JPG` or citrine cluster `1A8A2050.JPG`).
  3. **Consecrated Ceremonial Keepsake / Heirloom**: (e.g., Hand-carved brass/gold sacred Jhula swing altar `1A8A2150.JPG` with peacock motif and ceremonial sindoor cups, or 108× consecrated gold yantra talisman).
- **Presentation**: Accompanied by a personalized Vedic astrological intention card on handmade paper, sealed with authentic hot wax.

---

## 2. The Eight Primary Collections (By Intention)

### 01. For Love & Connection
- **Core Theme**: Emotional presence, affection, deepening bonds, marital harmony, and genuine companionship.
- **Key Symbols & Stones**: Rose quartz, carnelian, consecrated Venus/Shukra talismans, signature ruby-red apple keepsake.
- **Tone**: Warm, intimate, romantic, tender.

### 02. For Prosperity & Growth
- **Core Theme**: Financial stability, abundance mindset, career breakthroughs, and material auspiciousness.
- **Key Symbols & Stones**: Pyrite, green jade, citrine clusters in carved brass vessels, consecrated Kubera yantras, sacred Lakshmi motifs.
- **Tone**: Grounded, luminous, expansive, confident.

### 03. For Career & Confidence
- **Core Theme**: Willpower, authentic self-expression, leadership, public recognition, and navigating major transitions.
- **Key Symbols & Stones**: Tiger eye, golden sunstone, Surya solar talismans, carved lion/leopard keepsakes.
- **Tone**: Bold, clarifying, empowering, resolute.

### 04. For Calm & Balance
- **Core Theme**: Restoring inner peace, nervous system grounding, emotional clarity, stress release, and meditative space.
- **Key Symbols & Stones**: Raw amethyst clusters, clear quartz geodes, sandalwood and vetiver aromatherapy, botanical essences.
- **Tone**: Serene, soothing, spacious, restorative.

### 05. For Home & New Beginnings
- **Core Theme**: Space clearing, housewarmings, bridal thresholds, new ventures, and domestic harmony.
- **Key Symbols & Stones**: Vastu brass tortoise lamp (`1A8A2210.JPG`), consecrated brass bell, ceremonial camphor/incense urns.
- **Tone**: Auspicious, welcoming, protective, sacred.

### 06. Meaningful Gifts
- **Core Theme**: Curated selections tailored by recipient relationship: gifts for her, gifts for him, gifts for couples, parents, siblings, and valued collaborators.
- **Tone**: Thoughtful, elegant, deeply personal.

### 07. Limited Seasonal Collections
- **Core Theme**: Consecrated festival and astronomical milestones (Raksha Bandhan, Diwali, Autumn Equinox, Solar Ingresses).
- **Offerings**: Intention-led rakhis (*Mangalam*, *Anant Aashish*, *Samriddhi Kavach*), consecrated festive diya sets, sacred altar ensembles.

### 08. Rituals & Keepsakes
- **Core Theme**: Standalone sacred heirlooms, 108× consecrated yantras, ceremonial brass vessels, and individual gemstone talismans meant to be treasured across generations.

---

## 3. The Five Sacred Sanctums (`FlowShowcase.jsx`)

The live interactive 3D spatial showcase on the storefront presents five flagship consecrated offerings:

| Chapter | Badge | Title | Subtitle / Offerings | Price | Image Asset | Handle |
|---|---|---|---|---|---|---|
| **01** | `SANKALPA I` | Love & Connection | Signature Ruby Apple Candle & Consecrated Brass Urn | ₹ 4,800 | `/media/love-connection.webp` | `love-connection` |
| **02** | `SANKALPA II` | Confidence & Power | Solar Radiance • Hand-Carved Brass • Citrine | ₹ 5,400 | `/media/confidence-personal-power.webp` | `confidence-personal-power` |
| **03** | `SANKALPA III` | Vitality & Balance | Raw Amethyst Cluster • Botanical Herbarium | ₹ 4,200 | `/media/vitality-inner-balance.webp` | `vitality-inner-balance` |
| **04** | `SANKALPA IV` | Wealth & Prosperity | Kubera Yantra • Pyrite • Burnished Gold Altar | ₹ 6,200 | `/media/wealth-prosperity.webp` | `wealth-prosperity` |
| **05** | `SANCTUARY` | Sacred Threshold | 108× Consecrated Grand Hamper • Vedic Dasha | ₹ 7,500 | `/media/hero-threshold.webp` | `hero-threshold` |

---

## 4. Personalised Toolkit Architecture (5 Steps)

The Toolkit Flow is Younoya's flagship interactive discovery engine:
1. **Intention Discovery**: Shopper chooses primary life domain (Love, Career, Prosperity, Wellbeing, Home, Gifting).
2. **Context & Relevance**: Nuanced focus area (e.g., Career -> Direction, Confidence, Transition, Recognition).
3. **Recipient Selection**: Self, Partner, Parent, Friend, Sibling, Colleague.
4. **Personal Astrology Profile (Optional)**: Name, Date of Birth, Time of Birth, Place of Birth. Computed in background (Moon Sign / Nakshatra / Dasha) without exposing deterministic formulas.
5. **Curation Engine Output**:
   - 3–5 complementary pieces assembled into a custom gift hamper.
   - Gentle poetic explanation of why each item resonates with the recipient's intention.
   - One-click "Add Toolkit to Bag" or "Build My Hamper" with custom wax seal and inscription options.
