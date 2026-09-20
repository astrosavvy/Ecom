import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import '../styles/FeaturedGifts.css'

const PRODUCTS = [
  {
    id: 1,
    emoji: '🕯️',
    sign: 'Scorpio',
    name: 'Obsidian Ritual Candle',
    desc: "Hand-poured soy candle with dark musk & sandalwood — perfect for Scorpio's depth.",
    price: '$38',
    badge: 'Bestseller',
  },
  {
    id: 2,
    emoji: '💎',
    sign: 'Leo',
    name: 'Golden Citrine Necklace',
    desc: 'A radiant citrine pendant in 14k gold vermeil — for the sign that rules the sun.',
    price: '$72',
    badge: null,
  },
  {
    id: 3,
    emoji: '📓',
    sign: 'Virgo',
    name: 'Linen Manifestation Journal',
    desc: 'Premium linen journal with guided lunar prompts — organized just how Virgo likes it.',
    price: '$29',
    badge: 'New',
  },
  {
    id: 4,
    emoji: '🌿',
    sign: 'Taurus',
    name: 'Botanical Self-Care Set',
    desc: 'Rose & jasmine body oil, jade roller, and herbal bath salts — pure Taurus indulgence.',
    price: '$54',
    badge: null,
  },
  {
    id: 5,
    emoji: '🔮',
    sign: 'Pisces',
    name: 'Amethyst Crystal Sphere',
    desc: 'A hand-polished amethyst sphere for dreamy Pisces — enhances intuition & calm.',
    price: '$45',
    badge: 'Popular',
  },
  {
    id: 6,
    emoji: '🗺️',
    sign: 'Sagittarius',
    name: 'Star Map Print',
    desc: 'Custom night sky from any date & location — capture the cosmos of a special moment.',
    price: '$42',
    badge: null,
  },
]

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const cardReveal = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
}

export default function FeaturedGifts() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section className="gifts section-pad" id="gifts" ref={ref}>
      <div className="container">
        <motion.div
          className="gifts__header"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="gifts__label">✦ Curated Collection</p>
          <h2 className="gifts__title">
            Cosmic <span className="gold-text">Bestsellers</span>
          </h2>
          <p className="gifts__desc">Gifts aligned with the stars — loved by thousands.</p>
        </motion.div>

        <motion.div
          className="gifts__grid"
          variants={stagger}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          {PRODUCTS.map((p) => (
            <motion.div key={p.id} className="product-card" variants={cardReveal}>
              <div className="product-card__img">{p.emoji}</div>
              {p.badge && <span className="product-card__badge">{p.badge}</span>}
              <div className="product-card__info">
                <p className="product-card__sign">♦ {p.sign}</p>
                <h3 className="product-card__name">{p.name}</h3>
                <p className="product-card__desc">{p.desc}</p>
                <div className="product-card__footer">
                  <span className="product-card__price">{p.price}</span>
                  <button className="product-card__add">Add to Cart</button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Banner */}
        <motion.div
          className="cta-banner"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="cta-banner__glow" />
          <h3>
            Don't know their sign? <span className="gold-text">No problem.</span>
          </h3>
          <p>Enter their birthday and we'll reveal the perfect cosmic match.</p>
          <a href="#zodiac" className="btn btn--primary">
            Try the Gift Finder ✦
          </a>
        </motion.div>
      </div>
    </section>
  )
}
