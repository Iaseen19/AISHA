'use client';

import { useState } from 'react';
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { Settings, Download, Upload, RotateCcw, Check, X } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "./ui/sheet";
import { usePreferences } from '@/contexts/PreferencesContext';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

export function UserSettings() {
  const { preferences, updatePreference, resetPreferences, exportPreferences, importPreferences } = usePreferences();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleExport = async () => {
    try {
      setIsLoading(true);
      const data = exportPreferences();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'preferences.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Preferences exported successfully');
    } catch (error) {
      toast.error('Failed to export preferences');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsLoading(true);
      const text = await file.text();
      importPreferences(text);
      toast.success('Preferences imported successfully');
      setIsOpen(false);
    } catch (error) {
      toast.error('Failed to import preferences');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    resetPreferences();
    toast.success('Preferences reset to defaults');
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="relative btn-icon"
          aria-label="Open settings"
        >
          <Settings className="h-5 w-5" />
          <span className="sr-only">Settings</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-md">
        <div>
          <SheetHeader>
            <SheetTitle className="text-xl font-semibold">Settings</SheetTitle>
            <SheetDescription>
              Customize your therapy session experience
            </SheetDescription>
          </SheetHeader>
          <div className="space-y-6 py-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between space-x-4">
                <Label htmlFor="theme" className="flex items-center space-x-2">
                  <span>Dark Mode</span>
                </Label>
                <Switch
                  id="theme"
                  checked={preferences.theme === 'dark'}
                  onCheckedChange={(checked) => updatePreference('theme', checked ? 'dark' : 'light')}
                  aria-label="Toggle dark mode"
                />
              </div>

              <div className="flex items-center justify-between space-x-4">
                <Label htmlFor="notifications" className="flex items-center space-x-2">
                  <span>Notifications</span>
                </Label>
                <Switch
                  id="notifications"
                  checked={preferences.notifications}
                  onCheckedChange={(checked) => updatePreference('notifications', checked)}
                  aria-label="Toggle notifications"
                />
              </div>

              <div className="flex items-center justify-between space-x-4">
                <Label htmlFor="voiceEnabled" className="flex items-center space-x-2">
                  <span>Voice Input</span>
                </Label>
                <Switch
                  id="voiceEnabled"
                  checked={preferences.voiceEnabled}
                  onCheckedChange={(checked) => updatePreference('voiceEnabled', checked)}
                  aria-label="Toggle voice input"
                />
              </div>

              <div className="flex items-center justify-between space-x-4">
                <Label htmlFor="autoSave" className="flex items-center space-x-2">
                  <span>Auto Save</span>
                </Label>
                <Switch
                  id="autoSave"
                  checked={preferences.autoSave}
                  onCheckedChange={(checked) => updatePreference('autoSave', checked)}
                  aria-label="Toggle auto save"
                />
              </div>

              <div className="space-y-2">
                <Label>Font Size</Label>
                <div className="flex gap-2">
                  {(['small', 'medium', 'large'] as const).map((size) => (
                    <Button
                      key={size}
                      variant={preferences.fontSize === size ? 'default' : 'outline'}
                      onClick={() => updatePreference('fontSize', size)}
                      className="flex-1 capitalize"
                      aria-pressed={preferences.fontSize === size}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <SheetFooter className="flex-col gap-4 sm:flex-col">
            <div className="grid grid-cols-2 gap-4 w-full">
              <Button
                variant="outline"
                onClick={handleExport}
                disabled={isLoading}
                className="w-full"
                aria-label="Export preferences"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button
                variant="outline"
                onClick={() => document.getElementById('import-preferences')?.click()}
                disabled={isLoading}
                className="w-full"
                aria-label="Import preferences"
              >
                <Upload className="w-4 h-4 mr-2" />
                Import
                <input
                  id="import-preferences"
                  type="file"
                  accept=".json"
                  className="hidden"
                  onChange={handleImport}
                  aria-label="Import preferences file"
                />
              </Button>
            </div>
            <Button
              variant="destructive"
              onClick={handleReset}
              disabled={isLoading}
              className="w-full"
              aria-label="Reset preferences to defaults"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset to Defaults
            </Button>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
} 