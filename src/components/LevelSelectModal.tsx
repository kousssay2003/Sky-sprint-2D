/**
 * CRAZY OBBY: SKY SPRINT 2D - Level Select Modal
 * 20 Progressive Levels across 4 worlds with stars, best times, and difficulty badges.
 */

import React, { useEffect } from 'react';
import { X, Lock, Star, Trophy } from 'lucide-react';
import { ALL_LEVELS } from '../game2d/levelData';
import { LevelRecord } from '../types/game2d';
import { soundManager } from '../audio/soundManager';

interface LevelSelectModalProps {
  currentLevel: number;
  maxUnlockedLevel: number;
  levelRecords: Record<number, LevelRecord>;
  onSelectLevel: (levelNum: number) => void;
  onClose: () => void;
}

export const LevelSelectModal: React.FC<LevelSelectModalProps> = ({
  currentLevel,
  maxUnlockedLevel,
  levelRecords,
  onSelectLevel,
  onClose,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [onClose]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds * 10) % 10);
    return `${mins}:${secs.toString().padStart(2, '0')}.${ms}`;
  };

  const worlds = [
    { title: 'World 1: Beginner Skies', levels: ALL_LEVELS.slice(0, 5), color: 'emerald' },
    { title: 'World 2: Sky Islands & Traps', levels: ALL_LEVELS.slice(5, 10), color: 'sky' },
    { title: 'World 3: Elevator Peaks & Hazards', levels: ALL_LEVELS.slice(10, 15), color: 'amber' },
    { title: 'World 4: The Apex Gauntlet', levels: ALL_LEVELS.slice(15, 20), color: 'purple' },
  ];

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-none select-none">
      <div className="w-full max-w-2xl bg-slate-900 border-2 border-sky-400/50 rounded-3xl p-5 sm:p-7 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2.5">
            <Trophy className="w-6 h-6 text-amber-400" />
            <div>
              <h2 className="text-xl sm:text-2xl font-black uppercase text-white tracking-wider">
                Select Level
              </h2>
              <span className="text-xs font-bold text-sky-300">
                20 Progressively Harder Sky Courses
              </span>
            </div>
          </div>
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center border border-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Levels Grid */}
        <div className="overflow-y-auto py-4 pr-1 flex flex-col gap-5">
          {worlds.map((world, wIdx) => (
            <div key={wIdx} className="flex flex-col gap-2">
              <span className="text-xs font-black uppercase tracking-widest text-slate-400">
                {world.title}
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {world.levels.map((lvl) => {
                  const isUnlocked = lvl.id <= maxUnlockedLevel;
                  const isCurrent = lvl.id === currentLevel;
                  const record = levelRecords[lvl.id];
                  const stars = record ? record.stars : 0;

                  return (
                    <button
                      key={lvl.id}
                      disabled={!isUnlocked}
                      onClick={() => {
                        soundManager.playClick();
                        onSelectLevel(lvl.id);
                        onClose();
                      }}
                      className={`relative p-3 rounded-2xl border-2 flex flex-col items-center justify-between text-center transition-all ${
                        !isUnlocked
                          ? 'bg-slate-950/60 border-slate-800 text-slate-600 cursor-not-allowed opacity-60'
                          : isCurrent
                            ? 'bg-sky-950 border-sky-400 text-white shadow-[0_0_15px_rgba(56,189,248,0.4)] scale-102'
                            : 'bg-slate-800/90 hover:bg-slate-750 border-white/10 text-white hover:border-sky-400/50 cursor-pointer active:scale-95'
                      }`}
                    >
                      {/* Top: Level # & Lock Status */}
                      <div className="w-full flex items-center justify-between">
                        <span className="text-xs font-black tracking-tight text-sky-400">
                          #{lvl.id}
                        </span>
                        {!isUnlocked ? (
                          <Lock className="w-3.5 h-3.5 text-slate-500" />
                        ) : (
                          <span
                            className={`text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded ${
                              lvl.difficulty === 'Easy'
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : lvl.difficulty === 'Medium'
                                  ? 'bg-sky-500/20 text-sky-300'
                                  : lvl.difficulty === 'Hard'
                                    ? 'bg-amber-500/20 text-amber-300'
                                    : 'bg-red-500/20 text-red-300'
                            }`}
                          >
                            {lvl.difficulty}
                          </span>
                        )}
                      </div>

                      {/* Level Name */}
                      <span className="text-xs font-bold my-1 text-slate-200 line-clamp-1">
                        {lvl.name}
                      </span>

                      {/* Stars & Best Time */}
                      {isUnlocked && (
                        <div className="flex flex-col items-center gap-0.5 mt-0.5 w-full">
                          <div className="flex items-center gap-0.5">
                            {[1, 2, 3].map((starIdx) => (
                              <Star
                                key={starIdx}
                                className={`w-3 h-3 ${
                                  starIdx <= stars
                                    ? 'text-amber-400 fill-amber-400'
                                    : 'text-slate-600'
                                }`}
                              />
                            ))}
                          </div>
                          {record?.bestTime && (
                            <span className="text-[10px] font-mono text-slate-400">
                              {formatTime(record.bestTime)}
                            </span>
                          )}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
