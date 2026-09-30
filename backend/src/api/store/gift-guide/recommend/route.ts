import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { buildGuideResult, validateAnswers } from "../../../../modules/younoya-astro/gift-guide"
import { signRecommendation } from "../../../../modules/younoya-astro/gift-guide-token"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const answers = validateAnswers(req.body)
    const channel = (req as any).publishable_key_context?.sales_channel_ids?.[0]
    const result = await buildGuideResult(req.scope, answers, channel)
    const token = result.offers.length ? signRecommendation({
      name: answers.name, relation: answers.forWhom === "self" ? "self" : answers.relation || "",
      moment: answers.moment, intention: answers.intention, method: result.method,
      explanation: result.explanation, guide: result.guide, setTitle: result.setTitle,
      offerIds: result.offers.map((offer: any) => offer.id),
      prices: Object.fromEntries(result.offers.map((offer: any) => [offer.id, offer.price])),
    }) : null
    return res.json({ ...result, token })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not prepare your recommendation"
    const status = /unavailable|configured|timeout/i.test(message) ? 503 : 400
    return res.status(status).json({ message })
  }
}
