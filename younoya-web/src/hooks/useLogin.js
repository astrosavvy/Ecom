import { useEffect, useRef, useState } from 'react'
import { getLoginConfig, requestLoginCode, verifyLoginCode } from '../lib/giftGuideApi'

const allowed = ['whatsapp', 'sms', 'email']
export default function useLogin(onSuccess) {
  const [channels, setChannels] = useState([])
  const [loading, setLoading] = useState(true)
  const [channel, setChannel] = useState('email')
  const [value, setValue] = useState('')
  const [code, setCode] = useState('')
  const [challenge, setChallenge] = useState(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [retryAt, setRetryAt] = useState(0)
  const [now, setNow] = useState(Date.now())
  const active = useRef(true)
  const submitting = useRef(false)
  useEffect(() => {
    active.current = true
    getLoginConfig().then(config => {
      if (!active.current) return
      const enabled = allowed.filter(item => config.channels?.includes(item))
      setChannels(enabled); setChannel(enabled[0] || 'email')
    }).catch(() => { if (active.current) { setChannels(['email']); setChannel('email') } })
      .finally(() => { if (active.current) setLoading(false) })
    return () => { active.current = false }
  }, [])
  useEffect(() => {
    if (!retryAt && !challenge) return
    const timer = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(timer)
  }, [retryAt, challenge])
  const contact = channel === 'email' ? { email: value.trim().toLowerCase() } : { phone: `+91${value}`, channel }
  const valid = channel === 'email' ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) : /^[6-9]\d{9}$/.test(value)
  const remaining = Math.max(0, Math.ceil((retryAt - now) / 1000))
  const expired = challenge?.expires_at && now >= Date.parse(challenge.expires_at)
  async function run(resend = false) {
    if (submitting.current) return
    submitting.current = true; setBusy(challenge && !resend ? 'verify' : 'request'); setError('')
    try {
      if (challenge && !resend) {
        const customer = await verifyLoginCode(contact, code, challenge.challenge_id)
        if (active.current) onSuccess(customer)
      } else {
        const result = await requestLoginCode(contact, resend)
        if (!active.current) return
        setChallenge(result); setCode(''); setNow(Date.now())
        setRetryAt(Date.parse(result.resend_at) || Date.now() + 60000)
      }
    } catch (issue) {
      if (!active.current) return
      setError(issue.name === 'TimeoutError' ? 'The request took too long. Please wait a minute before trying again.' : issue.message)
      const seconds = issue.retryAfter || (issue.name === 'TimeoutError' ? 60 : 0)
      if (seconds) { setRetryAt(Date.now() + seconds * 1000); setNow(Date.now()) }
    } finally { submitting.current = false; if (active.current) setBusy(false) }
  }
  function change(next = channel) { setChannel(next); setValue(''); setCode(''); setChallenge(null); setError(''); setRetryAt(0) }
  return { channels, loading, channel, value, setValue, code, setCode, challenge, busy, error, remaining, expired,
    valid, run, change, contact }
}
