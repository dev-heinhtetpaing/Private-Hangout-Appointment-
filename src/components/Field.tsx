import type { ReactNode } from 'react'

type Props = {
  id: string
  label: string
  children: ReactNode
  error?: string
  hint?: string
}

export function Field({ id, label, children, error, hint }: Props) {
  const messageId = error ? `${id}-error` : hint ? `${id}-hint` : undefined
  return (
    <div className="text-left">
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-ink">
        {label}
      </label>
      {children}
      {error ? (
        <p id={messageId} role="alert" className="mt-2 text-sm text-rosy-800">
          {error}
        </p>
      ) : hint ? (
        <p id={messageId} className="mt-2 text-sm text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  )
}

export function describedBy(id: string, error?: string, hint?: string) {
  if (error) return `${id}-error`
  if (hint) return `${id}-hint`
  return undefined
}
