import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Check, Heart } from 'lucide-react'
import { KALASH_CONTENTS } from '../data/kalash'
import { storeRequest } from '../lib/giftGuideApi'
import { useCart } from '../context/CartContext'
import { useSiteConfig } from '../context/SiteConfigContext'
import NavratriGallery from '../components/NavratriGallery'
import ProductDeliveryNote from '../components/ProductDeliveryNote'
import ShopFooter from '../components/shop/ShopFooter'
import '../styles/Navratri.css'
import '../styles/Kalash.css'
import '../styles/ShopFooter.css'

export default function KalashDetail({product}) {
  const {addToCart, setIsOpen} = useCart()
  const {checkoutEnabled} = useSiteConfig()
  const [availability,setAvailability] = useState(null)
  const [added, setAdded] = useState(false)
  const [saved,setSaved] = useState(() => {
    try { return JSON.parse(localStorage.getItem('younoya-saved-pieces') || '[]').includes(product.id) } catch { return false }
  })
  useEffect(() => {
    const controller = new AbortController()
    storeRequest(`/store/commerce/products/${product.handle}/availability`,{signal:controller.signal})
      .then(setAvailability).catch(() => setAvailability(null))
    return () => controller.abort()
  },[product.handle])

  // Optimistic default: available unless the backend explicitly signals out-of-stock
  const isExplicitlyUnavailable = availability !== null && (availability.purchasable === false || availability.availableQuantity <= 0)
  const isPriceMismatch = availability !== null && availability.price && availability.price !== product.priceNum
  const available = checkoutEnabled !== false && !isExplicitlyUnavailable && !isPriceMismatch

  function save() {
    let previous
    try { previous = JSON.parse(localStorage.getItem('younoya-saved-pieces') || '[]') } catch { previous = [] }
    if (!Array.isArray(previous)) previous = []
    localStorage.setItem('younoya-saved-pieces',JSON.stringify(saved ? previous.filter(id => id !== product.id) : [...new Set([...previous,product.id])]))
    setSaved(!saved)
  }
  function order() {
    if (!available) return
    addToCart({id:`${product.id}::standard`,handle:product.handle,name:product.name,subtitle:product.subtitle,
      price:product.price,priceNum:product.priceNum,image:product.cardImage,chapter:'Diwali Wealth Kalash'},1)
    setAdded(true)
    setIsOpen(true)
    setTimeout(() => setAdded(false), 2500)
  }
  const purchase = (
    <button 
      className="navratri-button" 
      type="button" 
      disabled={!available} 
      onClick={order}
      aria-describedby={!available ? 'kalash-ordering-status' : undefined}
    >
      {added ? (
        <><Check size={18} /> Added to your bag</>
      ) : available ? (
        <>Order now <ArrowRight size={18} /></>
      ) : (
        'Temporarily unavailable'
      )}
    </button>
  )
  return <div className="navratri-page kalash-page" id="shop-top">
    <div className="navratri-shell">
      <nav className="navratri-breadcrumb" aria-label="Breadcrumb"><Link to="/shop"><ArrowLeft size={15} /> The collection</Link><span>Diwali</span></nav>
      <section className="navratri-intro" aria-labelledby="kalash-title">
        <NavratriGallery photos={product.gallery} />
        <div className="navratri-buybox">
          <span className="navratri-eyebrow">YOUNOYA · THE DIWALI EDIT</span>
          <h1 id="kalash-title">Diwali Wealth <em>Kalash.</em></h1>
          <h2>A considered ritual for prosperity</h2>
          <p className="navratri-lead">Bring devotion and intention to a new beginning. A textured Kalash with ritual essentials, thoughtfully brought together for Diwali puja and meaningful gifting.</p>
          <div className="navratri-price"><strong>₹5,599</strong><span>Standard edition</span></div>
          <dl className="navratri-facts"><div><dt>The collection</dt><dd>Kalash and devotional essentials</dd></div><div><dt>For your ritual</dt><dd>Diwali puja · a meaningful new beginning</dd></div><div><dt>Delivery</dt><dd>Free shipping within India<ProductDeliveryNote /></dd></div></dl>
          <button className="navratri-save" type="button" aria-pressed={saved} onClick={save}><Heart size={18} fill={saved ? 'currentColor' : 'none'} />{saved ? 'Saved' : 'Save this Kalash'}</button>
          {purchase}
          {!available && <p className="navratri-availability" id="kalash-ordering-status">This edition is currently unavailable. Save it to revisit the collection.</p>}
          <a className="navratri-details-link" href="#kalash-contents">Explore the ritual essentials <ArrowRight size={15} /></a>
        </div>
      </section>
      <section className="kalash-story" aria-labelledby="kalash-story-title"><h2 id="kalash-story-title">A place for devotion.<br /><em>An intention for what comes next.</em></h2><div><p>Diwali is a moment to make space: for light, for gratitude and for the chapter ahead. The Younoya Diwali Wealth Kalash brings a tactile centrepiece and a collection of devotional essentials to that ritual.</p><p>Place it within your puja arrangement or offer it as a considered festive gift. Its textured surface, warm-toned opening and individually distinct details invite a slower, more personal moment of worship.</p></div></section>
      <section className="kalash-contents" id="kalash-contents" aria-labelledby="kalash-contents-title"><header><h2 id="kalash-contents-title">Within the <em>ritual.</em></h2><p>Every set includes the Kalash in its YOUNOYA gift box, a red potli labelled “11 sacred pooja samagri”, and an envelope containing pooja vidhi, Pooja mahurat and Pooja mantra.</p><p>The devotional collection includes the six item types below. The falling-items image is an illustrative arrangement; it does not represent exact quantities. The enclosed guidance is printed for your puja.</p></header><ol>{KALASH_CONTENTS.map(([name,description],index) => <li key={name}><span>{String(index+1).padStart(2,'0')}</span><div><h3>{name}</h3><p>{description}</p></div></li>)}</ol></section>
      <section className="kalash-intentions" aria-labelledby="kalash-intentions-title"><h2 id="kalash-intentions-title">The intention <em>you bring.</em></h2><p>In astrology-inspired devotional practice, prosperity rituals offer a way to reflect on stability, growth and opportunity.</p><ul><li><span lang="hi">कर्ज़ मुक्ति</span><h3>Karz Mukti</h3><p>An intention for relief from financial burdens.</p></li><li><span lang="hi">धन वृद्धि</span><h3>Dhan Vriddhi</h3><p>An intention for prosperity and steady growth.</p></li><li><h3>Wealth multiplication</h3><p>A symbolic focus on nurturing what you have.</p></li><li><h3>Business opportunities</h3><p>An intention for possibility and a purposeful next step.</p></li></ul><p className="kalash-intentions__note">These are traditional devotional intentions. Personal and financial outcomes are not guaranteed.</p></section>
      <section className="kalash-gifting"><img src={product.gallery[4].src} alt="Two women holding the Kalash in an AI-styled festive setting" loading="lazy" width="1200" height="800" onError={event => { event.currentTarget.hidden = true }} /><div><h2>A festive gesture,<br /><em>chosen with care.</em></h2><p>For a family home, a new workspace or someone beginning a new chapter, choose a gift with space for their own traditions. The Kalash is a thoughtful companion to Diwali celebrations and devotional gifting.</p><p className="kalash-gifting__caption">AI-styled lifestyle image. Background flowers and lamps are styling props.</p></div></section>
      <section className="navratri-notes"><div><h2>Care for your <em>Kalash.</em></h2><p>Handle gently and place on a stable, dry surface. Wipe carefully with a soft, dry cloth; avoid soaking, abrasive cleaners or scrubbing the textured exterior. Keep small ritual pieces away from children and pets.</p><p>Use separate heat-resistant holders for lamps and incense, away from the Kalash and other decorative materials. Never leave a flame unattended.</p></div><div><h3>Details & order care</h3><dl className="kalash-specs"><div><dt>Brand</dt><dd>YOUNOYA</dd></div><div><dt>Edition</dt><dd>Diwali Wealth Kalash · Standard</dd></div><div><dt>Occasion</dt><dd>Diwali, home puja and devotional gifting</dd></div></dl><Link to="/shipping-policy">Shipping information <ArrowRight size={14} /></Link><Link to="/cancellation-and-refunds">Cancellation & refunds <ArrowRight size={14} /></Link><a href="mailto:support@younoya.com">Ask the atelier <ArrowRight size={14} /></a></div></section>
    </div>
    <ShopFooter />
    <div className="navratri-mobile-bar"><span>Standard edition<strong>₹5,599</strong></span>{purchase}</div>
  </div>
}
