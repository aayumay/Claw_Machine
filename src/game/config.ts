// ============================================================
// Phaser Game Configuration
// ============================================================
// Central config for the Phaser game instance. Uses Matter.js
// physics, transparent background, and responsive FIT scaling.

import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene';
import { PreloadScene } from './scenes/PreloadScene';
import { GameScene } from './scenes/GameScene';
import { UIScene } from './scenes/UIScene';

/** Canvas dimensions (logical) */
export const GAME_WIDTH = 480;
export const GAME_HEIGHT = 800;

/**
 * Phaser game configuration.
 *
 * - Renderer: AUTO (WebGL with Canvas fallback)
 * - Physics: Matter.js with gentle gravity
 * - Scale: FIT mode for responsive sizing, auto-centered
 * - Transparent: true (React handles background)
 */
export const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,

  width: GAME_WIDTH,
  height: GAME_HEIGHT,

  // ── Transparent so React can render behind ─────────────
  transparent: true,
  backgroundColor: 'rgba(0,0,0,0)',

  // ── Responsive scaling ─────────────────────────────────
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
  },

  // ── Matter.js Physics ──────────────────────────────────
  physics: {
    default: 'matter',
    matter: {
      gravity: { x: 0, y: 1.5 },
      debug: false,
      // Performance tuning
      positionIterations: 6,
      velocityIterations: 4,
    },
  },

  // ── Scene Registration ─────────────────────────────────
  scene: [BootScene, PreloadScene, GameScene, UIScene],

  // ── Rendering ──────────────────────────────────────────
  render: {
    antialias: true,
    pixelArt: false,
    roundPixels: false,
  },

 
  disableContextMenu: true,


  audio: {
    noAudio: true, // We use Howler.js instead
  },
};
