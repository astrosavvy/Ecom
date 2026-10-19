/**
 * YOUNOYA Category & Rashi Normalization Map
 * Maps between internal intention IDs, clean URL slugs, and the 12 Vedic Rashis
 */

export const CATEGORIES = {
  career: {
    id: 'confidence-power',
    slug: 'career',
    aliases: ['confidence-power', 'career', 'power'],
    label: 'Career & Confidence',
    subtitle: 'Conviction, Clarity & Executive Poise',
    tagline: 'Precision • Direction • Strategic Action',
    element: 'Fire / Earth',
    color: '#8C6A24',
    bgTint: 'rgba(140, 106, 36, 0.08)',
  },
  love: {
    id: 'love-connection',
    slug: 'love',
    aliases: ['love-connection', 'love', 'passion'],
    label: 'Love & Passion',
    subtitle: 'Devotion, Empathy & Emotional Depth',
    tagline: 'Devotion • Softness • Unspoken Truth',
    element: 'Water',
    color: '#9E3A3A',
    bgTint: 'rgba(158, 58, 58, 0.08)',
  },
  vitality: {
    id: 'vitality-balance',
    slug: 'vitality',
    aliases: ['vitality-balance', 'vitality', 'peace', 'balance'],
    label: 'Peace & Inner Vitality',
    subtitle: 'Grounding, Harmony & Restful Alignment',
    tagline: 'Quiet Strength • Restful Grounding • Renewal',
    element: 'Earth / Water',
    color: '#3B6B4D',
    bgTint: 'rgba(59, 107, 77, 0.08)',
  },
  wealth: {
    id: 'wealth-prosperity',
    slug: 'wealth',
    aliases: ['wealth-prosperity', 'wealth', 'abundance'],
    label: 'Abundance & Good Fortune',
    subtitle: 'Enduring Prosperity & Auspicious Growth',
    tagline: 'Patience • Harvest • Sacred Abundance',
    element: 'Earth',
    color: '#B08429',
    bgTint: 'rgba(176, 132, 41, 0.08)',
  },
}

export const RASHIS = [
  { slug: 'aries', vedic: 'mesha', name: 'Aries', sanskrit: 'Mesha', symbol: '♈', element: 'Fire', lord: 'Mars (Mangal)' },
  { slug: 'taurus', vedic: 'vrishabha', name: 'Taurus', sanskrit: 'Vrishabha', symbol: '♉', element: 'Earth', lord: 'Venus (Shukra)' },
  { slug: 'gemini', vedic: 'mithuna', name: 'Gemini', sanskrit: 'Mithuna', symbol: '♊', element: 'Air', lord: 'Mercury (Budh)' },
  { slug: 'cancer', vedic: 'karka', name: 'Cancer', sanskrit: 'Karka', symbol: '♋', element: 'Water', lord: 'Moon (Chandra)' },
  { slug: 'leo', vedic: 'simha', name: 'Leo', sanskrit: 'Simha', symbol: '♌', element: 'Fire', lord: 'Sun (Surya)' },
  { slug: 'virgo', vedic: 'kanya', name: 'Virgo', sanskrit: 'Kanya', symbol: '♍', element: 'Earth', lord: 'Mercury (Budh)' },
  { slug: 'libra', vedic: 'tula', name: 'Libra', sanskrit: 'Tula', symbol: '♎', element: 'Air', lord: 'Venus (Shukra)' },
  { slug: 'scorpio', vedic: 'vrishchika', name: 'Scorpio', sanskrit: 'Vrishchika', symbol: '♏', element: 'Water', lord: 'Mars / Ketu' },
  { slug: 'sagittarius', vedic: 'dhanu', name: 'Sagittarius', sanskrit: 'Dhanu', symbol: '♐', element: 'Fire', lord: 'Jupiter (Guru)' },
  { slug: 'capricorn', vedic: 'makara', name: 'Capricorn', sanskrit: 'Makara', symbol: '♑', element: 'Earth', lord: 'Saturn (Shani)' },
  { slug: 'aquarius', vedic: 'kumbha', name: 'Aquarius', sanskrit: 'Kumbha', symbol: '♒', element: 'Air', lord: 'Saturn (Shani)' },
  { slug: 'pisces', vedic: 'meena', name: 'Pisces', sanskrit: 'Meena', symbol: '♓', element: 'Water', lord: 'Jupiter (Guru)' },
]

export function resolveCategory(input) {
  if (!input) return CATEGORIES.career
  const key = String(input).toLowerCase().trim()
  for (const cat of Object.values(CATEGORIES)) {
    if (cat.slug === key || cat.id === key || cat.aliases.includes(key)) return cat
  }
  return CATEGORIES.career
}

export function resolveRashi(input) {
  if (!input) return RASHIS[0]
  const key = String(input).toLowerCase().trim()
  const found = RASHIS.find(r => r.slug === key || r.vedic === key || r.name.toLowerCase() === key || r.sanskrit.toLowerCase() === key)
  return found || RASHIS[0]
}

export function getMatrixKey(rashi, category, dasha = 'Mercury') {
  const r = resolveRashi(rashi)
  const c = resolveCategory(category)
  return `${r.name.toUpperCase()}-${dasha}-${c.id}`
}
