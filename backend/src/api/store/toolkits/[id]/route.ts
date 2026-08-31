import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { getCustomerId } from "../../../utils/auth"
import { YOUNOYA_TOOLKITS_MODULE } from "../../../../modules/younoya-toolkits"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const toolkits = req.scope.resolve(YOUNOYA_TOOLKITS_MODULE) as any
  const customerId = getCustomerId(req)
  if (!customerId) return res.status(401).json({ message: "Unauthorized" })

  const list = await toolkits.listToolkits({ id: req.params.id, customer_id: customerId })
  if (!list?.length) return res.status(404).json({ message: "Toolkit not found." })

  const toolkit = list[0]
  const items = await toolkits.listToolkitItems(
    { toolkit_id: toolkit.id },
    { order: { display_order: "ASC" } }
  )

  return res.json({ toolkit, items })
}
