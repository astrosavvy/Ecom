import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Check, Heart, ShieldAlert, Sparkles, Compass } from 'lucide-react'
import { MONEY_AMPLIFIER_HIGHLIGHTS } from '../data/moneyAmplifier'
import { storeRequest } from '../lib/giftGuideApi'
import { useCart } from '../context/CartContext'
import { useSiteConfig } from '../context/SiteConfigContext'
import NavratriGallery from '../components/NavratriGallery'
import ProductDeliveryNote from '../components/ProductDeliveryNote'
import ShopFooter from '../components/shop/ShopFooter'
import '../styles/Navratri.css'
import '../styles/Kalash.css'
import '../styles/ShopFooter.css'

export default function MoneyAmplifierDetail({ product }) {
  const { addToCart, setIsOpen } = useCart()
  const { checkoutEnabled } = useSiteConfig()
  const [availability, setAvailability] = useState(null)
  const [added, setAdded] = useState(false)
  const [saved, setSaved] = useState(() => {
    try { return JSON.parse(localStorage.getItem('younoya-saved-pieces') || '[]').includes(product.id) } catch { return false }
  })

  useEffect(() => {
    const controller = new AbortController()
    storeRequest(`/store/commerce/products/${encodeURIComponent(product.handle)}/availability`, { signal: controller.signal })
      .then(setAvailability)
      .catch(() => setAvailability(null))
    return () => controller.abort()
  }, [product.handle])

  // Optimistic default: available unless backend explicitly signals out of stock
  const isExplicitlyUnavailable = availability !== null && (availability.purchasable === false || availability.availableQuantity <= 0)
  const isPriceMismatch = availability !== null && availability.price && availability.price !== product.priceNum
  const available = checkoutEnabled !== false && !isExplicitlyUnavailable && !isPriceMismatch

  function save() {
    let previous
    try { previous = JSON.parse(localStorage.getItem('younoya-saved-pieces') || '[]') } catch { previous = [] }
    const next = saved ? previous.filter(id => id !== product.id) : [...previous, product.id]
    setSaved(!saved)
    try { localStorage.setItem('younoya-saved-pieces', JSON.stringify(next)) } catch {}
  }

  function order() {
    if (!available) return
    addToCart({
      id: `${product.id}::standard`,
      handle: product.handle,
      name: product.name,
      subtitle: product.subtitle,
      price: product.price,
      priceNum: product.priceNum,
      image: product.cardImage || product.primaryImage,
      chapter: 'Money Amplifier & Protector Set'
    }, 1)
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
      aria-describedby={!available ? 'money-amplifier-status' : undefined}
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

  return (
    <div className="navratri-page kalash-page" id="shop-top">
      <div className="navratri-shell">
        <nav className="navratri-breadcrumb" aria-label="Breadcrumb">
          <Link to="/shop"><ArrowLeft size={15} /> The collection</Link>
          <span>Abundance &amp; Shield</span>
        </nav>

        <section className="navratri-intro" aria-labelledby="amplifier-title">
          <NavratriGallery photos={product.gallery} />

          <div className="navratri-buybox">
            <span className="navratri-eyebrow">YOUNOYA · THE WEALTH &amp; SHIELD EDIT</span>
            <h1 id="amplifier-title">Money Amplifier &amp; <em>Protector Set.</em></h1>
            <h2>Curated crystal Kurma &amp; Hamsa Evil Eye talisman</h2>

            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              background: '#FFF5F0',
              border: '1px solid #FED7AA',
              borderRadius: '20px',
              color: '#9A3412',
              fontSize: '0.8rem',
              fontWeight: 500,
              letterSpacing: '0.02em',
              margin: '8px 0 16px'
            }}>
              <ShieldAlert size={14} />
              <span>Delicate heirloom — handle with care</span>
            </div>

            <p className="navratri-lead">
              Whether you lack opportunities to earn money or face difficulties in saving and sustaining the money, this 2-in-1 combination curated by YOUNOYA unites a unique crystalline pairing that not only helps attract new avenues of abundance, but amplifies and shields your wealth from evil nazar.
            </p>

            <div className="navratri-price">
              <strong>₹7,799</strong>
              <span>Consecrated 2-in-1 set</span>
            </div>

            <dl className="navratri-facts">
              <div>
                <dt>The collection</dt>
                <dd>Abundance altar &amp; sacred talismans</dd>
              </div>
              <div>
                <dt>Intention</dt>
                <dd>Wealth amplification &amp; nazar protection</dd>
              </div>
              <div>
                <dt>Delivery</dt>
                <dd>Free shipping within India<ProductDeliveryNote /></dd>
              </div>
            </dl>

            <button className="navratri-save" type="button" aria-pressed={saved} onClick={save}>
              <Heart size={18} fill={saved ? 'currentColor' : 'none'} />
              {saved ? 'Saved' : 'Save this piece'}
            </button>

            {purchase}

            {!available && (
              <p className="navratri-availability" id="money-amplifier-status">
                This edition is currently unavailable. Save it to revisit the collection.
              </p>
            )}

            <a className="navratri-details-link" href="#amplifier-details">
              Explore the sacred synergy &amp; placement <ArrowRight size={15} />
            </a>
          </div>
        </section>

        {/* Sacred Synergy & Story Section */}
        <section className="kalash-story" aria-labelledby="amplifier-story-title">
          <h2 id="amplifier-story-title">
            The alchemy of earning.<br />
            <em>The discipline of protection.</em>
          </h2>
          <div>
            <p>
              In Vedic cosmology, wealth requires two distinct energies to thrive: the dynamic current of incoming abundance (Dhana Agamana) and the impenetrable shield that preserves it against envious glances, psychic drain, and unexpected outflow (Raksha Kavacha).
            </p>
            <p>
              This festive season, gift the joy of abundance, prosperity, wealth, and protection in this all-in-one astrologically curated combination by YOUNOYA. The iridescent crystal Kurma (sacred tortoise) anchors continuous opportunity and steady flow, while the blue marbled Hamsa plate reflects and dispels negative nazar.
            </p>
          </div>
        </section>

        {/* 4 Pillars of the Set */}
        <section className="kalash-contents" id="amplifier-details" aria-labelledby="amplifier-features-title">
          <header>
            <h2 id="amplifier-features-title">Within the <em>curation.</em></h2>
            <p>
              Every set arrives in the YOUNOYA signature gift box, complete with placement guidance and velvet protective cushioning.
            </p>
          </header>
          <ol>
            {MONEY_AMPLIFIER_HIGHLIGHTS.map(([title, desc], idx) => (
              <li key={title}>
                <span>{String(idx + 1).padStart(2, '0')}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Sacred Placement & Vidhi */}
        <section className="kalash-intentions" aria-labelledby="amplifier-placement-title">
          <h2 id="amplifier-placement-title">Sacred placement <em>&amp; direction.</em></h2>
          <p>
            To harness the synergistic resonance of this 2-in-1 combination, follow these traditional Vastu &amp; astrological principles:
          </p>
          <ul>
            <li>
              <Compass size={18} style={{ color: '#D6B06A', marginBottom: 6 }} />
              <h3>North-East (Ishanya) Altar</h3>
              <p>Place upon your personal puja altar or spiritual shelf to consecrate your daily prayers with financial peace.</p>
            </li>
            <li>
              <Sparkles size={18} style={{ color: '#D6B06A', marginBottom: 6 }} />
              <h3>North Direction (Kuber Sthana)</h3>
              <p>Align the Kurma facing inward into your living room or study to symbolically invite new wealth into the sanctuary.</p>
            </li>
            <li>
              <ShieldAlert size={18} style={{ color: '#D6B06A', marginBottom: 6 }} />
              <h3>Entryway Protection</h3>
              <p>Keep the Hamsa plate oriented toward the doorway to quietly neutralize envy and negative vibrations before they cross the threshold.</p>
            </li>
            <li>
              <Heart size={18} style={{ color: '#D6B06A', marginBottom: 6 }} />
              <h3>Festive Gifting</h3>
              <p>An auspicious gesture for housewarmings, Diwali blessings, newly founded ventures, and family beginnings.</p>
            </li>
          </ul>
        </section>

        {/* Lifestyle / Ambient Visual Presentation */}
        <section className="kalash-gifting">
          <img
            src={product.gallery[1]?.src || product.gallery[0].src}
            alt="Money Amplifier & Protector Set in sunlit ambient travertine setting"
            loading="lazy"
            width="852"
            height="1271"
            onError={e => { e.currentTarget.hidden = true }}
          />
          <div>
            <h2>A festive gesture,<br /><em>enduring in its intention.</em></h2>
            <p>
              Crafted for those who value both aesthetic restraint and profound symbolic resonance. The iridescent crystalline facets catch natural sunlight and candle flames, transforming every space into an intentional altar of calm prosperity.
            </p>
          </div>
        </section>

        {/* Specifications & Delicate Item Care */}
        <section className="navratri-notes">
          <div>
            <h2>Care &amp; handling <em>instructions.</em></h2>
            <p>
              <strong>Delicate item — handle with care.</strong> Both the iridescent crystal Kurma and the artisan marbled Hamsa plate are precision crafted. Avoid sudden drops, rough friction, or abrasive surfaces.
            </p>
            <p>
              Clean gently with a soft dry microfiber cloth. Do not immerse in chemical solvents or hot water. Consecrated with care for your sacred altar or home sanctuary.
            </p>
          </div>

          <div>
            <h3>Piece specifications</h3>
            <dl className="kalash-specs">
              <div>
                <dt>Brand</dt>
                <dd>YOUNOYA</dd>
              </div>
              <div>
                <dt>Material</dt>
                <dd>{product.specs.material}</dd>
              </div>
              <div>
                <dt>Item weight</dt>
                <dd>400 g</dd>
              </div>
              <div>
                <dt>Weight with box</dt>
                <dd>700 g (0.70 kg)</dd>
              </div>
              <div>
                <dt>Dimensions</dt>
                <dd>{product.specs.dimensions}</dd>
              </div>
              <div>
                <dt>Packaging</dt>
                <dd>YOUNOYA signature presentation box with velvet insert</dd>
              </div>
            </dl>

            <Link to="/shipping-policy">Shipping information <ArrowRight size={14} /></Link>
            <Link to="/cancellation-and-refunds">Cancellation &amp; refunds <ArrowRight size={14} /></Link>
            <a href="mailto:support@younoya.com">Ask the atelier <ArrowRight size={14} /></a>
          </div>
        </section>
      </div>

      <ShopFooter />

      {/* Sticky Mobile Purchase Bar */}
      <div className="navratri-mobile-bar">
        <span>2-in-1 set<strong>₹7,799</strong></span>
        {purchase}
      </div>
    </div>
  )
}
