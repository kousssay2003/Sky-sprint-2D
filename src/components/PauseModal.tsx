/**
 * CRAZY OBBY: SKY SPRINT - Pause Modal
 */

import React from 'react';
import { Play, RotateCcw, Volume2, VolumeX, Flag, Layers } from 'lucide-react';
import { soundManager } from '../audio/soundManager';

interface PauseModalProps {
  onResume: () => void;
  onRestart: () => void;
  onRespawn: () => void;
  onOpenLevelSelect?: () => void;
  checkpointName: string;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  onResume,
  onRestart,
  onRespawn,
  onOpenLevelSelect,
  checkpointName,
  isMuted,
  onToggleMute,
}) => {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 select-none">
      <div className="w-full max-w-sm bg-slate-900 border-2 border-sky-400/50 rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center">
        <h2 className="text-2xl font-black tracking-wider text-white uppercase mb-1">
          Game Paused
        </h2>
        <div className="flex items-center gap-1.5 text-xs text-sky-300 font-bold mb-6">
          <Flag className="w-3.5 h-3.5 text-emerald-400" />
          <span>Active: {checkpointName}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 w-full">
          <button
            onClick={() => {
              soundManager.playClick();
              onResume();
            }}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-base uppercase tracking-wider shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Play className="w-5 h-5 fill-slate-950" />
            <span>Resume Game</span>
          </button>

          {onOpenLevelSelect && (
            <button
              onClick={() => {
                soundManager.playClick();
                onOpenLevelSelect();
              }}
              className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-750 border border-sky-400/40 text-sky-200 font-bold text-sm uppercase tracking-wider active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Layers className="w-4 h-4 text-sky-400" />
              <span>Select Level (1-20)</span>
            </button>
          )}

          <button
            onClick={() => {
              soundManager.playClick();
              onRespawn();
            }}
            className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-sky-400/30 text-white font-bold text-sm uppercase tracking-wider active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-sky-400" />
            <span>Respawn at Checkpoint</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              onRestart();
            }}
            className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-white/20 text-slate-300 font-bold text-sm uppercase tracking-wider active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Restart Level</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              onToggleMute();
            }}
            className="w-full py-2.5 rounded-2xl bg-slate-800/80 border border-white/10 text-slate-300 font-medium text-xs flex items-center justify-center gap-2"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            <span>Sound Effects: {isMuted ? 'Muted' : 'Enabled'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
