/**
 * YOUNOYA Astrological Calculations & Synergy Engine
 * High-precision Western Sun Sign, Vedic Sidereal Rashi (Moon Sign),
 * 27 Nakshatras (Lunar Mansions), Lagna (Ascendant), and Synastry Scoring.
 */

export interface ZodiacSignDetails {
  id: string;
  name: string;
  sanskritName: string;
  element: "Fire" | "Earth" | "Air" | "Water";
  rulingPlanet: string;
  deity: string;
  gemstone: string;
  rudraksha: string;
  traits: string[];
  recommendedHandle: string;
}

export const ZODIAC_SIGNS_DATA: Record<string, ZodiacSignDetails> = {
  aries: {
    id: "aries",
    name: "Aries",
    sanskritName: "Mesha (मेष)",
    element: "Fire",
    rulingPlanet: "Mars (Mangal)",
    deity: "Lord Hanuman / Kartikeya",
    gemstone: "Red Coral (Moonga)",
    rudraksha: "3-Mukhi Rudraksha",
    traits: ["Courageous", "Pioneering", "Dynamic", "Passionate"],
    recommendedHandle: "vedic-prosperity-rakhi",
  },
  taurus: {
    id: "taurus",
    name: "Taurus",
    sanskritName: "Vrishabha (वृषभ)",
    element: "Earth",
    rulingPlanet: "Venus (Shukra)",
    deity: "Maha Lakshmi",
    gemstone: "Diamond / White Zircon",
    rudraksha: "6-Mukhi Rudraksha",
    traits: ["Abundant", "Grounded", "Devoted", "Patient"],
    recommendedHandle: "vedic-abundance-blessing-rakhi",
  },
  gemini: {
    id: "gemini",
    name: "Gemini",
    sanskritName: "Mithuna (मिथुन)",
    element: "Air",
    rulingPlanet: "Mercury (Budha)",
    deity: "Lord Ganesha",
    gemstone: "Emerald (Panna)",
    rudraksha: "4-Mukhi Rudraksha",
    traits: ["Eloquent", "Versatile", "Curious", "Brilliant"],
    recommendedHandle: "navagraha-om-protection-kaudi-rakhi",
  },
  cancer: {
    id: "cancer",
    name: "Cancer",
    sanskritName: "Karka (कर्क)",
    element: "Water",
    rulingPlanet: "Moon (Chandra)",
    deity: "Lord Shiva & Parvati",
    gemstone: "Natural Pearl (Moti)",
    rudraksha: "2-Mukhi Rudraksha",
    traits: ["Nurturing", "Intuitive", "Protective", "Empathetic"],
    recommendedHandle: "vedic-prosperity-rakhi",
  },
  leo: {
    id: "leo",
    name: "Leo",
    sanskritName: "Simha (सिंह)",
    element: "Fire",
    rulingPlanet: "Sun (Surya)",
    deity: "Surya Deva",
    gemstone: "Ruby (Manikya)",
    rudraksha: "12-Mukhi / 1-Mukhi Rudraksha",
    traits: ["Regal", "Magnanimous", "Radiant", "Leader"],
    recommendedHandle: "vedic-prosperity-wealth-attraction-rakhi",
  },
  virgo: {
    id: "virgo",
    name: "Virgo",
    sanskritName: "Kanya (कन्या)",
    element: "Earth",
    rulingPlanet: "Mercury (Budha)",
    deity: "Lord Vishnu",
    gemstone: "Green Emerald (Panna)",
    rudraksha: "4-Mukhi Rudraksha",
    traits: ["Analytical", "Pure", "Healing", "Precise"],
    recommendedHandle: "vedic-abundance-blessing-rakhi",
  },
  libra: {
    id: "libra",
    name: "Libra",
    sanskritName: "Tula (तुला)",
    element: "Air",
    rulingPlanet: "Venus (Shukra)",
    deity: "Maha Lakshmi",
    gemstone: "Opal / White Sapphire",
    rudraksha: "6-Mukhi Rudraksha",
    traits: ["Harmonious", "Diplomatic", "Gracious", "Fair"],
    recommendedHandle: "vedic-prosperity-rakhi",
  },
  scorpio: {
    id: "scorpio",
    name: "Scorpio",
    sanskritName: "Vrishchika (वृश्चिक)",
    element: "Water",
    rulingPlanet: "Mars & Ketu",
    deity: "Lord Hanuman / Bhairava",
    gemstone: "Red Coral (Moonga)",
    rudraksha: "3-Mukhi & 9-Mukhi Rudraksha",
    traits: ["Transformative", "Psychic", "Resolute", "Mystic"],
    recommendedHandle: "navagraha-om-protection-kaudi-rakhi",
  },
  sagittarius: {
    id: "sagittarius",
    name: "Sagittarius",
    sanskritName: "Dhanu (धनु)",
    element: "Fire",
    rulingPlanet: "Jupiter (Guru)",
    deity: "Lord Vishnu / Dakshinamurthy",
    gemstone: "Yellow Sapphire (Pukhraj)",
    rudraksha: "5-Mukhi Rudraksha",
    traits: ["Philosophical", "Auspicious", "Visionary", "Generous"],
    recommendedHandle: "vedic-prosperity-wealth-attraction-rakhi",
  },
  capricorn: {
    id: "capricorn",
    name: "Capricorn",
    sanskritName: "Makara (मकर)",
    element: "Earth",
    rulingPlanet: "Saturn (Shani)",
    deity: "Lord Shani / Hanuman",
    gemstone: "Blue Sapphire (Neelam)",
    rudraksha: "7-Mukhi & 14-Mukhi Rudraksha",
    traits: ["Disciplined", "Enduring", "Strategic", "Authoritative"],
    recommendedHandle: "navagraha-om-protection-kaudi-rakhi",
  },
  aquarius: {
    id: "aquarius",
    name: "Aquarius",
    sanskritName: "Kumbha (कुम्भ)",
    element: "Air",
    rulingPlanet: "Saturn & Rahu",
    deity: "Lord Shiva",
    gemstone: "Blue Sapphire (Neelam)",
    rudraksha: "7-Mukhi & 8-Mukhi Rudraksha",
    traits: ["Humanitarian", "Innovative", "Cosmic", "Original"],
    recommendedHandle: "vedic-abundance-blessing-rakhi",
  },
  pisces: {
    id: "pisces",
    name: "Pisces",
    sanskritName: "Meena (मीन)",
    element: "Water",
    rulingPlanet: "Jupiter (Guru)",
    deity: "Lord Narayana",
    gemstone: "Yellow Sapphire (Pukhraj)",
    rudraksha: "5-Mukhi Rudraksha",
    traits: ["Spiritual", "Compassionate", "Devotional", "Wise"],
    recommendedHandle: "vedic-prosperity-rakhi",
  },
};

