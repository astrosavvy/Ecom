import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'
import LaunchFields, { approvals } from './commerce/LaunchFields'
import ParcelSettings from './commerce/ParcelSettings'
import '../styles/Commerce.css'
export default function LaunchSettings() {
  const [data,setData] = useState<any>(null)
  const [value,setValue] = useState<any>(null)
  const [busy,setBusy] = useState(false)
  const [error,setError] = useState('')
  const [message,setMessage] = useState('')
  async function load() { const result = await api('/admin/commerce/settings'); setData(result); setValue(result.draft) }
  useEffect(() => { load().catch(e => setError(e.message)) }, [])
  async function save(publish = false, provision = false) {
    setBusy(true); setError(''); setMessage('')
    try {
      const result = await api('/admin/commerce/settings',{ method:'POST',body:JSON.stringify({ settings:value,publish }) })
      setData({ ...data,...result }); setValue(result.draft)
      if (provision) { await api('/admin/commerce/provision',{ method:'POST',body:'{}' }); await load() }
      setMessage(provision ? 'India free delivery configured. Activation is still governed by the readiness checks.' : publish ? 'Policies approved and published.' : 'Draft settings saved.')
      window.dispatchEvent(new Event('younoya-settings'))
    } catch (e: any) { setError(e.message) } finally { setBusy(false) }
  }
  if (!value) return <div className="ad__page"><h1>Launch settings</h1><p role="status">{error || 'Loading launch configuration…'}</p></div>
  return <div className="ad__page launch-settings"><header className="ad__head"><h1>Launch readiness</h1><p>Complete verified business and packing information first. Add private provider credentials on the backend and activate only after controlled verification.</p></header>
    <section className="ad-card"><h2>{data.readiness.ready ? 'Ready for online ordering' : 'Online ordering remains disabled'}</h2><p>{data.revision ? `Published policy revision: ${data.revision}` : 'Policies are draft until approved.'}</p>
      {!!data.readiness.blockers.length && <ul className="launch-blockers">{data.readiness.blockers.map((b: string) => <li key={b}>{b.replace(/([a-z])([A-Z])/g,'$1 $2').replace(/_/g,' ')}</li>)}</ul>}
      <Link to="/terms-and-conditions" target="_blank">Review the public policy pages ↗</Link>
    </section><form onSubmit={e => { e.preventDefault(); save() }}>
      <LaunchFields value={value} setValue={setValue} locations={data.locations} channels={data.channels} />
      <ParcelSettings value={value} setValue={setValue} variants={data.variants} />
      <section className="ad-card"><h2>Owner verification</h2>{approvals.map(([key,label]) => <label className="launch-check" key={key}><input type="checkbox" checked={value[key]} onChange={e => setValue({ ...value,[key]:e.target.checked })} /><span>{label}</span></label>)}
        <p>From January 1, 2027, review the amended e-commerce obligations, including NCH convergence, complaint copies and annual dark-pattern audit/certification requirements. Do not mark this review complete without meeting applicable obligations.</p>
        <p>Razorpay key secret, webhook secret and Shiprocket API-user credentials are entered only in the private backend environment. This page reports presence; it never receives secret values.</p>
      </section>{error && <p className="ad-error" role="alert">{error}</p>}{message && <p className="ad-note" role="status">{message}</p>}
      <div className="launch-actions"><button className="ad-btn" disabled={busy} type="submit">Save draft settings</button><button className="ad-btn" disabled={busy} type="button" onClick={() => save(true)}>Approve and publish policies</button><button className="ad-btn" disabled={busy} type="button" onClick={() => save(false,true)}>Configure free India delivery</button></div>
    </form></div>
}
