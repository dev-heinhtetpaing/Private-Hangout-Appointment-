import { useState, type FormEvent } from 'react'
import { ALLOWED_DOB, copy } from '../config'
import { kit } from '../lib/stickerKit'
import { describedBy, Field } from '../components/Field'
import { PillButton } from '../components/PillButton'
import { StageLayout } from '../components/StageLayout'

type Props = {
  initialName: string
  initialDob: string
  onSubmit: (name: string, dob: string, valid: boolean) => void
}

export function GateStage({ initialName, initialDob, onSubmit }: Props) {
  const [name, setName] = useState(initialName || '')
  const [dob, setDob] = useState(initialDob)
  const trimmed = name.trim()
  const dobReady = /^\d{4}-\d{2}-\d{2}$/.test(dob)
  const ready = Boolean(dobReady)

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (!ready) return
    onSubmit(trimmed, dob, dob === ALLOWED_DOB)
  }

  return (
    <StageLayout eyebrow={copy.brand} title={copy.gate.title} description={copy.gate.teaser} sticker={kit.waving} >
      <form className="mx-auto max-w-md space-y-4" onSubmit={submit}>
        {/* <div data-stagger>
          <Field id="guest-name" label={copy.gate.nameLabel}>
            <input
              id="guest-name"
              className="field"
              name="name"
              autoComplete="name"
              autoCapitalize="words"
              maxLength={80}
              placeholder={copy.gate.namePlaceholder}
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </Field>
        </div> */}
        <div data-stagger>
          <Field id="guest-dob" label={copy.gate.dobLabel}>
            <input
              id="guest-dob"
              className="field"
              type="date"
              name="bday"
              autoComplete="bday"
              value={dob}
              aria-describedby={describedBy('guest-dob')}
              onChange={(event) => setDob(event.target.value)}
              required
            />
          </Field>
        </div>
        <div data-stagger className="pt-2 text-center">
          <PillButton type="submit" disabled={!ready}>
            {copy.gate.continue}
          </PillButton>
        </div>
      </form>
    </StageLayout>
  )
}
