import { checkRateLimit } from "../modules/younoya-otp/utils/rate-limit"

describe("OTP Rate Limiter (Task 7.2)", () => {
  const mockService = {
    listOtpRateLimits: jest.fn(),
    createOtpRateLimits: jest.fn(),
    updateOtpRateLimits: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test("allows first request when no existing record found", async () => {
    mockService.listOtpRateLimits.mockResolvedValue([])
    const result = await checkRateLimit(mockService, "test@example.com", "email", 10)
    expect(result.allowed).toBe(true)
    expect(result.remaining).toBe(9)
    expect(mockService.createOtpRateLimits).toHaveBeenCalled()
  })

  test("denies request when request_count reaches maxPerHour limit", async () => {
    mockService.listOtpRateLimits.mockResolvedValue([{ id: "rl_1", request_count: 10 }])
    const result = await checkRateLimit(mockService, "test@example.com", "email", 10)
    expect(result.allowed).toBe(false)
    expect(result.remaining).toBe(0)
    expect(mockService.updateOtpRateLimits).not.toHaveBeenCalled()
  })
})
