import crypto from "crypto"

export type RecommendationSnapshot = {
  name: string; relation: string; moment: string; intention: string
  method: string; explanation: string; guide: unknown; setTitle: string | null
  offerIds: string[]; prices: Record<string, number>; exp: number
}

function secret() {
  const value = process.env.GIFT_GUIDE_SIGNING_SECRET || process.env.JWT_SECRET
  if (!value || value.length < 24) throw new Error("Recommendation saving is not configured")
  return value
}

export function signRecommendation(snapshot: Omit<RecommendationSnapshot, "exp">) {
  const body = Buffer.from(JSON.stringify({ ...snapshot, exp: Date.now() + 24 * 3600_000 })).toString("base64url")
  const signature = crypto.createHmac("sha256", secret()).update(body).digest("base64url")
  return `${body}.${signature}`
}

export function verifyRecommendation(token: unknown): RecommendationSnapshot {
  if (typeof token !== "string" || token.length > 12000 || !/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(token)) {
    throw new Error("Recommendation link is invalid")
  }
  const [body, signature] = token.split(".")
  const expected = crypto.createHmac("sha256", secret()).update(body).digest()
  const actual = Buffer.from(signature, "base64url")
  if (actual.length !== expected.length || !crypto.timingSafeEqual(actual, expected)) throw new Error("Recommendation link is invalid")
  const data = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as RecommendationSnapshot
  if (!Number.isSafeInteger(data.exp) || data.exp < Date.now() || data.exp > Date.now() + 24 * 3600_000 ||
      !Array.isArray(data.offerIds) || data.offerIds.length < 1 || data.offerIds.length > 3 ||
      !data.offerIds.every((id) => typeof id === "string" && id.startsWith("prod_") && Number.isInteger(data.prices?.[id])) ||
      !["astrology", "numerology", "intention"].includes(data.method)) {
    throw new Error("Recommendation has expired. Please begin again")
  }
  return data
}
