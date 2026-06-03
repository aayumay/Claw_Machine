import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import './Modal.css';

export function StoreModal() {
  const { coins, addCoins, setActiveModal, setScreen } = useGameStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleWatchAd = () => {
    if (isLoading) return;
    setIsLoading(true);
    // Simulate watching an ad
    setTimeout(() => {
      addCoins(50);
      setIsLoading(false);
    }, 1500);
  };

  const handleGoToDaily = () => {
    setActiveModal('none');
    setScreen('daily');
  };

  return (
    <div className="modal-overlay animate-fade-in" onClick={() => setActiveModal('none')}>
      <div className="modal-container store-theme animate-slide-up" onClick={(e) => e.stopPropagation()}>
        
        <div className="modal-header">
          <h2>COIN SHOP</h2>
          <button className="modal-close" onClick={() => setActiveModal('none')}>×</button>
        </div>

        <div className="modal-body">
          <div className="store-balance">
            <span>Current Balance:</span>
            <div className="store-coins">
              <span className="coin-icon">🪙</span>
              <span className="coin-val">{coins}</span>
            </div>
          </div>

          <div className="store-options">
            
            <button className="store-card watch-ad" onClick={handleWatchAd} disabled={isLoading}>
              <div className="store-card-icon">📺</div>
              <div className="store-card-info">
                <h3>Watch Ad</h3>
                <p>Support the dev!</p>
              </div>
              <div className="store-card-reward">
                {isLoading ? <span className="spinner">⏳</span> : '+50 🪙'}
              </div>
            </button>

            <button className="store-card daily-bonus" onClick={handleGoToDaily}>
              <div className="store-card-icon">🎁</div>
              <div className="store-card-info">
                <h3>Daily Rewards</h3>
                <p>Come back every day!</p>
              </div>
              <div className="store-card-action">
                GO ➔
              </div>
            </button>

            <button className="store-card buy-coins" onClick={() => addCoins(500)}>
              <div className="store-card-icon">💎</div>
              <div className="store-card-info">
                <h3>Mega Pack (Mock)</h3>
                <p>Get 500 Coins Instantly</p>
              </div>
              <div className="store-card-action">
                FREE
              </div>
            </button>

          </div>
        </div>

      </div>
    </div>
  );
}
