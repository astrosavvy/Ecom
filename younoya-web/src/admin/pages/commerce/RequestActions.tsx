import { useState } from 'react'
export default function RequestActions({ request, act, busy }: any) {
  const [reply,setReply] = useState(request.data.reply || '')
  const [amount,setAmount] = useState('')
  const [verified,setVerified] = useState(false)
  const allowed = ['requested','return_approved','received'].includes(request.status)
  return <section className="launch-parcel"><h3>{request.kind} · {request.status.replace(/_/g,' ')}</h3><p>{request.reason}</p><small>Reference {request.id}</small>
    {request.data.outsideWindow && <p className="ad-note">Outside the published reporting window. Review statutory rights and the circumstances; the request was not automatically rejected.</p>}
    {request.data.refundId && <p>Refund {request.data.refundId} · {request.data.refundStatus}</p>}
    {allowed && <><label>Reply / return instructions<textarea value={reply} onChange={e => setReply(e.target.value)} maxLength={2000} /></label>
      <div className="launch-actions"><button disabled={busy} className="ad-btn" onClick={() => act({ action:'reject',request_id:request.id,reply })}>Decline with reply</button>
      {request.kind === 'cancellation' ? <button disabled={busy} className="ad-btn" onClick={() => { if (confirm('Approve cancellation and refund to the original payment method? Courier status will be checked first.')) act({ action:'cancel',request_id:request.id,reply }) }}>Approve cancellation & refund</button> : <button disabled={busy || !reply.trim()} className="ad-btn" onClick={() => act({ action:'approve_return',request_id:request.id,reply })}>Approve return instructions</button>}</div>
      {request.kind !== 'cancellation' && <><label>Refund amount (INR)<input type="number" min="0.01" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} /></label><label className="launch-check"><input type="checkbox" checked={verified} onChange={e => setVerified(e.target.checked)} /><span>Issue or returned item verified; this amount is approved</span></label>
        <button className="ad-btn" disabled={busy || !verified || Number(amount) <= 0} onClick={() => { if (confirm(`Approve a refund of INR ${amount} to the original payment method?`)) act({ action:'refund',request_id:request.id,amount:Number(amount),received:true,reply }) }}>Approve refund</button></>}
    </>}{!allowed && request.data.reply && <p>{request.data.reply}</p>}
  </section>
}
