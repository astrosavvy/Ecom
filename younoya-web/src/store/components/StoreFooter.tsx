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
    <footer className="store-footer" style={{ background: '#FFFBF0', borderTop: '1px solid rgba(212,175,55,0.16)' }}>
      <div className="store-footer__grid" style={{ maxWidth: '1180px', margin: '0 auto', padding: '48px clamp(16px,4vw,32px) 36px', display: 'grid', gridTemplateColumns: '1.2fr 0.8fr 0.8fr 0.9fr', gap: '32px' }}>
        <div className="store-footer__brand">
          <Link to="/" aria-label="YOUNOYA home">
            <img src="/younoya-gold.svg" alt="YOUNOYA for every chapter" style={{ height: '48px', width: 'auto', display: 'block', marginBottom: '14px' }} />
          </Link>
          <p className="store-footer__brand-desc" style={{ fontFamily: 'var(--yn-font-body)', fontSize: '13px', lineHeight: 1.65, color: '#6b645c', maxWidth: '32ch' }}>
            For every chapter. Personalised gifting, curated by your stars — not the shelf. Objects chosen for what they mean, not just how they look.
          </p>
          <p style={{ marginTop: '14px', fontFamily: 'var(--yn-font-label)', fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(26,26,30,0.45)' }}>
            Astrology • Intention • Craft
          </p>
        </div>
        <div>
          <h4 className="store-footer__col-title" style={{ fontFamily: 'var(--yn-font-label)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#1a1a1e', marginBottom: '14px' }}>Shop</h4>
          <div className="store-footer__links" style={{ display: 'grid', gap: '9px' }}>
            {SHOP_LINKS.map(l => <Link key={l.path} to={l.path} className="store-footer__link" style={{ fontFamily: 'var(--yn-font-body)', fontSize: '13px', color: '#4a443c', textDecoration: 'none' }}>{l.label}</Link>)}
          </div>
        </div>
        <div>
          <h4 className="store-footer__col-title" style={{ fontFamily: 'var(--yn-font-label)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#1a1a1e', marginBottom: '14px' }}>Explore</h4>
          <div className="store-footer__links" style={{ display: 'grid', gap: '9px' }}>
            {EXPLORE_LINKS.map(l => <Link key={l.path} to={l.path} className="store-footer__link" style={{ fontFamily: 'var(--yn-font-body)', fontSize: '13px', color: '#4a443c', textDecoration: 'none' }}>{l.label}</Link>)}
          </div>
        </div>
        <div>
          <h4 className="store-footer__col-title" style={{ fontFamily: 'var(--yn-font-label)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#1a1a1e', marginBottom: '14px' }}>Company</h4>
          <div className="store-footer__links" style={{ display: 'grid', gap: '9px' }}>
            {COMPANY_LINKS.map(l => <Link key={l.path} to={l.path} className="store-footer__link" style={{ fontFamily: 'var(--yn-font-body)', fontSize: '13px', color: '#4a443c', textDecoration: 'none' }}>{l.label}</Link>)}
          </div>
        </div>
      </div>
      <div className="store-footer__bottom" style={{ maxWidth: '1180px', margin: '0 auto', padding: '16px clamp(16px,4vw,32px) 28px', borderTop: '1px solid rgba(212,175,55,0.12)', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '12px', alignItems: 'center' }}>
        <p className="store-footer__copy" style={{ fontFamily: 'var(--yn-font-label)', fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(26,26,30,0.5)' }}>© {new Date().getFullYear()} YOUNOYA. All rights reserved. — For every chapter.</p>
        <div style={{ display: 'flex', gap: '14px' }}>
          <Link to="/privacy" style={{ fontFamily: 'var(--yn-font-label)', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(26,26,30,0.55)', textDecoration: 'none' }}>Privacy</Link>
          <Link to="/terms" style={{ fontFamily: 'var(--yn-font-label)', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(26,26,30,0.55)', textDecoration: 'none' }}>Terms</Link>
          <Link to="/contact" style={{ fontFamily: 'var(--yn-font-label)', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(26,26,30,0.55)', textDecoration: 'none' }}>Contact</Link>
        </div>
      </div>
      <style>{`
        @media (max-width: 860px) {
          .store-footer__grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 520px) {
          .store-footer__grid { grid-template-columns: 1fr !important; }
        }
        .store-footer__link:hover { color: var(--yn-gold-strong) !important; }
      `}</style>
    </footer>
  )
}
