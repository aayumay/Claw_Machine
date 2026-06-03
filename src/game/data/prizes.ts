// ============================================================
// Prize Data — All prize definitions for each machine theme
// ============================================================

import { type Prize, Rarity, MachineTheme } from '../../types';

let idCounter = 0;
function makeId(): string {
  return `prize_${++idCounter}`;
}

// ── Toys Theme ──────────────────────────────────────────────
export const TOY_PRIZES: Prize[] = [
  { id: makeId(), name: 'Vintage Yo-Yo', emoji: '🪀', rarity: Rarity.COMMON, weight: 2, size: 0.8, value: 50, color: '#FF4500', shape: 'circle', theme: MachineTheme.TOYS, grabDifficulty: 0.25 },
  { id: makeId(), name: 'Rubber Duck', emoji: '🦆', rarity: Rarity.COMMON, weight: 1, size: 0.7, value: 30, color: '#FFD700', shape: 'circle', theme: MachineTheme.TOYS, grabDifficulty: 0.2 },
  { id: makeId(), name: 'Slinky Spring', emoji: '🔗', rarity: Rarity.UNCOMMON, weight: 3, size: 0.9, value: 80, color: '#C0C0C0', shape: 'circle', theme: MachineTheme.TOYS, grabDifficulty: 0.35 },
  { id: makeId(), name: 'Toy Robot', emoji: '🤖', rarity: Rarity.UNCOMMON, weight: 5, size: 0.9, value: 100, color: '#87CEEB', shape: 'square', theme: MachineTheme.TOYS, grabDifficulty: 0.45 },
  { id: makeId(), name: 'Retro Gameboy', emoji: '👾', rarity: Rarity.RARE, weight: 6, size: 1.1, value: 200, color: '#A9A9A9', shape: 'square', theme: MachineTheme.TOYS, grabDifficulty: 0.6 },
  { id: makeId(), name: 'RC Racecar', emoji: '🏎️', rarity: Rarity.EPIC, weight: 7, size: 1.2, value: 500, color: '#FF0000', shape: 'square', theme: MachineTheme.TOYS, grabDifficulty: 0.75 },
  { id: makeId(), name: 'Diamond Plush', emoji: '💎', rarity: Rarity.LEGENDARY, weight: 8, size: 1.5, value: 1000, color: '#00FFFF', shape: 'diamond', theme: MachineTheme.TOYS, grabDifficulty: 0.9 },
  { id: makeId(), name: 'Pink Bunny', emoji: '🐰', rarity: Rarity.COMMON, weight: 2, size: 0.8, value: 40, color: '#FFB6C1', shape: 'circle', theme: MachineTheme.TOYS, grabDifficulty: 0.25 },
  { id: makeId(), name: 'Rubiks Cube', emoji: '🎲', rarity: Rarity.UNCOMMON, weight: 5, size: 1.0, value: 90, color: '#FF69B4', shape: 'square', theme: MachineTheme.TOYS, grabDifficulty: 0.5 },
  { id: makeId(), name: 'Puppy Dog', emoji: '🐶', rarity: Rarity.RARE, weight: 4, size: 1.1, value: 180, color: '#DEB887', shape: 'circle', theme: MachineTheme.TOYS, grabDifficulty: 0.55 },
  { id: makeId(), name: 'Golden Ticket', emoji: '🎫', rarity: Rarity.MYTHIC, weight: 9, size: 1.5, value: 3000, color: '#FF0055', shape: 'star', theme: MachineTheme.TOYS, grabDifficulty: 0.95 },
  { id: makeId(), name: 'Magic Wand', emoji: '🪄', rarity: Rarity.MYTHIC, weight: 7, size: 1.4, value: 2500, color: '#FF00FF', shape: 'diamond', theme: MachineTheme.TOYS, grabDifficulty: 0.92 },
];

