import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { YOUNOYA_OTP_MODULE } from "../../../modules/younoya-otp"
import { requestCode, verifyCode } from "../../../modules/younoya-otp/flow"
import { OtpError, type OtpInput } from "../../../modules/younoya-otp/types"
import type YounoyaOtpModuleService from "../../../modules/younoya-otp/service"

export async function runOtpAction(req: MedusaRequest, res: MedusaResponse, action: "request" | "verify") {
  res.setHeader("Cache-Control", "no-store")
  try {
    const service = req.scope.resolve(YOUNOYA_OTP_MODULE) as YounoyaOtpModuleService
    const input = req.body as OtpInput
    // Use the framework's trusted proxy handling, never a caller-supplied forwarding header.
    const result = action === "request" ? await requestCode(service, input, req.ip || "unknown") : await verifyCode(service, input)
    return res.json(result)
  } catch (error) {
    const issue = error instanceof OtpError ? error : new OtpError("Verification is temporarily unavailable. Please try again shortly.")
    if (issue.retryAfter) res.setHeader("Retry-After", String(issue.retryAfter))
    return res.status(issue.status).json({ message: issue.message, ...(issue.retryAfter ? { retry_after: issue.retryAfter } : {}) })
  }
}
