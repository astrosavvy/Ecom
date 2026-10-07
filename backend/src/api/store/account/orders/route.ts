import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { commerceRoute, commerceCustomer } from "../../../utils/commerce"
import { getCustomerId } from "../../../utils/auth"
export const GET = commerceRoute(async req => {
  const { data, metadata } = await (req.scope.resolve(ContainerRegistrationKeys.QUERY) as any).graph({ entity: "order",
    fields: ["id", "display_id", "created_at", "status", "total", "currency_code"], filters: { customer_id: commerceCustomer(req) },
    pagination: { take: 20, skip: Math.max(0, Math.min(100000,Number(req.query.offset) || 0)), order: { created_at: "DESC" } } })
  return { orders: data, count: metadata?.count || data.length }
})
