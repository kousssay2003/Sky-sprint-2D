/**
 * CRAZY OBBY: SKY SPRINT - Victory Modal
 * Celebrates reaching the Finish Stargate with stats, star ratings, and instant speedrun replay.
 */

import React from 'react';
import { Trophy, Star, RotateCcw, Clock, ShieldCheck, ArrowRight, Layers, Sparkles } from 'lucide-react';
import { PlayerStats2D } from '../types/game2d';
import { soundManager } from '../audio/soundManager';

interface VictoryModalProps {
  stats: PlayerStats2D;
  onNextLevel: () => void;
  onReplayLevel: () => void;
  onOpenLevelSelect: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  stats,
  onNextLevel,
  onReplayLevel,
  onOpenLevelSelect,
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds * 100) % 100);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms
      .toString()
      .padStart(2, '0')}`;
  };

  // Determine star rating (1 to 3 stars)
  const isPerfectCoins = stats.coinsCollected === stats.totalCoins;
  const isZeroFalls = stats.fallCount === 0;
  const isFast = stats.elapsedTime < 30;

  let stars = 1;
  if (isPerfectCoins || isZeroFalls || isFast) stars = 2;
  if ((isPerfectCoins && isZeroFalls) || (isPerfectCoins && isFast) || (isZeroFalls && isFast)) {
    stars = 3;
  }

  const isFinalLevel = stats.currentLevel >= stats.totalLevels;
  const isNewRecord = stats.bestTime !== null && Math.abs(stats.elapsedTime - stats.bestTime) < 0.1;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 select-none">
      <div className="w-full max-w-md bg-slate-900 border-2 border-emerald-400/60 rounded-3xl p-6 sm:p-7 shadow-2xl flex flex-col items-center text-center">
        {/* Trophy Header */}
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-500 to-yellow-300 p-0.5 shadow-[0_0_30px_rgba(245,158,11,0.5)] mb-3">
          <div className="w-full h-full bg-slate-900 rounded-[22px] flex items-center justify-center">
            {isFinalLevel ? (
              <Sparkles className="w-9 h-9 text-amber-300 animate-spin" />
            ) : (
              <Trophy className="w-9 h-9 text-amber-400 animate-bounce" />
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-500/40">
            {isFinalLevel ? 'ALL 20 LEVELS COMPLETE!' : `LEVEL ${stats.currentLevel} / ${stats.totalLevels} COMPLETE`}
          </span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-emerald-300 to-teal-200 uppercase">
          {isFinalLevel ? 'Grand Apex Champion!' : stats.levelName}
        </h2>
        <p className="text-xs font-bold text-sky-200 mt-0.5 mb-4">
          {isFinalLevel
            ? 'Incredible! You completed all 20 obstacle courses in Crazy Obby!'
            : `Stargate portal reached! Ready for level ${stats.currentLevel + 1}?`}
        </p>

        {/* 3 Stars Award */}
        <div className="flex items-center gap-2 mb-5">
          {[1, 2, 3].map((starIdx) => (
            <Star
              key={starIdx}
              className={`w-8 h-8 transition-all ${
                starIdx <= stars
                  ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)] scale-110'
                  : 'text-slate-700'
              }`}
            />
          ))}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2.5 w-full mb-5">
          {/* Time */}
          <div className="bg-slate-800/90 border border-white/10 p-2.5 rounded-2xl flex flex-col items-center">
            <Clock className="w-4 h-4 text-sky-400 mb-1" />
            <span className="text-[10px] font-extrabold uppercase text-slate-400">Total Time</span>
            <span className="text-sm font-black text-white font-mono tabular-nums">
              {formatTime(stats.elapsedTime)}
            </span>
            {isNewRecord && (
              <span className="text-[9px] font-black text-emerald-400 uppercase mt-0.5 animate-pulse">
                New Best!
              </span>
            )}
          </div>

          {/* Coins */}
          <div className="bg-slate-800/90 border border-white/10 p-2.5 rounded-2xl flex flex-col items-center">
            <span className="text-base mb-0.5">🪙</span>
            <span className="text-[10px] font-extrabold uppercase text-slate-400">Coins</span>
            <span className="text-sm font-black text-amber-300 tabular-nums">
              {stats.coinsCollected} / {stats.totalCoins}
            </span>
            <span className="text-[9px] font-bold text-slate-400 mt-0.5">
              {isPerfectCoins ? 'All Found!' : `${stats.totalCoins - stats.coinsCollected} missed`}
            </span>
          </div>

          {/* Falls */}
          <div className="bg-slate-800/90 border border-white/10 p-2.5 rounded-2xl flex flex-col items-center">
            <ShieldCheck className="w-4 h-4 text-emerald-400 mb-1" />
            <span className="text-[10px] font-extrabold uppercase text-slate-400">Falls</span>
            <span className="text-sm font-black text-white tabular-nums">
              {stats.fallCount}
            </span>
            <span className="text-[9px] font-bold text-slate-400 mt-0.5">
              {stats.fallCount === 0 ? 'Flawless!' : 'Respawns'}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5 w-full">
          {!isFinalLevel ? (
            <button
              onClick={() => {
                soundManager.playClick();
                onNextLevel();
              }}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 text-slate-950 font-black text-base uppercase tracking-wider shadow-[0_8px_20px_rgba(16,185,129,0.4)] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Next Level ({stats.currentLevel + 1})</span>
              <ArrowRight className="w-5 h-5 text-slate-950" />
            </button>
          ) : (
            <button
              onClick={() => {
                soundManager.playClick();
                onReplayLevel();
              }}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 text-slate-950 font-black text-base uppercase tracking-wider shadow-[0_8px_20px_rgba(245,158,11,0.4)] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-5 h-5 text-slate-950" />
              <span>Celebrate & Replay Apex</span>
            </button>
          )}

          <div className="grid grid-cols-2 gap-2 w-full">
            <button
              onClick={() => {
                soundManager.playClick();
                onReplayLevel();
              }}
              className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-white/20 text-white font-bold text-xs uppercase tracking-wider active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-sky-400" />
              <span>Replay</span>
            </button>

            <button
              onClick={() => {
                soundManager.playClick();
                onOpenLevelSelect();
              }}
              className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-sky-400/40 text-sky-200 font-bold text-xs uppercase tracking-wider active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Layers className="w-4 h-4 text-sky-400" />
              <span>Select Level</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
