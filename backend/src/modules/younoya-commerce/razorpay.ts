import crypto from "crypto"
import { AsyncLocalStorage } from "async_hooks"
import { CommerceError, database, enqueue, finish, operationId, minor, transaction, exclusive } from "./db"
import { ProviderError } from "./shiprocket"
export const refundContext = new AsyncLocalStorage<string>()
export async function razorpayRequest(path: string, method = "GET", body?: any, idempotency?: string) {
  const keyId = process.env.RAZORPAY_KEY_ID || process.env.key_id
  const keySecret = process.env.RAZORPAY_KEY_SECRET || process.env.key_secret
  if (!keyId || !keySecret) throw new CommerceError("Payments are not configured.", 503)
  try {
    const response = await fetch(`https://api.razorpay.com/v1${path}`, { method, signal: AbortSignal.timeout(12000),
      headers: { "Content-Type": "application/json", Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}`,
        ...(idempotency ? { "X-Refund-Idempotency": idempotency } : {}) }, ...(body ? { body: JSON.stringify(body) } : {}) })
    if (!response.ok) throw new ProviderError(response.status >= 500 || [408,409,429].includes(response.status))
    const data = await response.json()
    if (!data || typeof data !== "object" || data.error) throw new ProviderError(true)
    return data
  } catch (error) { if (error instanceof ProviderError) throw error; throw new ProviderError(true) }
}
export async function refundOnce(paymentId: string, amount: unknown, key: string) {
  return exclusive(`refund:${paymentId}`,() => refundLocked(paymentId,amount,key))
}
async function refundLocked(paymentId: string, amount: unknown, key: string) {
  if (!/^pay_[a-zA-Z0-9]+$/.test(paymentId) || !key) throw new CommerceError("Invalid refund")
  const value = minor(amount)
  if (value <= 0) throw new CommerceError("Refund must be positive")
  const id = await enqueue("razorpay_refund", `refund:${key}`, { paymentId, amount: value })
  const row = (await database().query("select * from commerce_operation where id=$1", [id])).rows[0]
  if (row.payload.paymentId !== paymentId || row.payload.amount !== value) throw new CommerceError("Refund request changed", 409)
  if (row.result?.id) return row.result
  const payment = await razorpayRequest(`/payments/${paymentId}`)
  if (payment.currency !== "INR" || payment.status !== "captured" || value > minor(payment.amount)) throw new CommerceError("Invalid captured refund amount")
  if (value > minor(payment.amount)-minor(payment.amount_refunded || 0)) {
    // A response lost after acceptance may already be included in amount_refunded; the same key is safe to reconcile.
    if (!row.error) throw new CommerceError("Refund exceeds the remaining captured amount")
  }
  try {
    const result = await razorpayRequest(`/payments/${paymentId}/refund`, "POST", { amount: value, speed: "normal", receipt: id }, id)
    if (!result.id || result.payment_id !== paymentId || minor(result.amount) !== value || !["pending","processed","failed"].includes(result.status)) throw new ProviderError(true)
    await finish(id, result); return result
  } catch (error) { await finish(id, {}, "held", "Refund requires reconciliation with its original idempotency key."); throw error }
}
export function verifyWebhook(raw: string | Buffer | undefined, signature: string) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET
  if (!secret || !raw || !/^[a-f\d]{64}$/i.test(signature)) return false
  const expected = crypto.createHmac("sha256", secret).update(raw).digest()
  return crypto.timingSafeEqual(expected, Buffer.from(signature, "hex"))
}
export async function persistedOrder(sessionId: string, amount: number, create: () => Promise<any>, list: () => Promise<any[]>) {
  if (!sessionId) throw new CommerceError("Missing payment session")
  const id = await enqueue("razorpay_order", `razorpay-order:${sessionId}`, { sessionId, amount })
  const decision = await transaction(id, async client => {
    const row = (await client.query("select * from commerce_operation where id=$1 for update", [id])).rows[0]
    if (row.payload.amount !== amount) throw new CommerceError("Payment amount changed; create a fresh session", 409)
    if (row.result?.id) return { result: row.result }
    if (row.status !== "queued") return { reconcile: true }
    await client.query("update commerce_operation set status='processing',updated_at=now() where id=$1", [id])
    return { reconcile: false }
  })
  if (decision.result) return decision.result
  if (decision.reconcile) {
    const existing = (await list()).filter(order => order.notes?.medusa_session_id === sessionId && minor(order.amount) === amount && order.currency === "INR")
    if (existing.length !== 1) throw new CommerceError("Payment preparation is awaiting reconciliation. Please contact the atelier before retrying.", 409)
    await finish(id, existing[0]); return existing[0]
  }
  try {
    const result = await create()
    if (!result.id || minor(result.amount) !== amount || result.currency !== "INR") throw new ProviderError(true)
    await finish(id,result); return result
  } catch (error) { await finish(id, {}, "held", "Payment preparation requires reconciliation."); throw error }
}
