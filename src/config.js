/** Secret gate. Compared as a YYYY-MM-DD string, never as a Date. */
export const ALLOWED_DOB = '1999-07-07'

export const DATE_TYPES = [
  { name: 'coffee', description: 'Coffee & Conversation' },
  { name: 'movie', description: 'Cinema or Drive-in' },
  { name: 'dinner', description: 'Dinner & Drinks' },
  { name: 'beach', description: 'Beach Day or Sunset Walk' },
  { name: 'activity', description: 'Active & Gaming' },
  { name: 'culture', description: 'Museum & Arts' },
  { name: 'club', description: 'Clubbing & Nightlife' },
]

export const NO_MESSAGES = [
  'Are you sure about that?',
  'You might want to rethink that.',
  'Second thoughts?',
  "You're second-guessing yourself.",
  'Take a second look.',
  'Are you positive?',
  'Think again.',
  'Double-check that.',
  'Are you for real?',
]

export const COUNTRY_CODES = [
  { code: 'AE', label: 'United Arab Emirates', dial: '+971' },
  { code: 'SA', label: 'Saudi Arabia', dial: '+966' },
  { code: 'QA', label: 'Qatar', dial: '+974' },
  { code: 'KW', label: 'Kuwait', dial: '+965' },
  { code: 'BH', label: 'Bahrain', dial: '+973' },
  { code: 'OM', label: 'Oman', dial: '+968' },
  { code: 'EG', label: 'Egypt', dial: '+20' },
  { code: 'JO', label: 'Jordan', dial: '+962' },
  { code: 'LB', label: 'Lebanon', dial: '+961' },
  { code: 'IN', label: 'India', dial: '+91' },
  { code: 'PK', label: 'Pakistan', dial: '+92' },
  { code: 'GB', label: 'United Kingdom', dial: '+44' },
  { code: 'US', label: 'United States', dial: '+1' },
  { code: 'CA', label: 'Canada', dial: '+1' },
  { code: 'FR', label: 'France', dial: '+33' },
  { code: 'DE', label: 'Germany', dial: '+49' },
  { code: 'IT', label: 'Italy', dial: '+39' },
  { code: 'ES', label: 'Spain', dial: '+34' },
  { code: 'TR', label: 'Turkey', dial: '+90' },
  { code: 'AU', label: 'Australia', dial: '+61' },
  { code: 'SG', label: 'Singapore', dial: '+65' },
  { code: 'MY', label: 'Malaysia', dial: '+60' },
  { code: 'PH', label: 'Philippines', dial: '+63' },
  { code: 'ZA', label: 'South Africa', dial: '+27' },
  { code: 'NG', label: 'Nigeria', dial: '+234' },
  { code: 'BR', label: 'Brazil', dial: '+55' },
  { code: 'JP', label: 'Japan', dial: '+81' },
  { code: 'KR', label: 'South Korea', dial: '+82' },
]

export const DEFAULT_COUNTRY = 'AE'

export const copy = {
  brand: 'Hangout',
  loader: {
    eyebrow: 'A private invitation',
    tagline: 'Someone saved a rose-colored evening for you.',
  },
  gate: {
    title: 'You have been invited',
    teaser: 'Someone has a question for you…',
    nameLabel: 'Your name',
    namePlaceholder: 'What should I call you?',
    dobLabel: 'Date of birth',
    continue: 'Continue',
  },
  invalid: {
    title: "Oops, this invitation isn't for you",
    description: "You're not the one chosen for this hangout. Maybe next time 🌙",
    retry: 'Try again',
  },
  stage1: {
    hi: (name) => `Hi ${name}`,
    title: 'Will you go out with me?',
    yes: 'Yes',
    no: 'No',
    caption: "Choose wisely… I'm watching 👀",
  },
  stage2: {
    title: 'Choose whatever your heart desires',
    description:
      'Feel free to choose whatever your heart desires in this world.',
    bubble: 'As for me, my only preference is you.',
    next: 'Next',
    hint: 'Select one to continue',
  },
  stage3: {
    title: 'When shall I steal you away?',
    description: "Pick the moment, and I'll make it unforgettable.",
    dateLabel: 'Date and time',
    next: 'Next',
    error: 'Choose a moment that hasn’t passed yet.',
  },
  stage4: {
    title: 'Where can I reach you?',
    description: 'Just so I can tell you the plan and count down with you.',
    countryLabel: 'Country code',
    phoneLabel: 'Phone number',
    phonePlaceholder: '50 123 4567',
    send: 'Send my answer',
    sending: 'Sending…',
    retry: 'Retry',
    error: "The note couldn't be sent just now. Your answers are still here — please try again.",
    phoneError: 'Use 8 to 15 digits, including the country code.',
    honeypot: 'Company',
  },
  stage5: {
    eyebrow: (name) => `For ${name}`,
    title: "It's a date",
    description:
      "It's a date! 💗 I can't wait to see you. Until then, I'll be counting the hours, hoping everything goes perfectly.",
    with: 'With',
    plan: 'The plan',
    when: 'When',
  },
  progress: ['Answer', 'Plan', 'When', 'Contact', 'Done'],
}

export const titles = {
  loading: 'Hangout Invitation',
  gate: 'You have been invited · Hangout',
  invalid: 'Not this time · Hangout',
  1: 'Will you go out with me? · Hangout',
  2: 'Choose whatever your heart desires · Hangout',
  3: 'When shall I steal you away? · Hangout',
  4: 'Where can I reach you? · Hangout',
  5: "It's a date · Hangout",
}
