/**
 * CRAZY OBBY: SKY SPRINT 2D - Core Engine
 * Manages 2D HTML5 canvas loop, 20-level progression system, smooth camera follow,
 * particles, keyboard & touch input dispatch, and game status transitions.
 */

import { soundManager } from '../audio/soundManager';
import {
  GameStatus,
  InputState2D,
  LevelRecord,
  Particle2D,
  PlayerStats2D,
  PowerUpType,
} from '../types/game2d';
import { getLevel2D, getTotalLevels } from './level2d';
import { PhysicsEngine2D } from './physics2d';
import { Renderer2D } from './renderer2d';
import { youtubePlayables } from '../utils/youtubePlayables';
import { safeStorage } from '../utils/storage';

export interface Engine2DCallbacks {
  onStatsChange: (stats: PlayerStats2D) => void;
  onStatusChange: (status: GameStatus) => void;
  onCoinPopup: (count: number) => void;
  onCheckpointPopup: (name: string) => void;
  onPowerUpPopup: (type: PowerUpType) => void;
  onLevelComplete: (level: number, stars: number) => void;
}

export class GameEngine2D {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private renderer: Renderer2D;
  public physics: PhysicsEngine2D;

  // Viewport & Camera
  public width: number = 800;
  public height: number = 600;
  private cameraX: number = 0;
  private cameraY: number = 0;

  // Level Progression
  public currentLevelNumber: number = 1;
  public maxUnlockedLevel: number = 1;
  public levelRecords: Record<number, LevelRecord> = {};

  // Input
  public input: InputState2D = {
    left: false,
    right: false,
    jump: false,
    jumpJustPressed: false,
    jumpHeld: false,
    dashJustPressed: false,
    virtualStickX: 0,
  };

  // Particles
  private particles: Particle2D[] = [];

  // Game state
  private status: GameStatus = 'menu';
  private fallCount: number = 0;
  private elapsedTime: number = 0;
  private callbacks: Engine2DCallbacks;

  // Loop control
  private isRunning: boolean = false;
  private animationFrameId: number = 0;
  private lastTime: number = 0;

