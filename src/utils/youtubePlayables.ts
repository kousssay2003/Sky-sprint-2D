/**
 * YouTube Playables SDK Integration Wrapper
 * Official Documentation: https://developers.google.com/youtube/gaming/playables
 *
 * Implements:
 * 1. firstFrameReady(): Sent when initial game canvas / splash renders.
 * 2. gameReady(): Sent when main menu / game is fully interactive.
 * 3. onPause() & onResume(): Platform pause/resume lifecycle callbacks.
 * 4. isAudioEnabled() & onAudioEnabledChange(): Platform audio state integration.
 * 5. saveData() & loadData(): Optional cloud-save progression sync.
 *
 * Defensive Design:
 * If running outside YouTube Playables (e.g. standalone browser, Cloudflare deployment, or preview),
 * all calls fail safely and fall back to local storage and visibilitychange listeners.
 */

import { safeStorage } from './storage';

export interface YTGameSDK {
  IN_PLAYABLES_ENV?: boolean;
  game?: {
    firstFrameReady?: () => void;
    gameReady?: () => void;
    saveData?: (data: string) => Promise<void>;
    loadData?: () => Promise<string>;
  };
  system?: {
    isAudioEnabled?: () => boolean;
    onAudioEnabledChange?: (callback: (isAudioEnabled: boolean) => void) => void;
    onPause?: (callback: () => void) => void;
    onResume?: (callback: () => void) => void;
    getLanguage?: () => string;
  };
}

declare global {
  interface Window {
    ytgame?: YTGameSDK;
  }
}

export interface PlayablesLifecycleCallbacks {
  onPause?: () => void;
  onResume?: () => void;
  onAudioChange?: (isAudioEnabled: boolean) => void;
}

class YouTubePlayablesManager {
  private hasCalledFirstFrame = false;
  private hasCalledGameReady = false;
  private isInitialized = false;

  /**
   * Returns true if running inside the official YouTube Playables runtime.
   */
  public isAvailable(): boolean {
    return (
      typeof window !== 'undefined' &&
      typeof window.ytgame !== 'undefined' &&
      window.ytgame !== null
    );
  }

  /**
   * Call when the first frame of the game has rendered (loading screen or canvas splash).
   * Signals to YouTube that loading has begun.
   */
  public sendFirstFrameReady(): void {
    if (this.hasCalledFirstFrame) return;
    this.hasCalledFirstFrame = true;

    if (this.isAvailable() && typeof window.ytgame?.game?.firstFrameReady === 'function') {
      try {
        window.ytgame.game.firstFrameReady();
        console.log('[YouTube Playables] firstFrameReady() dispatched successfully');
      } catch (err) {
        console.warn('[YouTube Playables] Error calling firstFrameReady:', err);
      }
    } else {
      console.log('[YouTube Playables] Standalone mode: firstFrameReady simulated');
    }
  }

  /**
   * Call when the game is fully interactive and ready for user input (e.g. main menu or active game).
   * Removes YouTube's loading spinner. Must be called AFTER sendFirstFrameReady().
   */
  public sendGameReady(): void {
    if (this.hasCalledGameReady) return;

    // YouTube requires firstFrameReady() before gameReady()
    if (!this.hasCalledFirstFrame) {
      this.sendFirstFrameReady();
    }

    this.hasCalledGameReady = true;

    if (this.isAvailable() && typeof window.ytgame?.game?.gameReady === 'function') {
      try {
        window.ytgame.game.gameReady();
        console.log('[YouTube Playables] gameReady() dispatched successfully');
      } catch (err) {
        console.warn('[YouTube Playables] Error calling gameReady:', err);
      }
    } else {
      console.log('[YouTube Playables] Standalone mode: gameReady simulated');
    }
  }

  /**
   * Register pause, resume, and audio state listeners.
   * Falls back to document visibilitychange when outside YouTube Playables.
   */
  public initLifecycle(callbacks: PlayablesLifecycleCallbacks): () => void {
    if (this.isInitialized) {
      return () => {};
    }
    this.isInitialized = true;

    const cleanupFns: Array<() => void> = [];

    if (this.isAvailable() && window.ytgame?.system) {
      const system = window.ytgame.system;

      // YouTube Playables pause callback
      if (typeof system.onPause === 'function' && callbacks.onPause) {
        try {
          system.onPause(() => {
            console.log('[YouTube Playables] onPause event received');
            callbacks.onPause?.();
          });
        } catch (e) {
          console.warn('[YouTube Playables] Failed to bind onPause:', e);
        }
      }

      // YouTube Playables resume callback
      if (typeof system.onResume === 'function' && callbacks.onResume) {
        try {
          system.onResume(() => {
            console.log('[YouTube Playables] onResume event received');
            callbacks.onResume?.();
          });
        } catch (e) {
          console.warn('[YouTube Playables] Failed to bind onResume:', e);
        }
      }

      // YouTube Playables audio change callback
      if (typeof system.onAudioEnabledChange === 'function' && callbacks.onAudioChange) {
        try {
          system.onAudioEnabledChange((enabled: boolean) => {
            console.log('[YouTube Playables] onAudioEnabledChange:', enabled);
            callbacks.onAudioChange?.(enabled);
          });
        } catch (e) {
          console.warn('[YouTube Playables] Failed to bind onAudioEnabledChange:', e);
        }
      }

      // Initialize audio state from YouTube system if available
      if (typeof system.isAudioEnabled === 'function' && callbacks.onAudioChange) {
        try {
          const isEnabled = system.isAudioEnabled();
          callbacks.onAudioChange(isEnabled);
        } catch (e) {
          console.warn('[YouTube Playables] Failed to query isAudioEnabled:', e);
        }
      }
    } else {
      // Fallback for standalone / browser testing
      const handleVisibilityChange = () => {
        if (document.hidden) {
          callbacks.onPause?.();
        } else {
          callbacks.onResume?.();
        }
      };

      document.addEventListener('visibilitychange', handleVisibilityChange);
      cleanupFns.push(() => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      });
    }

    return () => {
      cleanupFns.forEach(fn => fn());
      this.isInitialized = false;
    };
  }

  /**
   * Save player progress to YouTube Playables Cloud Save (with localStorage backup).
   */
  public async saveCloudData(data: string): Promise<void> {
    // Always mirror to safe storage
    safeStorage.setItem('crazy_obby_cloud_backup', data);

    if (this.isAvailable() && typeof window.ytgame?.game?.saveData === 'function') {
      try {
        await window.ytgame.game.saveData(data);
        console.log('[YouTube Playables] Cloud save successful');
      } catch (err) {
        console.warn('[YouTube Playables] Cloud save failed:', err);
      }
    }
  }

  /**
   * Load player progress from YouTube Playables Cloud Save.
   */
  public async loadCloudData(): Promise<string | null> {
    if (this.isAvailable() && typeof window.ytgame?.game?.loadData === 'function') {
      try {
        const data = await window.ytgame.game.loadData();
        if (data) {
          console.log('[YouTube Playables] Cloud load successful');
          return data;
        }
      } catch (err) {
        console.warn('[YouTube Playables] Cloud load failed, falling back to local storage:', err);
      }
    }

    // Fallback to safe storage
    return safeStorage.getItem('crazy_obby_cloud_backup');
  }
}

export const youtubePlayables = new YouTubePlayablesManager();
