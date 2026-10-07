import crypto from "crypto"
import jwt from "jsonwebtoken"
import { expiryMinutes, hourlyLimit, mockOtpEnabled, resendSeconds } from "./config"
import { resolveContact } from "./contact"
import { sendGupshup } from "./providers/gupshup"
import { sendEmailCode } from "./providers/email"
import { generateOtp, hashOtp } from "./utils/otp"
import { OtpError, type OtpInput } from "./types"
import type YounoyaOtpModuleService from "./service"

export async function requestCode(service: YounoyaOtpModuleService, input: OtpInput, ip: string) {
  const contact = resolveContact(input)
  const minutes = expiryMinutes()
  const otp = mockOtpEnabled() ? "123456" : generateOtp()
  const { hash, salt } = hashOtp(otp)
  const id = `otpch_${crypto.randomUUID()}`
  const now = new Date()
  await service.reserve({ ...contact, id, hash, salt, ip, now,
    expiresAt: new Date(now.getTime() + minutes * 60000), hourlyLimit: hourlyLimit() })
  try {
    const messageId = mockOtpEnabled() ? "development-mock" : contact.channel === "email"
      ? await sendEmailCode(contact.identifier, otp, minutes) : await sendGupshup(contact, otp)
    const expiresAt = new Date(Date.now() + minutes * 60000)
    await service.finish(id, messageId, expiresAt)
    return { success: true, challenge_id: id, identifier_type: contact.identifierType, channel: contact.channel,
      code_length: 6, expires_at: expiresAt.toISOString(), resend_at: new Date(now.getTime() + resendSeconds * 1000).toISOString(),
      message: "Your verification code has been requested." }
  } catch (error) {
    await service.finish(id, null, new Date()).catch(() => undefined)
    throw error
  }
}

export async function verifyCode(service: YounoyaOtpModuleService, input: OtpInput) {
  const contact = resolveContact(input, false)
  if (typeof input.otp !== "string" || !/^\d{6}$/.test(input.otp)) throw new OtpError("Enter the six-digit code.", 400)
  if (input.challenge_id !== undefined && (typeof input.challenge_id !== "string" || input.challenge_id.length > 100)) {
    throw new OtpError("Invalid verification request.", 400)
  }
  if (!process.env.JWT_SECRET) throw new OtpError("Login is temporarily unavailable.")
  const result = await service.consume({ ...contact, otp: input.otp, challengeId: input.challenge_id, now: new Date() })
  if (!result.valid) throw new OtpError(result.message!, 400)
  const ticket = jwt.sign({ purpose: "otp-login", identifier: contact.identifier,
    identifier_type: contact.identifierType, jti: crypto.randomBytes(16).toString("hex") },
    process.env.JWT_SECRET, { expiresIn: "10m" })
  return { success: true, ticket, identifier: contact.identifier, identifier_type: contact.identifierType }
}
