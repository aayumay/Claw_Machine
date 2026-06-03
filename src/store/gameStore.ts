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

  // Lucky Mode
  luckyModeActive: boolean;
  luckyModeTimeLeft: number;
  luckyCharge: number;
  triggerLuckyMode: (seconds: number) => void;
  tickLuckyMode: () => void;
  addLuckyCharge: (amount: number) => void;

  // PWA Install
  installPromptEvent: any | null;
  setInstallPromptEvent: (event: any) => void;
  clearInstallPromptEvent: () => void;

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
  lastLeaderboardUpdate: number;
  submitScore: (name: string) => void;
  simulateLeaderboardActivity: () => void;

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
      currentScreen: 'landing' as GameScreen,
      setScreen: (screen) => set({ currentScreen: screen }),

      // Lucky Mode
      luckyModeActive: false,
      luckyModeTimeLeft: 0,
      luckyCharge: 0,
      triggerLuckyMode: (seconds) => set({ luckyModeActive: true, luckyModeTimeLeft: seconds, luckyCharge: 0 }),
      tickLuckyMode: () => set((s) => {
        if (!s.luckyModeActive) return {};
        const newTime = s.luckyModeTimeLeft - 1;
        if (newTime <= 0) return { luckyModeActive: false, luckyModeTimeLeft: 0 };
        return { luckyModeTimeLeft: newTime };
      }),
      addLuckyCharge: (amount) => set((s) => {
        if (s.luckyModeActive) return {}; // Don't charge while active
        const newCharge = Math.min(100, s.luckyCharge + amount);
        if (newCharge >= 100) {
          return { luckyModeActive: true, luckyModeTimeLeft: 30, luckyCharge: 0 };
        }
        return { luckyCharge: newCharge };
      }),

      // PWA Install (Not persisted, runtime only)
      installPromptEvent: null,
      setInstallPromptEvent: (event) => set({ installPromptEvent: event }),
      clearInstallPromptEvent: () => set({ installPromptEvent: null }),

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
      lastLeaderboardUpdate: Date.now(),
      simulateLeaderboardActivity: () => set((s) => {
        const now = Date.now();
        // Only run if it's been more than 2 minutes since last check (for demo purposes)
        if (now - s.lastLeaderboardUpdate < 120000) return {};
        
        let boardChanged = false;
        const newBoard = s.leaderboard.map(entry => {
          // AI players occasionally gain score
          if (entry.name !== s.playerName && Math.random() > 0.6) {
            boardChanged = true;
            return {
              ...entry,
              score: entry.score + Math.floor(Math.random() * 500) + 100,
              totalWins: entry.totalWins + Math.floor(Math.random() * 2) + 1
            };
          }
          return entry;
        });

        // Add a random fake player sometimes if board is small
        if (newBoard.length < 10 && Math.random() > 0.8) {
          const names = ['ClawGod', 'NeonGrubber', 'LootMaster', 'ArcadeLegend'];
          const randName = names[Math.floor(Math.random() * names.length)];
          // Only add if name doesn't exist
          if (!newBoard.find(e => e.name === randName)) {
            newBoard.push({
              name: randName,
              score: Math.floor(Math.random() * 3000) + 500,
              totalWins: Math.floor(Math.random() * 15) + 3,
              date: getToday()
            });
            boardChanged = true;
          }
        }

        if (boardChanged) {
          return {
            leaderboard: newBoard.sort((a, b) => b.score - a.score).slice(0, 10),
            lastLeaderboardUpdate: now
          };
        }
        return { lastLeaderboardUpdate: now };
      }),
      submitScore: (name) =>
        set((s) => {
          // Remove old score for this player if it exists so they only have one entry
          const filteredBoard = s.leaderboard.filter(e => e.name !== name);
          const entry: LeaderboardEntry = {
            name,
            score: s.score,
            totalWins: s.totalWins,
            date: getToday(),
          };
          const newBoard = [...filteredBoard, entry]
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
      partialize: (state) => {
        const { currentScreen, ...rest } = state;
        return rest;
      },
    }
  )
);
