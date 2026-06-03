import { useGameStore } from '../store/gameStore';
import './MachineOverlays.css';

export function MachineOverlays() {
  const { luckyModeActive, luckyModeTimeLeft, luckyCharge } = useGameStore();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="machine-overlays-container pointer-events-none">
      
      {/* ── Left: Prize Value Legend ── */}
      <div className="overlay-legend">
        <div className="legend-title">PRIZE VALUE</div>
        <div className="legend-item"><span className="dot dot-common"></span> Common</div>
        <div className="legend-item"><span className="dot dot-rare"></span> Rare</div>
        <div className="legend-item"><span className="dot dot-epic"></span> Epic</div>
        <div className="legend-item"><span className="dot dot-mythic"></span> Mythic</div>
      </div>

      {/* ── Right: Lucky Mode ── */}
      <div className={`overlay-lucky ${luckyModeActive ? 'active animate-pulse-intense' : ''}`}>
        <div className="lucky-title">⚡ LUCKY MODE</div>
        
        {luckyModeActive ? (
          <div className="lucky-time">{formatTime(luckyModeTimeLeft)}</div>
        ) : (
          <div className="lucky-charge-container">
            <div className="lucky-charge-text">CHARGING... {luckyCharge}%</div>
            <div className="lucky-charge-bar-bg">
              <div 
                className="lucky-charge-bar-fill" 
                style={{ width: `${luckyCharge}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
