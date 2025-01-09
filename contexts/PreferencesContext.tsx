'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type FontSize = 'small' | 'medium' | 'large';
type Theme = 'light' | 'dark';

interface Preferences {
  theme: Theme;
  fontSize: FontSize;
  notifications: boolean;
  voiceEnabled: boolean;
  autoSave: boolean;
}

interface PreferencesContextType {
  preferences: Preferences;
  updatePreference: <K extends keyof Preferences>(key: K, value: Preferences[K]) => void;
  resetPreferences: () => void;
  exportPreferences: () => string;
  importPreferences: (data: string) => void;
}

const defaultPreferences: Preferences = {
  theme: 'light',
  fontSize: 'medium',
  notifications: true,
  voiceEnabled: true,
  autoSave: true,
};

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [preferences, setPreferences] = useState<Preferences>(defaultPreferences);

  useEffect(() => {
    const stored = localStorage.getItem('preferences');
    if (stored) {
      try {
        setPreferences(JSON.parse(stored));
      } catch (error) {
        console.error('Failed to parse stored preferences:', error);
      }
    }
  }, []);

  const updatePreference = <K extends keyof Preferences>(key: K, value: Preferences[K]) => {
    setPreferences(prev => {
      const updated = { ...prev, [key]: value };
      localStorage.setItem('preferences', JSON.stringify(updated));
      return updated;
    });
  };

  const resetPreferences = () => {
    setPreferences(defaultPreferences);
    localStorage.setItem('preferences', JSON.stringify(defaultPreferences));
  };

  const exportPreferences = () => {
    return JSON.stringify(preferences, null, 2);
  };

  const importPreferences = (data: string) => {
    try {
      const imported = JSON.parse(data);
      setPreferences(imported);
      localStorage.setItem('preferences', JSON.stringify(imported));
    } catch (error) {
      throw new Error('Invalid preferences data');
    }
  };

  return (
    <PreferencesContext.Provider
      value={{
        preferences,
        updatePreference,
        resetPreferences,
        exportPreferences,
        importPreferences,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (context === undefined) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }
  return context;
} 