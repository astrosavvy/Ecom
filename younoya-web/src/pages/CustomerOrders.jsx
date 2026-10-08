import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { clearCustomerToken, getCustomerToken, storeRequest } from '../lib/giftGuideApi'
import GuideLogin from '../components/gift-guide/GuideLogin'
import AfterSaleForm from '../components/orders/AfterSaleForm'
import PolicyLinks from '../components/PolicyLinks'
import '../styles/CustomerOrders.css'
const money = value => `₹${(Number(value || 0)).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`
export default function CustomerOrders() {
  const { id } = useParams()
  const [signedIn, setSignedIn] = useState(!!getCustomerToken())
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [refresh, setRefresh] = useState(0)
  const [offset, setOffset] = useState(0)
  useEffect(() => { setData(null); setOffset(0) }, [id])
  useEffect(() => {
    if (!signedIn) return
    let active = true
    const load = () => storeRequest(id ? `/store/account/orders/${id}` : `/store/account/orders?offset=${offset}`, { auth: true })
      .then(result => { if (active) { setData(result); setError('') } }).catch(issue => {
        if (!active) return
        if (issue.status === 401) { clearCustomerToken(); setSignedIn(false) } else setError(issue.message)
      })
    load(); const timer = id ? setInterval(load, 20000) : null
    return () => { active = false; clearInterval(timer) }
  }, [signedIn, id, refresh, offset])
  const order = data?.order, shipment = data?.shipment
  const dispatched = ['picked_up','in_transit','delivered','returned'].includes(shipment?.status)
  return <section className="customer-orders"><header><Link className="policy-back" to={id ? '/account/orders' : '/shop'}>← {id ? 'Your orders' : 'The collection'}</Link>
    <span className="policy-eyebrow">YOUNOYA · PERSONAL SERVICE</span><h1>{id ? `Your order${order ? ` #${order.display_id || order.id}` : ''}` : 'Your considered collection.'}</h1></header>
    {!signedIn && <GuideLogin purpose="view your orders" onCancel={() => history.back()} onSuccess={() => setSignedIn(true)} />}
    {error && <p className="checkout-error" role="alert">{error}</p>}{signedIn && !data && !error && <p role="status">Opening your orders…</p>}
    {data?.orders && <><div className="customer-orders__list">{data.orders.length ? data.orders.map(item => <Link key={item.id} to={`/account/orders/${item.id}`}>
      <div><span>Order #{item.display_id || item.id}</span><small>{new Date(item.created_at).toLocaleDateString('en-IN')} · {item.status}</small></div><strong>{money(item.total)} ↗</strong>
    </Link>) : <p>No orders on this account yet. <Link to="/shop">Explore the collection.</Link></p>}</div>
      <div className="order-pages">{offset > 0 && <button onClick={() => setOffset(Math.max(0,offset-20))}>← Previous</button>}{offset+20 < data.count && <button onClick={() => setOffset(offset+20)}>Next →</button>}</div></>}
    {order && <div className="customer-order__grid"><article><div className="order-status"><span>Payment · {order.payment_status.replace(/_/g,' ')}</span><span>Delivery · {shipment?.status?.replace(/_/g,' ') || 'Awaiting courier preparation'}</span></div>
      {shipment?.data?.awb && <p>Tracking {shipment.data.awb} · {shipment.data.courier} <a target="_blank" rel="noreferrer" href={`https://shiprocket.co/tracking/${encodeURIComponent(shipment.data.awb)}`}>Follow your parcel ↗</a></p>}
      {order.items.map(item => <div className="customer-order__item" key={item.id}>{item.thumbnail && <img src={item.thumbnail} alt="" onError={e => { e.currentTarget.style.display='none' }} />}<div><h2>{item.title}</h2><p>Quantity {item.quantity}</p></div><strong>{money(item.total)}</strong></div>)}
      <div className="customer-order__total"><span>Order total</span><strong>{money(order.total)}</strong></div>
      <section className="order-address"><h2>Delivery address</h2><p>{[order.shipping_address?.first_name,order.shipping_address?.last_name].filter(Boolean).join(' ')}<br />{order.shipping_address?.address_1}<br />{[order.shipping_address?.city,order.shipping_address?.province,order.shipping_address?.postal_code].filter(Boolean).join(', ')}</p></section>
    </article><aside>{data.requests?.map(request => <section className="order-request-status" key={request.id}><span>{request.kind} · {request.status.replace(/_/g,' ')}</span><p>{request.reason}</p><small>Reference {request.id}</small>{request.data?.reply && <p>{request.data.reply}</p>}{request.data?.refundId && <p>Refund {request.data.refundId} · {request.data.refundStatus}</p>}</section>)}
      {order.status !== 'canceled' && !data.requests?.some(r => !['closed','rejected','refunded'].includes(r.status)) && <AfterSaleForm key={dispatched ? 'sent' : 'new'} orderId={order.id} dispatched={dispatched} onSaved={() => setRefresh(n => n+1)} />}
    </aside></div>}<PolicyLinks />
  </section>
}
