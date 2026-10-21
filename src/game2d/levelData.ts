/**
 * CRAZY OBBY: SKY SPRINT 2D - 20 Progressive Levels
 * Progressive difficulty curve across 4 distinct worlds:
 * World 1: Beginner Skies (L1-L5, Easy)
 * World 2: Sky Islands & Traps (L6-L10, Medium)
 * World 3: Elevator Peaks & Hazards (L11-L15, Hard)
 * World 4: The Apex Gauntlet (L16-L20, Expert)
 */

import { LevelData2D } from '../types/game2d';

export const ALL_LEVELS: LevelData2D[] = [
  // ==========================================
  // LEVEL 1: First Steps (Easy)
  // ==========================================
  {
    id: 1,
    name: 'First Steps',
    tier: 'World 1: Beginner Skies',
    difficulty: 'Easy',
    width: 2200,
    height: 1000,
    spawnPoint: { x: 120, y: 550 },
    targetTime: 18,
    platforms: [
      { id: 1, x: 50, y: 620, width: 340, height: 70, type: 'solid', color: '#3b82f6' },
      { id: 2, x: 470, y: 600, width: 180, height: 50, type: 'solid' },
      { id: 3, x: 730, y: 570, width: 200, height: 50, type: 'solid' },
      { id: 4, x: 1010, y: 540, width: 220, height: 50, type: 'solid' },
      { id: 5, x: 1310, y: 520, width: 280, height: 60, type: 'solid', color: '#d97706' },
      { id: 6, x: 1670, y: 500, width: 190, height: 50, type: 'solid' },
      { id: 7, x: 1940, y: 480, width: 300, height: 70, type: 'solid', color: '#8b5cf6' },
    ],
    movingPlatforms: [],
    hazards: [],
    bounceSprings: [],
    coins: [
      { id: 1, x: 250, y: 570, radius: 14, collected: false, bobOffset: 0 },
      { id: 2, x: 560, y: 550, radius: 14, collected: false, bobOffset: 0.5 },
      { id: 3, x: 830, y: 520, radius: 14, collected: false, bobOffset: 1.0 },
      { id: 4, x: 1120, y: 490, radius: 14, collected: false, bobOffset: 1.5 },
      { id: 5, x: 1450, y: 470, radius: 14, collected: false, bobOffset: 2.0 },
      { id: 6, x: 1760, y: 450, radius: 14, collected: false, bobOffset: 2.5 },
    ],
    powerUpItems: [],
    checkpoints: [
      { id: 0, name: 'Start Island', x: 120, y: 620, unlocked: true },
      { id: 1, name: 'Midway Rest', x: 1350, y: 520, unlocked: false },
    ],
    portal: { x: 2100, y: 360, width: 60, height: 110 },
  },

  // ==========================================
  // LEVEL 2: Double Hop (Easy)
  // ==========================================
  {
    id: 2,
    name: 'Double Hop',
    tier: 'World 1: Beginner Skies',
    difficulty: 'Easy',
    width: 2400,
    height: 1000,
    spawnPoint: { x: 100, y: 550 },
    targetTime: 20,
    platforms: [
      { id: 1, x: 50, y: 620, width: 260, height: 70, type: 'solid', color: '#3b82f6' },
      { id: 2, x: 390, y: 590, width: 140, height: 45, type: 'solid' },
      { id: 3, x: 630, y: 540, width: 130, height: 45, type: 'solid' },
      { id: 4, x: 870, y: 490, width: 140, height: 45, type: 'solid' },
      { id: 5, x: 1120, y: 480, width: 260, height: 60, type: 'solid', color: '#d97706' },
      { id: 6, x: 1480, y: 470, width: 130, height: 45, type: 'solid' },
      { id: 7, x: 1720, y: 440, width: 140, height: 45, type: 'solid' },
      { id: 8, x: 1970, y: 410, width: 130, height: 45, type: 'solid' },
      { id: 9, x: 2190, y: 400, width: 280, height: 70, type: 'solid', color: '#8b5cf6' },
    ],
    movingPlatforms: [],
    hazards: [],
    bounceSprings: [],
    coins: [
      { id: 1, x: 200, y: 570, radius: 14, collected: false, bobOffset: 0 },
      { id: 2, x: 460, y: 530, radius: 14, collected: false, bobOffset: 0.5 },
      { id: 3, x: 700, y: 470, radius: 14, collected: false, bobOffset: 1.0 },
      { id: 4, x: 940, y: 420, radius: 14, collected: false, bobOffset: 1.5 },
      { id: 5, x: 1250, y: 430, radius: 14, collected: false, bobOffset: 2.0 },
      { id: 6, x: 1540, y: 400, radius: 14, collected: false, bobOffset: 2.5 },
      { id: 7, x: 1790, y: 370, radius: 14, collected: false, bobOffset: 3.0 },
      { id: 8, x: 2040, y: 340, radius: 14, collected: false, bobOffset: 3.5 },
    ],
    powerUpItems: [],
    checkpoints: [
      { id: 0, name: 'Meadow Start', x: 100, y: 620, unlocked: true },
      { id: 1, name: 'Cloud Haven', x: 1180, y: 480, unlocked: false },
    ],
    portal: { x: 2320, y: 280, width: 60, height: 110 },
  },

  // ==========================================
  // LEVEL 3: Speed Shoes (Easy)
  // ==========================================
  {
    id: 3,
    name: 'Speed Shoes',
    tier: 'World 1: Beginner Skies',
    difficulty: 'Easy',
    width: 2600,
    height: 1000,
    spawnPoint: { x: 100, y: 550 },
    targetTime: 18,
    platforms: [
      { id: 1, x: 50, y: 620, width: 380, height: 70, type: 'solid', color: '#3b82f6' },
      { id: 2, x: 550, y: 600, width: 220, height: 45, type: 'solid' },
      { id: 3, x: 890, y: 580, width: 260, height: 45, type: 'solid' },
      { id: 4, x: 1270, y: 540, width: 260, height: 60, type: 'solid', color: '#d97706' },
      { id: 5, x: 1670, y: 520, width: 260, height: 45, type: 'solid' },
      { id: 6, x: 2060, y: 500, width: 240, height: 45, type: 'solid' },
      { id: 7, x: 2400, y: 480, width: 280, height: 70, type: 'solid', color: '#8b5cf6' },
    ],
    movingPlatforms: [],
    hazards: [],
    bounceSprings: [],
    coins: [
      { id: 1, x: 260, y: 570, radius: 14, collected: false, bobOffset: 0 },
      { id: 2, x: 660, y: 540, radius: 14, collected: false, bobOffset: 0.5 },
      { id: 3, x: 1020, y: 520, radius: 14, collected: false, bobOffset: 1.0 },
      { id: 4, x: 1400, y: 480, radius: 14, collected: false, bobOffset: 1.5 },
      { id: 5, x: 1800, y: 460, radius: 14, collected: false, bobOffset: 2.0 },
      { id: 6, x: 2180, y: 440, radius: 14, collected: false, bobOffset: 2.5 },
    ],
    powerUpItems: [
      { id: 1, x: 220, y: 550, type: 'speed_sneakers', radius: 18, collected: false, bobOffset: 0 },
    ],
    checkpoints: [
      { id: 0, name: 'Sprint Runway', x: 100, y: 620, unlocked: true },
      { id: 1, name: 'Overpass', x: 1320, y: 540, unlocked: false },
    ],
    portal: { x: 2540, y: 360, width: 60, height: 110 },
  },

  // ==========================================
  // LEVEL 4: Narrow Bridges (Easy)
  // ==========================================
  {
    id: 4,
    name: 'Narrow Bridges',
    tier: 'World 1: Beginner Skies',
    difficulty: 'Easy',
    width: 2500,
    height: 1000,
    spawnPoint: { x: 100, y: 550 },
    targetTime: 22,
    platforms: [
      { id: 1, x: 50, y: 620, width: 220, height: 70, type: 'solid', color: '#3b82f6' },
      { id: 2, x: 340, y: 580, width: 100, height: 35, type: 'solid' },
      { id: 3, x: 520, y: 560, width: 90, height: 35, type: 'solid' },
      { id: 4, x: 690, y: 530, width: 110, height: 35, type: 'solid' },
      { id: 5, x: 880, y: 500, width: 90, height: 35, type: 'solid' },
      { id: 6, x: 1060, y: 480, width: 240, height: 60, type: 'solid', color: '#d97706' },
      { id: 7, x: 1390, y: 460, width: 80, height: 35, type: 'solid' },
      { id: 8, x: 1560, y: 440, width: 90, height: 35, type: 'solid' },
      { id: 9, x: 1740, y: 420, width: 80, height: 35, type: 'solid' },
      { id: 10, x: 1910, y: 400, width: 100, height: 35, type: 'solid' },
      { id: 11, x: 2110, y: 380, width: 260, height: 70, type: 'solid', color: '#8b5cf6' },
    ],
    movingPlatforms: [],
    hazards: [],
    bounceSprings: [],
    coins: [
      { id: 1, x: 390, y: 530, radius: 14, collected: false, bobOffset: 0 },
      { id: 2, x: 560, y: 510, radius: 14, collected: false, bobOffset: 0.5 },
      { id: 3, x: 740, y: 480, radius: 14, collected: false, bobOffset: 1.0 },
      { id: 4, x: 920, y: 450, radius: 14, collected: false, bobOffset: 1.5 },
      { id: 5, x: 1180, y: 430, radius: 14, collected: false, bobOffset: 2.0 },
      { id: 6, x: 1430, y: 410, radius: 14, collected: false, bobOffset: 2.5 },
      { id: 7, x: 1600, y: 390, radius: 14, collected: false, bobOffset: 3.0 },
      { id: 8, x: 1780, y: 370, radius: 14, collected: false, bobOffset: 3.5 },
    ],
    powerUpItems: [],
    checkpoints: [
      { id: 0, name: 'Bridgehead', x: 100, y: 620, unlocked: true },
      { id: 1, name: 'Pillar Watch', x: 1120, y: 480, unlocked: false },
    ],
    portal: { x: 2240, y: 260, width: 60, height: 110 },
  },

  // ==========================================
  // LEVEL 5: The Windmill (Easy / Boss 1)
  // ==========================================
  {
    id: 5,
    name: 'The Windmill',
    tier: 'World 1: Beginner Skies',
    difficulty: 'Easy',
    width: 2600,
    height: 1000,
    spawnPoint: { x: 100, y: 550 },
    targetTime: 25,
    platforms: [
      { id: 1, x: 50, y: 620, width: 260, height: 70, type: 'solid', color: '#3b82f6' },
      { id: 2, x: 380, y: 580, width: 140, height: 45, type: 'solid' },
      { id: 3, x: 600, y: 540, width: 280, height: 40, type: 'solid' }, // platform with saw
      { id: 4, x: 960, y: 510, width: 150, height: 45, type: 'solid' },
      { id: 5, x: 1200, y: 480, width: 280, height: 60, type: 'solid', color: '#d97706' },
      { id: 6, x: 1560, y: 450, width: 130, height: 45, type: 'solid' },
      { id: 7, x: 1770, y: 420, width: 300, height: 40, type: 'solid' }, // platform with saw 2
      { id: 8, x: 2160, y: 380, width: 160, height: 45, type: 'solid' },
      { id: 9, x: 2400, y: 360, width: 280, height: 70, type: 'solid', color: '#8b5cf6' },
    ],
    movingPlatforms: [],
    hazards: [
      { id: 1, x: 740, y: 505, type: 'saw', radius: 30, angle: 0, rotationSpeed: 3.2 },
      { id: 2, x: 1920, y: 385, type: 'saw', radius: 32, angle: 0, rotationSpeed: -3.5 },
    ],
    bounceSprings: [],
    coins: [
      { id: 1, x: 200, y: 570, radius: 14, collected: false, bobOffset: 0 },
      { id: 2, x: 450, y: 530, radius: 14, collected: false, bobOffset: 0.5 },
      { id: 3, x: 740, y: 420, radius: 14, collected: false, bobOffset: 1.0 }, // coin over saw!
      { id: 4, x: 1030, y: 460, radius: 14, collected: false, bobOffset: 1.5 },
      { id: 5, x: 1340, y: 430, radius: 14, collected: false, bobOffset: 2.0 },
      { id: 6, x: 1620, y: 400, radius: 14, collected: false, bobOffset: 2.5 },
      { id: 7, x: 1920, y: 300, radius: 14, collected: false, bobOffset: 3.0 }, // coin over saw 2!
      { id: 8, x: 2240, y: 330, radius: 14, collected: false, bobOffset: 3.5 },
    ],
    powerUpItems: [],
    checkpoints: [
      { id: 0, name: 'Windmill Base', x: 100, y: 620, unlocked: true },
      { id: 1, name: 'Gale Rest', x: 1260, y: 480, unlocked: false },
    ],
    portal: { x: 2540, y: 240, width: 60, height: 110 },
  },

  // ==========================================
  // LEVEL 6: Air Dash Chasm (Medium)
  // ==========================================
  {
    id: 6,
    name: 'Air Dash Chasm',
    tier: 'World 2: Sky Islands & Traps',
    difficulty: 'Medium',
    width: 2700,
    height: 1000,
    spawnPoint: { x: 100, y: 550 },
    targetTime: 22,
    platforms: [
      { id: 1, x: 50, y: 620, width: 300, height: 70, type: 'solid', color: '#3b82f6' },
      { id: 2, x: 620, y: 590, width: 180, height: 45, type: 'solid' }, // requires dash over void!
      { id: 3, x: 920, y: 550, width: 140, height: 45, type: 'solid' },
      { id: 4, x: 1300, y: 520, width: 280, height: 60, type: 'solid', color: '#d97706' },
      { id: 5, x: 1860, y: 500, width: 180, height: 45, type: 'solid' }, // big gap requiring dash!
      { id: 6, x: 2160, y: 470, width: 150, height: 45, type: 'solid' },
      { id: 7, x: 2420, y: 440, width: 300, height: 70, type: 'solid', color: '#8b5cf6' },
    ],
    movingPlatforms: [],
    hazards: [],
    bounceSprings: [],
    coins: [
      { id: 1, x: 200, y: 570, radius: 14, collected: false, bobOffset: 0 },
      { id: 2, x: 480, y: 540, radius: 14, collected: false, bobOffset: 0.5 },
      { id: 3, x: 710, y: 540, radius: 14, collected: false, bobOffset: 1.0 },
      { id: 4, x: 1100, y: 490, radius: 14, collected: false, bobOffset: 1.5 },
      { id: 5, x: 1440, y: 470, radius: 14, collected: false, bobOffset: 2.0 },
      { id: 6, x: 1650, y: 460, radius: 14, collected: false, bobOffset: 2.5 },
      { id: 7, x: 1950, y: 450, radius: 14, collected: false, bobOffset: 3.0 },
      { id: 8, x: 2230, y: 420, radius: 14, collected: false, bobOffset: 3.5 },
    ],
    powerUpItems: [
      { id: 1, x: 220, y: 560, type: 'dash', radius: 18, collected: false, bobOffset: 0 },
    ],
    checkpoints: [
      { id: 0, name: 'Chasm Edge', x: 100, y: 620, unlocked: true },
      { id: 1, name: 'Mid Chasm', x: 1360, y: 520, unlocked: false },
    ],
    portal: { x: 2570, y: 320, width: 60, height: 110 },
  },

  // ==========================================
  // LEVEL 7: Moving Skyway (Medium)
  // ==========================================
  {
    id: 7,
    name: 'Moving Skyway',
    tier: 'World 2: Sky Islands & Traps',
    difficulty: 'Medium',
    width: 2800,
    height: 1000,
    spawnPoint: { x: 100, y: 550 },
    targetTime: 24,
    platforms: [
      { id: 1, x: 50, y: 620, width: 240, height: 70, type: 'solid', color: '#3b82f6' },
      { id: 2, x: 680, y: 580, width: 140, height: 45, type: 'solid' },
      { id: 3, x: 1180, y: 540, width: 260, height: 60, type: 'solid', color: '#d97706' },
      { id: 4, x: 1780, y: 500, width: 150, height: 45, type: 'solid' },
      { id: 5, x: 2360, y: 460, width: 280, height: 70, type: 'solid', color: '#8b5cf6' },
    ],
    movingPlatforms: [
      {
        id: 1,
        x: 350,
        y: 600,
        width: 130,
        height: 35,
        startX: 320,
        startY: 600,
        endX: 580,
        endY: 600,
        speed: 130,
        progress: 0,
        direction: 1,
        vx: 0,
        vy: 0,
        color: '#0ea5e9',
      },
      {
        id: 2,
        x: 900,
        y: 560,
        width: 130,
        height: 35,
        startX: 880,
        startY: 560,
        endX: 1100,
        endY: 560,
        speed: 140,
        progress: 0,
        direction: 1,
        vx: 0,
        vy: 0,
        color: '#0ea5e9',
      },
      {
        id: 3,
        x: 1500,
        y: 520,
        width: 130,
        height: 35,
        startX: 1480,
        startY: 520,
        endX: 1700,
        endY: 520,
        speed: 150,
        progress: 0,
        direction: 1,
        vx: 0,
        vy: 0,
        color: '#0ea5e9',
      },
      {
        id: 4,
        x: 2020,
        y: 480,
        width: 130,
        height: 35,
        startX: 1980,
        startY: 480,
        endX: 2260,
        endY: 480,
        speed: 160,
        progress: 0,
        direction: 1,
        vx: 0,
        vy: 0,
        color: '#0ea5e9',
      },
    ],
    hazards: [],
    bounceSprings: [],
    coins: [
      { id: 1, x: 200, y: 570, radius: 14, collected: false, bobOffset: 0 },
      { id: 2, x: 450, y: 550, radius: 14, collected: false, bobOffset: 0.5 },
      { id: 3, x: 750, y: 530, radius: 14, collected: false, bobOffset: 1.0 },
      { id: 4, x: 1000, y: 510, radius: 14, collected: false, bobOffset: 1.5 },
      { id: 5, x: 1310, y: 490, radius: 14, collected: false, bobOffset: 2.0 },
      { id: 6, x: 1600, y: 470, radius: 14, collected: false, bobOffset: 2.5 },
      { id: 7, x: 1850, y: 450, radius: 14, collected: false, bobOffset: 3.0 },
      { id: 8, x: 2120, y: 430, radius: 14, collected: false, bobOffset: 3.5 },
    ],
    powerUpItems: [],
    checkpoints: [
      { id: 0, name: 'Depot Start', x: 100, y: 620, unlocked: true },
      { id: 1, name: 'Mid Platform', x: 1250, y: 540, unlocked: false },
    ],
    portal: { x: 2520, y: 340, width: 60, height: 110 },
  },

  // ==========================================
  // LEVEL 8: Spike Canyon (Medium)
  // ==========================================
  {
    id: 8,
    name: 'Spike Canyon',
    tier: 'World 2: Sky Islands & Traps',
    difficulty: 'Medium',
    width: 2700,
    height: 1000,
    spawnPoint: { x: 100, y: 550 },
    targetTime: 23,
    platforms: [
      { id: 1, x: 50, y: 620, width: 220, height: 70, type: 'solid', color: '#3b82f6' },
      { id: 2, x: 330, y: 590, width: 140, height: 45, type: 'solid' },
      { id: 3, x: 540, y: 560, width: 260, height: 40, type: 'solid' }, // with spikes
      { id: 4, x: 890, y: 530, width: 140, height: 45, type: 'solid' },
      { id: 5, x: 1110, y: 500, width: 280, height: 60, type: 'solid', color: '#d97706' },
      { id: 6, x: 1480, y: 470, width: 260, height: 40, type: 'solid' }, // with spikes
      { id: 7, x: 1830, y: 440, width: 130, height: 45, type: 'solid' },
      { id: 8, x: 2040, y: 410, width: 260, height: 40, type: 'solid' }, // with spikes
      { id: 9, x: 2390, y: 390, width: 260, height: 70, type: 'solid', color: '#8b5cf6' },
    ],
    movingPlatforms: [],
    hazards: [
      { id: 1, x: 610, y: 542, type: 'spike', width: 50, height: 18 },
      { id: 2, x: 1550, y: 452, type: 'spike', width: 50, height: 18 },
      { id: 3, x: 2110, y: 392, type: 'spike', width: 50, height: 18 },
    ],
    bounceSprings: [],
    coins: [
      { id: 1, x: 200, y: 570, radius: 14, collected: false, bobOffset: 0 },
      { id: 2, x: 400, y: 540, radius: 14, collected: false, bobOffset: 0.5 },
      { id: 3, x: 635, y: 460, radius: 14, collected: false, bobOffset: 1.0 }, // jump over spike
      { id: 4, x: 960, y: 480, radius: 14, collected: false, bobOffset: 1.5 },
      { id: 5, x: 1250, y: 450, radius: 14, collected: false, bobOffset: 2.0 },
      { id: 6, x: 1575, y: 370, radius: 14, collected: false, bobOffset: 2.5 }, // jump over spike
      { id: 7, x: 1900, y: 390, radius: 14, collected: false, bobOffset: 3.0 },
      { id: 8, x: 2135, y: 310, radius: 14, collected: false, bobOffset: 3.5 }, // jump over spike
      { id: 9, x: 2470, y: 340, radius: 14, collected: false, bobOffset: 4.0 },
    ],
    powerUpItems: [],
    checkpoints: [
      { id: 0, name: 'Canyon Rim', x: 100, y: 620, unlocked: true },
      { id: 1, name: 'Spike Haven', x: 1180, y: 500, unlocked: false },
    ],
    portal: { x: 2540, y: 270, width: 60, height: 110 },
  },

  // ==========================================
  // LEVEL 9: Twin Sawblades (Medium)
  // ==========================================
  {
    id: 9,
    name: 'Twin Sawblades',
    tier: 'World 2: Sky Islands & Traps',
    difficulty: 'Medium',
    width: 2800,
    height: 1000,
    spawnPoint: { x: 100, y: 550 },
    targetTime: 26,
    platforms: [
      { id: 1, x: 50, y: 620, width: 240, height: 70, type: 'solid', color: '#3b82f6' },
      { id: 2, x: 360, y: 580, width: 340, height: 40, type: 'solid' }, // saw 1
      { id: 3, x: 780, y: 540, width: 140, height: 45, type: 'solid' },
      { id: 4, x: 1000, y: 510, width: 340, height: 40, type: 'solid' }, // saw 2
      { id: 5, x: 1420, y: 490, width: 280, height: 60, type: 'solid', color: '#d97706' },
      { id: 6, x: 1780, y: 460, width: 130, height: 45, type: 'solid' },
      { id: 7, x: 2000, y: 430, width: 360, height: 40, type: 'solid' }, // saw 3
      { id: 8, x: 2440, y: 400, width: 300, height: 70, type: 'solid', color: '#8b5cf6' },
    ],
    movingPlatforms: [],
    hazards: [
      { id: 1, x: 530, y: 545, type: 'saw', radius: 34, angle: 0, rotationSpeed: 4.0 },
      { id: 2, x: 1170, y: 475, type: 'saw', radius: 36, angle: 0, rotationSpeed: -4.5 },
      { id: 3, x: 2180, y: 395, type: 'saw', radius: 38, angle: 0, rotationSpeed: 5.0 },
    ],
    bounceSprings: [],
    coins: [
      { id: 1, x: 190, y: 570, radius: 14, collected: false, bobOffset: 0 },
      { id: 2, x: 530, y: 460, radius: 14, collected: false, bobOffset: 0.5 },
      { id: 3, x: 850, y: 490, radius: 14, collected: false, bobOffset: 1.0 },
      { id: 4, x: 1170, y: 390, radius: 14, collected: false, bobOffset: 1.5 },
      { id: 5, x: 1560, y: 440, radius: 14, collected: false, bobOffset: 2.0 },
      { id: 6, x: 1840, y: 410, radius: 14, collected: false, bobOffset: 2.5 },
      { id: 7, x: 2180, y: 310, radius: 14, collected: false, bobOffset: 3.0 },
      { id: 8, x: 2540, y: 350, radius: 14, collected: false, bobOffset: 3.5 },
    ],
    powerUpItems: [],
    checkpoints: [
      { id: 0, name: 'Sawmill Entry', x: 100, y: 620, unlocked: true },
      { id: 1, name: 'Mid Sawmill', x: 1480, y: 490, unlocked: false },
    ],
    portal: { x: 2620, y: 280, width: 60, height: 110 },
  },

  // ==========================================
  // LEVEL 10: Parachute Drift (Medium / World 2 Climax)
  // ==========================================
  {
    id: 10,
    name: 'Parachute Drift',
    tier: 'World 2: Sky Islands & Traps',
    difficulty: 'Medium',
    width: 3200,
    height: 1200,
    spawnPoint: { x: 100, y: 400 },
    targetTime: 28,
    platforms: [
      { id: 1, x: 50, y: 470, width: 280, height: 70, type: 'solid', color: '#3b82f6' },
      // High cliff to float down from!
      { id: 2, x: 800, y: 600, width: 160, height: 45, type: 'solid' },
      { id: 3, x: 1300, y: 720, width: 180, height: 45, type: 'solid' },
      { id: 4, x: 1800, y: 750, width: 280, height: 60, type: 'solid', color: '#d97706' },
      { id: 5, x: 2350, y: 730, width: 160, height: 45, type: 'solid' },
      { id: 6, x: 2750, y: 700, width: 340, height: 70, type: 'solid', color: '#8b5cf6' },
    ],
    movingPlatforms: [],
    hazards: [],
    bounceSprings: [],
    coins: [
      { id: 1, x: 200, y: 420, radius: 14, collected: false, bobOffset: 0 },
      { id: 2, x: 450, y: 480, radius: 14, collected: false, bobOffset: 0.5 },
      { id: 3, x: 650, y: 530, radius: 14, collected: false, bobOffset: 1.0 },
      { id: 4, x: 880, y: 550, radius: 14, collected: false, bobOffset: 1.5 },
      { id: 5, x: 1100, y: 630, radius: 14, collected: false, bobOffset: 2.0 },
      { id: 6, x: 1390, y: 670, radius: 14, collected: false, bobOffset: 2.5 },
      { id: 7, x: 1650, y: 700, radius: 14, collected: false, bobOffset: 3.0 },
      { id: 8, x: 1940, y: 700, radius: 14, collected: false, bobOffset: 3.5 },
      { id: 9, x: 2430, y: 680, radius: 14, collected: false, bobOffset: 4.0 },
      { id: 10, x: 2880, y: 650, radius: 14, collected: false, bobOffset: 4.5 },
    ],
    powerUpItems: [
      { id: 1, x: 250, y: 410, type: 'parachute', radius: 18, collected: false, bobOffset: 0 },
    ],
    checkpoints: [
      { id: 0, name: 'Glider Peak', x: 100, y: 470, unlocked: true },
      { id: 1, name: 'Valley Camp', x: 1860, y: 750, unlocked: false },
    ],
    portal: { x: 2950, y: 580, width: 60, height: 110 },
  },

  // ==========================================
  // LEVEL 11: Sky Elevators (Hard)
  // ==========================================
  {
    id: 11,
    name: 'Sky Elevators',
    tier: 'World 3: Elevator Peaks & Hazards',
    difficulty: 'Hard',
    width: 2900,
    height: 1200,
    spawnPoint: { x: 100, y: 700 },
    targetTime: 28,
    platforms: [
      { id: 1, x: 50, y: 780, width: 240, height: 70, type: 'solid', color: '#3b82f6' },
      { id: 2, x: 620, y: 600, width: 160, height: 45, type: 'solid' },
      { id: 3, x: 1200, y: 450, width: 280, height: 60, type: 'solid', color: '#d97706' },
      { id: 4, x: 1780, y: 350, width: 160, height: 45, type: 'solid' },
      { id: 5, x: 2350, y: 250, width: 300, height: 70, type: 'solid', color: '#8b5cf6' },
    ],
    movingPlatforms: [
      // Vertical Elevator 1 (Climbing up)
      {
        id: 1,
        x: 380,
        y: 750,
        width: 130,
        height: 35,
        startX: 380,
        startY: 770,
        endX: 380,
        endY: 600,
        speed: 130,
        progress: 0,
        direction: 1,
        vx: 0,
        vy: 0,
        color: '#a855f7',
      },
      // Vertical Elevator 2
      {
        id: 2,
        x: 900,
        y: 580,
        width: 130,
        height: 35,
        startX: 900,
        startY: 590,
        endX: 900,
        endY: 450,
        speed: 140,
        progress: 0,
        direction: 1,
        vx: 0,
        vy: 0,
        color: '#a855f7',
      },
      // Vertical Elevator 3
      {
        id: 3,
        x: 1540,
        y: 430,
        width: 130,
        height: 35,
        startX: 1540,
        startY: 440,
        endX: 1540,
        endY: 340,
        speed: 145,
        progress: 0,
        direction: 1,
        vx: 0,
        vy: 0,
        color: '#a855f7',
      },
      // Vertical Elevator 4
      {
        id: 4,
        x: 2060,
        y: 330,
        width: 130,
        height: 35,
        startX: 2060,
        startY: 340,
        endX: 2060,
        endY: 240,
        speed: 150,
        progress: 0,
        direction: 1,
        vx: 0,
        vy: 0,
        color: '#a855f7',
      },
    ],
    hazards: [],
    bounceSprings: [],
    coins: [
      { id: 1, x: 200, y: 730, radius: 14, collected: false, bobOffset: 0 },
      { id: 2, x: 380, y: 640, radius: 14, collected: false, bobOffset: 0.5 },
      { id: 3, x: 700, y: 550, radius: 14, collected: false, bobOffset: 1.0 },
      { id: 4, x: 900, y: 490, radius: 14, collected: false, bobOffset: 1.5 },
      { id: 5, x: 1340, y: 400, radius: 14, collected: false, bobOffset: 2.0 },
      { id: 6, x: 1540, y: 360, radius: 14, collected: false, bobOffset: 2.5 },
      { id: 7, x: 1860, y: 300, radius: 14, collected: false, bobOffset: 3.0 },
      { id: 8, x: 2060, y: 260, radius: 14, collected: false, bobOffset: 3.5 },
      { id: 9, x: 2450, y: 200, radius: 14, collected: false, bobOffset: 4.0 },
    ],
    powerUpItems: [],
    checkpoints: [
      { id: 0, name: 'Ground Lift', x: 100, y: 780, unlocked: true },
      { id: 1, name: 'Midway Landing', x: 1260, y: 450, unlocked: false },
    ],
    portal: { x: 2540, y: 130, width: 60, height: 110 },
  },

  // ==========================================
  // LEVEL 12: Springboard Launch (Hard)
  // ==========================================
  {
    id: 12,
    name: 'Springboard Launch',
    tier: 'World 3: Elevator Peaks & Hazards',
    difficulty: 'Hard',
    width: 2900,
    height: 1200,
    spawnPoint: { x: 100, y: 600 },
    targetTime: 24,
    platforms: [
      { id: 1, x: 50, y: 680, width: 340, height: 70, type: 'solid', color: '#3b82f6' },
      { id: 2, x: 700, y: 360, width: 220, height: 50, type: 'solid' }, // high up from spring!
      { id: 3, x: 1040, y: 380, width: 260, height: 60, type: 'solid', color: '#d97706' },
      { id: 4, x: 1650, y: 220, width: 240, height: 50, type: 'solid' }, // high up from spring 2!
      { id: 5, x: 2000, y: 250, width: 160, height: 45, type: 'solid' },
      { id: 6, x: 2280, y: 240, width: 320, height: 70, type: 'solid', color: '#8b5cf6' },
    ],
    movingPlatforms: [],
    hazards: [],
    bounceSprings: [
      { id: 1, x: 280, y: 680, width: 50, height: 24, force: 1150, compressTime: 0 },
      { id: 2, x: 1200, y: 380, width: 50, height: 24, force: 1180, compressTime: 0 },
    ],
    coins: [
      { id: 1, x: 200, y: 630, radius: 14, collected: false, bobOffset: 0 },
      { id: 2, x: 420, y: 440, radius: 14, collected: false, bobOffset: 0.5 }, // airborne coin
      { id: 3, x: 550, y: 340, radius: 14, collected: false, bobOffset: 1.0 }, // apex coin
      { id: 4, x: 790, y: 310, radius: 14, collected: false, bobOffset: 1.5 },
      { id: 5, x: 1100, y: 330, radius: 14, collected: false, bobOffset: 2.0 },
      { id: 6, x: 1350, y: 230, radius: 14, collected: false, bobOffset: 2.5 }, // airborne coin 2
      { id: 7, x: 1500, y: 160, radius: 14, collected: false, bobOffset: 3.0 }, // apex coin 2
      { id: 8, x: 1770, y: 170, radius: 14, collected: false, bobOffset: 3.5 },
      { id: 9, x: 2080, y: 200, radius: 14, collected: false, bobOffset: 4.0 },
      { id: 10, x: 2400, y: 190, radius: 14, collected: false, bobOffset: 4.5 },
    ],
    powerUpItems: [],
    checkpoints: [
      { id: 0, name: 'Launchpad 1', x: 100, y: 680, unlocked: true },
      { id: 1, name: 'Cloud High', x: 1090, y: 380, unlocked: false },
    ],
    portal: { x: 2480, y: 120, width: 60, height: 110 },
  },

  // ==========================================
  // LEVEL 13: Crumbling Clouds (Hard)
  // ==========================================
  {
    id: 13,
    name: 'Crumbling Clouds',
    tier: 'World 3: Elevator Peaks & Hazards',
    difficulty: 'Hard',
    width: 2800,
    height: 1000,
    spawnPoint: { x: 100, y: 550 },
    targetTime: 23,
    platforms: [
      { id: 1, x: 50, y: 620, width: 220, height: 70, type: 'solid', color: '#3b82f6' },
      // Crumbling blocks!
      { id: 2, x: 340, y: 590, width: 110, height: 35, type: 'crumbling' },
      { id: 3, x: 530, y: 560, width: 110, height: 35, type: 'crumbling' },
      { id: 4, x: 720, y: 530, width: 110, height: 35, type: 'crumbling' },
      { id: 5, x: 910, y: 500, width: 110, height: 35, type: 'crumbling' },
      { id: 6, x: 1100, y: 480, width: 260, height: 60, type: 'solid', color: '#d97706' },
      { id: 7, x: 1440, y: 460, width: 110, height: 35, type: 'crumbling' },
      { id: 8, x: 1630, y: 440, width: 110, height: 35, type: 'crumbling' },
      { id: 9, x: 1820, y: 420, width: 110, height: 35, type: 'crumbling' },
      { id: 10, x: 2010, y: 400, width: 110, height: 35, type: 'crumbling' },
      { id: 11, x: 2200, y: 380, width: 300, height: 70, type: 'solid', color: '#8b5cf6' },
    ],
    movingPlatforms: [],
    hazards: [],
    bounceSprings: [],
    coins: [
      { id: 1, x: 180, y: 570, radius: 14, collected: false, bobOffset: 0 },
      { id: 2, x: 395, y: 540, radius: 14, collected: false, bobOffset: 0.5 },
      { id: 3, x: 585, y: 510, radius: 14, collected: false, bobOffset: 1.0 },
      { id: 4, x: 775, y: 480, radius: 14, collected: false, bobOffset: 1.5 },
      { id: 5, x: 965, y: 450, radius: 14, collected: false, bobOffset: 2.0 },
      { id: 6, x: 1220, y: 430, radius: 14, collected: false, bobOffset: 2.5 },
      { id: 7, x: 1495, y: 410, radius: 14, collected: false, bobOffset: 3.0 },
      { id: 8, x: 1685, y: 390, radius: 14, collected: false, bobOffset: 3.5 },
      { id: 9, x: 1875, y: 370, radius: 14, collected: false, bobOffset: 4.0 },
      { id: 10, x: 2065, y: 350, radius: 14, collected: false, bobOffset: 4.5 },
      { id: 11, x: 2340, y: 330, radius: 14, collected: false, bobOffset: 5.0 },
    ],
    powerUpItems: [],
    checkpoints: [
      { id: 0, name: 'Cloud Edge', x: 100, y: 620, unlocked: true },
      { id: 1, name: 'Solid Rest', x: 1170, y: 480, unlocked: false },
    ],
    portal: { x: 2380, y: 260, width: 60, height: 110 },
  },

  // ==========================================
  // LEVEL 14: Moving Saws (Hard)
  // ==========================================
  {
    id: 14,
    name: 'Moving Saws',
    tier: 'World 3: Elevator Peaks & Hazards',
    difficulty: 'Hard',
    width: 2900,
    height: 1000,
    spawnPoint: { x: 100, y: 550 },
    targetTime: 27,
    platforms: [
      { id: 1, x: 50, y: 620, width: 220, height: 70, type: 'solid', color: '#3b82f6' },
      { id: 2, x: 720, y: 570, width: 140, height: 45, type: 'solid' },
      { id: 3, x: 1260, y: 520, width: 260, height: 60, type: 'solid', color: '#d97706' },
      { id: 4, x: 1840, y: 480, width: 140, height: 45, type: 'solid' },
      { id: 5, x: 2420, y: 430, width: 280, height: 70, type: 'solid', color: '#8b5cf6' },
    ],
    movingPlatforms: [
      {
        id: 1,
        x: 350,
        y: 600,
        width: 140,
        height: 35,
        startX: 310,
        startY: 600,
        endX: 620,
        endY: 600,
        speed: 145,
        progress: 0,
        direction: 1,
        vx: 0,
        vy: 0,
        color: '#0ea5e9',
      },
      {
        id: 2,
        x: 930,
        y: 550,
        width: 140,
        height: 35,
        startX: 900,
        startY: 550,
        endX: 1180,
        endY: 550,
        speed: 155,
        progress: 0,
        direction: 1,
        vx: 0,
        vy: 0,
        color: '#0ea5e9',
      },
      {
        id: 3,
        x: 1580,
        y: 500,
        width: 140,
        height: 35,
        startX: 1560,
        startY: 500,
        endX: 1760,
        endY: 500,
        speed: 160,
        progress: 0,
        direction: 1,
        vx: 0,
        vy: 0,
        color: '#0ea5e9',
      },
      {
        id: 4,
        x: 2060,
        y: 460,
        width: 140,
        height: 35,
        startX: 2040,
        startY: 460,
        endX: 2320,
        endY: 460,
        speed: 170,
        progress: 0,
        direction: 1,
        vx: 0,
        vy: 0,
        color: '#0ea5e9',
      },
    ],
    hazards: [
      { id: 1, x: 500, y: 550, type: 'saw', radius: 30, angle: 0, rotationSpeed: 4.5 },
      { id: 2, x: 1040, y: 500, type: 'saw', radius: 32, angle: 0, rotationSpeed: -4.8 },
      { id: 3, x: 2180, y: 410, type: 'saw', radius: 35, angle: 0, rotationSpeed: 5.2 },
    ],
    bounceSprings: [],
    coins: [
      { id: 1, x: 180, y: 570, radius: 14, collected: false, bobOffset: 0 },
      { id: 2, x: 450, y: 550, radius: 14, collected: false, bobOffset: 0.5 },
      { id: 3, x: 790, y: 520, radius: 14, collected: false, bobOffset: 1.0 },
      { id: 4, x: 1040, y: 420, radius: 14, collected: false, bobOffset: 1.5 },
      { id: 5, x: 1380, y: 470, radius: 14, collected: false, bobOffset: 2.0 },
      { id: 6, x: 1660, y: 450, radius: 14, collected: false, bobOffset: 2.5 },
      { id: 7, x: 1910, y: 430, radius: 14, collected: false, bobOffset: 3.0 },
      { id: 8, x: 2180, y: 330, radius: 14, collected: false, bobOffset: 3.5 },
      { id: 9, x: 2540, y: 380, radius: 14, collected: false, bobOffset: 4.0 },
    ],
    powerUpItems: [],
    checkpoints: [
      { id: 0, name: 'Saw Line', x: 100, y: 620, unlocked: true },
      { id: 1, name: 'Center Isle', x: 1330, y: 520, unlocked: false },
    ],
    portal: { x: 2580, y: 310, width: 60, height: 110 },
  },

  // ==========================================
  // LEVEL 15: High Altitude Bounce (Hard / World 3 Climax)
  // ==========================================
  {
    id: 15,
    name: 'High Altitude Bounce',
    tier: 'World 3: Elevator Peaks & Hazards',
    difficulty: 'Hard',
    width: 3100,
    height: 1200,
    spawnPoint: { x: 100, y: 650 },
    targetTime: 29,
    platforms: [
      { id: 1, x: 50, y: 720, width: 300, height: 70, type: 'solid', color: '#3b82f6' },
      { id: 2, x: 780, y: 360, width: 180, height: 45, type: 'solid' }, // apex platform
      { id: 3, x: 1240, y: 420, width: 280, height: 60, type: 'solid', color: '#d97706' },
      { id: 4, x: 1980, y: 220, width: 180, height: 45, type: 'solid' }, // apex 2
      { id: 5, x: 2520, y: 260, width: 340, height: 70, type: 'solid', color: '#8b5cf6' },
    ],
    movingPlatforms: [
      {
        id: 1,
        x: 1580,
        y: 400,
        width: 140,
        height: 35,
        startX: 1560,
        startY: 420,
        endX: 1560,
        endY: 260,
        speed: 140,
        progress: 0,
        direction: 1,
        vx: 0,
        vy: 0,
        color: '#a855f7',
      },
    ],
    hazards: [
      { id: 1, x: 1010, y: 400, type: 'saw', radius: 34, angle: 0, rotationSpeed: 4.8 },
      { id: 2, x: 2260, y: 240, type: 'saw', radius: 36, angle: 0, rotationSpeed: -5.0 },
    ],
    bounceSprings: [
      { id: 1, x: 250, y: 720, width: 50, height: 24, force: 1180, compressTime: 0 },
      { id: 2, x: 1400, y: 420, width: 50, height: 24, force: 1180, compressTime: 0 },
    ],
    coins: [
      { id: 1, x: 180, y: 670, radius: 14, collected: false, bobOffset: 0 },
      { id: 2, x: 420, y: 480, radius: 14, collected: false, bobOffset: 0.5 },
      { id: 3, x: 600, y: 320, radius: 14, collected: false, bobOffset: 1.0 },
      { id: 4, x: 870, y: 310, radius: 14, collected: false, bobOffset: 1.5 },
      { id: 5, x: 1010, y: 310, radius: 14, collected: false, bobOffset: 2.0 }, // over saw
      { id: 6, x: 1320, y: 370, radius: 14, collected: false, bobOffset: 2.5 },
      { id: 7, x: 1580, y: 200, radius: 14, collected: false, bobOffset: 3.0 },
      { id: 8, x: 2070, y: 170, radius: 14, collected: false, bobOffset: 3.5 },
      { id: 9, x: 2260, y: 150, radius: 14, collected: false, bobOffset: 4.0 }, // over saw 2
      { id: 10, x: 2680, y: 210, radius: 14, collected: false, bobOffset: 4.5 },
    ],
    powerUpItems: [
      { id: 1, x: 850, y: 300, type: 'dash', radius: 18, collected: false, bobOffset: 0 },
    ],
    checkpoints: [
      { id: 0, name: 'Ascent Base', x: 100, y: 720, unlocked: true },
      { id: 1, name: 'Cloud Plateau', x: 1300, y: 420, unlocked: false },
    ],
    portal: { x: 2720, y: 140, width: 60, height: 110 },
  },

  // ==========================================
  // LEVEL 16: Crumble Sprint (Expert)
  // ==========================================
  {
    id: 16,
    name: 'Crumble Sprint',
    tier: 'World 4: The Apex Gauntlet',
    difficulty: 'Expert',
    width: 3000,
    height: 1000,
    spawnPoint: { x: 100, y: 550 },
    targetTime: 20,
    platforms: [
      { id: 1, x: 50, y: 620, width: 260, height: 70, type: 'solid', color: '#3b82f6' },
      // Rapid chain of crumbling clouds!
      { id: 2, x: 380, y: 600, width: 100, height: 35, type: 'crumbling' },
      { id: 3, x: 550, y: 580, width: 100, height: 35, type: 'crumbling' },
      { id: 4, x: 720, y: 560, width: 100, height: 35, type: 'crumbling' },
      { id: 5, x: 890, y: 540, width: 100, height: 35, type: 'crumbling' },
      { id: 6, x: 1060, y: 520, width: 100, height: 35, type: 'crumbling' },
      { id: 7, x: 1240, y: 500, width: 240, height: 60, type: 'solid', color: '#d97706' },
      { id: 8, x: 1560, y: 480, width: 100, height: 35, type: 'crumbling' },
      { id: 9, x: 1730, y: 460, width: 100, height: 35, type: 'crumbling' },
      { id: 10, x: 1900, y: 440, width: 100, height: 35, type: 'crumbling' },
      { id: 11, x: 2070, y: 420, width: 100, height: 35, type: 'crumbling' },
      { id: 12, x: 2240, y: 400, width: 100, height: 35, type: 'crumbling' },
      { id: 13, x: 2430, y: 380, width: 320, height: 70, type: 'solid', color: '#8b5cf6' },
    ],
    movingPlatforms: [],
    hazards: [],
    bounceSprings: [],
    coins: [
      { id: 1, x: 180, y: 570, radius: 14, collected: false, bobOffset: 0 },
      { id: 2, x: 430, y: 550, radius: 14, collected: false, bobOffset: 0.5 },
      { id: 3, x: 600, y: 530, radius: 14, collected: false, bobOffset: 1.0 },
      { id: 4, x: 770, y: 510, radius: 14, collected: false, bobOffset: 1.5 },
      { id: 5, x: 940, y: 490, radius: 14, collected: false, bobOffset: 2.0 },
      { id: 6, x: 1110, y: 470, radius: 14, collected: false, bobOffset: 2.5 },
      { id: 7, x: 1360, y: 450, radius: 14, collected: false, bobOffset: 3.0 },
      { id: 8, x: 1610, y: 430, radius: 14, collected: false, bobOffset: 3.5 },
      { id: 9, x: 1780, y: 410, radius: 14, collected: false, bobOffset: 4.0 },
      { id: 10, x: 1950, y: 390, radius: 14, collected: false, bobOffset: 4.5 },
      { id: 11, x: 2120, y: 370, radius: 14, collected: false, bobOffset: 5.0 },
      { id: 12, x: 2560, y: 330, radius: 14, collected: false, bobOffset: 5.5 },
    ],
    powerUpItems: [
      { id: 1, x: 220, y: 560, type: 'speed_sneakers', radius: 18, collected: false, bobOffset: 0 },
    ],
    checkpoints: [
      { id: 0, name: 'Crumble Gate', x: 100, y: 620, unlocked: true },
      { id: 1, name: 'Rest Pillar', x: 1300, y: 500, unlocked: false },
    ],
    portal: { x: 2620, y: 260, width: 60, height: 110 },
  },

  // ==========================================
  // LEVEL 17: Sawblade Storm (Expert)
  // ==========================================
  {
    id: 17,
    name: 'Sawblade Storm',
    tier: 'World 4: The Apex Gauntlet',
    difficulty: 'Expert',
    width: 3000,
    height: 1000,
    spawnPoint: { x: 100, y: 550 },
    targetTime: 28,
    platforms: [
      { id: 1, x: 50, y: 620, width: 220, height: 70, type: 'solid', color: '#3b82f6' },
      { id: 2, x: 340, y: 590, width: 380, height: 35, type: 'solid' }, // twin saws
      { id: 3, x: 800, y: 560, width: 140, height: 45, type: 'solid' },
      { id: 4, x: 1020, y: 530, width: 380, height: 35, type: 'solid' }, // twin saws 2
      { id: 5, x: 1480, y: 500, width: 260, height: 60, type: 'solid', color: '#d97706' },
      { id: 6, x: 1820, y: 470, width: 130, height: 45, type: 'solid' },
      { id: 7, x: 2030, y: 440, width: 420, height: 35, type: 'solid' }, // triple saw gauntlet
      { id: 8, x: 2540, y: 400, width: 300, height: 70, type: 'solid', color: '#8b5cf6' },
    ],
    movingPlatforms: [],
    hazards: [
      { id: 1, x: 460, y: 555, type: 'saw', radius: 35, angle: 0, rotationSpeed: 5.5 },
      { id: 2, x: 620, y: 555, type: 'saw', radius: 35, angle: 0, rotationSpeed: -5.5 },
      { id: 3, x: 1140, y: 495, type: 'saw', radius: 36, angle: 0, rotationSpeed: 6.0 },
      { id: 4, x: 1300, y: 495, type: 'saw', radius: 36, angle: 0, rotationSpeed: -6.0 },
      { id: 5, x: 2150, y: 405, type: 'saw', radius: 38, angle: 0, rotationSpeed: 6.5 },
      { id: 6, x: 2330, y: 405, type: 'saw', radius: 38, angle: 0, rotationSpeed: -6.5 },
    ],
    bounceSprings: [],
    coins: [
      { id: 1, x: 180, y: 570, radius: 14, collected: false, bobOffset: 0 },
      { id: 2, x: 460, y: 470, radius: 14, collected: false, bobOffset: 0.5 },
      { id: 3, x: 620, y: 470, radius: 14, collected: false, bobOffset: 1.0 },
      { id: 4, x: 870, y: 510, radius: 14, collected: false, bobOffset: 1.5 },
      { id: 5, x: 1140, y: 410, radius: 14, collected: false, bobOffset: 2.0 },
      { id: 6, x: 1300, y: 410, radius: 14, collected: false, bobOffset: 2.5 },
      { id: 7, x: 1610, y: 450, radius: 14, collected: false, bobOffset: 3.0 },
      { id: 8, x: 1880, y: 420, radius: 14, collected: false, bobOffset: 3.5 },
      { id: 9, x: 2150, y: 320, radius: 14, collected: false, bobOffset: 4.0 },
      { id: 10, x: 2330, y: 320, radius: 14, collected: false, bobOffset: 4.5 },
      { id: 11, x: 2660, y: 350, radius: 14, collected: false, bobOffset: 5.0 },
    ],
    powerUpItems: [
      { id: 1, x: 870, y: 500, type: 'dash', radius: 18, collected: false, bobOffset: 0 },
    ],
    checkpoints: [
      { id: 0, name: 'Storm Approach', x: 100, y: 620, unlocked: true },
      { id: 1, name: 'Eye of Storm', x: 1540, y: 500, unlocked: false },
    ],
    portal: { x: 2700, y: 280, width: 60, height: 110 },
  },

  // ==========================================
  // LEVEL 18: Triple Elevator Chaos (Expert)
  // ==========================================
  {
    id: 18,
    name: 'Triple Elevator Chaos',
    tier: 'World 4: The Apex Gauntlet',
    difficulty: 'Expert',
    width: 3100,
    height: 1200,
    spawnPoint: { x: 100, y: 700 },
    targetTime: 30,
    platforms: [
      { id: 1, x: 50, y: 780, width: 240, height: 70, type: 'solid', color: '#3b82f6' },
      { id: 2, x: 1160, y: 450, width: 260, height: 60, type: 'solid', color: '#d97706' },
      { id: 3, x: 2480, y: 220, width: 340, height: 70, type: 'solid', color: '#8b5cf6' },
    ],
    movingPlatforms: [
      {
        id: 1,
        x: 360,
        y: 750,
        width: 130,
        height: 35,
        startX: 360,
        startY: 770,
        endX: 360,
        endY: 580,
        speed: 150,
        progress: 0,
        direction: 1,
        vx: 0,
        vy: 0,
        color: '#a855f7',
      },
      {
        id: 2,
        x: 620,
        y: 560,
        width: 130,
        height: 35,
        startX: 620,
        startY: 680,
        endX: 620,
        endY: 480,
        speed: 160,
        progress: 0.5,
        direction: -1,
        vx: 0,
        vy: 0,
        color: '#a855f7',
      },
      {
        id: 3,
        x: 880,
        y: 460,
        width: 130,
        height: 35,
        startX: 880,
        startY: 580,
        endX: 880,
        endY: 420,
        speed: 170,
        progress: 0.2,
        direction: 1,
        vx: 0,
        vy: 0,
        color: '#a855f7',
      },
      // Second trio
      {
        id: 4,
        x: 1540,
        y: 420,
        width: 130,
        height: 35,
        startX: 1540,
        startY: 440,
        endX: 1540,
        endY: 280,
        speed: 160,
        progress: 0,
        direction: 1,
        vx: 0,
        vy: 0,
        color: '#a855f7',
      },
      {
        id: 5,
        x: 1820,
        y: 360,
        width: 130,
        height: 35,
        startX: 1820,
        startY: 380,
        endX: 1820,
        endY: 240,
        speed: 170,
        progress: 0.6,
        direction: -1,
        vx: 0,
        vy: 0,
        color: '#a855f7',
      },
      {
        id: 6,
        x: 2100,
        y: 280,
        width: 130,
        height: 35,
        startX: 2100,
        startY: 320,
        endX: 2100,
        endY: 180,
        speed: 180,
        progress: 0.3,
        direction: 1,
        vx: 0,
        vy: 0,
        color: '#a855f7',
      },
    ],
    hazards: [
      { id: 1, x: 490, y: 790, type: 'spike', width: 120, height: 18 },
      { id: 2, x: 750, y: 790, type: 'spike', width: 120, height: 18 },
      { id: 3, x: 1670, y: 790, type: 'spike', width: 140, height: 18 },
      { id: 4, x: 1950, y: 790, type: 'spike', width: 140, height: 18 },
    ],
    bounceSprings: [],
    coins: [
      { id: 1, x: 180, y: 730, radius: 14, collected: false, bobOffset: 0 },
      { id: 2, x: 360, y: 640, radius: 14, collected: false, bobOffset: 0.5 },
      { id: 3, x: 620, y: 530, radius: 14, collected: false, bobOffset: 1.0 },
      { id: 4, x: 880, y: 450, radius: 14, collected: false, bobOffset: 1.5 },
      { id: 5, x: 1290, y: 400, radius: 14, collected: false, bobOffset: 2.0 },
      { id: 6, x: 1540, y: 320, radius: 14, collected: false, bobOffset: 2.5 },
      { id: 7, x: 1820, y: 260, radius: 14, collected: false, bobOffset: 3.0 },
      { id: 8, x: 2100, y: 200, radius: 14, collected: false, bobOffset: 3.5 },
      { id: 9, x: 2600, y: 170, radius: 14, collected: false, bobOffset: 4.0 },
    ],
    powerUpItems: [],
    checkpoints: [
      { id: 0, name: 'Lower Pits', x: 100, y: 780, unlocked: true },
      { id: 1, name: 'Center Spire', x: 1220, y: 450, unlocked: false },
    ],
    portal: { x: 2650, y: 100, width: 60, height: 110 },
  },

  // ==========================================
  // LEVEL 19: Stratosphere Glide (Expert)
  // ==========================================
  {
    id: 19,
    name: 'Stratosphere Glide',
    tier: 'World 4: The Apex Gauntlet',
    difficulty: 'Expert',
    width: 3200,
    height: 1200,
    spawnPoint: { x: 100, y: 350 },
    targetTime: 32,
    platforms: [
      { id: 1, x: 50, y: 420, width: 280, height: 70, type: 'solid', color: '#3b82f6' },
      { id: 2, x: 1000, y: 650, width: 140, height: 45, type: 'solid' }, // mid descent
      { id: 3, x: 1650, y: 750, width: 280, height: 60, type: 'solid', color: '#d97706' },
      { id: 4, x: 2400, y: 820, width: 160, height: 45, type: 'solid' },
      { id: 5, x: 2800, y: 800, width: 340, height: 70, type: 'solid', color: '#8b5cf6' },
    ],
    movingPlatforms: [
      {
        id: 1,
        x: 1300,
        y: 700,
        width: 130,
        height: 35,
        startX: 1250,
        startY: 700,
        endX: 1520,
        endY: 700,
        speed: 150,
        progress: 0,
        direction: 1,
        vx: 0,
        vy: 0,
        color: '#0ea5e9',
      },
      {
        id: 2,
        x: 2050,
        y: 780,
        width: 130,
        height: 35,
        startX: 2000,
        startY: 780,
        endX: 2280,
        endY: 780,
        speed: 160,
        progress: 0,
        direction: 1,
        vx: 0,
        vy: 0,
        color: '#0ea5e9',
      },
    ],
    hazards: [
      { id: 1, x: 650, y: 530, type: 'saw', radius: 42, angle: 0, rotationSpeed: 4.8 },
      { id: 2, x: 1850, y: 720, type: 'saw', radius: 44, angle: 0, rotationSpeed: -5.2 },
    ],
    bounceSprings: [],
    coins: [
      { id: 1, x: 200, y: 370, radius: 14, collected: false, bobOffset: 0 },
      { id: 2, x: 450, y: 440, radius: 14, collected: false, bobOffset: 0.5 },
      { id: 3, x: 650, y: 440, radius: 14, collected: false, bobOffset: 1.0 }, // glide over saw
      { id: 4, x: 850, y: 550, radius: 14, collected: false, bobOffset: 1.5 },
      { id: 5, x: 1070, y: 610, radius: 14, collected: false, bobOffset: 2.0 },
      { id: 6, x: 1400, y: 650, radius: 14, collected: false, bobOffset: 2.5 },
      { id: 7, x: 1780, y: 700, radius: 14, collected: false, bobOffset: 3.0 },
      { id: 8, x: 1850, y: 630, radius: 14, collected: false, bobOffset: 3.5 }, // over saw 2
      { id: 9, x: 2150, y: 730, radius: 14, collected: false, bobOffset: 4.0 },
      { id: 10, x: 2480, y: 770, radius: 14, collected: false, bobOffset: 4.5 },
      { id: 11, x: 2950, y: 750, radius: 14, collected: false, bobOffset: 5.0 },
    ],
    powerUpItems: [
      { id: 1, x: 240, y: 360, type: 'parachute', radius: 18, collected: false, bobOffset: 0 },
    ],
    checkpoints: [
      { id: 0, name: 'Cliff Precipice', x: 100, y: 420, unlocked: true },
      { id: 1, name: 'Glide Sanctuary', x: 1720, y: 750, unlocked: false },
    ],
    portal: { x: 3000, y: 680, width: 60, height: 110 },
  },

  // ==========================================
  // LEVEL 20: The Grand Apex Obby (The Finale!)
  // ==========================================
  {
    id: 20,
    name: 'The Grand Apex Obby',
    tier: 'World 4: The Apex Gauntlet',
    difficulty: 'Expert',
    width: 3600,
    height: 1200,
    spawnPoint: { x: 100, y: 600 },
    targetTime: 35,
    platforms: [
      // 1. Spawn Plaza
      { id: 1, x: 50, y: 680, width: 280, height: 70, type: 'solid', color: '#3b82f6' },
      // 2. Crumbling steps
      { id: 2, x: 390, y: 660, width: 100, height: 35, type: 'crumbling' },
      { id: 3, x: 560, y: 640, width: 100, height: 35, type: 'crumbling' },
      { id: 4, x: 730, y: 620, width: 100, height: 35, type: 'crumbling' },
      // 3. Spring pad island
      { id: 5, x: 900, y: 600, width: 220, height: 50, type: 'solid' },
      // 4. Mid checkpoint island
      { id: 6, x: 1480, y: 380, width: 280, height: 60, type: 'solid', color: '#d97706' },
      // 5. Gauntlet beam with twin saws
      { id: 7, x: 2180, y: 340, width: 360, height: 35, type: 'solid' },
      // 6. Ascending Rainbow steps
      { id: 8, x: 2650, y: 310, width: 80, height: 28, type: 'solid', color: '#ef4444' },
      { id: 9, x: 2770, y: 280, width: 80, height: 28, type: 'solid', color: '#f97316' },
      { id: 10, x: 2890, y: 250, width: 80, height: 28, type: 'solid', color: '#facc15' },
      { id: 11, x: 3010, y: 220, width: 80, height: 28, type: 'solid', color: '#10b981' },
      // 7. Grand Victory Stargate Island!
      { id: 12, x: 3160, y: 190, width: 400, height: 80, type: 'solid', color: '#8b5cf6' },
    ],
    movingPlatforms: [
      // Elevator between spring and sawbeam
      {
        id: 1,
        x: 1840,
        y: 380,
        width: 130,
        height: 35,
        startX: 1840,
        startY: 420,
        endX: 1840,
        endY: 280,
        speed: 160,
        progress: 0,
        direction: 1,
        vx: 0,
        vy: 0,
        color: '#a855f7',
      },
    ],
    hazards: [
      { id: 1, x: 2280, y: 305, type: 'saw', radius: 36, angle: 0, rotationSpeed: 6.0 },
      { id: 2, x: 2440, y: 305, type: 'saw', radius: 36, angle: 0, rotationSpeed: -6.0 },
    ],
    bounceSprings: [
      { id: 1, x: 1040, y: 600, width: 50, height: 24, force: 1200, compressTime: 0 },
    ],
    coins: [
      { id: 1, x: 180, y: 630, radius: 14, collected: false, bobOffset: 0 },
      { id: 2, x: 440, y: 610, radius: 14, collected: false, bobOffset: 0.5 },
      { id: 3, x: 610, y: 590, radius: 14, collected: false, bobOffset: 1.0 },
      { id: 4, x: 780, y: 570, radius: 14, collected: false, bobOffset: 1.5 },
      { id: 5, x: 970, y: 550, radius: 14, collected: false, bobOffset: 2.0 },
      { id: 6, x: 1180, y: 410, radius: 14, collected: false, bobOffset: 2.5 }, // high spring coin
      { id: 7, x: 1320, y: 320, radius: 14, collected: false, bobOffset: 3.0 }, // apex coin
      { id: 8, x: 1600, y: 330, radius: 14, collected: false, bobOffset: 3.5 },
      { id: 9, x: 1840, y: 240, radius: 14, collected: false, bobOffset: 4.0 },
      { id: 10, x: 2280, y: 230, radius: 14, collected: false, bobOffset: 4.5 }, // over saw 1
      { id: 11, x: 2440, y: 230, radius: 14, collected: false, bobOffset: 5.0 }, // over saw 2
      { id: 12, x: 2700, y: 250, radius: 14, collected: false, bobOffset: 0.2 },
      { id: 13, x: 2940, y: 190, radius: 14, collected: false, bobOffset: 0.6 },
      { id: 14, x: 3300, y: 130, radius: 14, collected: false, bobOffset: 1.0 },
    ],
    powerUpItems: [
      { id: 1, x: 220, y: 620, type: 'speed_sneakers', radius: 18, collected: false, bobOffset: 0 },
      { id: 2, x: 1540, y: 330, type: 'dash', radius: 18, collected: false, bobOffset: 1.0 },
    ],
    checkpoints: [
      { id: 0, name: 'Grand Spawn', x: 100, y: 680, unlocked: true },
      { id: 1, name: 'Celestial Apex', x: 1550, y: 380, unlocked: false },
    ],
    portal: { x: 3380, y: 70, width: 70, height: 120 },
  },
];
