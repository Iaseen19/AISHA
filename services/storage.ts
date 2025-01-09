interface StorageItem<T> {
  value: T;
  timestamp: number;
  version: string;
}

class StorageService {
  private readonly VERSION = '1.0.0';

  private wrapValue<T>(value: T): StorageItem<T> {
    return {
      value,
      timestamp: Date.now(),
      version: this.VERSION,
    };
  }

  private handleError(error: unknown, operation: string): never {
    console.error(`Storage error during ${operation}:`, error);
    throw new Error(`Failed to ${operation} data`);
  }

  set<T>(key: string, value: T): void {
    try {
      const item = this.wrapValue(value);
      localStorage.setItem(key, JSON.stringify(item));
    } catch (error) {
      this.handleError(error, 'save');
    }
  }

  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      if (!item) return null;

      const parsed = JSON.parse(item) as StorageItem<T>;
      return parsed.value;
    } catch (error) {
      this.handleError(error, 'retrieve');
    }
  }

  update<T>(key: string, updater: (prev: T | null) => T): void {
    try {
      const currentValue = this.get<T>(key);
      const newValue = updater(currentValue);
      this.set(key, newValue);
    } catch (error) {
      this.handleError(error, 'update');
    }
  }

  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      this.handleError(error, 'remove');
    }
  }

  clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      this.handleError(error, 'clear');
    }
  }

  getTimestamp(key: string): number | null {
    try {
      const item = localStorage.getItem(key);
      if (!item) return null;

      const parsed = JSON.parse(item) as StorageItem<unknown>;
      return parsed.timestamp;
    } catch (error) {
      this.handleError(error, 'get timestamp');
    }
  }

  exists(key: string): boolean {
    return localStorage.getItem(key) !== null;
  }

  getAll(): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          result[key] = this.get(key);
        }
      }
    } catch (error) {
      this.handleError(error, 'get all items');
    }
    return result;
  }

  // Backup and restore functionality
  backup(): string {
    try {
      const data = this.getAll();
      return JSON.stringify(data);
    } catch (error) {
      this.handleError(error, 'create backup');
    }
  }

  restore(backupData: string): void {
    try {
      this.clear();
      const data = JSON.parse(backupData);
      Object.entries(data).forEach(([key, value]) => {
        this.set(key, value);
      });
    } catch (error) {
      this.handleError(error, 'restore backup');
    }
  }
}

export const storage = new StorageService();

// Type definitions for stored data
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

export interface JournalEntry {
  id: string;
  date: string;
  content: string;
  mood: number;
  tags: string[];
}

export interface MoodEntry {
  timestamp: number;
  value: number;
  note?: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  notifications: boolean;
  voiceEnabled: boolean;
  autoSave: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

// Storage keys
export const STORAGE_KEYS = {
  CHAT_HISTORY: 'chatHistory',
  JOURNAL_ENTRIES: 'journalEntries',
  MOOD_ENTRIES: 'moodEntries',
  USER_PREFERENCES: 'userPreferences',
  SESSION_SUMMARY: 'sessionSummary',
} as const; 