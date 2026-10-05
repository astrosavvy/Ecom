import { ArrowDown, ArrowRight } from 'lucide-react'
import TypewriterText from './TypewriterText'
import { intentions } from './guideCopy'
import { image, title } from './offerPresentation'

function ReadingSection({ number, heading, subtitle, text }) {
  if (!text) return null
  return <section className="guide-reading__chapter" aria-labelledby={`guide-reading-${number}`}>
    <div className="guide-reading__heading">
      <span className="guide-reading__number" aria-hidden="true">{number}</span>
      <div><span className="guide-reading__subtitle">{subtitle}</span><h2 id={`guide-reading-${number}`}>{heading}</h2></div>
    </div>
    <p className="guide-reading__text"><TypewriterText text={text} /></p>
  </section>
}

export default function GuideReading({ values, result, lead, hasProducts }) {
  const combination = result.combination
  const experience = result.whatYouMightBeGoingThrough || combination?.whatYouMightBeGoingThrough || combination?.story || result.explanation || ''
  const rationale = result.whyChosen || combination?.whyChosen || (!hasProducts ? result.explanation || '' : '')
  const intention = result.primaryCategory?.categoryName || intentions.find(item => item.id === values.intention)?.name
  return <div className="guide-result__message guide-reading">
    <header className="guide-reading__intro">
      <span className="guide-eyebrow"><img src="/favicon.png" alt="" /> Aster · {result.previewOnly ? 'Collection preview' : 'Your personal curation'}</span>
      <h1 id="guide-result-title">{lead?.isHamper && combination?.setTitle ? <em>{combination.setTitle}</em> : <>Your personal <em>gifting edit.</em></>}</h1>
      {lead ? <a className="guide-reading__preview" href="#guide-selected-piece">
        {image(lead) && <img src={image(lead)} alt="" />}
        <span><small>{intention ? `Chosen for ${intention}` : 'Your chosen selection'}</small><strong>{title(lead.title)}</strong></span>
        <ArrowDown size={16} aria-hidden="true" />
      </a> : intention && <p className="guide-reading__intention">Chosen for <span>{intention}</span></p>}
      {combination?.tagline && <p className="guide-result__tagline">{combination.tagline}</p>}
    </header>
    <ReadingSection number="01" heading="What you’re experiencing" subtitle="The emotional & life chapter" text={experience} />
    <ReadingSection number="02" heading="Why these are suited to you" subtitle="Your intentional keepsakes & rituals" text={rationale} />
    {combination && (combination.challenge || combination.desiredShift) && <div className="guide-reading__shift">
      {combination.challenge && <span>{combination.challenge.replace(/_/g, ' ')}</span>}
      {combination.challenge && combination.desiredShift && <ArrowRight size={14} aria-hidden="true" />}
      {combination.desiredShift && <span>{combination.desiredShift.replace(/_/g, ' ')}</span>}
    </div>}
    {lead && <a className="guide-reading__connection" href="#guide-selected-piece"><span>Explore your selection</span><ArrowDown size={16} aria-hidden="true" /></a>}
  </div>
}
