import { Link } from 'react-router-dom'
import { ShieldCheck, Truck, Headphones } from 'lucide-react'
export const money = value => `₹${Number(value || 0).toLocaleString('en-IN',{minimumFractionDigits:2,maximumFractionDigits:2})}`
export default function CheckoutSummary({cart,bag,session,offer}) {
 const items=cart?.items|| (offer?[{id:offer.id,title:offer.title,quantity:1,thumbnail:offer.thumbnail,total:offer.price}]:bag.map(item=>({id:item.id,title:item.name,quantity:item.quantity,thumbnail:item.image,total:item.priceNum*item.quantity,subtitle:item.subtitle})))
 const estimate=items.reduce((sum,item)=>sum+Number(item.total||0),0)
 return <aside className="checkout-summary"><h2>Order summary</h2>
  <div className="checkout-summary__products">{items.map(item=><div className="checkout-summary__product" key={item.id}>{item.thumbnail&&<img src={item.thumbnail} alt={item.title} width="96" height="116"/>}<div><h3>{item.title}</h3><small>{item.subtitle || `Quantity ${item.quantity}`}</small><strong>{money(item.total)}</strong></div></div>)}</div>
  <dl className="checkout-summary__totals"><div><dt>Subtotal</dt><dd>{money(cart?.original_item_total??estimate)}</dd></div><div><dt>Shipping</dt><dd>Free</dd></div>{Number(cart?.discount_total)>0&&<div className="checkout-summary__discount"><dt>Discount</dt><dd>−{money(cart.discount_total)}</dd></div>}<div className="checkout-summary__total"><dt>{session?'Total to pay':'Estimated total'}</dt><dd>{money(cart?.total??estimate)}</dd></div></dl>
  <p>The final total, including applicable taxes, is checked before payment.</p>
  {offer?.components?.length>0&&<div className="checkout-summary__components"><strong>Included in your set</strong>{offer.components.map((c,i)=><span key={i}>{typeof c==='string'?c:c.title}</span>)}</div>}
  <div className="checkout-assurances"><span><ShieldCheck size={25}/>Secure payment</span><span><Truck size={25}/>Free India shipping</span><Link to="/contact"><Headphones size={25}/>Atelier support</Link></div>
 </aside>
}
