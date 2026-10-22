/**
 * CRAZY OBBY: SKY SPRINT 2D
 * Main Application Shell & 2D Game Orchestrator
 * Supports 20 progressive sky levels across 4 worlds with level select,
 * mobile touch controls, HUD, sound effects, and victory celebrations.
 */

import { useEffect, useRef, useState } from 'react';
import { GameEngine2D } from './game2d/engine2d';
import { GameStatus, LevelRecord, PlayerStats2D } from './types/game2d';
import { soundManager } from './audio/soundManager';
import { HUD } from './components/HUD';
import { TouchControls } from './components/TouchControls';
import { MainMenu } from './components/MainMenu';
import { PauseModal } from './components/PauseModal';
import { VictoryModal } from './components/VictoryModal';
import { LevelSelectModal } from './components/LevelSelectModal';
import { getTotalLevels } from './game2d/level2d';

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<GameEngine2D | null>(null);

  const [status, setStatus] = useState<GameStatus>('menu');
  const [isMuted, setIsMuted] = useState<boolean>(soundManager.isMuted());
  const [showLevelSelect, setShowLevelSelect] = useState<boolean>(false);
  const [maxUnlockedLevel, setMaxUnlockedLevel] = useState<number>(1);
  const [levelRecords, setLevelRecords] = useState<Record<number, LevelRecord>>({});

  const [recentPopup, setRecentPopup] = useState<{
    text: string;
    type: 'coin' | 'checkpoint' | 'powerup';
  } | null>(null);
  const popupTimeoutRef = useRef<number | null>(null);

  const [stats, setStats] = useState<PlayerStats2D>({
    currentLevel: 1,
    totalLevels: getTotalLevels(),
    levelName: 'First Steps',
    difficulty: 'Easy',
    coinsCollected: 0,
    totalCoins: 6,
    currentCheckpoint: 0,
    totalCheckpoints: 2,
    checkpointName: 'Start Island',
    fallCount: 0,
    elapsedTime: 0,
    bestTime: null,
    activePowerUp: null,
    powerUpTimeLeft: 0,
    dashAvailable: true,
  });

  // Initialize 2D Canvas Engine
  useEffect(() => {
    if (!canvasRef.current) return;

    const engine = new GameEngine2D(canvasRef.current, {
      onStatsChange: (newStats) => {
        setStats(newStats);
      },
      onStatusChange: (newStatus) => {
        setStatus(newStatus);
      },
      onCoinPopup: (count) => {
        if (popupTimeoutRef.current) clearTimeout(popupTimeoutRef.current);
        setRecentPopup({ text: `+1 Coin! (${count})`, type: 'coin' });
        popupTimeoutRef.current = window.setTimeout(() => {
          setRecentPopup(null);
        }, 1200);
      },
      onPowerUpPopup: (type) => {
        if (popupTimeoutRef.current) clearTimeout(popupTimeoutRef.current);
        const label =
          type === 'speed_sneakers'
            ? '⚡ Speed Sneakers Active!'
            : type === 'parachute'
              ? '🪂 Parachute Glide Unlocked!'
              : '💨 Dash Orb Collected!';
        setRecentPopup({ text: label, type: 'powerup' });
        popupTimeoutRef.current = window.setTimeout(() => {
          setRecentPopup(null);
        }, 1800);
      },
      onCheckpointPopup: (name) => {
        if (popupTimeoutRef.current) clearTimeout(popupTimeoutRef.current);
        setRecentPopup({ text: `Checkpoint: ${name}!`, type: 'checkpoint' });
        popupTimeoutRef.current = window.setTimeout(() => {
          setRecentPopup(null);
        }, 2000);
      },
      onLevelComplete: (_level, _stars) => {
        if (engineRef.current) {
          setMaxUnlockedLevel(engineRef.current.maxUnlockedLevel);
          setLevelRecords({ ...engineRef.current.levelRecords });
        }
      },
    });

    engineRef.current = engine;
    setMaxUnlockedLevel(engine.maxUnlockedLevel);
    setLevelRecords({ ...engine.levelRecords });

    return () => {
      if (popupTimeoutRef.current) clearTimeout(popupTimeoutRef.current);
      engine.destroy();
      engineRef.current = null;
    };
  }, []);

  const handleStartGame = () => {
    if (engineRef.current) {
      engineRef.current.setStatus('playing');
    }
  };

  const handlePause = () => {
    if (engineRef.current) {
      engineRef.current.setStatus('paused');
    }
  };

  const handleResume = () => {
    if (engineRef.current) {
      engineRef.current.setStatus('playing');
    }
  };

  const handleRespawn = () => {
    if (engineRef.current) {
      engineRef.current.respawnAtCurrentCheckpoint();
    }
  };

  const handleRestartLevel = () => {
    if (engineRef.current) {
      engineRef.current.restartGame();
    }
  };

  const handleNextLevel = () => {
    if (engineRef.current) {
      engineRef.current.nextLevel();
      setMaxUnlockedLevel(engineRef.current.maxUnlockedLevel);
      setLevelRecords({ ...engineRef.current.levelRecords });
    }
  };

  const handleSelectLevel = (levelNum: number) => {
    if (engineRef.current) {
      engineRef.current.loadLevel(levelNum);
      setShowLevelSelect(false);
    }
  };

  const handleToggleMute = () => {
    const nextMuted = soundManager.toggleMute();
    setIsMuted(nextMuted);
  };

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-sky-950 font-sans select-none touch-none">
      {/* 2D HTML5 Canvas Viewport */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block z-0" />

      {/* Heads-Up Display during gameplay or pause */}
      {(status === 'playing' || status === 'paused') && (
        <HUD
          stats={stats}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          onPause={handlePause}
          onRespawn={handleRespawn}
          onOpenLevelSelect={() => setShowLevelSelect(true)}
          recentPopup={recentPopup}
        />
      )}

      {/* Mobile-first Touch Controls (Joystick + Jump/Glide + Dash) */}
      <TouchControls
        engine={engineRef.current}
        visible={status === 'playing' && !showLevelSelect}
        dashAvailable={stats.dashAvailable}
        hasParachute={stats.activePowerUp === 'parachute'}
      />

      {/* Title / Main Menu */}
      {status === 'menu' && !showLevelSelect && (
        <MainMenu
          onStart={handleStartGame}
          onOpenLevelSelect={() => setShowLevelSelect(true)}
          bestTime={stats.bestTime}
          maxUnlockedLevel={maxUnlockedLevel}
        />
      )}

      {/* Pause Menu Modal */}
      {status === 'paused' && !showLevelSelect && (
        <PauseModal
          onResume={handleResume}
          onRestart={handleRestartLevel}
          onRespawn={handleRespawn}
          onOpenLevelSelect={() => setShowLevelSelect(true)}
          checkpointName={stats.checkpointName}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
        />
      )}

      {/* Victory Celebration Modal */}
      {status === 'victory' && !showLevelSelect && (
        <VictoryModal
          stats={stats}
          onNextLevel={handleNextLevel}
          onReplayLevel={handleRestartLevel}
          onOpenLevelSelect={() => setShowLevelSelect(true)}
        />
      )}

      {/* 20 Progressive Levels Selector Modal */}
      {showLevelSelect && (
        <LevelSelectModal
          currentLevel={stats.currentLevel}
          maxUnlockedLevel={maxUnlockedLevel}
          levelRecords={levelRecords}
          onSelectLevel={handleSelectLevel}
          onClose={() => setShowLevelSelect(false)}
        />
      )}
    </main>
  );
}
