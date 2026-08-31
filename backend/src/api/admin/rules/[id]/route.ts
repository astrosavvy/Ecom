import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { YOUNOYA_TOOLKITS_MODULE } from "../../../../modules/younoya-toolkits"

export async function PUT(req: MedusaRequest, res: MedusaResponse) {
  const toolkits = req.scope.resolve(YOUNOYA_TOOLKITS_MODULE) as any
  const body = (req.body ?? {}) as Record<string, unknown>
  const updates: Record<string, unknown> = { id: req.params.id }
  for (const key of ["name", "description"]) {
    if (typeof body[key] === "string") updates[key] = body[key]
  }
  if (typeof body.priority === "number") updates.priority = body.priority
  if (typeof body.active === "boolean") updates.active = body.active
  if (body.conditions) updates.conditions = body.conditions
  if (body.actions) updates.actions = body.actions

  const rule = await toolkits.updateRecommendationRules(updates)
  return res.json({ rule })
}

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  const toolkits = req.scope.resolve(YOUNOYA_TOOLKITS_MODULE) as any
  await toolkits.deleteRecommendationRules(req.params.id)
  return res.json({ success: true, id: req.params.id })
}
