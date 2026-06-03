// ============================================================
// Game Store — Zustand State Management
// ============================================================
// Central state store with localStorage persistence for
// coins, score, inventory, leaderboard, and daily rewards.

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  type WonPrize,
  type LeaderboardEntry,
  type GameScreen,
  type MachineTheme,
  type DailyReward,
} from '../types';

interface GameState {
  // Navigation
  currentScreen: GameScreen;
  setScreen: (screen: GameScreen) => void;

  // Currency & Score
  coins: number;
  score: number;
  highScore: number;
  addCoins: (amount: number) => void;
  spendCoins: (amount: number) => boolean;
  addScore: (amount: number) => void;
  resetScore: () => void;

  // Inventory
  inventory: WonPrize[];
  addPrize: (prize: WonPrize) => void;

  // Machine Theme
  currentTheme: MachineTheme;
  setTheme: (theme: MachineTheme) => void;

  // Stats
  totalGrabs: number;
  totalWins: number;
  streak: number;
  bestStreak: number;
  incrementGrabs: () => void;
  incrementWins: () => void;
  resetStreak: () => void;

  // Leaderboard
  leaderboard: LeaderboardEntry[];
  submitScore: (name: string) => void;

  // Daily Rewards
  dailyRewards: DailyReward[];
  lastClaimDate: string;
  currentDay: number;
  claimDailyReward: () => number;
  canClaimToday: () => boolean;
  initDailyRewards: () => void;

  // Settings
  soundEnabled: boolean;
  musicEnabled: boolean;
  toggleSound: () => void;
  toggleMusic: () => void;

  // Player
  playerName: string;
  setPlayerName: (name: string) => void;
  playerAvatar: string;
  setPlayerAvatar: (avatar: string) => void;

  // Modals
  activeModal: 'none' | 'profile' | 'store';
  setActiveModal: (modal: 'none' | 'profile' | 'store') => void;

  // Reset
  resetProgress: () => void;
}

const DAILY_REWARDS: DailyReward[] = [
  { day: 1, coins: 5, bonusPrize: false, claimed: false },
  { day: 2, coins: 8, bonusPrize: false, claimed: false },
  { day: 3, coins: 10, bonusPrize: false, claimed: false },
  { day: 4, coins: 15, bonusPrize: false, claimed: false },
  { day: 5, coins: 20, bonusPrize: true, claimed: false },
  { day: 6, coins: 25, bonusPrize: false, claimed: false },
  { day: 7, coins: 50, bonusPrize: true, claimed: false },
];

const DEFAULT_LEADERBOARD: LeaderboardEntry[] = [
  { name: 'ArcadeKing', score: 5000, totalWins: 25, date: '2026-05-30' },
  { name: 'ClawMaster', score: 3800, totalWins: 18, date: '2026-05-29' },
  { name: 'PrizePro', score: 2500, totalWins: 12, date: '2026-05-28' },
  { name: 'NeonNinja', score: 1800, totalWins: 9, date: '2026-05-27' },
  { name: 'ToyHunter', score: 1200, totalWins: 6, date: '2026-05-26' },
];

function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      // Navigation
      currentScreen: 'menu' as GameScreen,
      setScreen: (screen) => set({ currentScreen: screen }),

      // Currency & Score
      coins: 10,
      score: 0,
      highScore: 0,
      addCoins: (amount) =>
        set((s) => ({ coins: s.coins + amount })),
      spendCoins: (amount) => {
        const state = get();
        if (state.coins >= amount) {
          set({ coins: state.coins - amount });
          return true;
        }
        return false;
      },
      addScore: (amount) =>
        set((s) => ({
          score: s.score + amount,
          highScore: Math.max(s.highScore, s.score + amount),
        })),
      resetScore: () => set({ score: 0 }),

      // Inventory
      inventory: [],
      addPrize: (prize) =>
        set((s) => ({ inventory: [...s.inventory, prize] })),

      // Machine Theme
      currentTheme: 'Toys' as MachineTheme,
      setTheme: (theme) => set({ currentTheme: theme }),

      // Stats
      totalGrabs: 0,
      totalWins: 0,
      streak: 0,
      bestStreak: 0,
      incrementGrabs: () =>
        set((s) => ({ totalGrabs: s.totalGrabs + 1 })),
      incrementWins: () =>
        set((s) => ({
          totalWins: s.totalWins + 1,
          streak: s.streak + 1,
          bestStreak: Math.max(s.bestStreak, s.streak + 1),
        })),
      resetStreak: () => set({ streak: 0 }),

      // Leaderboard
      leaderboard: DEFAULT_LEADERBOARD,
      submitScore: (name) =>
        set((s) => {
          const entry: LeaderboardEntry = {
            name,
            score: s.score,
            totalWins: s.totalWins,
            date: getToday(),
          };
          const newBoard = [...s.leaderboard, entry]
            .sort((a, b) => b.score - a.score)
            .slice(0, 10);
          return { leaderboard: newBoard };
        }),

      // Daily Rewards
      dailyRewards: DAILY_REWARDS.map((r) => ({ ...r })),
      lastClaimDate: '',
      currentDay: 0,
      canClaimToday: () => {
        const state = get();
        return state.lastClaimDate !== getToday();
      },
      claimDailyReward: () => {
        const state = get();
        if (state.lastClaimDate === getToday()) return 0;

        const day = (state.currentDay % 7);
        const reward = DAILY_REWARDS[day];
        const updatedRewards = state.dailyRewards.map((r, i) =>
          i === day ? { ...r, claimed: true } : r
        );

        set({
          coins: state.coins + reward.coins,
          lastClaimDate: getToday(),
          currentDay: state.currentDay + 1,
          dailyRewards: updatedRewards,
        });

        return reward.coins;
      },
      initDailyRewards: () => {
        const state = get();
        // Reset weekly cycle
        if (state.currentDay >= 7) {
          set({
            currentDay: 0,
            dailyRewards: DAILY_REWARDS.map((r) => ({ ...r, claimed: false })),
          });
        }
      },

      // Settings
      soundEnabled: true,
      musicEnabled: true,
      toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),
      toggleMusic: () => set((s) => ({ musicEnabled: !s.musicEnabled })),

      // Player
      playerName: 'Player',
      setPlayerName: (name) => set({ playerName: name }),
      playerAvatar: '🐱',
      setPlayerAvatar: (avatar) => set({ playerAvatar: avatar }),

      // Modals
      activeModal: 'none',
      setActiveModal: (modal) => set({ activeModal: modal }),

      // Reset
      resetProgress: () =>
        set({
          coins: 10,
          score: 0,
          highScore: 0,
          inventory: [],
          totalGrabs: 0,
          totalWins: 0,
          streak: 0,
          bestStreak: 0,
          currentDay: 0,
          lastClaimDate: '',
          dailyRewards: DAILY_REWARDS.map((r) => ({ ...r, claimed: false })),
          leaderboard: DEFAULT_LEADERBOARD,
        }),
    }),
    {
      name: 'claw-machine-save',
    }
  )
);
