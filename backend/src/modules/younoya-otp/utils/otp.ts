import crypto from "crypto"

export function generateOtp(): string {
  return crypto.randomInt(100000, 1000000).toString()
}

export function hashOtp(otp: string): { hash: string; salt: string } {
  const salt = crypto.randomBytes(16).toString("hex")
  const hash = crypto.pbkdf2Sync(otp, salt, 100000, 64, "sha512").toString("hex")
  return { hash, salt }
}

export function verifyOtp(otp: string, salt: string, storedHash: string): boolean {
  const hash = crypto.pbkdf2Sync(otp, salt, 100000, 64, "sha512").toString("hex")
  const expected = Buffer.from(storedHash, "hex")
  const candidate = Buffer.from(hash, "hex")
  return expected.length === candidate.length && crypto.timingSafeEqual(candidate, expected)
}

export function isExpired(expiresAt: Date): boolean {
  return new Date() > new Date(expiresAt)
}
