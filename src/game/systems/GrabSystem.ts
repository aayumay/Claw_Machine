// ============================================================
// GrabSystem — Grab Probability & Slip Mechanics Engine
// ============================================================
// Calculates grab success probability factoring in grip strength,
// prize weight/difficulty, pity timer, and difficulty scaling.

import type { Prize, GrabResult } from '../../types';
import { useGameStore } from '../../store/gameStore';

/** Configuration constants for grab mechanics */
const PITY_BONUS_PER_FAIL = 0.20;      // +20% per consecutive failure
const MAX_PITY_BONUS = 0.80;           // caps at +80%
const DIFFICULTY_SCALE_PER_WIN = 0.001; // extremely slight increase per win
const MAX_DIFFICULTY_SCALE = 0.05;      // caps at +5% difficulty
const SLIP_BASE_CHANCE = 0.01;          // 1% base slip chance during rise
const SLIP_WEIGHT_FACTOR = 0.005;       // +0.5% slip per weight unit above 3
const MIN_SUCCESS_CHANCE = 0.25;        // always at least 25% chance
const MAX_SUCCESS_CHANCE = 1.00;        // can be up to 100%

/** Messages for different grab outcomes */
const WIN_MESSAGES = [
  'NICE GRAB! 🎉',
  'GOT IT! ⭐',
  'AMAZING CATCH! 🏆',
  'PERFECT GRIP! 💪',
  'SNAGGED IT! 🎯',
  'INCREDIBLE! ✨',
];

const FAIL_MESSAGES_GRAB = [
  'Missed it! 😅',
  'Just barely! 💨',
  'So close! 🫣',
  'Slipped away! 😔',
  'Not quite! 🎪',
];

const FAIL_MESSAGES_RISE = [
  'It slipped! 😱',
  'Lost the grip! 💧',
  'Too heavy! ⚖️',
  'Dropped it! 😩',
  'Almost had it! 🫠',
];

const FAIL_MESSAGES_RETURN = [
  'Dropped at the last second! 😭',
  'So close to the chute! 💔',
  'It wiggled free! 🐛',
];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export class GrabSystem {
  /**
   * Calculate whether a grab attempt succeeds.
   *
   * @param prize           - The targeted prize (null if claw missed everything)
   * @param gripStrength    - Machine's base grip strength (0-1)
   * @param difficultyLevel - Total wins so far (used for scaling)
   * @param consecutiveFailures - Number of fails in a row (pity system)
   * @returns GrabResult with success status and detailed info
   */
  static calculateGrabSuccess(
    prize: Prize | null,
    gripStrength: number,
    difficultyLevel: number,
    consecutiveFailures: number
  ): GrabResult {
    // ── No prize targeted ─────────────────────────────────
    if (!prize) {
      return {
        success: false,
        prize: null,
        slippedAt: null,
        gripStrength,
        message: pickRandom(FAIL_MESSAGES_GRAB),
      };
    }

    // ── Calculate base grab probability ───────────────────
    const pityBonus = clamp(
      consecutiveFailures * PITY_BONUS_PER_FAIL,
      0,
      MAX_PITY_BONUS
    );

    const difficultyPenalty = clamp(
      difficultyLevel * DIFFICULTY_SCALE_PER_WIN,
      0,
      MAX_DIFFICULTY_SCALE
    );

    const isLucky = useGameStore.getState().luckyModeActive;
    const luckyBonus = isLucky ? 0.40 : 0; // Huge 40% buff

    const baseProbability = gripStrength - prize.grabDifficulty;
    const adjustedProbability = clamp(
      baseProbability + pityBonus + luckyBonus - difficultyPenalty,
      MIN_SUCCESS_CHANCE,
      MAX_SUCCESS_CHANCE
    );

    // ── Initial grab check ────────────────────────────────
    const grabRoll = Math.random();
    if (grabRoll > adjustedProbability) {
      return {
        success: false,
        prize,
        slippedAt: 'grab',
        gripStrength: adjustedProbability,
        message: pickRandom(FAIL_MESSAGES_GRAB),
      };
    }

    // ── Slip check during rise ────────────────────────────
    const weightPenalty = Math.max(0, (prize.weight - 3) * SLIP_WEIGHT_FACTOR);
    const slipChance = clamp(
      (SLIP_BASE_CHANCE + weightPenalty - pityBonus * 0.5) * (isLucky ? 0.1 : 1), // 90% slip reduction in lucky mode
      0.001,
      0.50
    );

    const slipRoll = Math.random();
    if (slipRoll < slipChance) {
      return {
        success: false,
        prize,
        slippedAt: 'rise',
        gripStrength: adjustedProbability,
        message: pickRandom(FAIL_MESSAGES_RISE),
      };
    }

    // ── Slip check during return to chute ─────────────────
    // Smaller chance — only for heavy/difficult prizes
    const returnSlipChance = clamp(
      (prize.grabDifficulty - 0.6) * 0.15,
      0,
      0.12
    );

    const returnRoll = Math.random();
    if (returnRoll < returnSlipChance) {
      return {
        success: false,
        prize,
        slippedAt: 'return',
        gripStrength: adjustedProbability,
        message: pickRandom(FAIL_MESSAGES_RETURN),
      };
    }

    // ── Success! ──────────────────────────────────────────
    return {
      success: true,
      prize,
      slippedAt: null,
      gripStrength: adjustedProbability,
      message: pickRandom(WIN_MESSAGES),
    };
  }

  /**
   * Quick check if prize should slip at a given rise percentage.
   * Called continuously during the rise animation for dramatic tension.
   *
   * @param prize     - The grabbed prize
   * @param riseProgress - 0-1, how far the claw has risen
   * @param pityBonus - Current pity bonus (reduces slip)
   * @returns true if the prize should slip now
   */
  static checkRiseSlip(
    prize: Prize,
    riseProgress: number,
    pityBonus: number
  ): boolean {
    // Slip is more likely in the middle of the rise (dramatic tension)
    const tensionCurve = Math.sin(riseProgress * Math.PI); // peaks at 0.5
    const weightFactor = prize.weight / 10;
    const slipProbPerFrame = 0.0002 * tensionCurve * weightFactor * (1 - pityBonus * 0.3);
    return Math.random() < slipProbPerFrame;
  }
}
