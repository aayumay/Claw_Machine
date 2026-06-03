import { useGameStore } from '../store/gameStore';
import './GameHeader.css';

export function GameHeader() {
  const { totalGrabs, totalWins, inventory, playerName } = useGameStore();

  const nextRewardProgress = Math.min((totalWins % 10) / 10 * 100, 100);
  const nextRewardCount = totalWins % 10;

  const missionTarget = 10;
  const missionCount = Math.min(totalGrabs, missionTarget);
  const missionProgress = (missionCount / missionTarget) * 100;

  const recentPrize = inventory.length > 0 ? inventory[inventory.length - 1] : null;

  return (
    <div className="game-header-section">
      
      {/* ── Top Row: Next Reward | Title | Daily Mission ── */}
      <div className="gh-top-row">
        
        {/* Left: Next Reward */}
        <div className="gh-side-panel">
          <div className="gh-panel-title">NEXT REWARD</div>
          <div className="gh-panel-content">
            <span className="gh-panel-icon">🎁</span>
            <span className="gh-panel-text">Bonus 100 🪙</span>
          </div>
          <div className="gh-progress-row">
            <div className="gh-progress-bar">
              <div className="gh-progress-fill" style={{ width: `${nextRewardProgress}%` }}></div>
            </div>
            <span className="gh-progress-text">{nextRewardCount} / 10</span>
          </div>
        </div>

        {/* Right: Daily Mission */}
        <div className="gh-side-panel">
          <div className="gh-panel-title">DAILY MISSION</div>
          <div className="gh-panel-content">
            <span className="gh-panel-icon">🎯</span>
            <span className="gh-panel-text">Play {missionTarget} Times</span>
          </div>
          <div className="gh-progress-row">
            <div className="gh-progress-bar">
              <div className="gh-progress-fill" style={{ width: `${missionProgress}%` }}></div>
            </div>
            <span className="gh-progress-text">{missionCount} / {missionTarget}</span>
          </div>
          <div className="gh-mission-reward">REWARD: 🪙 50</div>
        </div>

      </div>

      {/* ── Bottom Row: Marquee ── */}
      <div className="gh-marquee-container">
        <span className="gh-marquee-label">📢 RECENT WINNER:</span>
        <div className="gh-marquee-content">
          <span>
            {recentPrize 
              ? `${playerName || 'You'} won ${recentPrize.name} ${recentPrize.emoji}` 
              : `Player123 won Golden Apple 🍎`}
          </span>
        </div>
        <span className="gh-marquee-time">Just now</span>
      </div>

    </div>
  );
}
