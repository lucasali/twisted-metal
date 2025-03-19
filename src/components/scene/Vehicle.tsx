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

  // Posição inicial da câmera mais alta e mais distante
  const cameraPosition = useRef(new Vector3(0, 4, 8))
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

    // Update camera target (ligeiramente à frente do carro)
    cameraTarget.current.set(
      updatedVehicle.position.x - Math.sin(updatedVehicle.rotation.y) * 2,
      updatedVehicle.position.y + 1,
      updatedVehicle.position.z - Math.cos(updatedVehicle.rotation.y) * 2,
    )

    // Calculate desired camera position (atrás do carro)
    const cameraOffset = new Vector3(
      Math.sin(updatedVehicle.rotation.y) * 8,
      4,
      Math.cos(updatedVehicle.rotation.y) * 8,
    )
    const desiredCameraPos = new Vector3(
      updatedVehicle.position.x,
      updatedVehicle.position.y,
      updatedVehicle.position.z,
    ).add(cameraOffset)

    // Smooth camera movement using lerp
    cameraPosition.current.lerp(desiredCameraPos, 0.05)
    cameraRef.current.position.copy(cameraPosition.current)
    cameraRef.current.lookAt(cameraTarget.current)
  })

  return (
    <group>
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        position={[0, 4, 8]}
        fov={75}
      />
      
      <group ref={vehicleRef} position={[0, 0.5, 0]}>
        {/* Main body */}
        <mesh rotation={[0, Math.PI, 0]} castShadow>
          <boxGeometry args={[1, 0.5, 2]} />
          <meshStandardMaterial color="red" />
        </mesh>

        {/* Cabin */}
        <mesh position={[0, 0.45, 0.2]} rotation={[0, Math.PI, 0]} castShadow>
          <boxGeometry args={[0.8, 0.4, 1.2]} />
          <meshStandardMaterial color="black" />
        </mesh>

        {/* Front bumper */}
        <mesh position={[0, 0, -1.05]} rotation={[0, Math.PI, 0]} castShadow>
          <boxGeometry args={[0.8, 0.3, 0.1]} />
          <meshStandardMaterial color="gray" />
        </mesh>

        {/* Rear bumper */}
        <mesh position={[0, 0, 1.05]} rotation={[0, Math.PI, 0]} castShadow>
          <boxGeometry args={[0.8, 0.3, 0.1]} />
          <meshStandardMaterial color="gray" />
        </mesh>

        {/* Faróis dianteiros */}
        <mesh position={[0.3, 0.15, -1.02]} castShadow>
          <boxGeometry args={[0.2, 0.2, 0.1]} />
          <meshStandardMaterial color="yellow" emissive="yellow" emissiveIntensity={0.5} />
        </mesh>
        <mesh position={[-0.3, 0.15, -1.02]} castShadow>
          <boxGeometry args={[0.2, 0.2, 0.1]} />
          <meshStandardMaterial color="yellow" emissive="yellow" emissiveIntensity={0.5} />
        </mesh>

        {/* Lanternas traseiras */}
        <mesh position={[0.3, 0.15, 1.02]} castShadow>
          <boxGeometry args={[0.2, 0.2, 0.1]} />
          <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={0.5} />
        </mesh>
        <mesh position={[-0.3, 0.15, 1.02]} castShadow>
          <boxGeometry args={[0.2, 0.2, 0.1]} />
          <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={0.5} />
        </mesh>

        {/* Wheels - ajustadas para apontar para os lados */}
        <mesh position={[0.5, -0.2, 0.7]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.2, 0.2, 0.1, 32]} />
          <meshStandardMaterial color="black" />
        </mesh>
        <mesh position={[-0.5, -0.2, 0.7]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.2, 0.2, 0.1, 32]} />
          <meshStandardMaterial color="black" />
        </mesh>
        <mesh position={[0.5, -0.2, -0.7]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.2, 0.2, 0.1, 32]} />
          <meshStandardMaterial color="black" />
        </mesh>
        <mesh position={[-0.5, -0.2, -0.7]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.2, 0.2, 0.1, 32]} />
          <meshStandardMaterial color="black" />
        </mesh>
      </group>
    </group>
  )
}
