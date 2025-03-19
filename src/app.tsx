import { Vehicle } from '@/components/scene/Vehicle'
import { Scene } from '@/components/scene/Scene'
import { HUD } from '@/components/ui/HUD'
import { useGameStore } from '@/store/gameStore'
import { useGameLoop } from '@/hooks/useGameLoop'

export function App() {
  const { health, lives, velocity, position } = useGameStore()
  useGameLoop()

  return (
    <>
      <Scene>
        <Vehicle />
      </Scene>
      <HUD
        health={health}
        lives={lives}
        velocity={velocity}
        position={position}
      />
    </>
  )
}

export default App
