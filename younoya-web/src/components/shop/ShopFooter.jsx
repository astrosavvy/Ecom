import { Link } from 'react-router-dom'
import { Gift, Heart, MessageCircle, Sparkles } from 'lucide-react'

const BENEFITS = [
  { icon: Heart, title: 'MEANINGFUL PIECES', detail: 'Every symbol has a story' },
  { icon: Sparkles, title: 'GUIDED CHOICE', detail: 'Led by your intention' },
  { icon: Gift, title: 'PERSONAL GIFTING', detail: 'A piece for their moment' },
  { icon: MessageCircle, title: 'ATELIER SUPPORT', detail: 'Here when you need us' },
]

export default function ShopFooter() {
  return (
    <footer className="shop-footer">
      <div className="shop-footer__inner">
        <div className="shop-footer__benefits" aria-label="The Younoya approach">
          {BENEFITS.map(({ icon: Icon, title, detail }) => (
            <div className="shop-footer__benefit" key={title}>
              <Icon size={19} strokeWidth={1.4} aria-hidden="true" />
              <span><strong>{title}</strong><small>{detail}</small></span>
            </div>
          ))}
        </div>
        <div className="shop-footer__body">
          <div className="shop-footer__brand">
            <Link to="/" className="shop-footer__mark" aria-label="Younoya home">YOUNOYA <span>✦</span></Link>
            <p>For every chapter.</p>
          </div>
          <nav className="shop-footer__nav" aria-label="Footer navigation">
            <strong>QUICK LINKS</strong>
            <a href="#pieces">Collection</a>
            <Link to="/find-a-gift">Gift guide</Link>
            <Link to="/blog">Journal</Link>
          </nav>
          <div className="shop-footer__contact">
            <strong>ATELIER CARE</strong>
            <a href="mailto:care@younoya.com">care@younoya.com</a>
            <small>© {new Date().getFullYear()} Younoya</small>
          </div>
        </div>
      </div>
    </footer>
  )
}
