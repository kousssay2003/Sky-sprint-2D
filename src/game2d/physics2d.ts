/**
 * CRAZY OBBY: SKY SPRINT 2D - Physics & Collision Engine
 * Kinematic 2D platforming with coyote time, jump buffering, double jumping,
 * dash burst, parachute glide, moving platform carry, and hazard detection.
 */

import { soundManager } from '../audio/soundManager';
import {
  InputState2D,
  LevelData2D,
  MovingPlatform2D,
  Particle2D,
  Platform2D,
  PowerUpType,
} from '../types/game2d';
import { PHYSICS_2D } from './constants2d';

export interface Physics2DEvents {
  onCoinCollected: (coinId: number, total: number) => void;
  onPowerUpCollected: (type: PowerUpType) => void;
  onCheckpointReached: (index: number, name: string) => void;
  onHazardHit: () => void;
  onPlayerFell: () => void;
  onFinishReached: () => void;
  spawnParticles: (particles: Particle2D[]) => void;
}

export class PhysicsEngine2D {
  // Player Kinematics
  public x: number = 0;
  public y: number = 0;
  public vx: number = 0;
  public vy: number = 0;
  public width: number = PHYSICS_2D.PLAYER_WIDTH;
  public height: number = PHYSICS_2D.PLAYER_HEIGHT;

  public isGrounded: boolean = false;
  public facingRight: boolean = true;
  public activeCheckpointIndex: number = 0;
  public coinsCollected: number = 0;

  // Jump helpers
  private coyoteTimer: number = 0;
  private jumpBufferTimer: number = 0;
  private doubleJumpAvailable: boolean = true;

  // Dash mechanics
  public isDashing: boolean = false;
  private dashTimer: number = 0;
  public dashCooldownTimer: number = 0;
  private dashDirection: number = 1;

  // Parachute glide mechanics
  public isParachuting: boolean = false;
  private hasParachutePowerUp: boolean = false;

  // Power-up state
  public activePowerUp: PowerUpType | null = null;
  public powerUpTimeLeft: number = 0;

  // Moving platform ride
  private standingPlatform: MovingPlatform2D | null = null;

  constructor(
    public level: LevelData2D,
    private events: Physics2DEvents
  ) {
    this.resetToCheckpoint(0);
  }

  public loadLevel(newLevel: LevelData2D) {
    this.level = newLevel;
    this.coinsCollected = 0;
    this.activeCheckpointIndex = 0;
    this.activePowerUp = null;
    this.powerUpTimeLeft = 0;
    this.hasParachutePowerUp = false;
    this.resetToCheckpoint(0);
  }

  public resetToCheckpoint(index: number = this.activeCheckpointIndex) {
    const cp = this.level.checkpoints[index] || this.level.checkpoints[0];
    if (cp) {
      this.x = cp.x;
      this.y = cp.y - this.height;
    } else {
      this.x = this.level.spawnPoint.x;
      this.y = this.level.spawnPoint.y;
    }
    this.vx = 0;
    this.vy = 0;
    this.isGrounded = true;
    this.isDashing = false;
    this.isParachuting = false;
    this.coyoteTimer = 0.2;
    this.jumpBufferTimer = 0;
    this.doubleJumpAvailable = true;
    this.standingPlatform = null;
  }

