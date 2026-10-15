import { useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { particles } from '../lib/stickerKit'
import type { StickerAsset } from '../types'

type Bit = {
  id: number
  sticker: StickerAsset
  left: number
  top: number
  size: number
  duration: number
  delay: number
  opacity: number
  drift: number
}

function makeBits(count: number, travel: boolean): Bit[] {
  return Array.from({ length: count }, (_, id) => ({
    id,
    sticker: particles[id % particles.length],
    left: Math.random() * 92,
    top: travel ? 100 + Math.random() * 20 : 8 + Math.random() * 84,
    size: travel ? 18 + Math.random() * 26 : 14 + Math.random() * 16,
    duration: travel ? 8 + Math.random() * 9 : 6 + Math.random() * 5,
    delay: Math.random() * (travel ? 7 : 2),
    opacity: travel ? 0.35 + Math.random() * 0.5 : 0.14 + Math.random() * 0.16,
    drift: Math.random() * 36 - 18,
  }))
}

function HeartField({ bits, travel }: { bits: Bit[]; travel: boolean }) {
  const root = useRef<HTMLDivElement>(null)
  const reduced = usePrefersReducedMotion()

  useGSAP(
    () => {
      if (reduced || !root.current) return
      const nodes = root.current.querySelectorAll<HTMLElement>('[data-heart]')
      nodes.forEach((node, index) => {
        const bit = bits[index]
        if (!bit) return
        if (travel) {
          const distance = window.innerHeight + bit.size + 80
          gsap.set(node, { y: 40, opacity: 0, rotation: bit.drift })
          const timeline = gsap.timeline({ repeat: -1, delay: bit.delay })
          timeline.to(node, { opacity: bit.opacity, duration: 0.7, ease: 'power1.out' })
          timeline.to(node, { y: -distance, x: bit.drift, rotation: bit.drift + 24, duration: bit.duration, ease: 'none' }, 0)
          timeline.to(node, { opacity: 0, duration: 0.8 }, `>-=0.8`)
          return
        }
        gsap.to(node, {
          y: index % 2 === 0 ? -16 : 14,
          x: bit.drift / 2,
          rotation: index % 2 === 0 ? 8 : -8,
          duration: bit.duration,
          delay: bit.delay,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        })
      })
    },
    { scope: root, dependencies: [reduced, travel, bits] },
  )

  if (reduced) return null

  return (
    <div ref={root} className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {bits.map((bit) => (
        <img
          key={bit.id}
          data-heart=""
          src={bit.sticker.src}
          width={bit.sticker.width}
          height={bit.sticker.height}
          alt=""
          draggable={false}
          style={{
            left: `${bit.left}%`,
            top: travel ? '100%' : `${bit.top}%`,
            width: bit.size,
            height: bit.size,
            opacity: travel ? 0 : bit.opacity,
          }}
          className="absolute select-none will-change-transform"
        />
      ))}
    </div>
  )
}

export function Atmosphere() {
  const [bits] = useState(() => makeBits(6, false))
  return <HeartField bits={bits} travel={false} />
}

export function FinaleHearts() {
  const [bits] = useState(() => makeBits(window.innerWidth < 768 ? 16 : 28, true))
  return <HeartField bits={bits} travel />
}
