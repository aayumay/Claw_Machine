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
    installPromptEvent,
    clearInstallPromptEvent,
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

  const handleInstallClick = async () => {
    if (!installPromptEvent) {
      alert("App installation is not available right now.\n\nThis could be because:\n1. The app is already installed.\n2. You are using Safari/iOS (use 'Share > Add to Home Screen' instead).\n3. You are running in a development environment without HTTPS.");
      return;
    }
    
    // Show the install prompt
    installPromptEvent.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await installPromptEvent.userChoice;
    
    // We no longer need the prompt. Clear it up.
    if (outcome === 'accepted') {
      clearInstallPromptEvent();
    }
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

          <div className="settings-group">
            <h3>App Options</h3>
            <div className="setting-row">
              <label>Download App (PWA)</label>
              <button 
                className="action-btn"
                onClick={handleInstallClick}
                style={{ 
                  padding: '8px 16px', 
                  background: 'rgba(0, 255, 150, 0.2)', 
                  border: '1px solid rgba(0, 255, 150, 0.5)', 
                  borderRadius: '12px',
                  color: '#fff'
                }}
              >
                ⬇️ INSTALL
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
