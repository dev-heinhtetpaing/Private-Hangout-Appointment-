export type Spot = { x: number; y: number }

type Pointer = { x: number; y: number }

function overlaps(x: number, y: number, width: number, height: number, blocked: DOMRect, gap: number) {
  return (
    x + width > blocked.left - gap &&
    x < blocked.right + gap &&
    y + height > blocked.top - gap &&
    y < blocked.bottom + gap
  )
}

function nearPointer(x: number, y: number, width: number, height: number, pointer?: Pointer) {
  if (!pointer) return false
  const dx = x + width / 2 - pointer.x
  const dy = y + height / 2 - pointer.y
  return dx * dx + dy * dy < 130 * 130
}

/** Pick a viewport position that stays on screen and clear of the Yes button. */
export function findOpenSpot(width: number, height: number, blocked: DOMRect, pointer?: Pointer): Spot {
  const viewport = window.visualViewport
  const originX = viewport?.offsetLeft ?? 0
  const originY = viewport?.offsetTop ?? 0
  const viewW = viewport?.width ?? window.innerWidth
  const viewH = viewport?.height ?? window.innerHeight
  const pad = 12
  const minX = originX + pad
  const minY = originY + pad
  const maxX = Math.max(minX, originX + viewW - width - pad)
  const maxY = Math.max(minY, originY + viewH - height - pad)

  const blockedSpot = (x: number, y: number) =>
    overlaps(x, y, width, height, blocked, 18) || nearPointer(x, y, width, height, pointer)

  for (let attempt = 0; attempt < 48; attempt += 1) {
    const x = minX + Math.random() * (maxX - minX)
    const y = minY + Math.random() * (maxY - minY)
    if (!blockedSpot(x, y)) return { x, y }
  }

  const corners = [
    { x: minX, y: minY },
    { x: maxX, y: minY },
    { x: minX, y: maxY },
    { x: maxX, y: maxY },
  ]
  const centerX = blocked.left + blocked.width / 2
  const centerY = blocked.top + blocked.height / 2
  corners.sort((a, b) => {
    const distance = (spot: Spot) => (spot.x + width / 2 - centerX) ** 2 + (spot.y + height / 2 - centerY) ** 2
    return distance(b) - distance(a)
  })

  return corners.find((corner) => !blockedSpot(corner.x, corner.y)) ?? corners[0]
}

export function maxButtonScale(baseWidth: number, baseHeight: number) {
  const maxWidth = window.innerWidth - 28
  const maxHeight = Math.min(window.innerHeight * 0.3, 140)
  if (baseWidth <= 0 || baseHeight <= 0) return 1
  return Math.max(1, Math.min(maxWidth / baseWidth, maxHeight / baseHeight, 2.6))
}
