import { useEffect, useState } from 'react'
import BirthCalendar from './BirthCalendar'
import { storeRequest } from '../../lib/giftGuideApi'

export default function BirthDetails({ values, setValues }) {
  const [query, setQuery] = useState(values.placeLabel || '')
  const [places, setPlaces] = useState([])
  const [error, setError] = useState('')
  useEffect(() => {
    if (query.trim().length < 4 || values.placeLabel === query) { setPlaces([]); return undefined }
    const timer = setTimeout(() => {
      storeRequest(`/store/gift-guide/places?q=${encodeURIComponent(query)}`)
        .then(data => {
          setPlaces(data.places || [])
          setError('')
        })
        .catch(() => { setPlaces([]); setError('City search is unavailable. Continue with your date for a numerology-led choice.') })
    }, 500)
    return () => clearTimeout(timer)
  }, [query, values.placeLabel])
  return <div className="guide-birth">
    <p>Birth details are optional. A date offers numerology; date, time and place allow a fuller astrology reading.</p>
    <BirthCalendar value={values.dob} onChange={dob => setValues(current => ({ ...current, dob }))} />
    {values.dob && <div className="guide-birth__more">
      <label>Time of birth <span>Optional</span><input type="time" value={values.tob} onChange={event => setValues(current => ({ ...current, tob: event.target.value }))} /></label>
      <div className="guide-place">
        <label htmlFor="guide-place-input">City of birth <span>Optional</span></label>
        <input id="guide-place-input" autoComplete="off" value={query} onChange={event => {
          setQuery(event.target.value); setValues(current => ({ ...current, placeId: null, placeLabel: '' }))
        }} placeholder="Start typing a city (min. 4 letters)" />
        {places.length > 0 && <ul role="listbox" aria-label="Birth cities">{places.map(place => <li key={place.id}>
          <button type="button" onClick={() => {
            const label = [place.name, place.region, place.country].filter(Boolean).join(', ')
            setValues(current => ({ ...current, placeId: place.id, placeLabel: label })); setQuery(label); setPlaces([])
          }}>{place.name} <small>{place.region}, {place.country}</small></button>
        </li>)}</ul>}
      </div>
    </div>}
    {error && <p className="guide-note" role="status">{error}</p>}
    {values.placeId && <p className="guide-note">City selected · {values.placeLabel}</p>}
  </div>
}
