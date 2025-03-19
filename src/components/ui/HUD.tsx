import React from 'react';
import styles from './HUD.module.css';

interface HUDProps {
  health: number;
  lives: number;
  velocity: number;
  position: { x: number; y: number; z: number };
}

export const HUD: React.FC<HUDProps> = ({ health, lives, velocity, position }) => {
  const getHealthBarClass = () => {
    if (health > 60) return styles.high;
    if (health > 30) return styles.medium;
    return styles.low;
  };

  // Format time like "00:00"
  const getGameTime = () => {
    const date = new Date();
    return `${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
  };

  return (
    <div className={styles.hudContainer}>
      {/* Left panel with health and lives */}
      <div className={styles.statsPanel}>
        <div className={styles.stat}>
          <span>DAMAGE</span>
          <div className={styles.healthBarContainer}>
            <div 
              className={`${styles.healthBarFill} ${getHealthBarClass()}`}
              style={{ width: `${health}%` }}
            />
          </div>
        </div>
        <div className={styles.stat}>
          <span>LIVES</span>
          <div className={styles.lives}>
            {[...Array(lives)].map((_, i) => (
              <div key={i} className={styles.life} />
            ))}
          </div>
        </div>
        <div className={styles.stat}>
          <span>TURBO</span>
          <div className={styles.healthBarContainer}>
            <div 
              className={styles.healthBarFill}
              style={{ 
                width: '75%',
                backgroundColor: '#00ffff',
                boxShadow: '0 0 10px #00ffff'
              }}
            />
          </div>
        </div>
      </div>

      {/* Right panel with weapons */}
      <div className={`${styles.statsPanel} ${styles.weaponsPanel}`}>
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
          <span>{getGameTime()}</span>
        </div>
      </div>

      {/* Speed meter */}
      <div className={styles.velocityMeter}>
        {Math.abs(velocity).toFixed(0)}
      </div>

      {/* Minimap */}
      <div className={styles.minimap}>
        <div 
          className={styles.playerDot}
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: `translate(-50%, -50%) rotate(${Math.atan2(position.z, position.x)}rad)`
          }}
        />
      </div>

      {/* Kill count */}
      <div className={styles.killCount}>
        KILLS: 0
      </div>
    </div>
  );
};
