// ============================================================
// UIScene — Floating UI Effects & Win Celebration Overlay
// ============================================================
// Runs in parallel to GameScene. Displays floating text,
// win/fail messages, and particle celebrations.

import Phaser from 'phaser';
import { EventBus } from '../EventBus';
import type { GrabResult } from '../../types';

export class UIScene extends Phaser.Scene {
  constructor() {
    super({ key: 'UIScene' });
  }

  create(): void {
    // ── Listen for grab results ───────────────────────────
    EventBus.on('grab-result', this.onGrabResult, this);

    // ── Listen for state changes for minor feedback ───────
    EventBus.on('claw-state-change', this.onClawStateChange, this);
  }

  private onGrabResult(result: GrabResult): void {
    if (result.success) {
      this.showWinCelebration(result);
    } else {
      this.showFailMessage(result);
    }
  }

  private onClawStateChange(state: string): void {
    if (state === 'GRABBING') {
      this.showFloatingText('GRAB!', 0xffff00, false);
    }
  }

  // ── Win Celebration ─────────────────────────────────────

  private showWinCelebration(result: GrabResult): void {
    const { width, height } = this.scale;
    const cx = width / 2;
    const cy = height / 2;

    // Big win text
    const winText = this.add.text(cx, cy - 60, result.message, {
      fontFamily: 'Arial Black, Arial, sans-serif',
      fontSize: '36px',
      color: '#FFD700',
      stroke: '#000000',
      strokeThickness: 6,
      align: 'center',
      shadow: {
        offsetX: 2,
        offsetY: 2,
        color: '#000',
        blur: 8,
        fill: true,
      },
    }).setOrigin(0.5).setAlpha(0).setScale(0.3);

    // Prize name
    const prizeName = result.prize ? result.prize.name : '';
    const prizeText = this.add.text(cx, cy + 10, prizeName, {
      fontFamily: 'Arial, sans-serif',
      fontSize: '22px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 4,
      align: 'center',
    }).setOrigin(0.5).setAlpha(0);

    // Animate in
    this.tweens.add({
      targets: winText,
      alpha: 1,
      scale: 1.1,
      duration: 400,
      ease: 'Back.easeOut',
      onComplete: () => {
        this.tweens.add({
          targets: winText,
          scale: 1.0,
          duration: 200,
          yoyo: true,
          repeat: 2,
          onComplete: () => {
            this.tweens.add({
              targets: [winText, prizeText],
              alpha: 0,
              y: '-=40',
              duration: 600,
              ease: 'Power2',
              onComplete: () => {
                winText.destroy();
                prizeText.destroy();
              },
            });
          },
        });
      },
    });

    this.tweens.add({
      targets: prizeText,
      alpha: 1,
      duration: 500,
      delay: 300,
      ease: 'Power2',
    });

    // Confetti particle burst
    this.spawnConfetti(cx, cy);

    // Sparkle particles
    this.spawnSparkles(cx, cy - 60);
  }

  // ── Fail Message ────────────────────────────────────────

  private showFailMessage(result: GrabResult): void {
    const { width } = this.scale;
    const cx = width / 2;

    const failText = this.add.text(cx, 300, result.message, {
      fontFamily: 'Arial, sans-serif',
      fontSize: '24px',
      color: '#ff6b6b',
      stroke: '#000000',
      strokeThickness: 4,
      align: 'center',
    }).setOrigin(0.5).setAlpha(0).setScale(0.5);

    this.tweens.add({
      targets: failText,
      alpha: 1,
      scale: 1,
      duration: 300,
      ease: 'Back.easeOut',
      onComplete: () => {
        this.tweens.add({
          targets: failText,
          alpha: 0,
          y: '-=50',
          duration: 800,
          delay: 600,
          ease: 'Power2',
          onComplete: () => failText.destroy(),
        });
      },
    });
  }

  // ── Floating Text ───────────────────────────────────────

  private showFloatingText(text: string, color: number, _big: boolean): void {
    const { width } = this.scale;
    const cx = width / 2;
    const colorStr = '#' + color.toString(16).padStart(6, '0');

    const floatText = this.add.text(cx, 350, text, {
      fontFamily: 'Arial, sans-serif',
      fontSize: '18px',
      color: colorStr,
      stroke: '#000000',
      strokeThickness: 3,
      align: 'center',
    }).setOrigin(0.5).setAlpha(0);

    this.tweens.add({
      targets: floatText,
      alpha: { from: 0, to: 1 },
      y: '-=30',
      duration: 400,
      ease: 'Power2',
      onComplete: () => {
        this.tweens.add({
          targets: floatText,
          alpha: 0,
          y: '-=20',
          duration: 500,
          delay: 300,
          onComplete: () => floatText.destroy(),
        });
      },
    });
  }

  // ── Confetti Particles ──────────────────────────────────

  private spawnConfetti(cx: number, cy: number): void {
    const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff, 0xffd700];

    for (let i = 0; i < 30; i++) {
      const confetti = this.add.image(cx, cy, 'confetti')
        .setTint(colors[Math.floor(Math.random() * colors.length)])
        .setScale(Phaser.Math.FloatBetween(0.5, 1.5))
        .setAlpha(0.9)
        .setAngle(Phaser.Math.Between(0, 360));

      this.tweens.add({
        targets: confetti,
        x: cx + Phaser.Math.Between(-200, 200),
        y: cy + Phaser.Math.Between(-150, 200),
        angle: Phaser.Math.Between(-360, 360),
        alpha: 0,
        scale: 0,
        duration: Phaser.Math.Between(800, 1500),
        ease: 'Power2',
        onComplete: () => confetti.destroy(),
      });
    }
  }

  // ── Sparkle Particles ───────────────────────────────────

  private spawnSparkles(cx: number, cy: number): void {
    for (let i = 0; i < 12; i++) {
      const sparkle = this.add.image(cx, cy, 'sparkle')
        .setTint(0xffd700)
        .setScale(0)
        .setAlpha(1);

      const angle = (i / 12) * Math.PI * 2;
      const dist = Phaser.Math.Between(40, 120);

      this.tweens.add({
        targets: sparkle,
        x: cx + Math.cos(angle) * dist,
        y: cy + Math.sin(angle) * dist,
        scale: { from: 0, to: Phaser.Math.FloatBetween(0.5, 1.5) },
        alpha: { from: 1, to: 0 },
        duration: Phaser.Math.Between(400, 900),
        delay: i * 30,
        ease: 'Power2',
        onComplete: () => sparkle.destroy(),
      });
    }
  }

  // ── Cleanup ─────────────────────────────────────────────

  shutdown(): void {
    EventBus.off('grab-result', this.onGrabResult, this);
    EventBus.off('claw-state-change', this.onClawStateChange, this);
  }
}
