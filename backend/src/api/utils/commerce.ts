import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { CommerceError } from "../../modules/younoya-commerce/db"
import { getCustomerId } from "./auth"
export function commerceCustomer(req: MedusaRequest) {
  const id = getCustomerId(req)
  if (!id) throw new CommerceError("Sign in to continue",401)
  return id
}
export function commerceRoute(handler: (req: MedusaRequest<any>) => Promise<any>) {
  return async (req: MedusaRequest<any>, res: MedusaResponse) => {
    res.setHeader("Cache-Control","no-store")
    try { return res.json(await handler(req)) }
    catch (error) { return res.status(error instanceof CommerceError ? error.status : 503).json({
      message: error instanceof CommerceError ? error.message : "This service is temporarily unavailable. Your order and selection are preserved." }) }
  }
}
