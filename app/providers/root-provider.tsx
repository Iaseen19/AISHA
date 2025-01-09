'use client';

import { ThemeProvider } from "./theme-provider";
import { PreferencesProvider } from "./preferences-provider";

export function RootProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <PreferencesProvider>
        {children}
      </PreferencesProvider>
    </ThemeProvider>
  );
} 