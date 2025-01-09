'use client';

import React, { createContext, useContext, useState } from 'react';

interface PreferencesContextType {
  voiceEnabled: boolean;
  setVoiceEnabled: (enabled: boolean) => void;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  const value = {
    voiceEnabled,
    setVoiceEnabled,
  };

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (typeof window !== 'undefined' && context === undefined) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }
  return context || { voiceEnabled: true, setVoiceEnabled: () => {} };
} 