/**
 * Procedural 3D Character for Crazy Obby: Sky Sprint
 * Composite 3–12 part procedural model with smooth cartoon animations,
 * squash-and-stretch jumping, walking strides, and contact shadow.
 */

import * as THREE from 'three';
import { COLORS, PHYSICS } from './constants';

export class CharacterController {
  public group: THREE.Group;
  public shadowMesh: THREE.Mesh;

  // Sub-parts for animation
  private bodyMesh: THREE.Mesh;
  private headMesh: THREE.Mesh;
  private visorMesh: THREE.Mesh;
  private backpackMesh: THREE.Mesh;
  private nozzleLeft: THREE.Mesh;
  private nozzleRight: THREE.Mesh;
  private leftArm: THREE.Group;
  private rightArm: THREE.Group;
  private leftLeg: THREE.Group;
  private rightLeg: THREE.Group;

  // Animation state
  private walkTime: number = 0;
  private squashTime: number = 0;
  private jumpStretch: number = 1.0;
  private currentYaw: number = 0;
  private targetYaw: number = 0;

  constructor() {
    this.group = new THREE.Group();

    // 1. Shadow plane (contact shadow, grounded beneath player)
    const shadowGeo = new THREE.PlaneGeometry(1.0, 1.0);
    shadowGeo.rotateX(-Math.PI / 2);
    // Procedural radial alpha texture for soft shadow
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 64;
    shadowCanvas.height = 64;
    const sCtx = shadowCanvas.getContext('2d')!;
    const grad = sCtx.createRadialGradient(32, 32, 2, 32, 32, 30);
    grad.addColorStop(0, 'rgba(15, 23, 42, 0.45)');
    grad.addColorStop(0.6, 'rgba(15, 23, 42, 0.2)');
    grad.addColorStop(1, 'rgba(15, 23, 42, 0)');
    sCtx.fillStyle = grad;
    sCtx.fillRect(0, 0, 64, 64);
    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    shadowTex.colorSpace = THREE.SRGBColorSpace;

    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
    });
    this.shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    this.shadowMesh.position.y = 0.02;

    // 2. Materials
    const bodyMat = new THREE.MeshStandardMaterial({
      color: COLORS.PLAYER_BODY,
      roughness: 0.35,
      metalness: 0.1,
    });

    const suitMat = new THREE.MeshStandardMaterial({
      color: COLORS.PLAYER_SUIT,
      roughness: 0.4,
      metalness: 0.1,
    });

    const visorMat = new THREE.MeshPhysicalMaterial({
      color: COLORS.PLAYER_VISOR,
      roughness: 0.1,
      metalness: 0.9,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
    });

    const backpackMat = new THREE.MeshStandardMaterial({
      color: COLORS.PLAYER_BACKPACK,
      roughness: 0.3,
      metalness: 0.15,
    });

    const nozzleMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.2,
      metalness: 0.8,
    });

    const shoeMat = new THREE.MeshStandardMaterial({
      color: COLORS.PLAYER_SHOES,
      roughness: 0.5,
    });

    const gloveMat = new THREE.MeshStandardMaterial({
      color: COLORS.PLAYER_GLOVES,
      roughness: 0.3,
    });

    // 3. Torso / Body (Chubby rounded capsule)
    const bodyGeo = new THREE.CylinderGeometry(0.34, 0.3, 0.48, 16);
    this.bodyMesh = new THREE.Mesh(bodyGeo, suitMat);
    this.bodyMesh.position.y = 0.52;
    this.bodyMesh.castShadow = true;
    this.group.add(this.bodyMesh);

    // 4. Head
    const headGeo = new THREE.SphereGeometry(0.36, 18, 16);
    this.headMesh = new THREE.Mesh(headGeo, bodyMat);
    this.headMesh.position.y = 0.94;
    this.headMesh.castShadow = true;
    this.group.add(this.headMesh);

    // 5. Visor / Face shield (sleek curved face mask)
    const visorGeo = new THREE.SphereGeometry(0.24, 16, 12, 0, Math.PI);
    this.visorMesh = new THREE.Mesh(visorGeo, visorMat);
    this.visorMesh.position.set(0, 0.94, 0.22);
    this.visorMesh.rotation.x = Math.PI / 2;
    this.visorMesh.scale.set(1.1, 0.7, 0.65);
    this.visorMesh.castShadow = true;
    this.group.add(this.visorMesh);

    // 6. Backpack / Jetpack
    const packGeo = new THREE.BoxGeometry(0.36, 0.42, 0.2);
    this.backpackMesh = new THREE.Mesh(packGeo, backpackMat);
    this.backpackMesh.position.set(0, 0.58, -0.26);
    this.backpackMesh.castShadow = true;
    this.group.add(this.backpackMesh);

    // Jetpack nozzles
    const nozzleGeo = new THREE.CylinderGeometry(0.06, 0.08, 0.16, 10);
    this.nozzleLeft = new THREE.Mesh(nozzleGeo, nozzleMat);
    this.nozzleLeft.position.set(-0.1, 0.34, -0.26);
    this.group.add(this.nozzleLeft);

    this.nozzleRight = new THREE.Mesh(nozzleGeo, nozzleMat);
    this.nozzleRight.position.set(0.1, 0.34, -0.26);
    this.group.add(this.nozzleRight);

    // 7. Left Arm & Hand
    this.leftArm = new THREE.Group();
    this.leftArm.position.set(-0.42, 0.65, 0);
    const armGeo = new THREE.CapsuleGeometry(0.09, 0.24, 8, 8);
    const leftArmMesh = new THREE.Mesh(armGeo, suitMat);
    leftArmMesh.position.y = -0.12;
    leftArmMesh.castShadow = true;
    this.leftArm.add(leftArmMesh);

    const handGeo = new THREE.SphereGeometry(0.11, 10, 10);
    const leftHandMesh = new THREE.Mesh(handGeo, gloveMat);
    leftHandMesh.position.y = -0.26;
    leftHandMesh.castShadow = true;
    this.leftArm.add(leftHandMesh);
    this.group.add(this.leftArm);

    // 8. Right Arm & Hand
    this.rightArm = new THREE.Group();
    this.rightArm.position.set(0.42, 0.65, 0);
    const rightArmMesh = new THREE.Mesh(armGeo, suitMat);
    rightArmMesh.position.y = -0.12;
    rightArmMesh.castShadow = true;
    this.rightArm.add(rightArmMesh);

    const rightHandMesh = new THREE.Mesh(handGeo, gloveMat);
    rightHandMesh.position.y = -0.26;
    rightHandMesh.castShadow = true;
    this.rightArm.add(rightHandMesh);
    this.group.add(this.rightArm);

    // 9. Left Leg & Shoe
    this.leftLeg = new THREE.Group();
    this.leftLeg.position.set(-0.18, 0.32, 0);
    const legGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.22, 10);
    const leftLegMesh = new THREE.Mesh(legGeo, suitMat);
    leftLegMesh.position.y = -0.06;
    leftLegMesh.castShadow = true;
    this.leftLeg.add(leftLegMesh);

    const shoeGeo = new THREE.BoxGeometry(0.2, 0.12, 0.28);
    const leftShoeMesh = new THREE.Mesh(shoeGeo, shoeMat);
    leftShoeMesh.position.set(0, -0.18, 0.04);
    leftShoeMesh.castShadow = true;
    this.leftLeg.add(leftShoeMesh);
    this.group.add(this.leftLeg);

    // 10. Right Leg & Shoe
    this.rightLeg = new THREE.Group();
    this.rightLeg.position.set(0.18, 0.32, 0);
    const rightLegMesh = new THREE.Mesh(legGeo, suitMat);
    rightLegMesh.position.y = -0.06;
    rightLegMesh.castShadow = true;
    this.rightLeg.add(rightLegMesh);

    const rightShoeMesh = new THREE.Mesh(shoeGeo, shoeMat);
    rightShoeMesh.position.set(0, -0.18, 0.04);
    rightShoeMesh.castShadow = true;
    this.rightLeg.add(rightShoeMesh);
    this.group.add(this.rightLeg);

    // Set bottom-center pivot
    this.group.position.y = 0;
  }

  public setRotation(yaw: number) {
    this.targetYaw = yaw;
  }

  public triggerSquash() {
    this.squashTime = 0.2; // 200ms landing squash
  }

  public triggerJumpStretch() {
    this.jumpStretch = 1.25;
  }

  public update(dt: number, speed: number, isGrounded: boolean, velocityY: number) {
    // Smooth character rotation toward moving direction
    const angleDiff = Math.atan2(Math.sin(this.targetYaw - this.currentYaw), Math.cos(this.targetYaw - this.currentYaw));
    this.currentYaw += angleDiff * Math.min(1.0, dt * 14.0);
    this.group.rotation.y = this.currentYaw;

    // Jumping / Airborne animations
    if (!isGrounded) {
      this.jumpStretch = THREE.MathUtils.damp(this.jumpStretch, 1.1, 8.0, dt);
      const stretchY = velocityY > 0 ? 1.2 : 0.95;
      const stretchXZ = 1.0 / Math.sqrt(stretchY);
      this.group.scale.set(stretchXZ, stretchY, stretchXZ);

      // Tuck legs slightly
      this.leftLeg.rotation.x = -0.4;
      this.rightLeg.rotation.x = -0.3;
      // Raise arms
      this.leftArm.rotation.x = 2.2;
      this.rightArm.rotation.x = 2.2;
      this.leftArm.rotation.z = -0.3;
      this.rightArm.rotation.z = 0.3;
      return;
    }

    // Landing squash recovery
    if (this.squashTime > 0) {
      this.squashTime -= dt;
      const t = Math.max(0, this.squashTime / 0.2);
      const squashY = 0.85 + 0.15 * (1 - t);
      const squashXZ = 1.0 / Math.sqrt(squashY);
      this.group.scale.set(squashXZ, squashY, squashXZ);
    } else {
      this.group.scale.set(1, 1, 1);
    }

    // Walk cycle
    if (speed > 0.4) {
      this.walkTime += dt * speed * 2.2;
      const legAngle = Math.sin(this.walkTime) * 0.75;
      this.leftLeg.rotation.x = legAngle;
      this.rightLeg.rotation.x = -legAngle;

      this.leftArm.rotation.x = -legAngle * 0.8;
      this.rightArm.rotation.x = legAngle * 0.8;
      this.leftArm.rotation.z = -0.15;
      this.rightArm.rotation.z = 0.15;

      // Bobbing body
      const bob = Math.abs(Math.sin(this.walkTime * 2.0)) * 0.08;
      this.bodyMesh.position.y = 0.52 + bob;
      this.headMesh.position.y = 0.94 + bob;
      this.visorMesh.position.y = 0.94 + bob;
      this.backpackMesh.position.y = 0.58 + bob;
    } else {
      // Idle breathing
      this.walkTime += dt * 2.5;
      const breathe = Math.sin(this.walkTime) * 0.02;
      this.bodyMesh.position.y = 0.52 + breathe;
      this.headMesh.position.y = 0.94 + breathe;
      this.visorMesh.position.y = 0.94 + breathe;
      this.backpackMesh.position.y = 0.58 + breathe;

      this.leftLeg.rotation.x = THREE.MathUtils.damp(this.leftLeg.rotation.x, 0, 10.0, dt);
      this.rightLeg.rotation.x = THREE.MathUtils.damp(this.rightLeg.rotation.x, 0, 10.0, dt);
      this.leftArm.rotation.x = THREE.MathUtils.damp(this.leftArm.rotation.x, 0, 10.0, dt);
      this.rightArm.rotation.x = THREE.MathUtils.damp(this.rightArm.rotation.x, 0, 10.0, dt);
      this.leftArm.rotation.z = THREE.MathUtils.damp(this.leftArm.rotation.z, -0.15, 10.0, dt);
      this.rightArm.rotation.z = THREE.MathUtils.damp(this.rightArm.rotation.z, 0.15, 10.0, dt);
    }
  }

  public updateShadow(groundY: number | null, playerY: number) {
    if (groundY !== null && playerY >= groundY - 0.2) {
      this.shadowMesh.visible = true;
      this.shadowMesh.position.set(this.group.position.x, groundY + 0.02, this.group.position.z);
      const heightAbove = Math.max(0, playerY - groundY);
      const scale = Math.max(0.3, 1.0 - heightAbove * 0.15);
      this.shadowMesh.scale.set(scale, scale, scale);
      (this.shadowMesh.material as THREE.MeshBasicMaterial).opacity = Math.max(0.1, 0.45 - heightAbove * 0.07);
    } else {
      this.shadowMesh.visible = false;
    }
  }
}