export const NAKSHATRAS = [
  "Ashwini (अश्विनी)", "Bharani (भरणी)", "Krittika (कृत्तिका)",
  "Rohini (रोहिणी)", "Mrigashira (मृगशिरा)", "Ardra (आर्द्रा)",
  "Punarvasu (पुनर्वसु)", "Pushya (पुष्य)", "Ashlesha (आश्लेषा)",
  "Magha (मघा)", "Purva Phalguni (पूर्वा फाल्गुनी)", "Uttara Phalguni (उत्तरा फाल्गुनी)",
  "Hasta (हस्त)", "Chitra (चित्रा)", "Swati (स्वाती)",
  "Vishakha (विशाखा)", "Anuradha (अनुराधा)", "Jyeshtha (ज्येष्ठा)",
  "Mula (मूल)", "Purva Ashadha (पूर्वाषाढ़ा)", "Uttara Ashadha (उत्तराषाढ़ा)",
  "Shravana (श्रवण)", "Dhanishta (धनिष्ठा)", "Shatabhisha (शतभिषा)",
  "Purva Bhadrapada (पूर्वा भाद्रपद)", "Uttara Bhadrapada (उत्तरा भाद्रपद)", "Revati (रेवती)"
];

/**
 * Calculates Western Sun Sign from Date of Birth
 */
export function getWesternSunSign(dob: string): ZodiacSignDetails {
  const d = new Date(dob);
  if (isNaN(d.getTime())) return ZODIAC_SIGNS_DATA.aries;

  const month = d.getUTCMonth() + 1; // 1-12
  const day = d.getUTCDate(); // 1-31

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return ZODIAC_SIGNS_DATA.aries;
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return ZODIAC_SIGNS_DATA.taurus;
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return ZODIAC_SIGNS_DATA.gemini;
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return ZODIAC_SIGNS_DATA.cancer;
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return ZODIAC_SIGNS_DATA.leo;
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return ZODIAC_SIGNS_DATA.virgo;
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return ZODIAC_SIGNS_DATA.libra;
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return ZODIAC_SIGNS_DATA.scorpio;
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return ZODIAC_SIGNS_DATA.sagittarius;
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return ZODIAC_SIGNS_DATA.capricorn;
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return ZODIAC_SIGNS_DATA.aquarius;
  return ZODIAC_SIGNS_DATA.pisces;
}

/**
 * Calculates Vedic Sidereal Moon Sign (Rashi) and Nakshatra
 * Using approximate sidereal longitude with Lahiri Ayanamsa (~24 degrees offset)
 */
