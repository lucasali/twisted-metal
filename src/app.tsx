import { Canvas } from '@react-three/fiber'
import { memo } from 'react'
import { Vehicle } from './components/scene/Vehicle'

// Types
type Position3D = readonly [number, number, number]

interface GridBoxesProps {
  size?: number
  spacing?: number
}

interface SceneProps {
  children: React.ReactNode
}

// Constants
const GRID_DIMENSIONS = {
  size: 20,
  spacing: 4,
  box: { width: 0.3, height: 0.6, depth: 0.3 },
  ground: { width: 100, depth: 100 },
} as const

const GRID_COLORS = {
  ground: '#303030',
  lines: '#606060',
  linesSecondary: '#404040',
  boxes: ['#666', '#999'],
} as const

const LIGHT_SETTINGS = {
  ambient: { intensity: 0.5 },
  directional: {
    position: [10, 10, 5] as Position3D,
    intensity: 1,
    shadowMapSize: 2048,
  },
} as const

const FOG_SETTINGS = {
  color: '#202020',
  near: 10,
  far: 50,
} as const

// Scene components
const Ground = memo(() => (
  <>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[GRID_DIMENSIONS.ground.width, GRID_DIMENSIONS.ground.depth]} />
      <meshStandardMaterial color={GRID_COLORS.ground} />
    </mesh>
    <gridHelper args={[
      GRID_DIMENSIONS.ground.width,
      GRID_DIMENSIONS.ground.depth,
      GRID_COLORS.lines,
      GRID_COLORS.linesSecondary,
    ]} />
  </>
))
Ground.displayName = 'Ground'

const Lighting = memo(() => (
  <>
    <ambientLight intensity={LIGHT_SETTINGS.ambient.intensity} />
    <directionalLight
      position={LIGHT_SETTINGS.directional.position}
      intensity={LIGHT_SETTINGS.directional.intensity}
      castShadow
      shadow-mapSize-width={LIGHT_SETTINGS.directional.shadowMapSize}
      shadow-mapSize-height={LIGHT_SETTINGS.directional.shadowMapSize}
    />
  </>
))
Lighting.displayName = 'Lighting'

/**
 * Visual reference grid component that creates a grid of boxes for spatial reference
 */
const GridBoxes = memo(({ size = GRID_DIMENSIONS.size, spacing = GRID_DIMENSIONS.spacing }: GridBoxesProps) => {
  const boxes = []
  for (let x = -size; x <= size; x += spacing) {
    for (let z = -size; z <= size; z += spacing) {
      boxes.push(
        <mesh key={`${x}-${z}`} position={[x, 0.3, z]}>
          <boxGeometry args={[
            GRID_DIMENSIONS.box.width,
            GRID_DIMENSIONS.box.height,
            GRID_DIMENSIONS.box.depth,
          ]} />
          <meshStandardMaterial 
            color={Math.random() > 0.5 ? GRID_COLORS.boxes[0] : GRID_COLORS.boxes[1]} 
          />
        </mesh>,
      )
    }
  }
  return <>{boxes}</>
})
GridBoxes.displayName = 'GridBoxes'

/**
 * Main scene component that sets up the 3D environment
 */
export function Scene({ children }: SceneProps) {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas shadows>
        <Ground />
        <GridBoxes />
        <Lighting />
        {children}
        {/* Fog for depth perception */}
        <fog 
          attach="fog" 
          args={[FOG_SETTINGS.color, FOG_SETTINGS.near, FOG_SETTINGS.far]} 
        />
      </Canvas>
    </div>
  )
}

/**
 * Main App component that sets up the game environment
 */
export function App() {
  return (
    <Scene>
      <Vehicle />
    </Scene>
  )
}

export default App
