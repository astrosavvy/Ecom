import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { YOUNOYA_THEMES_MODULE } from "../../../modules/younoya-themes"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const themes = req.scope.resolve(YOUNOYA_THEMES_MODULE) as any
  const [list, count] = await themes.listAndCountThemes(
    {},
    { order: { sort_order: "ASC" } }
  )
  return res.json({ themes: list, count })
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const themes = req.scope.resolve(YOUNOYA_THEMES_MODULE) as any
  const body = (req.body ?? {}) as {
    name?: string; slug?: string; description?: string;
    icon?: string; category?: string; sort_order?: number
  }
  if (!body.name) return res.status(400).json({ message: "name is required." })

  const slug = body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
  const theme = await themes.createThemes({
    name: body.name.trim(),
    slug,
    description: body.description || null,
    icon: body.icon || "✦",
    category: body.category || "lifestyle",
    sort_order: body.sort_order ?? 0,
    active: true,
  })
  return res.json({ theme })
}
