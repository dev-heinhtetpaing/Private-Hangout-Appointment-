import { dateTypeStickers, particleStickers, preloadStickers, stickers } from '../stickers'
import type { StickerAsset } from '../types'

export const kit = stickers as unknown as Record<string, StickerAsset>
export const particles = particleStickers as StickerAsset[]
export const dateIcons = dateTypeStickers as Record<string, StickerAsset>
export const preload = preloadStickers as (reducedMotion?: boolean) => Promise<unknown>
