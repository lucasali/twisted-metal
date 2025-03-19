import { Canvas } from '@react-three/fiber'
import { Ground } from './Ground'
import { GridBoxes } from './GridBoxes'
import { Lighting } from './Lighting'

interface SceneProps {
  children: React.ReactNode
}

const FOG_SETTINGS = {
  color: '#202020',
  near: 10,
  far: 50,
} as const

export function Scene({ children }: SceneProps) {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas shadows>
        <Ground />
        <GridBoxes />
        <Lighting />
        {children}
        <fog 
          attach="fog" 
          args={[FOG_SETTINGS.color, FOG_SETTINGS.near, FOG_SETTINGS.far]} 
        />
      </Canvas>
    </div>
  )
}