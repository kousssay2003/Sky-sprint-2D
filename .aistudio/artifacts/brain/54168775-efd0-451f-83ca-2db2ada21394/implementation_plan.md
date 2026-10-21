# Crazy Obby: Sky Sprint 2D — Implementation Plan

Transform the application into a colorful, mobile-first **2D side-scrolling platformer** featuring vibrant cartoon vector sky aesthetics, responsive kinematic platforming, dynamic hazards, checkpoints, collectible coins, and three unlockable power-ups (**Dash Burst**, **Parachute Glide**, and **Speed Sneakers**).

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The following directions have been confirmed with the user in Phase 1:
> - **Perspective & Genre**: 2D Side-Scrolling Platformer with continuous horizontal running, platform jumping, moving obstacles, and hazards.
> - **Visual Style**: Vibrant cartoon vector art with high-saturation sky gradients, fluffy layered parallax clouds, floating candy/neon islands, and expressive character animations.
> - **Movement & Abilities**: Enhanced platforming mechanics including **Dash Boost** (horizontal air dash), **Parachute Glide** (holding jump slows fall speed), and **Speed Sneakers** (high-velocity sprint multiplier), alongside bounce spring pads and moving platforms.

---

## 1. Overview & Core Concept

- **What It Does**: A mobile-first, 60fps 2D side-scrolling obstacle course game. Players guide a cute, customizable cartoon runner across floating sky islands, dodging spinning saw blades, timed lasers, and crumbling cloud blocks, while collecting coins and activating power-ups to reach the Grand Sky Portal.
- **Target Audience / Persona**: Casual mobile and web gamers who enjoy classic obstacle courses (Obbys), speedruns, and platformers with immediate, responsive touch and keyboard controls.
- **Key Value**: Delivers reliable, zero-lag 2D platforming with satisfying game feel (coyote time, jump buffering, hit flashes, squash-and-stretch animations, procedural audio) without requiring external assets or API keys.

---

## 2. User Experience & Visual Design

### Key User Flows
1. **Title Screen**: Clean full-viewport hero screen with live animated parallax clouds, cartoon vector logo, high score / best time badge, and prominent `"PLAY NOW"` CTA (`Enter`/`Space` or tap).
2. **Active Play**:
   - 2D Canvas viewport with smooth tracking camera keeping 85%+ of screen unobstructed.
   - Smooth left/right movement, variable height jumping, air dashing, and parachute gliding.
   - Dynamic collectibles: Golden Coins, Speed Sneakers, Parachute Packs, and Dash Orbs.
   - 4 Connected Themed Stages:
     1. *Sunny Cloudburst Meadow* (gentle platforming, coin trails, speed shoes tutorial).
     2. *Windmill Chasm & Spinning Blades* (narrow beams, rotating hazards, dash boost).
     3. *Elevator Peaks & Spring Pads* (vertically oscillating platforms, high bounce launches, parachute glides).
     4. *Stratosphere Gauntlet & Stargate* (crumbling cloud platforms, dual hazard bars, victory portal).
3. **Checkpoints & Respawning**: Stepping on physical checkpoint flags turns them from glowing orange to vibrant emerald green with triumphant chimes and zero-delay instant respawn upon falling.
4. **Victory & Replay**: Celebratory stargate finish with confetti bursts, star rating (1–3 stars based on time, coins, and falls), personal record comparison, and a `"Speedrun Again"` instant restart button.

### Visual Identity & Theme
- **Aesthetic Direction**: Vibrant Cartoon Sky Vector (inspired by Rayman Origins, Mario Wonder, and modern colorful 2D platformers).
- **Color Palette**:
  - Sky Canvas: Multi-layer gradient from vibrant cyan (`#38bdf8`) to soft sky blue (`#bae6fd`) and sunset gold horizon (`#fef08a`).
  - Safe Platforms: Crisp grass-topped floating islands (`#22c55e` top, `#3b82f6` / `#6366f1` base) with clean edge bevels.
  - Hazards: Neon danger ruby (`#ef4444`) with high-contrast alert outlines.
  - Checkpoints: Radiant emerald (`#10b981`) when activated, sunny orange (`#f97316`) when inactive.
  - Coins & Power-ups: High-gloss gold (`#facc15`), lightning cyan (`#06b6d4`), and magenta bounce pads (`#ec4899`).
- **Typography & UI Hierarchy**:
  - Display Font: Bold geometric rounded sans-serif (`system-ui`, `Outfit`).
  - HUD Stats: Unboxed clean text with `tabular-nums` for timers and counters.
  - No decorative pills or fake status clutter.
- **Mobile Touch Controls**:
  - Left: Virtual 2D thumb joystick / D-pad (responsive left/right sprint).
  - Right: Large **JUMP / GLIDE** button + dedicated **DASH** power-up button.
  - Fully touch-prevented (`touch-action: none`) with no page scrolling or zooming.

