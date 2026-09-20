import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import '../styles/Newsletter.css'

export default function ParallaxDivider() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const bgY = useTransform(scrollYProgress, [0, 1], ['-15%', '15%'])
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0])

  return (
    <section className="parallax-divider" ref={ref}>
      <motion.div className="parallax-divider__bg" style={{ y: bgY }} />

      {/* Floating decorative stars */}
      {[
        { top: '20%', left: '10%' },
        { top: '60%', left: '85%' },
        { top: '40%', left: '5%' },
        { top: '30%', left: '92%' },
        { top: '70%', left: '50%' },
      ].map((pos, i) => (
        <motion.span
          key={i}
          className="parallax-divider__star"
          style={{
            top: pos.top,
            left: pos.left,
            y: useTransform(scrollYProgress, [0, 1], [20 * (i + 1), -20 * (i + 1)]),
          }}
        >
          ✦
        </motion.span>
      ))}

      <motion.div className="parallax-divider__content" style={{ opacity }}>
        <p className="parallax-divider__quote">
          "The stars incline, but do not compel — <br />
          except when it comes to great gifts."
        </p>
        <p className="parallax-divider__attr">— Celestial Gifts Philosophy</p>
      </motion.div>
    </section>
  )
}