  constructor(canvas: HTMLCanvasElement, callbacks: Engine2DCallbacks) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: false })!;
    this.callbacks = callbacks;

    // Load progress from safe storage
    const savedMax = safeStorage.getItem('crazy_obby_max_level');
    if (savedMax) this.maxUnlockedLevel = Math.max(1, parseInt(savedMax, 10));

    const savedRecords = safeStorage.getItem('crazy_obby_level_records');
    if (savedRecords) {
      try {
        this.levelRecords = JSON.parse(savedRecords);
      } catch {}
    }

    const lastPlayed = safeStorage.getItem('crazy_obby_last_level');
    if (lastPlayed) {
      const lvl = parseInt(lastPlayed, 10);
      if (lvl >= 1 && lvl <= getTotalLevels()) {
        this.currentLevelNumber = lvl;
      }
    }

    const level = getLevel2D(this.currentLevelNumber);
    this.renderer = new Renderer2D(this.ctx);

    this.physics = new PhysicsEngine2D(level, {
      onCoinCollected: (_coinId, total) => {
        this.emitStats();
        this.callbacks.onCoinPopup(total);
      },
      onPowerUpCollected: (type) => {
        this.emitStats();
        this.callbacks.onPowerUpPopup(type);
      },
      onCheckpointReached: (_idx, name) => {
        this.emitStats();
        this.callbacks.onCheckpointPopup(name);
      },
      onHazardHit: () => {
        this.fallCount++;
        this.emitStats();
      },
      onPlayerFell: () => {
        this.fallCount++;
        this.emitStats();
      },
      onFinishReached: () => {
        if (this.status !== 'victory') {
          this.status = 'victory';

          // Calculate Stars (1 to 3 stars)
          const isAllCoins = this.physics.coinsCollected >= this.physics.level.coins.length;
          const isZeroFalls = this.fallCount === 0;
          const isSpeedy = this.elapsedTime <= this.physics.level.targetTime;

          let stars = 1;
          if (isAllCoins || isZeroFalls || isSpeedy) stars = 2;
          if ((isAllCoins && isZeroFalls) || (isAllCoins && isSpeedy) || (isZeroFalls && isSpeedy)) {
            stars = 3;
          }

          // Save record
          const prev = this.levelRecords[this.currentLevelNumber];
          const bestTime = prev ? Math.min(prev.bestTime, this.elapsedTime) : this.elapsedTime;
          const bestStars = prev ? Math.max(prev.stars, stars) : stars;

          this.levelRecords[this.currentLevelNumber] = {
            completed: true,
            stars: bestStars,
            bestTime,
            coinsFound: Math.max(prev?.coinsFound || 0, this.physics.coinsCollected),
          };

          // Unlock next level
          if (this.currentLevelNumber < getTotalLevels()) {
            this.maxUnlockedLevel = Math.max(this.maxUnlockedLevel, this.currentLevelNumber + 1);
          }

          safeStorage.setItem('crazy_obby_max_level', String(this.maxUnlockedLevel));
          safeStorage.setItem('crazy_obby_level_records', JSON.stringify(this.levelRecords));
          // Mirror save to YouTube Playables Cloud Save
          youtubePlayables.saveCloudData(
            JSON.stringify({
              maxUnlockedLevel: this.maxUnlockedLevel,
              levelRecords: this.levelRecords,
              lastPlayedLevel: this.currentLevelNumber,
            })
          ).catch(() => {});

          this.emitStats();
          this.callbacks.onLevelComplete(this.currentLevelNumber, stars);
          this.callbacks.onStatusChange('victory');
        }
      },
      spawnParticles: (newParticles) => {
        this.particles.push(...newParticles);
        if (this.particles.length > 150) {
          this.particles.splice(0, this.particles.length - 150);
        }
      },
    });

    this.handleResize();
    this.setupEventListeners();
    this.emitStats();

    // Check YouTube Playables Cloud Save
    youtubePlayables.loadCloudData().then((cloudJson) => {
      if (cloudJson) {
        try {
          const parsed = JSON.parse(cloudJson);
          let changed = false;
          if (typeof parsed.maxUnlockedLevel === 'number' && parsed.maxUnlockedLevel > this.maxUnlockedLevel) {
            this.maxUnlockedLevel = parsed.maxUnlockedLevel;
            changed = true;
          }
          if (parsed.levelRecords && typeof parsed.levelRecords === 'object') {
            this.levelRecords = { ...this.levelRecords, ...parsed.levelRecords };
            changed = true;
          }
          if (changed) {
            this.emitStats();
          }
        } catch {}
      }
    }).catch(() => {});

    // Start loop
    this.isRunning = true;
    this.lastTime = performance.now();
    this.loop = this.loop.bind(this);
    this.animationFrameId = requestAnimationFrame(this.loop);

    // Signal to YouTube Playables that the game is interactive and menu is ready
    youtubePlayables.sendGameReady();
  }

  public loadLevel(levelNumber: number) {
    const validLevel = Math.max(1, Math.min(levelNumber, getTotalLevels()));
    this.currentLevelNumber = validLevel;
    safeStorage.setItem('crazy_obby_last_level', String(validLevel));

    const newLevel = getLevel2D(validLevel);
    this.physics.loadLevel(newLevel);
    this.elapsedTime = 0;
    this.fallCount = 0;
    this.particles = [];

    // Center camera on spawn
    this.cameraX = this.physics.x - this.width * 0.35;
    this.cameraY = this.physics.y - this.height * 0.6;

    this.setStatus('playing');
    this.emitStats();
  }

  public nextLevel() {
    if (this.currentLevelNumber < getTotalLevels()) {
      this.loadLevel(this.currentLevelNumber + 1);
    } else {
      // Reached finale! Restart level 20 or loop
      this.loadLevel(1);
    }
  }

  public setStatus(newStatus: GameStatus) {
    this.status = newStatus;
    this.callbacks.onStatusChange(newStatus);
    if (newStatus === 'playing') {
      soundManager.playClick();
    }
  }

  public restartGame() {
    this.loadLevel(this.currentLevelNumber);
  }

  public respawnAtCurrentCheckpoint() {
    this.physics.resetToCheckpoint();
    if (this.status === 'paused') {
      this.setStatus('playing');
    }
  }

  private emitStats() {
    const cp = this.physics.level.checkpoints[this.physics.activeCheckpointIndex];
    const prevRecord = this.levelRecords[this.currentLevelNumber];

    this.callbacks.onStatsChange({
      currentLevel: this.currentLevelNumber,
      totalLevels: getTotalLevels(),
      levelName: this.physics.level.name,
      difficulty: this.physics.level.difficulty,
      coinsCollected: this.physics.coinsCollected,
      totalCoins: this.physics.level.coins.length,
      currentCheckpoint: this.physics.activeCheckpointIndex,
      totalCheckpoints: this.physics.level.checkpoints.length,
      checkpointName: cp ? cp.name : 'Start',
      fallCount: this.fallCount,
      elapsedTime: this.elapsedTime,
      bestTime: prevRecord ? prevRecord.bestTime : null,
      activePowerUp: this.physics.activePowerUp,
      powerUpTimeLeft: this.physics.powerUpTimeLeft,
      dashAvailable: this.physics.dashCooldownTimer <= 0,
    });
  }

  // Keyboard handlers
  private handleKeyDown = (e: KeyboardEvent) => {
    if (e.repeat) return;

    switch (e.code) {
      case 'KeyA':
      case 'ArrowLeft':
        this.input.left = true;
        break;
      case 'KeyD':
      case 'ArrowRight':
        this.input.right = true;
        break;
      case 'Space':
      case 'KeyW':
      case 'ArrowUp':
        this.input.jump = true;
        this.input.jumpJustPressed = true;
        this.input.jumpHeld = true;
        break;
      case 'ShiftLeft':
      case 'ShiftRight':
      case 'KeyJ':
        this.input.dashJustPressed = true;
        break;
      case 'KeyR':
        this.respawnAtCurrentCheckpoint();
        break;
      case 'Escape':
      case 'KeyP':
        if (this.status === 'playing') {
          this.setStatus('paused');
        } else if (this.status === 'paused') {
          this.setStatus('playing');
        }
        break;
    }
  };

  private handleKeyUp = (e: KeyboardEvent) => {
    switch (e.code) {
      case 'KeyA':
      case 'ArrowLeft':
        this.input.left = false;
        break;
      case 'KeyD':
      case 'ArrowRight':
        this.input.right = false;
        break;
      case 'Space':
      case 'KeyW':
      case 'ArrowUp':
        this.input.jump = false;
        this.input.jumpHeld = false;
        break;
    }
  };

  private handleWindowBlur = () => {
    this.input.left = false;
    this.input.right = false;
    this.input.jump = false;
    this.input.jumpHeld = false;
    this.input.virtualStickX = 0;
  };

  public handleResize = () => {
    const parent = this.canvas.parentElement;
    if (!parent) return;

    const w = parent.clientWidth;
    const h = parent.clientHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    this.width = w;
    this.height = h;

    this.canvas.width = Math.floor(w * dpr);
    this.canvas.height = Math.floor(h * dpr);
    this.canvas.style.width = `${w}px`;
    this.canvas.style.height = `${h}px`;

    this.ctx.resetTransform();
    this.ctx.scale(dpr, dpr);
  };

  private setupEventListeners() {
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
    window.addEventListener('blur', this.handleWindowBlur);
    window.addEventListener('resize', this.handleResize);
  }

  // Animation Loop
  private loop(timestamp: number) {
    if (!this.isRunning) return;

    const rawDt = (timestamp - this.lastTime) / 1000;
    this.lastTime = timestamp;
    const dt = Math.min(rawDt, 0.05);

    if (this.status === 'playing') {
      this.elapsedTime += dt;

      // Update Physics
      this.physics.update(dt, this.input);

      // Smooth Camera Follow
      const targetCamX = this.physics.x - this.width * 0.35;
      const targetCamY = this.physics.y - this.height * 0.6;
      this.cameraX += (targetCamX - this.cameraX) * Math.min(1.0, dt * 8.0);
      this.cameraY += (targetCamY - this.cameraY) * Math.min(1.0, dt * 6.0);

      // Update Particles
      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.life -= dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        if (p.life <= 0) {
          this.particles.splice(i, 1);
        }
      }

      this.emitStats();
    } else if (this.status === 'menu') {
      // Gentle camera pan on title screen
      this.cameraX = Math.sin(timestamp * 0.0008) * 120 + 100;
      this.cameraY = 280;
    }

    // Reset single-frame edge triggers
    this.input.jumpJustPressed = false;
    this.input.dashJustPressed = false;

    // Render 2D Frame
    this.renderer.render(
      this.physics,
      this.physics.level,
      this.particles,
      this.cameraX,
      this.cameraY,
      this.width,
      this.height,
      timestamp * 0.001
    );

    // Notify YouTube Playables on the very first frame rendered
    youtubePlayables.sendFirstFrameReady();

    this.animationFrameId = requestAnimationFrame(this.loop);
  }

  public destroy() {
    this.isRunning = false;
    cancelAnimationFrame(this.animationFrameId);

    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
    window.removeEventListener('blur', this.handleWindowBlur);
    window.removeEventListener('resize', this.handleResize);
  }
}