---

## 3. Key Product Decisions & Trade-Offs

- **HTML5 2D Canvas Engine vs DOM elements**:
  - *Chosen*: High-performance HTML5 2D Canvas renderer with sub-pixel rendering and double-buffered offscreen layers for parallax backdrops.
  - *Why*: Delivers guaranteed 60fps on mobile browsers, seamless camera tracking, zero DOM node overhead, and reliable pixel-perfect AABB and circle collision detection.
- **Power-Up Integration**:
  - *Dash Boost*: Short horizontal velocity burst with invincible trail particles (cooldown 1.2s).
  - *Parachute Glide*: Holding Jump while descending reduces falling speed by 70%, allowing players to float across wide chasm gaps.
  - *Speed Sneakers*: Pick-up buff providing +40% sprint velocity and trailing motion blur for 8 seconds.
- **Audio System**:
  - Zero external `.mp3` files: Enhanced procedural Web Audio API sound synthesizer with custom envelopes for jump boings, flutter parachute whooshes, dash blasts, coin sparkles, checkpoint chimes, and victory fanfare.

---

## 4. Technical Architecture & Data Strategy

```
┌─────────────────────────────────────────────────────────────────┐
│                           App.tsx                               │
│  State: status ('menu' | 'playing' | 'paused' | 'victory')     │
│  Stats: { coins, checkpoint, elapsedTime, falls, bestTime }     │
└───────────────┬───────────────────────────────┬─────────────────┘
                │                               │
        ┌───────▼────────┐             ┌────────▼────────┐
        │  GameCanvas    │             │   UI Overlays   │
        │  2D Game Engine│             │  HUD & Controls │
        └───────┬────────┘             └────────┬────────┘
                │                               │
  ┌─────────────┼─────────────┐        ┌────────┼────────┐
  │             │             │        │        │        │
┌─▼────────┐ ┌──▼──────┐ ┌────▼─────┐┌─▼────┐ ┌─▼──────┐┌▼────────┐
│Parallax  │ │Physics &│ │Character││HUD    │ │Touch   ││Pause /  │
│Sky Layers│ │Level 2D │ │Controller││Scores │ │Controls││Victory │
└──────────┘ └─────────┘ └──────────┘└──────┘ └────────┘└─────────┘
```

### Component & System Breakdown
1. **`src/game2d/engine2d.ts`**: Core 2D game loop, clamped delta time (`dt <= 0.05`), viewport coordinate scaling, camera lerp tracking, and entity render dispatch.
2. **`src/game2d/physics2d.ts`**: Kinematic 2D player physics:
   - Horizontal velocity, acceleration, ground friction, and air control.
   - Variable jump height, gravity, max fall velocity, coyote time (0.14s), and jump buffer (0.14s).
   - Dash boost execution and parachute drag physics.
   - AABB platform collision resolution, moving platform velocity inheritance, and hazard triggers.
3. **`src/game2d/renderer2d.ts`**: Cartoon vector drawing routines:
   - Multi-layer parallax background (distant clouds, mountain silhouettes, floating sky islands).
   - Character rendering with squash/stretch, running stride, eyes blinking, parachute canopy, and trail particles.
   - Platform tiles with grass fringe, beveled edges, glowing checkpoint flags, and spinning saw/laser hazards.
4. **`src/game2d/level2d.ts`**: Complete 2D sky course map with 4 distinct sections, moving platforms, bounce pads, power-up items, coins, checkpoints, and victory stargate portal.
5. **`src/audio/soundManager.ts`**: Web Audio API synthesizer updated with dash and parachute sound effects.
6. **`src/components/TouchControls.tsx`**: Updated with responsive mobile controls: Left/Right thumb stick, Jump/Glide button, and Dash button.
7. **`src/components/HUD.tsx` & Modals**: Unobtrusive HUD featuring speedrun timer, checkpoint indicator, coin counter, active power-up badges, and pause/restart controls.

---

## 5. Verification Plan

1. **Compilation & Types**: Run `compile_applet` and `lint_applet` to verify clean build without TypeScript errors.
2. **Automated Browser Testing (Playwright)**:
   - Main menu render: Verify vibrant cartoon 2D title screen, logo, and Start button.
   - Gameplay initiation: Test player spawn at Start platform.
   - Movement & Jumping: Test running forward, jumping, double jump / glide mechanics.
   - Power-ups: Verify picking up Speed Sneakers and activating Dash Burst.
   - Checkpoints & Hazards: Test hazard collision with instant respawn at current checkpoint.
   - Touch Controls: Verify on-screen virtual joystick and Jump/Dash buttons.
   - Course Completion: Verify reaching the Finish Stargate and triggering the Victory modal.
3. **Visual Quality Critique**: Take screenshot of running 2D game and run `critique_applet` to confirm vibrant cartoon vector presentation.
