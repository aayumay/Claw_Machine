// ============================================================
// MainMenu — Animated Arcade Main Menu (Mockup Match)
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import { useGameStore } from '../store/gameStore';
import { MachineTheme } from '../types';
import { EventBus } from '../game/EventBus';
import { ProfileModal } from './ProfileModal';
import { StoreModal } from './StoreModal';
import './MainMenu.css';

const THEMES = [
  { id: MachineTheme.TOYS, icon: '🧸', name: 'TOYS', prizes: '14 Prizes', mythics: '★ 3 Mythics', color: '#FF6B9D' },
  { id: MachineTheme.ANIME, icon: '🎎', name: 'ANIME', prizes: '11 Prizes', mythics: '★ 2 Mythics', color: '#B44DFF' },
  { id: MachineTheme.TECH, icon: '🔧', name: 'TECH', prizes: '8 Prizes', mythics: '★ 1 Mythic', color: '#00F5FF' },
  { id: MachineTheme.MYSTERY, icon: '📦', name: 'MYSTERY', prizes: '?? Prizes', mythics: '??? Mythics', color: '#FFD700', isNew: true },
];

export function MainMenu() {
  const { 
    coins, spendCoins, totalWins, bestStreak, currentTheme, setTheme, setScreen, 
    canClaimToday, playerName, playerAvatar, activeModal, setActiveModal 
  } = useGameStore();
  const [mounted, setMounted] = useState(false);
  const canClaim = canClaimToday();

  useEffect(() => {
    setMounted(true);
  }, []);

  const PLAY_COST = 100;

  const handlePlay = useCallback(() => {
    if (coins >= PLAY_COST) {
      spendCoins(PLAY_COST);
      EventBus.emit('change-theme', currentTheme);
      setScreen('game');
    } else {
      setActiveModal('store'); // Not enough coins, open store!
    }
  }, [coins, spendCoins, currentTheme, setScreen, setActiveModal]);

  const selectedThemeData = THEMES.find(t => t.id === currentTheme) || THEMES[0];

  return (
    <div 
      className={`main-menu screen ${mounted ? 'mounted' : ''}`}
      style={{ 
        '--theme-glow-color': selectedThemeData.color,
        background: `radial-gradient(circle at 50% 30%, color-mix(in srgb, ${selectedThemeData.color} 15%, #0b0512), #0b0512)`
      } as React.CSSProperties}
    >
      
      {/* ── Top Fixed HUD (Mockup Style) ─────────────────────── */}
      <div className="menu-top-hud animate-slide-down delay-1">
        
        {/* Profile */}
        <div className="hud-profile" onClick={() => setActiveModal('profile')} style={{ cursor: 'pointer' }}>
          <div className="hud-avatar">
            {playerAvatar}
            <div className="hud-level-badge">12</div>
          </div>
          <div className="hud-profile-info">
            <span className="hud-name">{playerName || 'ClawMaster'}</span>
            <span className="hud-rank">🛡️ Rookie</span>
          </div>
        </div>

        {/* Coins */}
        <div className="hud-coins" onClick={() => setActiveModal('store')} style={{ cursor: 'pointer' }}>
          <span className="hud-coin-icon">🪙</span>
          <span className="hud-val">{coins}</span>
          <button className="hud-add-btn">＋</button>
        </div>

        {/* Stats */}
        <div className="hud-stats">
          <span className="hud-icon">🏆</span>
          <span className="hud-val">{totalWins}</span>
          <span className="hud-icon spacer">🔥</span>
          <span className="hud-val">{bestStreak}</span>
        </div>
      </div>

      <div className="menu-content screen-content mockup-spacing">
        
        {/* ── Title Section ─────────────────────── */}
        <div className="menu-title-section animate-slide-down delay-2">
          <div className="menu-joystick">🕹️</div>
          <h1 className="menu-title">CLAW<br />MACHINE</h1>
          <h2 className="menu-subtitle">DROP THE CLAW. GRAB THE PRIZE.</h2>
        </div>

        {/* ── Jackpot Marquee (Retained) ─────────── */}
        <div className="menu-marquee-container animate-fade-in delay-3">
          <div className="menu-marquee">
            <span>🚨 JACKPOT: 👺 Sukuna Finger • 💠 Omni Crystal • 🤖 Eva Unit 01 • 🍎 Golden Apple 🚨</span>
            <span>🚨 JACKPOT: 👺 Sukuna Finger • 💠 Omni Crystal • 🤖 Eva Unit 01 • 🍎 Golden Apple 🚨</span>
          </div>
        </div>

        {/* ── Section Divider ─────────────────────── */}
        <div className="section-divider animate-fade-in delay-3">
          <span>SELECT MACHINE</span>
        </div>

        {/* ── Theme Selector (2x2 Horizontal) ──────── */}
        <div className="theme-grid-2x2 animate-slide-up delay-3">
          {THEMES.map((theme) => (
            <button
              key={theme.id}
              id={`theme-${theme.name.toLowerCase()}`}
              className={`theme-card-horizontal ${currentTheme === theme.id ? 'selected' : ''}`}
              style={{ '--theme-color': theme.color } as React.CSSProperties}
              onClick={() => setTheme(theme.id)}
            >
              {theme.isNew && <span className="theme-badge-new">NEW</span>}
              <div className="theme-icon-large">{theme.icon}</div>
              <div className="theme-info-stack">
                <h3 className="theme-name">{theme.name}</h3>
                <span className="theme-prizes" style={{ color: theme.color }}>{theme.prizes}</span>
                <span className="theme-mythics" style={{ color: theme.color }}>{theme.mythics}</span>
              </div>
            </button>
          ))}
        </div>

        {/* ── Play Section ───────────────────────── */}
        <div className="menu-play-section animate-slide-up delay-4">
          <div className="play-cost-pill">
            🎫 1 PLAY = 🪙 100
          </div>
          <button 
            className="play-btn-huge dynamic-glow" 
            onClick={handlePlay}
          >
            <span className="play-main-text">INSERT COIN</span>
            <span className="play-sub-text">TAP TO PLAY</span>
          </button>
        </div>

        {/* ── Navigation Grid (4 Squares) ────────── */}
        <div className="nav-grid-4x animate-slide-up delay-5">
          <button className="nav-square-btn" onClick={() => setScreen('inventory')}>
            <span className="nav-sq-icon">🎒</span> 
            <span className="nav-sq-label">COLLECTION</span>
          </button>
          <button className="nav-square-btn" onClick={() => setScreen('leaderboard')}>
            <span className="nav-sq-icon">🏆</span>
            <span className="nav-sq-label">RANKINGS</span>
          </button>
          <button className="nav-square-btn" onClick={() => setScreen('daily')}>
            <span className="nav-sq-icon">🎁</span>
            <span className="nav-sq-label">DAILY</span>
            {canClaim && <span className="notification-badge-sq">!</span>}
          </button>
          <button className="nav-square-btn" onClick={() => setScreen('settings')}>
            <span className="nav-sq-icon">⚙️</span>
            <span className="nav-label">SETTINGS</span>
          </button>
        </div>

        {/* ── Trust Badges Footer ─────────────────── */}
        <div className="trust-footer animate-fade-in delay-6">
          <div className="trust-badge">
            <span className="trust-icon">🛡️</span>
            <div className="trust-text">
              <strong>100% FAIR PLAY</strong>
              <span>Provably Fair</span>
            </div>
          </div>
          <div className="trust-divider"></div>
          <div className="trust-badge">
            <span className="trust-icon">🔒</span>
            <div className="trust-text">
              <strong>SECURE & SAFE</strong>
              <span>Your data is safe</span>
            </div>
          </div>
        </div>

      </div>

      {/* ── Modals ─────────────────────────────── */}
      {activeModal === 'profile' && <ProfileModal />}
      {activeModal === 'store' && <StoreModal />}
    </div>
  );
}
