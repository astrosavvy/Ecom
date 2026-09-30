import { RASHI_LORDS, RASHIS, WESTERN_SIGNS, elementForSignIndex } from "./utils/chart"

export type SubjectChart = {
  sun_sign: string
  moon_sign: string
  nakshatra: string | null
  element: string
  ruling_planet: string
  full_name: string
}

export type ProductAstro = {
  id: string
  handle: string
  title: string
  thumbnail: string | null
  price: number | null
  compatible_rashis: string[]
  compatible_sun_signs: string[]
  astrology_elements: string[]
  ruling_planets: string[]
  gemstone_crystal: string | null
  sacred_deity: string | null
  synergy_tags: string[]
  occasions: string[]
}

export const OCCASIONS = [
  "birthday", "rakhi", "anniversary", "wedding",
  "housewarming", "diwali", "new-beginnings", "protection", "prosperity",
] as const

const COMPLEMENTARY: Record<string, string[]> = {
  Fire: ["Air"],
  Air: ["Fire"],
  Earth: ["Water"],
  Water: ["Earth"],
}

function norm(s: string): string {
  return (s || "").toLowerCase().trim()
}

export function scoreProduct(
  product: ProductAstro,
  subject: SubjectChart,
  opts: { occasion?: string; sender?: SubjectChart | null } = { occasion: undefined, sender: null }
): { score: number; reasons: string[] } {
  const reasons: string[] = []
  let score = 20 // base

  const rashis = (product.compatible_rashis || []).map(norm)
  const suns = (product.compatible_sun_signs || []).map(norm)
  const elements = (product.astrology_elements || []).map(norm)
  const planets = (product.ruling_planets || []).map(norm)
  const occasions = (product.occasions || []).map(norm)

  const moonIdx = RASHIS.indexOf(subject.moon_sign as (typeof RASHIS)[number])
  const sunIdx = WESTERN_SIGNS.indexOf(subject.sun_sign as (typeof WESTERN_SIGNS)[number])
  const subjectRashiWestern = sunIdx >= 0 ? WESTERN_SIGNS[sunIdx] : ""
  const subjectElement = subject.element
  const subjectPlanet = subject.ruling_planet

  // vedic moon sign (rashi) — strongest signal
  if (moonIdx >= 0 && rashis.includes(RASHIS[moonIdx].toLowerCase())) {
    score += 40
    reasons.push(
      `Moon in ${subject.moon_sign} — ruled by ${RASHI_LORDS[moonIdx]}, this piece answers its energy`
    )
  }

  // western sun sign
  if (suns.includes(norm(subject.sun_sign))) {
    score += 25
    reasons.push(`Aligned with the ${subject.sun_sign} sun`)
  } else if (rashis.includes(norm(subjectRashiWestern)) && !rashis.includes(RASHIS[moonIdx]?.toLowerCase())) {
    score += 12
    reasons.push(`Supports ${subject.sun_sign} energy`)
  }

  // ruling planet resonance
  if (planets.map((p) => p.split("&")[0].trim()).some((p) => norm(subjectPlanet).includes(p) || p.includes(norm(subjectPlanet)))) {
    score += 15
    reasons.push(`Carries the grace of ${subjectPlanet}, lord of your moon sign`)
  }

  // elemental harmony
  if (elements.includes(norm(subjectElement))) {
    score += 15
    reasons.push(`Elemental match — ${subjectElement} nature meets ${subjectElement} remedy`)
  }

  // occasion boost
  if (opts.occasion && occasions.includes(norm(opts.occasion))) {
    score += 10
    reasons.push(`Curated for ${opts.occasion}`)
  }

  // sender <-> recipient synergy
  if (opts.sender) {
    if (norm(opts.sender.element) === norm(subjectElement)) {
      score += 8
      reasons.push(`Your ${opts.sender.element} bond deepens this gift's intent`)
    } else if ((COMPLEMENTARY[norm(opts.sender.element)] || []).includes(norm(subjectElement))) {
      score += 6
      reasons.push(`Your elements complete each other — ${opts.sender.element} & ${subjectElement}`)
    }
  }

  if (product.gemstone_crystal && reasons.length <= 2) {
    reasons.push(`Set with ${product.gemstone_crystal}`)
  }

  return { score: Math.min(100, score), reasons: reasons.slice(0, 3) }
}

export type Recommendation = {
  main: (ProductAstro & { score: number; reasons: string[] }) | null
  suggestions: Array<ProductAstro & { score: number; reasons: string[] }>
  subject: SubjectChart
  synergy_note: string | null
}

export function recommend(
  products: ProductAstro[],
  subject: SubjectChart,
  opts: { occasion?: string; sender?: SubjectChart | null } = {}
): Recommendation {
  const scored = products
    .map((p) => ({ ...p, ...scoreProduct(p, subject, opts) }))
    .sort((a, b) => b.score - a.score)

  const [main, ...rest] = scored

  // pick 3 suggestions preferring variety (different top element/tag)
  const suggestions: typeof scored = []
  const usedTags = new Set<string>()
  for (const p of rest) {
    const tag = p.astrology_elements?.[0] || p.handle
    if (!usedTags.has(tag) || suggestions.length >= 2) {
      suggestions.push(p)
      usedTags.add(tag)
    }
    if (suggestions.length === 3) break
  }
  while (suggestions.length < 3 && rest.length > suggestions.length) {
    const p = rest[suggestions.length]
    if (!suggestions.includes(p)) suggestions.push(p)
    else break
  }

  let synergy_note: string | null = null
  if (opts.sender) {
    const same = norm(opts.sender.element) === norm(subject.element)
    synergy_note = same
      ? `Your ${opts.sender.element} elements mirror each other — a gift that doubles its blessing.`
      : `Your ${opts.sender.element} and their ${subject.element} natures balance beautifully.`
  }

  return {
    main: main ?? null,
    suggestions: suggestions.slice(0, 3),
    subject,
    synergy_note,
  }
}
