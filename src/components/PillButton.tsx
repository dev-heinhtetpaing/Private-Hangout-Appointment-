import { forwardRef, useRef, type ButtonHTMLAttributes, type MutableRefObject, type ReactNode } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

type Props = {
  children: ReactNode
  variant?: 'primary' | 'ghost'
  className?: string
} & ButtonHTMLAttributes<HTMLButtonElement>

export const PillButton = forwardRef<HTMLButtonElement, Props>(function PillButton(
  { children, variant = 'primary', className = '', disabled, type = 'button', ...props },
  ref,
) {
  const buttonRef = useRef<HTMLButtonElement | null>(null)
  const reduced = usePrefersReducedMotion()
  const wasDisabled = useRef(disabled)

  const assignRef = (node: HTMLButtonElement | null) => {
    buttonRef.current = node
    if (typeof ref === 'function') ref(node)
    else if (ref) (ref as MutableRefObject<HTMLButtonElement | null>).current = node
  }

  useGSAP(
    () => {
      const button = buttonRef.current
      if (!button) return
      const shine = button.querySelector('[data-shine]')
      const press = button.querySelector('[data-press]')

      const sweep = () => {
        if (button.disabled || reduced || !shine) return
        gsap.fromTo(shine, { xPercent: -140 }, { xPercent: 240, duration: 0.7, ease: 'power2.out', overwrite: 'auto' })
      }
      const down = () => {
        if (button.disabled || reduced || !press) return
        gsap.to(press, { scale: 0.97, duration: 0.12, overwrite: 'auto' })
      }
      const up = () => {
        if (!press || reduced) return
        gsap.to(press, { scale: 1, duration: 0.2, ease: 'power2.out', overwrite: 'auto' })
      }

      button.addEventListener('pointerenter', sweep)
      button.addEventListener('pointerdown', down)
      button.addEventListener('pointerup', up)
      button.addEventListener('pointerleave', up)
      return () => {
        button.removeEventListener('pointerenter', sweep)
        button.removeEventListener('pointerdown', down)
        button.removeEventListener('pointerup', up)
        button.removeEventListener('pointerleave', up)
      }
    },
    { dependencies: [disabled, reduced] },
  )

  useGSAP(
    () => {
      if (wasDisabled.current && !disabled && buttonRef.current && !reduced) {
        gsap.fromTo(buttonRef.current, { scale: 0.94 }, { scale: 1, duration: 0.45, ease: 'elastic.out(1, 0.6)' })
        const shine = buttonRef.current.querySelector('[data-shine]')
        if (shine) {
          gsap.fromTo(shine, { xPercent: -140 }, { xPercent: 240, duration: 0.75, ease: 'power2.out' })
        }
      }
      wasDisabled.current = disabled
    },
    { dependencies: [disabled, reduced] },
  )

  const look =
    variant === 'primary'
      ? 'bg-gradient-to-r from-rosy-800 via-rosy-700 to-rosy-800 text-white shadow-glow'
      : 'border border-rosy-200/80 bg-white/75 text-rosy-800'

  return (
    <button
      ref={assignRef}
      type={type}
      disabled={disabled}
      className={`relative inline-flex min-h-11 min-w-[7.5rem] items-center justify-center rounded-full px-6 text-sm font-medium tracking-wide transition-opacity disabled:cursor-not-allowed disabled:opacity-40 ${look} ${className}`}
      {...props}
    >
      <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-full" aria-hidden="true">
        <span
          data-shine=""
          className="absolute inset-y-0 left-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/55 to-transparent"
        />
      </span>
      <span data-press="" className="relative z-10">
        {children}
      </span>
    </button>
  )
})
