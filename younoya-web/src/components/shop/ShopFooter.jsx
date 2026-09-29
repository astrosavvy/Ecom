import { Link } from 'react-router-dom'

export default function ShopFooter() {
  return (
    <footer className="shop-footer">
      <div className="shop-footer__inner">
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
