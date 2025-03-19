import { memo } from 'react'

type Position3D = readonly [number, number, number]

const LIGHT_SETTINGS = {
  ambient: { intensity: 0.5 },
  directional: {
    position: [10, 10, 5] as Position3D,
    intensity: 1,
    shadowMapSize: 2048,
  },
} as const

export const Lighting = memo(() => (
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
