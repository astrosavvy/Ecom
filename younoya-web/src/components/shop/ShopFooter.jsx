import { Link } from 'react-router-dom'
import PolicyLinks from '../PolicyLinks'
import '../../styles/Policies.css'
import { Gift, Heart, MessageCircle, Sparkles } from 'lucide-react'
import ShopCommunity from './ShopCommunity'

const BENEFITS = [
  { icon: Heart, title: 'Meaningful motifs', detail: 'A story in every piece' },
  { icon: Sparkles, title: 'Guided selection', detail: 'Led by your intention' },
  { icon: Gift, title: 'Personal gifting', detail: 'Add a note for someone' },
  { icon: MessageCircle, title: 'Atelier care', detail: 'Questions are welcome' },
]

export default function ShopFooter() {
  return (
    <footer className="atelier-footer">
      <div className="atelier-footer__lead">
        <div className="atelier-footer__benefits" aria-label="The Younoya approach">
          <h2>Why Younoya<span>?</span></h2>
          {BENEFITS.map(({ icon: Icon, title, detail }) => (
            <div className="atelier-footer__benefit" key={title}>
              <Icon size={25} strokeWidth={1.5} aria-hidden="true" />
              <span><strong>{title}</strong><small>{detail}</small></span>
            </div>
          ))}
        </div>
        <ShopCommunity />
      </div>

      <div className="atelier-footer__base">
        <div className="atelier-footer__main">
          <div className="atelier-footer__brand">
            <Link to="/" aria-label="Younoya home"><img src="/favicon.png" alt="" /><span>YOUNOYA</span></Link>
            <p>For every chapter.<br />Gifts chosen with intention.</p>
          </div>
          <nav aria-label="Shop footer navigation" className="atelier-footer__links">
            <div><h3>Shop</h3><Link to="/shop#pieces">The collection</Link><Link to="/shop?saved=1#pieces">Saved pieces</Link><Link to="/find-a-gift">Find your piece</Link></div>
            <div><h3>Explore</h3><Link to="/blog">The journal</Link><Link to="/find-a-gift">Gift guide</Link><a href="#shop-top">Back to top</a></div>
            <div className="atelier-footer__care">
              <h3>Here to help</h3>
              <Link to="/account/orders">Your orders</Link>
              <Link to="/shipping-policy">Shipping Policy</Link>
              <Link to="/cancellation-and-refunds">Cancellation and Refunds</Link>
              <Link to="/contact">Contact Us</Link>
              <a className="atelier-footer__email" href="mailto:support@younoya.com">support@younoya.com</a>
            </div>
          </nav>
        </div>
        <div className="atelier-footer__fineprint">
          <PolicyLinks paths={['/terms-and-conditions', '/privacy-policy']} includeOrders={false} className="atelier-footer__legal" />
          <div className="atelier-footer__bottom"><span>© {new Date().getFullYear()} Younoya Atelier. All rights reserved.</span><span>Made for moments that stay.</span></div>
        </div>
      </div>
    </footer>
  )
}
