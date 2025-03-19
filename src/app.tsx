import { Canvas } from '@react-three/fiber'
import { Vehicle } from './components/scene/Vehicle'

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas>
        {/* Ground plane */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial color="#303030" />
        </mesh>

        {/* Lights */}
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
        />

        {/* Vehicle */}
        <Vehicle />
      </Canvas>
    </div>
  )
}

export default App
