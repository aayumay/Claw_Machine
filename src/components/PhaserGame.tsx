// ============================================================
// PhaserGame — Bridge Component
// ============================================================
// Creates a container for the Phaser canvas, initializes the
// game on mount, and cleans up on unmount.

import { forwardRef, useEffect, useRef, useImperativeHandle } from 'react';
import type Phaser from 'phaser';
import { gameConfig } from '../game/config';

export interface PhaserGameRef {
  game: Phaser.Game | null;
}

export const PhaserGame = forwardRef<PhaserGameRef>(function PhaserGame(_props, ref) {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);

  useImperativeHandle(ref, () => ({
    get game() {
      return gameRef.current;
    },
  }));

  useEffect(() => {
    if (!containerRef.current) return;

    const startGame = async () => {
      const Phaser = (await import('phaser')).default;
      if (!containerRef.current || gameRef.current) return;

      const config = {
        ...gameConfig,
        parent: containerRef.current
      };
      gameRef.current = new Phaser.Game(config);
    };

    startGame();

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      id="phaser-container"
      style={{
        width: '100%',
        height: '100%',
        maxWidth: '480px',
        maxHeight: '800px',
        margin: '0 auto',
        position: 'relative',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 0 40px rgba(180, 77, 255, 0.15), 0 8px 32px rgba(0, 0, 0, 0.5)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        flex: 1,
        minHeight: 0,
      }}
    />
  );
});
