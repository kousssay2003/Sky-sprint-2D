# Crazy Obby: Sky Sprint 2D 🚀☁️

A colorful, mobile-first **2D side-scrolling platformer** built from scratch with **React**, **TypeScript**, and **HTML5 Canvas**. Race across vibrant floating sky islands, dodge rotating buzzsaw blades, activate power-ups, catapult across chasms on bounce springs, and dash into the celestial finish stargate!

---

## 🎮 How to Play

### Mobile Touch Controls
- **Left Thumb:** Virtual Analog Joystick (smooth left/right run speed) or switchable digital D-Pad.
- **Right Thumb:**
  - **JUMP / GLIDE Button:** Tap to Jump. Tap in mid-air for **Double Jump**. Hold while falling with Parachute to **Glide** safely across chasms!
  - **DASH Button:** Instant horizontal air dash burst with shockwave.
- **Top Bar:** Quick Respawn button, Audio Mute toggle, and Pause button.

### Desktop Keyboard Controls
- **A / D** or **Left / Right Arrow Keys:** Run left and right
- **Spacebar / W / Up Arrow:** Jump / Double Jump / Hold to Parachute Glide
- **Shift / J:** Air Dash burst
- **R:** Quick respawn at latest unlocked checkpoint
- **Esc / P:** Pause / Resume game

---

## ⚡ Power-Ups & Mechanics

1. **⚡ Speed Sneakers**: Boosts horizontal running speed by +45% with lightning sparks.
2. **💨 Dash Burst**: Instant high-velocity air dash forward with invulnerable shockwave (1.2s cooldown).
3. **🪂 Parachute Glide**: Holding jump while airborne reduces terminal fall speed by 70%, allowing gentle floating across wide abyss gaps.
4. **🌸 Bounce Springs**: Catapults player high into the stratosphere with elastic boing physics.
5. **☁️ Crumbling Clouds**: Shakes and crumbles after 0.5s of contact, forcing quick platforming decisions.

---

## 📁 Project Architecture & File Guide

- **`src/types/game2d.ts`**: Types for platforms, moving elevators, hazards, power-ups, coins, checkpoints, and player stats.
- **`src/game2d/physics2d.ts`**: Kinematic 2D platforming physics engine:
  - Frame-rate independent delta integration with velocity damping.
  - Coyote time (0.14s) & Jump buffering (0.14s) for crisp platforming feel.
  - Double jumping, air dash execution, and parachute float calculations.
  - Moving platform velocity ride-along and crumbling block timers.
- **`src/game2d/renderer2d.ts`**: High-performance cartoon vector renderer:
  - Multi-layer parallax background (sky gradients, distant floating castles, mid-ground clouds).
  - Floating grass-topped islands with fringe blades and beveled highlights.
  - Expressive cartoon character with running leg animations, squash-and-stretch, parachute canopy, and eye direction.
  - Rotating saw hazards, glowing checkpoint banners, coins with 3D elliptical spin, and the swirling stargate portal.
- **`src/game2d/level2d.ts`**: 4 connected sky course zones:
  - *Zone 0: Sky Meadow Start*
  - *Zone 1: Cloudburst Steps & Speed Sneakers*
  - *Zone 2: Sawblade Ridge & Dash Orbs*
  - *Zone 3: Elevator Peaks & Bounce Springs*
  - *Zone 4: Stratosphere Gauntlet & Victory Stargate*
- **`src/game2d/engine2d.ts`**: Canvas coordinate scaling, 60fps loop pacing, camera lerp tracking, and stats dispatcher.
- **`src/audio/soundManager.ts`**: 100% procedural Web Audio API synthesizer for jumps, double jumps, dashes, parachutes, power-ups, coins, checkpoints, bounce springs, hazard hits, and victory fanfare (zero external 404s).
- **`src/components/TouchControls.tsx`**: Mobile-first virtual stick, D-Pad switcher, Dash button, and Jump/Glide button.
- **`src/components/HUD.tsx`**: Perimeter status clusters (speedrun timer, active power-up banner, coins, checkpoints).
- **`src/components/MainMenu.tsx`**: Colorful cartoon title screen with parallax preview and Start CTA.
- **`src/components/VictoryModal.tsx`**: Stargate victory celebration with star ratings (1–3 stars), elapsed time, and instant replay.

---

## 📦 How to Build / Export Standalone Web Version

```bash
npm run build
```
The compiled static HTML5 game assets will be output to the `dist/` folder, ready for deployment to any static hosting provider.
