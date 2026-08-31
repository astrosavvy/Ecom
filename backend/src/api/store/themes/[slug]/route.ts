import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { YOUNOYA_THEMES_MODULE } from "../../../../modules/younoya-themes"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const themes = req.scope.resolve(YOUNOYA_THEMES_MODULE) as any
  const list = await themes.listThemes({ slug: req.params.slug, active: true })
  if (!list?.length) return res.status(404).json({ message: "Theme not found." })
  
  const theme = list[0]
  const productThemes = await themes.listProductThemes(
    { theme_id: theme.id },
    { order: { priority: "ASC" } }
  )
  
  return res.json({ theme, product_ids: productThemes.map((pt: any) => pt.product_id) })
}
