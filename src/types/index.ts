// ============================================================
// Claw Machine Arcade Game — Type Definitions
// ============================================================

/** Rarity tiers for prizes */
export const Rarity = {
  COMMON: 'Common',
  UNCOMMON: 'Uncommon',
  RARE: 'Rare',
  EPIC: 'Epic',
  LEGENDARY: 'Legendary',
  MYTHIC: 'Mythic',
} as const;
export type Rarity = typeof Rarity[keyof typeof Rarity];

/** Machine theme categories */
export const MachineTheme = {
  TOYS: 'Toys',
  ANIME: 'Anime',
  TECH: 'Tech Gadgets',
  MYSTERY: 'Mystery Boxes',
} as const;
export type MachineTheme = typeof MachineTheme[keyof typeof MachineTheme];

/** Claw state machine states */
export const ClawState = {
  IDLE: 'IDLE',
  MOVING: 'MOVING',
  DROPPING: 'DROPPING',
  GRABBING: 'GRABBING',
  RISING: 'RISING',
  RETURNING: 'RETURNING',
  DELIVERING: 'DELIVERING',
} as const;
export type ClawState = typeof ClawState[keyof typeof ClawState];

/** Prize item definition */
export interface Prize {
  id: string;
  name: string;
  emoji: string;
  rarity: Rarity;
  weight: number;       // 1-10, affects grab difficulty
  size: number;         // visual size multiplier
  value: number;        // score value
  color: string;        // hex color
  shape: 'circle' | 'square' | 'star' | 'heart' | 'diamond' | 'triangle';
  theme: MachineTheme;
  grabDifficulty: number; // 0-1, higher = harder
}

/** Won prize instance (in inventory) */
export interface WonPrize extends Prize {
  wonAt: number;        // timestamp
  instanceId: string;   // unique instance ID
}

/** Grab attempt result */
export interface GrabResult {
  success: boolean;
  prize: Prize | null;
  slippedAt: 'grab' | 'rise' | 'return' | null;
  gripStrength: number;
  message: string;
}

/** Leaderboard entry */
export interface LeaderboardEntry {
  name: string;
  score: number;
  totalWins: number;
  date: string;
}

/** Daily reward definition */
export interface DailyReward {
  day: number;
  coins: number;
  bonusPrize: boolean;
  claimed: boolean;
}

/** Game screen/page */
export type GameScreen = 'landing' | 'menu' | 'game' | 'inventory' | 'leaderboard' | 'daily' | 'settings';

/** Theme color palette */
export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  neon: string;
  machineFrame: string;
  glass: string;
}

/** Machine configuration per theme */
export interface MachineConfig {
  theme: MachineTheme;
  name: string;
  description: string;
  colors: ThemeColors;
  baseDifficulty: number;
  gripStrength: number;
  prizePool: Prize[];
  coinCost: number;
}

/** Event bus event types */
export interface GameEvents {
  'scene-ready': Phaser.Scene;
  'move-left': void;
  'move-right': void;
  'move-stop': void;
  'drop-claw': void;
  'claw-state-change': ClawState;
  'grab-result': GrabResult;
  'score-update': number;
  'coins-update': number;
  'game-started': void;
  'game-reset': void;
  'change-theme': MachineTheme;
}
