import { useEffect, useRef } from 'react'
import {
  Renderer,
  Program,
  Mesh,
  Plane,
  Transform,
  Texture,
  Camera,
} from 'ogl'
import { SCENES } from '../lib/data'
import { FRAG, VERT } from './shaders'

type Props = {
  onProgress?: (loaded: number, total: number) => void
  onReady?: () => void
  /** mutated by the scroll controller each ScrollTrigger update */
  stateRef: React.RefObject<{ t: number; vel: number }>
}

const N = SCENES.length

/** fade windows inside each segment (fractions of the segment) */
const FADE_IN = 0.12
const FADE_OUT = 0.88

function makeTexture(gl: Renderer['gl'], img: HTMLImageElement) {
  return new Texture(gl, {
    image: img,
    wrapS: gl.CLAMP_TO_EDGE,
    wrapT: gl.CLAMP_TO_EDGE,
    generateMipmaps: false,
    minFilter: gl.LINEAR,
    magFilter: gl.LINEAR,
  })
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((res, rej) => {
    const img = new Image()
    img.onload = () => res(img)
    img.onerror = () => rej(new Error(`failed to load ${url}`))
    img.src = url
  })
}

const smooth01 = (x: number) => {
  const c = Math.min(1, Math.max(0, x))
  return c * c * (3 - 2 * c)
}

export function webglAvailable() {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl') || c.getContext('experimental-webgl'))
  } catch {
    return false
  }
}

export default function SceneCanvas({ onProgress, onReady, stateRef }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return
    if (!webglAvailable()) {
      wrap.dataset.engine = 'unsupported'
      onReady?.()
      return
    }

    const renderer = new Renderer({
      dpr: Math.min(window.devicePixelRatio || 1, 2),
      alpha: false,
      antialias: false,
      powerPreference: 'high-performance',
    })
    const gl = renderer.gl
    gl.clearColor(0.027, 0.035, 0.094, 1)
    Object.assign(gl.canvas.style, {
      position: 'absolute',
      inset: '0',
      width: '100%',
      height: '100%',
    })
    wrap.appendChild(gl.canvas)

    const scene = new Transform()
    // fullscreen-quad vertex shader ignores camera matrices; OGL still wants one
    const camera = new Camera(gl)
    camera.position.z = 1

    const geometry = new Plane(gl, { width: 2, height: 2 })
    const blank = Object.assign(document.createElement('canvas'), {
      width: 1,
      height: 1,
    }) as unknown as HTMLImageElement
    const black = makeTexture(gl, blank)

    const program = new Program(gl, {
      vertex: VERT,
      fragment: FRAG,
      uniforms: {
        uTex: { value: black },
        uDepth: { value: black },
        uFade: { value: 0 },
        uZoom: { value: 1.14 },
        uArc: { value: 0 },
        uMouse: { value: [0, 0] },
        uTime: { value: 0 },
        uPlaneAspect: { value: 16 / 9 },
        uImageAspect: { value: 3 / 2 },
      },
    })
    const mesh = new Mesh(gl, { geometry, program })
    mesh.setParent(scene)

    // ---- textures -------------------------------------------------------
    const total = N * 2
    let loaded = 0
    let disposed = false
    const colorTex: Texture[] = []
    const depthTex: Texture[] = []

    const bump = () => {
      loaded++
      onProgress?.(loaded, total)
      if (loaded === total && colorTex[0] && !disposed) {
        const img = colorTex[0].image as HTMLImageElement
        program.uniforms.uImageAspect.value = img.width / img.height
        onReady?.()
      }
    }

    const jobs: Promise<void>[] = []
    SCENES.forEach((s, i) => {
      jobs.push(
        loadImage(`/scenes/${s.id}-c.webp`).then((img) => {
          if (disposed) return
          colorTex[i] = makeTexture(gl, img)
          bump()
        }).catch(() => bump()),
        loadImage(`/scenes/${s.id}-d.webp`).then((img) => {
          if (disposed) return
          depthTex[i] = makeTexture(gl, img)
          bump()
        }).catch(() => bump()),
      )
    })
    void Promise.all(jobs)

    // ---- interaction ----------------------------------------------------
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 }
    const onPointer = (e: PointerEvent) => {
      const r = wrap.getBoundingClientRect()
      mouse.tx = ((e.clientX - r.left) / r.width) * 2 - 1
      mouse.ty = -(((e.clientY - r.top) / r.height) * 2 - 1)
    }
    window.addEventListener('pointermove', onPointer, { passive: true })

    const resize = () => {
      const w = wrap.clientWidth || 1
      const h = wrap.clientHeight || 1
      renderer.setSize(w, h)
      program.uniforms.uPlaneAspect.value = w / h
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(wrap)

    // pause rendering while the film is off-screen
    let visible = true
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
    }, { threshold: 0 })
    io.observe(wrap)

    // ---- render loop ----------------------------------------------------
    // film grammar: ONE scene on screen at a time. Scroll pushes in; at the
    // edges of every segment exposure dips through black and the next scene
    // rises. Two frames are never blended.
    let raf = 0
    const smooth = { t: 0 }
    let lastTime = 0

    const render = (timeMs: number) => {
      raf = requestAnimationFrame(render)
      if (!visible || disposed || loaded < total) return

      const dt = Math.min(0.05, Math.max(0.0001, (timeMs - lastTime) / 1000))
      lastTime = timeMs

      const st = stateRef.current ?? { t: 0 }
      smooth.t += ((st.t ?? 0) - smooth.t) * (1 - Math.exp(-dt * 5.2))

      mouse.x += (mouse.tx - mouse.x) * (1 - Math.exp(-dt * 6))
      mouse.y += (mouse.ty - mouse.y) * (1 - Math.exp(-dt * 6))

      const t = Math.min(1, Math.max(0, smooth.t))
      // f = t * N gives every scene a full segment [k, k+1); the last scene
      // stays lit through the finale instead of collapsing to a single point
      const f = t * N
      const base = Math.min(N - 1, Math.floor(f))
      const frac = f - base

      // dip-to-black exposure window (first scene starts lit, last never dips)
      const fadeIn = base === 0 ? 1 : smooth01(frac / FADE_IN)
      const fadeOut = base === N - 1 ? 1 : 1 - smooth01((frac - FADE_OUT) / (1 - FADE_OUT))

      // monotonic per-scene camera: push in + drift down; reset hides in black
      const zoom = 1.14 - 0.11 * frac
      const arc = (frac - 0.5) * 0.014

      const u = program.uniforms
      u.uTex.value = colorTex[base] ?? black
      u.uDepth.value = depthTex[base] ?? black
      u.uFade.value = fadeIn * fadeOut
      u.uZoom.value = zoom
      u.uArc.value = arc
      u.uTime.value = timeMs * 0.001
      ;(u.uMouse.value as number[])[0] = mouse.x
      ;(u.uMouse.value as number[])[1] = mouse.y

      renderer.render({ scene, camera })
    }
    raf = requestAnimationFrame(render)

    return () => {
      disposed = true
      cancelAnimationFrame(raf)
      io.disconnect()
      ro.disconnect()
      window.removeEventListener('pointermove', onPointer)
      wrap.removeChild(gl.canvas)
      gl.getExtension('WEBGL_lose_context')?.loseContext()
    }
  }, [onProgress, onReady, stateRef])

  return (
    <div
      ref={wrapRef}
      style={{ position: 'absolute', inset: 0 }}
      aria-hidden="true"
    />
  )
}
