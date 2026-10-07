import { Mail, MessageCircle, Smartphone } from 'lucide-react'

export const loginChannelName = { whatsapp: 'WhatsApp', sms: 'SMS', email: 'Email' }
const localPhone = raw => {
  const digits = raw.replace(/\D/g, '')
  return (digits.length === 12 && digits.startsWith('91') ? digits.slice(2) : digits).slice(0, 10)
}
export default function LoginFields({ login }) {
  const { channels, channel, value, setValue, code, setCode, challenge, busy, change, expired } = login
  if (challenge) {
    const masked = channel === 'email' ? value.replace(/^(.).+(@.*)$/, '$1••••$2') : `+91 •••••• ${value.slice(-4)}`
    return <div className="login-fields">
      <p className="login-destination">Your code was requested by {loginChannelName[channel]} for<strong>{masked}</strong></p>
      <label htmlFor="login-code">Verification code</label>
      <input key="code" id="login-code" className="login-code" type="text" inputMode="numeric" autoComplete="one-time-code"
        autoFocus required maxLength={6} pattern="[0-9]{6}" value={code} disabled={busy}
        onChange={event => setCode(event.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="000000" aria-describedby="login-code-help" />
      <p id="login-code-help" className="login-field-note">{expired ? 'This code has expired. Request another below.' : 'Enter the six-digit code to continue.'}</p>
    </div>
  }
  const mobileChannels = channels.filter(item => item !== 'email')
  return <div className="login-fields">
    {mobileChannels.length > 1 && channel !== 'email' && <div className="login-channels" role="group" aria-label="Send code using">
      {mobileChannels.map(item => <button key={item} type="button" aria-pressed={channel === item} disabled={busy}
        onClick={() => change(item)}>{item === 'whatsapp' ? <MessageCircle size={17} /> : <Smartphone size={17} />}{loginChannelName[item]}</button>)}
    </div>}
    <label htmlFor="login-contact">{channel === 'email' ? 'Email address' : 'Mobile number'}</label>
    <div className="login-contact">
      {channel === 'email' ? <Mail size={19} aria-hidden="true" /> : <span className="login-country">+91</span>}
      <input key={channel} id="login-contact" type={channel === 'email' ? 'email' : 'tel'} autoFocus required
        autoComplete={channel === 'email' ? 'email' : 'tel-national'} inputMode={channel === 'email' ? 'email' : 'numeric'}
        maxLength={channel === 'email' ? 254 : 18} value={value} disabled={busy}
        pattern={channel === 'email' ? undefined : '[6-9][0-9]{9}'} placeholder={channel === 'email' ? 'you@example.com' : 'Your 10-digit number'}
        onChange={event => setValue(channel === 'email' ? event.target.value : localPhone(event.target.value))} />
    </div>
    <p className="login-field-note">A private code, delivered by {loginChannelName[channel]}. No password to remember.</p>
  </div>
}
