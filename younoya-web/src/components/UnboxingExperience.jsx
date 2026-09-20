import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Sparkles, Package, Feather, ShieldCheck, Flame } from 'lucide-react'
import '../styles/UnboxingExperience.css'

const LAYERS = [
  {
    step: 'I',
    icon: <Package size={22} className="text-gold" />,
    title: 'The Obsidian Linen Casket',
    desc: 'Crafted with 1200gsm archival board, wrapped in tactile black linen and stamped with our gold foil YU monogram.',
  },
  {
    step: 'II',
    icon: <Flame size={22} className="text-gold" />,
    title: 'The Hand-Struck Wax Seal',
    desc: 'Sealed by hand in our atelier using centuries-old formulation wax bearing the YOUNOYA planetary crest.',
  },
  {
    step: 'III',
    icon: <Feather size={22} className="text-gold" />,
    title: 'The Astrological Dedication Scroll',
    desc: 'Printed on heavy Italian deckled-edge cotton paper, inscribed with the exact astronomical transits of their milestone.',
  },
  {
    step: 'IV',
    icon: <Sparkles size={22} className="text-gold" />,
    title: 'The Heirloom & Velvet Sanctuary',
    desc: 'Resting within crushed midnight velvet, your curated piece is revealed alongside its gemological certificate.',
  },
]

export default function UnboxingExperience() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  const layer1Y = useTransform(scrollYProgress, [0, 1], [-40, 40])
  const layer2Y = useTransform(scrollYProgress, [0, 1], [-80, 80])
  const layer3Y = useTransform(scrollYProgress, [0, 1], [40, -40])

  return (
    <section className="unboxing-world section-wrapper" id="unboxing" ref={containerRef}>
      <div className="container">
        {/* Header */}
        <div className="unboxing-header">
          <span className="eyebrow">Chapter VI · The Unboxing Ritual</span>
          <h2 className="unboxing-title">
            The Sensory <span className="text-gold-gradient">Ritual of Unveiling</span>
          </h2>
          <p className="unboxing-sub">
            Before the gift is ever held, the ceremony of unboxing commands reverence.
            Every layer has been architected to build anticipation and evoke timeless wonder.
          </p>
        </div>

        {/* Interactive Exploded View Stage */}
        <div className="unboxing-stage">
          {/* Visual Parallax Layers Column */}
          <div className="unboxing-visual-col">
            <div className="box-isometric-stack">
              {/* Layer 1: Top Ribbon & Wax Seal */}
              <motion.div className="stack-layer stack-layer--seal" style={{ y: layer2Y }}>
                <div className="seal-emblem">
                  <span>✦ YU ✦</span>
                </div>
                <span className="layer-tag">ATELIER WAX SEAL</span>
              </motion.div>

              {/* Layer 2: Astrological Scroll */}
              <motion.div className="stack-layer stack-layer--scroll" style={{ y: layer1Y }}>
                <div className="scroll-paper">
                  <div className="scroll-constellation">✦ ♈ ♉ ♊ ♋ ♌ ♍ ♎ ♏ ♐ ♑ ♒ ♓ ✦</div>
                  <p className="scroll-text-sample">"Inscribed for the Solar Return of a Treasured Soul..."</p>
                </div>
                <span className="layer-tag">SCRIBED LUNAR SCROLL</span>
              </motion.div>

              {/* Layer 3: Velvet Casket Base */}
              <motion.div className="stack-layer stack-layer--casket" style={{ y: layer3Y }}>
                <div className="casket-cavity">
                  <div className="talisman-sparkle">👑</div>
                </div>
                <span className="layer-tag">OBSIDIAN VELVET CASKET</span>
              </motion.div>
            </div>
          </div>

          {/* Sequential Ritual Explanations */}
          <div className="unboxing-steps-col">
            <div className="ritual-steps-list">
              {LAYERS.map((layer) => (
                <div key={layer.step} className="ritual-step-item">
                  <div className="step-badge-circle">
                    <span className="step-roman">{layer.step}</span>
                  </div>
                  <div className="step-text-content">
                    <div className="step-title-row">
                      <div className="step-icon-wrap">{layer.icon}</div>
                      <h4 className="step-title">{layer.title}</h4>
                    </div>
                    <p className="step-desc">{layer.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
