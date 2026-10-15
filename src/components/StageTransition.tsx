import { useEffect, useRef, useState, type ReactNode } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import type { Stage } from '../types'

type Props = {
  stage: Stage
  children: ReactNode
}

export function StageTransition({ stage, children }: Props) {
  const root = useRef<HTMLDivElement>(null)
  const childrenRef = useRef(children)
  childrenRef.current = children
  const [shown, setShown] = useState({ stage, node: children })
  const reduced = usePrefersReducedMotion()

  useGSAP(
    () => {
      const el = root.current
      if (!el) return

      if (shown.stage !== stage) {
        if (reduced) {
          setShown({ stage, node: childrenRef.current })
          return
        }
        gsap.to(el, {
          opacity: 0,
          y: -26,
          scale: 0.975,
          filter: 'blur(8px)',
          duration: 0.42,
          ease: 'power3.in',
          onComplete: () => {
            gsap.set(el, { opacity: 0, y: 32, scale: 0.985, filter: 'blur(8px)' })
            setShown({ stage, node: childrenRef.current })
          },
        })
        return
      }

      if (stage === 'loading') {
        gsap.set(el, { opacity: 1, y: 0, scale: 1, filter: 'none', clearProps: 'transform,filter' })
        return
      }

      if (reduced) {
        gsap.set(el, { opacity: 1, y: 0, scale: 1, clearProps: 'transform,filter' })
        return
      }

      const timeline = gsap.timeline({
        onComplete: () => {
          gsap.set(el, { clearProps: 'transform,filter' })
        },
      })
      timeline.fromTo(
        el,
        { opacity: 0, y: 32, scale: 0.985, filter: 'blur(8px)' },
        { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 0.72, ease: 'expo.out' },
      )
      const sticker = el.querySelector<HTMLElement>('[data-sticker]')
      const stickerImages = el.querySelectorAll<HTMLElement>('[data-sticker] img')
      const items = el.querySelectorAll<HTMLElement>('[data-stagger]')
      if (sticker) {
        timeline.fromTo(sticker, { opacity: 0 }, { opacity: 1, duration: 0.45, ease: 'power3.out' }, 0.04)
      }
      if (stickerImages.length) {
        timeline.fromTo(
          stickerImages,
          { scale: 0.5 },
          { scale: 1, duration: 0.85, ease: 'elastic.out(1, 0.68)' },
          0.06,
        )
      }
      if (items.length) {
        timeline.fromTo(
          items,
          { y: 16, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.55, stagger: 0.065, ease: 'power3.out' },
          0.12,
        )
      }
    },
    { scope: root, dependencies: [stage, shown.stage, reduced] },
  )

  useEffect(() => {
    const delay = reduced || shown.stage === 'loading' ? 40 : 760
    const timer = window.setTimeout(() => {
      const heading = root.current?.querySelector('h1')
      if (heading instanceof HTMLElement) {
        heading.tabIndex = -1
        heading.focus({ preventScroll: true })
      }
    }, delay)
    return () => window.clearTimeout(timer)
  }, [shown.stage, reduced])

  return (
    <main ref={root} className="relative z-10 w-full overflow-x-clip">
      {shown.node}
    </main>
  )
}
