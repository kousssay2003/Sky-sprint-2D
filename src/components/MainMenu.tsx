/**
 * CRAZY OBBY: SKY SPRINT 2D - Title / Main Menu Screen
 * Vibrant cartoon vector logo, power-ups showcase, and start CTA.
 */

import React from 'react';
import { Play, Sparkles, Trophy, Compass, ShieldAlert, Zap, Wind, Layers } from 'lucide-react';
import { soundManager } from '../audio/soundManager';

interface MainMenuProps {
  onStart: () => void;
  onOpenLevelSelect: () => void;
  bestTime: number | null;
  maxUnlockedLevel?: number;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  onStart,
  onOpenLevelSelect,
  bestTime,
  maxUnlockedLevel = 1,
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds * 100) % 100);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms
      .toString()
      .padStart(2, '0')}`;
  };

  const handleStartGame = () => {
    soundManager.playClick();
    onStart();
  };

  return (
    <div className="absolute inset-0 z-30 flex flex-col justify-between items-center p-4 sm:p-6 md:p-10 select-none pointer-events-none">
      {/* Top Bar: Game Badge & Best Time */}
      <div className="w-full max-w-4xl flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-2 bg-slate-900/80 border border-sky-400/40 px-3.5 py-1.5 rounded-full shadow-lg">
          <Sparkles className="w-4 h-4 text-sky-400 animate-spin" />
          <span className="text-xs font-black tracking-widest text-sky-200 uppercase">
            20 Levels · 4 Sky Worlds
          </span>
        </div>

        {bestTime !== null && (
          <div className="flex items-center gap-2 bg-slate-900/80 border border-amber-400/50 px-4 py-1.5 rounded-full shadow-lg">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-extrabold text-amber-300 uppercase tracking-wider">
              BEST RECORD:
            </span>
            <span className="text-sm font-black text-white font-mono">{formatTime(bestTime)}</span>
          </div>
        )}
      </div>

      {/* Center Hero: Bespoke Cartoon SVG Title Lockup */}
      <div className="flex flex-col items-center text-center my-auto pointer-events-auto">
        <div className="relative mb-2 drop-shadow-[0_12px_25px_rgba(0,0,0,0.5)]">
          <svg
            className="w-[280px] sm:w-[440px] md:w-[560px] h-auto overflow-visible"
            viewBox="0 0 540 140"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="obbyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#facc15" />
                <stop offset="45%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#ef4444" />
              </linearGradient>
              <linearGradient id="skyGrad2D" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="50%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#818cf8" />
              </linearGradient>
              <filter id="shadowFilter2D">
                <feDropShadow dx="3" dy="4" stdDeviation="2" floodColor="#0f172a" floodOpacity="0.8" />
              </filter>
            </defs>

            {/* CRAZY OBBY */}
            <text
              x="270"
              y="60"
              textAnchor="middle"
              className="font-black"
              style={{
                fontSize: '54px',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                fontWeight: 900,
                fill: 'url(#obbyGrad)',
                stroke: '#1e1b4b',
                strokeWidth: '5px',
                letterSpacing: '5px',
                filter: 'url(#shadowFilter2D)',
              }}
            >
              CRAZY OBBY
            </text>

            {/* SKY SPRINT 2D */}
            <text
              x="270"
              y="114"
              textAnchor="middle"
              className="font-black tracking-widest"
              style={{
                fontSize: '32px',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                fontWeight: 900,
                fill: 'url(#skyGrad2D)',
                stroke: '#0f172a',
                strokeWidth: '4px',
                letterSpacing: '8px',
                filter: 'url(#shadowFilter2D)',
              }}
            >
              SKY SPRINT 2D
            </text>
          </svg>
        </div>

        <p className="text-xs sm:text-sm font-bold text-sky-950 max-w-md mb-5 drop-shadow-sm bg-white/70 px-4 py-1.5 rounded-2xl">
          Conquer 20 progressively challenging sky levels! Jump, air dash, bounce, and parachute past saws, lasers, and crumbling clouds!
        </p>

        {/* Buttons: Start & Level Select */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-xs sm:max-w-md justify-center">
          {/* Big Start Button */}
          <button
            onClick={handleStartGame}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 bg-[length:200%_auto] hover:bg-[position:right_center] text-slate-950 font-black text-base sm:text-lg tracking-wider uppercase border-2 border-emerald-200 shadow-[0_10px_25px_rgba(16,185,129,0.5)] active:scale-95 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <Play className="w-5 h-5 fill-slate-950" />
            <span>PLAY NOW</span>
          </button>

          {/* Level Select Button */}
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenLevelSelect();
            }}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border-2 border-sky-400/60 hover:border-sky-300 text-sky-100 font-black text-sm sm:text-base tracking-wider uppercase shadow-[0_8px_20px_rgba(14,165,233,0.3)] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Layers className="w-4 h-4 text-sky-400" />
            <span>LEVELS (1-20)</span>
            <span className="text-[10px] bg-sky-500/30 text-sky-300 px-2 py-0.5 rounded-full font-mono">
              {maxUnlockedLevel}/20
            </span>
          </button>
        </div>

        <span className="text-[11px] font-bold text-sky-900 mt-3 drop-shadow-sm bg-white/60 px-3.5 py-0.8 rounded-full">
          Mobile: Touch Joystick & Buttons · PC: <kbd className="bg-slate-900/80 px-1.5 py-0.5 rounded text-white border border-white/20">A/D</kbd> Run, <kbd className="bg-slate-900/80 px-1.5 py-0.5 rounded text-white border border-white/20">Space</kbd> Jump, <kbd className="bg-slate-900/80 px-1.5 py-0.5 rounded text-white border border-white/20">Shift</kbd> Dash
        </span>
      </div>

      {/* Bottom: Feature Cards & Control Hints */}
      <div className="w-full max-w-4xl flex flex-col items-center gap-3 pointer-events-auto">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full text-xs font-bold text-slate-200">
          <div className="bg-slate-900/85 border border-sky-500/30 p-2.5 rounded-xl flex items-center gap-2">
            <Compass className="w-5 h-5 text-sky-400 shrink-0" />
            <div className="text-left">
              <span className="block text-white text-[11px]">2D Sky Course</span>
              <span className="text-[10px] text-slate-400 font-normal">4 connected zones</span>
            </div>
          </div>

          <div className="bg-slate-900/85 border border-cyan-500/30 p-2.5 rounded-xl flex items-center gap-2">
            <Wind className="w-5 h-5 text-cyan-400 shrink-0" />
            <div className="text-left">
              <span className="block text-white text-[11px]">Dash & Parachute</span>
              <span className="text-[10px] text-slate-400 font-normal">Air glide & burst</span>
            </div>
          </div>

          <div className="bg-slate-900/85 border border-red-500/30 p-2.5 rounded-xl flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-400 shrink-0" />
            <div className="text-left">
              <span className="block text-white text-[11px]">Rotating Saws</span>
              <span className="text-[10px] text-slate-400 font-normal">Crumbling clouds</span>
            </div>
          </div>

          <div className="bg-slate-900/85 border border-amber-500/30 p-2.5 rounded-xl flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400 shrink-0" />
            <div className="text-left">
              <span className="block text-white text-[11px]">Speed Sneakers</span>
              <span className="text-[10px] text-slate-400 font-normal">Super sprint shoes</span>
            </div>
          </div>
        </div>

        <div className="text-xs text-sky-950 font-bold text-center bg-white/50 px-4 py-1 rounded-full">
          Mobile: Virtual Stick & Jump/Glide Button · Desktop: A/D Run · Space Jump/Double Jump · Shift Dash
        </div>
      </div>
    </div>
  );
};
