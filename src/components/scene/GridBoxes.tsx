import { memo } from 'react'

interface GridBoxesProps {
  size?: number
  spacing?: number
}

const GRID_DIMENSIONS = {
  size: 20,
  spacing: 4,
  box: { width: 0.3, height: 0.6, depth: 0.3 },
} as const

const GRID_COLORS = {
  boxes: ['#666', '#999'],
} as const

export const GridBoxes = memo(({ size = GRID_DIMENSIONS.size, spacing = GRID_DIMENSIONS.spacing }: GridBoxesProps) => {
  const boxes = []
  for (let x = -size; x <= size; x += spacing) {
    for (let z = -size; z <= size; z += spacing) {
      boxes.push(
        <mesh key={`${x}-${z}`} position={[x, 0.3, z]}>
          <boxGeometry args={[
            GRID_DIMENSIONS.box.width,
            GRID_DIMENSIONS.box.height,
            GRID_DIMENSIONS.box.depth,
          ]}
          />
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
