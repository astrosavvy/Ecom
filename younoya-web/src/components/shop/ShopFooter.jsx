import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'

export default function ShopFooter() {
  return (
    <footer className="shop-footer">
      <div className="shop-footer__inner">
        <div className="shop-footer__eyebrow"><span>✦</span> YOUNOYA ATELIER <span>✦</span></div>
        <div className="shop-footer__main">
          <div className="shop-footer__lead">
            <h2>For what <em>matters.</em></h2>
            <p>Symbolic objects, chosen with intention and guided by astrological insight.</p>
            <Link to="/find-a-gift" className="shop-footer__consult">Let Younoya choose <ArrowUpRight size={17} strokeWidth={1.5} /></Link>
          </div>
          <nav className="shop-footer__nav" aria-label="Footer navigation">
            <div>
              <h3>Explore</h3>
              <a href="#pieces">The collection</a>
              <Link to="/find-a-gift">Find a gift</Link>
              <Link to="/blog">The journal</Link>
            </div>
            <div>
              <h3>Connect</h3>
              <a href="mailto:care@younoya.com">care@younoya.com</a>
              <span>We are here to help you choose.</span>
            </div>
          </nav>
        </div>
        <div className="shop-footer__bottom">
          <Link to="/" className="shop-footer__mark" aria-label="Younoya home">YOUNOYA <span>✦</span></Link>
          <span>© {new Date().getFullYear()} YOUNOYA. For every chapter.</span>
          <a href="#shop-top" className="shop-footer__top-link">Back to top ↑</a>
        </div>
      </div>
    </footer>
  )
}
