import { useEffect, useRef } from 'react'
import { Bookmark, RotateCcw } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import GuideHistory from './GuideHistory'
import GuideReading from './GuideReading'
import GuideLeadOffer from './GuideLeadOffer'
import GuideCompanions from './GuideCompanions'
import '../../styles/GuideResult.css'

export default function GuideResult({ values, result, onSave, onOrder, onRestart, saved, notice }) {
  const reduced = useReducedMotion(), region = useRef(null)
  const lead = result.primaryOffer || result.offers?.[0]
  const hasProducts = Boolean(result.hasProducts && lead)
  useEffect(() => {
    const frame = requestAnimationFrame(() => region.current?.querySelector('.guide-result__message')?.scrollIntoView({ block: 'start', behavior: reduced ? 'instant' : 'smooth' }))
    return () => cancelAnimationFrame(frame)
  }, [result, reduced])
  return <motion.section ref={region} className="guide-result guide-result--fluid" aria-labelledby="guide-result-title" tabIndex={0} data-lenis-prevent
    initial={reduced ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduced ? 0 : .3 }}>
    {values.forWhom && <GuideHistory values={values} step={4} />}
    <GuideReading values={values} result={result} lead={lead} hasProducts={hasProducts} />
    <GuideLeadOffer lead={lead} result={result} onOrder={onOrder} />
    <GuideCompanions categories={result.secondaryCategories} onOrder={onOrder} />
    <div className="guide-result__actions">
      {hasProducts && <button type="button" onClick={onSave} disabled={!lead?.variantId || saved}><Bookmark size={16} /> {saved ? 'Saved to your account' : 'Save this edit'}</button>}
      <button type="button" className="guide-btn-luxury-secondary" onClick={onRestart}><RotateCcw size={14} /><span>Begin again</span></button>
    </div>
    {notice && <p className="guide-note" role="status">{notice}</p>}
  </motion.section>
}
