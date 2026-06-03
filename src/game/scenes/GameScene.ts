// ============================================================
// GameScene — Core Claw Machine Gameplay
// ============================================================
// Implements the full claw machine: physics, claw movement,
// rope chain, grab mechanics, prize spawning, and visual effects.

import Phaser from 'phaser';
import { EventBus } from '../EventBus';
import { getPrizePool, getThemeColors } from '../data/prizes';
import { GrabSystem } from '../systems/GrabSystem';
import { soundSystem } from '../systems/SoundSystem';
import { ClawState, MachineTheme } from '../../types';
import type { Prize, ThemeColors, GrabResult } from '../../types';

// ── Layout Constants ──────────────────────────────────────────
const GAME_W = 480;
const GAME_H = 800;
const FRAME_THICKNESS = 18;
const RAIL_Y = 90;                       // Y position of the rail
const PLAY_LEFT = FRAME_THICKNESS + 12;  // Left boundary for claw
const PLAY_RIGHT = GAME_W - FRAME_THICKNESS - 70; // Right boundary (leave room for chute)
const CHUTE_X = GAME_W - FRAME_THICKNESS - 35;    // Prize chute X
const CHUTE_TOP_Y = 200;                 // Top of chute opening
const FLOOR_Y = GAME_H - FRAME_THICKNESS - 20;    // Floor where prizes sit
const PRIZE_AREA_TOP = 400;              // Top of prize area
const CLAW_MOVE_SPEED = 3.5;             // Pixels per frame
const DROP_SPEED = 4;                    // Claw drop speed
const RISE_SPEED = 2.5;                  // Claw rise speed
const RETURN_SPEED = 3;                  // Horizontal return speed
const MAX_DROP_Y = FLOOR_Y - 40;        // How far claw can drop
const ROPE_SEGMENTS = 6;                 // Number of rope chain links
const ROPE_SEG_LENGTH = 18;             // Length per rope segment

// ── Collision Categories ──────────────────────────────────────
const CAT_WALL   = 0x0001;
const CAT_PRIZE  = 0x0002;
const CAT_CLAW   = 0x0004;
const CAT_SENSOR = 0x0008;

// ── Prize Physics Body Tracking ───────────────────────────────
interface PrizeBody {
  body: MatterJS.BodyType;
  prize: Prize;
  sprite: Phaser.GameObjects.Image;
  emojiText: Phaser.GameObjects.Text;
}

export class GameScene extends Phaser.Scene {
  // ── Theme ──────────────────────────────────────────────
  private currentTheme: MachineTheme = MachineTheme.TOYS;
  private colors!: ThemeColors;

  // ── Claw State Machine ─────────────────────────────────
  private clawState: ClawState = ClawState.IDLE;
  private clawX = GAME_W / 2;         // Current claw carriage X
  // private clawTargetY = RAIL_Y + 30;  // Current claw head Y target
  private clawCurrentY = RAIL_Y + 30; // Actual claw head Y (animated)
  private moveDir = 0;                // -1 left, 0 stop, +1 right
  private uiMoveDir = 0;

  // ── Rope & Claw Physics ────────────────────────────────
  private carriageBody!: MatterJS.BodyType;
  private ropeSegments: MatterJS.BodyType[] = [];
  private ropeConstraints: MatterJS.ConstraintType[] = [];
  private clawBody!: MatterJS.BodyType;
  private clawSensor!: MatterJS.BodyType;

  // ── Graphics layers ────────────────────────────────────
  // private bgLayer!: Phaser.GameObjects.Image;
  private frameLayer!: Phaser.GameObjects.Image;
  // private glassLayer!: Phaser.GameObjects.Image;
  // private railSprite!: Phaser.GameObjects.Image;
  // private chuteSprite!: Phaser.GameObjects.Image;
  private carriageSprite!: Phaser.GameObjects.Image;
  private clawSprite!: Phaser.GameObjects.Image;
  private ropeGraphics!: Phaser.GameObjects.Graphics;
  private neonGraphics!: Phaser.GameObjects.Graphics;
  private shadowGraphics!: Phaser.GameObjects.Graphics;

  // ── Prizes ─────────────────────────────────────────────
  private prizeBodies: PrizeBody[] = [];
  private grabbedPrize: PrizeBody | null = null;
  private grabConstraint: MatterJS.ConstraintType | null = null;

