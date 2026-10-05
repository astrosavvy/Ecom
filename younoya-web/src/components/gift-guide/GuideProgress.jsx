import { Check } from 'lucide-react'

const chapters = ['Recipient', 'Connection', 'Occasion', 'Intention', 'Details']

export default function GuideProgress({ step, self }) {
  const chapter = ['Who it’s for', self ? 'A little about you' : 'Your connection', 'The moment', 'The intention', 'A personal touch'][step]
  return <div className="guide-progress">
    <div className="guide-progress__heading">
      <div className="guide-progress__chapter"><span>Your personal edit</span><strong>{chapter}</strong></div>
      <span className="guide-progress__count"><b>{String(step + 1).padStart(2, '0')}</b><span aria-hidden="true"> / </span><span className="sr-only"> of </span>05</span>
    </div>
    <ol className="guide-progress__chapters" aria-label="Gift guide chapters">
      {chapters.map((label, index) => <li key={label} aria-label={`${index === 1 && self ? 'You' : label}${index < step ? ' · completed' : index === step ? ' · current' : ''}`} className={index < step ? 'is-complete' : index === step ? 'is-current' : ''} aria-current={index === step ? 'step' : undefined}>
        <span className="guide-progress__mark" aria-hidden="true">{index < step ? <Check size={11} strokeWidth={1.5} /> : index + 1}</span>
        <span className="guide-progress__name">{index === 1 && self ? 'You' : label}</span>
      </li>)}
    </ol>
    <div className="sr-only" role="progressbar" aria-label="Gift guide progress" aria-valuemin={0} aria-valuemax={5} aria-valuenow={step + 1} aria-valuetext={`Step ${step + 1} of 5 · ${chapter}`} />
  </div>
}
