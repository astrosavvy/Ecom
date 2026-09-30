import { useEffect, useRef } from 'react'
import { ArrowUpRight, Bookmark, ShoppingBag } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { getProductByHandle } from '../../data/products'
import GuideHistory from './GuideHistory'

const money = value => `₹${((value || 0) / 100).toLocaleString('en-IN')}`
const destination = offer => `${offer.privateOffer ? '/offer/' : '/product/'}${offer.handle}`
const image = offer => !offer.privateOffer && getProductByHandle(offer.handle)?.shopCardImage || offer.image
const title = value => value === value.toUpperCase() ? value.toLowerCase().replace(/\b\w/g, letter => letter.toUpperCase()) : value

export default function GuideResult({ values, result, onSave, onOrder, onRestart, saved, notice }) {
  const reduced = useReducedMotion(), region = useRef(null)
  const [lead, ...others] = result.offers || []
  useEffect(() => {
    const frame = requestAnimationFrame(() => region.current?.querySelector('.guide-result__message')?.scrollIntoView({ block: 'start', behavior: reduced ? 'instant' : 'smooth' }))
    return () => cancelAnimationFrame(frame)
  }, [result, reduced])
  return <motion.section ref={region} className="guide-result" aria-labelledby="guide-result-title" tabIndex={0} data-lenis-prevent initial={reduced ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduced ? 0 : .25 }}>
    {values.forWhom && <GuideHistory values={values} step={4} />}
    <div className="guide-result__message">
      <span className="guide-eyebrow"><img src="/favicon.png" alt="" /> Aster · {result.previewOnly ? 'Collection preview' : result.method || 'Your personal edit'}</span>
      <h1 id="guide-result-title">A little meaning, <em>chosen for you.</em></h1>
      <p className="guide-result__note">{result.explanation}</p>
      {result.guide?.coverage === 'broader' && <p className="guide-note">This is broader chart guidance. A dedicated set for this planetary period is not yet available.</p>}
      {result.guide?.coverage === 'matrix-fallback' && <p className="guide-note">The dedicated set is not yet available. These in-stock pieces follow your chosen intention.</p>}
    </div>
    {lead && <article className="guide-result__lead">
      <Link className="guide-result__image" to={destination(lead)}>{image(lead) && <img src={image(lead)} alt={lead.title} />}</Link>
      <div className="guide-result__copy"><span className="guide-eyebrow">{lead.components?.length ? 'Your curated set' : 'Your chosen piece'}</span><h2><Link to={destination(lead)}>{title(lead.title)}</Link></h2>
        {result.setTitle && <p>Inspired by {result.setTitle}</p>}
        {lead.components?.length > 0 && <div className="guide-components"><strong>In this set</strong><ul>{lead.components.map((part, index) => <li key={index}>{typeof part === 'string' ? part : part.title}</li>)}</ul></div>}
        <strong className="guide-result__price">{money(lead.price)}</strong>
        <Link className="guide-result__details" to={destination(lead)}>Discover the piece <ArrowUpRight size={15} /></Link>
      </div>
    </article>}
    {others.length > 0 && <div className="guide-result__others"><h3>A few more possibilities</h3><div>{others.map(offer => <article key={offer.id}>
      <Link to={destination(offer)}>{image(offer) && <img src={image(offer)} alt="" />}<span>{title(offer.title)}<small>{money(offer.price)}</small></span><ArrowUpRight size={16} /></Link>
      {offer.variantId && <button type="button" aria-label={`Order ${offer.title}`} onClick={() => onOrder(offer)}><ShoppingBag size={16} /></button>}
    </article>)}</div></div>}
    {!lead && <p className="guide-note">No approved piece is available yet. <Link to="/shop">Explore the collection</Link> while the atelier prepares more.</p>}
    <div className="guide-result__actions">
      {lead && <button className="guide-primary" type="button" disabled={!lead.variantId} onClick={() => onOrder(lead)}><ShoppingBag size={16} /> Order this selection</button>}
      <button type="button" onClick={onSave} disabled={!lead?.variantId || saved}><Bookmark size={16} /> {saved ? 'Saved to your account' : 'Save this edit'}</button>
      <button type="button" onClick={onRestart}>Begin again</button>
    </div>
    {notice && <p className="guide-note" role="status">{notice}</p>}
  </motion.section>
}
