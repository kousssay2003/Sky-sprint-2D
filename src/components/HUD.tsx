/**
 * CRAZY OBBY: SKY SPRINT 2D - Heads-Up Display (HUD)
 * Clean, unobstructed perimeter status clusters with live speedrun timer,
 * coins counter, checkpoint name, and active power-up badges.
 */

import React from 'react';
import { Volume2, VolumeX, Pause, RotateCcw, Flag, Zap, Layers } from 'lucide-react';
import { PlayerStats2D } from '../types/game2d';
import { soundManager } from '../audio/soundManager';

interface HUDProps {
  stats: PlayerStats2D;
  isMuted: boolean;
  onToggleMute: () => void;
  onPause: () => void;
  onRespawn: () => void;
  onOpenLevelSelect: () => void;
  recentPopup: { text: string; type: 'coin' | 'checkpoint' | 'powerup' } | null;
}

export const HUD: React.FC<HUDProps> = ({
  stats,
  isMuted,
  onToggleMute,
  onPause,
  onRespawn,
  onOpenLevelSelect,
  recentPopup,
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds * 100) % 100);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms
      .toString()
      .padStart(2, '0')}`;
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'Easy':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'Medium':
        return 'bg-sky-500/20 text-sky-300 border-sky-500/40';
      case 'Hard':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'Expert':
        return 'bg-red-500/20 text-red-300 border-red-500/40';
      default:
        return 'bg-slate-700 text-slate-300 border-slate-600';
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none select-none z-30 flex flex-col justify-between p-3 md:p-6">
      {/* Top Bar Status Clusters */}
      <div className="w-full flex items-start justify-between gap-2">
        {/* Top-Left: Level info & Checkpoint */}
        <div className="flex flex-col gap-1.5 pointer-events-auto">
          {/* Level Header Button */}
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenLevelSelect();
            }}
            title="Click to select level (1-20)"
            className="flex items-center gap-2 bg-slate-900/90 border border-sky-400/50 hover:border-sky-300 px-3 py-1.5 rounded-2xl shadow-xl transition-all cursor-pointer active:scale-95"
          >
            <div className="w-6 h-6 rounded-lg bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-300">
              <Layers className="w-3.5 h-3.5" />
            </div>
            <div className="flex flex-col items-start">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-black uppercase text-white tracking-wide">
                  Level {stats.currentLevel}/{stats.totalLevels}
                </span>
                <span
                  className={`text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded border ${getDifficultyColor(
                    stats.difficulty
                  )}`}
                >
                  {stats.difficulty}
                </span>
              </div>
              <span className="text-[10px] font-bold text-sky-200 line-clamp-1">
                {stats.levelName}
              </span>
            </div>
          </button>

          {/* Checkpoint Pill */}
          <div className="flex items-center gap-1.5 bg-slate-900/80 border border-white/10 px-2.5 py-0.8 rounded-xl shadow w-max">
            <Flag className="w-3 h-3 text-emerald-400" />
            <span className="text-[10px] font-bold text-slate-300">
              CP {stats.currentCheckpoint}/{stats.totalCheckpoints - 1} · {stats.checkpointName}
            </span>
          </div>
        </div>

        {/* Top-Center: Speedrun Timer & Active Power-Up Banner */}
        <div className="flex flex-col items-center">
          <div className="bg-slate-900/90 border border-amber-400/50 px-4 py-1.5 rounded-2xl shadow-lg flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs uppercase tracking-widest font-black text-amber-300">TIME</span>
            <span className="text-base font-black text-white font-mono tabular-nums tracking-wider">
              {formatTime(stats.elapsedTime)}
            </span>
          </div>

          {/* Active Power-up Pill */}
          {stats.activePowerUp && (
            <div className="mt-1.5 bg-slate-900/90 border border-sky-400/50 px-3 py-1 rounded-full text-xs font-black text-white flex items-center gap-1.5 shadow-lg animate-bounce">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span className="uppercase tracking-wider">
                {stats.activePowerUp === 'speed_sneakers'
                  ? '⚡ Speed Boost'
                  : stats.activePowerUp === 'parachute'
                    ? '🪂 Parachute Glide'
                    : '💨 Dash Ready'}
              </span>
              <span className="text-amber-300 font-mono">
                {Math.ceil(stats.powerUpTimeLeft)}s
              </span>
            </div>
          )}

          {/* Dynamic Popup Banner for Coins or Checkpoint unlocks */}
          {recentPopup && (
            <div
              className={`mt-2 px-4 py-1.5 rounded-xl font-extrabold text-xs shadow-xl animate-bounce flex items-center gap-1.5 border ${
                recentPopup.type === 'coin'
                  ? 'bg-amber-500 text-slate-950 border-amber-200'
                  : recentPopup.type === 'powerup'
                    ? 'bg-cyan-500 text-slate-950 border-cyan-200'
                    : 'bg-emerald-500 text-white border-emerald-300'
              }`}
            >
              <span>{recentPopup.text}</span>
            </div>
          )}
        </div>

        {/* Top-Right: Coins + Quick Controls */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Coin Counter */}
          <div className="flex items-center gap-2 bg-slate-900/85 border border-amber-400/40 px-3.5 py-1.5 rounded-2xl shadow-lg">
            <span className="text-lg">🪙</span>
            <div className="flex flex-col items-end">
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-amber-300">
                Coins
              </span>
              <span className="text-sm font-black text-amber-100 tabular-nums">
                {stats.coinsCollected} / {stats.totalCoins}
              </span>
            </div>
          </div>

          {/* Quick Respawn */}
          <button
            onClick={() => {
              soundManager.playClick();
              onRespawn();
            }}
            title="Respawn at checkpoint (R)"
            className="w-10 h-10 rounded-2xl bg-slate-900/85 border border-white/20 active:bg-sky-600 hover:border-sky-400 text-white flex items-center justify-center transition-all shadow-lg"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Audio Mute Toggle */}
          <button
            onClick={() => {
              soundManager.playClick();
              onToggleMute();
            }}
            title="Toggle Sound"
            className="w-10 h-10 rounded-2xl bg-slate-900/85 border border-white/20 active:bg-sky-600 hover:border-sky-400 text-white flex items-center justify-center transition-all shadow-lg"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          {/* Pause Button */}
          <button
            onClick={() => {
              soundManager.playClick();
              onPause();
            }}
            title="Pause Game (Esc)"
            className="w-10 h-10 rounded-2xl bg-slate-900/85 border border-white/20 active:bg-sky-600 hover:border-sky-400 text-white flex items-center justify-center transition-all shadow-lg"
          >
            <Pause className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Bottom Center Desktop Key Hints (Hidden on small touchscreens) */}
      <div className="hidden md:flex w-full justify-center pb-2">
        <div className="bg-slate-950/75 border border-white/10 px-4 py-1 rounded-full text-xs font-medium text-slate-300 flex items-center gap-3">
          <span>
            <kbd className="bg-slate-800 px-1.5 py-0.5 rounded text-white font-mono font-bold">A / D</kbd> Run
          </span>
          <span>•</span>
          <span>
            <kbd className="bg-slate-800 px-1.5 py-0.5 rounded text-white font-mono font-bold">Space</kbd> Jump / Double Jump / Hold to Glide
          </span>
          <span>•</span>
          <span>
            <kbd className="bg-slate-800 px-1.5 py-0.5 rounded text-white font-mono font-bold">Shift / J</kbd> Air Dash
          </span>
          <span>•</span>
          <span>
            <kbd className="bg-slate-800 px-1.5 py-0.5 rounded text-white font-mono font-bold">R</kbd> Respawn
          </span>
        </div>
      </div>
    </div>
  );
};
