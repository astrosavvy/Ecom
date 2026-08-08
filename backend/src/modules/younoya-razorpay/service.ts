import { AbstractPaymentProvider } from "@medusajs/framework/utils"
import Razorpay from "razorpay"

class RazorpayPaymentProvider extends AbstractPaymentProvider {
  static identifier = "razorpay"
  private razorpay: Razorpay | null = null

  constructor(container: any, options: any) {
    super(container, options)
    const keyId = options?.key_id || process.env.RAZORPAY_KEY_ID
    const keySecret = options?.key_secret || process.env.RAZORPAY_KEY_SECRET

    if (keyId && keySecret) {
      this.razorpay = new Razorpay({
        key_id: keyId,
        key_secret: keySecret,
      })
    }
  }

  async initiatePayment(input: any): Promise<any> {
    const amountInPaise = Math.round((input.amount || 0) * 100)
    const currency = (input.currency_code || "INR").toUpperCase()

    if (this.razorpay) {
      try {
        const order: any = await this.razorpay.orders.create({
          amount: amountInPaise,
          currency,
          receipt: `rcpt_${Date.now()}`,
        })
        return { id: order.id, data: order }
      } catch (err: any) {
        console.error("Razorpay order creation failed:", err.message)
      }
    }

    return {
      id: `rzp_test_order_${Date.now()}`,
      data: {
        id: `rzp_test_order_${Date.now()}`,
        amount: amountInPaise,
        currency,
        status: "created",
      },
    }
  }

  async authorizePayment(paymentSessionData: any, context?: any): Promise<any> {
    return { status: "authorized", data: paymentSessionData }
  }

  async capturePayment(paymentSessionData: any): Promise<any> {
    return { data: paymentSessionData }
  }

  async refundPayment(input: any): Promise<any> {
    return { data: input }
  }

  async cancelPayment(paymentSessionData: any): Promise<any> {
    return { data: paymentSessionData }
  }

  async deletePayment(paymentSessionData: any): Promise<any> {
    return { data: paymentSessionData }
  }

  async getPaymentStatus(paymentSessionData: any): Promise<any> {
    return "authorized"
  }

  async retrievePayment(paymentSessionData: any): Promise<any> {
    return { data: paymentSessionData }
  }

  async updatePayment(input: any): Promise<any> {
    return { data: input.data }
  }

  async getWebhookActionAndData(data: any): Promise<any> {
    return { action: "not_supported", data: {} }
  }
}

export default RazorpayPaymentProvider
