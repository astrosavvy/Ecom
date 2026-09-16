export interface LetsScrollSection {
  id: string
  label?: string
  still?: string
  stillMobile?: string
  clip?: string
  clipMobile?: string
  accent?: string
  scroll?: number
  linger?: number
  eyebrow?: string
  title?: string
  body?: string
  tags?: string[]
  cta?: {
    primary?: { label: string; href?: string }
    secondary?: { label: string; href?: string }
  }
}

export interface LetsScrollConfig {
  brand?: { name?: string; href?: string }
  cta?: { label?: string; href?: string }
  hint?: string
  diveScroll?: number
  connScroll?: number
  crossfade?: number
  atmosphere?: boolean
  nav?: boolean
  sections: LetsScrollSection[]
  connectors?: (string | null | undefined)[]
  connectorsMobile?: (string | null | undefined)[]
  onNavigate?: (path: string) => void
}

export type LetsScrollDestroy = () => void

export function mountLetsScroll(container: HTMLElement, config: LetsScrollConfig): LetsScrollDestroy | void

export default mountLetsScroll
