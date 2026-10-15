export function nowDatetimeLocal() {
  const date = new Date()
  const pad = (value: number) => String(value).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export function isFutureDateTime(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(value)) return false
  const parsed = new Date(value)
  return !Number.isNaN(parsed.getTime()) && parsed.getTime() > Date.now()
}

export function formatDateTime(value: string) {
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return value
  return new Intl.DateTimeFormat(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(parsed)
}

export function toIsoString(value: string) {
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return value
  return parsed.toISOString()
}

export function digitsOnly(value: string) {
  return value.replace(/\D/g, '')
}

export function nationalDigits(dial: string, raw: string) {
  const dialDigits = digitsOnly(dial)
  let digits = digitsOnly(raw)
  if (dialDigits && digits.startsWith(dialDigits) && digits.length > dialDigits.length) {
    digits = digits.slice(dialDigits.length)
  }
  return digits.replace(/^0+/, '')
}

export function toE164(dial: string, national: string) {
  return `+${digitsOnly(dial)}${nationalDigits(dial, national)}`
}

export function isE164(value: string) {
  return /^\+[1-9]\d{7,14}$/.test(value)
}
