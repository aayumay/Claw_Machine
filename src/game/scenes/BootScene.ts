// ============================================================
// BootScene — Initial Bootstrap Scene
// ============================================================
// Minimal scene that initializes global game settings and
// immediately transitions to the PreloadScene.

import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  init(): void {
    // Nothing extra needed for boot
  }

  preload(): void {
    // No external assets to load
  }

  create(): void {
    // ── Global game settings ──────────────────────────────
    // Enable pixel-perfect rendering for our generated textures
    this.game.canvas.style.imageRendering = 'auto';

    // Ensure the game canvas has correct cursor styling
    this.input.setDefaultCursor('default');

    // Transition immediately to the PreloadScene
    this.scene.start('PreloadScene');
  }
}
