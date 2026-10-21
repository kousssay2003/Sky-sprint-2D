/**
 * CRAZY OBBY: SKY SPRINT 2D - Constants & Physics Tuning
 */

export const PHYSICS_2D = {
  GRAVITY: 1800, // px / s^2
  MOVE_SPEED: 420, // base horizontal run speed px / s
  SPEED_SNEAKERS_MULT: 1.45,
  ACCELERATION: 2800,
  AIR_ACCELERATION: 1900,
  FRICTION: 2400,

  JUMP_FORCE: 680, // px / s
  DOUBLE_JUMP_FORCE: 600,
  BOUNCE_SPRING_FORCE: 1100,

  MAX_FALL_SPEED: 1100,
  PARACHUTE_MAX_FALL_SPEED: 190, // gentle float

  DASH_SPEED: 950,
  DASH_DURATION: 0.18, // seconds
  DASH_COOLDOWN: 1.2, // seconds

  COYOTE_TIME: 0.14, // seconds
  JUMP_BUFFER: 0.14, // seconds

  PLAYER_WIDTH: 36,
  PLAYER_HEIGHT: 52,

  DEATH_Y: 1400, // fall threshold
};

export const COLORS_2D = {
  SKY_TOP: '#0284c7', // vibrant azure
  SKY_MID: '#38bdf8', // sky cyan
  SKY_BOTTOM: '#bae6fd', // soft horizon
  SUN_COLOR: '#fef08a',

  // Platforms
  GRASS_TOP: '#22c55e',
  GRASS_HIGHLIGHT: '#4ade80',
  PLATFORM_BODY: '#3b82f6',
  PLATFORM_BORDER: '#1d4ed8',
  PLATFORM_WOOD: '#d97706',
  PLATFORM_PURPLE: '#8b5cf6',

  // Hazards
  HAZARD_RED: '#ef4444',
  HAZARD_EMISSIVE: '#dc2626',
  HAZARD_BLADE: '#cbd5e1',

  // Interactive
  COIN_GOLD: '#facc15',
  COIN_BORDER: '#ca8a04',

  SPRING_PINK: '#ec4899',

  CHECKPOINT_INACTIVE: '#f97316',
  CHECKPOINT_ACTIVE: '#10b981',

  PORTAL_OUTER: '#a855f7',
  PORTAL_INNER: '#06b6d4',

  // Power-Ups
  POWERUP_DASH: '#38bdf8',
  POWERUP_PARACHUTE: '#ec4899',
  POWERUP_SPEED: '#f59e0b',

  // Player
  PLAYER_BODY: '#38bdf8',
  PLAYER_FACE: '#ffffff',
  PLAYER_CHEEKS: '#fb7185',
  PLAYER_EYES: '#0f172a',
  PLAYER_CAP: '#f43f5e',
  PLAYER_FEET: '#f59e0b',
  PLAYER_PARACHUTE: '#ec4899',
};
