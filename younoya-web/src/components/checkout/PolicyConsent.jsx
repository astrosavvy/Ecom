import { Link } from 'react-router-dom'
export default function PolicyConsent({ accepted, onChange, disabled }) {
  return <div className="checkout-policies"><label><input type="checkbox" checked={accepted} disabled={disabled} onChange={e => onChange(e.target.checked)} />
    <span>I agree to the <Link to="/terms-and-conditions">Terms and Conditions</Link> and have read the <Link to="/privacy-policy">Privacy Policy</Link>, <Link to="/shipping-policy">Shipping Policy</Link> and <Link to="/cancellation-and-refunds">Cancellation and Refunds</Link>.</span>
  </label></div>
}
