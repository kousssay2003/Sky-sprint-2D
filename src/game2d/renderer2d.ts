/**
 * CRAZY OBBY: SKY SPRINT 2D - Cartoon Vector Renderer
 * High-performance, colorful 2D vector drawing for parallax sky layers,
 * floating grass islands, animated cartoon character, hazard saws,
 * power-ups, bounce springs, and stargate portal.
 */

import {
  BounceSpring2D,
  Checkpoint2D,
  Coin2D,
  Hazard2D,
  LevelData2D,
  MovingPlatform2D,
  Particle2D,
  Platform2D,
  PowerUpItem2D,
} from '../types/game2d';
import { COLORS_2D } from './constants2d';
import { PhysicsEngine2D } from './physics2d';

export class Renderer2D {
  private runCycle: number = 0;

  constructor(private ctx: CanvasRenderingContext2D) {}

  public render(
    physics: PhysicsEngine2D,
    level: LevelData2D,
    particles: Particle2D[],
    cameraX: number,
    cameraY: number,
    viewW: number,
    viewH: number,
    time: number
  ) {
    const ctx = this.ctx;

    // Clear Screen
    ctx.clearRect(0, 0, viewW, viewH);

    // 1. Draw Multi-Layer Parallax Background
    this.drawParallaxSky(cameraX, cameraY, viewW, viewH, time);

    // Save world transform matrix
    ctx.save();
    // Translate by camera
    ctx.translate(-cameraX, -cameraY);

    // 2. Draw Static Platforms & Crumbling Blocks
    for (const plat of level.platforms) {
      if (this.isInView(plat.x, plat.y, plat.width, plat.height, cameraX, cameraY, viewW, viewH)) {
        this.drawPlatform(plat, time);
      }
    }

    // 3. Draw Moving Platforms
    for (const mp of level.movingPlatforms) {
      if (this.isInView(mp.x, mp.y, mp.width, mp.height, cameraX, cameraY, viewW, viewH)) {
        this.drawMovingPlatform(mp, time);
      }
    }

    // 4. Draw Bounce Springs
    for (const spring of level.bounceSprings) {
      this.drawBounceSpring(spring);
    }

    // 5. Draw Hazards (Saws & Spikes)
    for (const hazard of level.hazards) {
      this.drawHazard(hazard);
    }

    // 6. Draw Checkpoint Flags
    for (const cp of level.checkpoints) {
      this.drawCheckpoint(cp, time);
    }

    // 7. Draw Golden Coins
    for (const coin of level.coins) {
      if (!coin.collected && this.isInView(coin.x - 20, coin.y - 20, 40, 40, cameraX, cameraY, viewW, viewH)) {
        this.drawCoin(coin, time);
      }
    }

    // 8. Draw Power-Up Items
    for (const item of level.powerUpItems) {
      if (!item.collected && this.isInView(item.x - 24, item.y - 24, 48, 48, cameraX, cameraY, viewW, viewH)) {
        this.drawPowerUpItem(item, time);
      }
    }

    // 9. Draw Victory Stargate Portal
    this.drawPortal(level.portal, time);

    // 10. Draw Particles
    this.drawParticles(particles);

    // 11. Draw Player Character
    this.drawPlayer(physics, time);

    // Restore world transform
    ctx.restore();
  }

  private isInView(
    x: number,
    y: number,
    w: number,
    h: number,
    camX: number,
    camY: number,
    viewW: number,
    viewH: number
  ): boolean {
    return x + w >= camX - 100 && x <= camX + viewW + 100 && y + h >= camY - 100 && y <= camY + viewH + 100;
  }

  // ==========================================
  // PARALLAX BACKGROUND
  // ==========================================
  private drawParallaxSky(camX: number, camY: number, w: number, h: number, time: number) {
    const ctx = this.ctx;

    // Base Sky Gradient
    const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
    skyGrad.addColorStop(0, COLORS_2D.SKY_TOP);
    skyGrad.addColorStop(0.6, COLORS_2D.SKY_MID);
    skyGrad.addColorStop(1, COLORS_2D.SKY_BOTTOM);
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, w, h);

