import { useRef, useState, type PointerEvent } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { copy, DATE_TYPES } from '../config'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { dateIcons, kit } from '../lib/stickerKit'
import { PillButton } from '../components/PillButton'
import { StageLayout } from '../components/StageLayout'
import { Sticker } from '../components/Sticker'
import type { DateChoice, StickerAsset } from '../types'

const options = DATE_TYPES as DateChoice[]

function DateCard({
  option,
  sticker,
  selected,
  onSelect,
}: {
  option: DateChoice
  sticker: StickerAsset
  selected: boolean
  onSelect: () => void
}) {
  const ref = useRef<HTMLButtonElement>(null)
  const reduced = usePrefersReducedMotion()
  const { contextSafe } = useGSAP({ scope: ref })

  useGSAP(
    () => {
      if (!selected || reduced || !ref.current) return
      gsap.fromTo(ref.current, { scale: 0.98 }, { scale: 1.03, duration: 0.4, ease: 'power3.out' })
    },
    { dependencies: [selected, reduced] },
  )

  const tilt = contextSafe((event: PointerEvent<HTMLButtonElement>) => {
    if (reduced || event.pointerType !== 'mouse' || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const px = (event.clientX - rect.left) / rect.width - 0.5
    const py = (event.clientY - rect.top) / rect.height - 0.5
    gsap.to(ref.current, {
      rotateY: px * 8,
      rotateX: -py * 6,
      y: -4,
      scale: selected ? 1.03 : 1,
      duration: 0.28,
      ease: 'power2.out',
      transformPerspective: 700,
      overwrite: 'auto',
    })
  })

  const reset = contextSafe(() => {
    if (!ref.current) return
    gsap.to(ref.current, {
      rotateY: 0,
      rotateX: 0,
      y: 0,
      scale: selected ? 1.03 : 1,
      duration: 0.4,
      ease: 'power2.out',
      overwrite: 'auto',
    })
  })

  return (
    <button
      ref={ref}
      type="button"
      data-stagger
      aria-pressed={selected}
      onClick={onSelect}
      onPointerMove={tilt}
      onPointerLeave={reset}
      className={`relative flex min-h-[8.5rem] flex-col items-center justify-center rounded-2xl border-2 px-3 py-4 text-center transition-colors ${
        selected ? 'border-rosy-500 bg-white/85 shadow-glow' : 'border-white/80 bg-white/45'
      }`}
    >
      {selected ? (
        <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-rosy-700 text-white" aria-hidden="true">
          <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M3.5 8.2 6.4 11l6.1-6.2" />
          </svg>
        </span>
      ) : null}
      <Sticker sticker={sticker} float={false} className="h-11 w-11" />
      <span className="mt-2 text-[0.65rem] font-medium uppercase tracking-[0.16em] text-rosy-700">{option.name}</span>
      <span className="mt-1 text-sm font-medium leading-snug text-ink">{option.description}</span>
    </button>
  )
}

export function StageTwo({ onNext }: { onNext: (choice: DateChoice) => void }) {
  const [selected, setSelected] = useState<DateChoice | null>(null)

  return (
    <StageLayout
      wide
      title={copy.stage2.title}
      description={copy.stage2.description}
      sticker={kit.heartEyes}
      stickerSlot={
        <div className="flex w-full flex-col-reverse items-center gap-3 sm:flex-row sm:justify-center sm:gap-6">
          {/* <Sticker sticker={kit.heartEyes} className="h-28 w-28 sm:h-32 sm:w-32" priority /> */}
          <p className="speech speech-side">{copy.stage2.bubble}</p>
        </div>
      }
      footer={
        <div className="space-y-3">
          {selected ? null : <p className="text-xs tracking-wide text-muted">{copy.stage2.hint}</p>}
          <PillButton disabled={!selected} onClick={() => selected && onNext(selected)}>
            {copy.stage2.next}
          </PillButton>
        </div>
      }
    >
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4" style={{ perspective: 1000 }}>
        {options.map((option) => (
          <DateCard
            key={option.name}
            option={option}
            sticker={dateIcons[option.name]}
            selected={selected?.name === option.name}
            onSelect={() => setSelected(option)}
          />
        ))}
      </div>
    </StageLayout>
  )
}
