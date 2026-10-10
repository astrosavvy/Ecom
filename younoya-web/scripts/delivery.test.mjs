import test from 'node:test'
import assert from 'node:assert/strict'
import { checkoutTotal, deliveryMessage } from '../src/lib/delivery.js'
test('method toggles use one fixed charge without retaining the previous cart fee', () => {
  assert.equal(checkoutTotal(null,1499,'cod'),1548)
  for (const base of [1499,4497,2698.21]) {
    const cart={total:base+49,metadata:{commerce_payment_method:'cod',cod_fee:49}}
    assert.equal(checkoutTotal(cart,0,'cod'),Math.round((base+49)*100)/100)
    assert.equal(checkoutTotal(cart,0,'razorpay'),base)
  }
})
test('COD never displays the prepaid same-day advisory', () => {
  const notice={message:'Prepaid orders: same-day delivery in Delhi NCR when ordered by 6 PM, subject to courier confirmation.'}
  assert.match(deliveryMessage(notice,'razorpay'),/same-day/)
  assert.doesNotMatch(deliveryMessage(notice,'cod'),/same-day/)
  assert.match(deliveryMessage(notice,'cod'),/3–5 working days/)
})
