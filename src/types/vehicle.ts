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
  velocity: {
    x: number
    z: number
  }
  speed: number
  maxSpeed: number
  acceleration: number
  rotationSpeed: number
}

export const DEFAULT_VEHICLE_CONFIG: Vehicle = {
  position: { x: 0, y: 0.5, z: 0 },
  rotation: { x: 0, y: 0, z: 0 },
  velocity: { x: 0, z: 0 },
  speed: 0,
  maxSpeed: 0.5,
  acceleration: 0.01,
  rotationSpeed: 0.03,
}
