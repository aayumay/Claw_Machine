// ============================================================
// Controls — Floating Glassmorphism Game Controls
// ============================================================

import { useCallback } from 'react';
import { EventBus } from '../game/EventBus';
import './Controls.css';

interface ControlsProps {
  disabled?: boolean;
}

export function Controls({ disabled = false }: ControlsProps) {
  const handleLeftDown = useCallback(() => {
    if (!disabled) EventBus.emit('move-left');
  }, [disabled]);

  const handleRightDown = useCallback(() => {
    if (!disabled) EventBus.emit('move-right');
  }, [disabled]);

  const handleMoveStop = useCallback(() => {
    EventBus.emit('move-stop');
  }, []);

  const handleDrop = useCallback(() => {
    if (!disabled) EventBus.emit('drop-claw');
  }, [disabled]);

  return (
    <div className="controls-float-section" id="game-controls">
      
      {/* Left button */}
      <button
        className={`ctrl-float-sq ${disabled ? 'disabled' : ''}`}
        onPointerDown={handleLeftDown}
        onPointerUp={handleMoveStop}
        onPointerLeave={handleMoveStop}
        aria-label="Move left"
      >
        <div className="ctrl-float-arrow">◀</div>
      </button>

      {/* Center Drop button */}
      <button
        className={`ctrl-float-drop ${disabled ? 'disabled' : ''}`}
        onPointerDown={handleDrop}
        disabled={disabled}
        aria-label="Drop claw"
      >
        <div className="ctrl-float-drop-text">DROP!</div>
      </button>

      {/* Right button */}
      <button
        className={`ctrl-float-sq ${disabled ? 'disabled' : ''}`}
        onPointerDown={handleRightDown}
        onPointerUp={handleMoveStop}
        onPointerLeave={handleMoveStop}
        aria-label="Move right"
      >
        <div className="ctrl-float-arrow">▶</div>
      </button>

    </div>
  );
}
