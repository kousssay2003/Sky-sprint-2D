/**
 * CRAZY OBBY: SKY SPRINT - Game Types
 */

import * as THREE from 'three';

export type GameStatus = 'menu' | 'playing' | 'paused' | 'respawning' | 'victory';

export interface CheckpointData {
  id: number;
  name: string;
  position: THREE.Vector3;
  respawnRotation: number;
  unlocked: boolean;
  color: string;
}

export interface CoinData {
  id: number;
  position: THREE.Vector3;
  mesh?: THREE.Group;
  collected: boolean;
}

export interface MovingPlatformData {
  id: number;
  mesh: THREE.Mesh;
  basePosition: THREE.Vector3;
  offsetRange: THREE.Vector3; // e.g. (0, 0, 4) for Z oscillation or (0, 3, 0) for elevator
  speed: number;
  phase: number;
  size: THREE.Vector3;
  velocity: THREE.Vector3;
}

export interface RotatingHazardData {
  id: number;
  mesh: THREE.Group | THREE.Mesh;
  center: THREE.Vector3;
  axis: 'x' | 'y' | 'z';
  speed: number;
  radius: number;
  halfLength: number;
  height: number;
}

export interface DisappearingPlatformData {
  id: number;
  mesh: THREE.Mesh;
  center: THREE.Vector3;
  size: THREE.Vector3;
  cycleDuration: number;
  activeDuration: number; // Solid time
  warningDuration: number; // Blinking time
  timer: number;
  isSolid: boolean;
}

export interface BouncePadData {
  id: number;
  mesh: THREE.Group;
  position: THREE.Vector3;
  size: THREE.Vector3;
  bounceForce: number;
  cooldown: number;
}

export interface StaticPlatformData {
  id: number;
  box: THREE.Box3;
  mesh: THREE.Mesh;
  isHazard?: boolean;
}

export interface PlayerStats {
  coinsCollected: number;
  totalCoins: number;
  currentCheckpoint: number;
  totalCheckpoints: number;
  checkpointName: string;
  fallCount: number;
  elapsedTime: number; // seconds
  bestTime: number | null;
}

export interface InputState {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  jump: boolean;
  jumpJustPressed: boolean;
  virtualStick: {
    x: number; // -1 to 1
    y: number; // -1 to 1
    active: boolean;
  };
  cameraYawDelta: number;
}
