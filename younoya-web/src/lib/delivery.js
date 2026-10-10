export function deliveryMessage(delivery, method = 'razorpay') {
  if (method === 'cod') return 'COD: estimated delivery 3–5 working days after dispatch.'
  return delivery?.message || 'Estimated delivery 3–5 working days after dispatch.'
}
export function checkoutTotal(cart, estimate, method) {
  const storedFee = cart?.metadata?.commerce_payment_method === 'cod' ? Number(cart.metadata.cod_fee || 0) : 0
  const base = Number(cart?.total) > 0 ? Number(cart.total) - storedFee : estimate
  return Math.round((base + (method === 'cod' ? 49 : 0)) * 100) / 100
}