    // Sun with warm halo
    ctx.fillStyle = 'rgba(254, 240, 138, 0.35)';
    ctx.beginPath();
    ctx.arc(w * 0.8, h * 0.25, 120, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = COLORS_2D.SUN_COLOR;
    ctx.beginPath();
    ctx.arc(w * 0.8, h * 0.25, 45, 0, Math.PI * 2);
    ctx.fill();

    // Layer 1: Distant Mountain Silhouettes & Floating Castles (Parallax 0.12)
    ctx.fillStyle = 'rgba(125, 211, 252, 0.5)';
    const p1 = -camX * 0.12;
    for (let i = -1; i < 6; i++) {
      const mx = p1 + i * 400;
      ctx.beginPath();
      ctx.moveTo(mx, h);
      ctx.lineTo(mx + 200, h - 220);
      ctx.lineTo(mx + 400, h);
      ctx.fill();

      // Mini floating island in distance
      ctx.beginPath();
      ctx.ellipse(mx + 150, h - 340, 60, 20, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Layer 2: Mid-ground Cartoon Fluffy Clouds (Parallax 0.28)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
    const p2 = -camX * 0.28;
    for (let i = -1; i < 7; i++) {
      const cx = p2 + i * 350 + Math.sin(i * 3 + time * 0.2) * 20;
      const cy = (i % 3) * 110 + 120;
      this.drawCloud(cx, cy, 1.0);
    }

    // Layer 3: Near floating soft cloud pillows (Parallax 0.45)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    const p3 = -camX * 0.45;
    for (let i = -1; i < 5; i++) {
      const cx = p3 + i * 500;
      const cy = (i % 2) * 160 + 260;
      this.drawCloud(cx, cy, 1.4);
    }
  }

  private drawCloud(x: number, y: number, scale: number) {
    const ctx = this.ctx;
    ctx.beginPath();
    ctx.arc(x, y, 32 * scale, 0, Math.PI * 2);
    ctx.arc(x + 28 * scale, y - 10 * scale, 26 * scale, 0, Math.PI * 2);
    ctx.arc(x + 56 * scale, y, 30 * scale, 0, Math.PI * 2);
    ctx.arc(x + 28 * scale, y + 10 * scale, 24 * scale, 0, Math.PI * 2);
    ctx.fill();
  }

  // ==========================================
  // PLATFORMS
  // ==========================================
  private drawPlatform(p: Platform2D, time: number) {
    const ctx = this.ctx;
    if (p.isBroken) return;

    let drawX = p.x;
    let drawY = p.y;

    // Crumbling cloud animation
    if (p.type === 'crumbling') {
      if (p.isCrumbling && p.crumbleTimer !== undefined) {
        // Shake wobble!
        drawX += (Math.random() - 0.5) * 6;
        drawY += (Math.random() - 0.5) * 4;
      }

      // Draw as a puffy crumbling cloud
      ctx.fillStyle = p.isCrumbling ? '#fed7aa' : '#ffffff';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3;

      const r = p.height / 2;
      ctx.beginPath();
      ctx.roundRect(drawX, drawY, p.width, p.height, r);
      ctx.fill();
      ctx.stroke();

      // Cloud bubble tops
      ctx.beginPath();
      ctx.arc(drawX + p.width * 0.3, drawY, 14, Math.PI, 0);
      ctx.arc(drawX + p.width * 0.7, drawY, 16, Math.PI, 0);
      ctx.fill();
      ctx.stroke();
      return;
    }

    // Solid Grass-Topped Island
    const baseColor = p.color || COLORS_2D.PLATFORM_BODY;

    // Island body
    ctx.fillStyle = baseColor;
    ctx.strokeStyle = COLORS_2D.PLATFORM_BORDER;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(drawX, drawY, p.width, p.height, [12, 12, 16, 16]);
    ctx.fill();
    ctx.stroke();

    // Grass Top Cap
    ctx.fillStyle = COLORS_2D.GRASS_TOP;
    ctx.beginPath();
    ctx.roundRect(drawX, drawY, p.width, 14, [10, 10, 0, 0]);
    ctx.fill();

    // Grass fringe blades hanging down
    ctx.fillStyle = COLORS_2D.GRASS_TOP;
    const teeth = Math.floor(p.width / 16);
    for (let i = 0; i < teeth; i++) {
      const gx = drawX + 8 + i * 16;
      ctx.beginPath();
      ctx.moveTo(gx - 6, drawY + 14);
      ctx.lineTo(gx, drawY + 22);
      ctx.lineTo(gx + 6, drawY + 14);
      ctx.fill();
    }

    // Bevel highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.fillRect(drawX + 8, drawY + 2, p.width - 16, 3);
  }

  private drawMovingPlatform(mp: MovingPlatform2D, time: number) {
    const ctx = this.ctx;
    const color = mp.color || '#0ea5e9';

    // Platform Body
    ctx.fillStyle = color;
    ctx.strokeStyle = '#1e1b4b';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(mp.x, mp.y, mp.width, mp.height, 10);
    ctx.fill();
    ctx.stroke();

    // Top Stripe
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(mp.x + 6, mp.y + 3, mp.width - 12, 4);

    // Glowing side thruster lights
    const glow = Math.sin(time * 8) > 0 ? '#38bdf8' : '#818cf8';
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(mp.x + 12, mp.y + mp.height / 2, 4, 0, Math.PI * 2);
    ctx.arc(mp.x + mp.width - 12, mp.y + mp.height / 2, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  private drawBounceSpring(spring: BounceSpring2D) {
    const ctx = this.ctx;
    const isSquashed = spring.compressTime > 0;
    const currentH = isSquashed ? spring.height * 0.45 : spring.height;
    const currentY = isSquashed ? spring.y + spring.height * 0.55 : spring.y;

    // Metal Base
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(spring.x, spring.y + spring.height - 6, spring.width, 6);

    // Zig-Zag Spring Coil
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 4;
    ctx.beginPath();
    const midX = spring.x + spring.width / 2;
    ctx.moveTo(midX, spring.y + spring.height - 6);
    ctx.lineTo(midX - 10, currentY + currentH * 0.6);
    ctx.lineTo(midX + 10, currentY + currentH * 0.3);
    ctx.lineTo(midX, currentY + 6);
    ctx.stroke();

    // Pink Rubber Launch Pad
    ctx.fillStyle = COLORS_2D.SPRING_PINK;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.roundRect(spring.x, currentY, spring.width, 10, 4);
    ctx.fill();
    ctx.stroke();

    // Upward arrow
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(midX, currentY + 2);
    ctx.lineTo(midX - 5, currentY + 7);
    ctx.lineTo(midX + 5, currentY + 7);
    ctx.fill();
  }

  // ==========================================
  // HAZARDS
  // ==========================================
  private drawHazard(hazard: Hazard2D) {
    const ctx = this.ctx;

    if (hazard.type === 'saw' && hazard.radius) {
      ctx.save();
      ctx.translate(hazard.x, hazard.y);
      ctx.rotate(hazard.angle || 0);

      const r = hazard.radius;
      // Saw teeth
      ctx.fillStyle = COLORS_2D.HAZARD_RED;
      ctx.beginPath();
      const numTeeth = 10;
      for (let i = 0; i < numTeeth; i++) {
        const a1 = (i * Math.PI * 2) / numTeeth;
        const a2 = a1 + Math.PI / numTeeth;
        const outerR = r + 6;
        const innerR = r - 4;
        ctx.lineTo(Math.cos(a1) * innerR, Math.sin(a1) * innerR);
        ctx.lineTo(Math.cos(a2) * outerR, Math.sin(a2) * outerR);
      }
      ctx.closePath();
      ctx.fill();

      // Blade metallic disc
      ctx.fillStyle = COLORS_2D.HAZARD_BLADE;
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.75, 0, Math.PI * 2);
      ctx.fill();

      // Danger Center Bolt
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.3, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    } else if (hazard.type === 'spike' && hazard.width && hazard.height) {
      // Crystal Spikes
      ctx.fillStyle = COLORS_2D.HAZARD_RED;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;

      const numSpikes = Math.floor(hazard.width / 14);
      for (let i = 0; i < numSpikes; i++) {
        const sx = hazard.x + i * 14;
        ctx.beginPath();
        ctx.moveTo(sx, hazard.y + hazard.height);
        ctx.lineTo(sx + 7, hazard.y);
        ctx.lineTo(sx + 14, hazard.y + hazard.height);
        ctx.fill();
        ctx.stroke();
      }
    }
  }

  // ==========================================
  // CHECKPOINTS
  // ==========================================
  private drawCheckpoint(cp: Checkpoint2D, time: number) {
    const ctx = this.ctx;

    // Pole
    ctx.fillStyle = '#64748b';
    ctx.fillRect(cp.x - 3, cp.y - 70, 6, 70);

    // Base
    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.roundRect(cp.x - 18, cp.y - 8, 36, 8, 3);
    ctx.fill();

    // Flag (Wavy banner)
    const flagColor = cp.unlocked ? COLORS_2D.CHECKPOINT_ACTIVE : COLORS_2D.CHECKPOINT_INACTIVE;
    ctx.fillStyle = flagColor;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;

    const wave = Math.sin(time * 5 + cp.id) * 4;

    ctx.beginPath();
    ctx.moveTo(cp.x + 3, cp.y - 68);
    ctx.quadraticCurveTo(cp.x + 22, cp.y - 70 + wave, cp.x + 42, cp.y - 62);
    ctx.lineTo(cp.x + 32, cp.y - 48);
    ctx.quadraticCurveTo(cp.x + 18, cp.y - 46 + wave, cp.x + 3, cp.y - 46);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Top Gem
    ctx.fillStyle = flagColor;
    ctx.beginPath();
    ctx.arc(cp.x, cp.y - 72, 6, 0, Math.PI * 2);
    ctx.fill();
  }

  // ==========================================
  // COINS & POWER-UPS
  // ==========================================
  private drawCoin(coin: Coin2D, time: number) {
    const ctx = this.ctx;
    const cy = coin.y + Math.sin(time * 3 + coin.bobOffset) * 5;
    const scaleX = Math.abs(Math.cos(time * 3.5)); // 3D spin effect

    ctx.save();
    ctx.translate(coin.x, cy);
    ctx.scale(Math.max(0.2, scaleX), 1.0);

    // Gold Outer
    ctx.fillStyle = COLORS_2D.COIN_GOLD;
    ctx.strokeStyle = COLORS_2D.COIN_BORDER;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, coin.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Inner Ridge & Star
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(0, 0, coin.radius * 0.65, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  private drawPowerUpItem(item: PowerUpItem2D, time: number) {
    const ctx = this.ctx;
    const cy = item.y + Math.sin(time * 3 + item.bobOffset) * 6;

    // Glowing bubble aura
    const bubbleColor =
      item.type === 'speed_sneakers'
        ? COLORS_2D.POWERUP_SPEED
        : item.type === 'dash'
          ? COLORS_2D.POWERUP_DASH
          : COLORS_2D.POWERUP_PARACHUTE;

    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.beginPath();
    ctx.arc(item.x, cy, item.radius + 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = bubbleColor;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(item.x, cy, item.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Power-up Icon glyph inside
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 15px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const glyph = item.type === 'speed_sneakers' ? '⚡' : item.type === 'dash' ? '💨' : '🪂';
    ctx.fillText(glyph, item.x, cy + 1);
  }

  // ==========================================
  // FINISH STARGATE PORTAL
  // ==========================================
  private drawPortal(portal: { x: number; y: number; width: number; height: number }, time: number) {
    const ctx = this.ctx;
    const cx = portal.x + portal.width / 2;
    const cy = portal.y + portal.height / 2;

    // Outer Rainbow Halo
    const halo = ctx.createRadialGradient(cx, cy, 10, cx, cy, 80);
    halo.addColorStop(0, 'rgba(168, 85, 247, 0.8)');
    halo.addColorStop(0.5, 'rgba(6, 182, 212, 0.5)');
    halo.addColorStop(1, 'rgba(6, 182, 212, 0)');
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(cx, cy, 80, 0, Math.PI * 2);
    ctx.fill();

    // Portal Frame Arch
    ctx.strokeStyle = COLORS_2D.PORTAL_OUTER;
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.ellipse(cx, cy, 32, 54, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Swirling Inner Vortex
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(time * 2.5);

    ctx.fillStyle = COLORS_2D.PORTAL_INNER;
    ctx.beginPath();
    ctx.ellipse(0, 0, 24, 44, 0, 0, Math.PI * 2);
    ctx.fill();

    // Spiral spokes
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    for (let i = 0; i < 4; i++) {
      ctx.rotate(Math.PI / 2);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(12, 16, 20, 36);
      ctx.stroke();
    }
    ctx.restore();
  }

  // ==========================================
  // PARTICLES
  // ==========================================
  private drawParticles(particles: Particle2D[]) {
    const ctx = this.ctx;
    for (const p of particles) {
      const alpha = Math.max(0, p.life / p.maxLife);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;

      if (p.shape === 'star') {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1.0;
  }

  // ==========================================
  // PLAYER CHARACTER
  // ==========================================
  private drawPlayer(physics: PhysicsEngine2D, time: number) {
    const ctx = this.ctx;
    const px = physics.x;
    const py = physics.y;
    const pw = physics.width;
    const ph = physics.height;

    ctx.save();
    ctx.translate(px + pw / 2, py + ph / 2);

    // Direction flip
    if (!physics.facingRight) {
      ctx.scale(-1, 1);
    }

    // Squash & Stretch
    let scaleX = 1.0;
    let scaleY = 1.0;

    if (!physics.isGrounded) {
      if (physics.vy < -100) {
        scaleY = 1.25; // jumping stretch
        scaleX = 0.85;
      } else if (physics.vy > 100) {
        scaleY = 0.95; // falling
        scaleX = 1.05;
      }
    } else if (Math.abs(physics.vx) > 50) {
      this.runCycle += 0.25;
      // Running bounce
      scaleY = 1.0 + Math.sin(this.runCycle * 2) * 0.08;
      scaleX = 1.0 - Math.sin(this.runCycle * 2) * 0.08;
    } else {
      // Idle breathing
      scaleY = 1.0 + Math.sin(time * 3) * 0.04;
      scaleX = 1.0 - Math.sin(time * 3) * 0.04;
    }

    ctx.scale(scaleX, scaleY);

    // 1. Dash Aura Shockwave
    if (physics.isDashing) {
      ctx.fillStyle = 'rgba(56, 189, 248, 0.45)';
      ctx.beginPath();
      ctx.ellipse(-8, 0, pw * 0.9, ph * 0.7, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // 2. Parachute Canopy (unfolded above head when gliding)
    if (physics.isParachuting) {
      ctx.save();
      ctx.translate(0, -ph * 0.75);

      // Parachute canopy dome
      ctx.fillStyle = COLORS_2D.PLAYER_PARACHUTE;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, 36, Math.PI, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Canopy stripes
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(0, 0, 18, Math.PI, 0);
      ctx.closePath();
      ctx.fill();

      // Parachute Strings
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(-32, 0);
      ctx.lineTo(0, ph * 0.4);
      ctx.moveTo(32, 0);
      ctx.lineTo(0, ph * 0.4);
      ctx.stroke();

      ctx.restore();
    }

    // 3. Cute Backpack
    ctx.fillStyle = COLORS_2D.PLAYER_CAP;
    ctx.beginPath();
    ctx.roundRect(-pw * 0.5 - 6, -ph * 0.25, 8, ph * 0.45, 3);
    ctx.fill();

    // 4. Bean Body (Vibrant cyan astronaut bean)
    ctx.fillStyle = COLORS_2D.PLAYER_BODY;
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(-pw * 0.45, -ph * 0.45, pw * 0.9, ph * 0.8, 16);
    ctx.fill();
    ctx.stroke();

    // 5. Glossy Visor / Face
    ctx.fillStyle = COLORS_2D.PLAYER_FACE;
    ctx.beginPath();
    ctx.roundRect(0, -ph * 0.35, pw * 0.42, ph * 0.38, 10);
    ctx.fill();

    // Cute Eyes (looking right)
    ctx.fillStyle = COLORS_2D.PLAYER_EYES;
    ctx.beginPath();
    ctx.ellipse(pw * 0.22, -ph * 0.22, 3.5, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Eye highlight shine
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(pw * 0.24, -ph * 0.25, 1.5, 0, Math.PI * 2);
    ctx.fill();

    // Blush Cheek
    ctx.fillStyle = COLORS_2D.PLAYER_CHEEKS;
    ctx.beginPath();
    ctx.arc(pw * 0.16, -ph * 0.08, 4, 0, Math.PI * 2);
    ctx.fill();

    // 6. Running Feet / Shoes
    ctx.fillStyle = COLORS_2D.PLAYER_FEET;
    const legOffset = Math.sin(this.runCycle * 2) * 8;
    // Left foot
    ctx.beginPath();
    ctx.roundRect(-pw * 0.35 + legOffset, ph * 0.32, 14, 8, 3);
    ctx.fill();
    // Right foot
    ctx.beginPath();
    ctx.roundRect(pw * 0.05 - legOffset, ph * 0.32, 14, 8, 3);
    ctx.fill();

    // 7. Speed Sneakers Lightning trail
    if (physics.activePowerUp === 'speed_sneakers') {
      ctx.fillStyle = '#facc15';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText('⚡', -pw * 0.5, ph * 0.3);
    }

    ctx.restore();
  }
}
