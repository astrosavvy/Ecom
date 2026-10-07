import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { runOtpAction } from "../respond"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  return runOtpAction(req, res, "verify")
}
