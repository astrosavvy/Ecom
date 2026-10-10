import { useEffect, useRef, useState } from 'react'
import { storeRequest } from '../../lib/giftGuideApi'

export default function CheckoutFields({ address, onChange, locked, onDelivery }) {
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)
  const change = useRef(onChange)
  change.current = onChange
  const delivery = useRef(onDelivery)
  delivery.current = onDelivery
  const filledPin = useRef('')

  // Auto-fetch City and State when 6-digit Indian PIN code is typed
  useEffect(() => {
    if (locked || !/^[1-9]\d{5}$/.test(address.pincode)) {
      setStatus('')
      setLoading(false)
      return
    }
    const controller = new AbortController()
    setLoading(true)
    setStatus('')
    delivery.current?.(null)
    const lookup = () => storeRequest(`/store/commerce/pincode?pincode=${address.pincode}`, { signal: controller.signal })
      .then(result => {
        if (controller.signal.aborted) return
        if (filledPin.current !== address.pincode) { change.current('city', result.city); change.current('state', result.state); filledPin.current = address.pincode }
        delivery.current?.(result.delivery)
      })
      .catch(error => {
        if (!controller.signal.aborted) {
          delivery.current?.(null)
          setStatus(error.message === 'Failed to fetch' ? 'Enter city and state below.' : (error.message || ''))
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })
    lookup(); const timer = setInterval(lookup,60000)
    return () => { controller.abort(); clearInterval(timer) }
  }, [address.pincode, locked])

  return (
    <section className="checkout-card checkout-address-card" aria-label="Shipping Address">
      <h2 className="checkout-card__title">Shipping Address</h2>

      <div className="checkout-fields-grid">
        {/* Full Name */}
        <label className="checkout-field checkout-field--full">
          <span className="checkout-field__label">Full Name <span className="req-dot">*</span></span>
          <input
            required
            type="text"
            value={address.firstName || ''}
            autoComplete="name"
            readOnly={locked}
            placeholder="e.g. Alex Johnson"
            onChange={e => onChange('firstName', e.target.value)}
          />
        </label>

        {/* Email Address */}
        <label className="checkout-field">
          <span className="checkout-field__label">Email Address <span className="req-dot">*</span></span>
          <input
            required
            type="email"
            value={address.email || ''}
            autoComplete="email"
            readOnly={locked}
            placeholder="patron@domain.com"
            onChange={e => onChange('email', e.target.value)}
          />
        </label>

        {/* Phone Number */}
        <label className="checkout-field">
          <span className="checkout-field__label">Phone Number <span className="req-dot">*</span></span>
          <input
            required
            type="tel"
            pattern="[0-9+\s\(\)\-]{10,18}"
            value={address.phone || ''}
            autoComplete="tel"
            readOnly={locked}
            placeholder="+91 98765 43210"
            onChange={e => onChange('phone', e.target.value)}
          />
        </label>

        {/* Street Address */}
        <label className="checkout-field checkout-field--full">
          <span className="checkout-field__label">Street Address <span className="req-dot">*</span></span>
          <input
            required
            type="text"
            value={address.street || ''}
            autoComplete="address-line1"
            readOnly={locked}
            placeholder="House / Flat No., Building, Street area"
            onChange={e => onChange('street', e.target.value)}
          />
        </label>

        {/* Address Line 2 */}
        <label className="checkout-field checkout-field--full">
          <span className="checkout-field__label">Apartment, suite, landmark (optional)</span>
          <input
            type="text"
            value={address.street2 || ''}
            autoComplete="address-line2"
            readOnly={locked}
            placeholder="e.g. Near Rose Garden"
            onChange={e => onChange('street2', e.target.value)}
          />
        </label>

        {/* PIN Code */}
        <label className="checkout-field">
          <span className="checkout-field__label">PIN Code <span className="req-dot">*</span></span>
          <input
            required
            type="text"
            inputMode="numeric"
            pattern="[1-9][0-9]{5}"
            maxLength={6}
            value={address.pincode || ''}
            autoComplete="postal-code"
            readOnly={locked}
            placeholder="e.g. 110001"
            onChange={e => {
              const val = e.target.value.replace(/\D/g, '')
              if (val !== address.pincode) {
                filledPin.current = ''
                change.current('city', '')
                change.current('state', '')
              }
              onChange('pincode', val)
            }}
          />
        </label>

        {/* City */}
        <label className="checkout-field">
          <span className="checkout-field__label">City <span className="req-dot">*</span></span>
          <input
            required
            type="text"
            value={address.city || ''}
            autoComplete="address-level2"
            readOnly={locked}
            aria-busy={loading}
            placeholder="City"
            onChange={e => onChange('city', e.target.value)}
          />
        </label>

        {/* State */}
        <label className="checkout-field">
          <span className="checkout-field__label">State <span className="req-dot">*</span></span>
          <input
            required
            type="text"
            value={address.state || ''}
            autoComplete="address-level1"
            readOnly={locked}
            aria-busy={loading}
            placeholder="State"
            onChange={e => onChange('state', e.target.value)}
          />
        </label>

        {/* Country */}
        <label className="checkout-field">
          <span className="checkout-field__label">Country</span>
          <div className="checkout-country-pill">India</div>
        </label>

        {status && (
          <p className="checkout-location-status" role="status">
            {status}
          </p>
        )}
      </div>
    </section>
  )
}
