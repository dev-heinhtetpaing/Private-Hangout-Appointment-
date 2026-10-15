import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { copy } from '../config'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { kit } from '../lib/stickerKit'
import { PillButton } from '../components/PillButton'
import { StageLayout } from '../components/StageLayout'

export function InvalidStage({ onRetry }: { onRetry: () => void }) {
  const card = useRef<HTMLDivElement>(null)
  const reduced = usePrefersReducedMotion()

  useGSAP(
    () => {
      if (reduced || !card.current) return
      gsap.fromTo(
        card.current,
        { x: 0 },
        { x: 7, duration: 0.07, repeat: 5, yoyo: true, delay: 0.75, ease: 'power1.inOut' },
      )
    },
    { scope: card, dependencies: [reduced] },
  )

  return (
    <div ref={card}>
      <StageLayout
        title={copy.invalid.title}
        description={copy.invalid.description}
        sticker={kit.pensive}
        footer={
          <PillButton variant="ghost" onClick={onRetry}>
            {copy.invalid.retry}
          </PillButton>
        }
      />
    </div>
  )
}
