import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import '../styles/Footer.css'

export default function Footer() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <footer className="footer" ref={ref}>
      <div className="container">
        <motion.div
          className="footer__grid"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="footer__brand">
            <h3>✦ Celestial Gifts</h3>
            <p>
              Discover the perfect gift written in the stars. Astrology-powered
              recommendations that align with your loved one's cosmic energy.
            </p>
          </div>

          <div className="footer__col">
            <h4>Shop</h4>
            <ul>
              <li><a href="#zodiac">By Zodiac Sign</a></li>
              <li><a href="#gifts">Bestsellers</a></li>
              <li><a href="#">Gift Sets</a></li>
              <li><a href="#">New Arrivals</a></li>
            </ul>
          </div>

          <div className="footer__col">
            <h4>Learn</h4>
            <ul>
              <li><a href="#how-it-works">How It Works</a></li>
              <li><a href="#">Birth Chart Guide</a></li>
              <li><a href="#">Compatibility</a></li>
              <li><a href="/blog">The Journal</a></li>
            </ul>
          </div>

          <div className="footer__col">
            <h4>Support</h4>
            <ul>
              <li><a href="#">Contact Us</a></li>
              <li><a href="#">Shipping</a></li>
              <li><a href="#">Returns</a></li>
              <li><a href="#">FAQ</a></li>
            </ul>
          </div>
        </motion.div>

        <div className="footer__bottom">
          <p>&copy; 2026 Celestial Gifts. All rights reserved.</p>
          <div className="footer__socials">
            <a href="#" aria-label="Instagram">✦</a>
            <a href="#" aria-label="Pinterest">◈</a>
            <a href="#" aria-label="TikTok">★</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
