import { useEffect, useState } from 'react'
import { api, type Role } from '../../api'
import RequestActions from './RequestActions'
import '../../styles/Commerce.css'
export default function OrderOperations({ id, role }: { id: string; role: Role }) {
  const [data,setData] = useState<any>(null)
  const [couriers,setCouriers] = useState<any[]>([])
  const [courier,setCourier] = useState('')
  const [pickupDate,setPickupDate] = useState(() => {
    const d = new Date()
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
    return d.toISOString().slice(0, 10)
  })
  const [busy,setBusy] = useState(false)
  const [error,setError] = useState('')
  async function load() { setData(await api(`/admin/commerce/orders/${id}`)) }
  useEffect(() => { let active = true; const refresh = () => { if (active) load().catch(e => { if (active) setError(e.message) }) }; refresh(); const timer = setInterval(refresh,10000); return () => { active=false; clearInterval(timer) } },[id])
  async function act(body: any) { setBusy(true); setError(''); try { await api(`/admin/commerce/orders/${id}/actions`,{ method:'POST',body:JSON.stringify(body) }); await load() } catch (e: any) { setError(e.message) } finally { setBusy(false) } }
  async function quotes() { setBusy(true); setError(''); try { const result = await api(`/admin/commerce/orders/${id}/couriers`); setCouriers(result.couriers) } catch (e: any) { setError(e.message) } finally { setBusy(false) } }
  const owner = role === 'admin', delivery = data?.shipment
  return <section className="ad-card order-operations"><h2>Shipping & Warehouse Dispatch (Shiprocket)</h2>{error && <p className="ad-error" role="alert">{error}</p>}
    <p>Payment: {data?.order?.payment_method === 'cod' ? `Cash on Delivery · ₹49 handling · Amount due on delivery ₹${data.order.total}` : data?.order?.payment_status?.replace(/_/g,' ') || 'Pending'}</p>
    <p>Delivery: {delivery?.status?.replace(/_/g,' ') || 'Awaiting order preparation'}</p>{delivery?.data?.awb && <p>AWB {delivery.data.awb} · {delivery.data.courier}{delivery?.data?.pickupDate ? ` · Scheduled: ${delivery.data.pickupDate}` : ''}</p>}
    {owner && <><div className="launch-actions"><button className="ad-btn" disabled={busy} onClick={() => act({ action:'create' })}>1. Prepare shipping parcel</button><button className="ad-btn" disabled={busy} onClick={quotes}>2. Fetch live courier quotes</button></div>
      {!!couriers.length && <label>Warehouse Selected Courier<select value={courier} onChange={e => setCourier(e.target.value)}><option value="">Choose warehouse courier</option>{couriers.map(c => <option key={c.id} value={c.id}>{c.name} · INR {c.rate} · {c.etd || 'Estimate unavailable'}</option>)}</select></label>}
      <div className="launch-actions" style={{ alignItems: 'center', gap: '12px' }}>
        <button className="ad-btn" disabled={busy || !courier || !!delivery?.data?.awb} onClick={() => act({ action:'awb',courier_id:Number(courier) })}>3. Assign AWB</button>
        {delivery?.data?.awb && !delivery?.data?.pickupScheduled && (
          <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
            <span>Pickup Date:</span>
            <input type="date" value={pickupDate} onChange={e => setPickupDate(e.target.value)} min={new Date().toISOString().slice(0, 10)} style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #dcd3c6' }} />
          </label>
        )}
        <button className="ad-btn" disabled={busy || !delivery?.data?.awb || delivery?.status === 'cancelled' || delivery?.data?.pickupScheduled} onClick={() => { if (confirm(`Approve courier pickup on ${pickupDate} for this order?`)) act({ action:'pickup', pickup_date: pickupDate }) }}>4. Approve pickup</button>
        <button className="ad-btn" disabled={busy || !delivery?.data?.awb || ['picked_up','in_transit','delivered','returned','cancelled'].includes(delivery?.status)} onClick={() => { if (confirm('Cancel this courier booking? This does not refund or cancel the customer order.')) act({ action:'cancel_shipping' }) }}>Cancel booking</button>
      </div><div className="launch-actions">{['label','manifest','invoice'].map(document => <button className="ad-btn" key={document} disabled={busy || !delivery?.data?.awb} onClick={() => act({ action:'document',document })}>Generate {document}</button>)}</div>
    </>}
    <div className="launch-actions">{Object.entries(delivery?.data.documents || {}).map(([key,url]: any) => <a key={key} href={url} target="_blank" rel="noreferrer">Open {key} ↗</a>)}</div>
    {data?.requests?.map((r: any) => owner ? <RequestActions key={r.id} request={r} act={act} busy={busy} /> : <p key={r.id}>{r.kind}: {r.status} — {r.reason}</p>)}
    <details><summary>Persisted operation history</summary>{data?.operations?.map((op: any) => <div className="operation-row" key={op.id}><strong>{op.kind.replace(/_/g,' ')} · {op.status}</strong><small>{op.id}</small>{op.error && <p>{op.error}</p>}{owner && ['held','reconcile'].includes(op.status) && <><button className="ad-btn" disabled={busy} onClick={() => act({ action:'reconcile',operation_id:op.id })}>Reconcile provider state</button>{op.result?.noEffect === true && <button className="ad-btn" disabled={busy} onClick={() => act({ action:'retry',operation_id:op.id })}>Retry rejected operation</button>}</>}</div>)}</details>
    {!owner && <p className="ad-note">Shipping and refund changes require the store owner.</p>}
  </section>
}
