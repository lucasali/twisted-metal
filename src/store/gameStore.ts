import type { StateCreator } from 'zustand'
import { create } from 'zustand'

interface Position {
  x: number
  y: number
  z: number
}

interface GameState {
  health: number
  lives: number
  velocity: number
  position: Position
  updateGameLoop: () => void
}

export const useGameStore = create<GameState>((set: StateCreator<GameState>['set']) => ({
  health: 100,
  lives: 3,
  velocity: 0,
  position: { x: 0, y: 0, z: 0 },

  updateGameLoop: () => {
    set((state: GameState) => ({
      ...state,
      velocity: Math.sin(Date.now() / 1000) * 10 + 10,
      position: {
        x: Math.sin(Date.now() / 2000) * 5,
        y: 0,
        z: Math.cos(Date.now() / 2000) * 5,
      },
    }))
  },
}))
