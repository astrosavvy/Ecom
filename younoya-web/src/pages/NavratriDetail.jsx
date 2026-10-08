import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Check, Heart, Minus, Plus } from 'lucide-react'
import { NAVRATRI_DAYS } from '../data/navratri'
import { useCart } from '../context/CartContext'
import { useSiteConfig } from '../context/SiteConfigContext'
import { storeRequest } from '../lib/giftGuideApi'
import ShopFooter from '../components/shop/ShopFooter'
import '../styles/Navratri.css'
import '../styles/ShopFooter.css'

export default function NavratriDetail({ product }) {
  const { addToCart, setIsOpen } = useCart()
  const { checkoutEnabled, business } = useSiteConfig()
  const [photo, setPhoto] = useState(0)
  const [day, setDay] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [availability, setAvailability] = useState(null)
  const [saved, setSaved] = useState(() => {
    try { return JSON.parse(localStorage.getItem('younoya-saved-pieces') || '[]').includes(product.id) } catch { return false }
  })
  const [added, setAdded] = useState(false)
  useEffect(() => {
    const controller = new AbortController()
    storeRequest('/store/navratri', { signal: controller.signal }).then(setAvailability).catch(() => {})
    return () => controller.abort()
  }, [])
  const available = checkoutEnabled && availability?.purchasable && availability?.price === product.priceNum && availability?.availableQuantity >= quantity
  const selected = NAVRATRI_DAYS[day]
  function toggleSaved() {
    let previous
    try { previous = JSON.parse(localStorage.getItem('younoya-saved-pieces') || '[]') } catch { previous = [] }
    if (!Array.isArray(previous)) previous = []
    localStorage.setItem('younoya-saved-pieces', JSON.stringify(saved ? previous.filter(id => id !== product.id) : [...new Set([...previous, product.id])]))
    setSaved(!saved)
  }
  function add() {
    addToCart({ id: `${product.id}::standard`, handle: product.handle, name: product.name, subtitle: product.subtitle,
      price: product.price, priceNum: product.priceNum, image: product.cardImage, chapter: 'Navratri ritual box' }, quantity)
    setAdded(true); setIsOpen(true)
  }
  const purchase = <button className="navratri-button" onClick={add}>{added ? <><Check size={18} /> Added to your bag</> : <>Order now <ArrowRight size={18} /></>}</button>
  return <div className="navratri-page" id="shop-top">
    <div className="navratri-shell">
      <nav className="navratri-breadcrumb" aria-label="Breadcrumb"><Link to="/shop"><ArrowLeft size={15} /> The collection</Link><span>Navratri</span></nav>
      <section className="navratri-intro" aria-labelledby="navratri-title">
        <div className="navratri-gallery">
          <figure>
            <img src={product.galleryImages[photo]} srcSet={[600,1200].map(width => `${product.galleryImages[photo].replace('1200', width)} ${width}w`).join(', ')} sizes="(min-width: 960px) 48vw, 100vw" alt={product.galleryCaptions[photo]} width="1200" height="1600" fetchPriority="high" />
            <figcaption>{product.galleryCaptions[photo]}</figcaption>
          </figure>
          <div className="navratri-thumbnails" aria-label="Product photographs">{product.galleryImages.map((image, index) => <button key={image} type="button" aria-label={product.galleryCaptions[index]} aria-pressed={photo === index} onClick={() => setPhoto(index)}><img src={image.replace('1200','600')} alt="" width="90" height="120" loading="lazy" /></button>)}</div>
        </div>
        <div className="navratri-buybox">
          <span className="navratri-eyebrow">YOUNOYA · THE NAVRATRI EDIT</span>
          <h1 id="navratri-title">Nine days of devotion.<br /><em>One considered box.</em></h1>
          <h2>{product.name}</h2>
          <p className="navratri-lead">A colour for every day. Shringaar and small devotional keepsakes, brought together for your nine-day ritual.</p>
          <div className="navratri-price"><strong>₹1,499</strong><span>Complete nine-day set</span></div>
          <dl className="navratri-facts"><div><dt>Inside the box</dt><dd>Nine individually packed daily kits</dd></div><div><dt>Your selection</dt><dd>One complete set · Standard edition</dd></div><div><dt>Delivery</dt><dd>Free shipping within India</dd></div></dl>
          <div className="navratri-actions"><div className="navratri-quantity" aria-label="Number of complete sets"><button type="button" disabled={quantity === 1} onClick={() => setQuantity(q => q - 1)} aria-label="Remove one set"><Minus size={16} /></button><output aria-live="polite">{quantity}</output><button type="button" disabled={!availability?.purchasable || quantity >= Math.min(10, availability.availableQuantity)} onClick={() => setQuantity(q => q + 1)} aria-label="Add one set"><Plus size={16} /></button></div><button className="navratri-save" type="button" onClick={toggleSaved} aria-pressed={saved}><Heart size={17} fill={saved ? 'currentColor' : 'none'} />{saved ? 'Saved' : 'Save this box'}</button></div>
          {purchase}
          {!available && <p className="navratri-availability" role="status">Add the set to your bag. Payment opens after stock and delivery checks are complete.</p>}
          <a className="navratri-details-link" href="#nine-days">Discover each daily kit <ArrowRight size={15} /></a>
        </div>
      </section>
      <section className="navratri-days" id="nine-days" aria-labelledby="navratri-days-title">
        <header><span className="navratri-eyebrow">NINE COLOURS · NINE DAILY RITUALS</span><h2 id="navratri-days-title">Every day, <em>beautifully considered.</em></h2><p>Each daily kit brings together its chunari, bindi, bangles, diya, cotton wick, pooja dhoop and a devotional keepsake.</p></header>
        <div className="navratri-day-selector" aria-label="Choose a daily kit">{NAVRATRI_DAYS.map((item, index) => <button key={item.day} type="button" aria-pressed={day === index} aria-controls="navratri-day-content" onClick={() => setDay(index)}><span>DAY {String(item.day).padStart(2,'0')}</span>{item.colour}</button>)}</div>
        <div id="navratri-day-content" className="navratri-day-content" aria-live="polite" aria-atomic="true"><div><span className="navratri-eyebrow">DAY {String(selected.day).padStart(2,'0')} · {selected.colour}</span><h3>{selected.deity}</h3><p lang="hi" className="navratri-hindi">{selected.hindi}</p>{selected.note && <p className="navratri-day-note">{selected.note}</p>}</div><ul>{selected.contents.map(item => <li key={item}>{item}</li>)}</ul></div>
      </section>
      <section className="navratri-notes" aria-label="Packaging and care"><div><span className="navratri-eyebrow">THE COMPLETE SET</span><h2>A ritual, <em>ready to unfold.</em></h2><p>All nine daily kits arrive together, individually packed inside one outer box. Gallery photographs show individual kit details.</p><p>Keep fabrics and keepsakes dry. Use diya and dhoop on a heat-resistant surface, away from fabrics, children and pets. Never leave a flame unattended.</p></div><div><h3>Delivery & order care</h3><p>Dispatch within {business.dispatchHours || 24} hours of payment confirmation. Estimated delivery {business.deliveryMinDays || 3}–{business.deliveryMaxDays || 5} working days after dispatch; remote areas may take longer.</p><Link to="/shipping-policy">Shipping information <ArrowRight size={14} /></Link><Link to="/cancellation-and-refunds">Cancellation & refunds <ArrowRight size={14} /></Link><a href="mailto:support@younoya.com">Ask the atelier <ArrowRight size={14} /></a></div></section>
    </div>
    <ShopFooter />
    <div className="navratri-mobile-bar"><span>Complete set<strong>₹1,499</strong></span>{purchase}</div>
  </div>
}
