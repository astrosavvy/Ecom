import crypto from "crypto"
import matrix from "../modules/younoya-astro/data/matrix.json"
import { buildGuideResult, numerology, validateAnswers } from "../modules/younoya-astro/gift-guide"
import { birthInstant } from "../modules/younoya-astro/utils/chart"
import { searchPlaces } from "../modules/younoya-astro/utils/geocoding"
import { computeDasha, DASHA_YEARS } from "../modules/younoya-astro/utils/dasha"
import { signRecommendation, verifyRecommendation } from "../modules/younoya-astro/gift-guide-token"
import RazorpayPaymentProvider, { validRazorpaySignature } from "../modules/younoya-razorpay/service"
import { hideRecommendationOffers } from "../api/middlewares"
import { liveProduct } from "../modules/younoya-astro/offers"
jest.mock('../modules/younoya-commerce/razorpay', () => ({
  ...jest.requireActual('../modules/younoya-commerce/razorpay'),
  persistedOrder: jest.fn(async (_id, _amount, create) => create()),
}))

const product = { id: "prod_one", handle: "wild-poise", title: "Wild Poise", thumbnail: "/wild.webp",
  metadata: {}, variants: [{ id: "variant_one", manage_inventory: false, allow_backorder: false,
    prices: [{ amount: 2499, currency_code: "inr" }] }] }
const scope = { resolve: () => ({ graph: async () => ({ data: [product] }) }) }
const answers = { forWhom: "self", name: "Asha", moment: "A new beginning", intention: "confidence-power" }

