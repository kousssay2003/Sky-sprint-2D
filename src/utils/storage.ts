/**
 * Safe storage utility that gracefully handles sandboxed iframes,
 * privacy mode, blocked cookies, or disabled storage where
 * window.localStorage is null or throws a SecurityError / DOMException.
 * Provides a reliable in-memory fallback so the game never crashes.
 */

const memoryStore: Record<string, string> = {};

function isLocalStorageAvailable(): boolean {
  try {
    if (typeof window === 'undefined') return false;
    // In sandboxed iframes or privacy mode, accessing window.localStorage may throw or be null
    const storage = window.localStorage;
    if (!storage) return false;
    const testKey = '__crazy_obby_test__';
    storage.setItem(testKey, '1');
    storage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

let storageAvailable: boolean | null = null;

function hasStorage(): boolean {
  if (storageAvailable === null) {
    storageAvailable = isLocalStorageAvailable();
  }
  return storageAvailable;
}

export const safeStorage = {
  getItem(key: string): string | null {
    try {
      if (hasStorage()) {
        const val = window.localStorage.getItem(key);
        if (val !== null) return val;
      }
    } catch {
      // Ignore SecurityError / DOMException
    }
    return memoryStore[key] ?? null;
  },

  setItem(key: string, value: string): void {
    try {
      if (hasStorage()) {
        window.localStorage.setItem(key, value);
      }
    } catch {
      // Ignore QuotaExceededError or SecurityError
    }
    memoryStore[key] = value;
  },

  removeItem(key: string): void {
    try {
      if (hasStorage()) {
        window.localStorage.removeItem(key);
      }
    } catch {
      // Ignore
    }
    delete memoryStore[key];
  },
};
