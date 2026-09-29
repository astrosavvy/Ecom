import { Link } from 'react-router-dom'

export default function ShopFooter({ onSelectIntention }) {
  return (
    <footer className="livora-footer">
      <div className="livora-footer__top">
        <div className="livora-footer__brand">
          <img src="/favicon.png" alt="Younoya crest" />
          <h3>YOUNOYA</h3>
          <p>Astrology-backed gifting, curated for what matters. Consecrated heirlooms for every chapter.</p>
        </div>
        <div className="livora-footer__nav">
          <div>
            <h4>The Collection</h4>
            <ul>
              <li><a href="#pieces">The 10 Brooches</a></li>
              <li><Link to="/find-a-gift">Aster Gift Finder</Link></li>
              <li><Link to="/blog">The Journal</Link></li>
            </ul>
          </div>
          <div>
            <h4>Vedic Intentions</h4>
            <ul>
              <li><button type="button" onClick={() => onSelectIntention('confidence-power')}>Courage & Presence</button></li>
              <li><button type="button" onClick={() => onSelectIntention('vitality-balance')}>Growth & Vitality</button></li>
              <li><button type="button" onClick={() => onSelectIntention('love-connection')}>Love & Devotion</button></li>
              <li><button type="button" onClick={() => onSelectIntention('protection')}>Instinct & Focus</button></li>
            </ul>
          </div>
          <div>
            <h4>Atelier Support</h4>
            <ul>
              <li><Link to="/admin">Admin Console</Link></li>
              <li><a href="mailto:care@younoya.com">care@younoya.com</a></li>
              <li><span>Complimentary Insured Delivery Across India</span></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="livora-footer__bottom">
        <span>© {new Date().getFullYear()} YOUNOYA. All rights reserved. Consecrated in Jaipur & New Delhi.</span>
        <div className="livora-footer__links">
          <Link to="/blog">Journal</Link>
          <span>•</span>
          <Link to="/find-a-gift">Gift Consultation</Link>
          <span>•</span>
          <a href="#pieces">Browse Pieces</a>
        </div>
      </div>
    </footer>
  )
}
