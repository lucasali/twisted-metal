/**
 * Represents the position in 3D space
 */
interface Position {
  x: number
  y: number
  z: number
}

/**
 * Represents the rotation in 3D space (in radians)
 */
interface Rotation {
  x: number
  y: number
  z: number
}

/**
 * Represents a vehicle's properties and physics configuration
 */
export interface Vehicle {
  position: Position
  rotation: Rotation

  // Movement properties
  speed: number
  turnSpeed: number
  velocity: number // Current velocity vector magnitude

  // Speed limits
  maxSpeed: number
  maxReverseSpeed: number

  // Physics properties
  acceleration: number
  deceleration: number
}

/**
 * Default configuration for a new vehicle
 */
export const DEFAULT_VEHICLE_CONFIG: Vehicle = {
  position: { x: 0, y: 0.5, z: 0 },
  rotation: { x: 0, y: 0, z: 0 },

  speed: 0,
  turnSpeed: 2.5,
  velocity: 0,

  maxSpeed: 15,
  maxReverseSpeed: -8,

  acceleration: 15,
  deceleration: 10,
}
