import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'

export const prefersStill = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Fades its children in the first time they scroll into view. */
export function Reveal({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true)
          observer.disconnect()
        }
      },
      { threshold: 0.12 },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className={`reveal ${shown ? 'is-in' : ''} ${className}`} style={{ '--delay': `${delay}ms` } as CSSProperties}>
      {children}
    </div>
  )
}

/** Lights a paragraph up word by word as it travels through the viewport. */
export function ScrollWords({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return
    const words = Array.from(element.querySelectorAll<HTMLElement>('span'))
    if (prefersStill()) {
      words.forEach((word) => (word.style.opacity = '1'))
      return
    }
    let frame = 0
    const paint = () => {
      frame = 0
      const rect = element.getBoundingClientRect()
      const viewport = window.innerHeight
      const start = viewport * 0.85
      const span = rect.height + viewport * 0.3
      const progress = Math.min(1, Math.max(0, (start - rect.top) / span))
      const lit = progress * words.length
      words.forEach((word, i) => {
        word.style.opacity = String(0.2 + 0.8 * Math.min(1, Math.max(0, lit - i)))
      })
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(paint)
    }
    paint()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [text])

  return (
    <p ref={ref} className="statement">
      {text.split(' ').map((word, i) => (
        <span key={`${word}-${i}`}>{word} </span>
      ))}
    </p>
  )
}

/** Thin bar along the top of the page showing how far down the reader is. */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let frame = 0
    const paint = () => {
      frame = 0
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      if (ref.current) ref.current.style.transform = `scaleX(${scrollable > 0 ? window.scrollY / scrollable : 0})`
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(paint)
    }
    paint()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [])

  return <div className="scroll-progress" ref={ref} aria-hidden="true" />
}

/** Drifting network of points behind the hero; links reach for the pointer. */
export function NetworkCanvas() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return

    const LINK = 130
    type Dot = { x: number; y: number; vx: number; vy: number }
    let width = 0
    let height = 0
    let dots: Dot[] = []
    let frame = 0
    let visible = true
    const pointer = { x: -9999, y: -9999 }
    const still = prefersStill()

    const line = (a: { x: number; y: number }, b: { x: number; y: number }, reach: number, strength: number) => {
      const distance = Math.hypot(a.x - b.x, a.y - b.y)
      if (distance > reach) return
      context.strokeStyle = `rgba(120,150,255,${strength * (1 - distance / reach)})`
      context.beginPath()
      context.moveTo(a.x, a.y)
      context.lineTo(b.x, b.y)
      context.stroke()
    }

    const draw = () => {
      context.clearRect(0, 0, width, height)
      context.lineWidth = 1
      dots.forEach((dot, i) => {
        for (let j = i + 1; j < dots.length; j++) line(dot, dots[j], LINK, 0.28)
        line(dot, pointer, LINK * 1.6, 0.6)
      })
      context.fillStyle = 'rgba(160,185,255,.75)'
      dots.forEach((dot) => {
        context.beginPath()
        context.arc(dot.x, dot.y, 1.6, 0, Math.PI * 2)
        context.fill()
      })
    }

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      width = canvas.clientWidth
      height = canvas.clientHeight
      canvas.width = width * ratio
      canvas.height = height * ratio
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
      const count = Math.min(70, Math.round((width * height) / 16000))
      dots = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
      }))
      if (still) draw()
    }

    const tick = () => {
      frame = 0
      dots.forEach((dot) => {
        dot.x += dot.vx
        dot.y += dot.vy
        if (dot.x < 0 || dot.x > width) dot.vx *= -1
        if (dot.y < 0 || dot.y > height) dot.vy *= -1
      })
      draw()
      if (visible) frame = requestAnimationFrame(tick)
    }

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(canvas)
    resize()

    // Stop the loop entirely once the hero is off screen.
    const viewObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible && !still && !frame) frame = requestAnimationFrame(tick)
    })
    viewObserver.observe(canvas)

    const onMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      pointer.x = event.clientX - rect.left
      pointer.y = event.clientY - rect.top
    }
    window.addEventListener('pointermove', onMove, { passive: true })

    return () => {
      cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      viewObserver.disconnect()
      window.removeEventListener('pointermove', onMove)
    }
  }, [])

  return <canvas ref={ref} className="network" aria-hidden="true" />
}
