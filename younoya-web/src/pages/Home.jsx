import { ArrowRight } from 'lucide-react'
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
        <a className="glow-button" href="#intentions">
          Explore the Sanctums <ArrowRight size={16} />
        </a>
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
