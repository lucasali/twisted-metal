export interface Vehicle {
  position: {
    x: number
    y: number
    z: number
  }
  rotation: {
    x: number
    y: number
    z: number
  }
  speed: number
  turnSpeed: number
  maxSpeed: number
  maxReverseSpeed: number
  acceleration: number
  deceleration: number
}

export const DEFAULT_VEHICLE_CONFIG: Vehicle = {
  position: { x: 0, y: 0.5, z: 0 },
  rotation: { x: 0, y: 0, z: 0 },
  speed: 0,
  turnSpeed: 2.5,
  maxSpeed: 15,
  maxReverseSpeed: -8,
  acceleration: 15,
  deceleration: 10,
}
