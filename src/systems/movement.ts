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

// Funções auxiliares para cálculos físicos
function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t
}

function calculateSteeringFactor(speed: number): number {
  // Reduz o ângulo de direção em velocidades mais altas
  return 1 - clamp(Math.abs(speed) * 0.02, 0, 0.7)
}

export function updateMovement(vehicle: Vehicle, controls: Controls, delta: number) {
  // Atualiza a velocidade
  if (controls.forward) {
    vehicle.speed = Math.min(vehicle.speed + vehicle.acceleration * delta, vehicle.maxSpeed)
  }
  else if (controls.backward) {
    vehicle.speed = Math.max(vehicle.speed - vehicle.acceleration * delta, vehicle.maxReverseSpeed)
  }
  else {
    // Desaceleração natural
    if (Math.abs(vehicle.speed) < vehicle.deceleration * delta) {
      vehicle.speed = 0
    }
    else {
      vehicle.speed -= Math.sign(vehicle.speed) * vehicle.deceleration * delta
    }
  }

  // Atualiza a rotação apenas quando o carro está em movimento
  if (Math.abs(vehicle.speed) > 0.1) {
    if (controls.left) {
      vehicle.rotation.y += vehicle.turnSpeed * delta * Math.sign(vehicle.speed)
    }
    if (controls.right) {
      vehicle.rotation.y -= vehicle.turnSpeed * delta * Math.sign(vehicle.speed)
    }
  }

  // Atualiza a posição baseada na direção atual do carro
  const forward = vehicle.speed * delta
  vehicle.position.x -= Math.sin(vehicle.rotation.y) * forward
  vehicle.position.z -= Math.cos(vehicle.rotation.y) * forward

  return vehicle
}
