/**
 * CRAZY OBBY: SKY SPRINT - Level Generator
 * Builds the floating sky environment, clouds, distant islands,
 * static platforms, moving platforms, rotating hazards, disappearing blocks,
 * bounce pads, golden coins, checkpoints, and victory stargate portal.
 */

import * as THREE from 'three';
import {
  BouncePadData,
  CheckpointData,
  CoinData,
  DisappearingPlatformData,
  MovingPlatformData,
  RotatingHazardData,
  StaticPlatformData,
} from '../types/game';
import { COLORS } from './constants';

export interface LevelData {
  root: THREE.Group;
  staticPlatforms: StaticPlatformData[];
  movingPlatforms: MovingPlatformData[];
  rotatingHazards: RotatingHazardData[];
  disappearingPlatforms: DisappearingPlatformData[];
  bouncePads: BouncePadData[];
  coins: CoinData[];
  checkpoints: CheckpointData[];
  finishTrigger: THREE.Box3;
  clouds: THREE.Group[];
  portalGroup: THREE.Group;
}

export function buildLevel(): LevelData {
  const root = new THREE.Group();

  const staticPlatforms: StaticPlatformData[] = [];
  const movingPlatforms: MovingPlatformData[] = [];
  const rotatingHazards: RotatingHazardData[] = [];
  const disappearingPlatforms: DisappearingPlatformData[] = [];
  const bouncePads: BouncePadData[] = [];
  const coins: CoinData[] = [];
  const checkpoints: CheckpointData[] = [];

  let nextPlatformId = 1;
  let nextCoinId = 1;

  // Reusable Materials
  const matPlatformBlue = new THREE.MeshStandardMaterial({
    color: COLORS.PLATFORM_BASE,
    roughness: 0.35,
    metalness: 0.1,
  });

  const matPlatformCyan = new THREE.MeshStandardMaterial({
    color: 0x0ea5e9,
    roughness: 0.3,
    metalness: 0.1,
  });

  const matPlatformPurple = new THREE.MeshStandardMaterial({
    color: 0x8b5cf6,
    roughness: 0.35,
    metalness: 0.1,
  });

  const matPlatformAmber = new THREE.MeshStandardMaterial({
    color: COLORS.WOOD_LIGHT,
    roughness: 0.5,
    metalness: 0.05,
  });

  const matPlatformGreen = new THREE.MeshStandardMaterial({
    color: 0x10b981,
    roughness: 0.4,
    metalness: 0.1,
  });

  const matHazard = new THREE.MeshStandardMaterial({
    color: COLORS.HAZARD_RED,
    emissive: COLORS.HAZARD_EMISSIVE,
    emissiveIntensity: 0.6,
    roughness: 0.2,
    metalness: 0.2,
  });

  const matCoin = new THREE.MeshStandardMaterial({
    color: COLORS.COIN_GOLD,
    emissive: COLORS.COIN_EMISSIVE,
    emissiveIntensity: 0.4,
    roughness: 0.15,
    metalness: 0.85,
  });

  // Helper to add static box platform
  function addPlatform(
    x: number,
    y: number,
    z: number,
    w: number,
    h: number,
    d: number,
    material: THREE.Material = matPlatformBlue,
    isHazard: boolean = false
  ): THREE.Mesh {
    const geo = new THREE.BoxGeometry(w, h, d);
    const mesh = new THREE.Mesh(geo, material);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    root.add(mesh);

    // Compute bounding box
    mesh.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(mesh);
    staticPlatforms.push({
      id: nextPlatformId++,
      box,
      mesh,
      isHazard,
    });
    return mesh;
  }

  // Helper to add coin
  function addCoin(x: number, y: number, z: number) {
    const coinGroup = new THREE.Group();
    // Star/cylinder gold token
    const coinGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.1, 16);
    coinGeo.rotateX(Math.PI / 2);
    const coinMesh = new THREE.Mesh(coinGeo, matCoin);
    coinGroup.add(coinMesh);

    // Small star or inner ridge
    const innerGeo = new THREE.TorusGeometry(0.24, 0.04, 8, 16);
    const innerMesh = new THREE.Mesh(innerGeo, matCoin);
    coinGroup.add(innerMesh);

    coinGroup.position.set(x, y, z);
    root.add(coinGroup);

    coins.push({
      id: nextCoinId++,
      position: new THREE.Vector3(x, y, z),
      mesh: coinGroup,
      collected: false,
    });
  }

  // Helper to add checkpoint beacon
  function addCheckpoint(
    id: number,
    name: string,
    x: number,
    y: number,
    z: number,
    respawnRotation: number = 0
  ) {
    const group = new THREE.Group();
    group.position.set(x, y, z);

    // Platform pad
    const padGeo = new THREE.CylinderGeometry(1.5, 1.6, 0.25, 24);
    const padMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.4,
      metalness: 0.2,
    });
    const padMesh = new THREE.Mesh(padGeo, padMat);
    padMesh.position.y = 0.125;
    padMesh.receiveShadow = true;
    group.add(padMesh);

    // Outer ring with glow
    const ringGeo = new THREE.TorusGeometry(1.4, 0.08, 12, 32);
    ringGeo.rotateX(Math.PI / 2);
    const ringMat = new THREE.MeshStandardMaterial({
      color: COLORS.CHECKPOINT_INACTIVE,
      emissive: COLORS.CHECKPOINT_INACTIVE,
      emissiveIntensity: 0.8,
      roughness: 0.2,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.position.y = 0.26;
    group.add(ringMesh);

    // Central crystal / beacon gem
    const crystalGeo = new THREE.OctahedronGeometry(0.35, 0);
    const crystalMat = new THREE.MeshStandardMaterial({
      color: COLORS.CHECKPOINT_INACTIVE,
      emissive: COLORS.CHECKPOINT_INACTIVE,
      emissiveIntensity: 0.9,
      roughness: 0.1,
      metalness: 0.3,
    });
    const crystalMesh = new THREE.Mesh(crystalGeo, crystalMat);
    crystalMesh.position.y = 1.6;
    group.add(crystalMesh);

    // Support pillars
    for (let i = 0; i < 3; i++) {
      const angle = (i * 2 * Math.PI) / 3;
      const pillarGeo = new THREE.CylinderGeometry(0.06, 0.06, 1.2, 8);
      const pillar = new THREE.Mesh(pillarGeo, padMat);
      pillar.position.set(Math.cos(angle) * 0.9, 0.7, Math.sin(angle) * 0.9);
      group.add(pillar);
    }

    root.add(group);

    // Track for checkpoint trigger and visual update
    checkpoints.push({
      id,
      name,
      position: new THREE.Vector3(x, y + 0.3, z),
      respawnRotation,
      unlocked: id === 0, // start unlocked
      color: id === 0 ? '#10b981' : '#f97316',
    });

    if (id === 0) {
      ringMat.color.setHex(COLORS.CHECKPOINT_ACTIVE);
      ringMat.emissive.setHex(COLORS.CHECKPOINT_ACTIVE);
      crystalMat.color.setHex(COLORS.CHECKPOINT_ACTIVE);
      crystalMat.emissive.setHex(COLORS.CHECKPOINT_ACTIVE);
    }
  }

  // ==========================================
  // SECTION 0: SPAWN ISLAND (Z: -6 to +8, Y: 0)
  // ==========================================
  addPlatform(0, -0.4, 0, 7, 0.8, 8, matPlatformGreen);
  addCheckpoint(0, 'Sky Island Start', 0, 0, 0, 0);

  // Welcome Arch
  const archMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.2 });
  const p1 = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 3.2, 12), archMat);
  p1.position.set(-2.4, 1.6, 3.5);
  root.add(p1);
  const p2 = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 3.2, 12), archMat);
  p2.position.set(2.4, 1.6, 3.5);
  root.add(p2);
  const archBar = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.35, 0.4), archMat);
  archBar.position.set(0, 3.2, 3.5);
  root.add(archBar);

  addCoin(0, 1.2, 4);

  // ==========================================
  // SECTION 1: CLOUDBURST STEPS (Z: 9 to 38)
  // Stepping stones with varying gaps and gentle height rise
  // ==========================================
  const s1Pads = [
    { x: 0, y: 0, z: 9, w: 2.4, d: 2.4 },
    { x: -1.6, y: 0.3, z: 13, w: 2.0, d: 2.0 },
    { x: 1.6, y: 0.6, z: 17, w: 2.0, d: 2.0 },
    { x: 0, y: 0.9, z: 21, w: 2.2, d: 2.2 },
    { x: -1.8, y: 1.3, z: 25.5, w: 1.8, d: 1.8 },
    { x: 1.8, y: 1.7, z: 30, w: 1.8, d: 1.8 },
    { x: 0, y: 2.0, z: 34.5, w: 2.6, d: 2.6 },
  ];

  s1Pads.forEach((p, idx) => {
    addPlatform(p.x, p.y - 0.3, p.z, p.w, 0.6, p.d, idx % 2 === 0 ? matPlatformBlue : matPlatformCyan);
    addCoin(p.x, p.y + 1.0, p.z);
  });

  // Checkpoint 1 Island
  addPlatform(0, 1.6, 39, 5, 0.8, 5, matPlatformAmber);
  addCheckpoint(1, 'Cloudburst Peaks', 0, 2.0, 39, 0);
  addCoin(0, 3.2, 39);

  // ==========================================
  // SECTION 2: SPINNERS & DANGER STRIPS (Z: 44 to 76)
  // Narrow bridges, red danger edges, rotating sweep bars
  // ==========================================
  // Narrow beam 1
  addPlatform(0, 2.0, 45, 1.6, 0.6, 6, matPlatformBlue);
  // Red hazard borders on sides
  addPlatform(-0.9, 2.1, 45, 0.2, 0.5, 6, matHazard, true);
  addPlatform(0.9, 2.1, 45, 0.2, 0.5, 6, matHazard, true);
  addCoin(0, 3.0, 45);

  // Spinner 1 hub and arm
  const spinner1Hub = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 1.5, 16), matPlatformPurple);
  spinner1Hub.position.set(0, 2.6, 50.5);
  root.add(spinner1Hub);
  addPlatform(0, 2.0, 50.5, 3.5, 0.6, 3.5, matPlatformBlue);

  const spinner1Group = new THREE.Group();
  spinner1Group.position.set(0, 2.8, 50.5);
  const arm1Geo = new THREE.BoxGeometry(4.2, 0.3, 0.3);
  const arm1Mesh = new THREE.Mesh(arm1Geo, matHazard);
  arm1Mesh.castShadow = true;
  spinner1Group.add(arm1Mesh);
  root.add(spinner1Group);

  rotatingHazards.push({
    id: 1,
    mesh: spinner1Group,
    center: new THREE.Vector3(0, 2.8, 50.5),
    axis: 'y',
    speed: 1.6,
    radius: 2.1,
    halfLength: 2.1,
    height: 0.3,
  });

  // Step stones leading to Spinner 2
  addPlatform(-1.4, 2.3, 55.5, 1.8, 0.6, 2.0, matPlatformCyan);
  addCoin(-1.4, 3.4, 55.5);

  addPlatform(1.4, 2.6, 60, 1.8, 0.6, 2.0, matPlatformCyan);
  addCoin(1.4, 3.7, 60);

  // Spinner 2: Double cross arm rotating opposite direction
  addPlatform(0, 2.9, 66, 4.0, 0.6, 4.0, matPlatformBlue);
  const spinner2Group = new THREE.Group();
  spinner2Group.position.set(0, 3.7, 66);

  const arm2A = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.35, 0.3), matHazard);
  const arm2B = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.35, 4.8), matHazard);
  arm2A.castShadow = true;
  arm2B.castShadow = true;
  spinner2Group.add(arm2A);
  spinner2Group.add(arm2B);
  root.add(spinner2Group);

  rotatingHazards.push({
    id: 2,
    mesh: spinner2Group,
    center: new THREE.Vector3(0, 3.7, 66),
    axis: 'y',
    speed: -2.0,
    radius: 2.4,
    halfLength: 2.4,
    height: 0.35,
  });
  addCoin(0, 4.2, 66);

  // Narrow walkway leading to Checkpoint 2
  addPlatform(0, 3.1, 72, 1.4, 0.6, 5, matPlatformBlue);
  addPlatform(-0.8, 3.2, 72, 0.2, 0.5, 5, matHazard, true);
  addPlatform(0.8, 3.2, 72, 0.2, 0.5, 5, matHazard, true);

  // Checkpoint 2 Island
  addPlatform(0, 3.1, 78, 5.5, 0.8, 5.5, matPlatformAmber);
  addCheckpoint(2, 'Spinning Meridian', 0, 3.5, 78, 0);

  // ==========================================
  // SECTION 3: MOVING ELEVATORS & BOUNCE PADS (Z: 84 to 122)
  // Dynamic oscillating platforms + super bounce pads
  // ==========================================
  // Moving platform 1: Horizontal X oscillation
  const move1Geo = new THREE.BoxGeometry(3.0, 0.5, 3.0);
  const move1Mesh = new THREE.Mesh(move1Geo, matPlatformCyan);
  move1Mesh.position.set(0, 3.5, 85);
  move1Mesh.castShadow = true;
  move1Mesh.receiveShadow = true;
  root.add(move1Mesh);

  movingPlatforms.push({
    id: 1,
    mesh: move1Mesh,
    basePosition: new THREE.Vector3(0, 3.5, 85),
    offsetRange: new THREE.Vector3(3.2, 0, 0), // slides left and right
    speed: 1.8,
    phase: 0,
    size: new THREE.Vector3(3.0, 0.5, 3.0),
    velocity: new THREE.Vector3(),
  });
  addCoin(0, 4.8, 85);

  // Intermediate rest pad
  addPlatform(0, 3.8, 93, 3.0, 0.6, 3.0, matPlatformBlue);

  // Moving platform 2: Vertical Elevator (Y: 4 to 8.5)
  const elevatorGeo = new THREE.BoxGeometry(3.2, 0.5, 3.2);
  const elevatorMesh = new THREE.Mesh(elevatorGeo, matPlatformPurple);
  elevatorMesh.position.set(0, 4.2, 100);
  elevatorMesh.castShadow = true;
  elevatorMesh.receiveShadow = true;
  root.add(elevatorMesh);

  movingPlatforms.push({
    id: 2,
    mesh: elevatorMesh,
    basePosition: new THREE.Vector3(0, 6.2, 100),
    offsetRange: new THREE.Vector3(0, 2.5, 0), // moves up/down between 3.7 and 8.7
    speed: 1.5,
    phase: 0,
    size: new THREE.Vector3(3.2, 0.5, 3.2),
    velocity: new THREE.Vector3(),
  });
  addCoin(0, 7.5, 100);

  // High ledge with Bounce Pad
  addPlatform(0, 7.5, 108, 3.5, 0.8, 3.5, matPlatformBlue);

  // Bounce Pad Assembly
  const padGroup = new THREE.Group();
  padGroup.position.set(0, 7.9, 108);
  const bBaseGeo = new THREE.CylinderGeometry(1.2, 1.3, 0.2, 20);
  const bBaseMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.5 });
  const bBase = new THREE.Mesh(bBaseGeo, bBaseMat);
  padGroup.add(bBase);

  const bTopGeo = new THREE.CylinderGeometry(1.0, 1.0, 0.15, 20);
  const bTopMat = new THREE.MeshStandardMaterial({
    color: COLORS.BOUNCE_PAD,
    emissive: COLORS.BOUNCE_PAD,
    emissiveIntensity: 0.6,
    roughness: 0.2,
  });
  const bTop = new THREE.Mesh(bTopGeo, bTopMat);
  bTop.position.y = 0.12;
  padGroup.add(bTop);
  root.add(padGroup);

  bouncePads.push({
    id: 1,
    mesh: padGroup,
    position: new THREE.Vector3(0, 8.0, 108),
    size: new THREE.Vector3(2.0, 0.4, 2.0),
    bounceForce: 21.0,
    cooldown: 0,
  });

  // High airborne coins to collect during bounce!
  addCoin(0, 14.5, 114);
  addCoin(0, 12.0, 117);

  // Checkpoint 3 Island (Player lands here after bounce pad launch!)
  addPlatform(0, 8.6, 122, 6, 0.8, 6, matPlatformAmber);
  addCheckpoint(3, 'Stratosphere Apex', 0, 9.0, 122, 0);

  // ==========================================
  // SECTION 4: DISAPPEARING BLOCKS & FINAL SPRINT (Z: 128 to 170)
  // Blinking disappearing cloud pads, rotating laser bar, victory portal
  // ==========================================
  const disappearingPads = [
    { x: -1.5, y: 9.3, z: 130, w: 2.2, d: 2.2, phase: 0 },
    { x: 1.5, y: 9.7, z: 135, w: 2.2, d: 2.2, phase: 1.2 },
    { x: -1.5, y: 10.1, z: 140, w: 2.2, d: 2.2, phase: 2.4 },
    { x: 1.5, y: 10.5, z: 145, w: 2.2, d: 2.2, phase: 0.6 },
  ];

  disappearingPads.forEach((p, idx) => {
    const dGeo = new THREE.BoxGeometry(p.w, 0.5, p.d);
    const dMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.95,
      roughness: 0.2,
      metalness: 0.1,
    });
    const dMesh = new THREE.Mesh(dGeo, dMat);
    dMesh.position.set(p.x, p.y, p.z);
    dMesh.castShadow = true;
    root.add(dMesh);

    disappearingPlatforms.push({
      id: idx + 1,
      mesh: dMesh,
      center: new THREE.Vector3(p.x, p.y, p.z),
      size: new THREE.Vector3(p.w, 0.5, p.d),
      cycleDuration: 4.2,
      activeDuration: 2.5,
      warningDuration: 0.9,
      timer: p.phase,
      isSolid: true,
    });
    addCoin(p.x, p.y + 1.1, p.z);
  });

  // Solid landing bridge
  addPlatform(0, 10.8, 151, 3.2, 0.6, 4.0, matPlatformBlue);

  // Rotating Laser Beam hazard before final stairs
  const finalSpinnerGroup = new THREE.Group();
  finalSpinnerGroup.position.set(0, 11.8, 151);
  const laserGeo = new THREE.BoxGeometry(4.6, 0.35, 0.35);
  const laserMesh = new THREE.Mesh(laserGeo, matHazard);
  finalSpinnerGroup.add(laserMesh);
  root.add(finalSpinnerGroup);

  rotatingHazards.push({
    id: 3,
    mesh: finalSpinnerGroup,
    center: new THREE.Vector3(0, 11.8, 151),
    axis: 'y',
    speed: 2.5,
    radius: 2.3,
    halfLength: 2.3,
    height: 0.35,
  });

  // Ascending Grand Rainbow Steps
  const stepColors = [0xef4444, 0xf97316, 0xfacc15, 0x10b981, 0x06b6d4, 0x8b5cf6];
  for (let s = 0; s < 6; s++) {
    const stepMat = new THREE.MeshStandardMaterial({
      color: stepColors[s],
      roughness: 0.3,
      metalness: 0.1,
    });
    addPlatform(0, 11.2 + s * 0.4, 156 + s * 2.2, 4.2, 0.4, 2.0, stepMat);
    if (s % 2 === 0) {
      addCoin(0, 12.2 + s * 0.4, 156 + s * 2.2);
    }
  }

  // ==========================================
  // FINISH PORTAL ISLAND (Z: 174, Y: 13.6)
  // Grand Stargate with swirling rings, particles, and finish trigger
  // ==========================================
  addPlatform(0, 13.4, 175, 8.0, 1.0, 8.0, matPlatformAmber);

  const portalGroup = new THREE.Group();
  portalGroup.position.set(0, 14.2, 176);

  // Portal Base Pedestal
  const baseGeo = new THREE.CylinderGeometry(2.4, 2.7, 0.4, 32);
  const baseMat = new THREE.MeshStandardMaterial({ color: 0x1e1b4b, roughness: 0.3, metalness: 0.4 });
  const pBase = new THREE.Mesh(baseGeo, baseMat);
  portalGroup.add(pBase);

  // Outer Stargate Ring
  const outerRingGeo = new THREE.TorusGeometry(2.6, 0.28, 16, 48);
  const outerRingMat = new THREE.MeshStandardMaterial({
    color: 0x9333ea,
    emissive: 0x7e22ce,
    emissiveIntensity: 0.6,
    roughness: 0.2,
    metalness: 0.5,
  });
  const outerRing = new THREE.Mesh(outerRingGeo, outerRingMat);
  outerRing.position.y = 2.8;
  portalGroup.add(outerRing);

  // Inner Spinning Energy Ring
  const innerRingGeo = new THREE.TorusGeometry(2.2, 0.15, 12, 36);
  const innerRingMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    emissive: 0x0284c7,
    emissiveIntensity: 0.9,
    roughness: 0.1,
  });
  const innerRing = new THREE.Mesh(innerRingGeo, innerRingMat);
  innerRing.position.y = 2.8;
  portalGroup.add(innerRing);

  // Swirling Energy Vortex (translucent disc)
  const discGeo = new THREE.CircleGeometry(2.0, 32);
  const discMat = new THREE.MeshBasicMaterial({
    color: 0x67e8f9,
    transparent: true,
    opacity: 0.5,
    side: THREE.DoubleSide,
  });
  const disc = new THREE.Mesh(discGeo, discMat);
  disc.position.y = 2.8;
  portalGroup.add(disc);

  root.add(portalGroup);

  // Finish trigger box in world space
  const finishTrigger = new THREE.Box3(
    new THREE.Vector3(-2.2, 13.5, 174),
    new THREE.Vector3(2.2, 18.0, 178)
  );

  // ==========================================
  // SKY ENVIRONMENT & FLUFFY CLOUDS
  // Stylized low-poly clouds & floating distant islands
  // ==========================================
  const cloudMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.9,
    metalness: 0.0,
  });

  const clouds: THREE.Group[] = [];

  function createCloud(x: number, y: number, z: number, scale: number = 1.0): THREE.Group {
    const cloud = new THREE.Group();
    const parts = [
      { x: 0, y: 0, z: 0, r: 2.2 },
      { x: 1.6, y: -0.2, z: 0.3, r: 1.8 },
      { x: -1.6, y: -0.3, z: -0.2, r: 1.6 },
      { x: 0.8, y: 0.8, z: 0, r: 1.5 },
      { x: -0.8, y: 0.6, z: 0.2, r: 1.4 },
    ];
    parts.forEach(p => {
      const geo = new THREE.DodecahedronGeometry(p.r, 1);
      const mesh = new THREE.Mesh(geo, cloudMat);
      mesh.position.set(p.x, p.y, p.z);
      mesh.castShadow = false;
      cloud.add(mesh);
    });
    cloud.position.set(x, y, z);
    cloud.scale.set(scale, scale * 0.7, scale);
    root.add(cloud);
    clouds.push(cloud);
    return cloud;
  }

  // Floating ambient clouds around the sky track
  const cloudPositions = [
    { x: -16, y: -2, z: 15, s: 2.2 },
    { x: 18, y: 3, z: 28, s: 2.8 },
    { x: -22, y: 5, z: 60, s: 3.2 },
    { x: 20, y: 8, z: 85, s: 3.0 },
    { x: -24, y: 12, z: 120, s: 3.5 },
    { x: 22, y: 15, z: 150, s: 3.2 },
    { x: 0, y: 18, z: 195, s: 4.0 },
    { x: -18, y: 14, z: 170, s: 2.6 },
    { x: 16, y: -3, z: 0, s: 2.5 },
  ];

  cloudPositions.forEach(cp => {
    createCloud(cp.x, cp.y, cp.z, cp.s);
  });

  // Distant Floating Islands with mini spires / trees
  function createDistantIsland(x: number, y: number, z: number, r: number) {
    const isl = new THREE.Group();
    const rockGeo = new THREE.ConeGeometry(r, r * 1.6, 7);
    rockGeo.rotateX(Math.PI);
    const rockMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.8 });
    const rock = new THREE.Mesh(rockGeo, rockMat);
    rock.position.y = -r * 0.8;
    isl.add(rock);

    const grassGeo = new THREE.CylinderGeometry(r * 0.95, r, 0.4, 7);
    const grassMat = new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.6 });
    const grass = new THREE.Mesh(grassGeo, grassMat);
    isl.add(grass);

    // Mini decorative spire
    const spireGeo = new THREE.ConeGeometry(r * 0.3, r * 1.2, 5);
    const spireMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.3 });
    const spire = new THREE.Mesh(spireGeo, spireMat);
    spire.position.y = r * 0.6;
    isl.add(spire);

    isl.position.set(x, y, z);
    root.add(isl);
  }

  createDistantIsland(-38, 4, 30, 4.5);
  createDistantIsland(42, 10, 90, 5.5);
  createDistantIsland(-45, 16, 140, 6.0);
  createDistantIsland(35, 20, 180, 5.0);

  return {
    root,
    staticPlatforms,
    movingPlatforms,
    rotatingHazards,
    disappearingPlatforms,
    bouncePads,
    coins,
    checkpoints,
    finishTrigger,
    clouds,
    portalGroup,
  };
}
