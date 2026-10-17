import test from 'node:test'
import assert from 'node:assert/strict'
import { checkoutTotal, deliveryMessage } from '../src/lib/delivery.js'
test('prepaid checkout never adds a handling fee and stale carts use the bag estimate until requoted', () => {
  assert.equal(checkoutTotal(null,1499,'razorpay'),1499)
  for (const base of [1499,4497,2698.21]) {
    const cart={total:base+49,metadata:{commerce_payment_method:'cod',cod_fee:49}}
    assert.equal(checkoutTotal(cart,base,'razorpay'),base)
    assert.equal(checkoutTotal({total:base,metadata:{commerce_payment_method:'razorpay'}},0),base)
  }
})
test('prepaid delivery keeps the server advisory and a standard fallback', () => {
  const notice={message:'Prepaid orders: same-day delivery in Delhi NCR when ordered by 6 PM, subject to courier confirmation.'}
  assert.match(deliveryMessage(notice,'razorpay'),/same-day/)
  assert.match(deliveryMessage(null),/3–5 working days/)
})
