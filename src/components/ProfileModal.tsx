import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import './Modal.css';

const AVATARS = ['🐱', '🦊', '🐉', '🤖', '🐼', '👽', '👻', '🐶', '🐯', '🦄'];

export function ProfileModal() {
  const { playerName, setPlayerName, playerAvatar, setPlayerAvatar, setActiveModal } = useGameStore();
  const [tempName, setTempName] = useState(playerName);

  const handleSave = () => {
    setPlayerName(tempName.trim() || 'Player');
    setActiveModal('none');
  };

  return (
    <div className="modal-overlay animate-fade-in" onClick={() => setActiveModal('none')}>
      <div className="modal-container animate-slide-up" onClick={(e) => e.stopPropagation()}>
        
        <div className="modal-header">
          <h2>PLAYER PROFILE</h2>
          <button className="modal-close" onClick={() => setActiveModal('none')}>×</button>
        </div>

        <div className="modal-body">
          <div className="profile-edit-avatar">
            <div className="current-avatar">{playerAvatar}</div>
          </div>

          <div className="form-group">
            <label>Player Name</label>
            <input 
              type="text" 
              value={tempName} 
              onChange={(e) => setTempName(e.target.value)} 
              maxLength={12}
              className="name-input"
            />
          </div>

          <div className="form-group">
            <label>Choose Avatar</label>
            <div className="avatar-grid">
              {AVATARS.map((emoji) => (
                <button 
                  key={emoji}
                  className={`avatar-select-btn ${playerAvatar === emoji ? 'selected' : ''}`}
                  onClick={() => setPlayerAvatar(emoji)}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-primary" onClick={handleSave}>SAVE CHANGES</button>
        </div>

      </div>
    </div>
  );
}
