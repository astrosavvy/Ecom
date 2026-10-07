import type { OtpChannel } from "./types"

const has = (...names: string[]) => names.every(name => Boolean(process.env[name]?.trim()))
export const mockOtpEnabled = () => process.env.NODE_ENV !== "production" && process.env.OTP_MODE === "mock"
export const expiryMinutes = () => Math.min(10, Math.max(1, Number(process.env.OTP_EXPIRY_MINUTES) || 10))
export const hourlyLimit = () => Math.max(1, Math.floor(Number(process.env.OTP_RATE_LIMIT_MAX_PER_HOUR) || 10))
export const resendSeconds = 60

export function channelEnabled(channel: OtpChannel): boolean {
  if (mockOtpEnabled()) return true
  if (channel === "email") return has("SMTP_HOST")
  if (channel === "whatsapp") return process.env.GUPSHUP_WHATSAPP_ENABLED === "true" && has(
    "GUPSHUP_WA_API_KEY", "GUPSHUP_WA_SOURCE", "GUPSHUP_WA_APP_NAME", "GUPSHUP_WA_TEMPLATE_ID"
  )
  return process.env.GUPSHUP_SMS_ENABLED === "true" && has(
    "GUPSHUP_SMS_USER_ID", "GUPSHUP_SMS_PASSWORD", "GUPSHUP_SMS_SENDER", "GUPSHUP_SMS_ENTITY_ID",
    "GUPSHUP_SMS_TEMPLATE_ID", "GUPSHUP_SMS_TEMPLATE_TEXT"
  ) && process.env.GUPSHUP_SMS_TEMPLATE_TEXT!.includes("{{otp}}")
}

export function publicOtpConfig() {
  return { channels: (["whatsapp", "sms", "email"] as OtpChannel[]).filter(channelEnabled),
    code_length: 6, expiry_seconds: expiryMinutes() * 60, resend_seconds: resendSeconds }
}
