import { useRef, memo } from 'react'
import { useFrame } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import type { Mesh, PerspectiveCamera as ThreePerspectiveCamera } from 'three'
import { useVehicleControls } from '../../systems/movement'
import { useVehiclePhysics } from '../../hooks/useVehiclePhysics'
import { useVehicleCamera } from '../../hooks/useVehicleCamera'
import type { Vehicle as VehicleType } from '../../types/vehicle'

// Constants
const VEHICLE_DIMENSIONS = {
  body: { width: 1, height: 0.5, length: 2 },
  cabin: { width: 0.8, height: 0.4, length: 1.2 },
  bumper: { width: 0.8, height: 0.3, length: 0.1 },
  light: { width: 0.2, height: 0.2, length: 0.1 },
  wheel: { radius: 0.2, width: 0.1, segments: 32 },
} as const

type Position3D = readonly [number, number, number]

const VEHICLE_POSITIONS = {
  cabin: [0, 0.45, 0.2] as Position3D,
  frontBumper: [0, 0, -1.05] as Position3D,
  rearBumper: [0, 0, 1.05] as Position3D,
  frontLights: [
    [0.3, 0.15, -1.02],
    [-0.3, 0.15, -1.02],
  ] as readonly Position3D[],
  rearLights: [
    [0.3, 0.15, 1.02],
    [-0.3, 0.15, 1.02],
  ] as readonly Position3D[],
  wheels: [
    [0.5, -0.2, 0.7],   // front right
    [-0.5, -0.2, 0.7],  // front left
    [0.5, -0.2, -0.7],  // rear right
    [-0.5, -0.2, -0.7], // rear left
  ] as readonly Position3D[],
} as const

// Types
interface PartProps {
  position?: Position3D
}

interface LightProps extends PartProps {
  isRear?: boolean
}

// Vehicle parts components
const VehicleBody = memo(() => (
  <mesh rotation={[0, Math.PI, 0]} castShadow>
    <boxGeometry args={[
      VEHICLE_DIMENSIONS.body.width,
      VEHICLE_DIMENSIONS.body.height,
      VEHICLE_DIMENSIONS.body.length
    ]} />
    <meshStandardMaterial color="red" />
  </mesh>
))
VehicleBody.displayName = 'VehicleBody'

const VehicleCabin = memo(() => (
  <mesh position={VEHICLE_POSITIONS.cabin} rotation={[0, Math.PI, 0]} castShadow>
    <boxGeometry args={[
      VEHICLE_DIMENSIONS.cabin.width,
      VEHICLE_DIMENSIONS.cabin.height,
      VEHICLE_DIMENSIONS.cabin.length
    ]} />
    <meshStandardMaterial color="black" />
  </mesh>
))
VehicleCabin.displayName = 'VehicleCabin'

const VehicleBumper = memo(({ position = [0, 0, 0] }: PartProps) => (
  <mesh position={position as Position3D} rotation={[0, Math.PI, 0]} castShadow>
    <boxGeometry args={[
      VEHICLE_DIMENSIONS.bumper.width,
      VEHICLE_DIMENSIONS.bumper.height,
      VEHICLE_DIMENSIONS.bumper.length
    ]} />
    <meshStandardMaterial color="gray" />
  </mesh>
))
VehicleBumper.displayName = 'VehicleBumper'

const VehicleLight = memo(({ position = [0, 0, 0], isRear = false }: LightProps) => {
  const color = isRear ? '#ff0000' : 'yellow'
  return (
    <mesh position={position as Position3D} castShadow>
      <boxGeometry args={[
        VEHICLE_DIMENSIONS.light.width,
        VEHICLE_DIMENSIONS.light.height,
        VEHICLE_DIMENSIONS.light.length
      ]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
    </mesh>
  )
})
VehicleLight.displayName = 'VehicleLight'

const VehicleWheel = memo(({ position = [0, 0, 0] }: PartProps) => (
  <mesh position={position as Position3D} rotation={[0, 0, Math.PI / 2]} castShadow>
    <cylinderGeometry args={[
      VEHICLE_DIMENSIONS.wheel.radius,
      VEHICLE_DIMENSIONS.wheel.radius,
      VEHICLE_DIMENSIONS.wheel.width,
      VEHICLE_DIMENSIONS.wheel.segments
    ]} />
    <meshStandardMaterial color="black" />
  </mesh>
))
VehicleWheel.displayName = 'VehicleWheel'

// Vehicle mesh component
const VehicleMesh = memo(() => (
  <group position={[0, 0, 0]}>
    {/* Main parts */}
    <VehicleBody />
    <VehicleCabin />
    
    {/* Bumpers */}
    <VehicleBumper position={VEHICLE_POSITIONS.frontBumper} />
    <VehicleBumper position={VEHICLE_POSITIONS.rearBumper} />
    
    {/* Lights */}
    {VEHICLE_POSITIONS.frontLights.map((position, index) => (
      <VehicleLight key={`front-light-${index}`} position={position} />
    ))}
    {VEHICLE_POSITIONS.rearLights.map((position, index) => (
      <VehicleLight key={`rear-light-${index}`} position={position} isRear />
    ))}
    
    {/* Wheels */}
    {VEHICLE_POSITIONS.wheels.map((position, index) => (
      <VehicleWheel key={`wheel-${index}`} position={position} />
    ))}
  </group>
))
VehicleMesh.displayName = 'VehicleMesh'

/**
 * Vehicle component with physics, controls and camera
 */
export function Vehicle() {
  const vehicleRef = useRef<Mesh>(null)
  const cameraRef = useRef<ThreePerspectiveCamera>(null)
  
  // Systems
  const controls = useVehicleControls()
  const { updatePhysics } = useVehiclePhysics()
  const { position: cameraPosition, updateCamera } = useVehicleCamera()

  // Update loop
  useFrame((state, delta) => {
    if (!vehicleRef.current || !cameraRef.current) return

    // Update vehicle physics and apply transforms
    const vehicle = updatePhysics(controls, delta)
    applyVehicleTransforms(vehicleRef.current, vehicle)

    // Update camera
    updateCamera(cameraRef.current, vehicle, state.scene)
  })

  return (
    <group>
      {/* Camera */}
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        position={cameraPosition.current.toArray()}
        fov={75}
      />
      
      {/* Vehicle */}
      <group ref={vehicleRef}>
        <VehicleMesh />
      </group>
    </group>
  )
}

/**
 * Applies vehicle state transforms to the mesh
 */
function applyVehicleTransforms(mesh: Mesh, vehicle: VehicleType) {
  mesh.position.set(
    vehicle.position.x,
    vehicle.position.y,
    vehicle.position.z,
  )
  mesh.rotation.set(
    vehicle.rotation.x,
    vehicle.rotation.y,
    vehicle.rotation.z,
  )
}
