import type { Controls } from '../types/controls'
import type { Vehicle } from '../types/vehicle'
import { useRef } from 'react'
import { DEFAULT_VEHICLE_CONFIG } from '../types/vehicle'
import { clamp } from '../utils/math'

/**
 * Hook to manage vehicle physics state and updates
 */
export function useVehiclePhysics() {
  const state = useRef<Vehicle>({ ...DEFAULT_VEHICLE_CONFIG })

  const updatePhysics = (controls: Controls, delta: number): Vehicle => {
    // Update speed based on controls
    state.current.speed = updateSpeed(state.current, controls, delta)

    // Update rotation when moving
    if (Math.abs(state.current.speed) > 0.1) {
      updateRotation(state.current, controls, delta)
    }

    // Update position based on current direction
    updatePosition(state.current, delta)

    // Calculate velocity magnitude from speed
    state.current.velocity = Math.abs(state.current.speed)

    return state.current
  }

  return {
    state,
    updatePhysics,
  }
}

/**
 * Updates vehicle speed based on controls and physics constraints
 */
function updateSpeed(vehicle: Vehicle, controls: Controls, delta: number): number {
  const acceleration = vehicle.acceleration * delta
  const deceleration = vehicle.deceleration * delta

  if (controls.forward) {
    return clamp(
      vehicle.speed + acceleration,
      -vehicle.maxSpeed,
      vehicle.maxSpeed,
    )
  }

  if (controls.backward) {
    return clamp(
      vehicle.speed - acceleration,
      vehicle.maxReverseSpeed,
      vehicle.maxSpeed,
    )
  }

  // Natural deceleration
  if (Math.abs(vehicle.speed) < deceleration) {
    return 0
  }

  const direction = Math.sign(vehicle.speed)
  return vehicle.speed - direction * deceleration
}

/**
 * Updates vehicle rotation based on controls and current speed
 */
function updateRotation(vehicle: Vehicle, controls: Controls, delta: number): void {
  const direction = Math.sign(vehicle.speed)
  const turnAmount = vehicle.turnSpeed * delta * direction

  if (controls.left) {
    vehicle.rotation.y += turnAmount
  }
  if (controls.right) {
    vehicle.rotation.y -= turnAmount
  }
}

/**
 * Updates vehicle position based on current speed and rotation
 */
function updatePosition(vehicle: Vehicle, delta: number): void {
  const displacement = vehicle.speed * delta
  const angle = vehicle.rotation.y

  vehicle.position.x -= Math.sin(angle) * displacement
  vehicle.position.z -= Math.cos(angle) * displacement
}
