import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import '../styles/Testimonials.css'

const REVIEWS = [
  {
    id: 1,
    stars: '★★★★★',
    text: "I gifted my Scorpio best friend the Obsidian Candle and she said it was the most 'her' gift she's ever received. The astrology card was such a beautiful touch.",
    name: 'Mira K.',
    sign: '♊ Gemini',
    avatar: '🌸',
  },
  {
    id: 2,
    stars: '★★★★★',
    text: "This concept is genius. I never know what to buy people, but entering their sign and getting personalized picks? It felt like the universe was doing the shopping for me.",
    name: 'Jordan T.',
    sign: '♒ Aquarius',
    avatar: '⚡',
  },
  {
    id: 3,
    stars: '★★★★★',
    text: "The packaging alone made my mom cry. When she read the personalized Cancer birth chart card inside, she called me the best daughter ever. Worth every penny.",
    name: 'Priya R.',
    sign: '♎ Libra',
    avatar: '🦋',
  },
]

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
}

const slideUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
}

export default function Testimonials() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.15 })

  return (
    <section className="testimonials section-pad" id="testimonials" ref={ref}>
      <div className="container">
        <motion.div
          className="testimonials__header"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="testimonials__label">✦ Cosmic Love Letters</p>
          <h2 className="testimonials__title">
            What Our <span className="gold-text">Stars</span> Say
          </h2>
        </motion.div>

        <motion.div
          className="testimonials__grid"
          variants={stagger}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          {REVIEWS.map((r) => (
            <motion.div key={r.id} className="testimonial-card" variants={slideUp}>
              <p className="testimonial-card__stars">{r.stars}</p>
              <p className="testimonial-card__text">{r.text}</p>
              <div className="testimonial-card__author">
                <div className="testimonial-card__avatar">{r.avatar}</div>
                <div>
                  <p className="testimonial-card__name">{r.name}</p>
                  <p className="testimonial-card__sign">{r.sign}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
