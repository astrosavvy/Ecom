import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { elementForSignIndex, WESTERN_SIGNS } from "./utils/chart"
import { resolvePlace } from "./utils/geocoding"
import { fetchVedAstroAstrology } from "./utils/vedastro"
import matrix from "./data/matrix.json"
import { availableOffers, presentOffer } from "./offers"

export const INTENTIONS = ["love-connection", "confidence-power", "vitality-balance", "wealth-prosperity"] as const
export type Intention = typeof INTENTIONS[number]
export type GuideAnswers = {
  forWhom: "self" | "other"
  name: string
  relation?: string
  moment: string
  intention: Intention
  dob?: string
  tob?: string
  placeId?: number
}
const BROOCHES: Record<string, { intention: Intention; element: string }> = {
  "wild-poise": { intention: "confidence-power", element: "Earth" },
  "the-golden-flight": { intention: "confidence-power", element: "Fire" },
  "the-verdant-rising": { intention: "vitality-balance", element: "Earth" },
  "flamingo-grace": { intention: "love-connection", element: "Water" },
  "vivid-toucan-muse": { intention: "confidence-power", element: "Air" },
  "golden-instinct": { intention: "wealth-prosperity", element: "Earth" },
  "fire-and-radiance": { intention: "confidence-power", element: "Fire" },
  "flamingo-aura": { intention: "vitality-balance", element: "Water" },
  "cats-eye": { intention: "confidence-power", element: "Air" },
  "the-inner-kingdom": { intention: "wealth-prosperity", element: "Earth" },
}

export function validateAnswers(raw: unknown): GuideAnswers {
  const value = (raw ?? {}) as Record<string, unknown>
  if (value.forWhom !== "self" && value.forWhom !== "other") throw new Error("Choose who the gift is for")
  const name = String(value.name ?? "").trim().slice(0, 70)
  const moment = String(value.moment ?? "").trim().slice(0, 100)
  const relation = String(value.relation ?? "").trim().slice(0, 70)
  if (!name || !moment || (value.forWhom === "other" && !relation)) throw new Error("Complete the conversation first")
  if (!INTENTIONS.includes(value.intention as Intention)) throw new Error("Choose an intention")
  const dob = String(value.dob ?? "")
  const tob = String(value.tob ?? "")
  const placeId = value.placeId === undefined || value.placeId === null || value.placeId === "" ? undefined : Number(value.placeId)
  if (dob) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dob)) throw new Error("Choose a valid birth date")
    const noon = new Date(`${dob}T12:00:00Z`)
    const oldest = new Date(); oldest.setUTCFullYear(oldest.getUTCFullYear() - 120)
    if (Number.isNaN(noon.getTime()) || noon.toISOString().slice(0, 10) !== dob || dob > new Date().toISOString().slice(0, 10) ||
        dob < oldest.toISOString().slice(0, 10)) throw new Error("Birth date must be within the past 120 years")
  }
  if (tob && !/^([01]\d|2[0-3]):[0-5]\d$/.test(tob)) throw new Error("Choose a valid birth time")
  if (placeId !== undefined && (!Number.isSafeInteger(placeId) || placeId <= 0)) throw new Error("Choose a city from the suggestions")
  if (!dob && (tob || placeId)) throw new Error("Add a birth date or leave birth details blank")
  return { forWhom: value.forWhom, name, moment, relation, intention: value.intention as Intention, dob, tob, placeId }
}

function digitSum(number: number): number {
  let value = number
  while (value > 9) value = String(value).split("").reduce((sum, digit) => sum + Number(digit), 0)
  return value
}

export function numerology(dob: string, now = new Date()) {
  const [y, m, d] = dob.split("-").map(Number)
  const age = now.getUTCFullYear() - y - (now.getUTCMonth() + 1 < m || (now.getUTCMonth() + 1 === m && now.getUTCDate() < d) ? 1 : 0)
  const kind = age < 32 ? "Moolank" : "Destiny number"
  const number = digitSum(age < 32 ? d : Number(String(y) + String(m).padStart(2, "0") + String(d).padStart(2, "0")))
  const personalYear = digitSum(d + m + now.getUTCFullYear())
  return { age, kind, number, personalYear }
}

