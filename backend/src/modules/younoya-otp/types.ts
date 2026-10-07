export type OtpChannel = "email" | "whatsapp" | "sms"
export type OtpContact = { identifier: string; identifierType: "email" | "mobile"; channel: OtpChannel }
export type OtpInput = { email?: string; phone?: string; channel?: string; otp?: string; challenge_id?: string }
export type OtpReservation = OtpContact & {
  id: string; hash: string; salt: string; ip: string; now: Date; expiresAt: Date; hourlyLimit: number
}
export type OtpVerification = OtpContact & { otp: string; challengeId?: string; now: Date }
export type OtpCheck = { valid: boolean; message?: string }

export class OtpError extends Error {
  constructor(message: string, public status = 503, public retryAfter?: number) { super(message) }
}
