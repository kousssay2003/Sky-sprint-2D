/**
 * CRAZY OBBY: SKY SPRINT - Core 3D Game Engine
 * Manages Three.js WebGL scene, lighting, camera follow, input handling,
 * audio integration, physics tick, and game status transitions.
 */

import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { soundManager } from '../audio/soundManager';
import { GameStatus, InputState, PlayerStats } from '../types/game';
import { CharacterController } from './character';
import { CAMERA_CONFIG, COLORS } from './constants';
import { buildLevel, LevelData } from './level';
import { PhysicsEngine } from './physics';

export interface EngineCallbacks {
  onStatsChange: (stats: PlayerStats) => void;
  onStatusChange: (status: GameStatus) => void;
  onCoinPopup: (count: number) => void;
  onCheckpointPopup: (name: string) => void;
}

export class GameEngine {
  private container: HTMLElement;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private isSoftwareGl: boolean;

  // Level & Entities
  private level: LevelData;
  private character: CharacterController;
  private physics: PhysicsEngine;

  // Camera state
  private cameraYaw: number = 0;
  private cameraPitch: number = CAMERA_CONFIG.DEFAULT_PITCH;
  private cameraDistance: number = CAMERA_CONFIG.DEFAULT_DISTANCE;
  private currentCameraPos: THREE.Vector3 = new THREE.Vector3(0, 5, -8);
  private currentLookTarget: THREE.Vector3 = new THREE.Vector3(0, 1, 0);

  // Input
  public input: InputState = {
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false,
    jumpJustPressed: false,
    virtualStick: { x: 0, y: 0, active: false },
    cameraYawDelta: 0,
  };

  // Game state
  private status: GameStatus = 'menu';
  private fallCount: number = 0;
  private elapsedTime: number = 0;
  private bestTime: number | null = null;
  private callbacks: EngineCallbacks;

  // Loop control
  private isRunning: boolean = false;
  private animationFrameId: number = 0;
  private lastTime: number = 0;

  // Preallocated vectors for zero-GC loop
  private _v1 = new THREE.Vector3();
  private _v2 = new THREE.Vector3();

  constructor(container: HTMLElement, callbacks: EngineCallbacks) {
    this.container = container;
    this.callbacks = callbacks;

    // Load best time from localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('crazy_obby_best_time');
      if (saved) this.bestTime = parseFloat(saved);
    }

