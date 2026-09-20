import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import '../styles/Newsletter.css'

export default function Newsletter() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 })

  return (
    <section className="newsletter section-pad" ref={ref}>
      <div className="container">
        <motion.div
          className="newsletter__inner"
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="newsletter__icon">🌟</span>
          <h2 className="newsletter__title">
            Join the <span className="gold-text">Cosmic Circle</span>
          </h2>
          <p className="newsletter__desc">
            Get weekly horoscope gift guides, early access to new collections,
            and 10% off your first order.
          </p>
          <form className="newsletter__form" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              className="newsletter__input"
              placeholder="Enter your email address"
              aria-label="Email address"
            />
            <button type="submit" className="btn btn--primary">
              Subscribe ✦
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  )
}
