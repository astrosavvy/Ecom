import crypto from "crypto"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

const fetchPayment = jest.fn()
jest.mock("razorpay", () => ({ __esModule: true, default: jest.fn().mockImplementation(() => ({ payments: { fetch: fetchPayment } })) }))
import { POST } from "../api/store/gift-guide/payment-confirm/route"

function response() {
  const res: any = { code: 200, body: null }
  res.status = (code: number) => { res.code = code; return res }
  res.json = (body: any) => { res.body = body; return res }
  return res
}

describe("payment confirmation", () => {
  const secret = "checkout-test-secret"
  beforeEach(() => { process.env.RAZORPAY_KEY_ID = "rzp_test_only"; process.env.RAZORPAY_KEY_SECRET = secret; fetchPayment.mockReset() })
  afterAll(() => { delete process.env.RAZORPAY_KEY_ID; delete process.env.RAZORPAY_KEY_SECRET })

  test("the same verified callback is safe to repeat, but a different payment is rejected", async () => {
    const session: any = { id: "ps_1", provider_id: "pp_razorpay_razorpay", payment_collection_id: "paycol_1",
      amount: 249900, currency_code: "inr", data: { id: "order_1" } }
    const update = jest.fn(async ({ data }: any) => { session.data = data })
    const req: any = { auth_context: { actor_id: "cus_1" }, body: { cartId: "cart_1", sessionId: "ps_1",
      razorpay_order_id: "order_1", razorpay_payment_id: "pay_1",
      razorpay_signature: crypto.createHmac("sha256", secret).update("order_1|pay_1").digest("hex") },
      scope: { resolve: (key: string) => key === ContainerRegistrationKeys.QUERY
        ? { graph: async () => ({ data: [{ id: "cart_1", customer_id: "cus_1", total: 249900,
          currency_code: "inr", shipping_address: { country_code: "in" }, payment_collection: { id: "paycol_1" } }] }) }
        : { retrievePaymentSession: async () => session, updatePaymentSession: update } } }
    fetchPayment.mockResolvedValue({ order_id: "order_1", amount: 249900, currency: "INR", status: "captured" })
    expect((await POST(req, response()) as any).body).toEqual({ verified: true })
    expect((await POST(req, response()) as any).body).toEqual({ verified: true })
    expect(update).toHaveBeenCalledTimes(1)
    req.body.razorpay_payment_id = "pay_2"
    req.body.razorpay_signature = crypto.createHmac("sha256", secret).update("order_1|pay_2").digest("hex")
    const rejected = await POST(req, response()) as any
    expect(rejected.code).toBe(409)
  })

  test("failed gateway status cannot confirm an order", async () => {
    const req: any = { auth_context: { actor_id: "cus_1" }, body: { cartId: "cart_1", sessionId: "ps_1",
      razorpay_order_id: "order_1", razorpay_payment_id: "pay_1",
      razorpay_signature: crypto.createHmac("sha256", secret).update("order_1|pay_1").digest("hex") },
      scope: { resolve: (key: string) => key === ContainerRegistrationKeys.QUERY
        ? { graph: async () => ({ data: [{ customer_id: "cus_1", total: 10000, currency_code: "inr",
          shipping_address: { country_code: "in" }, payment_collection: { id: "paycol_1" } }] }) }
        : { retrievePaymentSession: async () => ({ id: "ps_1", provider_id: "pp_razorpay_razorpay",
          payment_collection_id: "paycol_1", amount: 10000, data: { id: "order_1" } }) } } }
    fetchPayment.mockResolvedValue({ order_id: "order_1", amount: 10000, currency: "INR", status: "failed" })
    const rejected = await POST(req, response()) as any
    expect(rejected.code).toBe(400)
  })
})
