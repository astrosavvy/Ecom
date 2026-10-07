import { useState } from 'react'
import { storeRequest } from '../../lib/giftGuideApi'
export default function AfterSaleForm({ orderId, onSaved, dispatched }) {
  const [kind, setKind] = useState(dispatched ? 'damaged' : 'cancellation')
  const [reason, setReason] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  async function submit(event) {
    event.preventDefault(); setBusy(true); setError('')
    try { await storeRequest(`/store/account/orders/${orderId}/requests`, { auth: true, body: { kind, reason } }); setReason(''); onSaved() }
    catch (issue) { setError(issue.message) } finally { setBusy(false) }
  }
  return <form className="order-request" onSubmit={submit}><h2>Here to help</h2><p>Send a request to the atelier. Approval is required before cancellation, return or refund.</p>
    <label>What can we help with?<select value={kind} onChange={e => setKind(e.target.value)}>
      {!dispatched && <option value="cancellation">Cancel before dispatch</option>}<option value="damaged">A damaged piece</option><option value="defective">A defective piece</option><option value="incorrect">An incorrect item</option>
    </select></label><label>Tell us what happened<textarea required minLength={10} maxLength={2000} value={reason} onChange={e => setReason(e.target.value)} /></label>
    <p>For product issues, email clear photographs to <a href="mailto:support@younoya.com">support@younoya.com</a> with your order number.</p>
    {error && <p role="alert">{error}</p>}<button type="submit" className="policy-action" disabled={busy}>{busy ? 'Sending…' : 'Send your request ↗'}</button>
  </form>
}
