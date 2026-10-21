/**
 * CRAZY OBBY: SKY SPRINT 2D - Mobile Touch Controls
 * Mobile-first on-screen virtual joystick + large JUMP/GLIDE button + DASH power-up button.
 */

import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ChevronsUp, Zap } from 'lucide-react';
import { GameEngine2D } from '../game2d/engine2d';

interface TouchControlsProps {
  engine: GameEngine2D | null;
  visible: boolean;
  dashAvailable: boolean;
  hasParachute: boolean;
}

export const TouchControls: React.FC<TouchControlsProps> = ({
  engine,
  visible,
  dashAvailable,
  hasParachute,
}) => {
  const [controlMode, setControlMode] = useState<'joystick' | 'dpad'>('joystick');
  const [stickOffset, setStickOffset] = useState({ x: 0, y: 0 });
  const [isStickActive, setIsStickActive] = useState(false);
  const [isJumpActive, setIsJumpActive] = useState(false);
  const [isDashActive, setIsDashActive] = useState(false);

  const stickTouchId = useRef<number | null>(null);
  const stickBasePos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const stickRadius = 55;

  // Joystick handlers
  const handleStickStart = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (stickTouchId.current !== null) return;

    const touch = e.changedTouches[0];
    stickTouchId.current = touch.identifier;

    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    stickBasePos.current = { x: centerX, y: centerY };

    handleStickMoveTouch(touch.clientX, touch.clientY);
    setIsStickActive(true);
  };

  const handleStickMoveTouch = (clientX: number, clientY: number) => {
    const dx = clientX - stickBasePos.current.x;
    const dy = clientY - stickBasePos.current.y;
    const dist = Math.hypot(dx, dy);

    let normX = dx;
    let normY = dy;
    if (dist > stickRadius) {
      normX = (dx / dist) * stickRadius;
      normY = (dy / dist) * stickRadius;
    }

    setStickOffset({ x: normX, y: normY });

    if (engine) {
      engine.input.virtualStickX = normX / stickRadius;
    }
  };

  const handleStickEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === stickTouchId.current) {
        stickTouchId.current = null;
        setStickOffset({ x: 0, y: 0 });
        setIsStickActive(false);
        if (engine) {
          engine.input.virtualStickX = 0;
        }
        break;
      }
    }
  };

  // Jump Button Handlers
  const handleJumpStart = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    setIsJumpActive(true);
    if (engine) {
      engine.input.jump = true;
      engine.input.jumpJustPressed = true;
      engine.input.jumpHeld = true;
    }
  };

  const handleJumpEnd = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    setIsJumpActive(false);
    if (engine) {
      engine.input.jump = false;
      engine.input.jumpHeld = false;
    }
  };

  // Dash Button Handlers
  const handleDashStart = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    if (!dashAvailable) return;
    setIsDashActive(true);
    if (engine) {
      engine.input.dashJustPressed = true;
    }
  };

  const handleDashEnd = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    setIsDashActive(false);
  };

  // Global touchmove
  useEffect(() => {
    const onTouchMove = (e: TouchEvent) => {
      if (stickTouchId.current !== null) {
        for (let i = 0; i < e.changedTouches.length; i++) {
          if (e.changedTouches[i].identifier === stickTouchId.current) {
            handleStickMoveTouch(e.changedTouches[i].clientX, e.changedTouches[i].clientY);
            break;
          }
        }
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (stickTouchId.current !== null) {
        for (let i = 0; i < e.changedTouches.length; i++) {
          if (e.changedTouches[i].identifier === stickTouchId.current) {
            stickTouchId.current = null;
            setStickOffset({ x: 0, y: 0 });
            setIsStickActive(false);
            if (engine) {
              engine.input.virtualStickX = 0;
            }
            break;
          }
        }
      }
    };

    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd);
    window.addEventListener('touchcancel', onTouchEnd);

    return () => {
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('touchcancel', onTouchEnd);
    };
  }, [engine]);

  if (!visible) return null;

  return (
    <div className="absolute inset-0 pointer-events-none select-none z-20 flex flex-col justify-end p-4 md:p-8 overflow-hidden">
      {/* Bottom Controls Row */}
      <div className="w-full flex items-end justify-between pointer-events-none">
        {/* Left Side: Joystick or Digital Left/Right */}
        <div className="pointer-events-auto flex flex-col items-start gap-2">
          {/* Switcher */}
          <div className="flex bg-slate-900/80 rounded-full p-1 border border-sky-400/30 text-[11px] font-semibold text-sky-200">
            <button
              onClick={() => setControlMode('joystick')}
              className={`px-2.5 py-0.5 rounded-full transition-all ${
                controlMode === 'joystick' ? 'bg-sky-500 text-white shadow-sm' : 'text-slate-400'
              }`}
            >
              Stick
            </button>
            <button
              onClick={() => setControlMode('dpad')}
              className={`px-2.5 py-0.5 rounded-full transition-all ${
                controlMode === 'dpad' ? 'bg-sky-500 text-white shadow-sm' : 'text-slate-400'
              }`}
            >
              D-Pad
            </button>
          </div>

          {controlMode === 'joystick' ? (
            /* Virtual Analog Stick */
            <div
              className={`relative w-36 h-36 rounded-full border-2 transition-colors flex items-center justify-center touch-none select-none ${
                isStickActive
                  ? 'border-sky-400 bg-sky-950/60 shadow-[0_0_20px_rgba(56,189,248,0.4)]'
                  : 'border-white/30 bg-slate-900/40'
              }`}
              onTouchStart={handleStickStart}
              onTouchEnd={handleStickEnd}
            >
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center pointer-events-none transition-transform duration-75 ${
                  isStickActive
                    ? 'bg-gradient-to-tr from-sky-500 to-cyan-300 text-slate-950 shadow-lg ring-4 ring-sky-300/40'
                    : 'bg-white/40 text-slate-200'
                }`}
                style={{
                  transform: `translate(${stickOffset.x}px, ${stickOffset.y}px)`,
                }}
              >
                <div className="w-4 h-4 rounded-full bg-white/70" />
              </div>
            </div>
          ) : (
            /* Digital Left / Right */
            <div className="flex items-center gap-3">
              <button
                onTouchStart={(e) => {
                  e.preventDefault();
                  if (engine) engine.input.left = true;
                }}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  if (engine) engine.input.left = false;
                }}
                className="w-18 h-18 bg-slate-900/85 active:bg-sky-500 border border-white/20 rounded-2xl flex items-center justify-center text-white shadow-lg active:scale-95"
              >
                <ArrowLeft className="w-8 h-8" />
              </button>
              <button
                onTouchStart={(e) => {
                  e.preventDefault();
                  if (engine) engine.input.right = true;
                }}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  if (engine) engine.input.right = false;
                }}
                className="w-18 h-18 bg-slate-900/85 active:bg-sky-500 border border-white/20 rounded-2xl flex items-center justify-center text-white shadow-lg active:scale-95"
              >
                <ArrowRight className="w-8 h-8" />
              </button>
            </div>
          )}
        </div>

        {/* Right Side: Action Buttons (DASH + JUMP) */}
        <div className="pointer-events-auto flex items-end gap-3">
          {/* Dash Button */}
          <button
            onTouchStart={handleDashStart}
            onTouchEnd={handleDashEnd}
            onMouseDown={handleDashStart}
            onMouseUp={handleDashEnd}
            className={`w-18 h-18 rounded-full border-3 flex flex-col items-center justify-center font-black uppercase transition-all duration-75 select-none touch-none ${
              !dashAvailable
                ? 'opacity-40 bg-slate-800 border-slate-700 text-slate-500'
                : isDashActive
                  ? 'scale-90 bg-cyan-400 border-cyan-200 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.8)]'
                  : 'bg-gradient-to-b from-cyan-500 to-sky-600 border-cyan-300 text-white shadow-lg hover:scale-105'
            }`}
          >
            <Zap className="w-6 h-6 fill-current" />
            <span className="text-[10px] font-extrabold tracking-wider">DASH</span>
          </button>

          {/* Large Jump / Glide Button */}
          <button
            onTouchStart={handleJumpStart}
            onTouchEnd={handleJumpEnd}
            onMouseDown={handleJumpStart}
            onMouseUp={handleJumpEnd}
            className={`w-24 h-24 md:w-28 md:h-28 rounded-full border-4 flex flex-col items-center justify-center font-black tracking-wider text-base uppercase transition-all duration-75 select-none touch-none ${
              isJumpActive
                ? 'scale-90 bg-gradient-to-b from-amber-400 to-amber-600 border-amber-200 text-slate-950 shadow-[0_0_25px_rgba(251,191,36,0.8)]'
                : 'bg-gradient-to-b from-amber-500 to-amber-700 border-amber-300 text-white shadow-xl hover:scale-105'
            }`}
          >
            <ChevronsUp className="w-8 h-8 -mb-1 animate-bounce" />
            <span className="text-xs font-black tracking-widest">
              {hasParachute ? 'JUMP/GLIDE' : 'JUMP'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