  public update(dt: number, input: InputState2D) {
    // 1. Update Power-Up Timer
    if (this.powerUpTimeLeft > 0) {
      this.powerUpTimeLeft -= dt;
      if (this.powerUpTimeLeft <= 0) {
        this.activePowerUp = null;
        this.hasParachutePowerUp = false;
      }
    }

    // 2. Update Moving Platforms
    this.updateMovingPlatforms(dt);

    // 3. Update Rotating Hazards
    for (const h of this.level.hazards) {
      if (h.rotationSpeed && h.angle !== undefined) {
        h.angle += h.rotationSpeed * dt;
      }
    }

    // 4. Update Crumbling Blocks
    this.updateCrumblingBlocks(dt);

    // 5. Update Dash Timers & Cooldown
    if (this.dashCooldownTimer > 0) {
      this.dashCooldownTimer -= dt;
    }

    if (this.isDashing) {
      this.dashTimer -= dt;
      if (this.dashTimer <= 0) {
        this.isDashing = false;
      } else {
        // Maintain fixed dash velocity while dashing
        this.vx = this.dashDirection * PHYSICS_2D.DASH_SPEED;
        this.vy = 0;
        this.emitDashTrail();
      }
    }

    // 6. Handle Dash Input
    if (input.dashJustPressed && this.dashCooldownTimer <= 0) {
      this.executeDash();
    }

    // 7. Ground / Airborne Jump Logic
    if (this.isGrounded) {
      this.coyoteTimer = PHYSICS_2D.COYOTE_TIME;
      this.doubleJumpAvailable = true;
      this.isParachuting = false;
    } else {
      this.coyoteTimer = Math.max(0, this.coyoteTimer - dt);
    }

    if (input.jumpJustPressed) {
      this.jumpBufferTimer = PHYSICS_2D.JUMP_BUFFER;
    } else {
      this.jumpBufferTimer = Math.max(0, this.jumpBufferTimer - dt);
    }

    // First Jump (from ground or coyote time)
    if (this.jumpBufferTimer > 0 && this.coyoteTimer > 0 && !this.isDashing) {
      this.vy = -PHYSICS_2D.JUMP_FORCE;
      this.isGrounded = false;
      this.coyoteTimer = 0;
      this.jumpBufferTimer = 0;
      this.standingPlatform = null;
      soundManager.playJump();
    }
    // Double Jump
    else if (this.jumpBufferTimer > 0 && this.doubleJumpAvailable && !this.isGrounded && !this.isDashing) {
      this.vy = -PHYSICS_2D.DOUBLE_JUMP_FORCE;
      this.doubleJumpAvailable = false;
      this.jumpBufferTimer = 0;
      soundManager.playDoubleJump();
      this.emitJumpPuff();
    }

    // 8. Parachute Glide
    // Activated if falling and jump is held with parachute unlocked
    if (!this.isGrounded && this.vy > 50 && input.jumpHeld && (this.hasParachutePowerUp || this.activePowerUp === 'parachute')) {
      this.isParachuting = true;
      if (this.vy > PHYSICS_2D.PARACHUTE_MAX_FALL_SPEED) {
        this.vy = THREE_LERP(this.vy, PHYSICS_2D.PARACHUTE_MAX_FALL_SPEED, 8.0 * dt);
      }
    } else {
      this.isParachuting = false;
    }

    // 9. Horizontal Movement Calculation
    if (!this.isDashing) {
      let moveDir = 0;
      if (input.left) moveDir -= 1;
      if (input.right) moveDir += 1;
      if (Math.abs(input.virtualStickX) > 0.15) {
        moveDir = input.virtualStickX;
      }

      // Determine max speed based on power-up
      let maxSpeed = PHYSICS_2D.MOVE_SPEED;
      if (this.activePowerUp === 'speed_sneakers') {
        maxSpeed *= PHYSICS_2D.SPEED_SNEAKERS_MULT;
      }

      const targetVx = moveDir * maxSpeed;

      if (Math.abs(moveDir) > 0.1) {
        this.facingRight = moveDir > 0;
        const accel = this.isGrounded ? PHYSICS_2D.ACCELERATION : PHYSICS_2D.AIR_ACCELERATION;
        this.vx = THREE_LERP(this.vx, targetVx, accel * dt / maxSpeed);
      } else {
        // Friction / Deceleration
        const fric = this.isGrounded ? PHYSICS_2D.FRICTION : PHYSICS_2D.FRICTION * 0.4;
        if (Math.abs(this.vx) > fric * dt) {
          this.vx -= Math.sign(this.vx) * fric * dt;
        } else {
          this.vx = 0;
        }
      }

      // 10. Apply Gravity
      if (!this.isGrounded) {
        const grav = this.isParachuting ? PHYSICS_2D.GRAVITY * 0.35 : PHYSICS_2D.GRAVITY;
        this.vy += grav * dt;
        const maxFall = this.isParachuting ? PHYSICS_2D.PARACHUTE_MAX_FALL_SPEED : PHYSICS_2D.MAX_FALL_SPEED;
        if (this.vy > maxFall) {
          this.vy = maxFall;
        }
      }
    }

    // 11. Integrate Positions with Moving Platform offset
    const prevY = this.y;

    if (this.standingPlatform) {
      this.x += this.standingPlatform.vx * dt;
      this.y += this.standingPlatform.vy * dt;
    }

    this.x += this.vx * dt;
    this.resolveHorizontalCollisions();

    this.y += this.vy * dt;
    this.resolveVerticalCollisions(prevY);

    // 12. Check Bounce Springs
    this.checkBounceSprings();

    // 13. Check Hazards
    this.checkHazards();

    // 14. Check Coins, Power-Ups, Checkpoints, Portal
    this.checkTriggers();

    // 15. Check Fall Out of Bounds
    if (this.y > PHYSICS_2D.DEATH_Y) {
      soundManager.playFall();
      this.events.onPlayerFell();
      this.resetToCheckpoint();
    }
  }

