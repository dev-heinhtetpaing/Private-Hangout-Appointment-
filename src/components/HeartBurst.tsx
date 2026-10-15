import { useRef } from 'react'
import { createPortal } from 'react-dom'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { particles } from '../lib/stickerKit'

type Props = {
  x: number
  y: number
  onDone: () => void
}

export function HeartBurst({ x, y, onDone }: Props) {
  const root = useRef<HTMLDivElement>(null)
  const bits = useRef(
    Array.from({ length: 16 }, (_, index) => ({
      id: index,
      sticker: particles[index % particles.length],
      angle: (Math.PI * 2 * index) / 16 + Math.random() * 0.4,
      distance: 70 + Math.random() * 130,
    })),
  )

  useGSAP(
    () => {
      const nodes = root.current?.querySelectorAll<HTMLElement>('[data-bit]')
      nodes?.forEach((node, index) => {
        const bit = bits.current[index]
        gsap.fromTo(
          node,
          { x: 0, y: 0, scale: 0.4, opacity: 1, rotation: 0 },
          {
            x: Math.cos(bit.angle) * bit.distance,
            y: Math.sin(bit.angle) * bit.distance - 30,
            scale: 0.7 + Math.random() * 0.5,
            opacity: 0,
            rotation: Math.random() * 80 - 40,
            duration: 0.85 + Math.random() * 0.25,
            ease: 'power3.out',
          },
        )
      })
      const timer = gsap.delayedCall(0.95, onDone)
      return () => timer.kill()
    },
    { scope: root },
  )

  return createPortal(
    <div ref={root} className="pointer-events-none fixed z-40" style={{ left: x, top: y }} aria-hidden="true">
      {bits.current.map((bit) => (
        <img
          key={bit.id}
          data-bit=""
          src={bit.sticker.src}
          width={28}
          height={28}
          alt=""
          className="absolute h-7 w-7 select-none"
          style={{ left: -14, top: -14 }}
        />
      ))}
    </div>,
    document.body,
  )
}
