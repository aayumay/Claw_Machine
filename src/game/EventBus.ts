// ============================================================
// EventBus — React ↔ Phaser Communication Bridge
// ============================================================
// A shared event emitter that allows React components and
// Phaser scenes to communicate without tight coupling.

import Phaser from 'phaser';

export const EventBus = new Phaser.Events.EventEmitter();
