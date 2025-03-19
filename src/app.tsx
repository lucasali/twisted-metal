import { Scene } from '@/components/scene/Scene'
import { Vehicle } from '@/components/scene/Vehicle'
import { HUD } from '@/components/ui/HUD'
import { useGameLoop } from '@/hooks/useGameLoop'
import { useGameStore } from '@/store/gameStore'

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
