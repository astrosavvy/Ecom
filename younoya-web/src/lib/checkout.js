import { storeRequest } from './giftGuideApi'

const PENDING_KEY = 'yn_pending_payment'
export const checkoutAccess = cartId => ({ checkoutToken: sessionStorage.getItem(`yn_guest_${cartId}`) || undefined })
export function getPendingPayment() {
  try { return JSON.parse(sessionStorage.getItem(PENDING_KEY)) } catch { return null }
}

export async function createCheckoutCart(offer, bag, customer) {
  const { regions } = await storeRequest('/store/regions')
  const region = regions?.find(item => item.currency_code === 'inr' && item.countries?.some(country => country.iso_2 === 'in'))
  if (!region) throw new Error('India checkout is not configured')
  const items = offer ? [{ variantId: offer.variantId, quantity: 1 }] : await Promise.all(bag.map(async item => {
    const data = await storeRequest(`/store/products?handle=${encodeURIComponent(item.handle || item.id)}&region_id=${encodeURIComponent(region.id)}`)
    const product = data.products?.find(product => product.handle === (item.handle || item.id))
    const variantId = product?.variants?.[0]?.id
    if (!variantId) throw new Error(`${item.name || item.handle} is not available for checkout yet`)
    return { variantId, quantity: item.quantity }
  }))
  if (!items.length) throw new Error('Your bag is empty')
  if (!customer) {
    const result = await storeRequest('/store/commerce/guest-cart', { body: { region_id: region.id, items: items.map(i => ({variant_id:i.variantId,quantity:i.quantity})) } })
    sessionStorage.setItem(`yn_guest_${result.cart.id}`, result.checkout_token)
    return result.cart
  }
  const { cart } = await storeRequest('/store/carts', { auth: true, body: { region_id: region.id, metadata: { money_unit: 'inr-major-v2' }, ...(customer.email ? { email: customer.email } : {}) } })
  for (const item of items) await storeRequest(`/store/carts/${cart.id}/line-items`, { body: { variant_id: item.variantId, quantity: item.quantity } })
  return (await storeRequest(`/store/carts/${cart.id}`)).cart
}

export async function preparePayment(cartId, address, note, promo, policyRevision) {
  await storeRequest(`/store/carts/${cartId}`, { body: {
    email: address.email, metadata: { gift_note: note.slice(0, 180) },
    shipping_address: { first_name: address.firstName, last_name: address.lastName, address_1: address.street,
      address_2: address.street2 || '',
      city: address.city, province: address.state, postal_code: address.pincode, country_code: 'in', phone: address.phone },
  } })
  if (promo.trim()) await storeRequest(`/store/carts/${cartId}/promotions`, { body: { promo_codes: [promo.trim()] } })
  const delivery = await storeRequest('/store/commerce/prepare', { ...checkoutAccess(cartId), body: { cart_id: cartId, policy_revision: policyRevision } })
  const { shipping_options: options } = await storeRequest(`/store/shipping-options?cart_id=${encodeURIComponent(cartId)}`)
  const option = options?.find(item => item.id === delivery.shipping_option_id)
  if (!option || Number(option.amount) !== 0) throw new Error('Free India delivery is not available for this selection')
  await storeRequest(`/store/carts/${cartId}/shipping-methods`, { body: { option_id: option.id } })
  const { cart } = await storeRequest(`/store/carts/${cartId}`)
  if (!cart?.total || cart.currency_code !== 'inr') throw new Error('Could not calculate an INR order total')
  const { payment_collection: collection } = cart.payment_collection
    ? { payment_collection: cart.payment_collection }
    : await storeRequest('/store/payment-collections', { body: { cart_id: cartId } })
  const { payment_providers: providers } = await storeRequest(`/store/payment-providers?region_id=${encodeURIComponent(cart.region_id)}`)
  const razorpay = providers?.find(provider => provider.id.includes('razorpay'))
  if (!razorpay) throw new Error('Razorpay is not available for this region')
  const payment = await storeRequest(`/store/payment-collections/${collection.id}/payment-sessions`, { ...checkoutAccess(cartId), body: { provider_id: razorpay.id } })
  const session = payment.payment_collection?.payment_sessions?.find(item => item.provider_id === razorpay.id)
  if (!session?.data?.id) throw new Error('Could not prepare a secure payment session')
  return { cart, session }
}

let razorpayLoading
function loadRazorpay() {
  if (window.Razorpay) return Promise.resolve()
  if (razorpayLoading) return razorpayLoading
  razorpayLoading = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'; script.async = true
    const timeout = setTimeout(() => { script.remove(); reject(new Error('Payment window took too long to load')) }, 12000)
    script.onload = () => { clearTimeout(timeout); window.Razorpay ? resolve() : reject(new Error('Payment window is unavailable')) }
    script.onerror = () => { clearTimeout(timeout); script.remove(); reject(new Error('Payment window could not load')) }
    document.head.appendChild(script)
  }).catch(error => { razorpayLoading = null; throw error })
  return razorpayLoading
}

export async function launchPayment(cart, session, address) {
  const pending = getPendingPayment()
  if (pending && (pending.cartId !== cart.id || pending.session?.id !== session.id)) {
    throw new Error('A payment is awaiting confirmation. Please complete that order before starting another.')
  }
  let receipt = pending?.receipt
  if (!receipt) {
    const { razorpayKeyId } = await storeRequest('/store/gift-guide/checkout-config')
    if (!razorpayKeyId) throw new Error('Razorpay is not configured yet')
    await loadRazorpay()
    sessionStorage.setItem(PENDING_KEY, JSON.stringify({ cartId: cart.id, session }))
    receipt = await new Promise((resolve, reject) => {
      const checkout = new window.Razorpay({ key: razorpayKeyId, order_id: session.data.id,
        amount: Number(session.data.amount), currency: 'INR', name: 'YOUNOYA', description: 'A gift chosen with intention',
        prefill: { name: `${address.firstName} ${address.lastName}`, email: address.email, contact: address.phone },
        theme: { color: '#935632' }, handler: resolve,
        modal: { ondismiss: () => reject(new Error('Payment was cancelled. Your bag is still here.')) },
      })
      checkout.on('payment.failed', event => reject(new Error(event.error?.description || 'Payment did not complete')))
      checkout.open()
    })
    sessionStorage.setItem(PENDING_KEY, JSON.stringify({ cartId: cart.id, session, receipt }))
  }
  const confirmed = await storeRequest('/store/gift-guide/payment-confirm', { body: { cartId: cart.id, sessionId: session.id, ...receipt }, ...checkoutAccess(cart.id) })
  let order = confirmed?.order
  if (!order) {
    try {
      const completed = await storeRequest(`/store/carts/${cart.id}/complete`, { method: 'POST', ...checkoutAccess(cart.id) })
      if (completed.type === 'order' && completed.order?.id) order = completed.order
    } catch {
      const status = await storeRequest(`/store/gift-guide/payment-confirm?cartId=${encodeURIComponent(cart.id)}`, checkoutAccess(cart.id))
      if (status?.completed && status.order?.id) order = status.order
    }
  }
  if (!order?.id) throw new Error('Payment was verified, but order confirmation is pending. Please contact the atelier before trying again.')
  sessionStorage.removeItem(PENDING_KEY)
  return order
}
