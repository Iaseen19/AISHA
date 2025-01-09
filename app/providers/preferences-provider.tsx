'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface Preferences {
  theme: string;
  voiceEnabled: boolean;
  notifications: boolean;
  language: string;
  autoSave: boolean;
}

interface PreferencesContextType {
  preferences: Preferences;
  voiceEnabled: boolean;
  setVoiceEnabled: (enabled: boolean) => void;
  isReady: boolean;
  updatePreferences: (newPrefs: Partial<Preferences>) => void;
}

const defaultPreferences: Preferences = {
  theme: 'light',
  voiceEnabled: true,
  notifications: true,
  language: 'en',
  autoSave: true,
};

const initialState: PreferencesContextType = {
  preferences: defaultPreferences,
  voiceEnabled: true,
  setVoiceEnabled: () => {},
  isReady: false,
  updatePreferences: () => {},
};

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState({
    preferences: defaultPreferences,
    voiceEnabled: true,
    isReady: false,
  });

  useEffect(() => {
    try {
      const savedPreferences = localStorage.getItem('preferences');
      if (savedPreferences) {
        const parsed = JSON.parse(savedPreferences);
        setState(prev => ({
          ...prev,
          preferences: { ...defaultPreferences, ...parsed },
          voiceEnabled: parsed.voiceEnabled ?? true,
          isReady: true,
        }));
      } else {
        setState(prev => ({ ...prev, isReady: true }));
      }
    } catch (e) {
      setState(prev => ({ ...prev, isReady: true }));
    }
  }, []);

  const setVoiceEnabled = (enabled: boolean) => {
    setState(prev => {
      const newPreferences = {
        ...prev.preferences,
        voiceEnabled: enabled,
      };
      localStorage.setItem('preferences', JSON.stringify(newPreferences));
      return {
        ...prev,
        preferences: newPreferences,
        voiceEnabled: enabled,
      };
    });
  };

  const updatePreferences = (newPrefs: Partial<Preferences>) => {
    setState(prev => {
      const newPreferences = {
        ...prev.preferences,
        ...newPrefs,
      };
      localStorage.setItem('preferences', JSON.stringify(newPreferences));
      return {
        ...prev,
        preferences: newPreferences,
        voiceEnabled: newPreferences.voiceEnabled,
      };
    });
  };

  const value = {
    ...state,
    setVoiceEnabled,
    updatePreferences,
  };

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences(): PreferencesContextType {
  const context = useContext(PreferencesContext);
  if (context === undefined) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }
  return context;
} 