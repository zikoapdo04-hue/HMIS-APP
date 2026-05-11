/**
 * Convert Flutter's Color integer (e.g. 0xFF2096A4) to a CSS hex string (#2096A4).
 *
 * Flutter stores color as ARGB in a 32-bit int:
 *   Bits 31-24 = alpha (0xFF = fully opaque)
 *   Bits 23-16 = red
 *   Bits 15-8  = green
 *   Bits 7-0   = blue
 */
export function flutterColorToCss(colorInt: number): string {
  const r = (colorInt >> 16) & 0xff
  const g = (colorInt >>  8) & 0xff
  const b =  colorInt        & 0xff
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

/** Add alpha (0–1) to a CSS hex color, producing rgba() */
export function hexWithAlpha(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

/** Return a lightly tinted background (10% opacity) for a specialty color chip */
export function specialtyChipBg(hex: string): string {
  return hexWithAlpha(hex, 0.1)
}