  private executeDash() {
    this.isDashing = true;
    this.dashTimer = PHYSICS_2D.DASH_DURATION;
    this.dashCooldownTimer = PHYSICS_2D.DASH_COOLDOWN;
    this.dashDirection = this.facingRight ? 1 : -1;
    this.vx = this.dashDirection * PHYSICS_2D.DASH_SPEED;
    this.vy = 0;
    soundManager.playDash();
    this.emitDashShockwave();
  }

  private resolveHorizontalCollisions() {
    const pLeft = this.x;
    const pRight = this.x + this.width;
    const pTop = this.y;
    const pBottom = this.y + this.height;

    for (const plat of this.level.platforms) {
      if (plat.isBroken) continue;
      // Check overlap
      if (
        pRight > plat.x &&
        pLeft < plat.x + plat.width &&
        pBottom > plat.y + 6 && // must be below top lip
        pTop < plat.y + plat.height
      ) {
        if (this.vx > 0) {
          this.x = plat.x - this.width;
          this.vx = 0;
        } else if (this.vx < 0) {
          this.x = plat.x + plat.width;
          this.vx = 0;
        }
      }
    }
  }

  private resolveVerticalCollisions(prevY: number) {
    const pLeft = this.x;
    const pRight = this.x + this.width;
    const pBottom = this.y + this.height;

    let onGround = false;
    this.standingPlatform = null;

    // Check Static & Crumbling Platforms
    for (const plat of this.level.platforms) {
      if (plat.isBroken) continue;

      if (pRight > plat.x + 4 && pLeft < plat.x + plat.width - 4) {
        // Landing condition: falling and was above or close to platform top
        if (prevY + this.height <= plat.y + 12 && pBottom >= plat.y && this.vy >= 0) {
          this.y = plat.y - this.height;
          this.vy = 0;
          onGround = true;

          // Trigger crumbling if crumbling platform
          if (plat.type === 'crumbling' && !plat.isCrumbling) {
            plat.isCrumbling = true;
            plat.crumbleTimer = 0.55; // breaks after 0.55s
          }
        }
      }
    }

    // Check Moving Platforms
    for (const mp of this.level.movingPlatforms) {
      if (pRight > mp.x + 4 && pLeft < mp.x + mp.width - 4) {
        if (prevY + this.height <= mp.y + 16 && pBottom >= mp.y && this.vy >= 0) {
          this.y = mp.y - this.height;
          this.vy = 0;
          onGround = true;
          this.standingPlatform = mp;
        }
      }
    }

    if (onGround) {
      if (!this.isGrounded && this.vy > 100) {
        soundManager.playLand();
      }
      this.isGrounded = true;
    } else {
      this.isGrounded = false;
    }
  }

  private updateMovingPlatforms(dt: number) {
    for (const mp of this.level.movingPlatforms) {
      const totalDx = mp.endX - mp.startX;
      const totalDy = mp.endY - mp.startY;
      const totalDist = Math.hypot(totalDx, totalDy);

      if (totalDist > 0) {
        mp.progress += (mp.speed * dt * mp.direction) / totalDist;
        if (mp.progress >= 1) {
          mp.progress = 1;
          mp.direction = -1;
        } else if (mp.progress <= 0) {
          mp.progress = 0;
          mp.direction = 1;
        }

        const newX = mp.startX + totalDx * mp.progress;
        const newY = mp.startY + totalDy * mp.progress;

        mp.vx = (newX - mp.x) / dt;
        mp.vy = (newY - mp.y) / dt;

        mp.x = newX;
        mp.y = newY;
      }
    }
  }

