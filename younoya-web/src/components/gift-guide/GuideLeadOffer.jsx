import { ShoppingBag } from 'lucide-react'
import { Link } from 'react-router-dom'
import WhatIsInside from './WhatIsInside'
import { destination, image, money, title } from './offerPresentation'

export default function GuideLeadOffer({ lead, result, onOrder }) {
  if (!lead) return null
  return <article id="guide-selected-piece" className="guide-result__lead guide-result__lead--hamper guide-selection" aria-labelledby="guide-selected-title">
    {image(lead) && <Link className="guide-result__image" to={destination(lead)}><img src={image(lead)} alt={lead.title} /></Link>}
    <div className="guide-result__copy">
      <span className="guide-eyebrow">Your chosen {lead.isHamper ? 'set' : 'piece'}</span>
      <h2 id="guide-selected-title"><Link to={destination(lead)}>{title(lead.title)}</Link></h2>
      {lead.story && <p className="guide-hamper-story">{lead.story}</p>}
      <strong className="guide-result__price">{money(lead.price)}</strong>
      <button className="guide-primary guide-lead-cta" type="button" disabled={!lead.variantId} onClick={() => onOrder(lead)}>
        <ShoppingBag size={16} /> Order this selection
      </button>
    </div>
    <div className="guide-selection__composition"><WhatIsInside combination={result.combination} offer={lead} /></div>
  </article>
}