import combinations from "./data/combinations.json"

export async function buildGuideResult(scope: any, raw: unknown, salesChannelId?: string) {
  const answers = validateAnswers(raw)
  let method: "astrology" | "numerology" | "intention" = "intention"
  let astrologyData: { moonSign: string; antardasha: string; mahadasha?: string; element?: string } | null = null
  let numbers: ReturnType<typeof numerology> | null = null

  if (answers.dob && answers.tob && answers.placeId) {
    const place = await resolvePlace(answers.placeId)
    const vedAstro = await fetchVedAstroAstrology({
      dob: answers.dob,
      tob: answers.tob,
      lat: place.lat,
      lng: place.lng,
      timezone: place.timezone,
      offsetString: place.offsetString,
      placeName: place.name,
    })
    const signIndex = WESTERN_SIGNS.findIndex((s) => s.toLowerCase() === vedAstro.moonSign.toLowerCase())
    const element = signIndex >= 0 ? elementForSignIndex(signIndex) : undefined
    astrologyData = {
      moonSign: vedAstro.moonSign,
      antardasha: vedAstro.antardasha,
      mahadasha: vedAstro.mahadasha,
      element,
    }
    method = "astrology"
  } else if (answers.dob) {
    numbers = numerology(answers.dob)
    method = "numerology"
  }

  // Strict Dasha Gate: Only Mercury and Ketu have curated hampers in the portfolio
  const isSupportedDasha = astrologyData
    ? (astrologyData.antardasha === "Mercury" || astrologyData.antardasha === "Ketu")
    : true

  const matrixKey = astrologyData ? `${astrologyData.moonSign.toUpperCase()}-${astrologyData.antardasha}-${answers.intention}` : ""
  const combination = (matrixKey && Object.prototype.hasOwnProperty.call(combinations, matrixKey))
    ? (combinations as Record<string, any>)[matrixKey]
    : null
  const setTitle = combination?.setTitle || (matrixKey && Object.prototype.hasOwnProperty.call(matrix, matrixKey)
    ? (matrix as Record<string, string>)[matrixKey]
    : null)

  const query = scope.resolve(ContainerRegistrationKeys.QUERY) as any
  const { data: products } = await query.graph({
    entity: "product",
    filters: {
      status: ["published"],
      ...(salesChannelId ? { sales_channels: { id: salesChannelId } } : {}),
    },
    fields: [
      "id", "handle", "title", "thumbnail", "metadata", "variants.id", "variants.manage_inventory",
      "variants.allow_backorder", "variants.prices.amount", "variants.prices.currency_code",
    ],
    pagination: { take: 250 },
  })
  const inStock = await availableOffers(scope, products, salesChannelId)

  let offers: any[] = []
  if (method !== "astrology" || isSupportedDasha) {
    offers = inStock.map((product: any) => {
      const md = product.metadata ?? {}
      if (md.gift_guide_approved === false) return null
      const privateOffer = md.recommendation_only === true
      if (privateOffer && md.gift_guide_approved !== true) return null
      if (!privateOffer && !BROOCHES[product.handle]) return null
      const intentions = Array.isArray(md.gift_guide_intentions) ? md.gift_guide_intentions : [BROOCHES[product.handle]?.intention]
      const keys = Array.isArray(md.gift_guide_matrix_keys) ? md.gift_guide_matrix_keys : []
      const exact = matrixKey && keys.includes(matrixKey)
      const match = intentions.includes(answers.intention)
      if (!exact && !match) return null
      const element = BROOCHES[product.handle]?.element
      const score = (exact ? 200 : 0) + (match ? 100 : 0) + (privateOffer ? 20 : 0) + (astrologyData && element === astrologyData.element ? 10 : 0)
      return { ...presentOffer(product), score, exact: Boolean(exact) }
    }).filter(Boolean).sort((a: any, b: any) => b.score - a.score)
  }

  const secondaryOffers = offers.slice(0, 3)
  const hasProducts = method === "astrology" ? isSupportedDasha && secondaryOffers.length > 0 : secondaryOffers.length > 0

  // Build Primary Curated Hamper Offer if combination exists
  let primaryOffer: any = null
  if (hasProducts && combination) {
    const leadProduct = secondaryOffers[0]
    primaryOffer = {
      id: combination.combinationId,
      isHamper: true,
      combinationId: combination.combinationId,
      handle: `hamper-${combination.combinationId.toLowerCase()}`,
      title: combination.setTitle,
      tagline: combination.tagline,
      story: combination.story,
      price: 549900, // ₹5,499 in paise
      currency: "inr",
      privateOffer: true,
      keepsake: combination.keepsake,
      ritual: combination.ritual,
      luxuryAddOn: combination.luxuryAddOn,
      challenge: combination.challenge,
      desiredShift: combination.desiredShift,
      components: [combination.keepsake?.name || "Sacred Keepsake", combination.ritual?.name || "Sensory Ritual"],
      variantId: leadProduct?.variantId || "variant_curated_hamper",
      image: leadProduct?.image || "/media/shop-wild-poise-card.webp",
    }
  }

  const fallback = !hasProducts
    ? method === "astrology" && !isSupportedDasha
      ? `For your active ${astrologyData!.antardasha} period, no dedicated products are currently available in our portfolio / store.`
      : "No approved piece is currently in stock for this intention. Please check back with the atelier soon."
    : method === "astrology"
    ? setTitle
      ? `For your ${astrologyData!.moonSign} Moon and ${astrologyData!.antardasha} period, ${setTitle} gives shape to your ${answers.intention.replace("-", " and ")} intention.`
      : `Your ${astrologyData!.moonSign} Moon informs this selection for ${answers.intention.replace("-", " and ")}.`
    : method === "numerology"
      ? `Your ${numbers!.kind} is ${numbers!.number} and your personal year is ${numbers!.personalYear}. With birth time or place unavailable, your chosen intention leads the selection.`
      : `Your intention of ${answers.intention.replace("-", " and ")} leads this selection.`

  const narrative = await narrate({
    name: answers.name,
    relation: answers.forWhom === "self" ? "self" : answers.relation,
    intention: answers.intention,
    moonSign: astrologyData?.moonSign,
    dasha: astrologyData?.antardasha,
    setTitle,
    combination,
    hasProducts,
    fallback,
    titles: hasProducts ? [primaryOffer?.title, ...secondaryOffers.map((o: any) => o.title)].filter(Boolean) : [],
  })

  const returnedOffers = hasProducts
    ? [primaryOffer, ...secondaryOffers.filter((o: any) => o.id !== primaryOffer?.id)].filter(Boolean)
    : []

  return {
    method,
    hasProducts,
    whatYouMightBeGoingThrough: narrative.whatYouMightBeGoingThrough,
    whyChosen: narrative.whyChosen,
    explanation: narrative.explanation,
    setTitle: isSupportedDasha ? setTitle : null,
    combination: isSupportedDasha ? combination : null,
    guide: astrologyData ? {
      moonSign: astrologyData.moonSign,
      antardasha: astrologyData.antardasha,
      mahadasha: astrologyData.mahadasha,
      coverage: isSupportedDasha ? (combination ? "matrix" : "matrix-fallback") : "unsupported-dasha",
    } : numbers ? {
      kind: numbers.kind,
      number: numbers.number,
      personalYear: numbers.personalYear,
    } : null,
    primaryOffer,
    offers: returnedOffers.map(({ score, exact, ...offer }: any) => offer),
  }
}

