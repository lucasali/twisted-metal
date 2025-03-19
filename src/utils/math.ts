/**
 * Clamps a value between a minimum and maximum value
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

/**
 * Linear interpolation between two values
 */
export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t
}

/**
 * Calculates steering factor based on current speed
 */
export function calculateSteeringFactor(speed: number): number {
  return 1 - clamp(Math.abs(speed) * 0.02, 0, 0.7)
}
