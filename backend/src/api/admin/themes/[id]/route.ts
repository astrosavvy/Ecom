import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { YOUNOYA_THEMES_MODULE } from "../../../../modules/younoya-themes"

export async function PUT(req: MedusaRequest, res: MedusaResponse) {
  const themes = req.scope.resolve(YOUNOYA_THEMES_MODULE) as any
  const body = (req.body ?? {}) as Record<string, unknown>
  const updates: Record<string, unknown> = { id: req.params.id }
  for (const key of ["name", "slug", "description", "icon", "category"]) {
    if (typeof body[key] === "string") updates[key] = body[key]
  }
  if (typeof body.sort_order === "number") updates.sort_order = body.sort_order
  if (typeof body.active === "boolean") updates.active = body.active

  const theme = await themes.updateThemes(updates)
  return res.json({ theme })
}

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  const themes = req.scope.resolve(YOUNOYA_THEMES_MODULE) as any
  await themes.deleteThemes(req.params.id)
  return res.json({ success: true, id: req.params.id })
}
