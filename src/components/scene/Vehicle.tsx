import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import type { Mesh, PerspectiveCamera as ThreePerspectiveCamera } from 'three'
import { Vector3 } from 'three'
import { useVehicleControls, updateMovement } from '../../systems/movement'
import type { Vehicle as VehicleType } from '../../types/vehicle'
import { DEFAULT_VEHICLE_CONFIG } from '../../types/vehicle'

export function Vehicle() {
  const vehicleRef = useRef<Mesh>(null)
  const cameraRef = useRef<ThreePerspectiveCamera>(null)
  const vehicleState = useRef<VehicleType>({ ...DEFAULT_VEHICLE_CONFIG })
  const controls = useVehicleControls()

  const cameraPosition = useRef(new Vector3(0, 3, 5))
  const cameraTarget = useRef(new Vector3())

  useFrame((state, delta) => {
    if (!vehicleRef.current || !cameraRef.current)
      return

    // Update vehicle movement
    const updatedVehicle = updateMovement(vehicleState.current, controls, delta)

    // Apply movement to the mesh
    vehicleRef.current.position.set(
      updatedVehicle.position.x,
      updatedVehicle.position.y,
      updatedVehicle.position.z,
    )
    vehicleRef.current.rotation.set(
      updatedVehicle.rotation.x,
      updatedVehicle.rotation.y,
      updatedVehicle.rotation.z,
    )

    // Update camera target
    cameraTarget.current.set(
      updatedVehicle.position.x,
      updatedVehicle.position.y + 1,
      updatedVehicle.position.z,
    )

    // Calculate desired camera position
    const cameraOffset = new Vector3(
      -Math.sin(updatedVehicle.rotation.y) * 5,
      3,
      -Math.cos(updatedVehicle.rotation.y) * 5,
    )
    const desiredCameraPos = cameraTarget.current.clone().add(cameraOffset)

    // Smooth camera movement using lerp
    cameraPosition.current.lerp(desiredCameraPos, 0.1)
    cameraRef.current.position.copy(cameraPosition.current)
    cameraRef.current.lookAt(cameraTarget.current)
  })

  return (
    <group>
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        position={[0, 3, 5]}
        fov={75}
      />
      
      <group ref={vehicleRef} position={[0, 0.5, 0]}>
        {/* Main body */}
        <mesh>
          <boxGeometry args={[2, 0.5, 1]} />
          <meshStandardMaterial color="red" />
        </mesh>

        {/* Cabin */}
        <mesh position={[0, 0.45, 0]}>
          <boxGeometry args={[1.2, 0.4, 0.8]} />
          <meshStandardMaterial color="black" />
        </mesh>

        {/* Front bumper */}
        <mesh position={[1.05, 0, 0]}>
          <boxGeometry args={[0.1, 0.3, 0.8]} />
          <meshStandardMaterial color="gray" />
        </mesh>

        {/* Rear bumper */}
        <mesh position={[-1.05, 0, 0]}>
          <boxGeometry args={[0.1, 0.3, 0.8]} />
          <meshStandardMaterial color="gray" />
        </mesh>

        {/* Wheels */}
        <mesh position={[0.7, -0.2, 0.5]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.1, 32]} />
          <meshStandardMaterial color="black" />
        </mesh>
        <mesh position={[0.7, -0.2, -0.5]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.1, 32]} />
          <meshStandardMaterial color="black" />
        </mesh>
        <mesh position={[-0.7, -0.2, 0.5]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.1, 32]} />
          <meshStandardMaterial color="black" />
        </mesh>
        <mesh position={[-0.7, -0.2, -0.5]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.1, 32]} />
          <meshStandardMaterial color="black" />
        </mesh>
      </group>
    </group>
  )
}
