import type { Object3D, PerspectiveCamera } from 'three'
import type { Vehicle } from '../types/vehicle'
import { useCallback, useMemo, useRef } from 'react'
import { Raycaster, Vector3 } from 'three'

/**
 * Configuration options for the vehicle camera
 */
interface CameraConfig {
  /** Height of the camera above the vehicle */
  height: number
  /** Distance behind the vehicle */
  distance: number
  /** How far ahead of the vehicle the camera looks */
  targetOffset: number
  /** Camera movement smoothing factor (0-1) */
  smoothFactor: number
  /** Minimum distance the camera can be from the vehicle */
  minDistance: number
  /** Maximum distance the camera can be from the vehicle */
  maxDistance: number
  /** Whether to enable collision detection */
  enableCollisionDetection: boolean
}

const DEFAULT_CAMERA_CONFIG: CameraConfig = {
  height: 2,
  distance: 2.5,
  targetOffset: 2,
  smoothFactor: 0.05,
  minDistance: 3,
  maxDistance: 12,
  enableCollisionDetection: true,
} as const

/**
 * Hook to manage the third-person camera following a vehicle
 */
export function useVehicleCamera(config: Partial<CameraConfig> = {}) {
  // Memoize configuration
  const finalConfig = useMemo(
    () => ({ ...DEFAULT_CAMERA_CONFIG, ...config }),
    [config],
  )

  // Camera vectors
  const position = useRef(new Vector3(0, finalConfig.height, finalConfig.distance))
  const target = useRef(new Vector3())
  const desiredPosition = useRef(new Vector3())

  // Collision detection
  const raycaster = useRef(new Raycaster())
  const tempVector = useRef(new Vector3())

  // Memoized update functions
  const updateCameraTarget = useCallback((
    target: Vector3,
    vehicle: Vehicle,
    config: CameraConfig,
  ): void => {
    const angle = vehicle.rotation.y
    target.set(
      vehicle.position.x - Math.sin(angle) * config.targetOffset,
      vehicle.position.y + 1,
      vehicle.position.z - Math.cos(angle) * config.targetOffset,
    )
  }, [])

  const handleCollision = useCallback((
    position: Vector3,
    vehicle: Vehicle,
    scene: Object3D,
    config: CameraConfig,
  ): void => {
    if (!config.enableCollisionDetection)
      return

    // Cast ray from vehicle to camera
    tempVector.current.copy(vehicle.position)
    tempVector.current.y += 1 // Adjust for vehicle height

    raycaster.current.set(tempVector.current, position.clone().sub(tempVector.current).normalize())
    const intersects = raycaster.current.intersectObjects(scene.children, true)

    // If there's a collision, adjust camera position
    if (intersects.length > 0) {
      const collision = intersects[0]
      if (collision.distance < position.distanceTo(tempVector.current)) {
        position.copy(collision.point)
        position.add(collision.face!.normal.multiplyScalar(0.5)) // Add small offset from surface
      }
    }
  }, [])

  const updateCameraPosition = useCallback((
    position: Vector3,
    desiredPosition: Vector3,
    vehicle: Vehicle,
    scene: Object3D,
    config: CameraConfig,
  ): void => {
    const angle = vehicle.rotation.y

    // Calculate ideal camera position behind vehicle
    desiredPosition.set(
      vehicle.position.x + Math.sin(angle) * config.distance,
      vehicle.position.y + config.height,
      vehicle.position.z + Math.cos(angle) * config.distance,
    )

    // Clamp distance
    const distanceToVehicle = desiredPosition.distanceTo(vehicle.position)
    if (distanceToVehicle > config.maxDistance || distanceToVehicle < config.minDistance) {
      const clampedDistance = Math.max(config.minDistance, Math.min(distanceToVehicle, config.maxDistance))
      desiredPosition.sub(vehicle.position).normalize().multiplyScalar(clampedDistance).add(vehicle.position)
    }

    // Smooth camera movement with variable smoothing based on speed
    const currentSpeed = Math.abs(vehicle.speed)
    const dynamicSmoothFactor = Math.max(config.smoothFactor, Math.min(1, currentSpeed * 0.01))
    position.lerp(desiredPosition, dynamicSmoothFactor)

    // Handle collisions
    handleCollision(position, vehicle, scene, config)
  }, [handleCollision])

  const updateCamera = useCallback((
    camera: PerspectiveCamera,
    vehicle: Vehicle,
    scene: Object3D,
  ): void => {
    updateCameraTarget(target.current, vehicle, finalConfig)
    updateCameraPosition(position.current, desiredPosition.current, vehicle, scene, finalConfig)

    // Apply camera transform
    camera.position.copy(position.current)
    camera.lookAt(target.current)
  }, [finalConfig, updateCameraTarget, updateCameraPosition])

  return {
    position,
    target,
    updateCamera,
  }
}
