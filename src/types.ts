export type Stage = 'loading' | 'gate' | 'invalid' | 1 | 2 | 3 | 4 | 5

export type DateChoice = {
  name: string
  description: string
}

export type Invitation = {
  name: string
  dob: string
  dateType: DateChoice | null
  dateTime: string
  phone: string
}

export type StickerAsset = {
  id: string
  src: string
  still: string
  width: number
  height: number
  alt: string
  animated: boolean
}

export type CountryCode = {
  code: string
  label: string
  dial: string
}
