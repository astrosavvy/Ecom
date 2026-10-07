import { Link } from 'react-router-dom'
export const money = value => `₹${(Number(value || 0)/100).toLocaleString('en-IN',{ maximumFractionDigits: 2 })}`
export default function CheckoutSummary({ cart, bag, session, offer }) {
  return <aside className="checkout-summary"><h2>Your selection</h2>{cart ? <>
    <div>{cart.items?.map(item => <div className="checkout-summary__item" key={item.id}><span>{item.title}<small>Quantity {item.quantity}</small></span><strong>{money(item.total)}</strong></div>)}</div>
    {session && <><div className="checkout-summary__item"><span>Delivery</span><strong>Free</strong></div>{cart.discount_total > 0 && <div className="checkout-summary__item"><span>Promotion</span><strong>−{money(cart.discount_total)}</strong></div>}</>}
    <div className="checkout-summary__total"><span>{session ? 'Total to pay' : 'Estimated total'}</span><strong>{money(cart.total)}</strong></div><p>The final INR total is calculated securely before payment.</p>
  </> : <>{bag?.map(item => <div className="checkout-summary__item" key={item.id}><span>{item.name}<small>Quantity {item.quantity}</small></span></div>)}<p>Your selection remains saved while ordering is being prepared.</p></>}
    {offer?.components?.length > 0 && <div className="checkout-summary__components"><strong>Included in your set</strong>{offer.components.map((component,index) => <span key={index}>{typeof component === 'string' ? component : component.title}</span>)}</div>}
    <Link to="/shop">Continue exploring ↗</Link></aside>
}