async function narrate(input: {
  name: string
  relation?: string
  intention: string
  moonSign?: string
  dasha?: string
  setTitle?: string | null
  combination?: any
  hasProducts: boolean
  fallback: string
  titles: string[]
}): Promise<{ whatYouMightBeGoingThrough: string; whyChosen: string; explanation: string }> {
  const key = process.env.OPENROUTER_API_KEY || ""
  const model = process.env.OPENROUTER_MODEL || "inclusionai/ling-3.0-flash-sante:free"

  let whatYouMightBeGoingThrough = input.combination?.whatYouMightBeGoingThrough || input.combination?.story || ""
  let whyChosen = input.combination?.whyChosen || ""

  if (!whatYouMightBeGoingThrough && !input.hasProducts) {
    whatYouMightBeGoingThrough = `As your ${input.moonSign || "natal"} Moon moves through this active ${input.dasha || "planetary"} chapter, you may feel an inner transition between past certainties and emerging priorities. This can create moments of quiet hesitation precisely when your decisions call for conviction.`
  }
  if (!whyChosen && !input.hasProducts) {
    whyChosen = `This reading honors your intention for ${input.intention.replace("-", " and ")}. For your active ${input.dasha || "planetary"} period, no dedicated products are currently available in our portfolio / store.`
  }

  const defaultResult = {
    whatYouMightBeGoingThrough,
    whyChosen,
    explanation: `${whatYouMightBeGoingThrough}\n\n${whyChosen}`.trim() || input.fallback
  }

  if (!key || !model) return defaultResult

  const systemPrompt = `You are Aster, the luxury Vedic astrology gifting oracle for YOUNOYA ("For every chapter").
You combine Cartier-grade poise, quiet warmth, poetic clarity, and authentic Vedic insight.

Always structure your response into exactly TWO distinct labeled sections:

WHAT YOU MIGHT BE GOING THROUGH:
<One deep, empathetic paragraph (3-5 sentences) speaking directly and intimately to ${input.name || "the recipient"}. Explore their psychological crossroad, emotional hesitation, and life transition based on their ${input.moonSign || ""} Moon and active ${input.dasha || ""} period for their intention (${input.intention.replace("-", " and ")}). Never make fatalistic predictions.>

WHY THIS WAS CHOSEN FOR YOU:
<One warm, intentional paragraph (3-5 sentences). ${
    input.hasProducts
      ? `Explain how the Keepsake anchor (${input.combination?.keepsake?.name || "sacred keepsake"}) and Sensory Ritual (${input.combination?.ritual?.name || "daily ritual"}) give physical shape to their desired shift (${input.combination?.desiredShift || input.intention}) and ground their active ${input.dasha || ""} chapter.`
      : `Explain how approaching this period with mindful intention brings clarity to their ${input.intention.replace("-", " and ")} chapter. You MUST conclude this section with this exact sentence: "For your active ${input.dasha || "planetary"} period, no dedicated products are currently available in our portfolio / store."`
  }>`

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      signal: AbortSignal.timeout(7500),
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        temperature: 0.4,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: JSON.stringify({
            name: input.name,
            forWhom: input.relation || "self",
            moonSign: input.moonSign,
            dasha: input.dasha,
            intention: input.intention,
            setTitle: input.setTitle,
            hasProducts: input.hasProducts,
            challenge: input.combination?.challenge,
            desiredShift: input.combination?.desiredShift,
            keepsake: input.combination?.keepsake?.name,
            ritual: input.combination?.ritual?.name,
          }) },
        ],
      }),
    })

    if (!response.ok) return defaultResult
    const payload = await response.json() as any
    const content = payload.choices?.[0]?.message?.content?.trim()
    if (!content) return defaultResult

    const splitMatch = content.split(/WHY THIS WAS CHOSEN FOR YOU:?/i)
    if (splitMatch.length >= 2) {
      const p1 = splitMatch[0].replace(/WHAT YOU MIGHT BE GOING THROUGH:?/i, '').trim()
      let p2 = splitMatch[1].trim()
      if (!input.hasProducts && !p2.includes("portfolio / store")) {
        p2 += ` For your active ${input.dasha || "planetary"} period, no dedicated products are currently available in our portfolio / store.`
      }
      if (p1) whatYouMightBeGoingThrough = p1
      if (p2) whyChosen = p2
    } else {
      if (!input.hasProducts && !content.includes("portfolio / store")) {
        whyChosen = `${content} For your active ${input.dasha || "planetary"} period, no dedicated products are currently available in our portfolio / store.`
      } else {
        whyChosen = content
      }
    }

    return {
      whatYouMightBeGoingThrough,
      whyChosen,
      explanation: `${whatYouMightBeGoingThrough}\n\n${whyChosen}`.trim()
    }
  } catch {
    return defaultResult
  }
}


