/**
 * CRAZY OBBY: SKY SPRINT 2D - Types & Interfaces
 */

export type GameStatus = 'menu' | 'playing' | 'paused' | 'victory';

export type PowerUpType = 'dash' | 'parachute' | 'speed_sneakers';

export interface PowerUpState {
  type: PowerUpType;
  duration: number; // Remaining time in seconds
  maxDuration: number;
}

export interface Platform2D {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'solid' | 'crumbling' | 'ice' | 'hazard';
  color?: string;
  // For crumbling blocks
  crumbleTimer?: number;
  isCrumbling?: boolean;
  isBroken?: boolean;
}

export interface MovingPlatform2D {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  speed: number;
  progress: number; // 0 to 1
  direction: 1 | -1;
  vx: number;
  vy: number;
  color?: string;
}

export interface Hazard2D {
  id: number;
  x: number;
  y: number;
  type: 'spike' | 'saw' | 'laser';
  radius?: number;
  width?: number;
  height?: number;
  angle?: number;
  rotationSpeed?: number;
}

export interface BounceSpring2D {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  force: number;
  compressTime: number; // Visual compression bounce
}

export interface Coin2D {
  id: number;
  x: number;
  y: number;
  radius: number;
  collected: boolean;
  bobOffset: number;
}

export interface PowerUpItem2D {
  id: number;
  x: number;
  y: number;
  type: PowerUpType;
  radius: number;
  collected: boolean;
  bobOffset: number;
}

export interface Checkpoint2D {
  id: number;
  name: string;
  x: number;
  y: number;
  unlocked: boolean;
}

export interface Particle2D {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  shape?: 'circle' | 'spark' | 'smoke' | 'star';
}

export interface LevelData2D {
  id: number;
  name: string;
  tier: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert';
  width: number;
  height: number;
  spawnPoint: { x: number; y: number };
  platforms: Platform2D[];
  movingPlatforms: MovingPlatform2D[];
  hazards: Hazard2D[];
  bounceSprings: BounceSpring2D[];
  coins: Coin2D[];
  powerUpItems: PowerUpItem2D[];
  checkpoints: Checkpoint2D[];
  portal: { x: number; y: number; width: number; height: number };
  targetTime: number;
}

export interface LevelRecord {
  completed: boolean;
  stars: number;
  bestTime: number;
  coinsFound: number;
}

export interface PlayerStats2D {
  currentLevel: number;
  totalLevels: number;
  levelName: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert';
  coinsCollected: number;
  totalCoins: number;
  currentCheckpoint: number;
  totalCheckpoints: number;
  checkpointName: string;
  fallCount: number;
  elapsedTime: number;
  bestTime: number | null;
  activePowerUp: PowerUpType | null;
  powerUpTimeLeft: number;
  dashAvailable: boolean;
}

export interface InputState2D {
  left: boolean;
  right: boolean;
  jump: boolean;
  jumpJustPressed: boolean;
  jumpHeld: boolean;
  dashJustPressed: boolean;
  virtualStickX: number; // -1 to 1
}
