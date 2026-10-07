import { channelEnabled, publicOtpConfig } from "../modules/younoya-otp/config"
import { normalizePhone, resolveContact } from "../modules/younoya-otp/contact"
import { sendGupshup } from "../modules/younoya-otp/providers/gupshup"
import { requestCode, verifyCode } from "../modules/younoya-otp/flow"
import { OtpError } from "../modules/younoya-otp/types"
import { hashOtp, verifyOtp } from "../modules/younoya-otp/utils/otp"

const originalEnv = { ...process.env }
const originalFetch = global.fetch
const mobile = { identifier: "+919876543210", identifierType: "mobile" as const, channel: "whatsapp" as const }
beforeEach(() => {
  process.env = { ...originalEnv, NODE_ENV: "test", OTP_MODE: "live", JWT_SECRET: "unit-test-only-secret" }
  for (const name of Object.keys(process.env)) if (name.startsWith("GUPSHUP_")) delete process.env[name]
  Object.assign(process.env, { GUPSHUP_WHATSAPP_ENABLED: "true", GUPSHUP_WA_API_KEY: "test-private-key",
    GUPSHUP_WA_SOURCE: "919999999999", GUPSHUP_WA_APP_NAME: "unit-test", GUPSHUP_WA_TEMPLATE_ID: "approved-test-id",
    GUPSHUP_SMS_ENABLED: "true", GUPSHUP_SMS_USER_ID: "123", GUPSHUP_SMS_PASSWORD: "test-private-password",
    GUPSHUP_SMS_SENDER: "TESTID", GUPSHUP_SMS_ENTITY_ID: "1", GUPSHUP_SMS_TEMPLATE_ID: "2",
    GUPSHUP_SMS_TEMPLATE_TEXT: "Your code is {{otp}}." })
  global.fetch = jest.fn()
})
afterEach(() => { process.env = { ...originalEnv }; global.fetch = originalFetch })

test("normalizes India phone formats and rejects foreign or malformed numbers", () => {
  for (const number of ["9876543210", "+91 98765 43210", "919876543210"]) expect(normalizePhone(number)).toBe(mobile.identifier)
  for (const number of ["+19876543210", "1234567890", "phone9876543210", "+91+9876543210"]) expect(normalizePhone(number)).toBeNull()
  expect(() => resolveContact({ phone: "9876543210", email: "qa@example.invalid" })).toThrow(OtpError)
})
test("config exposes only enabled channels and timing; production cannot enable mock", () => {
  process.env.GUPSHUP_SMS_ENABLED = "false"
  expect(publicOtpConfig().channels).not.toContain("sms")
  delete process.env.GUPSHUP_WA_API_KEY
  expect(channelEnabled("whatsapp")).toBe(false)
  process.env.NODE_ENV = "production"; process.env.OTP_MODE = "mock"
  expect(channelEnabled("whatsapp")).toBe(false)
  expect(JSON.stringify(publicOtpConfig())).not.toContain("test-private")
})
test("WhatsApp sends code twice in the approved template and accepts a message id", async () => {
  ;(fetch as jest.Mock).mockResolvedValue({ ok: true, text: async () => '{"status":"success","messageId":"wa-1"}' })
  expect(await sendGupshup(mobile, "123456")).toBe("wa-1")
  const [url, options] = (fetch as jest.Mock).mock.calls[0]
  expect(url).not.toContain("test-private")
  expect(options.method).toBe("POST")
  expect(options.headers.apikey).toBe("test-private-key")
  expect(JSON.parse(options.body.get("template")).params).toEqual(["123456", "123456"])
})
test("SMS credentials are in a POST body, with DLT metadata and explicit provider success", async () => {
  ;(fetch as jest.Mock).mockResolvedValue({ ok: true, text: async () => 'success | 919876543210 | sms-1' })
  expect(await sendGupshup({ ...mobile, channel: "sms" }, "123456")).toBe("sms-1")
  const [url, options] = (fetch as jest.Mock).mock.calls[0]
  expect(url).toBe("https://enterprise.smsgupshup.com/GatewayAPI/rest")
  expect(options.body.get("password")).toBe("test-private-password")
  expect(options.body.get("dltTemplateId")).toBe("2")
  expect(options.body.get("msg")).toBe("Your code is 123456.")
})
test.each(["error | 101 | rejected", "not-json", '{"status":"success"}'])("rejects invalid provider output: %s", async raw => {
  ;(fetch as jest.Mock).mockResolvedValue({ ok: true, text: async () => raw })
  await expect(sendGupshup(mobile, "123456")).rejects.toMatchObject({ status: 503 })
  await expect(sendGupshup({ ...mobile, channel: "sms" }, "123456")).rejects.toMatchObject({ status: 503 })
})
test("provider errors and timeouts are sanitized, without retrying", async () => {
  ;(fetch as jest.Mock).mockRejectedValue(new Error("test-private-password"))
  await expect(sendGupshup(mobile, "123456")).rejects.toMatchObject({ retryAfter: 60, message: expect.not.stringContaining("test-private") })
  expect(fetch).toHaveBeenCalledTimes(1)
})

