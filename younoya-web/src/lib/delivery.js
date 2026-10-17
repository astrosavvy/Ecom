export function deliveryMessage(delivery, method = 'razorpay') {
  return delivery?.message || 'Estimated delivery 3–5 working days after dispatch.'
}
export function checkoutTotal(cart, estimate, method) {
  // Retired-method carts are requoted by the server before payment.
  const stale = cart?.metadata?.commerce_payment_method === 'cod'
  const total = !stale && Number(cart?.total) > 0 ? Number(cart.total) : estimate
  return Math.round(total * 100) / 100
}
