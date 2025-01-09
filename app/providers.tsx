'use client';

import { PreferencesProvider } from '@/contexts/PreferencesContext';
import { Toaster } from 'sonner';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PreferencesProvider>
      {children}
      <Toaster />
    </PreferencesProvider>
  );
} 