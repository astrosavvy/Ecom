import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './styles/tokens.css'
import './styles/global.css'

// never let the browser restore a mid-film scroll position on reload
if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
window.scrollTo(0, 0)

// Suppress noisy third-party errors: Cloudflare beacon blocked by ad-blocker + web-vitals startTime race
window.addEventListener('error', (e) => {
  const msg = String(e.message || "")
  if (msg.includes('beacon.min.js') || msg.includes('ERR_BLOCKED_BY_CLIENT') || msg.includes('startTime')) {
    e.preventDefault()
  }
})
window.addEventListener('unhandledrejection', (e: PromiseRejectionEvent) => {
  const msg = String((e.reason as any)?.message || e.reason || "")
  if (msg.includes('startTime')) e.preventDefault()
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
