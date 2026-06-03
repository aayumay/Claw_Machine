// ============================================================
// Leaderboard — High Scores Screen
// ============================================================

import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import './Leaderboard.css';

export function Leaderboard() {
  const { leaderboard, score, playerName, setPlayerName, submitScore, setScreen } =
    useGameStore();
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(playerName);
  const [submitted, setSubmitted] = useState(false);

  const RANK_MEDALS = ['🥇', '🥈', '🥉'];

  const handleSubmit = () => {
    if (score <= 0) return;
    submitScore(playerName);
    setSubmitted(true);
  };

  const handleSaveName = () => {
    const trimmed = nameInput.trim();
    if (trimmed) {
      setPlayerName(trimmed);
    }
    setEditingName(false);
  };

  const playerOnBoard = leaderboard.findIndex(
    (e) => e.name === playerName && e.score === score
  );

  return (
    <div className="screen leaderboard-screen">
      <div className="screen-content">
        {/* ── Header ────────────────────────────── */}
        <div className="screen-header">
          <button id="lb-back" className="back-btn" onClick={() => setScreen('menu')}>←</button>
          <h1 className="neon-text-gold">🏆 LEADERBOARD</h1>
        </div>

        {/* ── Player Name ───────────────────────── */}
        <div className="lb-player-section animate-slide-down delay-1">
          <div className="lb-player-name-row">
            <span className="lb-player-label">Your Name:</span>
            {editingName ? (
              <div className="lb-name-edit">
                <input
                  id="lb-name-input"
                  className="input"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                  maxLength={16}
                  autoFocus
                />
                <button className="btn btn-sm btn-primary" onClick={handleSaveName}>
                  Save
                </button>
              </div>
            ) : (
              <button
                className="lb-player-name"
                onClick={() => setEditingName(true)}
              >
                {playerName} ✏️
              </button>
            )}
          </div>

          {score > 0 && !submitted && (
            <button
              id="btn-submit-score"
              className="btn btn-gold btn-lg lb-submit-btn"
              onClick={handleSubmit}
            >
              🏆 Submit Score ({score.toLocaleString()})
            </button>
          )}

          {submitted && (
            <div className="lb-submitted animate-fade-in">
              ✅ Score submitted!
            </div>
          )}
        </div>

        {/* ── Top 3 ─────────────────────────────── */}
        <div className="lb-top3 animate-slide-up delay-2">
          {leaderboard.slice(0, 3).map((entry, i) => {
            const isPlayer = entry.name === playerName;
            return (
              <div
                key={`${entry.name}-${i}`}
                className={`lb-top-card card ${i === 0 ? 'lb-first' : ''} ${isPlayer ? 'lb-player' : ''}`}
              >
                <span className="lb-medal">{RANK_MEDALS[i]}</span>
                <div className="lb-top-info">
                  <span className="lb-top-name">{entry.name}</span>
                  <span className="lb-top-score">{entry.score.toLocaleString()}</span>
                </div>
                <span className="lb-top-wins">{entry.totalWins} wins</span>
              </div>
            );
          })}
        </div>

        {/* ── Rest of Board ─────────────────────── */}
        {leaderboard.length > 3 && (
          <div className="lb-list animate-slide-up delay-3">
            {leaderboard.slice(3).map((entry, i) => {
              const rank = i + 4;
              const isPlayer = entry.name === playerName;
              return (
                <div
                  key={`${entry.name}-${rank}`}
                  className={`lb-row ${isPlayer ? 'lb-player' : ''}`}
                >
                  <span className="lb-rank">{rank}</span>
                  <span className="lb-row-name">{entry.name}</span>
                  <span className="lb-row-score">{entry.score.toLocaleString()}</span>
                  <span className="lb-row-wins">{entry.totalWins}W</span>
                </div>
              );
            })}
          </div>
        )}

        {playerOnBoard === -1 && score > 0 && (
          <div className="lb-not-on-board animate-fade-in delay-4">
            <p>Your score: <strong>{score.toLocaleString()}</strong> — Keep playing to reach the top!</p>
          </div>
        )}
      </div>
    </div>
  );
}
