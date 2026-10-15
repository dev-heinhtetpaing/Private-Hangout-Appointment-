import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

export function Background() {
  const root = useRef<HTMLDivElement>(null)
  const reduced = usePrefersReducedMotion()

  useGSAP(
    () => {
      if (reduced) return
      const orbs = gsap.utils.toArray<HTMLElement>('[data-orb]')
      orbs.forEach((orb, index) => {
        gsap.to(orb, {
          x: index % 2 === 0 ? 36 : -28,
          y: index % 2 === 0 ? -22 : 30,
          duration: 8 + index * 2.2,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        })
      })
    },
    { scope: root, dependencies: [reduced] },
  )

  return (
    <div ref={root} className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 bg-gradient-to-b from-rose-100 via-pink-50 to-white" />
      <div data-orb className="absolute -left-16 top-8 h-64 w-64 rounded-full bg-rosy-300/50 blur-3xl sm:h-80 sm:w-80" />
      <div data-orb className="absolute -right-16 top-1/4 h-72 w-72 rounded-full bg-pink-200/80 blur-3xl" />
      <div data-orb className="absolute bottom-[-4rem] left-1/4 h-64 w-64 rounded-full bg-rose-200/70 blur-3xl" />
    </div>
  )
}
