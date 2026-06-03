import './MachineOverlays.css';

export function MachineOverlays() {
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
      <div className="overlay-lucky">
        <div className="lucky-title">⚡ LUCKY MODE</div>
        <div className="lucky-time">00:28</div>
      </div>

    </div>
  );
}