  // ── Grab Mechanics ─────────────────────────────────────
  private consecutiveFailures = 0;
  private totalWins = 0;
  private gripStrength = 0.90; // Base grip strength (Increased to make catching easier)

  // ── Visual Effects ─────────────────────────────────────
  private dustParticles: Phaser.GameObjects.Image[] = [];
  private neonPulse = 0;

  // ── Input ──────────────────────────────────────────────
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private keyA!: Phaser.Input.Keyboard.Key;
  private keyD!: Phaser.Input.Keyboard.Key;
  private keySpace!: Phaser.Input.Keyboard.Key;

  constructor() {
    super({ key: 'GameScene' });
  }

  // ════════════════════════════════════════════════════════
  // LIFECYCLE
  // ════════════════════════════════════════════════════════

  create(): void {
    this.colors = getThemeColors(this.currentTheme)!;

    // Initialize sound system
    soundSystem.init();

    // ── Create visual layers (back to front) ─────────────
    this.createMachine();
    this.createPhysicsWalls();
    this.createRopeAndClaw();
    this.spawnPrizes();
    this.createDustParticles();
    this.createNeonGlow();

    // Glass goes on top of everything
    this.add.image(GAME_W / 2, GAME_H / 2, 'glass-overlay')
      .setDepth(100)
      .setAlpha(0.6);

    // Frame on top of glass
    this.frameLayer.setDepth(101);

    // ── Input Setup ──────────────────────────────────────
    if (this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();
      this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
      this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
      this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    // ── EventBus Listeners ───────────────────────────────
    EventBus.on('move-left', this.onMoveLeft, this);
    EventBus.on('move-right', this.onMoveRight, this);
    EventBus.on('move-stop', this.onMoveStop, this);
    EventBus.on('drop-claw', this.onDropClaw, this);
    EventBus.on('change-theme', this.onChangeTheme, this);
    EventBus.on('game-reset', this.onGameReset, this);

    // ── Launch UI overlay scene ──────────────────────────
    this.scene.launch('UIScene');

    // Notify React that the scene is ready
    EventBus.emit('scene-ready', this);

    this.setClawState(ClawState.IDLE);
  }

  update(_time: number, delta: number): void {
    this.handleInput();
    this.updateClawStateMachine(delta);
    this.updateVisuals();
    this.updateDustParticles(delta);
    this.updateNeonGlow(delta);
  }

  // ════════════════════════════════════════════════════════
  // MACHINE RENDERING
  // ════════════════════════════════════════════════════════

  private createMachine(): void {
    // Background
    this.add.image(GAME_W / 2, GAME_H / 2, 'machine-bg')
      .setDepth(0);

    // Frame (rendered on top later)
    this.frameLayer = this.add.image(GAME_W / 2, GAME_H / 2, 'metal-frame')
      .setDepth(10);

    // Rail track
    this.add.image(GAME_W / 2 - 10, RAIL_Y, 'rail')
      .setDepth(5);

    // Prize chute
    this.add.image(CHUTE_X, CHUTE_TOP_Y + 100, 'prize-chute')
      .setDepth(3);

    // Shadow layer for prizes
    this.shadowGraphics = this.add.graphics().setDepth(4);

    // Rope drawing layer
    this.ropeGraphics = this.add.graphics().setDepth(50);

    // Neon glow layer
    this.neonGraphics = this.add.graphics().setDepth(99);
  }

  // ════════════════════════════════════════════════════════
  // PHYSICS WALLS
  // ════════════════════════════════════════════════════════

  private createPhysicsWalls(): void {
    const wallOpts: Phaser.Types.Physics.Matter.MatterBodyConfig = {
      isStatic: true,
      friction: 0.3,
      restitution: 0.2,
      collisionFilter: {
        category: CAT_WALL,
        mask: CAT_PRIZE | CAT_CLAW,
      },
    };

    // Floor
    this.matter.add.rectangle(GAME_W / 2, FLOOR_Y + 10, GAME_W - FRAME_THICKNESS * 2 - 60, 20, wallOpts);

    // Left wall
    this.matter.add.rectangle(FRAME_THICKNESS + 5, GAME_H / 2, 10, GAME_H, wallOpts);

    // Right wall (stop before chute)
    this.matter.add.rectangle(GAME_W - FRAME_THICKNESS - 65, GAME_H / 2 + 200, 10, GAME_H - 400, wallOpts);

    // Chute floor (angled guide)
    this.matter.add.rectangle(CHUTE_X, FLOOR_Y + 10, 60, 20, wallOpts);

    // Shelf / divider between main area and chute at top
    this.matter.add.rectangle(GAME_W - FRAME_THICKNESS - 65, CHUTE_TOP_Y - 10, 10, 20, wallOpts);
  }

  // ════════════════════════════════════════════════════════
  // ROPE & CLAW
  // ════════════════════════════════════════════════════════

  private createRopeAndClaw(): void {
    // ── Carriage (kinematic — moves with input) ──────────
    this.carriageBody = this.matter.add.rectangle(this.clawX, RAIL_Y + 10, 36, 16, {
      isStatic: true,
      collisionFilter: { category: 0, mask: 0 },  // No collisions
    });

    this.carriageSprite = this.add.image(this.clawX, RAIL_Y + 10, 'carriage')
      .setDepth(55);

    // ── Rope segments (chain of small bodies) ────────────
    let prevBody: MatterJS.BodyType = this.carriageBody;
    let prevY = RAIL_Y + 20;

    for (let i = 0; i < ROPE_SEGMENTS; i++) {
      const segY = prevY + ROPE_SEG_LENGTH;
      const seg = this.matter.add.rectangle(this.clawX, segY, 6, ROPE_SEG_LENGTH - 2, {
        mass: 0.05,
        friction: 0.1,
        frictionAir: 0.08,
        collisionFilter: { category: 0, mask: 0 },
      });

      // Constrain to previous segment
      const constraint = this.matter.add.constraint(prevBody, seg, ROPE_SEG_LENGTH * 0.5, 0.9, {
        pointA: prevBody === this.carriageBody ? { x: 0, y: 8 } : { x: 0, y: ROPE_SEG_LENGTH / 2 - 2 },
        pointB: { x: 0, y: -(ROPE_SEG_LENGTH / 2 - 2) },
      });

      this.ropeSegments.push(seg);
      this.ropeConstraints.push(constraint);
      prevBody = seg;
      prevY = segY;
    }

    // ── Claw head ────────────────────────────────────────
    this.clawCurrentY = prevY + 20;
    this.clawBody = this.matter.add.rectangle(this.clawX, this.clawCurrentY, 48, 48, {
      mass: 0.3,
      friction: 0.5,
      frictionAir: 0.1,
      collisionFilter: {
        category: CAT_CLAW,
        mask: CAT_WALL | CAT_PRIZE,
      },
    });

    // Constrain claw to last rope segment
    const clawConstraint = this.matter.add.constraint(prevBody, this.clawBody, ROPE_SEG_LENGTH * 0.4, 0.8, {
      pointA: { x: 0, y: ROPE_SEG_LENGTH / 2 - 2 },
      pointB: { x: 0, y: -20 },
    });
    this.ropeConstraints.push(clawConstraint);

    // ── Claw sensor (detects prize overlap) ──────────────
    this.clawSensor = this.matter.add.rectangle(this.clawX, this.clawCurrentY + 10, 40, 20, {
      isSensor: true,
      isStatic: false,
      collisionFilter: {
        category: CAT_SENSOR,
        mask: CAT_PRIZE,
      },
    });

    // Keep sensor attached to claw
    this.matter.add.constraint(this.clawBody, this.clawSensor, 0, 1, {
      pointA: { x: 0, y: 12 },
      pointB: { x: 0, y: 0 },
    });

    // Claw sprite
    this.clawSprite = this.add.image(this.clawX, this.clawCurrentY, 'claw-open')
      .setDepth(60)
      .setScale(1.2);
  }

  // ════════════════════════════════════════════════════════
  // PRIZE SPAWNING
  // ════════════════════════════════════════════════════════

  private spawnPrizes(): void {
    // Clear existing prizes
    for (const pb of this.prizeBodies) {
      this.matter.world.remove(pb.body);
      pb.sprite.destroy();
      pb.emojiText.destroy();
    }
    this.prizeBodies = [];

    const pool = getPrizePool(this.currentTheme);
    const count = Phaser.Math.Between(8, 12);

    // Pick random prizes from the pool
    const selected: Prize[] = [];
    for (let i = 0; i < count; i++) {
      selected.push(pool[Phaser.Math.Between(0, pool.length - 1)]);
    }

    for (const prize of selected) {
      const x = Phaser.Math.Between(PLAY_LEFT + 30, PLAY_RIGHT - 30);
      const y = Phaser.Math.Between(PRIZE_AREA_TOP, FLOOR_Y - 60);

      const bodySize = 20 * prize.size;
      const body = this.matter.add.rectangle(x, y, bodySize, bodySize, {
        mass: 0.2 + prize.weight * 0.15,
        friction: 0.4,
        restitution: 0.3,
        frictionAir: 0.02,
        angle: Phaser.Math.FloatBetween(-0.3, 0.3),
        collisionFilter: {
          category: CAT_PRIZE,
          mask: CAT_WALL | CAT_PRIZE | CAT_CLAW | CAT_SENSOR,
        },
      });

      // Create tinted sprite for the prize
      const texKey = `prize-${prize.shape}`;
      const sprite = this.add.image(x, y, texKey)
        .setTint(Phaser.Display.Color.HexStringToColor(prize.color).color)
        .setScale(prize.size * 0.9)
        .setDepth(20);

      // Create emoji text
      const fontSize = Math.floor(18 * prize.size);
      const emojiText = this.add.text(x, y, prize.emoji, {
        fontSize: `${fontSize}px`,
        fontFamily: 'sans-serif'
      }).setOrigin(0.5).setDepth(20);

      this.prizeBodies.push({ body, prize, sprite, emojiText });
    }
  }

  // ════════════════════════════════════════════════════════
  // INPUT HANDLING
  // ════════════════════════════════════════════════════════

  private handleInput(): void {
    if (!this.input.keyboard) return;

    // Only allow movement input in IDLE or MOVING state
    if (this.clawState === ClawState.IDLE || this.clawState === ClawState.MOVING) {
      let keyboardMoveDir = 0;

      if (this.cursors.left.isDown || this.keyA.isDown) {
        keyboardMoveDir = -1;
      } else if (this.cursors.right.isDown || this.keyD.isDown) {
        keyboardMoveDir = 1;
      }

      // Combine inputs: keyboard overrides UI buttons
      this.moveDir = keyboardMoveDir !== 0 ? keyboardMoveDir : this.uiMoveDir;
      const moving = this.moveDir !== 0;

      if (moving && this.clawState === ClawState.IDLE) {
        this.setClawState(ClawState.MOVING);
      } else if (!moving && this.clawState === ClawState.MOVING) {
        this.setClawState(ClawState.IDLE);
      }

      // Drop claw
      if (Phaser.Input.Keyboard.JustDown(this.keySpace) || Phaser.Input.Keyboard.JustDown(this.cursors.down)) {
        this.startDrop();
      }
    }
  }

  // ── EventBus input handlers ────────────────────────────

  private onMoveLeft(): void {
    this.uiMoveDir = -1;
  }

  private onMoveRight(): void {
    this.uiMoveDir = 1;
  }

  private onMoveStop(): void {
    this.uiMoveDir = 0;
  }

  private onDropClaw(): void {
    this.startDrop();
  }

  private onChangeTheme(theme: MachineTheme): void {
    this.currentTheme = theme;
    this.colors = getThemeColors(theme)!;
    this.spawnPrizes();
  }

  private onGameReset(): void {
    this.consecutiveFailures = 0;
    this.totalWins = 0;
    this.spawnPrizes();
    this.resetClawPosition();
    this.setClawState(ClawState.IDLE);
  }

  // ════════════════════════════════════════════════════════
  // CLAW STATE MACHINE
  // ════════════════════════════════════════════════════════

  private setClawState(state: ClawState): void {
    this.clawState = state;
    EventBus.emit('claw-state-change', state);
  }

  private startDrop(): void {
    if (this.clawState !== ClawState.IDLE && this.clawState !== ClawState.MOVING) return;

    this.moveDir = 0;
    // this.clawTargetY = MAX_DROP_Y;
    // this.isClawOpen = true;
    this.setClawState(ClawState.DROPPING);
    soundSystem.play('clawDrop');
  }

  private updateClawStateMachine(delta: number): void {
    const dt = delta / 16.667; // Normalize to 60fps

    switch (this.clawState) {
      case ClawState.IDLE:
      case ClawState.MOVING:
        this.updateClawMovement(dt);
        break;

      case ClawState.DROPPING:
        this.updateClawDrop(dt);
        break;

      case ClawState.GRABBING:
        // Handled by timed callback
        break;

      case ClawState.RISING:
        this.updateClawRise(dt);
        break;

      case ClawState.RETURNING:
        this.updateClawReturn(dt);
        break;

      case ClawState.DELIVERING:
        // Handled by timed callback
        break;
    }

    // Always update the carriage body position to match clawX
    this.matter.body.setPosition(this.carriageBody, { x: this.clawX, y: RAIL_Y + 10 });
  }

  // ── Movement (left/right) ─────────────────────────────

  private updateClawMovement(dt: number): void {
    if (this.moveDir !== 0) {
      this.clawX += this.moveDir * CLAW_MOVE_SPEED * dt;
      this.clawX = Phaser.Math.Clamp(this.clawX, PLAY_LEFT + 20, PLAY_RIGHT - 20);
    }
  }

  // ── Drop ───────────────────────────────────────────────

  private updateClawDrop(dt: number): void {
    let dropping = false;
    const targetMaxLen = 80; // Adjusted to a sweet spot (avoids ugly slack rope but reaches toys)
    const speedPerConstraint = DROP_SPEED / this.ropeConstraints.length;

    for (const constraint of this.ropeConstraints) {
      if (constraint.length < targetMaxLen) {
        constraint.length += speedPerConstraint * dt;
        dropping = true;
      }
    }

    // Apply gentle downward velocity to keep rope taut
    this.matter.body.setVelocity(this.clawBody, { x: 0, y: DROP_SPEED });

    // When the rope is fully unspooled, grab! 
    // (If it hits a plushie early, the rope goes slack like a real machine until fully unspooled)
    if (!dropping) {
      this.startGrab();
    }
  }

  // ── Grab ───────────────────────────────────────────────

  private startGrab(): void {
    this.setClawState(ClawState.GRABBING);
    // this.isClawOpen = false;
    this.clawSprite.setTexture('claw-closed');
    soundSystem.play('clawGrab');

    // Check what prize the claw sensor is touching
    const touchingPrize = this.findTouchingPrize();

    // Small delay for grab animation
    this.time.delayedCall(400, () => {
      if (touchingPrize) {
        // Calculate grab result
        const result = GrabSystem.calculateGrabSuccess(
          touchingPrize.prize,
          this.gripStrength,
          this.totalWins,
          this.consecutiveFailures
        );

        if (result.slippedAt === 'grab') {
          // Failed to grab — prize slips immediately
          this.handleGrabFail(result);
        } else {
          // Grabbed! Create constraint
          this.grabbedPrize = touchingPrize;
          this.grabConstraint = this.matter.add.constraint(this.clawBody, touchingPrize.body, 5, 0.3, {
            pointA: { x: 0, y: 24 },
            pointB: { x: 0, y: 0 },
          });

          // Store result for rise/return slip checks
          (this as Record<string, unknown>)._pendingResult = result;

          // Start rising
          this.setClawState(ClawState.RISING);
          soundSystem.play('clawRise');
        }
      } else {
        // Missed entirely
        const result = GrabSystem.calculateGrabSuccess(null, this.gripStrength, this.totalWins, this.consecutiveFailures);
        this.handleGrabFail(result);
      }
    });
  }

  private findTouchingPrize(): PrizeBody | null {
    const clawPos = this.clawBody.position;
    let closest: PrizeBody | null = null;
    let closestDist = Infinity;

    for (const pb of this.prizeBodies) {
      const dx = pb.body.position.x - clawPos.x;
      const dy = pb.body.position.y - clawPos.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const grabRange = 35 * pb.prize.size;

      if (dist < grabRange && dist < closestDist) {
        closest = pb;
        closestDist = dist;
      }
    }

    return closest;
  }

  // ── Rise ───────────────────────────────────────────────

  private updateClawRise(dt: number): void {
    const clawPos = this.clawBody.position;
    const targetY = RAIL_Y + 40;
    let rising = false;
    const speedPerConstraint = RISE_SPEED / this.ropeConstraints.length;

    for (let i = 0; i < this.ropeConstraints.length; i++) {
      const constraint = this.ropeConstraints[i];
      const targetLen = i === this.ropeConstraints.length - 1 ? ROPE_SEG_LENGTH * 0.4 : ROPE_SEG_LENGTH * 0.5;
      
      if (constraint.length > targetLen) {
        constraint.length -= speedPerConstraint * dt;
        if (constraint.length < targetLen) constraint.length = targetLen;
        rising = true;
      }
    }

    // Help physics by pulling claw up
    this.matter.body.setVelocity(this.clawBody, { x: 0, y: -RISE_SPEED });

      // Slip check during rise
      if (this.grabbedPrize) {
        const riseProgress = 1 - (clawPos.y - targetY) / (MAX_DROP_Y - targetY);
        const pendingResult = (this as Record<string, unknown>)._pendingResult as GrabResult | undefined;

        // Check slip from the pre-calculated result
        if (pendingResult && pendingResult.slippedAt === 'rise' && riseProgress > 0.3 && riseProgress < 0.7) {
          // Only slip once in the middle range for dramatic effect
          if (Math.random() < 0.15) {
            this.releasePrize();
            this.handleGrabFail(pendingResult);
            return;
          }
        }

        // Also check real-time slip for extra tension
        if (GrabSystem.checkRiseSlip(this.grabbedPrize.prize, riseProgress, this.consecutiveFailures * 0.05)) {
          const failResult: GrabResult = {
            success: false,
            prize: this.grabbedPrize.prize,
            slippedAt: 'rise',
            gripStrength: this.gripStrength,
            message: 'It slipped! 😱',
          };
          this.releasePrize();
          this.handleGrabFail(failResult);
          return;
        }
      }
    if (!rising || clawPos.y <= targetY + 10) {
      // Reached top — move to chute
      this.setClawState(ClawState.RETURNING);
    }
  }

  // ── Return to chute ────────────────────────────────────

  private updateClawReturn(dt: number): void {
    const targetX = CHUTE_X;
    const diff = targetX - this.clawX;

    if (Math.abs(diff) > 3) {
      this.clawX += Math.sign(diff) * RETURN_SPEED * dt;
    } else {
      this.clawX = targetX;

      // Check return slip
      const pendingResult = (this as Record<string, unknown>)._pendingResult as GrabResult | undefined;
      if (pendingResult && pendingResult.slippedAt === 'return') {
        this.releasePrize();
        this.handleGrabFail(pendingResult);
        return;
      }

      // Deliver prize!
      this.deliverPrize();
    }
  }

  // ── Deliver ────────────────────────────────────────────

  private deliverPrize(): void {
    this.setClawState(ClawState.DELIVERING);

    if (this.grabbedPrize) {
      // Release into chute
      this.releasePrize();
      const pendingResult = (this as Record<string, unknown>)._pendingResult as GrabResult | undefined;

      // Remove the prize from the play field
      const idx = this.prizeBodies.indexOf(this.grabbedPrize);
      if (idx >= 0) {
        this.matter.world.remove(this.grabbedPrize.body);
        this.grabbedPrize.sprite.destroy();
        this.grabbedPrize.emojiText.destroy();
        this.prizeBodies.splice(idx, 1);
      }

      // Emit success
      const result: GrabResult = pendingResult && pendingResult.success ? pendingResult : {
        success: true,
        prize: this.grabbedPrize?.prize ?? null,
        slippedAt: null,
        gripStrength: this.gripStrength,
        message: 'NICE GRAB! 🎉',
      };

      this.consecutiveFailures = 0;
      this.totalWins++;

      soundSystem.play('prizeWin');
      this.cameras.main.shake(200, 0.005);

      EventBus.emit('grab-result', result);

      this.grabbedPrize = null;
    }

    // Reset claw after delay
    this.time.delayedCall(800, () => {
      this.resetClawPosition();
    });
  }

  // ── Fail Handling ──────────────────────────────────────

  private handleGrabFail(result: GrabResult): void {
    this.consecutiveFailures++;
    soundSystem.play('prizeFail');
    this.cameras.main.shake(150, 0.003);

    EventBus.emit('grab-result', result);

    // Reset claw
    this.time.delayedCall(600, () => {
      // this.isClawOpen = true;
      this.clawSprite.setTexture('claw-open');
      this.resetClawPosition();
    });
  }

  // ── Release Prize Constraint ───────────────────────────

  private releasePrize(): void {
    if (this.grabConstraint) {
      this.matter.world.removeConstraint(this.grabConstraint);
      this.grabConstraint = null;
    }
    // this.isClawOpen = true;
    this.clawSprite.setTexture('claw-open');
  }

  // ── Reset Claw to Start Position ───────────────────────

  private resetClawPosition(): void {
    // this.clawTargetY = RAIL_Y + 30;
    // this.isClawOpen = true;
    this.clawSprite.setTexture('claw-open');
    (this as Record<string, unknown>)._pendingResult = undefined;

    // Move claw back to center top
    const resetTween = () => {
      const targetY = RAIL_Y + 40;
      const targetX = GAME_W / 2;

      // Quick snap - set position directly over a few frames
      this.matter.body.setPosition(this.clawBody, {
        x: targetX,
        y: targetY,
      });
      this.clawX = targetX;

      // Reset rope segments
      for (let i = 0; i < this.ropeSegments.length; i++) {
        const segY = RAIL_Y + 20 + (i + 1) * ROPE_SEG_LENGTH;
        this.matter.body.setPosition(this.ropeSegments[i], {
          x: targetX,
          y: segY,
        });
        this.matter.body.setVelocity(this.ropeSegments[i], { x: 0, y: 0 });
        this.matter.body.setAngularVelocity(this.ropeSegments[i], 0);
      }

      // Reset constraint lengths
      for (let i = 0; i < this.ropeConstraints.length; i++) {
        this.ropeConstraints[i].length = i === this.ropeConstraints.length - 1 ? ROPE_SEG_LENGTH * 0.4 : ROPE_SEG_LENGTH * 0.5;
      }

      this.matter.body.setVelocity(this.clawBody, { x: 0, y: 0 });
      this.matter.body.setAngularVelocity(this.clawBody, 0);

      this.setClawState(ClawState.IDLE);
    };

    // Small delay then reset
    this.time.delayedCall(100, resetTween);
  }

  // ════════════════════════════════════════════════════════
  // VISUAL UPDATES
  // ════════════════════════════════════════════════════════

  private updateVisuals(): void {
    // Update carriage sprite
    this.carriageSprite.setPosition(this.clawX, RAIL_Y + 10);

    // Update claw sprite to match physics body
    const clawPos = this.clawBody.position;
    this.clawSprite.setPosition(clawPos.x, clawPos.y);
    this.clawSprite.setRotation(this.clawBody.angle);

    // Draw rope
    this.drawRope();

    // Update prize sprites to match physics bodies
    this.updatePrizeSprites();

    // Draw shadows under prizes
    this.drawShadows();
  }

  private drawRope(): void {
    this.ropeGraphics.clear();

    // Chain color
    this.ropeGraphics.lineStyle(3, 0x888888, 1);
    this.ropeGraphics.beginPath();

    // Start at carriage
    this.ropeGraphics.moveTo(this.clawX, RAIL_Y + 18);

    // Through each rope segment
    for (const seg of this.ropeSegments) {
      this.ropeGraphics.lineTo(seg.position.x, seg.position.y);
    }

    // To claw head
    const clawPos = this.clawBody.position;
    this.ropeGraphics.lineTo(clawPos.x, clawPos.y - 20);

    this.ropeGraphics.strokePath();

    // Draw chain link details
    this.ropeGraphics.lineStyle(1, 0xaaaaaa, 0.5);
    for (const seg of this.ropeSegments) {
      const p = seg.position;
      this.ropeGraphics.strokeEllipse(p.x, p.y, 5, 8);
    }
  }

  private updatePrizeSprites(): void {
    for (const pb of this.prizeBodies) {
      pb.sprite.setPosition(pb.body.position.x, pb.body.position.y);
      pb.sprite.setRotation(pb.body.angle);
      
      pb.emojiText.setPosition(pb.body.position.x, pb.body.position.y);
      pb.emojiText.setRotation(pb.body.angle);
    }
  }

  private drawShadows(): void {
    this.shadowGraphics.clear();
    this.shadowGraphics.fillStyle(0x000000, 0.15);

    for (const pb of this.prizeBodies) {
      const x = pb.body.position.x;
      const shadowY = FLOOR_Y - 2;
      const shadowWidth = 16 * pb.prize.size;
      this.shadowGraphics.fillEllipse(x, shadowY, shadowWidth, 6);
    }
  }

  // ════════════════════════════════════════════════════════
  // VISUAL EFFECTS
  // ════════════════════════════════════════════════════════

  private createDustParticles(): void {
    for (let i = 0; i < 15; i++) {
      const x = Phaser.Math.Between(PLAY_LEFT + 10, PLAY_RIGHT - 10);
      const y = Phaser.Math.Between(PRIZE_AREA_TOP - 100, FLOOR_Y - 20);

      const dust = this.add.image(x, y, 'dust')
        .setAlpha(Phaser.Math.FloatBetween(0.05, 0.15))
        .setScale(Phaser.Math.FloatBetween(0.4, 1.2))
        .setDepth(15);

      // Store velocity data
      (dust as unknown as Record<string, unknown>)._vx = Phaser.Math.FloatBetween(-0.2, 0.2);
      (dust as unknown as Record<string, unknown>)._vy = Phaser.Math.FloatBetween(-0.3, -0.05);
      (dust as unknown as Record<string, unknown>)._baseAlpha = dust.alpha;

      this.dustParticles.push(dust);
    }
  }

  private updateDustParticles(_delta: number): void {
    for (const dust of this.dustParticles) {
      const vx = (dust as unknown as Record<string, unknown>)._vx as number;
      const vy = (dust as unknown as Record<string, unknown>)._vy as number;

      dust.x += vx;
      dust.y += vy;

      // Wrap around
      if (dust.y < PRIZE_AREA_TOP - 120) {
        dust.y = FLOOR_Y - 20;
        dust.x = Phaser.Math.Between(PLAY_LEFT + 10, PLAY_RIGHT - 10);
      }
      if (dust.x < PLAY_LEFT) dust.x = PLAY_RIGHT - 10;
      if (dust.x > PLAY_RIGHT) dust.x = PLAY_LEFT + 10;

      // Subtle alpha pulse
      const baseAlpha = (dust as unknown as Record<string, unknown>)._baseAlpha as number;
      dust.setAlpha(baseAlpha + Math.sin(this.time.now * 0.002 + dust.x) * 0.03);
    }
  }

  private createNeonGlow(): void {
    // Neon glow is drawn dynamically in updateNeonGlow
  }

  private updateNeonGlow(delta: number): void {
    this.neonPulse += delta * 0.003;
    const pulse = 0.3 + Math.sin(this.neonPulse) * 0.15;

    const neonColor = Phaser.Display.Color.HexStringToColor(this.colors.neon).color;

    this.neonGraphics.clear();
    this.neonGraphics.lineStyle(2, neonColor, pulse);

    // Top edge glow
    this.neonGraphics.lineBetween(FRAME_THICKNESS, FRAME_THICKNESS + 50, GAME_W - FRAME_THICKNESS, FRAME_THICKNESS + 50);

    // Bottom edge glow
    this.neonGraphics.lineBetween(FRAME_THICKNESS, FLOOR_Y + 5, GAME_W - FRAME_THICKNESS, FLOOR_Y + 5);

    // Side edge glows
    this.neonGraphics.lineBetween(FRAME_THICKNESS, FRAME_THICKNESS + 50, FRAME_THICKNESS, FLOOR_Y + 5);
    this.neonGraphics.lineBetween(GAME_W - FRAME_THICKNESS, FRAME_THICKNESS + 50, GAME_W - FRAME_THICKNESS, FLOOR_Y + 5);

    // Glow dots at corners
    const glowAlpha = 0.4 + Math.sin(this.neonPulse * 1.5) * 0.2;
    this.neonGraphics.fillStyle(neonColor, glowAlpha);
    this.neonGraphics.fillCircle(FRAME_THICKNESS, FRAME_THICKNESS + 50, 4);
    this.neonGraphics.fillCircle(GAME_W - FRAME_THICKNESS, FRAME_THICKNESS + 50, 4);
    this.neonGraphics.fillCircle(FRAME_THICKNESS, FLOOR_Y + 5, 4);
    this.neonGraphics.fillCircle(GAME_W - FRAME_THICKNESS, FLOOR_Y + 5, 4);
  }

  // ════════════════════════════════════════════════════════
  // CLEANUP
  // ════════════════════════════════════════════════════════

  shutdown(): void {
    EventBus.off('move-left', this.onMoveLeft, this);
    EventBus.off('move-right', this.onMoveRight, this);
    EventBus.off('move-stop', this.onMoveStop, this);
    EventBus.off('drop-claw', this.onDropClaw, this);
    EventBus.off('change-theme', this.onChangeTheme, this);
    EventBus.off('game-reset', this.onGameReset, this);
  }
}