test.each(["whatsapp", "sms"] as const)("%s rejection and timeout do not retry or reveal provider details", async channel => {
  ;(fetch as jest.Mock).mockResolvedValueOnce({ ok: false, text: async () => "private provider failure" })
  await expect(sendGupshup({ ...mobile, channel }, "123456")).rejects.toMatchObject({ status: 503 })
  ;(fetch as jest.Mock).mockRejectedValueOnce(new DOMException("Private transport detail", "TimeoutError"))
  await expect(sendGupshup({ ...mobile, channel }, "123456")).rejects.toMatchObject({ status: 503, retryAfter: 60 })
  expect(fetch).toHaveBeenCalledTimes(2)
})

test("development email request reserves a hashed challenge without exposing the code", async () => {
  process.env.OTP_MODE = "mock"
  const service = { reserve: jest.fn().mockResolvedValue(undefined), finish: jest.fn().mockResolvedValue(undefined) }
  const result = await requestCode(service as any, { email: "QA@example.invalid" }, "test-ip")
  expect(service.reserve).toHaveBeenCalledWith(expect.objectContaining({ identifier: "qa@example.invalid", channel: "email" }))
  expect(verifyOtp("123456", service.reserve.mock.calls[0][0].salt, service.reserve.mock.calls[0][0].hash)).toBe(true)
  expect(result).toMatchObject({ challenge_id: expect.any(String), code_length: 6 })
  expect(JSON.stringify(result)).not.toContain("123456")
  expect(fetch).not.toHaveBeenCalled()
})
test("storage failure prevents delivery and failed resend only expires its new challenge", async () => {
  const service = { reserve: jest.fn().mockRejectedValue(new Error("storage unavailable")), finish: jest.fn().mockResolvedValue(undefined) }
  await expect(requestCode(service as any, { phone: "9876543210", channel: "sms" }, "test-ip")).rejects.toThrow()
  expect(fetch).not.toHaveBeenCalled()
  service.reserve.mockResolvedValue(undefined)
  ;(fetch as jest.Mock).mockResolvedValue({ ok: false, text: async () => "private provider failure" })
  await expect(requestCode(service as any, { phone: "9876543210", channel: "sms" }, "test-ip")).rejects.toMatchObject({ status: 503 })
  expect(service.finish).toHaveBeenCalledWith(expect.any(String), null, expect.any(Date))
})
test("legacy email verify still emits a ticket and binds supplied challenges", async () => {
  const service = { consume: jest.fn().mockResolvedValue({ valid: true }) }
  const result = await verifyCode(service as any, { email: "QA@example.invalid", otp: "123456", challenge_id: "challenge-test" })
  expect(result.identifier).toBe("qa@example.invalid")
  expect(result.ticket).toBeTruthy()
  expect(service.consume).toHaveBeenCalledWith(expect.objectContaining({ challengeId: "challenge-test" }))
  await expect(verifyCode(service as any, { email: "qa@example.invalid", otp: "1234" })).rejects.toMatchObject({ status: 400 })
})
test("hash verification rejects malformed stored hashes safely", () => {
  const { hash, salt } = hashOtp("123456")
  expect(verifyOtp("123456", salt, hash)).toBe(true)
  expect(verifyOtp("654321", salt, hash)).toBe(false)
  expect(verifyOtp("123456", salt, "invalid")).toBe(false)
})
