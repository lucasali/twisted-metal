import { Canvas } from '@react-three/fiber'
import { Vehicle } from './components/scene/Vehicle'

// Componente para criar uma grade de caixas como referência visual
function GridBoxes({ size = 20, spacing = 4 }) {
  const boxes = []
  for (let x = -size; x <= size; x += spacing) {
    for (let z = -size; z <= size; z += spacing) {
      boxes.push(
        <mesh key={`${x}-${z}`} position={[x, 0.3, z]}>
          <boxGeometry args={[0.3, 0.6, 0.3]} />
          <meshStandardMaterial color={Math.random() > 0.5 ? '#666' : '#999'} />
        </mesh>,
      )
    }
  }
  return <>{boxes}</>
}

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas shadows>
        {/* Ground plane */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial color="#303030" />
        </mesh>

        {/* Grade de linhas no chão */}
        <gridHelper args={[100, 100, '#606060', '#404040']} />

        {/* Caixas de referência */}
        <GridBoxes />

        {/* Lights */}
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />

        {/* Vehicle */}
        <Vehicle />

        {/* Fog para dar sensação de profundidade */}
        <fog attach="fog" args={['#202020', 10, 50]} />
      </Canvas>
    </div>
  )
}

export default App
