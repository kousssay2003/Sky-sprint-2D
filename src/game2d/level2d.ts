/**
 * CRAZY OBBY: SKY SPRINT 2D - Level Selector & Course Loader
 */

import { LevelData2D } from '../types/game2d';
import { ALL_LEVELS } from './levelData';

export function getLevel2D(levelNumber: number = 1): LevelData2D {
  const index = Math.max(0, Math.min(levelNumber - 1, ALL_LEVELS.length - 1));
  const raw = ALL_LEVELS[index] || ALL_LEVELS[0];

  // Deep clone so runtime mutations (coins, crumbling blocks, etc.) are fresh on reload
  return JSON.parse(JSON.stringify(raw));
}

export function getTotalLevels(): number {
  return ALL_LEVELS.length;
}

export { ALL_LEVELS };
