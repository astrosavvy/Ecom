import { motion, useReducedMotion } from 'framer-motion'
import { intentions, questions } from './guideCopy'

export default function GuideHistory({ values, step }) {
  const reduced = useReducedMotion()
  const self = values.forWhom === 'self', titles = questions(self)
  const history = [values.forWhom && (self ? 'For myself' : 'For someone I cherish'),
    values.name && `${values.name}${!self && values.relation ? ` · ${values.relation}` : ''}`, values.moment,
    intentions.find(item => item.id === values.intention)?.name].slice(0, step).filter(Boolean)
  return <div className="guide-transcript" role="log" aria-label="Your gift conversation" aria-live="off">{history.map((answer, index) => <motion.div className="guide-exchange" key={index} initial={reduced ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
    <p className="guide-bubble guide-bubble--aster"><img src="/favicon.png" alt="" />{titles[index]}</p>
    <p className="guide-bubble guide-bubble--you"><span className="sr-only">You: </span>{answer}</p>
  </motion.div>)}</div>
}
