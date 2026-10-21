/**
 * CRAZY OBBY: SKY SPRINT - Physics & Collision Engine
 * Robust, frame-rate-independent kinematic platforming physics with
 * coyote time, jump buffering, moving platform carry, rotating hazard tests,
 * and reliable collision resolution.
 */

import * as THREE from 'three';
import { soundManager } from '../audio/soundManager';
import { CheckpointData, InputState } from '../types/game';
import { CharacterController } from './character';
import { PHYSICS } from './constants';
import { LevelData } from './level';

export interface PhysicsEvents {
  onCoinCollected: (coinId: number, totalCollected: number) => void;
  onCheckpointReached: (checkpointIndex: number, name: string) => void;
  onHazardHit: () => void;
  onPlayerFell: () => void;
  onFinishReached: () => void;
}

export class PhysicsEngine {
  public position: THREE.Vector3 = new THREE.Vector3(0, 0.5, 0);
  public velocity: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
  public isGrounded: boolean = true;
  public activeCheckpointIndex: number = 0;
  public coinsCollected: number = 0;

  // Jump helpers
  private coyoteTimer: number = 0;
  private jumpBufferTimer: number = 0;

  // Moving platform tracking
  private currentPlatformVelocity: THREE.Vector3 = new THREE.Vector3();
  private standingOnMovingPlatformId: number | null = null;

  // Reusable math objects to prevent garbage collection
  private _playerBox: THREE.Box3 = new THREE.Box3();
  private _testVec: THREE.Vector3 = new THREE.Vector3();
  private _moveDir: THREE.Vector3 = new THREE.Vector3();

  constructor(private level: LevelData, private character: CharacterController, private events: PhysicsEvents) {
    this.resetToCheckpoint(0);
  }

  public resetToCheckpoint(index: number = this.activeCheckpointIndex) {
    const cp = this.level.checkpoints[index] || this.level.checkpoints[0];
    this.position.copy(cp.position);
    this.velocity.set(0, 0, 0);
    this.isGrounded = true;
    this.coyoteTimer = 0.2;
    this.jumpBufferTimer = 0;
    this.standingOnMovingPlatformId = null;
    this.character.group.position.copy(this.position);
    this.character.setRotation(cp.respawnRotation);
  }