// ── Anime Theme ─────────────────────────────────────────────
export const ANIME_PRIZES: Prize[] = [
  { id: makeId(), name: 'Naruto', emoji: '🍥', rarity: Rarity.COMMON, weight: 3, size: 0.9, value: 80, color: '#FFA500', shape: 'circle', theme: MachineTheme.ANIME, grabDifficulty: 0.3 },
  { id: makeId(), name: 'Zoro', emoji: '⚔️', rarity: Rarity.UNCOMMON, weight: 4, size: 1.0, value: 120, color: '#2E8B57', shape: 'diamond', theme: MachineTheme.ANIME, grabDifficulty: 0.4 },
  { id: makeId(), name: 'Luffy', emoji: '👒', rarity: Rarity.RARE, weight: 3, size: 0.9, value: 200, color: '#FF0000', shape: 'circle', theme: MachineTheme.ANIME, grabDifficulty: 0.5 },
  { id: makeId(), name: 'Death Note', emoji: '📓', rarity: Rarity.RARE, weight: 4, size: 0.8, value: 250, color: '#1A1A1A', shape: 'square', theme: MachineTheme.ANIME, grabDifficulty: 0.6 },
  { id: makeId(), name: 'Levi Ackerman', emoji: '🗡️', rarity: Rarity.EPIC, weight: 5, size: 1.1, value: 400, color: '#4682B4', shape: 'square', theme: MachineTheme.ANIME, grabDifficulty: 0.7 },
  { id: makeId(), name: 'Gojo Satoru', emoji: '🕶️', rarity: Rarity.LEGENDARY, weight: 6, size: 1.2, value: 800, color: '#8A2BE2', shape: 'circle', theme: MachineTheme.ANIME, grabDifficulty: 0.85 },
  { id: makeId(), name: 'Sukuna Finger', emoji: '👺', rarity: Rarity.MYTHIC, weight: 8, size: 1.3, value: 1500, color: '#8B0000', shape: 'square', theme: MachineTheme.ANIME, grabDifficulty: 0.92 },
  { id: makeId(), name: 'Eren Titan', emoji: '🦴', rarity: Rarity.LEGENDARY, weight: 9, size: 1.4, value: 1200, color: '#8B4513', shape: 'star', theme: MachineTheme.ANIME, grabDifficulty: 0.88 },
  { id: makeId(), name: 'Nezuko Box', emoji: '🍱', rarity: Rarity.UNCOMMON, weight: 4, size: 1.0, value: 150, color: '#FF69B4', shape: 'square', theme: MachineTheme.ANIME, grabDifficulty: 0.45 },
  { id: makeId(), name: 'Goku', emoji: '🐉', rarity: Rarity.EPIC, weight: 5, size: 1.1, value: 500, color: '#FFD700', shape: 'star', theme: MachineTheme.ANIME, grabDifficulty: 0.75 },
  { id: makeId(), name: 'King Sukuna', emoji: '👿', rarity: Rarity.MYTHIC, weight: 9, size: 1.5, value: 3000, color: '#FF0055', shape: 'diamond', theme: MachineTheme.ANIME, grabDifficulty: 0.95 },
];

