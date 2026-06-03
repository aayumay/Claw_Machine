// ============================================================
// PreloadScene — Procedural Asset Generation
// ============================================================
// Generates ALL game textures programmatically using Phaser's
// Graphics API. Shows a loading progress bar while generating.

import Phaser from 'phaser';

export class PreloadScene extends Phaser.Scene {
  private progressBar!: Phaser.GameObjects.Graphics;
  private progressBox!: Phaser.GameObjects.Graphics;
  private loadingText!: Phaser.GameObjects.Text;
  private progressValue = 0;
  private totalSteps = 14;
  private currentStep = 0;

  constructor() {
    super({ key: 'PreloadScene' });
  }

  create(): void {
    const { width, height } = this.scale;
    const cx = width / 2;
    const cy = height / 2;

    // ── Loading UI ────────────────────────────────────────
    this.progressBox = this.add.graphics();
    this.progressBox.fillStyle(0x222222, 0.8);
    this.progressBox.fillRoundedRect(cx - 160, cy - 15, 320, 30, 8);

    this.progressBar = this.add.graphics();

    this.loadingText = this.add.text(cx, cy - 40, 'Generating assets...', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '16px',
      color: '#ffffff',
      align: 'center',
    }).setOrigin(0.5);

    // ── Generate all textures asynchronously ──────────────
    // Use a timer chain to spread generation across frames
    // so the progress bar actually animates.
    this.time.delayedCall(50, () => this.generateAll());
  }

  private updateProgress(label: string): void {
    this.currentStep++;
    this.progressValue = this.currentStep / this.totalSteps;
    this.loadingText.setText(label);

    const { width, height } = this.scale;
    const cx = width / 2;
    const cy = height / 2;
    const barWidth = 310 * this.progressValue;

    this.progressBar.clear();
    this.progressBar.fillStyle(0x00f5ff, 1);
    this.progressBar.fillRoundedRect(cx - 155, cy - 10, barWidth, 20, 6);
  }

  private generateAll(): void {
    this.generateClawOpen();
    this.updateProgress('Claw (open)...');

    this.generateClawClosed();
    this.updateProgress('Claw (closed)...');

    this.generateRopeSegment();
    this.updateProgress('Rope chain...');

    this.generatePrizeShapes();
    this.updateProgress('Prize shapes...');

    this.generateMachineBackground();
    this.updateProgress('Machine background...');

    this.generateGlassOverlay();
    this.updateProgress('Glass overlay...');

    this.generateMetalFrame();
    this.updateProgress('Metal frame...');

    this.generateRail();
    this.updateProgress('Rail track...');

    this.generatePrizeChute();
    this.updateProgress('Prize chute...');

    this.generateSparkle();
    this.updateProgress('Sparkle particle...');

    this.generateConfetti();
    this.updateProgress('Confetti particle...');

    this.generateGlow();
    this.updateProgress('Glow particle...');

    this.generateDustParticle();
    this.updateProgress('Dust particle...');

    this.generateCarriage();
    this.updateProgress('Claw carriage...');

    // ── Transition after a short delay ────────────────────
    this.time.delayedCall(300, () => {
      this.scene.start('GameScene');
    });
  }

  // ════════════════════════════════════════════════════════
  // TEXTURE GENERATORS
  // ════════════════════════════════════════════════════════

  private generateClawOpen(): void {
    const size = 64;
    const g = this.make.graphics({ x: 0, y: 0 });

    // Center hub
    g.fillStyle(0x888888, 1);
    g.fillCircle(size / 2, 12, 8);

    // Shaft from hub
    g.fillStyle(0x999999, 1);
    g.fillRect(size / 2 - 3, 4, 6, 14);

    // Left prong (open angle)
    g.lineStyle(4, 0xaaaaaa, 1);
    g.beginPath();
    g.moveTo(size / 2 - 4, 16);
    g.lineTo(size / 2 - 20, size - 8);
    g.lineTo(size / 2 - 16, size);
    g.strokePath();
    // Prong tip
    g.fillStyle(0xcccccc, 1);
    g.fillCircle(size / 2 - 18, size - 4, 4);

    // Right prong (open angle)
    g.lineStyle(4, 0xaaaaaa, 1);
    g.beginPath();
    g.moveTo(size / 2 + 4, 16);
    g.lineTo(size / 2 + 20, size - 8);
    g.lineTo(size / 2 + 16, size);
    g.strokePath();
    g.fillStyle(0xcccccc, 1);
    g.fillCircle(size / 2 + 18, size - 4, 4);

    // Center prong
    g.lineStyle(4, 0xaaaaaa, 1);
    g.beginPath();
    g.moveTo(size / 2, 16);
    g.lineTo(size / 2, size - 4);
    g.strokePath();
    g.fillStyle(0xcccccc, 1);
    g.fillCircle(size / 2, size - 2, 3);

    // Metallic highlights
    g.fillStyle(0xdddddd, 0.4);
    g.fillCircle(size / 2 - 2, 10, 3);

    g.generateTexture('claw-open', size, size);
    g.destroy();
  }

  private generateClawClosed(): void {
    const size = 64;
    const g = this.make.graphics({ x: 0, y: 0 });

    // Center hub
    g.fillStyle(0x888888, 1);
    g.fillCircle(size / 2, 12, 8);

    // Shaft
    g.fillStyle(0x999999, 1);
    g.fillRect(size / 2 - 3, 4, 6, 14);

    // Left prong (closed - more vertical)
    g.lineStyle(4, 0xaaaaaa, 1);
    g.beginPath();
    g.moveTo(size / 2 - 4, 16);
    g.lineTo(size / 2 - 8, size - 8);
    g.lineTo(size / 2 - 5, size);
    g.strokePath();
    g.fillStyle(0xcccccc, 1);
    g.fillCircle(size / 2 - 6, size - 4, 4);

    // Right prong (closed)
    g.lineStyle(4, 0xaaaaaa, 1);
    g.beginPath();
    g.moveTo(size / 2 + 4, 16);
    g.lineTo(size / 2 + 8, size - 8);
    g.lineTo(size / 2 + 5, size);
    g.strokePath();
    g.fillStyle(0xcccccc, 1);
    g.fillCircle(size / 2 + 6, size - 4, 4);

    // Center prong
    g.lineStyle(4, 0xaaaaaa, 1);
    g.beginPath();
    g.moveTo(size / 2, 16);
    g.lineTo(size / 2, size - 2);
    g.strokePath();
    g.fillStyle(0xcccccc, 1);
    g.fillCircle(size / 2, size, 3);

    // Metallic highlights
    g.fillStyle(0xdddddd, 0.4);
    g.fillCircle(size / 2 - 2, 10, 3);

    g.generateTexture('claw-closed', size, size);
    g.destroy();
  }

  private generateRopeSegment(): void {
    const g = this.make.graphics({ x: 0, y: 0 });
    const w = 8;
    const h = 12;

    // Chain link - oval
    g.lineStyle(2, 0x888888, 1);
    g.strokeEllipse(w / 2, h / 2, w - 2, h - 2);

    // Metallic shine
    g.fillStyle(0xaaaaaa, 0.5);
    g.fillEllipse(w / 2 - 1, h / 2 - 2, 2, 4);

    g.generateTexture('rope-segment', w, h);
    g.destroy();
  }

  private generatePrizeShapes(): void {
    const shapes = ['circle', 'square', 'star', 'heart', 'diamond', 'triangle'];
    const size = 40;

    for (const shape of shapes) {
      const g = this.make.graphics({ x: 0, y: 0 });

      // Shadow
      g.fillStyle(0x000000, 0.3);
      this.drawShape(g, shape, size / 2 + 2, size / 2 + 2, size * 0.38);

      // Main shape (white — will be tinted at runtime)
      g.fillStyle(0xffffff, 1);
      this.drawShape(g, shape, size / 2, size / 2, size * 0.36);

      // Inner highlight
      g.fillStyle(0xffffff, 0.35);
      this.drawShape(g, shape, size / 2 - 2, size / 2 - 2, size * 0.2);

      g.generateTexture(`prize-${shape}`, size, size);
      g.destroy();
    }
  }

  private drawShape(g: Phaser.GameObjects.Graphics, shape: string, cx: number, cy: number, r: number): void {
    switch (shape) {
      case 'circle':
        g.fillCircle(cx, cy, r);
        break;
      case 'square':
        g.fillRoundedRect(cx - r, cy - r, r * 2, r * 2, 3);
        break;
      case 'star':
        this.drawStar(g, cx, cy, 5, r, r * 0.5);
        break;
      case 'heart':
        this.drawHeart(g, cx, cy, r);
        break;
      case 'diamond':
        this.drawDiamond(g, cx, cy, r);
        break;
      case 'triangle':
        this.drawTriangle(g, cx, cy, r);
        break;
    }
  }

  private drawStar(g: Phaser.GameObjects.Graphics, cx: number, cy: number, points: number, outerR: number, innerR: number): void {
    const step = Math.PI / points;
    g.beginPath();
    for (let i = 0; i < points * 2; i++) {
      const r = i % 2 === 0 ? outerR : innerR;
      const angle = i * step - Math.PI / 2;
      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r;
      if (i === 0) g.moveTo(x, y);
      else g.lineTo(x, y);
    }
    g.closePath();
    g.fillPath();
  }

  private drawHeart(g: Phaser.GameObjects.Graphics, cx: number, cy: number, r: number): void {
    g.beginPath();
    const topY = cy - r * 0.4;
    // Left bump
    g.arc(cx - r * 0.35, topY, r * 0.45, Math.PI, 0, false);
    // Right bump
    g.arc(cx + r * 0.35, topY, r * 0.45, Math.PI, 0, false);
    // Bottom point
    g.lineTo(cx, cy + r * 0.8);
    g.closePath();
    g.fillPath();
  }

  private drawDiamond(g: Phaser.GameObjects.Graphics, cx: number, cy: number, r: number): void {
    g.beginPath();
    g.moveTo(cx, cy - r);
    g.lineTo(cx + r * 0.7, cy);
    g.lineTo(cx, cy + r);
    g.lineTo(cx - r * 0.7, cy);
    g.closePath();
    g.fillPath();
  }

  private drawTriangle(g: Phaser.GameObjects.Graphics, cx: number, cy: number, r: number): void {
    g.beginPath();
    g.moveTo(cx, cy - r);
    g.lineTo(cx + r, cy + r * 0.7);
    g.lineTo(cx - r, cy + r * 0.7);
    g.closePath();
    g.fillPath();
  }

  private generateMachineBackground(): void {
    const w = 480;
    const h = 800;
    const g = this.make.graphics({ x: 0, y: 0 });

    // Gradient background via horizontal bands
    for (let y = 0; y < h; y++) {
      const t = y / h;
      const r = Math.floor(20 + t * 15);
      const green = Math.floor(10 + t * 20);
      const b = Math.floor(40 + t * 20);
      g.fillStyle(Phaser.Display.Color.GetColor(r, green, b), 1);
      g.fillRect(0, y, w, 1);
    }

    // Subtle grid pattern
    g.lineStyle(1, 0xffffff, 0.02);
    for (let x = 0; x < w; x += 30) {
      g.lineBetween(x, 0, x, h);
    }
    for (let y = 0; y < h; y += 30) {
      g.lineBetween(0, y, w, y);
    }

    g.generateTexture('machine-bg', w, h);
    g.destroy();
  }

  private generateGlassOverlay(): void {
    const w = 480;
    const h = 800;
    const g = this.make.graphics({ x: 0, y: 0 });

    // Glass reflection streak (top-left to center)
    g.fillStyle(0xffffff, 0.04);
    g.beginPath();
    g.moveTo(40, 80);
    g.lineTo(160, 80);
    g.lineTo(80, 500);
    g.lineTo(20, 500);
    g.closePath();
    g.fillPath();

    // Secondary reflection
    g.fillStyle(0xffffff, 0.025);
    g.beginPath();
    g.moveTo(200, 80);
    g.lineTo(240, 80);
    g.lineTo(200, 400);
    g.lineTo(180, 400);
    g.closePath();
    g.fillPath();

    g.generateTexture('glass-overlay', w, h);
    g.destroy();
  }

  private generateMetalFrame(): void {
    const w = 480;
    const h = 800;
    const g = this.make.graphics({ x: 0, y: 0 });

    // Frame borders (thick metal edges)
    const frameWidth = 18;
    const frameColor = 0x4a4a5a;
    const highlightColor = 0x6a6a7a;

    // Left
    g.fillStyle(frameColor, 1);
    g.fillRect(0, 0, frameWidth, h);
    g.fillStyle(highlightColor, 0.5);
    g.fillRect(frameWidth - 3, 0, 3, h);

    // Right
    g.fillStyle(frameColor, 1);
    g.fillRect(w - frameWidth, 0, frameWidth, h);
    g.fillStyle(highlightColor, 0.5);
    g.fillRect(w - frameWidth, 0, 3, h);

    // Top
    g.fillStyle(frameColor, 1);
    g.fillRect(0, 0, w, frameWidth + 50);
    g.fillStyle(highlightColor, 0.5);
    g.fillRect(0, frameWidth + 47, w, 3);

    // Bottom
    g.fillStyle(frameColor, 1);
    g.fillRect(0, h - frameWidth - 10, w, frameWidth + 10);
    g.fillStyle(highlightColor, 0.5);
    g.fillRect(0, h - frameWidth - 10, w, 3);

    // Decorative screws in corners
    const screwPositions = [
      [12, 12], [w - 12, 12], [12, h - 12], [w - 12, h - 12],
      [12, 72], [w - 12, 72],
    ];
    for (const [sx, sy] of screwPositions) {
      g.fillStyle(0x888899, 1);
      g.fillCircle(sx, sy, 4);
      g.fillStyle(0x555566, 1);
      g.fillCircle(sx, sy, 2);
      g.lineStyle(1, 0x555566, 0.8);
      g.lineBetween(sx - 2, sy, sx + 2, sy);
    }

    g.generateTexture('metal-frame', w, h);
    g.destroy();
  }

  private generateRail(): void {
    const w = 400;
    const h = 16;
    const g = this.make.graphics({ x: 0, y: 0 });

    // Rail track
    g.fillStyle(0x666677, 1);
    g.fillRoundedRect(0, 2, w, 12, 4);

    // Rail groove
    g.fillStyle(0x444455, 1);
    g.fillRect(4, 6, w - 8, 4);

    // Highlights
    g.fillStyle(0x888899, 0.5);
    g.fillRect(4, 3, w - 8, 2);

    g.generateTexture('rail', w, h);
    g.destroy();
  }

  private generatePrizeChute(): void {
    const w = 60;
    const h = 200;
    const g = this.make.graphics({ x: 0, y: 0 });

    // Chute background
    g.fillStyle(0x222233, 0.9);
    g.fillRoundedRect(0, 0, w, h, 6);

    // Chute opening (darker)
    g.fillStyle(0x111122, 1);
    g.fillRoundedRect(5, 0, w - 10, 30, 4);

    // Side rails
    g.fillStyle(0x555566, 1);
    g.fillRect(0, 0, 5, h);
    g.fillRect(w - 5, 0, 5, h);

    // Highlight
    g.fillStyle(0x666677, 0.4);
    g.fillRect(2, 0, 2, h);

    g.generateTexture('prize-chute', w, h);
    g.destroy();
  }

  private generateSparkle(): void {
    const size = 16;
    const g = this.make.graphics({ x: 0, y: 0 });
    const c = size / 2;

    // 4-pointed star sparkle
    g.fillStyle(0xffffff, 1);
    g.beginPath();
    g.moveTo(c, 0);
    g.lineTo(c + 2, c - 2);
    g.lineTo(size, c);
    g.lineTo(c + 2, c + 2);
    g.lineTo(c, size);
    g.lineTo(c - 2, c + 2);
    g.lineTo(0, c);
    g.lineTo(c - 2, c - 2);
    g.closePath();
    g.fillPath();

    g.generateTexture('sparkle', size, size);
    g.destroy();
  }

  private generateConfetti(): void {
    const w = 8;
    const h = 12;
    const g = this.make.graphics({ x: 0, y: 0 });

    g.fillStyle(0xffffff, 1);
    g.fillRoundedRect(1, 1, w - 2, h - 2, 2);

    g.generateTexture('confetti', w, h);
    g.destroy();
  }

  private generateGlow(): void {
    const size = 32;
    const g = this.make.graphics({ x: 0, y: 0 });
    const c = size / 2;

    // Radial glow via concentric circles with decreasing alpha
    for (let i = 8; i >= 0; i--) {
      const alpha = 0.05 + (8 - i) * 0.03;
      const radius = c * (i / 8);
      g.fillStyle(0xffffff, alpha);
      g.fillCircle(c, c, radius);
    }

    g.generateTexture('glow', size, size);
    g.destroy();
  }

  private generateDustParticle(): void {
    const size = 6;
    const g = this.make.graphics({ x: 0, y: 0 });

    g.fillStyle(0xffffff, 0.4);
    g.fillCircle(size / 2, size / 2, size / 2);

    g.generateTexture('dust', size, size);
    g.destroy();
  }

  private generateCarriage(): void {
    const w = 40;
    const h = 20;
    const g = this.make.graphics({ x: 0, y: 0 });

    // Carriage body
    g.fillStyle(0x777788, 1);
    g.fillRoundedRect(0, 0, w, h, 4);

    // Highlight strip
    g.fillStyle(0x999aaa, 0.6);
    g.fillRect(4, 2, w - 8, 4);

    // Wheels
    g.fillStyle(0x555566, 1);
    g.fillCircle(8, h, 5);
    g.fillCircle(w - 8, h, 5);

    // Axle holes
    g.fillStyle(0x333344, 1);
    g.fillCircle(8, h, 2);
    g.fillCircle(w - 8, h, 2);

    // Rope attachment point
    g.fillStyle(0x666677, 1);
    g.fillCircle(w / 2, h, 4);

    g.generateTexture('carriage', w, h);
    g.destroy();
  }
}
