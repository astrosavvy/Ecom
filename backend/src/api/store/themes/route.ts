import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { YOUNOYA_THEMES_MODULE } from "../../../modules/younoya-themes"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const themes = req.scope.resolve(YOUNOYA_THEMES_MODULE) as any
  const list = await themes.listThemes(
    { active: true },
    { order: { sort_order: "ASC" } }
  )
  return res.json({ themes: list })
}
