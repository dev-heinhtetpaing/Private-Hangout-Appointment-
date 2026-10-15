import type { ReactNode } from 'react'
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { StickerAsset } from '../types';
import { Sticker } from './Sticker';
type Props = {
  eyebrow?: string
  title: string
  description?: string
  sticker?: string | StickerAsset
  stickerSlot?: ReactNode
  children?: ReactNode
  footer?: ReactNode
  wide?: boolean
  titleClassName?: string
}

export function StageLayout({
  eyebrow,
  title,
  description,
  sticker,
  stickerSlot,
  children,
  footer,
  wide,
  titleClassName = 'text-ink',
}: Props) {
  return (
    <section className="mx-auto flex min-h-dvh w-full max-w-full flex-col justify-center px-4 pb-[max(2rem,env(safe-area-inset-bottom))] pt-20 sm:px-6 sm:pb-12 sm:pt-24">
      <article className={`glass mx-auto w-full rounded-3xl px-5 py-7 sm:px-8 sm:py-10 ${wide ? 'max-w-5xl' : 'max-w-xl'}`}>
        <header className="text-center">
          {eyebrow ? (
            <p data-stagger className="text-xs font-medium uppercase tracking-[0.22em] text-rosy-700">
              {eyebrow}
            </p>
          ) : null}
          <h1
            data-stagger
            tabIndex={-1}
            className={`mt-3 text-balance font-display text-[2.15rem] font-medium leading-[1.08] sm:text-5xl lg:text-6xl ${titleClassName}`}
          >
            {title}
          </h1>
          <div data-stagger className="hairline mx-auto mt-4" aria-hidden="true" />
          {description ? (
            <p data-stagger className="mx-auto mt-4 max-w-prose text-base leading-relaxed text-muted sm:text-lg">
              {description}
            </p>
          ) : null}
        </header>

        <div data-sticker className="mt-3 flex justify-center relative items-center ">
        <div className='h-40 w-40 sm:h-60 sm:w-60 '>
        <DotLottieReact src={typeof sticker === 'string' ? sticker : ""}  loop autoplay /></div>
         <div className=' top-0 sm:right-20 right-5 absolute w-40'>
         {stickerSlot ?? (sticker ? <Sticker sticker={typeof sticker === 'string' ? null : sticker} className="h-32 w-40 sm:h-40 sm:w-60" priority /> : null)}
         </div>
        </div>

        {children ? <div className="mt-6">{children}</div> : null}
        {footer ? <div data-stagger className="mt-5 text-center">{footer}</div> : null}
      </article>
    </section>
  )
}
