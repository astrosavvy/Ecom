import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { birthInstant, computeChart } from "./utils/chart"
import { WESTERN_SIGNS } from "./utils/chart"
import { computeDasha } from "./utils/dasha"
import { resolvePlace } from "./utils/geonames"
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

export async function buildGuideResult(scope: any, raw: unknown, salesChannelId?: string) {
  const answers = validateAnswers(raw)
  let method: "astrology" | "numerology" | "intention" = "intention"
  let chart: ReturnType<typeof computeChart> | null = null
  let period: ReturnType<typeof computeDasha> | null = null
  let numbers: ReturnType<typeof numerology> | null = null
  if (answers.dob && answers.tob && answers.placeId) {
    const place = await resolvePlace(answers.placeId)
    const born = birthInstant(answers.dob, answers.tob, place.timezone)
    chart = computeChart({ dob: answers.dob, tob: answers.tob, pob_lat: place.lat, pob_lng: place.lng, pob_tz: place.timezone })
    period = computeDasha(chart.nakshatra_index, chart.moon_longitude_sidereal, born)
    method = "astrology"
  } else if (answers.dob) {
    numbers = numerology(answers.dob)
    method = "numerology"
  }
  const matrixKey = chart && period ? `${WESTERN_SIGNS[chart.moon_sign_index].toUpperCase()}-${period.antardasha}-${answers.intention}` : ""
  const setTitle = matrixKey && Object.prototype.hasOwnProperty.call(matrix, matrixKey)
    ? (matrix as Record<string, string>)[matrixKey] : null
  const query = scope.resolve(ContainerRegistrationKeys.QUERY) as any
  const { data: products } = await query.graph({ entity: "product", filters: { status: ["published"],
      ...(salesChannelId ? { sales_channels: { id: salesChannelId } } : {}) },
    fields: ["id", "handle", "title", "thumbnail", "metadata", "variants.id", "variants.manage_inventory",
      "variants.allow_backorder", "variants.prices.amount", "variants.prices.currency_code"],
    pagination: { take: 250 } })
  const inStock = await availableOffers(scope, products, salesChannelId)
  const offers = inStock.map((product: any) => {
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
    const score = (exact ? 200 : 0) + (match ? 100 : 0) + (privateOffer ? 20 : 0) + (chart && element === chart.element ? 10 : 0)
    return { ...presentOffer(product), score, exact: Boolean(exact) }
  }).filter(Boolean).sort((a: any, b: any) => b.score - a.score)
  const recommended = offers.slice(0, 3)
  const exactOffer = recommended.some((offer: any) => offer.exact)
  const fallback = !recommended.length ? "No approved piece is currently in stock for this intention. Please check back with the atelier soon."
    : method === "astrology"
    ? setTitle && exactOffer ? `For this ${chart!.moon_sign} Moon and ${period!.antardasha} period, the ${setTitle} gives shape to your ${answers.intention.replace("-", " and ")} intention.`
      : setTitle ? `Your ${chart!.moon_sign} Moon and ${period!.antardasha} period have a dedicated set in our guide. Until that set is available, these pieces are chosen for your ${answers.intention.replace("-", " and ")} intention.`
      : `Your ${chart!.moon_sign} Moon informs a broader selection for ${answers.intention.replace("-", " and ")}; this period has no dedicated set in our current guide.`
    : method === "numerology"
      ? `Your ${numbers!.kind} is ${numbers!.number} and your personal year is ${numbers!.personalYear}. With birth time or place unavailable, your chosen intention leads the selection.`
      : `Your intention of ${answers.intention.replace("-", " and ")} leads this selection.`
  const explanation = await narrate({ method, fallback, intention: answers.intention, titles: recommended.map((item: any) => item.title) })
  return { method, explanation, setTitle: exactOffer ? setTitle : null,
    guide: chart ? { moonSign: chart.moon_sign, antardasha: period!.antardasha,
      coverage: exactOffer ? "matrix" : setTitle ? "matrix-fallback" : "broader" }
    : numbers ? { kind: numbers.kind, number: numbers.number, personalYear: numbers.personalYear } : null,
    offers: recommended.map(({ score, exact, ...offer }: any) => offer) }
}

async function narrate(input: { method: string; fallback: string; intention: string; titles: string[] }) {
  const key = process.env.OPENROUTER_API_KEY
  const model = process.env.OPENROUTER_MODEL
  if (!key || !model || !input.titles.length) return input.fallback
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST", signal: AbortSignal.timeout(6500),
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model, temperature: 0.35,
        messages: [{ role: "system", content: "Write one warm, concise Younoya gift-guide paragraph. The rules already selected the products. Do not change them, promise outcomes, claim medical or financial effects, or mention unprovided product facts." },
          { role: "user", content: JSON.stringify(input) }],
        response_format: { type: "json_schema", json_schema: { name: "gift_explanation", strict: true,
          schema: { type: "object", additionalProperties: false, required: ["paragraph"], properties: { paragraph: { type: "string" } } } } } }),
    })
    if (!response.ok) return input.fallback
    const payload = await response.json() as any
    const parsed = JSON.parse(payload.choices?.[0]?.message?.content ?? "{}")
    const paragraph = String(parsed.paragraph ?? "").trim()
    return paragraph.length >= 30 && paragraph.length <= 650 ? paragraph : input.fallback
  } catch { return input.fallback }
}
