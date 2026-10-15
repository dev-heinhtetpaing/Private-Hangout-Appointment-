import { useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import { createPortal } from 'react-dom'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { copy, NO_MESSAGES } from '../config'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { kit } from '../lib/stickerKit'
import { findOpenSpot, maxButtonScale } from '../lib/runaway'
import { HeartBurst } from '../components/HeartBurst'
import { PillButton } from '../components/PillButton'
import { StageLayout } from '../components/StageLayout'


const messages = NO_MESSAGES as string[]
const GROWTH = 1.14

type Pose = {
  id: number
  width: number
  height: number
  fromX: number
  fromY: number
  x: number
  y: number
  rotation: number
}

export function StageOne({ name, onYes }: { name: string; onYes: () => void }) {
  const root = useRef<HTMLDivElement>(null)
  const yesRef = useRef<HTMLButtonElement>(null)
  const noRef = useRef<HTMLButtonElement>(null)
  const bubbleRef = useRef<HTMLDivElement>(null)
  const baseSize = useRef<{ width: number; height: number } | null>(null)
  const scaleRef = useRef(1)
  const glowing = useRef(false)
  const accepted = useRef(false)
  const restoreFocus = useRef(false)
  const reduced = usePrefersReducedMotion()
  const [attempt, setAttempt] = useState(0)
  const [pose, setPose] = useState<Pose | null>(null)
  const [burst, setBurst] = useState<{ x: number; y: number } | null>(null)

  const message = attempt > 0 ? messages[(attempt - 1) % messages.length] : ''
  const expression = attempt >= 4 ? kit.crying : kit.pleading

  const { contextSafe } = useGSAP({ scope: root })

  const dodge = contextSafe((pointer?: { x: number; y: number }, fromKey = false) => {
    const no = noRef.current
    const yes = yesRef.current
    if (!no || !yes || accepted.current) return

    const rect = no.getBoundingClientRect()
    if (!baseSize.current) {
      const yesRect = yes.getBoundingClientRect()
      baseSize.current = {
        width: yesRect.width / scaleRef.current,
        height: yesRect.height / scaleRef.current,
      }
    }

    const next = findOpenSpot(rect.width, rect.height, yes.getBoundingClientRect(), pointer)
    restoreFocus.current = fromKey
    setPose({
      id: attempt + 1,
      width: rect.width,
      height: rect.height,
      fromX: rect.left,
      fromY: rect.top,
      x: next.x,
      y: next.y,
      rotation: reduced ? 0 : Math.random() * 16 - 8,
    })

    const cap = maxButtonScale(baseSize.current.width, baseSize.current.height)
    scaleRef.current = Math.min(cap, scaleRef.current * GROWTH)
    gsap.to(yes, {
      scale: scaleRef.current,
      duration: reduced ? 0.12 : 0.55,
      ease: 'elastic.out(1, 0.6)',
      overwrite: 'auto',
      transformOrigin: 'center center',
    })

    if (!glowing.current) {
      glowing.current = true
      gsap.fromTo(
        yes,
        { boxShadow: '0 10px 24px rgba(181, 61, 100, 0.28)' },
        {
          boxShadow: '0 0 0 8px rgba(232, 117, 143, 0.28), 0 18px 36px rgba(181, 61, 100, 0.42)',
          duration: 0.9,
          yoyo: true,
          repeat: -1,
          ease: 'sine.inOut',
        },
      )
    }

    setAttempt((value) => value + 1)
  })

  useGSAP(
    () => {
      const no = noRef.current
      if (!no || !pose) return
      gsap.fromTo(
        no,
        { x: pose.fromX, y: pose.fromY, rotation: 0 },
        {
          x: pose.x,
          y: pose.y,
          rotation: pose.rotation,
          duration: reduced ? 0.12 : 0.38,
          ease: 'power2.out',
          overwrite: 'auto',
        },
      )
      if (restoreFocus.current) {
        no.focus({ preventScroll: true })
        restoreFocus.current = false
      }
    },
    { dependencies: [pose, reduced] },
  )

  useGSAP(
    () => {
      if (!bubbleRef.current || attempt === 0) return
      const timeline = gsap.timeline()
      timeline.fromTo(
        bubbleRef.current,
        { scale: 0.72, opacity: 0 },
        { scale: 1, opacity: 1, duration: reduced ? 0.01 : 0.36, ease: 'back.out(1.8)' },
      )
      if (!reduced) {
        timeline.to(bubbleRef.current, { opacity: 0, scale: 0.94, duration: 0.28, delay: 1.7 })
      }
    },
    { dependencies: [attempt, message, reduced] },
  )

  const onPointerEnter = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.pointerType !== 'mouse') return
    dodge({ x: event.clientX, y: event.clientY })
  }

  const onPointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.pointerType === 'mouse') return
    event.preventDefault()
    dodge({ x: event.clientX, y: event.clientY })
  }

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== 'Enter' && event.key !== ' ') return
    event.preventDefault()
    dodge(undefined, true)
  }

  const accept = () => {
    const yes = yesRef.current
    if (!yes || accepted.current) return
    accepted.current = true
    const rect = yes.getBoundingClientRect()
    setBurst({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 })
  }

  const noButton = (
    <button
      ref={noRef}
      type="button"
      className="inline-flex min-h-11 min-w-[7.5rem] touch-none select-none items-center justify-center whitespace-nowrap rounded-full border border-rosy-200/90 bg-white/80 px-6 text-sm font-medium tracking-wide text-rosy-800"
      style={
        pose
          ? { position: 'fixed', left: 0, top: 0, zIndex: 50, margin: 0 }
          : undefined
      }
      aria-describedby="no-live"
      onPointerEnter={onPointerEnter}
      onPointerDown={onPointerDown}
      onKeyDown={onKeyDown}
      onClick={(event) => event.preventDefault()}
    >
      {copy.stage1.no}
    </button>
  )

  return (
    <div ref={root}>
      <StageLayout
        eyebrow={copy.stage1.hi(name)}
        title={copy.stage1.title}
        sticker={expression}
        stickerSlot={
          <div className="relative px-2 pt-14">
            <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex justify-center">
              {message ? (
                <div ref={bubbleRef} aria-hidden="true" className="speech origin-bottom">
                  {message}
                </div>
              ) : null}
            </div>
            {/* <Sticker sticker={expression} className="h-36 w-36 sm:h-44 sm:w-44" priority /> */}
          </div>
        }
        footer={<p className="text-xs mt-10 tracking-wide text-muted">{copy.stage1.caption}</p>}
      >
        <div data-stagger className="flex min-h-[52px] items-center justify-center gap-3">
          <PillButton ref={yesRef} className="z-20" onClick={accept} disabled={accepted.current && !burst}>
            {copy.stage1.yes}
          </PillButton>
          {pose ? null : noButton}
        </div>
        <p id="no-live" className="sr-only" aria-live="polite">
          {message}
        </p>
      </StageLayout>
      {pose ? createPortal(noButton, document.body) : null}
      {burst ? <HeartBurst x={burst.x} y={burst.y} onDone={onYes} /> : null}
    </div>
  )
}
