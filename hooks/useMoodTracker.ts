'use client';

import { useState, useEffect, useCallback } from 'react';
import { storage, STORAGE_KEYS, MoodEntry } from '@/services/storage';
import { usePreferences } from '@/contexts/PreferencesContext';

export function useMoodTracker() {
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const { preferences } = usePreferences();

  // Load mood entries
  useEffect(() => {
    if (preferences.autoSave) {
      const savedEntries = storage.get<MoodEntry[]>(STORAGE_KEYS.MOOD_ENTRIES);
      if (savedEntries) {
        setEntries(savedEntries);
      }
    }
  }, [preferences.autoSave]);

  // Save mood entries
  useEffect(() => {
    if (preferences.autoSave && entries.length > 0) {
      storage.set(STORAGE_KEYS.MOOD_ENTRIES, entries);
    }
  }, [entries, preferences.autoSave]);

  const addEntry = useCallback((value: number, note?: string) => {
    const newEntry: MoodEntry = {
      timestamp: Date.now(),
      value,
      note,
    };
    setEntries(prev => [...prev, newEntry]);
  }, []);

  const getAverageMood = useCallback((days: number = 7) => {
    const now = Date.now();
    const cutoff = now - days * 24 * 60 * 60 * 1000;
    const recentEntries = entries.filter(entry => entry.timestamp >= cutoff);
    
    if (recentEntries.length === 0) return null;
    
    const sum = recentEntries.reduce((acc, entry) => acc + entry.value, 0);
    return sum / recentEntries.length;
  }, [entries]);

  const getMoodTrend = useCallback((days: number = 7) => {
    const now = Date.now();
    const cutoff = now - days * 24 * 60 * 60 * 1000;
    const recentEntries = entries
      .filter(entry => entry.timestamp >= cutoff)
      .sort((a, b) => a.timestamp - b.timestamp);

    if (recentEntries.length < 2) return 'stable';

    const firstAvg = recentEntries
      .slice(0, Math.floor(recentEntries.length / 2))
      .reduce((acc, entry) => acc + entry.value, 0) / Math.floor(recentEntries.length / 2);

    const secondAvg = recentEntries
      .slice(Math.floor(recentEntries.length / 2))
      .reduce((acc, entry) => acc + entry.value, 0) / (recentEntries.length - Math.floor(recentEntries.length / 2));

    const difference = secondAvg - firstAvg;
    if (difference > 0.5) return 'improving';
    if (difference < -0.5) return 'declining';
    return 'stable';
  }, [entries]);

  const getDailyMoods = useCallback((days: number = 7) => {
    const result: { date: string; average: number; entries: MoodEntry[] }[] = [];
    const now = new Date();

    for (let i = 0; i < days; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const startOfDay = new Date(date.setHours(0, 0, 0, 0)).getTime();
      const endOfDay = new Date(date.setHours(23, 59, 59, 999)).getTime();

      const dayEntries = entries.filter(
        entry => entry.timestamp >= startOfDay && entry.timestamp <= endOfDay
      );

      if (dayEntries.length > 0) {
        const average = dayEntries.reduce((acc, entry) => acc + entry.value, 0) / dayEntries.length;
        result.push({
          date: date.toISOString().split('T')[0],
          average,
          entries: dayEntries,
        });
      } else {
        result.push({
          date: date.toISOString().split('T')[0],
          average: 0,
          entries: [],
        });
      }
    }

    return result.reverse();
  }, [entries]);

  const getMoodInsights = useCallback(() => {
    const recentMoods = getDailyMoods(30);
    const averageMood = getAverageMood(30);
    const trend = getMoodTrend(30);

    const bestDay = [...recentMoods].sort((a, b) => b.average - a.average)[0];
    const worstDay = [...recentMoods].sort((a, b) => a.average - b.average)[0];

    const moodVariability = recentMoods.reduce((acc, day) => {
      if (day.entries.length > 0) {
        const values = day.entries.map(e => e.value);
        return acc + Math.max(...values) - Math.min(...values);
      }
      return acc;
    }, 0) / recentMoods.filter(day => day.entries.length > 0).length;

    return {
      averageMood,
      trend,
      bestDay,
      worstDay,
      moodVariability,
      totalEntries: entries.length,
      daysTracked: recentMoods.filter(day => day.entries.length > 0).length,
    };
  }, [entries, getDailyMoods, getAverageMood, getMoodTrend]);

  const exportData = useCallback(() => {
    return JSON.stringify(entries, null, 2);
  }, [entries]);

  const importData = useCallback((data: string) => {
    try {
      const imported = JSON.parse(data) as MoodEntry[];
      setEntries(imported);
      if (preferences.autoSave) {
        storage.set(STORAGE_KEYS.MOOD_ENTRIES, imported);
      }
    } catch (error) {
      console.error('Failed to import mood data:', error);
      throw new Error('Invalid mood data');
    }
  }, [preferences.autoSave]);

  const clearData = useCallback(() => {
    setEntries([]);
    storage.remove(STORAGE_KEYS.MOOD_ENTRIES);
  }, []);

  return {
    entries,
    addEntry,
    getAverageMood,
    getMoodTrend,
    getDailyMoods,
    getMoodInsights,
    exportData,
    importData,
    clearData,
  };
} 