// ── Tech Gadgets Theme ──────────────────────────────────────
export const TECH_PRIZES: Prize[] = [
  { id: makeId(), name: 'USB Drive', emoji: '💾', rarity: Rarity.COMMON, weight: 1, size: 0.5, value: 30, color: '#00CED1', shape: 'square', theme: MachineTheme.TECH, grabDifficulty: 0.2 },
  { id: makeId(), name: 'LED Keychain', emoji: '🔦', rarity: Rarity.COMMON, weight: 2, size: 0.6, value: 40, color: '#00FF00', shape: 'circle', theme: MachineTheme.TECH, grabDifficulty: 0.25 },
  { id: makeId(), name: 'Mini Speaker', emoji: '🔊', rarity: Rarity.UNCOMMON, weight: 4, size: 0.9, value: 100, color: '#1E90FF', shape: 'circle', theme: MachineTheme.TECH, grabDifficulty: 0.45 },
  { id: makeId(), name: 'Smart Watch', emoji: '⌚', rarity: Rarity.RARE, weight: 3, size: 0.7, value: 300, color: '#FF6347', shape: 'square', theme: MachineTheme.TECH, grabDifficulty: 0.6 },
  { id: makeId(), name: 'Wireless Earbuds', emoji: '🎧', rarity: Rarity.UNCOMMON, weight: 2, size: 0.6, value: 120, color: '#FFFFFF', shape: 'circle', theme: MachineTheme.TECH, grabDifficulty: 0.4 },
  { id: makeId(), name: 'Power Bank', emoji: '🔋', rarity: Rarity.UNCOMMON, weight: 6, size: 1.0, value: 90, color: '#32CD32', shape: 'square', theme: MachineTheme.TECH, grabDifficulty: 0.5 },
  { id: makeId(), name: 'VR Headset', emoji: '🥽', rarity: Rarity.EPIC, weight: 8, size: 1.3, value: 700, color: '#8A2BE2', shape: 'square', theme: MachineTheme.TECH, grabDifficulty: 0.8 },
  { id: makeId(), name: 'Gaming Mouse', emoji: '🖱️', rarity: Rarity.RARE, weight: 3, size: 0.8, value: 250, color: '#FF1493', shape: 'diamond', theme: MachineTheme.TECH, grabDifficulty: 0.55 },
  { id: makeId(), name: 'Drone Mini', emoji: '🚁', rarity: Rarity.LEGENDARY, weight: 5, size: 1.2, value: 1500, color: '#FFD700', shape: 'star', theme: MachineTheme.TECH, grabDifficulty: 0.95 },
  { id: makeId(), name: 'RGB Strip', emoji: '🌈', rarity: Rarity.COMMON, weight: 2, size: 0.8, value: 35, color: '#FF00FF', shape: 'square', theme: MachineTheme.TECH, grabDifficulty: 0.3 },
  { id: makeId(), name: 'Quantum Chip', emoji: '💽', rarity: Rarity.MYTHIC, weight: 8, size: 1.2, value: 4000, color: '#00FF00', shape: 'square', theme: MachineTheme.TECH, grabDifficulty: 0.97 },
];