describe("gift guide rules", () => {
  beforeAll(() => { jest.useFakeTimers().setSystemTime(new Date("2026-09-30T12:00:00Z")); delete process.env.OPENROUTER_API_KEY })
  afterAll(() => jest.useRealTimers())

  test("guest intention and date-only paths return the actual priced offer", async () => {
    const intention = await buildGuideResult(scope, answers)
    expect(intention.method).toBe("intention")
    expect(intention.offers[0].variantId).toBe("variant_one")
    expect(intention.offers[0].price).toBe(2499)
    const dateOnly = await buildGuideResult(scope, { ...answers, dob: "1994-09-30" })
    expect(dateOnly.method).toBe("numerology")
    expect(dateOnly.guide).toBeNull()
    expect(dateOnly.offers[0].price).toBe(2499)
  })

  test("age 31 uses Moolank and age 32 uses Destiny number", () => {
    expect(numerology("1994-10-01").kind).toBe("Moolank")
    expect(numerology("1994-09-30").kind).toBe("Destiny number")
  })

  test("full details use worldwide historical time zone and chart guidance", async () => {
    const originalFetch = global.fetch
    global.fetch = jest.fn(async (url: any) => {
      const u = String(url)
      if (u.includes("DasaForNow")) {
        return {
          ok: true,
          json: async () => ({
            Status: "Pass",
            Payload: {
              DasaForNow: {
                Jupiter: {
                  Type: "Dasa",
                  Lord: "Jupiter",
                  SubDasas: {
                    Mercury: { Type: "Bhukti", Lord: "Mercury" },
                  },
                },
              },
            },
          }),
        }
      }
      if (u.includes("MoonSignName")) {
        return {
          ok: true,
          json: async () => ({
            Status: "Pass",
            Payload: { MoonSignName: "Gemini" },
          }),
        }
      }
      if (u.includes("timezoneJSON")) {
        return { ok: true, json: async () => ({ timezoneId: "America/New_York" }) }
      }
      return {
        ok: true,
        json: async () => ({
          geonameId: 5128581,
          name: "New York City",
          countryName: "United States",
          adminName1: "New York",
          lat: 40.7143,
          lng: -74.006,
        }),
      }
    }) as any
    process.env.GEONAMES_USERNAME = "unit-test"
    const openCage = process.env.OPENCAGE_API_KEY
    delete process.env.OPENCAGE_API_KEY
    try {
      const result = await buildGuideResult(scope, { ...answers, dob: "1994-09-30", tob: "09:30", placeId: 5128581 })
      expect(result.method).toBe("astrology")
      expect(result.guide).toHaveProperty("moonSign", "Gemini")
      expect(result.guide).toHaveProperty("antardasha", "Mercury")
    } finally { global.fetch = originalFetch; delete process.env.GEONAMES_USERNAME; if (openCage) process.env.OPENCAGE_API_KEY = openCage }
    expect(birthInstant("1970-01-01", "09:00", "America/New_York").toISOString()).toBe("1970-01-01T14:00:00.000Z")
  })

  test("OpenCage suppresses queries under 3 characters", async () => {
    process.env.OPENCAGE_API_KEY = "test-key"
    const results = await searchPlaces("De")
    expect(results).toEqual([])
    delete process.env.OPENCAGE_API_KEY
  })

  test("Mercury and Ketu matrix covers four intentions across twelve signs", () => {
    expect(Object.keys(matrix)).toHaveLength(96)
    for (const period of ["Mercury", "Ketu"]) {
      expect(Object.keys(matrix).filter((key) => key.includes(`-${period}-`))).toHaveLength(48)
    }
    expect(Object.keys(DASHA_YEARS).length).toBe(9)
    const dasha = computeDasha(0, 0, new Date("1994-09-30T12:00:00Z"))
    const span = (dasha.sequence[0].end.getTime() - dasha.sequence[0].start.getTime()) / (365.25 * 86400000)
    expect(span).toBeCloseTo(7, 1)
  })

  test("invalid dates and unresolved city choices cannot masquerade as a chart", () => {
    expect(() => validateAnswers({ ...answers, dob: "1900-01-01" })).toThrow()
    expect(() => validateAnswers({ ...answers, dob: "2026-02-30" })).toThrow()
    expect(() => validateAnswers({ ...answers, dob: "1994-09-30", placeId: "not-a-city" })).toThrow()
  })

  test("ambiguous cities remain distinct and AI errors keep the rule explanation", async () => {
    const originalFetch = global.fetch
    global.fetch = jest.fn(async (url: any) => {
      const u = String(url)
      if (u.includes("opencagedata.com")) {
        return {
          ok: true,
          json: async () => ({
            results: [
              {
                geometry: { lat: 39.8, lng: -89.6 },
                components: { city: "Springfield", state: "Illinois", country: "United States" },
                annotations: { timezone: { name: "America/Chicago", offset_string: "-0500" } },
              },
              {
                geometry: { lat: 42.1, lng: -72.6 },
                components: { city: "Springfield", state: "Massachusetts", country: "United States" },
                annotations: { timezone: { name: "America/New_York", offset_string: "-0400" } },
              },
            ],
          }),
        }
      }
      return Promise.reject(new Error("AI timed out"))
    }) as any
    process.env.OPENCAGE_API_KEY = "test-key"
    process.env.OPENROUTER_API_KEY = "test-key"
    process.env.OPENROUTER_MODEL = "test-model"
    try {
      const places = await searchPlaces("Springfield")
      expect(places.map((place) => place.region)).toEqual(["Illinois", "Massachusetts"])
      expect(places[0].id).toBeGreaterThan(0)
      const result = await buildGuideResult(scope, answers)
      expect(result.explanation).toContain("Career & Confidence")
      global.fetch = jest.fn(async () => ({ ok: true, json: async () => ({ choices: [] }) })) as any
      expect((await buildGuideResult(scope, answers)).explanation).toContain("Career & Confidence")
    } finally { global.fetch = originalFetch; delete process.env.OPENCAGE_API_KEY; delete process.env.OPENROUTER_API_KEY; delete process.env.OPENROUTER_MODEL }
  })
})