  public update(dt: number, input: InputState, cameraYaw: number) {
    // 1. Update Moving Platforms
    this.updateMovingPlatforms(dt);

    // 2. Update Rotating Hazards
    this.updateRotatingHazards(dt);

    // 3. Update Disappearing Platforms
    this.updateDisappearingPlatforms(dt);

    // 4. Update Coins Bob & Spin
    this.updateCoins(dt);

    // 5. Jump Buffering & Coyote Time
    if (this.isGrounded) {
      this.coyoteTimer = PHYSICS.COYOTE_TIME;
    } else {
      this.coyoteTimer = Math.max(0, this.coyoteTimer - dt);
    }

    if (input.jumpJustPressed) {
      this.jumpBufferTimer = PHYSICS.JUMP_BUFFER;
    } else {
      this.jumpBufferTimer = Math.max(0, this.jumpBufferTimer - dt);
    }

    // Check if jump should execute
    if (this.jumpBufferTimer > 0 && this.coyoteTimer > 0) {
      this.executeJump(PHYSICS.JUMP_FORCE);
      this.jumpBufferTimer = 0;
      this.coyoteTimer = 0;
    }

    // 6. Calculate Horizontal Movement from Input
    let moveX = 0;
    let moveZ = 0;

    // Keyboard / D-Pad
    if (input.forward) moveZ += 1;
    if (input.backward) moveZ -= 1;
    if (input.left) moveX -= 1;
    if (input.right) moveX += 1;

    // Virtual Touch Stick
    if (input.virtualStick.active) {
      moveX += input.virtualStick.x;
      moveZ -= input.virtualStick.y; // In screen space, stick Y up means forward
    }

    // Normalize input direction
    const inputLen = Math.hypot(moveX, moveZ);
    if (inputLen > 1) {
      moveX /= inputLen;
      moveZ /= inputLen;
    }

    // Transform move vector relative to camera yaw
    let targetVx = 0;
    let targetVz = 0;

    if (inputLen > 0.05) {
      // Camera forward in XZ plane (from camera toward look target)
      const sinYaw = Math.sin(cameraYaw);
      const cosYaw = Math.cos(cameraYaw);

      const forwardX = -sinYaw;
      const forwardZ = cosYaw;
      const rightX = cosYaw;
      const rightZ = sinYaw;

      targetVx = (rightX * moveX + forwardX * moveZ) * PHYSICS.MOVE_SPEED;
      targetVz = (rightZ * moveX + forwardZ * moveZ) * PHYSICS.MOVE_SPEED;

      // Rotate character to face movement direction
      const facingAngle = Math.atan2(targetVx, targetVz);
      this.character.setRotation(facingAngle);
    }

    // Smooth horizontal acceleration / deceleration
    const accelRate = this.isGrounded ? PHYSICS.ACCELERATION : PHYSICS.ACCELERATION * PHYSICS.AIR_CONTROL_FACTOR;
    this.velocity.x = THREE.MathUtils.damp(this.velocity.x, targetVx, accelRate, dt);
    this.velocity.z = THREE.MathUtils.damp(this.velocity.z, targetVz, accelRate, dt);

    // 7. Apply Gravity
    if (!this.isGrounded) {
      this.velocity.y += PHYSICS.GRAVITY * dt;
      if (this.velocity.y < PHYSICS.MAX_FALL_SPEED) {
        this.velocity.y = PHYSICS.MAX_FALL_SPEED;
      }
    }

    // 8. Integrate Horizontal Motion with Collisions
    const prevY = this.position.y;
    this.position.x += this.velocity.x * dt;
    this.position.z += this.velocity.z * dt;

    // Apply moving platform displacement if standing on one
    if (this.standingOnMovingPlatformId !== null) {
      this.position.x += this.currentPlatformVelocity.x * dt;
      this.position.y += this.currentPlatformVelocity.y * dt;
      this.position.z += this.currentPlatformVelocity.z * dt;
    }

    // Integrate Vertical Motion
    this.position.y += this.velocity.y * dt;

    // 9. Collision Resolution against Platforms
    this.resolvePlatformCollisions(prevY);

    // 10. Check Bounce Pads
    this.checkBouncePads(dt);

    // 11. Check Rotating Hazards
    this.checkRotatingHazards();

    // 12. Check Coins & Checkpoints & Finish
    this.checkTriggers();

    // 13. Fall detection
    if (this.position.y < PHYSICS.FALL_LIMIT_Y) {
      soundManager.playFall();
      this.events.onPlayerFell();
      this.resetToCheckpoint();
      return;
    }

    // 14. Update Character Visuals & Ground Shadow
    const horizontalSpeed = Math.hypot(this.velocity.x, this.velocity.z);
    this.character.group.position.copy(this.position);
    this.character.update(dt, horizontalSpeed, this.isGrounded, this.velocity.y);
    this.character.updateShadow(this.isGrounded ? this.position.y : null, this.position.y);
  }

  private executeJump(force: number) {
    this.velocity.y = force;
    this.isGrounded = false;
    this.standingOnMovingPlatformId = null;
    this.character.triggerJumpStretch();
    soundManager.playJump();
  }

