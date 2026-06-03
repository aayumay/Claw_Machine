// ============================================================
// Inventory — Prize Collection Screen
// ============================================================

import { useState, useMemo } from 'react';
import { useGameStore } from '../store/gameStore';
import { Rarity } from '../types';
import { RARITY_COLORS } from '../game/data/prizes';
import './Inventory.css';

const RARITY_FILTERS = ['All', ...Object.values(Rarity)] as const;

export function Inventory() {
  const { inventory, setScreen } = useGameStore();
  const [activeFilter, setActiveFilter] = useState<string>('All');

  const filtered = useMemo(() => {
    if (activeFilter === 'All') return inventory;
    return inventory.filter((p) => p.rarity === activeFilter);
  }, [inventory, activeFilter]);

  const rarityCount = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const r of Object.values(Rarity)) {
      counts[r] = inventory.filter((p) => p.rarity === r).length;
    }
    return counts;
  }, [inventory]);

  return (
    <div className="screen inventory-screen">
      <div className="screen-content">
        {/* ── Header ────────────────────────────── */}
        <div className="screen-header">
          <button id="inv-back" className="back-btn" onClick={() => setScreen('menu')}>←</button>
          <h1 className="neon-text-purple">🎒 MY COLLECTION</h1>
        </div>

        {/* ── Stats ─────────────────────────────── */}
        <div className="inv-stats animate-slide-down delay-1">
          <div className="inv-stat-total">
            <span className="inv-stat-num">{inventory.length}</span>
            <span className="inv-stat-label">Total Items</span>
          </div>
          <div className="inv-stat-rarities">
            {Object.values(Rarity).map((r) => (
              <span
                key={r}
                className="inv-rarity-pip"
                style={{ color: RARITY_COLORS[r] }}
                title={r}
              >
                {rarityCount[r]}
              </span>
            ))}
          </div>
        </div>

        {/* ── Filter Tabs ───────────────────────── */}
        <div className="inv-filters animate-slide-down delay-2">
          {RARITY_FILTERS.map((r) => (
            <button
              key={r}
              id={`filter-${r.toLowerCase()}`}
              className={`inv-filter-tab ${activeFilter === r ? 'active' : ''}`}
              style={
                r !== 'All' && activeFilter === r
                  ? { borderColor: RARITY_COLORS[r as Rarity], color: RARITY_COLORS[r as Rarity] }
                  : r !== 'All'
                  ? { color: RARITY_COLORS[r as Rarity] }
                  : undefined
              }
              onClick={() => setActiveFilter(r)}
            >
              {r}
            </button>
          ))}
        </div>

        {/* ── Prize Grid ────────────────────────── */}
        {filtered.length === 0 ? (
          <div className="inv-empty animate-fade-in">
            <span className="inv-empty-icon">🎮</span>
            <p className="inv-empty-text">
              {activeFilter === 'All'
                ? 'No prizes yet! Start playing to win!'
                : `No ${activeFilter} prizes found.`}
            </p>
          </div>
        ) : (
          <div className="inv-grid animate-fade-in">
            {filtered.map((prize, index) => {
              const color = RARITY_COLORS[prize.rarity];
              return (
                <div
                  key={prize.instanceId}
                  className="inv-card card"
                  style={{
                    '--card-rarity-color': color,
                    animationDelay: `${Math.min(index * 0.05, 0.5)}s`,
                  } as React.CSSProperties}
                >
                  <div className="inv-card-emoji">{prize.emoji}</div>
                  <div className="inv-card-info">
                    <span className="inv-card-name">{prize.name}</span>
                    <span
                      className="badge inv-card-rarity"
                      style={{ color, borderColor: color }}
                    >
                      {prize.rarity}
                    </span>
                    <span className="inv-card-date">
                      {new Date(prize.wonAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
