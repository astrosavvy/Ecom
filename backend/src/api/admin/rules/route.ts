import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { YOUNOYA_TOOLKITS_MODULE } from "../../../modules/younoya-toolkits"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const toolkits = req.scope.resolve(YOUNOYA_TOOLKITS_MODULE) as any
  const [rules, count] = await toolkits.listAndCountRecommendationRules(
    {},
    { order: { priority: "DESC" } }
  )
  return res.json({ rules, count })
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const toolkits = req.scope.resolve(YOUNOYA_TOOLKITS_MODULE) as any
  const body = (req.body ?? {}) as {
    name?: string; description?: string; priority?: number;
    conditions?: Record<string, unknown>; actions?: Record<string, unknown>
  }
  if (!body.name || !body.conditions || !body.actions) {
    return res.status(400).json({ message: "name, conditions and actions are required." })
  }

  const rule = await toolkits.createRecommendationRules({
    name: body.name.trim(),
    description: body.description || null,
    priority: body.priority ?? 0,
    active: true,
    conditions: body.conditions,
    actions: body.actions,
    version: 1,
  })
  return res.json({ rule })
}
