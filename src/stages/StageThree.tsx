import { useState, type FormEvent } from 'react'
import { copy } from '../config'
import { isFutureDateTime, nowDatetimeLocal } from '../lib/format'
import { kit } from '../lib/stickerKit'
import { describedBy, Field } from '../components/Field'
import { PillButton } from '../components/PillButton'
import { StageLayout } from '../components/StageLayout'

export function StageThree({ onNext }: { onNext: (dateTime: string) => void }) {
  const [value, setValue] = useState('')
  const [min, setMin] = useState(nowDatetimeLocal)
  const valid = isFutureDateTime(value)
  const showError = value.length > 0 && !valid

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (!isFutureDateTime(value)) {
      setMin(nowDatetimeLocal())
      return
    }
    onNext(value)
  }

  return (
    <StageLayout title={copy.stage3.title} description={copy.stage3.description} sticker={kit.wink}>
      <form className="mx-auto max-w-md space-y-5" onSubmit={submit}>
        <div data-stagger>
          <Field id="date-time" label={copy.stage3.dateLabel} error={showError ? copy.stage3.error : undefined}>
            <input
              id="date-time"
              className="field"
              type="datetime-local"
              step={60}
              min={min}
              value={value}
              aria-invalid={showError}
              aria-describedby={describedBy('date-time', showError ? copy.stage3.error : undefined)}
              onChange={(event) => setValue(event.target.value)}
              required
            />
          </Field>
        </div>
        <div data-stagger className="text-center">
          <PillButton type="submit" disabled={!valid}>
            {copy.stage3.next}
          </PillButton>
        </div>
      </form>
    </StageLayout>
  )
}