  private updateCrumblingBlocks(dt: number) {
    for (const p of this.level.platforms) {
      if (p.isCrumbling && p.crumbleTimer !== undefined && !p.isBroken) {
        p.crumbleTimer -= dt;
        if (p.crumbleTimer <= 0) {
          p.isBroken = true;
          // Spawn crumbling cloud smoke particles
          this.emitCrumbleDust(p.x + p.width / 2, p.y + p.height / 2);
        }
      }
    }
  }

  private checkBounceSprings() {
    const pCenter = this.x + this.width / 2;
    const pBottom = this.y + this.height;

    for (const s of this.level.bounceSprings) {
      if (
        pCenter >= s.x &&
        pCenter <= s.x + s.width &&
        pBottom >= s.y - 8 &&
        pBottom <= s.y + s.height + 8
      ) {
        this.vy = -s.force;
        this.isGrounded = false;
        s.compressTime = 0.3; // visual bounce squash
        soundManager.playBounce();
        this.emitBounceSparkles(s.x + s.width / 2, s.y);
      }
      if (s.compressTime > 0) {
        s.compressTime -= 0.016;
      }
    }
  }

  private checkHazards() {
    const pBox = {
      left: this.x + 4,
      right: this.x + this.width - 4,
      top: this.y + 4,
      bottom: this.y + this.height - 2,
    };

    for (const h of this.level.hazards) {
      if (h.type === 'saw' && h.radius) {
        // Circle-box intersection
        const closestX = Math.max(pBox.left, Math.min(h.x, pBox.right));
        const closestY = Math.max(pBox.top, Math.min(h.y, pBox.bottom));
        const dist = Math.hypot(h.x - closestX, h.y - closestY);

        if (dist < h.radius * 0.85) {
          soundManager.playHazard();
          this.events.onHazardHit();
          this.resetToCheckpoint();
          return;
        }
      } else if (h.type === 'spike' && h.width && h.height) {
        if (
          pBox.right > h.x &&
          pBox.left < h.x + h.width &&
          pBox.bottom > h.y &&
          pBox.top < h.y + h.height
        ) {
          soundManager.playHazard();
          this.events.onHazardHit();
          this.resetToCheckpoint();
          return;
        }
      }
    }
  }

  private checkTriggers() {
    const pCenterX = this.x + this.width / 2;
    const pCenterY = this.y + this.height / 2;

    // Coins
    for (const coin of this.level.coins) {
      if (!coin.collected) {
        const dist = Math.hypot(pCenterX - coin.x, pCenterY - coin.y);
        if (dist < coin.radius + 24) {
          coin.collected = true;
          this.coinsCollected++;
          soundManager.playCoin();
          this.events.onCoinCollected(coin.id, this.coinsCollected);
          this.emitCoinStars(coin.x, coin.y);
        }
      }
    }

    // Power-Up Items
    for (const item of this.level.powerUpItems) {
      if (!item.collected) {
        const dist = Math.hypot(pCenterX - item.x, pCenterY - item.y);
        if (dist < item.radius + 24) {
          item.collected = true;
          this.activePowerUp = item.type;
          this.powerUpTimeLeft = 12.0; // 12 seconds duration
          if (item.type === 'parachute') {
            this.hasParachutePowerUp = true;
          }
          soundManager.playPowerUp();
          this.events.onPowerUpCollected(item.type);
          this.emitPowerUpStars(item.x, item.y, item.type);
        }
      }
    }

    // Checkpoints
    this.level.checkpoints.forEach((cp, idx) => {
      if (idx > this.activeCheckpointIndex) {
        const dist = Math.hypot(pCenterX - cp.x, pCenterY - cp.y);
        if (dist < 70) {
          this.activeCheckpointIndex = idx;
          cp.unlocked = true;
          soundManager.playCheckpoint();
          this.events.onCheckpointReached(idx, cp.name);
          this.emitCheckpointGlow(cp.x, cp.y);
        }
      }
    });

    // Victory Portal
    const portal = this.level.portal;
    if (
      pCenterX >= portal.x &&
      pCenterX <= portal.x + portal.width &&
      pCenterY >= portal.y &&
      pCenterY <= portal.y + portal.height
    ) {
      soundManager.playVictory();
      this.events.onFinishReached();
    }
  }

