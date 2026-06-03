import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import './Settings.css';

export const Settings = () => {
  const {
    soundEnabled,
    musicEnabled,
    toggleSound,
    toggleMusic,
    playerName,
    setPlayerName,
    resetProgress,
    setScreen,
  } = useGameStore();

  const [localName, setLocalName] = useState(playerName);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSaveName = () => {
    if (localName.trim()) {
      setPlayerName(localName.trim());
    }
  };

  const handleReset = () => {
    resetProgress();
    setShowConfirm(false);
  };

  return (
    <div className="settings-screen">
      <div className="settings-header">
        <h2>SETTINGS</h2>
        <button className="back-btn" onClick={() => setScreen('menu')}>
          ◀ BACK
        </button>
      </div>

      <div className="settings-content">
        <div className="settings-panel glass-panel">
          
          <div className="settings-group">
            <h3>Player Profile</h3>
            <div className="setting-row">
              <label>Name:</label>
              <div className="name-input-group">
                <input
                  type="text"
                  maxLength={12}
                  value={localName}
                  onChange={(e) => setLocalName(e.target.value)}
                  onBlur={handleSaveName}
                  placeholder="Enter name"
                />
              </div>
            </div>
          </div>

          <div className="settings-group">
            <h3>Audio</h3>
            <div className="setting-row">
              <label>Sound Effects</label>
              <button 
                className={`toggle-btn ${soundEnabled ? 'active' : ''}`}
                onClick={toggleSound}
              >
                {soundEnabled ? 'ON' : 'OFF'}
              </button>
            </div>
            <div className="setting-row">
              <label>Music</label>
              <button 
                className={`toggle-btn ${musicEnabled ? 'active' : ''}`}
                onClick={toggleMusic}
              >
                {musicEnabled ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>

          <div className="settings-group danger-zone">
            <h3>Danger Zone</h3>
            {!showConfirm ? (
              <button 
                className="reset-btn"
                onClick={() => setShowConfirm(true)}
              >
                RESET PROGRESS
              </button>
            ) : (
              <div className="confirm-reset">
                <p>Are you sure? This will delete all coins, scores, and prizes!</p>
                <div className="confirm-actions">
                  <button className="cancel-btn" onClick={() => setShowConfirm(false)}>CANCEL</button>
                  <button className="confirm-btn" onClick={handleReset}>YES, RESET</button>
                </div>
              </div>
            )}
          </div>
          
        </div>

        <div className="credits">
          <p>Claw Machine Arcade v1.0.0</p>
          <p>Built with React & Phaser</p>
        </div>
      </div>
    </div>
  );
};
