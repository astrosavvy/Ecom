import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { getCustomerId } from "../../utils/auth"
import { YOUNOYA_TOOLKITS_MODULE } from "../../../modules/younoya-toolkits"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const toolkits = req.scope.resolve(YOUNOYA_TOOLKITS_MODULE) as any
  const customerId = getCustomerId(req)
  if (!customerId) return res.status(401).json({ message: "Unauthorized" })

  const list = await toolkits.listToolkits(
    { customer_id: customerId },
    { order: { created_at: "DESC" } }
  )
  return res.json({ toolkits: list })
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const toolkitService = req.scope.resolve(YOUNOYA_TOOLKITS_MODULE) as any
  const customerId = getCustomerId(req)
  if (!customerId) return res.status(401).json({ message: "Unauthorized" })

  const body = (req.body ?? {}) as {
    recipient_profile_id?: string
    recipient_name?: string
    recipient_relationship?: string
    type?: string
    intents?: string[]
    occasion?: string
    gift_message?: string
    personalised_explanation?: string
    astro_snapshot?: Record<string, unknown>
    items?: Array<{
      product_id: string
      product_handle?: string
      product_title?: string
      role?: string
      selection_rationale?: string
      score?: number
      display_order?: number
    }>
  }

  const toolkit = await toolkitService.createToolkits({
    customer_id: customerId,
    recipient_profile_id: body.recipient_profile_id || null,
    recipient_name: body.recipient_name || null,
    recipient_relationship: body.recipient_relationship || null,
    type: body.type || "general",
    status: "generated",
    intents: body.intents || null,
    occasion: body.occasion || null,
    gift_message: body.gift_message || null,
    personalised_explanation: body.personalised_explanation || null,
    astro_snapshot: body.astro_snapshot || null,
  })

  // Create toolkit items if provided
  if (body.items?.length) {
    for (const item of body.items) {
      await toolkitService.createToolkitItems({
        toolkit_id: toolkit.id,
        product_id: item.product_id,
        product_handle: item.product_handle || null,
        product_title: item.product_title || null,
        role: item.role || "supporting",
        selection_rationale: item.selection_rationale || null,
        score: item.score || 0,
        display_order: item.display_order || 0,
      })
    }
  }

  return res.json({ toolkit })
}
