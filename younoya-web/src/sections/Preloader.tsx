import { useEffect, useState } from 'react'

const THOUGHTS = [
  'every gift is a wish the sky remembers',
  'written in stardust, wrapped in gold',
  'lighting the lanterns, one by one',
  'a ninja is folding your ribbon',
  'aligning the constellations for you',
]

type Props = {
  done: boolean
}

export default function Preloader({ done }: Props) {
  const [i, setI] = useState(0)

  // thoughts keep changing while the vault is being opened
  useEffect(() => {
    if (done) return
    const id = window.setInterval(() => setI((v) => (v + 1) % THOUGHTS.length), 1500)
    return () => window.clearInterval(id)
  }, [done])

  return (
    <div className={`loader${done ? ' loader--done' : ''}`} aria-hidden={done}>
      <div className="loader__glow" aria-hidden="true" />

      <div className="loader__core">
        <img className="loader__logo" src="/brand.webp" alt="Younoya" />
        <p className="loader__thought" key={i}>
          {THOUGHTS[i]}
        </p>
      </div>
    </div>
  )
}
