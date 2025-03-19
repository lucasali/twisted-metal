import { memo } from 'react'

const GRID_COLORS = {
  ground: '#303030',
  lines: '#606060',
  linesSecondary: '#404040',
} as const

const GRID_DIMENSIONS = {
  ground: { width: 100, depth: 100 },
} as const

export const Ground = memo(() => (
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
    ]}
    />
  </>
))

Ground.displayName = 'Ground'