  private resolvePlatformCollisions(prevY: number) {
    const pRadius = PHYSICS.PLAYER_RADIUS;
    const pHeight = PHYSICS.PLAYER_HEIGHT;

    // Update player bounding box
    this._playerBox.min.set(this.position.x - pRadius, this.position.y, this.position.z - pRadius);
    this._playerBox.max.set(this.position.x + pRadius, this.position.y + pHeight, this.position.z + pRadius);

    let foundGround = false;
    let groundY = -999;
    this.standingOnMovingPlatformId = null;

    // Check static platforms
    for (const plat of this.level.staticPlatforms) {
      if (plat.box.intersectsBox(this._playerBox)) {
        // Hazard check
        if (plat.isHazard) {
          soundManager.playHazard();
          this.events.onHazardHit();
          this.resetToCheckpoint();
          return;
        }

        const platTop = plat.box.max.y;
        // Landing condition: was above platform top or close to it and falling/settled
        if (prevY >= platTop - 0.22 && this.velocity.y <= 0) {
          if (platTop > groundY) {
            groundY = platTop;
            foundGround = true;
          }
        } else {
          // Horizontal side push-out
          this.pushOutHorizontal(plat.box);
        }
      }
    }

    // Check moving platforms
    for (const mp of this.level.movingPlatforms) {
      const halfW = mp.size.x / 2;
      const halfH = mp.size.y / 2;
      const halfD = mp.size.z / 2;

      const mpBox = new THREE.Box3(
        new THREE.Vector3(mp.mesh.position.x - halfW, mp.mesh.position.y - halfH, mp.mesh.position.z - halfD),
        new THREE.Vector3(mp.mesh.position.x + halfW, mp.mesh.position.y + halfH, mp.mesh.position.z + halfD)
      );

      if (mpBox.intersectsBox(this._playerBox)) {
        const platTop = mpBox.max.y;
        if (prevY >= platTop - 0.28 && this.velocity.y <= 0) {
          if (platTop > groundY) {
            groundY = platTop;
            foundGround = true;
            this.standingOnMovingPlatformId = mp.id;
            this.currentPlatformVelocity.copy(mp.velocity);
          }
        } else {
          this.pushOutHorizontal(mpBox);
        }
      }
    }

    // Check disappearing platforms
    for (const dp of this.level.disappearingPlatforms) {
      if (!dp.isSolid) continue;

      const halfW = dp.size.x / 2;
      const halfH = dp.size.y / 2;
      const halfD = dp.size.z / 2;

      const dpBox = new THREE.Box3(
        new THREE.Vector3(dp.mesh.position.x - halfW, dp.mesh.position.y - halfH, dp.mesh.position.z - halfD),
        new THREE.Vector3(dp.mesh.position.x + halfW, dp.mesh.position.y + halfH, dp.mesh.position.z + halfD)
      );

      if (dpBox.intersectsBox(this._playerBox)) {
        const platTop = dpBox.max.y;
        if (prevY >= platTop - 0.22 && this.velocity.y <= 0) {
          if (platTop > groundY) {
            groundY = platTop;
            foundGround = true;
          }
        }
      }
    }

    // Apply ground landing
    if (foundGround) {
      if (!this.isGrounded && this.velocity.y < -3.0) {
        soundManager.playLand();
        this.character.triggerSquash();
      }
      this.position.y = groundY;
      this.velocity.y = 0;
      this.isGrounded = true;
    } else {
      this.isGrounded = false;
    }
  }

  private pushOutHorizontal(box: THREE.Box3) {
    const pRadius = PHYSICS.PLAYER_RADIUS;
    const overlapX1 = this.position.x + pRadius - box.min.x;
    const overlapX2 = box.max.x - (this.position.x - pRadius);
    const overlapZ1 = this.position.z + pRadius - box.min.z;
    const overlapZ2 = box.max.z - (this.position.z - pRadius);

    const minOverlapX = Math.min(overlapX1, overlapX2);
    const minOverlapZ = Math.min(overlapZ1, overlapZ2);

    if (minOverlapX < minOverlapZ) {
      if (overlapX1 < overlapX2) {
        this.position.x = box.min.x - pRadius;
      } else {
        this.position.x = box.max.x + pRadius;
      }
      this.velocity.x = 0;
    } else {
      if (overlapZ1 < overlapZ2) {
        this.position.z = box.min.z - pRadius;
      } else {
        this.position.z = box.max.z + pRadius;
      }
      this.velocity.z = 0;
    }
  }

  private updateMovingPlatforms(dt: number) {
    for (const mp of this.level.movingPlatforms) {
      mp.phase += dt * mp.speed;
      const sinVal = Math.sin(mp.phase);
      const cosVal = Math.cos(mp.phase);

      const targetX = mp.basePosition.x + mp.offsetRange.x * sinVal;
      const targetY = mp.basePosition.y + mp.offsetRange.y * sinVal;
      const targetZ = mp.basePosition.z + mp.offsetRange.z * sinVal;

      // Platform velocity = derivative
      mp.velocity.x = mp.offsetRange.x * cosVal * mp.speed;
      mp.velocity.y = mp.offsetRange.y * cosVal * mp.speed;
      mp.velocity.z = mp.offsetRange.z * cosVal * mp.speed;

      mp.mesh.position.set(targetX, targetY, targetZ);
    }
  }

  private updateRotatingHazards(dt: number) {
    for (const r of this.level.rotatingHazards) {
      r.mesh.rotation.y += r.speed * dt;
    }
  }

