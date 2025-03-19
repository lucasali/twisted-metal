import type { Controls } from '../types/controls'
import { useCallback, useEffect, useMemo, useState } from 'react'

interface KeyConfig {
  forward: string
  backward: string
  left: string
  right: string
  boost: string
}

const DEFAULT_KEY_CONFIG: KeyConfig = {
  forward: 'w',
  backward: 's',
  left: 'a',
  right: 'd',
  boost: 'shift',
} as const

interface VehicleControls extends Controls {
  boost: boolean
  velocity: number
  lastUpdateTime: number
}

const CONTROL_SETTINGS = {
  acceleration: 0.5,
  deceleration: 0.3,
  boostMultiplier: 1.5,
  maxVelocity: 10,
  maxBoostVelocity: 15,
  turnSpeed: 0.05,
} as const

/**
 * Hook to handle vehicle keyboard controls with velocity and boost
 */
export function useVehicleControls(
  keyConfig: Partial<KeyConfig> = {},
  settings: Partial<typeof CONTROL_SETTINGS> = {},
) {
  // Memoize configurations
  const finalKeyConfig = useMemo(
    () => ({ ...DEFAULT_KEY_CONFIG, ...keyConfig }),
    [keyConfig],
  )

  const finalSettings = useMemo(
    () => ({ ...CONTROL_SETTINGS, ...settings }),
    [settings],
  )

  // Control state with velocity
  const [controls, setControls] = useState<VehicleControls>({
    forward: false,
    backward: false,
    left: false,
    right: false,
    boost: false,
    velocity: 0,
    lastUpdateTime: performance.now(),
  })

  // Memoized key mapping
  const keyMap = useMemo(() => {
    return Object.entries(finalKeyConfig).reduce((map, [action, key]) => {
      // Handle special keys like 'shift'
      if (key === 'shift') {
        map.ShiftLeft = action as keyof VehicleControls
        map.ShiftRight = action as keyof VehicleControls
      }
      else {
        map[key.toLowerCase()] = action as keyof VehicleControls
      }
      return map
    }, {} as Record<string, keyof VehicleControls>)
  }, [finalKeyConfig])

  // Update velocity based on controls
  const updateVelocity = useCallback((currentControls: VehicleControls) => {
    const now = performance.now()
    const deltaTime = (now - currentControls.lastUpdateTime) / 1000 // Convert to seconds

    let newVelocity = currentControls.velocity
    const maxVel = currentControls.boost
      ? finalSettings.maxBoostVelocity
      : finalSettings.maxVelocity

    // Apply acceleration/deceleration
    if (currentControls.forward) {
      const acceleration = currentControls.boost
        ? finalSettings.acceleration * finalSettings.boostMultiplier
        : finalSettings.acceleration
      newVelocity = Math.min(maxVel, newVelocity + acceleration * deltaTime)
    }
    else if (currentControls.backward) {
      newVelocity = Math.max(-maxVel / 2, newVelocity - finalSettings.acceleration * deltaTime)
    }
    else if (Math.abs(newVelocity) > 0.01) {
      // Apply deceleration when no input
      const deceleration = finalSettings.deceleration * deltaTime
      newVelocity = Math.abs(newVelocity) <= deceleration
        ? 0
        : newVelocity - Math.sign(newVelocity) * deceleration
    }

    return {
      ...currentControls,
      velocity: newVelocity,
      lastUpdateTime: now,
    }
  }, [finalSettings])

  // Handle key events
  useEffect(() => {
    const handleKey = (pressed: boolean) => (e: KeyboardEvent) => {
      const key = e.code === 'ShiftLeft' || e.code === 'ShiftRight'
        ? e.code
        : e.key.toLowerCase()

      const control = keyMap[key]
      if (control) {
        e.preventDefault() // Prevent default browser behavior
        setControls(prev => updateVelocity({
          ...prev,
          [control]: pressed,
        }))
      }
    }

    const handleKeyDown = handleKey(true)
    const handleKeyUp = handleKey(false)

    // Update velocity on animation frame
    let frameId: number
    const updateFrame = () => {
      setControls(updateVelocity)
      frameId = requestAnimationFrame(updateFrame)
    }
    frameId = requestAnimationFrame(updateFrame)

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      cancelAnimationFrame(frameId)
    }
  }, [keyMap, updateVelocity])

  return controls
}
