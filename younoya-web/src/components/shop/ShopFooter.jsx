import { Link } from 'react-router-dom'
import { Heart, MessageCircle, Sparkles } from 'lucide-react'

const BENEFITS = [
  { icon: Heart, title: 'Meaningful symbols', detail: 'Motifs with a story' },
  { icon: Sparkles, title: 'Guided selection', detail: 'Led by your intention' },
  { icon: MessageCircle, title: 'Personal care', detail: 'Questions welcome' },
]

export default function ShopFooter() {
  return (
    <footer className="shop-footer">
      <div className="shop-footer__inner">
        <div className="shop-footer__benefits" aria-label="The Younoya approach">
          {BENEFITS.map(({ icon: Icon, title, detail }) => (
            <div className="shop-footer__benefit" key={title}>
              <Icon size={21} strokeWidth={1.3} aria-hidden="true" />
              <span><strong>{title}</strong><small>{detail}</small></span>
            </div>
          ))}
        </div>
        <div className="shop-footer__identity">
          <Link to="/" className="shop-footer__mark" aria-label="Younoya home">YOUNOYA <span>✦</span></Link>
          <span className="shop-footer__tagline">For every chapter.</span>
        </div>
        <div className="shop-footer__details">
          <nav className="shop-footer__nav" aria-label="Footer navigation">
            <a href="#pieces">Collection</a>
            <Link to="/find-a-gift">Gift guide</Link>
            <Link to="/blog">Journal</Link>
          </nav>
          <a className="shop-footer__email" href="mailto:care@younoya.com">care@younoya.com</a>
          <small className="shop-footer__copyright">© {new Date().getFullYear()} Younoya</small>
        </div>
      </div>
    </footer>
  )
}
