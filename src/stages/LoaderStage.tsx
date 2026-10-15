import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { copy } from '../config'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { kit, preload } from '../lib/stickerKit'

export function LoaderStage({ onDone }: { onDone: () => void }) {
  const root = useRef<HTMLDivElement>(null)
  const reduced = usePrefersReducedMotion()
  const onDoneRef = useRef(onDone)
  onDoneRef.current = onDone
  const animDone = useRef(false)
  const assetsDone = useRef(false)
  const finished = useRef(false)

  const finish = () => {
    if (finished.current || !animDone.current || !assetsDone.current) return
    finished.current = true
    onDoneRef.current()
  }

  useEffect(() => {
    let cancel = false
    const timeout = window.setTimeout(() => {
      if (cancel) return
      assetsDone.current = true
      finish()
    }, 4000)
    preload(reduced).finally(() => {
      if (cancel) return
      assetsDone.current = true
      finish()
    })
    return () => {
      cancel = true
      window.clearTimeout(timeout)
    }
  }, [reduced])

  useGSAP(
    () => {
      const rootEl = root.current
      if (!rootEl) return
      const heart = rootEl.querySelector('[data-loader-heart]')
      const line = rootEl.querySelector('[data-loader-line]')
      const lineCopy = rootEl.querySelector('[data-loader-copy]')
      if (!heart || !line || !lineCopy) return
      if (reduced) {
        gsap.set([heart, lineCopy], { opacity: 1, y: 0, scale: 1 })
        gsap.set(line, { scaleX: 1 })
        animDone.current = true
        finish()
        return
      }
      const timeline = gsap.timeline({
        onComplete: () => {
          animDone.current = true
          finish()
        },
      })
      timeline.fromTo(heart, { scale: 0.62, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.8, ease: 'elastic.out(1, 0.62)' })
      timeline.to(heart, { scale: 1.07, duration: 0.65, yoyo: true, repeat: 2, ease: 'sine.inOut' }, 0.55)
      timeline.fromTo(line, { scaleX: 0 }, { scaleX: 1, duration: 1.7, ease: 'power2.inOut' }, 0.3)
      timeline.fromTo(lineCopy, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, 0.45)
      timeline.to({}, { duration: 0.4 })
    },
    { scope: root, dependencies: [reduced] },
  )

  const heart = kit.heart

  return (
    <div ref={root} className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <p className="text-xs font-medium uppercase tracking-[0.28em] text-rosy-700">{copy.loader.eyebrow}</p>
      <img
        data-loader-heart=""
        src={reduced ? heart.still : heart.src}
        width={heart.width}
        height={heart.height}
        alt={heart.alt}
        draggable={false}
        className="mt-6 h-28 w-28 object-contain"
        style={reduced ? undefined : { opacity: 0 }}
      />
      <h1
        data-loader-copy=""
        tabIndex={-1}
        className="mt-6 max-w-sm font-display text-3xl font-medium leading-tight text-ink sm:text-4xl"
        style={reduced ? undefined : { opacity: 0 }}
      >
        {copy.loader.tagline}
      </h1>
      <div className="mt-8 h-px w-40 overflow-hidden rounded-full bg-white/70" aria-hidden="true">
        <span
          data-loader-line=""
          className="block h-full w-full origin-left scale-x-0 bg-gradient-to-r from-champagne via-rosy-500 to-rosy-700"
        />
      </div>
    </div>
  )
}
