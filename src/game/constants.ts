/**
 * CRAZY OBBY: SKY SPRINT - Constants & Tuning Values
 */

export const PHYSICS = {
  GRAVITY: -28.0,
  MOVE_SPEED: 8.8,
  AIR_CONTROL_FACTOR: 0.85,
  ACCELERATION: 40.0,
  DECELERATION: 30.0,
  JUMP_FORCE: 11.8,
  BOUNCE_PAD_FORCE: 20.0,
  MAX_FALL_SPEED: -32.0,
  COYOTE_TIME: 0.14, // Seconds player can jump after stepping off a ledge
  JUMP_BUFFER: 0.14, // Seconds early jump press is remembered
  FALL_LIMIT_Y: -7.0, // Respawn when below this height
  PLAYER_RADIUS: 0.45,
  PLAYER_HEIGHT: 1.4,
};

export const CAMERA_CONFIG = {
  DEFAULT_DISTANCE: 5.6,
  DEFAULT_HEIGHT: 2.8,
  DEFAULT_PITCH: 0.35, // radians downwards
  LOOK_AHEAD_Y: 0.8,
  LERP_SPEED: 10.0,
  ROTATION_SENSITIVITY: 0.004,
};

export const COLORS = {
  SKY_TOP: 0x38bdf8, // vibrant light sky blue
  SKY_BOTTOM: 0xbae6fd, // pale cloud horizon
  FOG: 0x93c5fd, // horizon mist
  SUN_LIGHT: 0xfffaed, // warm golden sunlight
  AMBIENT_SKY: 0xbfdbfe, // cool sky bounce
  AMBIENT_GROUND: 0x60a5fa,

  // Platform themes
  PLATFORM_BASE: 0x3b82f6, // primary blue
  PLATFORM_ACCENT: 0x60a5fa,
  PLATFORM_BORDER: 0x1d4ed8,

  WOOD_LIGHT: 0xf59e0b,
  WOOD_DARK: 0xd97706,

  HAZARD_RED: 0xef4444, // dangerous neon red
  HAZARD_EMISSIVE: 0xdc2626,

  CHECKPOINT_INACTIVE: 0xf97316, // glowing bright orange
  CHECKPOINT_ACTIVE: 0x10b981, // glowing radiant emerald green

  BOUNCE_PAD: 0xec4899, // energetic hot pink

  COIN_GOLD: 0xfacc15,
  COIN_EMISSIVE: 0xeab308,

  PORTAL_MAGENTA: 0xa855f7,
  PORTAL_CYAN: 0x06b6d4,
  PORTAL_GOLD: 0xfef08a,

  // Player parts
  PLAYER_BODY: 0x38bdf8, // cyan / bright sky blue
  PLAYER_SUIT: 0x6366f1, // indigo
  PLAYER_VISOR: 0x1e293b, // dark glossy visor
  PLAYER_VISOR_GLINT: 0x38bdf8,
  PLAYER_BACKPACK: 0xf43f5e, // coral red
  PLAYER_GLOVES: 0xffffff,
  PLAYER_SHOES: 0xf59e0b,
};
