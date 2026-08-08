import RazorpayPaymentProvider from "../modules/younoya-razorpay/service"

describe("Razorpay Payment Provider Unit Test (Task 7.4)", () => {
  let provider: RazorpayPaymentProvider

  beforeEach(() => {
    provider = new RazorpayPaymentProvider({}, {})
  })

  test("initiatePayment returns formatted test payment session", async () => {
    const session = await provider.initiatePayment({ amount: 1099, currency_code: "inr" })
    expect(session).toBeDefined()
    expect(session.id).toBeDefined()
    expect(session.data.amount).toBe(109900) // 1099 * 100 paise
  })

  test("authorizePayment returns authorized status", async () => {
    const result = await provider.authorizePayment({ id: "pay_123" })
    expect(result.status).toBe("authorized")
  })
})
