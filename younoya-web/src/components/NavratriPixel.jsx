import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { trackNavratriVisit } from '../lib/navratriPixel'

export default function NavratriPixel() {
  const { pathname } = useLocation()
  useEffect(() => { trackNavratriVisit(pathname) }, [pathname])
  return null
}
