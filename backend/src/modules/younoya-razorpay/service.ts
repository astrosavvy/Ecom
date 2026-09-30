import crypto from "crypto"
import { AbstractPaymentProvider, PaymentActions, PaymentSessionStatus } from "@medusajs/framework/utils"
import Razorpay from "razorpay"

export function validRazorpaySignature(orderId: string, paymentId: string, signature: string, secret: string) {
  const expected = crypto.createHmac("sha256", secret).update(`${orderId}|${paymentId}`).digest("hex")
  return /^[0-9a-f]{64}$/i.test(signature) && crypto.timingSafeEqual(Buffer.from(expected, "hex"), Buffer.from(signature, "hex"))
}

class RazorpayPaymentProvider extends AbstractPaymentProvider {
  static identifier = "razorpay"
  private razorpay: Razorpay | null = null
  private secret: string

  constructor(container: any, options: any) {
    super(container, options)
    const keyId = options?.key_id || process.env.RAZORPAY_KEY_ID
    this.secret = options?.key_secret || process.env.RAZORPAY_KEY_SECRET || ""
    if (keyId && this.secret) this.razorpay = new Razorpay({ key_id: keyId, key_secret: this.secret })
  }

  private client() {
    if (!this.razorpay) throw new Error("Razorpay is not configured")
    return this.razorpay
  }

  async initiatePayment(input: any): Promise<any> {
    const amount = Number(input.amount)
    if (!Number.isInteger(amount) || amount < 100 || input.currency_code?.toLowerCase() !== "inr") {
      throw new Error("Invalid INR payment amount")
    }
    const sessionId = String(input.data?.session_id ?? input.context?.idempotency_key ?? "")
    const order: any = await this.client().orders.create({
      amount, currency: "INR", receipt: sessionId.slice(0, 40), notes: { medusa_session_id: sessionId },
    })
    return { id: order.id, data: { id: order.id, amount, currency: "INR", session_id: sessionId } }
  }

  async authorizePayment(input: any): Promise<any> {
    const data = input.data ?? input
    const orderId = String(data.id ?? "")
    const paymentId = String(data.razorpay_payment_id ?? "")
    const signature = String(data.razorpay_signature ?? "")
    if (!orderId || !paymentId || !this.secret || !validRazorpaySignature(orderId, paymentId, signature, this.secret)) {
      return { status: PaymentSessionStatus.ERROR, data }
    }
    const payment: any = await this.client().payments.fetch(paymentId)
    if (payment.order_id !== orderId || Number(payment.amount) !== Number(data.amount) || payment.currency !== "INR") {
      return { status: PaymentSessionStatus.ERROR, data }
    }
    const status = payment.status === "captured" ? PaymentSessionStatus.CAPTURED
      : payment.status === "authorized" ? PaymentSessionStatus.AUTHORIZED : PaymentSessionStatus.ERROR
    return { status, data: { ...data, razorpay_payment_id: paymentId } }
  }

  async getPaymentStatus(input: any): Promise<any> {
    const data = input.data ?? input
    if (!data.razorpay_payment_id) return PaymentSessionStatus.PENDING
    const payment: any = await this.client().payments.fetch(data.razorpay_payment_id)
    return payment.status === "captured" ? PaymentSessionStatus.CAPTURED
      : payment.status === "authorized" ? PaymentSessionStatus.AUTHORIZED : PaymentSessionStatus.ERROR
  }

  async capturePayment(input: any): Promise<any> {
    const data = input.data ?? input
    if (!data.razorpay_payment_id) throw new Error("Missing Razorpay payment")
    const payment: any = await this.client().payments.fetch(data.razorpay_payment_id)
    if (payment.status !== "captured") await this.client().payments.capture(data.razorpay_payment_id, payment.amount, "INR")
    return { data }
  }

  async refundPayment(input: any): Promise<any> {
    const data = input.data ?? input
    if (!data.razorpay_payment_id) throw new Error("Missing Razorpay payment")
    await this.client().payments.refund(data.razorpay_payment_id, { amount: Number(input.amount) })
    return { data }
  }

  async cancelPayment(input: any): Promise<any> { return { data: input.data ?? input } }
  async deletePayment(input: any): Promise<any> { return { data: input.data ?? input } }
  async retrievePayment(input: any): Promise<any> { return { data: input.data ?? input } }
  async updatePayment(input: any): Promise<any> { return { data: input.data ?? input } }

  async getWebhookActionAndData(input: any): Promise<any> {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET
    const raw = input.rawData
    const signature = String(input.headers?.["x-razorpay-signature"] ?? "")
    if (!secret || !raw || !/^[0-9a-f]{64}$/i.test(signature)) return { action: PaymentActions.NOT_SUPPORTED }
    const expected = crypto.createHmac("sha256", secret).update(raw).digest("hex")
    if (!crypto.timingSafeEqual(Buffer.from(expected, "hex"), Buffer.from(signature, "hex"))) return { action: PaymentActions.NOT_SUPPORTED }
    const event = input.data ?? {}
    const payment = event.payload?.payment?.entity
    if (!payment?.id || !payment?.order_id || !payment?.amount || payment.currency !== "INR") {
      return { action: PaymentActions.NOT_SUPPORTED }
    }
    // Razorpay attaches notes to the order, not reliably to its payment entity.
    const order: any = await this.client().orders.fetch(payment.order_id)
    const sessionId = order.notes?.medusa_session_id
    if (!sessionId || Number(order.amount) !== Number(payment.amount)) return { action: PaymentActions.NOT_SUPPORTED }
    const action = event.event === "payment.captured" ? PaymentActions.SUCCESSFUL
      : event.event === "payment.authorized" ? PaymentActions.AUTHORIZED
      : event.event === "payment.failed" ? PaymentActions.FAILED : PaymentActions.NOT_SUPPORTED
    return { action, data: { session_id: sessionId, amount: Number(payment.amount) } }
  }
}

export default RazorpayPaymentProvider
