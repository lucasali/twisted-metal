import { useEffect } from 'react'
import { useGameStore } from '@/store/gameStore'

export function useGameLoop() {
  const updateGameLoop = useGameStore((state: { updateGameLoop: () => void }) => state.updateGameLoop)

  useEffect(() => {
    const interval = setInterval(updateGameLoop, 16) // ~60fps
    return () => clearInterval(interval)
  }, [updateGameLoop])
} 