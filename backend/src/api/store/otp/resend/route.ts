import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { POST as requestOtp } from "../request/route"

// resend delegates to the request handler (rate limits apply there)
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  return requestOtp(req, res)
}
