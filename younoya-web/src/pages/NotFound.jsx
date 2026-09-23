import { Link } from 'react-router-dom'

export default function NotFound() {
  return <section style={{ minHeight: '100svh', display: 'grid', placeContent: 'center', gap: 24, padding: '120px 8vw', background: '#faf6ef', color: '#2a211d', textAlign: 'center' }}>
    <span style={{ fontSize: 11, letterSpacing: '.22em', color: '#9a774c' }}>YOUNOYA / A MOMENT TO REORIENT</span>
    <h1 style={{ margin: 0, fontFamily: 'var(--font-serif)', fontSize: 'clamp(42px, 7vw, 84px)', fontWeight: 400, lineHeight: 1 }}>This path has wandered.</h1>
    <p style={{ margin: 0 }}>Let’s find the right way back.</p>
    <Link to="/shop" style={{ color: '#704a2a', textDecoration: 'underline', textUnderlineOffset: 6 }}>Explore the collection</Link>
  </section>
}
