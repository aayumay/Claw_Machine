// ============================================================
// HUD — Floating In-Game Heads-Up Display
// ============================================================

import { useGameStore } from '../store/gameStore';
import './HUD.css';

export function HUD() {
  const { coins, score, setScreen } = useGameStore();

  return (
    <div className="game-top-hud-floating">
      {/* Back button */}
      <button
        className="hud-float-btn"
        onClick={() => setScreen('menu')}
        aria-label="Back to menu"
      >
        ←
      </button>

      <div className="hud-float-right">
        {/* Coin counter */}
        <div className="hud-float-pill">
          <div className="hud-float-icon">🪙</div>
          <span className="hud-float-val">{coins}</span>
        </div>

        {/* Score display */}
        <div className="hud-float-pill">
          <div className="hud-float-icon">🏆</div>
          <span className="hud-float-val">{score.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
