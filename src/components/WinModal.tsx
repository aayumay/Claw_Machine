// ============================================================
// WinModal — Prize Won Celebration
// ============================================================

import { useEffect, useState } from 'react';
import type { Prize } from '../types';
import { Rarity } from '../types';
import { RARITY_COLORS } from '../game/data/prizes';
import './WinModal.css';

interface WinModalProps {
  prize: Prize;
  onCollect: () => void;
}

const RARITY_LABELS: Record<Rarity, string> = {
  [Rarity.COMMON]: 'NICE!',
  [Rarity.UNCOMMON]: 'COOL!',
  [Rarity.RARE]: 'AWESOME!',
  [Rarity.EPIC]: 'INCREDIBLE!',
  [Rarity.LEGENDARY]: '🌟 LEGENDARY! 🌟',
  [Rarity.MYTHIC]: '🔥 MYTHIC! 🔥',
};

export function WinModal({ prize, onCollect }: WinModalProps) {
  const [visible, setVisible] = useState(false);
  const rarityColor = RARITY_COLORS[prize.rarity];
  const exclamation = RARITY_LABELS[prize.rarity];

  useEffect(() => {
    // Trigger entrance animation
    requestAnimationFrame(() => setVisible(true));

    // Auto-dismiss after 5 seconds
    const timer = setTimeout(() => {
      onCollect();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onCollect]);

  const isLegendary = prize.rarity === Rarity.LEGENDARY;
  const isEpic = prize.rarity === Rarity.EPIC;

  return (
    <div
      className={`win-overlay ${visible ? 'visible' : ''}`}
      id="win-modal"
      onClick={onCollect}
    >
      {/* Confetti / sparkle background */}
      <div className="win-confetti">
        {Array.from({ length: isLegendary ? 30 : isEpic ? 20 : 12 }).map((_, i) => (
          <div
            key={i}
            className="confetti-piece"
            style={{
              '--confetti-x': `${Math.random() * 100}%`,
              '--confetti-delay': `${Math.random() * 2}s`,
              '--confetti-duration': `${2 + Math.random() * 2}s`,
              '--confetti-color': [
                rarityColor,
                '#ff6bb5',
                '#00f5ff',
                '#ffd700',
                '#b44dff',
                '#00ff88',
              ][i % 6],
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* Modal Card */}
      <div
        className={`win-card ${visible ? 'visible' : ''} rarity-${prize.rarity.toLowerCase()}`}
        style={{ '--rarity-color': rarityColor } as React.CSSProperties}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow ring behind prize */}
        <div className="win-glow-ring" />

        {/* Exclamation */}
        <div className="win-exclamation" style={{ color: rarityColor }}>
          {exclamation}
        </div>

        {/* Prize display */}
        <div className="win-prize-emoji">{prize.emoji}</div>
        <h2 className="win-prize-name">{prize.name}</h2>

        {/* Rarity badge */}
        <span
          className="badge win-rarity-badge"
          style={{ color: rarityColor, borderColor: rarityColor }}
        >
          {prize.rarity}
        </span>

        {/* Score */}
        <div className="win-score">
          <span className="win-score-label">Score</span>
          <span className="win-score-value" style={{ color: rarityColor }}>
            +{prize.value}
          </span>
        </div>

        {/* Collect button */}
        <button
          id="btn-collect"
          className="btn btn-lg win-collect-btn"
          style={{
            background: `linear-gradient(135deg, ${rarityColor}, ${rarityColor}88)`,
            borderColor: rarityColor,
          }}
          onClick={onCollect}
        >
          Collect! 🎉
        </button>
      </div>
    </div>
  );
}
