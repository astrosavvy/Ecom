import { useState } from 'react'
import { requestEmailCode, verifyEmailCode } from '../../lib/giftGuideApi'

export default function GuideLogin({ onSuccess, onCancel, purpose = 'continue' }) {
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [sent, setSent] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  async function submit(event) {
    event.preventDefault()
    setBusy(true); setError('')
    try {
      if (!sent) { await requestEmailCode(email.trim()); setSent(true) }
      else { const customer = await verifyEmailCode(email.trim(), code.trim()); onSuccess(customer) }
    } catch (issue) { setError(issue.message) }
    finally { setBusy(false) }
  }
  return <div className="guide-login" role="dialog" aria-modal="true" aria-label="Sign in to Younoya">
    <form className="guide-login__panel" onSubmit={submit}>
      <button className="guide-login__close" type="button" onClick={onCancel} aria-label="Close">×</button>
      <span className="guide-eyebrow">A PRIVATE PLACE FOR YOUR FIND</span>
      <h2>Sign in to {purpose}.</h2>
      <p>Looking at your recommendation never needs an account. We ask you to sign in only when you choose to keep or order it.</p>
      <label>Email address<input type="email" autoComplete="email" required value={email} onChange={event => setEmail(event.target.value)} disabled={sent} placeholder="you@example.com" /></label>
      {sent && <label>Verification code<input inputMode="numeric" autoComplete="one-time-code" required value={code} onChange={event => setCode(event.target.value)} placeholder="Enter the code" /></label>}
      {error && <p className="guide-error" role="alert">{error}</p>}
      <button className="guide-primary" type="submit" disabled={busy}>{busy ? 'One moment…' : sent ? 'Continue' : 'Email me a code'}</button>
      {sent && <button className="guide-text-action" type="button" onClick={() => { setSent(false); setCode('') }}>Use another email</button>}
    </form>
  </div>
}
