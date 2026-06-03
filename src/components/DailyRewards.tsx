// ============================================================
// DailyRewards — Daily Rewards Screen
// ============================================================

import { useState, useCallback } from 'react';
import { useGameStore } from '../store/gameStore';
import './DailyRewards.css';

export function DailyRewards() {
  const { dailyRewards, currentDay, canClaimToday, claimDailyReward, setScreen } = useGameStore();
  const [claimedAmount, setClaimedAmount] = useState<number | null>(null);
  const [animating, setAnimating] = useState(false);
  const canClaim = canClaimToday();

  const todayIndex = currentDay % 7;

  const handleClaim = useCallback(() => {
    if (!canClaim || animating) return;
    setAnimating(true);
    const amount = claimDailyReward();
    setClaimedAmount(amount);
    setTimeout(() => {
      setAnimating(false);
    }, 2000);
  }, [canClaim, animating, claimDailyReward]);

  return (
    <div className="screen daily-screen">
      <div className="screen-content">
        {/* ── Header ────────────────────────────── */}
        <div className="screen-header">
          <button id="daily-back" className="back-btn" onClick={() => setScreen('menu')}>←</button>
          <h1 className="neon-text-gold">🎁 DAILY REWARDS</h1>
        </div>

        {/* ── Streak Info ───────────────────────── */}
        <div className="daily-streak animate-slide-down delay-1">
          <span className="daily-streak-icon">📅</span>
          <div className="daily-streak-info">
            <span className="daily-streak-label">Day Streak</span>
            <span className="daily-streak-value">{currentDay} / 7</span>
          </div>
          <div className="daily-streak-bar">
            <div
              className="daily-streak-fill"
              style={{ width: `${(todayIndex / 7) * 100}%` }}
            />
          </div>
        </div>

        {/* ── 7-Day Calendar Grid ───────────────── */}
        <div className="daily-grid animate-slide-up delay-2">
          {dailyRewards.map((reward, i) => {
            const isCurrent = i === todayIndex && canClaim;
            const isPast = reward.claimed;
            const isFuture = i > todayIndex || (i === todayIndex && !canClaim && !isPast);

            return (
              <div
                key={reward.day}
                className={`daily-card ${isPast ? 'claimed' : ''} ${isCurrent ? 'current' : ''} ${isFuture ? 'future' : ''}`}
              >
                {/* Day label */}
                <span className="daily-day">Day {reward.day}</span>

                {/* Reward icon */}
                <div className="daily-reward-icon">
                  {reward.bonusPrize ? '🎁' : '🪙'}
                </div>

                {/* Coin amount */}
                <span className="daily-coins">+{reward.coins}</span>

                {/* Bonus indicator */}
                {reward.bonusPrize && (
                  <span className="daily-bonus">BONUS!</span>
                )}

                {/* Claimed checkmark */}
                {isPast && (
                  <div className="daily-check">✅</div>
                )}
              </div>
            );
          })}
        </div>

        {/* ── Claim Button ──────────────────────── */}
        <div className="daily-action animate-slide-up delay-3">
          {canClaim ? (
            <button
              id="btn-claim-daily"
              className={`btn btn-gold btn-lg daily-claim-btn ${animating ? 'claiming' : ''}`}
              onClick={handleClaim}
              disabled={animating}
            >
              {animating ? '🎉 Claimed!' : '🎁 Claim Today\'s Reward'}
            </button>
          ) : (
            <div className="daily-claimed-msg">
              <span>✨ Today's reward claimed!</span>
              <span className="daily-next">Come back tomorrow for more!</span>
            </div>
          )}

          {claimedAmount !== null && (
            <div className="daily-coin-popup animate-bounce" key={claimedAmount}>
              <span className="daily-coin-popup-text">+{claimedAmount} 🪙</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
