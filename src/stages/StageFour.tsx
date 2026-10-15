import { useRef, useState, type FormEvent } from 'react'
import { COUNTRY_CODES, DEFAULT_COUNTRY, copy } from '../config'
import { formatDateTime, isE164, toE164, toIsoString } from '../lib/format'
import { kit } from '../lib/stickerKit'
import { sendBooking } from '../services/email'
import { describedBy, Field } from '../components/Field'
import { PillButton } from '../components/PillButton'
import { StageLayout } from '../components/StageLayout'
import type { CountryCode, Invitation } from '../types'

const countries = COUNTRY_CODES as CountryCode[]

type Props = {
  form: Invitation
  onSuccess: (phone: string) => void
}

export function StageFour({ form, onSuccess }: Props) {
  const [countryCode, setCountryCode] = useState(DEFAULT_COUNTRY)
  const [phone, setPhone] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [touched, setTouched] = useState(false)
  const [status, setStatus] = useState<'idle' | 'sending' | 'error'>('idle')
  const sending = useRef(false)

  const country = countries.find((item) => item.code === countryCode) ?? countries[0]
  const e164 = toE164(country.dial, phone)
  const valid = isE164(e164)
  const showError = touched && phone.trim().length > 0 && !valid

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setTouched(true)
    if (!valid || !form.dateType || sending.current) return
    sending.current = true
    setStatus('sending')
    console.log('sending email', form.name, form.dob, form.dateType.name, form.dateType.description, form.dateTime, e164, new Date().toISOString(), honeypot)
    const result = await sendBooking({
      name: form.name,
      dob: form.dob,
      dateType: `${form.dateType.name} — ${form.dateType.description}`,
      dateTime: `${formatDateTime(form.dateTime)} (${toIsoString(form.dateTime)})`,
      phone: e164,
      submittedAt: new Date().toISOString(),
      honeypot,
    })
    if (result.ok) {
      onSuccess(e164)
      return
    }
    sending.current = false
    setStatus('error')
  }

  return (
    <StageLayout title={copy.stage4.title} description={copy.stage4.description} sticker={kit.blush}>
      <form className="relative mx-auto max-w-md space-y-5" onSubmit={submit}>
        <div className="pointer-events-none absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
          <label>
            {copy.stage4.honeypot}
            <input
              tabIndex={-1}
              autoComplete="off"
              name="company"
              value={honeypot}
              onChange={(event) => setHoneypot(event.target.value)}
            />
          </label>
        </div>
        <div data-stagger className="grid gap-3 sm:grid-cols-[minmax(0,11rem)_1fr]">
          <Field id="country" label={copy.stage4.countryLabel}>
            <select
              id="country"
              className="field"
              value={countryCode}
              autoComplete="tel-country-code"
              onChange={(event) => setCountryCode(event.target.value)}
            >
              {countries.map((item) => (
                <option key={item.code} value={item.code}>
                  {item.label} ({item.dial})
                </option>
              ))}
            </select>
          </Field>
          <Field id="phone" label={copy.stage4.phoneLabel} error={showError ? copy.stage4.phoneError : undefined}>
            <input
              id="phone"
              className="field"
              type="tel"
              inputMode="tel"
              autoComplete="tel-national"
              placeholder={copy.stage4.phonePlaceholder}
              value={phone}
              aria-invalid={showError}
              aria-describedby={describedBy('phone', showError ? copy.stage4.phoneError : undefined)}
              onBlur={() => setTouched(true)}
              onChange={(event) => {
                setPhone(event.target.value)
                if (status === 'error') setStatus('idle')
              }}
              required
            />
          </Field>
        </div>
        {status === 'error' ? (
          <p role="alert" className="text-center text-sm text-rosy-800">
            {copy.stage4.error}
          </p>
        ) : null}
        <div data-stagger className="text-center">
          <PillButton type="submit" disabled={!valid || status === 'sending'}>
            {status === 'sending' ? copy.stage4.sending : status === 'error' ? copy.stage4.retry : copy.stage4.send}
          </PillButton>
        </div>
      </form>
    </StageLayout>
  )
}
