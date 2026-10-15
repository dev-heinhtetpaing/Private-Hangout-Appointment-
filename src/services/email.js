import emailjs from '@emailjs/browser'

let inFlight = false

/**
 * @param {object} data
 * @param {string} data.name
 * @param {string} data.dob
 * @param {string} data.dateType
 * @param {string} data.dateTime
 * @param {string} data.phone
 * @param {string} data.submittedAt
 * @param {string} [data.honeypot]
 * @returns {Promise<{ ok: boolean, error?: string, fallback?: string }>}
 */
export async function sendBooking(data) {
  if (data.honeypot && data.honeypot.trim()) {
    return { ok: true, fallback: 'honeypot' }
  }

  if (inFlight) {
    return { ok: false, error: 'already-sending' }
  }

  inFlight = true
  try {
    const serviceId = import.meta.env.VITE_EMAIL_SERVICE_ID
    const templateId = import.meta.env.VITE_EMAIL_TEMPLATE_ID
    const publicKey = import.meta.env.VITE_EMAIL_PUBLIC_ID

    if (!serviceId || !templateId || !publicKey) {
      console.error(
        '[hangout] EmailJS is not configured. Set VITE_EMAIL_SERVICE_ID, VITE_EMAIL_TEMPLATE_ID, and VITE_EMAIL_PUBLIC_ID.',
      )
      return { ok: false, error: 'not-configured' }
    }

    await emailjs.send(
      serviceId,
      templateId,
      {
        name: data.name,
        dob: data.dob,
        date_type: data.dateType,
        date_time: data.dateTime,
        phone: data.phone,
        submitted_at: data.submittedAt,
      },
       publicKey ,
    )

    return { ok: true }
  } catch (error) {
    console.error('[hangout] EmailJS send failed.')
    return { ok: false, error: error instanceof Error ? error.message : 'send-failed' }
  } finally {
    inFlight = false
  }
}
