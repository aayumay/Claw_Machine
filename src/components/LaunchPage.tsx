import { useGameStore } from '../store/gameStore';
import './LaunchPage.css';

export function LaunchPage() {
  const { setScreen } = useGameStore();

  return (
    <div className="launch-screen screen animate-fade-in" onClick={() => setScreen('menu')}>
      <div className="launch-content">
        <div className="launch-logo">CLAW<br/>ARCADE</div>
        <div className="launch-prompt">TAP TO START</div>
      </div>
      <div className="launch-footer">
        Made by Aayush
      </div>
    </div>
  );
}
