import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { copy } from '../config'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

const labels = copy.progress as string[]

export function Progress({ current }: { current: number }) {
  const fill = useRef<HTMLSpanElement>(null)
  const reduced = usePrefersReducedMotion()
  const total = labels.length

  useGSAP(
    () => {
      if (!fill.current) return
      gsap.to(fill.current, {
        scaleX: (current - 1) / (total - 1),
        duration: reduced ? 0.01 : 0.6,
        ease: 'power3.out',
        transformOrigin: 'left center',
      })
    },
    { dependencies: [current, reduced, total] },
  )

  return (
    <nav
      aria-label="Invitation progress"
      className="pointer-events-none fixed inset-x-0 top-0 z-30 px-5 pt-[max(0.85rem,env(safe-area-inset-top))]"
    >
      <div className="mx-auto w-full max-w-xs">
        <p className="sr-only">
          Step {current} of {total}: {labels[current - 1]}
        </p>
        <div className="relative h-1 overflow-hidden rounded-full bg-white/70">
          <span ref={fill} className="block h-full origin-left scale-x-0 rounded-full bg-gradient-to-r from-rosy-400 to-rosy-700" />
        </div>
        <ol className="mt-2 flex justify-between">
          {labels.map((label, index) => {
            const step = index + 1
            const active = step === current
            const done = step < current
            return (
              <li key={label} className="flex flex-col items-center gap-1" aria-current={active ? 'step' : undefined}>
                <span
                  className={`block h-1.5 w-1.5 rounded-full ${done || active ? 'bg-rosy-600' : 'bg-rosy-200'} ${active ? 'scale-125' : ''}`}
                />
                <span className="sr-only">{label}</span>
              </li>
            )
          })}
        </ol>
      </div>
    </nav>
  )
}
