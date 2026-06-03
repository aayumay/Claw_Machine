import { useEffect, useState } from 'react';
import { useGameStore } from './store/gameStore';
import { EventBus } from './game/EventBus';
import { LaunchPage } from './components/LaunchPage';
import { MainMenu } from './components/MainMenu';
import { PhaserGame } from './components/PhaserGame';
import { HUD } from './components/HUD';
import { Controls } from './components/Controls';
import { MachineOverlays } from './components/MachineOverlays';
import { Inventory } from './components/Inventory';
import { Leaderboard } from './components/Leaderboard';
import { DailyRewards } from './components/DailyRewards';
import { Settings } from './components/Settings';
import { WinModal } from './components/WinModal';
import type { GrabResult } from './types';
import { ClawState, Rarity } from './types';
import { getThemeColors } from './game/data/prizes';
import './App.css';

export const App = () => {
  const { 
    currentScreen, currentTheme, initDailyRewards, addPrize, addScore, addCoins, 
    incrementGrabs, incrementWins, resetStreak, tickLuckyMode, addLuckyCharge, setInstallPromptEvent
  } = useGameStore();
  const [winResult, setWinResult] = useState<GrabResult | null>(null);
  const [isClawBusy, setIsClawBusy] = useState(false);

  useEffect(() => {
    // PWA Install Prompt Capture
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault(); // Prevent the mini-infobar from appearing on mobile
      setInstallPromptEvent(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [setInstallPromptEvent]);

  useEffect(() => {
    // Global ticker for Lucky Mode
    const ticker = setInterval(() => {
      tickLuckyMode();
    }, 1000);
    return () => clearInterval(ticker);
  }, [tickLuckyMode]);

  useEffect(() => {
    // Initialize daily rewards system
    initDailyRewards();

    // Listeners for game events
    const handleGrabResult = (result: GrabResult) => {
      incrementGrabs();
      if (result.success && result.prize) {
        incrementWins();
        addScore(result.prize.value);
        addPrize({
          ...result.prize,
          wonAt: Date.now(),
          instanceId: Math.random().toString(36).substr(2, 9),
        });

        // Rare item bonuses (Coins & Vibration)
        if (result.prize.rarity === Rarity.MYTHIC) {
          addCoins(50); // Big coin bonus for Mythic
          if ('vibrate' in navigator) {
            navigator.vibrate([300, 100, 300, 100, 500]); // Epic pulsing vibration
          }
        } else if (result.prize.rarity === Rarity.LEGENDARY) {
          addCoins(10); // Small coin bonus for Legendary
          if ('vibrate' in navigator) {
            navigator.vibrate([200, 100, 200]);
          }
        }

        setWinResult(result);
        setWinResult(result);
      } else {
        resetStreak();
      }

      // Add to guaranteed Lucky Mode charge meter
      addLuckyCharge(25);
    };

    const handleClawState = (state: ClawState) => {
      setIsClawBusy(state !== ClawState.IDLE && state !== ClawState.MOVING);
    };

    EventBus.on('grab-result', handleGrabResult);
    EventBus.on('claw-state-change', handleClawState);

    return () => {
      EventBus.off('grab-result', handleGrabResult);
      EventBus.off('claw-state-change', handleClawState);
    };
  }, []);

  // Update theme colors as CSS variables
  useEffect(() => {
    const colors = getThemeColors(currentTheme);
    const root = document.documentElement;
    root.style.setProperty('--theme-primary', colors.primary);
    root.style.setProperty('--theme-secondary', colors.secondary);
    root.style.setProperty('--theme-accent', colors.accent);
    root.style.setProperty('--theme-bg', colors.background);
    root.style.setProperty('--theme-neon', colors.neon);
    root.style.setProperty('--theme-machine', colors.machineFrame);
  }, [currentTheme]);

  return (
    <div className={`app-container theme-${currentTheme.toLowerCase().replace(' ', '-')}`}>
      {currentScreen === 'landing' && <LaunchPage />}
      {currentScreen === 'menu' && <MainMenu />}
      
      {currentScreen === 'game' && (
        <div className="game-screen screen">
          <div className="game-wrapper">
            <PhaserGame />
            <HUD />
            <MachineOverlays />
            <Controls disabled={isClawBusy} />
          </div>
        </div>
      )}

      {currentScreen === 'inventory' && <Inventory />}
      {currentScreen === 'leaderboard' && <Leaderboard />}
      {currentScreen === 'daily' && <DailyRewards />}
      {currentScreen === 'settings' && <Settings />}

        {winResult && winResult.prize && (
        <WinModal 
          prize={winResult.prize} 
          onCollect={() => setWinResult(null)} 
        />
      )}
    </div>
  );
};