describe("saved result and payment verification", () => {
  beforeAll(() => { process.env.GIFT_GUIDE_SIGNING_SECRET = "test-secret-of-sufficient-length-123456" })
  afterAll(() => { delete process.env.GIFT_GUIDE_SIGNING_SECRET })
  test("signed guest result survives login without raw birth details", () => {
    const token = signRecommendation({ name: "Asha", relation: "self", moment: "A beginning",
      intention: "confidence-power", method: "astrology", explanation: "A thoughtful selection.",
      guide: { moonSign: "Mesha" }, setTitle: null, offerIds: ["prod_one"], prices: { prod_one: 249900 } })
    expect(verifyRecommendation(token).offerIds).toEqual(["prod_one"])
    expect(token).not.toContain("1994")
    expect(() => verifyRecommendation(`${token.slice(0, -1)}X`)).toThrow()
  })
  test("Razorpay must verify the signed actual order and amount", async () => {
    const secret = "test-razorpay-secret"
    const signature = crypto.createHmac("sha256", secret).update("order_1|pay_1").digest("hex")
    expect(validRazorpaySignature("order_1", "pay_1", signature, secret)).toBe(true)
    expect(validRazorpaySignature("order_1", "pay_2", signature, secret)).toBe(false)
    const provider = new RazorpayPaymentProvider({}, { key_id: "rzp_test", key_secret: secret })
    ;(provider as any).razorpay = { orders: { create: jest.fn(async (input: any) => ({ id: "order_1", ...input })),
      fetch: jest.fn(async () => ({ id:'order_1',amount:249900,notes:{medusa_session_id:'ps_1'} })) },
      payments: { fetch: jest.fn(async () => ({ order_id: "order_1", amount: 249900, currency: "INR", status: "captured" })) } }
    const started = await provider.initiatePayment({ amount: 2499, currency_code: "inr", data: { session_id: "ps_1" } })
    expect(started.data.amount).toBe(249900)
    const valid = await provider.authorizePayment({ data: { ...started.data, razorpay_payment_id: "pay_1", razorpay_signature: signature } })
    expect(valid.status).toBe("captured")
    const invalid = await provider.authorizePayment({ data: { ...started.data, razorpay_payment_id: "pay_1", razorpay_signature: "bad" } })
    expect(invalid.status).toBe("error")
    await expect(provider.updatePayment({amount:2499,currency_code:'inr',data:started.data})).resolves.toEqual({data:started.data})
    await expect(provider.updatePayment({amount:2498,currency_code:'inr',data:started.data})).rejects.toThrow('fresh')
  })
})

test("recommendation-only offers never appear in public product listings", async () => {
  const req: any = { scope: { resolve: () => ({ graph: async () => ({ data: [
    { id: "prod_hidden", metadata: { recommendation_only: true } },
    { id: "prod_public", metadata: {} },
  ] }) }) } }
  const output = jest.fn()
  const res: any = { json: output }
  const next = jest.fn()
  await hideRecommendationOffers(req, res, next)
  expect(next).toHaveBeenCalledWith()
  res.json({ products: [{ id: "prod_hidden" }, { id: "prod_public" }], count: 2 })
  expect(output).toHaveBeenCalledWith(expect.objectContaining({ products: [{ id: "prod_public" }], count: 1 }))
})

test("hideRecommendationOffers does not decrement count when query filter does not match hidden products", async () => {
  const req: any = {
    query: { category_id: "cat_public_only" },
    scope: { resolve: () => ({ graph: async () => ({ data: [
      { id: "prod_hidden", metadata: { recommendation_only: true }, categories: [{ id: "cat_private" }] },
    ] }) }) }
  }
  const output = jest.fn()
  const res: any = { json: output }
  const next = jest.fn()
  await hideRecommendationOffers(req, res, next)
  expect(next).toHaveBeenCalledWith()
  res.json({ products: [{ id: "prod_pub_1" }, { id: "prod_pub_2" }], count: 2 })
  expect(output).toHaveBeenCalledWith(expect.objectContaining({ count: 2 }))
})

test("liveProduct rejects unapproved private offers and unapproved public products", async () => {
  const mockScope = (p: any) => ({ resolve: () => ({ graph: async () => ({ data: [p] }) }) })
  const unapprovedPrivate = { id: "p1", handle: "p1", title: "P1", thumbnail: "/p1.webp",
    metadata: { recommendation_only: true, gift_guide_approved: false },
    variants: [{ id: "v1", manage_inventory: false, prices: [{ amount: 249900, currency_code: "inr" }] }] }
  expect(await liveProduct(mockScope(unapprovedPrivate), "p1")).toBeNull()

  const pendingPrivate = { ...unapprovedPrivate, metadata: { recommendation_only: true } }
  expect(await liveProduct(mockScope(pendingPrivate), "p1")).toBeNull()

  const approvedPrivate = { ...unapprovedPrivate, metadata: { recommendation_only: true, gift_guide_approved: true } }
  expect((await liveProduct(mockScope(approvedPrivate), "p1"))?.id).toBe("p1")

  const disapprovedPublic = { id: "p2", handle: "p2", title: "P2", thumbnail: "/p2.webp",
    metadata: { gift_guide_approved: false },
    variants: [{ id: "v2", manage_inventory: false, prices: [{ amount: 249900, currency_code: "inr" }] }] }
  expect(await liveProduct(mockScope(disapprovedPublic), "p2")).toBeNull()
})
