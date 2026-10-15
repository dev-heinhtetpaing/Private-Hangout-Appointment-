/**
 * One sticker set for the whole invitation.
 * Art: Animated Fluent Emojis (Microsoft Fluent Emoji), MIT.
 * Swap the set by replacing files in /public/stickers and editing this map only.
 *
 * @typedef {Object} StickerAsset
 * @property {string} id
 * @property {string} src
 * @property {string} still
 * @property {number} width
 * @property {number} height
 * @property {string} alt
 * @property {boolean} animated
 */

/**
 * @param {string} id
 * @param {string} alt
 * @param {boolean} animated
 * @returns {StickerAsset}
 */
function sticker(id, alt, animated) {
  return {
    id,
    src: `/stickers/${id}.webp`,
    still: animated ? `/stickers/${id}-still.webp` : `/stickers/${id}.webp`,
    width: 160,
    height: 160,
    alt,
    animated,
  }
}

export const stickers = {
  pleading: import.meta.env.VITE_pleading,
  crying: import.meta.env.VITE_crying,
  pensive: import.meta.env.VITE_pensive,
  waving: import.meta.env.VITE_waving,
  heartEyes: import.meta.env.VITE_heartEyes,
  wink: import.meta.env.VITE_wink,
  blush: import.meta.env.VITE_blush,
  inLove: import.meta.env.VITE_inLove,
  heart: sticker('heart', 'Heart', true),
  sparklingHeart: sticker('sparkling-heart', 'Sparkling heart', true),
  growingHeart: sticker('growing-heart', 'Growing heart', true),
  twoHearts: sticker('two-hearts', 'Two hearts', true),
  beatingHeart: sticker('beating-heart', 'Beating heart', true),
  revolvingHearts: sticker('revolving-hearts', 'Revolving hearts', true),
  coffee: sticker('coffee', 'Coffee', false),
  movie: sticker('movie', 'Cinema', false),
  dinner: sticker('dinner', 'Dinner', false),
  beach: sticker('beach', 'Beach', false),
  activity: sticker('activity', 'Game', false),
  culture: sticker('culture', 'Museum', false),
  club: sticker('club', 'Dancing', false),
}

export const particleStickers = [
  stickers.heart,
  stickers.sparklingHeart,
  stickers.twoHearts,
  stickers.growingHeart,
  stickers.beatingHeart,
  stickers.revolvingHearts,
]

export const dateTypeStickers = {
  coffee: stickers.coffee,
  movie: stickers.movie,
  dinner: stickers.dinner,
  beach: stickers.beach,
  activity: stickers.activity,
  culture: stickers.culture,
  club: stickers.club,
}

/**
 * @param {boolean} [reducedMotion]
 */
export function preloadStickers(reducedMotion = false) {
  const urls = new Set()
  Object.values(stickers).forEach((item) => {
    urls.add(reducedMotion ? item.still : item.src)
  })
  return Promise.all(
    [...urls].map(
      (src) =>
        new Promise((resolve) => {
          const image = new Image()
          image.onload = () => resolve(true)
          image.onerror = () => resolve(false)
          image.src = src
        }),
    ),
  )
}
