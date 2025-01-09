'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Button } from './ui/button';
import { Switch } from './ui/switch';

interface UserSettingsProps {
  onClose?: () => void;
}

export function UserSettings({ onClose }: UserSettingsProps) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const [settings, setSettings] = useState({
    notifications: false,
    voiceInput: false,
    autoSave: true,
    fontSize: 'medium'
  });

  useEffect(() => {
    setMounted(true);
    // Load saved settings from localStorage
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleSettingChange = (key: keyof typeof settings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem('userSettings', JSON.stringify(newSettings));
  };

  const handleThemeToggle = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(settings);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'settings.json';

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedSettings = JSON.parse(e.target?.result as string);
          setSettings(importedSettings);
          localStorage.setItem('userSettings', JSON.stringify(importedSettings));
        } catch (error) {
          console.error('Error importing settings:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleReset = () => {
    const defaultSettings = {
      notifications: false,
      voiceInput: false,
      autoSave: true,
      fontSize: 'medium'
    };
    setSettings(defaultSettings);
    localStorage.setItem('userSettings', JSON.stringify(defaultSettings));
  };

  if (!mounted) return null;

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Dark Mode</h3>
            <p className="text-sm text-muted-foreground">Switch between light and dark theme</p>
          </div>
          <Switch
            checked={theme === 'dark'}
            onCheckedChange={handleThemeToggle}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Notifications</h3>
            <p className="text-sm text-muted-foreground">Receive session reminders and updates</p>
          </div>
          <Switch
            checked={settings.notifications}
            onCheckedChange={(checked) => handleSettingChange('notifications', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Voice Input</h3>
            <p className="text-sm text-muted-foreground">Enable voice recording for messages</p>
          </div>
          <Switch
            checked={settings.voiceInput}
            onCheckedChange={(checked) => handleSettingChange('voiceInput', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Auto Save</h3>
            <p className="text-sm text-muted-foreground">Automatically save chat history</p>
          </div>
          <Switch
            checked={settings.autoSave}
            onCheckedChange={(checked) => handleSettingChange('autoSave', checked)}
          />
        </div>

        <div>
          <h3 className="font-medium mb-2">Font Size</h3>
          <div className="flex gap-2">
            {['small', 'medium', 'large'].map((size) => (
              <Button
                key={size}
                variant={settings.fontSize === size ? 'default' : 'outline'}
                onClick={() => handleSettingChange('fontSize', size)}
                className="flex-1"
              >
                {size.charAt(0).toUpperCase() + size.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          <Button onClick={handleExport} variant="outline" className="flex-1">
            Export Settings
          </Button>
          <Button variant="outline" className="flex-1" asChild>
            <label>
              Import Settings
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </label>
          </Button>
        </div>

        <Button
          onClick={handleReset}
          variant="destructive"
          className="w-full"
        >
          Reset to Defaults
        </Button>
      </div>
    </div>
  );
} 