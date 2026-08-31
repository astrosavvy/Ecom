import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { getCustomerId } from "../../../utils/auth"
import { YOUNOYA_RECIPIENTS_MODULE } from "../../../../modules/younoya-recipients"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const recipients = req.scope.resolve(YOUNOYA_RECIPIENTS_MODULE) as any
  const customerId = getCustomerId(req)
  if (!customerId) return res.status(401).json({ message: "Unauthorized" })

  const list = await recipients.listGiftRecipients({ id: req.params.id, customer_id: customerId })
  if (!list?.length) return res.status(404).json({ message: "Recipient not found." })
  return res.json({ recipient: list[0] })
}

export async function PUT(req: MedusaRequest, res: MedusaResponse) {
  const recipientService = req.scope.resolve(YOUNOYA_RECIPIENTS_MODULE) as any
  const customerId = getCustomerId(req)
  if (!customerId) return res.status(401).json({ message: "Unauthorized" })

  const list = await recipientService.listGiftRecipients({ id: req.params.id, customer_id: customerId })
  if (!list?.length) return res.status(404).json({ message: "Recipient not found." })

  const body = (req.body ?? {}) as Record<string, unknown>
  const updates: Record<string, unknown> = { id: req.params.id }
  for (const key of ["name", "relationship", "dob", "birth_time", "birth_place", "notes"]) {
    if (body[key] !== undefined) updates[key] = body[key]
  }
  if (typeof body.birth_time_unknown === "boolean") updates.birth_time_unknown = body.birth_time_unknown
  if (body.astrological_profile) updates.astrological_profile = body.astrological_profile

  const recipient = await recipientService.updateGiftRecipients(updates)
  return res.json({ recipient })
}

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  const recipientService = req.scope.resolve(YOUNOYA_RECIPIENTS_MODULE) as any
  const customerId = getCustomerId(req)
  if (!customerId) return res.status(401).json({ message: "Unauthorized" })

  const list = await recipientService.listGiftRecipients({ id: req.params.id, customer_id: customerId })
  if (!list?.length) return res.status(404).json({ message: "Recipient not found." })

  await recipientService.deleteGiftRecipients(req.params.id)
  return res.json({ success: true, id: req.params.id })
}