    // 1. Detect software WebGL
    this.isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // 2. Initialize Three.js Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: !this.isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: false,
    });
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.renderer.setPixelRatio(this.isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = !this.isSoftwareGl;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.setSize(container.clientWidth, container.clientHeight);

    container.appendChild(this.renderer.domElement);

    // 3. Initialize Scene & Sky Fog
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(COLORS.SKY_TOP);
    this.scene.fog = new THREE.Fog(COLORS.FOG, 40, 160);

    // 4. Initialize Camera
    this.camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      400
    );

    // 5. Procedural Studio Environment Reflection
    try {
      const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
      this.scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
      pmremGenerator.dispose();
    } catch {
      // Fallback
    }

    // 6. Lighting Rig
    this.setupLighting();

    // 7. Build Level
    this.level = buildLevel();
    this.scene.add(this.level.root);

    // 8. Build Character
    this.character = new CharacterController();
    this.scene.add(this.character.group);
    this.scene.add(this.character.shadowMesh);

    // 9. Physics Engine
    this.physics = new PhysicsEngine(this.level, this.character, {
      onCoinCollected: (_coinId, totalCollected) => {
        this.emitStats();
        this.callbacks.onCoinPopup(totalCollected);
      },
      onCheckpointReached: (index, name) => {
        this.emitStats();
        this.callbacks.onCheckpointPopup(name);
        this.updateCheckpointVisuals(index);
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
          // Check high score
          if (this.bestTime === null || this.elapsedTime < this.bestTime) {
            this.bestTime = this.elapsedTime;
            if (typeof window !== 'undefined') {
              localStorage.setItem('crazy_obby_best_time', this.bestTime.toFixed(2));
            }
          }
          this.emitStats();
          this.callbacks.onStatusChange('victory');
        }
      },
    });

    // 10. Event Listeners
    this.setupEventListeners();

    // 11. Initial Stats Push
    this.emitStats();

    // 12. Start Loop
    this.isRunning = true;
    this.lastTime = performance.now();
    this.loop = this.loop.bind(this);
    this.animationFrameId = requestAnimationFrame(this.loop);
  }

  private setupLighting() {
    // Warm Key Light (Directional with shadows)
    const sunLight = new THREE.DirectionalLight(COLORS.SUN_LIGHT, 1.6);
    sunLight.position.set(25, 45, -20);
    if (!this.isSoftwareGl) {
      sunLight.castShadow = true;
      sunLight.shadow.mapSize.width = 1024;
      sunLight.shadow.mapSize.height = 1024;
      sunLight.shadow.camera.near = 10;
      sunLight.shadow.camera.far = 120;
      sunLight.shadow.camera.left = -30;
      sunLight.shadow.camera.right = 30;
      sunLight.shadow.camera.top = 30;
      sunLight.shadow.camera.bottom = -30;
      sunLight.shadow.bias = -0.0005;
      sunLight.shadow.normalBias = 0.02;
    }
    this.scene.add(sunLight);

    // Sky/Ground Hemisphere Fill
    const hemiLight = new THREE.HemisphereLight(COLORS.AMBIENT_SKY, COLORS.AMBIENT_GROUND, 0.85);
    this.scene.add(hemiLight);

    // Soft Ambient Light
    const ambLight = new THREE.AmbientLight(0xffffff, 0.35);
    this.scene.add(ambLight);
  }

  private updateCheckpointVisuals(activeIdx: number) {
    this.level.checkpoints.forEach((cp, idx) => {
      if (idx <= activeIdx) {
        cp.unlocked = true;
      }
    });
  }

  private emitStats() {
    const cp = this.level.checkpoints[this.physics.activeCheckpointIndex];
    this.callbacks.onStatsChange({
      coinsCollected: this.physics.coinsCollected,
      totalCoins: this.level.coins.length,
      currentCheckpoint: this.physics.activeCheckpointIndex,
      totalCheckpoints: this.level.checkpoints.length,
      checkpointName: cp ? cp.name : 'Start',
      fallCount: this.fallCount,
      elapsedTime: this.elapsedTime,
      bestTime: this.bestTime,
    });
  }

  // Touch / Pointer Camera Swipe Control
  public handleCameraDrag(deltaX: number) {
    this.cameraYaw -= deltaX * CAMERA_CONFIG.ROTATION_SENSITIVITY;
  }

  public setStatus(newStatus: GameStatus) {
    this.status = newStatus;
    this.callbacks.onStatusChange(newStatus);
    if (newStatus === 'playing') {
      soundManager.playClick();
    }
  }

  public restartGame() {
    this.elapsedTime = 0;
    this.fallCount = 0;
    this.physics.coinsCollected = 0;
    this.physics.activeCheckpointIndex = 0;

    // Reset coins
    for (const coin of this.level.coins) {
      coin.collected = false;
      if (coin.mesh) coin.mesh.visible = true;
    }

    // Reset checkpoints
    this.level.checkpoints.forEach((cp, idx) => {
      cp.unlocked = idx === 0;
    });

    this.physics.resetToCheckpoint(0);
    this.setStatus('playing');
    this.emitStats();
  }

  public respawnAtCurrentCheckpoint() {
    this.physics.resetToCheckpoint();
    if (this.status === 'paused') {
      this.setStatus('playing');
    }
  }

  // Keyboard handlers
  private handleKeyDown = (e: KeyboardEvent) => {
    if (e.repeat) return;

    switch (e.code) {
      case 'KeyW':
      case 'ArrowUp':
        this.input.forward = true;
        break;
      case 'KeyS':
      case 'ArrowDown':
        this.input.backward = true;
        break;
      case 'KeyA':
      case 'ArrowLeft':
        this.input.left = true;
        break;
      case 'KeyD':
      case 'ArrowRight':
        this.input.right = true;
        break;
      case 'Space':
        this.input.jump = true;
        this.input.jumpJustPressed = true;
        break;
      case 'KeyQ':
        this.cameraYaw += 0.35;
        break;
      case 'KeyE':
        this.cameraYaw -= 0.35;
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
      case 'KeyW':
      case 'ArrowUp':
        this.input.forward = false;
        break;
      case 'KeyS':
      case 'ArrowDown':
        this.input.backward = false;
        break;
      case 'KeyA':
      case 'ArrowLeft':
        this.input.left = false;
        break;
      case 'KeyD':
      case 'ArrowRight':
        this.input.right = false;
        break;
      case 'Space':
        this.input.jump = false;
        break;
    }
  };

  private handleWindowBlur = () => {
    // Clear all held inputs on window blur
    this.input.forward = false;
    this.input.backward = false;
    this.input.left = false;
    this.input.right = false;
    this.input.jump = false;
    this.input.virtualStick.active = false;
    this.input.virtualStick.x = 0;
    this.input.virtualStick.y = 0;
  };

  public handleResize = () => {
    if (!this.container) return;
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
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
    const dt = Math.min(rawDt, 0.05); // clamp delta to prevent tunneling

    // Continuous portal vortex spin
    if (this.level.portalGroup) {
      this.level.portalGroup.rotation.y += dt * 0.4;
    }

    if (this.status === 'playing') {
      this.elapsedTime += dt;
      this.physics.update(dt, this.input, this.cameraYaw);
      this.updateCameraFollow(dt);
      this.emitStats();
    } else if (this.status === 'menu') {
      // Cinematic slow orbit around spawn island
      this.cameraYaw += dt * 0.35;
      const target = this._v1.set(0, 1.2, 0);
      const camX = target.x + Math.sin(this.cameraYaw) * 6.5;
      const camZ = target.z - Math.cos(this.cameraYaw) * 6.5;
      const camY = 3.0 + Math.sin(timestamp * 0.001) * 0.4;
      this.camera.position.set(camX, camY, camZ);
      this.camera.lookAt(target);

      // Character idle breathing
      this.character.update(dt, 0, true, 0);
    } else if (this.status === 'paused' || this.status === 'victory') {
      // Keep camera stable, do subtle portal animation
      if (this.status === 'victory') {
        this.cameraYaw += dt * 0.5;
        this.updateCameraFollow(dt);
      }
    }

    // Reset single-frame triggers
    this.input.jumpJustPressed = false;

    // Render Scene
    this.renderer.render(this.scene, this.camera);

    // Schedule next frame
    if (this.isSoftwareGl) {
      this.afterDraw(() => {
        if (this.isRunning) {
          this.animationFrameId = requestAnimationFrame(this.loop);
        }
      });
    } else {
      this.animationFrameId = requestAnimationFrame(this.loop);
    }
  }

  private afterDraw(cb: () => void) {
    const gl = this.renderer.getContext() as WebGL2RenderingContext;
    const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
    gl.flush();
    const poll = () => {
      const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
      if (state === gl.UNSIGNALED) {
        window.setTimeout(poll, 5);
      } else {
        gl.deleteSync(sync);
        window.setTimeout(cb, 60);
      }
    };
    window.setTimeout(poll, 5);
  }

  private updateCameraFollow(dt: number) {
    const playerPos = this.physics.position;

    // Camera target point is slightly above player center
    const targetY = playerPos.y + CAMERA_CONFIG.LOOK_AHEAD_Y;
    const targetX = playerPos.x;
    const targetZ = playerPos.z;

    this.currentLookTarget.x = THREE.MathUtils.damp(this.currentLookTarget.x, targetX, CAMERA_CONFIG.LERP_SPEED, dt);
    this.currentLookTarget.y = THREE.MathUtils.damp(this.currentLookTarget.y, targetY, CAMERA_CONFIG.LERP_SPEED, dt);
    this.currentLookTarget.z = THREE.MathUtils.damp(this.currentLookTarget.z, targetZ, CAMERA_CONFIG.LERP_SPEED, dt);

    // Desired camera position behind player based on cameraYaw & cameraPitch
    const horizDist = this.cameraDistance * Math.cos(this.cameraPitch);
    const vertDist = this.cameraDistance * Math.sin(this.cameraPitch) + CAMERA_CONFIG.DEFAULT_HEIGHT;

    const desiredCamX = this.currentLookTarget.x + Math.sin(this.cameraYaw) * horizDist;
    const desiredCamZ = this.currentLookTarget.z - Math.cos(this.cameraYaw) * horizDist;
    const desiredCamY = this.currentLookTarget.y + vertDist;

    this.currentCameraPos.x = THREE.MathUtils.damp(this.currentCameraPos.x, desiredCamX, CAMERA_CONFIG.LERP_SPEED, dt);
    this.currentCameraPos.y = THREE.MathUtils.damp(this.currentCameraPos.y, desiredCamY, CAMERA_CONFIG.LERP_SPEED, dt);
    this.currentCameraPos.z = THREE.MathUtils.damp(this.currentCameraPos.z, desiredCamZ, CAMERA_CONFIG.LERP_SPEED, dt);

    this.camera.position.copy(this.currentCameraPos);
    this.camera.lookAt(this.currentLookTarget);
  }

  public destroy() {
    this.isRunning = false;
    cancelAnimationFrame(this.animationFrameId);

    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
    window.removeEventListener('blur', this.handleWindowBlur);
    window.removeEventListener('resize', this.handleResize);

    if (this.renderer) {
      this.renderer.dispose();
      if (this.renderer.domElement.parentElement) {
        this.renderer.domElement.parentElement.removeChild(this.renderer.domElement);
      }
    }
  }
}