// ── Mystery Boxes Theme ─────────────────────────────────────
export const MYSTERY_PRIZES: Prize[] = [
  { id: makeId(), name: 'Small Box', emoji: '📦', rarity: Rarity.COMMON, weight: 3, size: 0.8, value: 50, color: '#D2691E', shape: 'square', theme: MachineTheme.MYSTERY, grabDifficulty: 0.3 },
  { id: makeId(), name: 'Gift Box', emoji: '🎁', rarity: Rarity.UNCOMMON, weight: 4, size: 0.9, value: 100, color: '#FF0000', shape: 'square', theme: MachineTheme.MYSTERY, grabDifficulty: 0.4 },
  { id: makeId(), name: 'Cursed Amulet', emoji: '🧿', rarity: Rarity.UNCOMMON, weight: 5, size: 1.0, value: 150, color: '#8B0000', shape: 'diamond', theme: MachineTheme.MYSTERY, grabDifficulty: 0.5 },
  { id: makeId(), name: 'Gold Box', emoji: '🥇', rarity: Rarity.RARE, weight: 6, size: 1.1, value: 300, color: '#FFD700', shape: 'square', theme: MachineTheme.MYSTERY, grabDifficulty: 0.6 },
  { id: makeId(), name: 'Crystal Ball', emoji: '🔮', rarity: Rarity.RARE, weight: 4, size: 0.9, value: 280, color: '#9370DB', shape: 'circle', theme: MachineTheme.MYSTERY, grabDifficulty: 0.55 },
  { id: makeId(), name: 'Ancient Scroll', emoji: '📜', rarity: Rarity.UNCOMMON, weight: 2, size: 0.7, value: 120, color: '#DEB887', shape: 'square', theme: MachineTheme.MYSTERY, grabDifficulty: 0.35 },
  { id: makeId(), name: 'Magic Lamp', emoji: '🪔', rarity: Rarity.EPIC, weight: 7, size: 1.2, value: 600, color: '#B8860B', shape: 'diamond', theme: MachineTheme.MYSTERY, grabDifficulty: 0.75 },
  { id: makeId(), name: 'Treasure Chest', emoji: '💰', rarity: Rarity.EPIC, weight: 8, size: 1.3, value: 800, color: '#8B4513', shape: 'square', theme: MachineTheme.MYSTERY, grabDifficulty: 0.82 },
  { id: makeId(), name: 'Void Box', emoji: '🌀', rarity: Rarity.LEGENDARY, weight: 9, size: 1.4, value: 1500, color: '#4B0082', shape: 'star', theme: MachineTheme.MYSTERY, grabDifficulty: 0.93 },
  { id: makeId(), name: 'Tiny Surprise', emoji: '🎀', rarity: Rarity.COMMON, weight: 1, size: 0.5, value: 25, color: '#FF69B4', shape: 'circle', theme: MachineTheme.MYSTERY, grabDifficulty: 0.2 },
  { id: makeId(), name: 'Pandora Box', emoji: '🕋', rarity: Rarity.MYTHIC, weight: 10, size: 1.6, value: 5000, color: '#FF0000', shape: 'square', theme: MachineTheme.MYSTERY, grabDifficulty: 0.98 },
  { id: makeId(), name: 'Alien Relic', emoji: '🛸', rarity: Rarity.MYTHIC, weight: 8, size: 1.4, value: 3500, color: '#00FF88', shape: 'diamond', theme: MachineTheme.MYSTERY, grabDifficulty: 0.95 },
];

/** Get prize pool for a given theme */
export function getPrizePool(theme: MachineTheme): Prize[] {
  switch (theme) {
    case MachineTheme.TOYS: return TOY_PRIZES;
    case MachineTheme.ANIME: return ANIME_PRIZES;
    case MachineTheme.TECH: return TECH_PRIZES;
    case MachineTheme.MYSTERY: return MYSTERY_PRIZES;
    default: return TOY_PRIZES;
  }
}

/** Get theme color palette */
export function getThemeColors(theme: MachineTheme) {
  switch (theme) {
    case MachineTheme.TOYS:
      return { primary: '#FF6B9D', secondary: '#C44569', accent: '#F8B500', background: '#1a0a2e', neon: '#ff6bb5', machineFrame: '#4a3070', glass: 'rgba(255,255,255,0.08)' };
    case MachineTheme.ANIME:
      return { primary: '#FF69B4', secondary: '#9B59B6', accent: '#E74C3C', background: '#0f0a1e', neon: '#ff69b4', machineFrame: '#3a2060', glass: 'rgba(255,255,255,0.06)' };
    case MachineTheme.TECH:
      return { primary: '#00F5FF', secondary: '#0080FF', accent: '#00FF88', background: '#0a0f1e', neon: '#00f5ff', machineFrame: '#1a2a40', glass: 'rgba(255,255,255,0.05)' };
    case MachineTheme.MYSTERY:
      return { primary: '#FFD700', secondary: '#FF8C00', accent: '#FF4500', background: '#1a0f0a', neon: '#ffd700', machineFrame: '#3a2510', glass: 'rgba(255,255,255,0.07)' };
  }
}

/** Rarity color mapping */
export const RARITY_COLORS: Record<Rarity, string> = {
  [Rarity.COMMON]: '#9E9E9E',
  [Rarity.UNCOMMON]: '#4CAF50',
  [Rarity.RARE]: '#2196F3',
  [Rarity.EPIC]: '#9C27B0',
  [Rarity.LEGENDARY]: '#FF9800',
  [Rarity.MYTHIC]: '#FF0055',
};
