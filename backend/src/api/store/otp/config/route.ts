import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { publicOtpConfig } from "../../../../modules/younoya-otp/config"

export async function GET(_req: MedusaRequest, res: MedusaResponse) {
  res.setHeader("Cache-Control", "no-store")
  return res.json(publicOtpConfig())
}