  // Particle emission helpers
  private emitCoinStars(x: number, y: number) {
    const parts: Particle2D[] = [];
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI * 2) / 8;
      const speed = 120 + Math.random() * 80;
      parts.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0.45,
        maxLife: 0.45,
        size: 5 + Math.random() * 3,
        color: '#facc15',
        shape: 'star',
      });
    }
    this.events.spawnParticles(parts);
  }

  private emitPowerUpStars(x: number, y: number, type: PowerUpType) {
    const parts: Particle2D[] = [];
    const color = type === 'speed_sneakers' ? '#f59e0b' : type === 'dash' ? '#38bdf8' : '#ec4899';
    for (let i = 0; i < 14; i++) {
      const angle = (i * Math.PI * 2) / 14;
      const speed = 140 + Math.random() * 100;
      parts.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0.6,
        maxLife: 0.6,
        size: 6 + Math.random() * 4,
        color,
        shape: 'spark',
      });
    }
    this.events.spawnParticles(parts);
  }

  private emitCheckpointGlow(x: number, y: number) {
    const parts: Particle2D[] = [];
    for (let i = 0; i < 16; i++) {
      const angle = (i * Math.PI * 2) / 16;
      const speed = 80 + Math.random() * 80;
      parts.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 60,
        life: 0.7,
        maxLife: 0.7,
        size: 7,
        color: '#10b981',
        shape: 'star',
      });
    }
    this.events.spawnParticles(parts);
  }

  private emitBounceSparkles(x: number, y: number) {
    const parts: Particle2D[] = [];
    for (let i = 0; i < 10; i++) {
      parts.push({
        x: x + (Math.random() - 0.5) * 40,
        y,
        vx: (Math.random() - 0.5) * 120,
        vy: -150 - Math.random() * 120,
        life: 0.4,
        maxLife: 0.4,
        size: 5,
        color: '#ec4899',
        shape: 'spark',
      });
    }
    this.events.spawnParticles(parts);
  }

  private emitDashTrail() {
    this.events.spawnParticles([
      {
        x: this.x + (this.facingRight ? 0 : this.width),
        y: this.y + Math.random() * this.height,
        vx: -this.dashDirection * 150,
        vy: (Math.random() - 0.5) * 60,
        life: 0.25,
        maxLife: 0.25,
        size: 8,
        color: '#38bdf8',
        shape: 'circle',
      },
    ]);
  }

  private emitDashShockwave() {
    const parts: Particle2D[] = [];
    for (let i = 0; i < 12; i++) {
      const angle = (i * Math.PI * 2) / 12;
      parts.push({
        x: this.x + this.width / 2,
        y: this.y + this.height / 2,
        vx: Math.cos(angle) * 220,
        vy: Math.sin(angle) * 220,
        life: 0.35,
        maxLife: 0.35,
        size: 7,
        color: '#67e8f9',
        shape: 'circle',
      });
    }
    this.events.spawnParticles(parts);
  }

  private emitJumpPuff() {
    const parts: Particle2D[] = [];
    for (let i = 0; i < 6; i++) {
      parts.push({
        x: this.x + this.width / 2,
        y: this.y + this.height,
        vx: (Math.random() - 0.5) * 120,
        vy: 40 + Math.random() * 40,
        life: 0.3,
        maxLife: 0.3,
        size: 6,
        color: '#ffffff',
        shape: 'smoke',
      });
    }
    this.events.spawnParticles(parts);
  }

  private emitCrumbleDust(x: number, y: number) {
    const parts: Particle2D[] = [];
    for (let i = 0; i < 12; i++) {
      parts.push({
        x: x + (Math.random() - 0.5) * 80,
        y: y + (Math.random() - 0.5) * 20,
        vx: (Math.random() - 0.5) * 100,
        vy: 60 + Math.random() * 100,
        life: 0.5,
        maxLife: 0.5,
        size: 8,
        color: '#e2e8f0',
        shape: 'smoke',
      });
    }
    this.events.spawnParticles(parts);
  }
}

function THREE_LERP(current: number, target: number, t: number): number {
  return current + (target - current) * Math.min(1.0, t);
}