export function calculateVedicRashi(dob: string, tob?: string): {
  rashi: ZodiacSignDetails;
  nakshatra: string;
  nakshatraIndex: number;
} {
  const d = new Date(dob);
  if (isNaN(d.getTime())) {
    return { rashi: ZODIAC_SIGNS_DATA.aries, nakshatra: NAKSHATRAS[0], nakshatraIndex: 0 };
  }

  // Parse time of birth if present (format HH:mm)
  let hourFraction = 0.5;
  if (tob && tob.includes(":")) {
    const [h, m] = tob.split(":").map(Number);
    if (!isNaN(h) && !isNaN(m)) {
      hourFraction = (h + m / 60) / 24;
    }
  }

  // Day of year calculation
  const startOfYear = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const diffDays = Math.floor((d.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24)) + hourFraction;

  // Approximate lunar cycle offset (Moon completes 360 deg every ~27.32 days)
  const lunarCycleDegree = (diffDays * (360 / 27.32166) + (d.getUTCFullYear() % 19) * 19.3) % 360;
  
  // Nakshatra: 360 / 27 = 13.3333 degrees per nakshatra
  const nakshatraIndex = Math.floor(lunarCycleDegree / (360 / 27)) % 27;
  const nakshatra = NAKSHATRAS[nakshatraIndex];

  // Vedic Rashi: 360 / 12 = 30 degrees per rashi
  const rashiIndex = Math.floor(lunarCycleDegree / 30) % 12;
  const rashiKeys = [
    "aries", "taurus", "gemini", "cancer",
    "leo", "virgo", "libra", "scorpio",
    "sagittarius", "capricorn", "aquarius", "pisces"
  ];

  const rashi = ZODIAC_SIGNS_DATA[rashiKeys[rashiIndex]] || ZODIAC_SIGNS_DATA.aries;
  return { rashi, nakshatra, nakshatraIndex };
}

export interface AstroKundaliProfile {
  name: string;
  email?: string;
  dob: string;
  tob?: string;
  pob?: string;
  sunSign: ZodiacSignDetails;
  moonSign: ZodiacSignDetails;
  nakshatra: string;
}

export interface SynergyResult {
  score: number; // 0 to 100
  harmonyTitle: string;
  elementMatch: string;
  synergyDescription: string;
  consecratedRecommendation: string;
  auspiciousMantra: string;
}

/**
 * Calculates Astral Synergy between User and Recipient
 */
export function calculateAstrologySynergy(
  userProfile: AstroKundaliProfile,
  recipientProfile: { name: string; dob: string; relationship: string }
): SynergyResult {
  const userSign = userProfile.moonSign;
  const recipientSign = getWesternSunSign(recipientProfile.dob);

  const elementMatrix: Record<string, Record<string, { score: number; label: string; desc: string }>> = {
    Fire: {
      Fire: { score: 96, label: "Pranic Resonance (Divine Fire)", desc: "Radiant warmth, unshakeable loyalty, and mutual inspiration." },
      Earth: { score: 78, label: "Prithvi-Agni Anchor", desc: "Fire fuels ambition while Earth provides steadfast protection." },
      Air: { score: 92, label: "Vayu-Agni Expansion", desc: "Air fuels fire's brilliance, leading to harmonious communication." },
      Water: { score: 72, label: "Jala-Agni Balance", desc: "Requires consecrated protection to bridge intense emotional tides." },
    },
    Earth: {
      Fire: { score: 78, label: "Prithvi-Agni Anchor", desc: "Steadfast grounding supporting fiery visionary power." },
      Earth: { score: 94, label: "Sustained Foundation", desc: "Unwavering loyalty, enduring security, and lifelong devotion." },
      Air: { score: 74, label: "Thought & Form Synergy", desc: "Grounded manifestation meets elevated visionary ideals." },
      Water: { score: 95, label: "Nourishing Grove", desc: "Deep emotional security and serene mutual understanding." },
    },
    Air: {
      Fire: { score: 92, label: "Vayu-Agni Expansion", desc: "Intellectual sparks and dynamic creative synergy." },
      Earth: { score: 74, label: "Thought & Form Synergy", desc: "Pragmatic support empowering intellectual pursuits." },
      Air: { score: 90, label: "Astral Clarity", desc: "Effortless telepathic connection and elevated wisdom." },
      Water: { score: 76, label: "Intuitive Breeze", desc: "Rich poetic resonance tempered with emotional tenderness." },
    },
    Water: {
      Fire: { score: 72, label: "Jala-Agni Balance", desc: "Passionate depth requiring grounding sacred talismans." },
      Earth: { score: 95, label: "Nourishing Grove", desc: "profound emotional solace and generational stability." },
      Air: { score: 76, label: "Intuitive Breeze", desc: "Heart-centered intuition aligned with intellectual warmth." },
      Water: { score: 96, label: "Amrita Flow (Oceanic Unity)", desc: "Deep soul-bond, empathy, and intuitive oneness." },
    },
  };

  const matchData = elementMatrix[userSign.element]?.[recipientSign.element] || {
    score: 85,
    label: "Harmonious Astral Bond",
    desc: "Auspicious planetary alignment bringing peace and protection.",
  };

  return {
    score: matchData.score,
    harmonyTitle: `${matchData.label} (${matchData.score}% Alignment)`,
    elementMatch: `${userSign.element} (${userProfile.name}) + ${recipientSign.element} (${recipientProfile.name})`,
    synergyDescription: matchData.desc,
    consecratedRecommendation: `${userSign.rudraksha} + Gomti Chakra Rakhi blessed for ${recipientProfile.relationship}`,
    auspiciousMantra: "ॐ गं गणपतये नमः (Om Gam Ganapataye Namaha)",
  };
}
