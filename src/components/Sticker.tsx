import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import type { StickerAsset } from '../types'

type Props = {
  sticker: StickerAsset | null
  className?: string
  float?: boolean
  priority?: boolean
}

export function Sticker({ sticker, className = '', float = true, priority = false }: Props) {
  const reduced = usePrefersReducedMotion()
  const imgRef = useRef<HTMLImageElement>(null)
  const seen = useRef(false)
  const src = reduced || !sticker?.animated ? sticker?.still : sticker?.src
  if (!sticker) return null
  useGSAP(
    () => {
      const image = imgRef.current
      if (!image) return
      if (seen.current && !reduced) {
        gsap.fromTo(image, { opacity: 0.35, scale: 0.92 }, { opacity: 1, scale: 1, duration: 0.35, ease: 'power2.out' })
      }
      seen.current = true
      if (!float || reduced) return
      gsap.to(image, {
        y: -7,
        rotation: 2.5,
        duration: 2.5,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      })
    },
    { dependencies: [src, float, reduced] },
  )

  return (
    <img
      ref={imgRef}
      src={src}
      width={sticker.width}
      height={sticker.height}
      alt={sticker.alt}
      draggable={false}
      decoding="async"
      fetchPriority={priority ? 'high' : 'auto'}
      className={`pointer-events-none select-none object-contain  ${className}`}
    />
  )
}
