import type { Vehicle } from '../types/vehicle'
import { useEffect, useState } from 'react'

interface Controls {
  forward: boolean
  backward: boolean
  left: boolean
  right: boolean
}

export function useVehicleControls() {
  const [controls, setControls] = useState<Controls>({
    forward: false,
    backward: false,
    left: false,
    right: false,
  })

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case 'w':
          setControls(prev => ({ ...prev, forward: true }))
          break
        case 's':
          setControls(prev => ({ ...prev, backward: true }))
          break
        case 'a':
          setControls(prev => ({ ...prev, left: true }))
          break
        case 'd':
          setControls(prev => ({ ...prev, right: true }))
          break
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case 'w':
          setControls(prev => ({ ...prev, forward: false }))
          break
        case 's':
          setControls(prev => ({ ...prev, backward: false }))
          break
        case 'a':
          setControls(prev => ({ ...prev, left: false }))
          break
        case 'd':
          setControls(prev => ({ ...prev, right: false }))
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  return controls
}

export function updateMovement(vehicle: Vehicle, controls: Controls, _delta: number) {
  // Update speed based on controls
  if (controls.forward) {
    vehicle.speed = Math.min(vehicle.speed + vehicle.acceleration, vehicle.maxSpeed)
  }
  else if (controls.backward) {
    vehicle.speed = Math.max(vehicle.speed - vehicle.acceleration, -vehicle.maxSpeed * 0.5)
  }
  else {
    // Apply friction when no input
    vehicle.speed *= 0.95
  }

  // Update rotation based on controls (only when moving)
  if (Math.abs(vehicle.speed) > 0.01) {
    if (controls.left) {
      vehicle.rotation.y += vehicle.rotationSpeed * Math.sign(vehicle.speed)
    }
    if (controls.right) {
      vehicle.rotation.y -= vehicle.rotationSpeed * Math.sign(vehicle.speed)
    }
  }

  // Update velocity based on rotation and speed
  vehicle.velocity.x = Math.sin(vehicle.rotation.y) * vehicle.speed
  vehicle.velocity.z = Math.cos(vehicle.rotation.y) * vehicle.speed

  // Update position
  vehicle.position.x += vehicle.velocity.x
  vehicle.position.z -= vehicle.velocity.z

  return vehicle
}
