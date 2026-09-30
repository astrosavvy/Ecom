import { Component, lazy, Suspense, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const Aster3D = lazy(() => import('./Aster3D'))

function canRender3D() {
  try { return !!document.createElement('canvas').getContext('webgl2') } catch { return false }
}

class SceneBoundary extends Component {
  constructor(props) { super(props); this.state = { failed: false } }
  static getDerivedStateFromError() { return { failed: true } }
  render() { return this.state.failed ? this.props.fallback : this.props.children }
}

export default function AsterStage({ mood, message }) {
  const [enabled, setEnabled] = useState(false)
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setEnabled(canRender3D() && !media.matches)
    update(); media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])
  const fallback = <img src={`/media/guide-${mood === 'asking' ? 'speak' : 'listen'}.webp`} alt="" />
  return <aside className="guide-stage" aria-label="Aster, your gift guide">
    <Link to="/shop" className="guide-stage__return">← Collection</Link>
    <div className="guide-stage__orbit" aria-hidden="true" />
    <div className="guide-stage__figure">
      {enabled ? <SceneBoundary fallback={fallback}><Suspense fallback={fallback}>
        <Aster3D mood={mood} onFailure={() => setEnabled(false)} />
      </Suspense></SceneBoundary> : fallback}
    </div>
    <div className="guide-stage__label"><span>YOUR GUIDE · ASTER</span><strong>{message}</strong></div>
  </aside>
}
