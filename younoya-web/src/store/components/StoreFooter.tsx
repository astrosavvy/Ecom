import { Link } from 'react-router-dom'

const SHOP_LINKS = [
  { label: 'All Products', path: '/shop' },
  { label: 'Personalised Gifts', path: '/personalise' },
  { label: 'By Intention', path: '/shop?view=intentions' },
]

const EXPLORE_LINKS = [
  { label: 'Relationships', path: '/journal/category/relationships' },
  { label: 'Career & Growth', path: '/journal/category/career' },
  { label: 'Finance', path: '/journal/category/finance' },
  { label: 'Wellbeing', path: '/journal/category/wellbeing' },
  { label: 'Home & Vastu', path: '/journal/category/home-vastu' },
]

const COMPANY_LINKS = [
  { label: 'About YOUNOYA', path: '/about' },
  { label: 'Journal', path: '/journal' },
  { label: 'Privacy Policy', path: '/privacy' },
  { label: 'Terms of Service', path: '/terms' },
  { label: 'Contact', path: '/contact' },
]

export default function StoreFooter() {
  return (
    <footer className="store-footer">
      <div className="store-footer__grid">
        <div className="store-footer__brand">
          <img src="/brand.webp" alt="YOUNOYA" style={{ height: 32, opacity: 0.9 }} />
          <p className="store-footer__brand-desc">
            Personalised gifting. Personal meaning. Discover objects selected not only for how they look, but for what they can represent in your journey.
          </p>
        </div>
        <div>
          <h4 className="store-footer__col-title">Shop</h4>
          <div className="store-footer__links">
            {SHOP_LINKS.map(l => <Link key={l.path} to={l.path} className="store-footer__link">{l.label}</Link>)}
          </div>
        </div>
        <div>
          <h4 className="store-footer__col-title">Explore</h4>
          <div className="store-footer__links">
            {EXPLORE_LINKS.map(l => <Link key={l.path} to={l.path} className="store-footer__link">{l.label}</Link>)}
          </div>
        </div>
        <div>
          <h4 className="store-footer__col-title">Company</h4>
          <div className="store-footer__links">
            {COMPANY_LINKS.map(l => <Link key={l.path} to={l.path} className="store-footer__link">{l.label}</Link>)}
          </div>
        </div>
      </div>
      <div className="store-footer__bottom">
        <p className="store-footer__copy">© {new Date().getFullYear()} YOUNOYA. All rights reserved.</p>
      </div>
    </footer>
  )
}
