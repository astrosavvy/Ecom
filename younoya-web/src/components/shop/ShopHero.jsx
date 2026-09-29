import { Link } from 'react-router-dom'
import { ArrowUpRight, Sparkles } from 'lucide-react'

export default function ShopHero() {
  return (
    <section className="livora-hero-bar" aria-label="The Younoya collection">
      <div className="livora-hero-bar__left">
        <span className="livora-kicker">THE YOUNOYA EDIT ✦</span>
        <h1 className="livora-hero-bar__title">Wear your meaning.<br /><em>Every day.</em></h1>
        <p className="livora-hero-bar__desc">A collection of symbolic brooches for the people, moments and intentions that stay with you.</p>
        <div className="livora-hero-bar__buttons">
          <a href="#pieces" className="livora-btn livora-btn--gold">Explore the collection</a>
          <Link to="/find-a-gift" className="livora-btn-watch">
            <span className="livora-play-icon"><Sparkles size={16} strokeWidth={1.5} /></span>
            <span>Find your piece</span>
          </Link>
        </div>
        <div className="livora-hero-bar__proof">
          <span className="livora-hero-bar__proof-text">Ten pieces. A meaning for every wearer.</span>
        </div>
      </div>
      <div className="livora-hero-bar__right">
        <span className="livora-hero-bar__orbit livora-hero-bar__orbit--one" aria-hidden="true" />
        <span className="livora-hero-bar__orbit livora-hero-bar__orbit--two" aria-hidden="true" />
        <span className="livora-hero-bar__spark livora-hero-bar__spark--one" aria-hidden="true">✦</span>
        <span className="livora-hero-bar__spark livora-hero-bar__spark--two" aria-hidden="true">✦</span>
        <Link className="livora-hero-bar__arch-frame" to="/product/wild-poise" aria-label="Discover Wild Poise">
          <img src="/media/shop-wild-poise-editorial.webp" alt="Wild Poise jaguar brooch on a warm stone plinth" fetchPriority="high" />
        </Link>
        <Link className="livora-hero-bar__floating-card" to="/product/wild-poise">
          <span className="livora-hero-bar__card-label">THE FEATURED PIECE</span>
          <span className="livora-hero-bar__card-title">Wild Poise <ArrowUpRight size={17} strokeWidth={1.5} /></span>
          <strong>₹ 2,499</strong>
          <span className="livora-hero-bar__card-detail">Jaguar brooch · black metal</span>
        </Link>
      </div>
    </section>
  )
}
