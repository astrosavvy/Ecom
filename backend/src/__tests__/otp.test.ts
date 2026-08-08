import { generateOtp, hashOtp, verifyOtp, isExpired } from "../modules/younoya-otp/utils/otp"

describe("OTP Cryptographic & Utility Functions (Task 7.1)", () => {
  test("generateOtp returns a 6-digit numeric string", () => {
    const otp = generateOtp()
    expect(otp).toMatch(/^\d{6}$/)
    expect(otp.length).toBe(6)
  })

  test("hashOtp produces deterministic verification with correct salt", () => {
    const otp = "123456"
    const { hash, salt } = hashOtp(otp)
    expect(hash).toBeTruthy()
    expect(salt).toBeTruthy()
    expect(verifyOtp(otp, salt, hash)).toBe(true)
  })

  test("verifyOtp fails with incorrect OTP", () => {
    const { hash, salt } = hashOtp("123456")
    expect(verifyOtp("654321", salt, hash)).toBe(false)
  })

  test("isExpired correctly identifies past and future dates", () => {
    const pastDate = new Date(Date.now() - 1000)
    const futureDate = new Date(Date.now() + 600000)
    expect(isExpired(pastDate)).toBe(true)
    expect(isExpired(futureDate)).toBe(false)
  })
})
