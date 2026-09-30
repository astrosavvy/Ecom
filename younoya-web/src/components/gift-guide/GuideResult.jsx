import { ArrowRight, Bookmark, ShoppingBag } from 'lucide-react'
import { Link } from 'react-router-dom'

const money = value => `₹${((value || 0) / 100).toLocaleString('en-IN')}`

export default function GuideResult({ result, onSave, onOrder, onRestart, saved, notice }) {
  const [lead, ...others] = result.offers || []
  return <section className="guide-result" aria-labelledby="guide-result-title">
    <span className="guide-eyebrow">A NOTE FROM ASTER · {result.method?.toUpperCase()}</span>
    <h1 id="guide-result-title">Chosen with <em>intention.</em></h1>
    <p className="guide-result__note">{result.explanation}</p>
    {result.guide?.coverage === 'broader' && <p className="guide-note">This is broader chart guidance. A dedicated set for this planetary period is not yet available.</p>}
    {result.guide?.coverage === 'matrix-fallback' && <p className="guide-note">The dedicated set is not yet available. These in-stock pieces follow your chosen intention.</p>}
    {lead && <article className="guide-result__lead">
      <div className="guide-result__image">{lead.image && <img src={lead.image} alt={lead.title} />}</div>
      <div className="guide-result__copy"><span className="guide-eyebrow">THE LEAD SELECTION</span><h2><Link to={lead.privateOffer ? `/offer/${lead.handle}` : `/product/${lead.handle}`}>{lead.title}</Link></h2>
        {result.setTitle && <p>Inspired by {result.setTitle}</p>}
        {lead.components?.length > 0 && <div className="guide-components"><strong>In this set</strong><ul>{lead.components.map((part, index) => <li key={index}>{typeof part === 'string' ? part : part.title}</li>)}</ul></div>}
        <strong className="guide-result__price">{money(lead.price)}</strong>
        <button className="guide-primary" type="button" disabled={!lead.variantId} onClick={() => onOrder(lead)}><ShoppingBag size={18} /> Order this selection</button>
      </div>
    </article>}
    {others.length > 0 && <div className="guide-result__others"><h3>Also worth considering</h3><div>{others.map(offer => <article key={offer.id}>
      <Link to={offer.privateOffer ? `/offer/${offer.handle}` : `/product/${offer.handle}`}>
        {offer.image && <img src={offer.image} alt="" />}<span>{offer.title}<small>{money(offer.price)}</small></span></Link>
      <button type="button" aria-label={`Order ${offer.title}`} onClick={() => onOrder(offer)} disabled={!offer.variantId}><ArrowRight size={17} /></button>
    </article>)}</div></div>}
    {!lead && <p className="guide-note">No approved piece is available for this selection yet. <Link to="/shop">Explore the collection</Link> while the atelier prepares more.</p>}
    <div className="guide-result__actions"><button type="button" onClick={onSave} disabled={!lead?.variantId || saved}><Bookmark size={17} /> {saved ? 'Saved to your account' : 'Save this recommendation'}</button><button type="button" onClick={onRestart}>Begin again</button></div>
    {notice && <p className="guide-note" role="status">{notice}</p>}
  </section>
}
