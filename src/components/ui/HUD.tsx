import React, { memo } from 'react'
import styles from './HUD.module.css'

// Constants
const HEALTH_THRESHOLDS = {
  HIGH: 60,
  MEDIUM: 30,
} as const

const TURBO_SETTINGS = {
  DEFAULT_WIDTH: '75%',
  COLOR: '#00ffff',
  GLOW: '0 0 10px #00ffff',
} as const

// Types
interface Position3D {
  x: number
  y: number
  z: number
}

interface HUDProps {
  health: number
  lives: number
  velocity: number
  position: Position3D
}

interface StatPanelProps {
  children: React.ReactNode
  className?: string
}

// Utility functions
function formatTime() {
  const date = new Date()
  return `${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`
}

function getHealthBarClass(health: number) {
  if (health > HEALTH_THRESHOLDS.HIGH)
    return styles.high
  if (health > HEALTH_THRESHOLDS.MEDIUM)
    return styles.medium
  return styles.low
}

// Component parts
function StatPanel({ children, className }: StatPanelProps) {
  return (
    <div className={`${styles.statsPanel} ${className || ''}`}>
      {children}
    </div>
  )
}

const MemoizedStatPanel = memo(StatPanel)
MemoizedStatPanel.displayName = 'StatPanel'

function HealthBar({ health }: { health: number }) {
  return (
    <div className={styles.stat}>
      <span>DAMAGE</span>
      <div className={styles.healthBarContainer}>
        <div
          className={`${styles.healthBarFill} ${getHealthBarClass(health)}`}
          style={{ width: `${health}%` }}
        />
      </div>
    </div>
  )
}

const MemoizedHealthBar = memo(HealthBar)
MemoizedHealthBar.displayName = 'HealthBar'

function LivesDisplay({ lives }: { lives: number }) {
  return (
    <div className={styles.stat}>
      <span>LIVES</span>
      <div className={styles.lives}>
        {Array.from({ length: lives }).map((_, i) => (
          <div key={`life-${i}`} className={styles.life} />
        ))}
      </div>
    </div>
  )
}

const MemoizedLivesDisplay = memo(LivesDisplay)
MemoizedLivesDisplay.displayName = 'LivesDisplay'

function TurboMeter() {
  return (
    <div className={styles.stat}>
      <span>TURBO</span>
      <div className={styles.healthBarContainer}>
        <div
          className={styles.healthBarFill}
          style={{
            width: TURBO_SETTINGS.DEFAULT_WIDTH,
            backgroundColor: TURBO_SETTINGS.COLOR,
            boxShadow: TURBO_SETTINGS.GLOW,
          }}
        />
      </div>
    </div>
  )
}

const MemoizedTurboMeter = memo(TurboMeter)
MemoizedTurboMeter.displayName = 'TurboMeter'

function WeaponsPanel() {
  return (
    <MemoizedStatPanel className={styles.weaponsPanel}>
      <div className={styles.stat}>
        <span>WEAPON</span>
        <span>SPECIAL</span>
      </div>
      <div className={styles.stat}>
        <span>AMMO</span>
        <span>12</span>
      </div>
      <div className={styles.stat}>
        <span>TIME</span>
        <span>{formatTime()}</span>
      </div>
    </MemoizedStatPanel>
  )
}

const MemoizedWeaponsPanel = memo(WeaponsPanel)
MemoizedWeaponsPanel.displayName = 'WeaponsPanel'

function VelocityMeter({ velocity }: { velocity: number }) {
  return (
    <div className={styles.velocityMeter}>
      {Math.abs(velocity).toFixed(0)}
    </div>
  )
}

const MemoizedVelocityMeter = memo(VelocityMeter)
MemoizedVelocityMeter.displayName = 'VelocityMeter'

function Minimap({ position }: { position: Position3D }) {
  return (
    <div className={styles.minimap}>
      <div
        className={styles.playerDot}
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: `translate(-50%, -50%) rotate(${Math.atan2(position.z, position.x)}rad)`,
        }}
      />
    </div>
  )
}

const MemoizedMinimap = memo(Minimap)
MemoizedMinimap.displayName = 'Minimap'

/**
 * HUD component that displays game information
 */
export function HUD({ health, lives, velocity, position }: HUDProps) {
  return (
    <div className={styles.hudContainer}>
      <MemoizedStatPanel>
        <MemoizedHealthBar health={health} />
        <MemoizedLivesDisplay lives={lives} />
        <MemoizedTurboMeter />
      </MemoizedStatPanel>

      <MemoizedWeaponsPanel />
      <MemoizedVelocityMeter velocity={velocity} />
      <MemoizedMinimap position={position} />

      <div className={styles.killCount}>
        KILLS: 0
      </div>
    </div>
  )
}
