import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { copy } from '../config'
import { formatDateTime } from '../lib/format'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { kit } from '../lib/stickerKit'
import { StageLayout } from '../components/StageLayout'
import type { Invitation } from '../types'

export function StageFive({ form }: { form: Invitation }) {
  const root = useRef<HTMLDivElement>(null)
  const reduced = usePrefersReducedMotion()

  useGSAP(
    () => {
      if (reduced) return
      const title = root.current?.querySelector('h1')
      if (!title) return
      gsap.fromTo(
        title,
        { backgroundPosition: '0% 50%' },
        { backgroundPosition: '100% 50%', duration: 3.4, ease: 'sine.inOut', yoyo: true, repeat: -1 },
      )
    },
    { scope: root, dependencies: [reduced] },
  )

  return (
    <div ref={root}>
      <StageLayout
        eyebrow={copy.stage5.eyebrow(form.name)}
        title={copy.stage5.title}
        description={copy.stage5.description}
        sticker={kit.inLove}
        titleClassName={reduced ? 'text-ink' : 'title-shimmer'}
      >
        <div data-stagger className="mx-auto max-w-md rounded-2xl border border-champagne/40 bg-white/55 px-5 py-4 text-left">
          <dl className="space-y-3">
            {/* <div>
              <dt className="text-[0.68rem] font-medium uppercase tracking-[0.18em] text-rosy-700">{copy.stage5.with}</dt>
              <dd className="mt-1 font-display text-2xl text-ink">{form.name}</dd>
            </div> */}
            {form.dateType ? (
              <div>
                <dt className="text-[0.68rem] font-medium uppercase tracking-[0.18em] text-rosy-700">{copy.stage5.plan}</dt>
                <dd className="mt-1 text-base text-ink">{form.dateType.description}</dd>
              </div>
            ) : null}
            {form.dateTime ? (
              <div>
                <dt className="text-[0.68rem] font-medium uppercase tracking-[0.18em] text-rosy-700">{copy.stage5.when}</dt>
                <dd className="mt-1 text-base text-ink">{formatDateTime(form.dateTime)}</dd>
              </div>
            ) : null}
          </dl>
        </div>
      </StageLayout>
    </div>
  )
}
