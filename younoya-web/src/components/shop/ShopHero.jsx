import { Link } from 'react-router-dom'
import { ArrowUpRight, Sparkles } from 'lucide-react'

export default function ShopHero() {
  return (
    <section className="livora-hero-bar" aria-label="The Younoya collection">
      <div className="livora-hero-bar__left">
        <span className="livora-kicker">THE YOUNOYA NAVRATRI EDIT</span>
        <h1 className="livora-hero-bar__title">Nine days of devotion.<br /><em>Kept together.</em></h1>
        <p className="livora-hero-bar__desc">Shringaar, colour and small devotional keepsakes. Nine individually packed daily kits, brought together in one complete box.</p>
        <div className="livora-hero-bar__buttons">
          <Link to="/product/navratri-shringaar-box" className="livora-btn livora-btn--gold">Discover the Navratri box</Link>
          <Link to="/find-a-gift" className="livora-btn-watch">
            <span className="livora-play-icon"><Sparkles size={16} strokeWidth={1.5} /></span>
            <span>Find your piece</span>
          </Link>
        </div>
        <div className="livora-hero-bar__proof">
          <span className="livora-hero-bar__proof-text">The complete nine-day set · ₹1,499</span>
        </div>
      </div>
      <div className="livora-hero-bar__right">
        <span className="livora-hero-bar__orbit livora-hero-bar__orbit--one" aria-hidden="true" />
        <span className="livora-hero-bar__orbit livora-hero-bar__orbit--two" aria-hidden="true" />
        <span className="livora-hero-bar__spark livora-hero-bar__spark--one" aria-hidden="true">✦</span>
        <span className="livora-hero-bar__spark livora-hero-bar__spark--two" aria-hidden="true">✦</span>
        <Link className="livora-hero-bar__arch-frame" to="/product/navratri-shringaar-box" aria-label="Discover the Navratri Shringaar Box">
          <img src="/media/navratri/red-kit-1200.webp" srcSet="/media/navratri/red-kit-600.webp 600w, /media/navratri/red-kit-1200.webp 1200w" sizes="(min-width: 960px) 40vw, 85vw" alt="Red Navratri daily kit detail, including Day 8 mehendi" fetchPriority="high" />
        </Link>
        <Link className="livora-hero-bar__floating-card" to="/product/navratri-shringaar-box">
          <span className="livora-hero-bar__card-label">THE NINE-DAY SET</span>
          <span className="livora-hero-bar__card-title">Navratri Shringaar <ArrowUpRight size={17} strokeWidth={1.5} /></span>
          <strong>₹ 1,499</strong>
          <span className="livora-hero-bar__card-detail">Nine daily kits</span>
        </Link>
      </div>
    </section>
  )
}
