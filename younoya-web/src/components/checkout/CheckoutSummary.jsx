import { Link } from 'react-router-dom'
import { ShieldCheck, Truck, Headphones } from 'lucide-react'
export const money = value => `₹${Number(value || 0).toLocaleString('en-IN',{minimumFractionDigits:2,maximumFractionDigits:2})}`
export default function CheckoutSummary({cart,bag,session,offer}) {
  const bagItems = offer
    ? [{ id: offer.id, title: offer.title, quantity: 1, thumbnail: offer.thumbnail, total: offer.price, subtitle: offer.subtitle }]
    : (bag || []).map(item => ({
        id: item.id,
        title: item.name || item.title,
        quantity: item.quantity,
        thumbnail: item.image || item.thumbnail,
        total: Number(item.priceNum || item.price || 0) * (item.quantity || 1),
        subtitle: item.subtitle
      }))

  const cartHasValidItems = Array.isArray(cart?.items) && cart.items.length > 0 && cart.items.some(i => i.title || (Number(i.total || i.unit_price || 0) > 0))

  const items = cartHasValidItems
    ? cart.items.map(item => ({
        id: item.id,
        title: item.title || item.variant_title || 'Atelier Selection',
        quantity: item.quantity || 1,
        thumbnail: item.thumbnail || bagItems.find(b => b.id === item.id)?.thumbnail,
        total: Number(item.total || (item.unit_price * (item.quantity || 1)) || 0),
        subtitle: item.subtitle
      }))
    : bagItems

  const estimate = bagItems.reduce((sum, item) => sum + Number(item.total || 0), 0)
  const cartSubtotal = Number(cart?.original_item_total || cart?.subtotal || 0)
  const cartTotal = Number(cart?.total || 0)

  const subtotal = cartSubtotal > 0 ? cartSubtotal : estimate
  const total = cartTotal > 0 ? cartTotal : estimate

  return <aside className="checkout-summary"><h2>Order summary</h2>
    <div className="checkout-summary__products">{items.map(item => <div className="checkout-summary__product" key={item.id}>{item.thumbnail && <img src={item.thumbnail} alt={item.title} width="96" height="116"/>}<div><h3>{item.title}</h3><small>{item.subtitle || `Quantity ${item.quantity}`}</small><strong>{money(item.total)}</strong></div></div>)}</div>
    <dl className="checkout-summary__totals">
      <div><dt>Subtotal</dt><dd>{money(subtotal)}</dd></div>
      <div><dt>Shipping</dt><dd>Free</dd></div>
      {Number(cart?.discount_total) > 0 && <div className="checkout-summary__discount"><dt>Discount</dt><dd>−{money(cart.discount_total)}</dd></div>}
      <div className="checkout-summary__total"><dt>{session ? 'Total to pay' : 'Estimated total'}</dt><dd>{money(total)}</dd></div>
    </dl>
    <p>The final total is confirmed before payment.</p>
    {offer?.components?.length > 0 && <div className="checkout-summary__components"><strong>Included in your set</strong>{offer.components.map((c,i) => <span key={i}>{typeof c === 'string' ? c : c.title}</span>)}</div>}
    <div className="checkout-assurances"><span><ShieldCheck size={25}/>Secure payment</span><span><Truck size={25}/>Free India shipping</span><Link to="/contact"><Headphones size={25}/>Atelier support</Link></div>
  </aside>
}
