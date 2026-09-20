import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import StoryFilm from '../components/StoryFilm'
import FlowShowcase from '../components/FlowShowcase'
import '../styles/CinematicHome.css'

function Finale() {
  return (
    <section className="quiet-finale" id="finale">
      <img src="/media/ritual-portrait.webp" alt="Younoya sculptural gifting world" />
      <div />
      <article>
        <span>YOUNOYA / FOR EVERY CHAPTER</span>
        <h2>
          The object is beautiful.<br />
          <em>The meaning is yours.</em>
        </h2>
        <Link className="glow-button" to="/shop">
          Explore the Sanctums <ArrowRight size={16} />
        </Link>
      </article>
      <footer>
        <img src="/favicon.png" alt="Younoya" />
        <span>© 2026 Younoya Atelier</span>
        <a href="#intentions">Gift intentions</a>
      </footer>
    </section>
  )
}

export default function Home() {
  return (
    <div className="cinematic-home">
      <StoryFilm />
      <FlowShowcase />
      <Finale />
    </div>
  )
}