  private updateDisappearingPlatforms(dt: number) {
    for (const dp of this.level.disappearingPlatforms) {
      dp.timer = (dp.timer + dt) % dp.cycleDuration;
      const mat = dp.mesh.material as THREE.MeshStandardMaterial;

      if (dp.timer < dp.activeDuration) {
        // Solid
        dp.isSolid = true;
        mat.opacity = 0.95;
        mat.color.setHex(0x38bdf8);
      } else if (dp.timer < dp.activeDuration + dp.warningDuration) {
        // Warning blink before vanishing!
        dp.isSolid = true;
        const blink = Math.sin(dp.timer * 18.0) > 0;
        mat.opacity = blink ? 0.8 : 0.3;
        mat.color.setHex(blink ? 0xf97316 : 0xef4444);
      } else {
        // Vanished (Non-solid ghost)
        dp.isSolid = false;
        mat.opacity = 0.12;
        mat.color.setHex(0x64748b);
      }
    }
  }

  private updateCoins(dt: number) {
    for (const coin of this.level.coins) {
      if (coin.mesh && !coin.collected) {
        coin.mesh.rotation.y += dt * 3.0;
        // Subtle vertical bob
        coin.mesh.position.y = coin.position.y + Math.sin(Date.now() * 0.004 + coin.id) * 0.08;
      }
    }
  }

  private checkBouncePads(dt: number) {
    for (const bp of this.level.bouncePads) {
      if (bp.cooldown > 0) {
        bp.cooldown -= dt;
        continue;
      }

      const dx = Math.abs(this.position.x - bp.position.x);
      const dz = Math.abs(this.position.z - bp.position.z);
      const dy = this.position.y - bp.position.y;

      if (dx < bp.size.x / 2 + 0.2 && dz < bp.size.z / 2 + 0.2 && dy >= -0.2 && dy <= 0.6) {
        // Launch player high into the air!
        this.executeJump(bp.bounceForce);
        bp.cooldown = 0.5;
        soundManager.playBounce();
      }
    }
  }

  private checkRotatingHazards() {
    for (const h of this.level.rotatingHazards) {
      const hY = h.center.y;
      if (Math.abs(this.position.y + 0.6 - hY) > 0.8) continue;

      // Distance to hazard center
      const dx = this.position.x - h.center.x;
      const dz = this.position.z - h.center.z;
      const distFromCenter = Math.hypot(dx, dz);

      if (distFromCenter <= h.radius + PHYSICS.PLAYER_RADIUS) {
        // Calculate angle relative to rotating bar
        const rotAngle = h.mesh.rotation.y;
        // Direction of hazard arm 1
        const armDirX = Math.cos(rotAngle);
        const armDirZ = -Math.sin(rotAngle);

        // Distance from player point to infinite line of the arm
        // Cross product 2D
        const perpDist = Math.abs(dx * armDirZ - dz * armDirX);
        if (perpDist < 0.38 + PHYSICS.PLAYER_RADIUS) {
          soundManager.playHazard();
          this.events.onHazardHit();
          this.resetToCheckpoint();
          return;
        }

        // For double cross arm (id === 2), check perpendicular arm too
        if (h.id === 2) {
          const arm2DirX = -armDirZ;
          const arm2DirZ = armDirX;
          const perpDist2 = Math.abs(dx * arm2DirZ - dz * arm2DirX);
          if (perpDist2 < 0.38 + PHYSICS.PLAYER_RADIUS) {
            soundManager.playHazard();
            this.events.onHazardHit();
            this.resetToCheckpoint();
            return;
          }
        }
      }
    }
  }

  private checkTriggers() {
    // 1. Coins
    for (const coin of this.level.coins) {
      if (!coin.collected) {
        const dist = this.position.distanceTo(coin.position);
        if (dist < 1.2) {
          coin.collected = true;
          if (coin.mesh) coin.mesh.visible = false;
          this.coinsCollected++;
          soundManager.playCoin();
          this.events.onCoinCollected(coin.id, this.coinsCollected);
        }
      }
    }

    // 2. Checkpoints
    this.level.checkpoints.forEach((cp: CheckpointData, idx: number) => {
      if (idx > this.activeCheckpointIndex) {
        const dist = Math.hypot(this.position.x - cp.position.x, this.position.z - cp.position.z);
        if (dist < 1.8 && Math.abs(this.position.y - cp.position.y) < 1.5) {
          this.activeCheckpointIndex = idx;
          cp.unlocked = true;
          cp.color = '#10b981';
          soundManager.playCheckpoint();
          this.events.onCheckpointReached(idx, cp.name);
        }
      }
    });

    // 3. Victory Portal
    this._testVec.set(this.position.x, this.position.y + 0.6, this.position.z);
    if (this.level.finishTrigger.containsPoint(this._testVec)) {
      soundManager.playVictory();
      this.events.onFinishReached();
    }
  }
}
