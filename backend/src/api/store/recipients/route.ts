import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { getCustomerId } from "../../utils/auth"
import { YOUNOYA_RECIPIENTS_MODULE } from "../../../modules/younoya-recipients"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const recipients = req.scope.resolve(YOUNOYA_RECIPIENTS_MODULE) as any
  const customerId = getCustomerId(req)
  if (!customerId) return res.status(401).json({ message: "Unauthorized" })

  const list = await recipients.listGiftRecipients(
    { customer_id: customerId },
    { order: { created_at: "DESC" } }
  )
  return res.json({ recipients: list })
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const recipientService = req.scope.resolve(YOUNOYA_RECIPIENTS_MODULE) as any
  const customerId = getCustomerId(req)
  if (!customerId) return res.status(401).json({ message: "Unauthorized" })

  const body = (req.body ?? {}) as {
    name?: string
    relationship?: string
    dob?: string
    birth_time?: string | null
    birth_place?: string
    birth_time_unknown?: boolean
    notes?: string
    astrological_profile?: Record<string, unknown>
  }

  if (!body.name) return res.status(400).json({ message: "name is required." })

  const recipient = await recipientService.createGiftRecipients({
    customer_id: customerId,
    name: body.name.trim(),
    relationship: body.relationship || "friend",
    dob: body.dob || null,
    birth_time: body.birth_time || null,
    birth_place: body.birth_place || null,
    birth_time_unknown: body.birth_time_unknown ?? false,
    notes: body.notes || null,
    astrological_profile: body.astrological_profile || null,
    saved_preferences: null,
  })

  return res.json({ recipient })
}
