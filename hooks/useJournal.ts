'use client';

import { useState, useEffect, useCallback } from 'react';
import { storage, STORAGE_KEYS, JournalEntry } from '@/services/storage';
import { usePreferences } from '@/app/providers/preferences-provider';
import { v4 as uuidv4 } from 'uuid';

export function useJournal() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const { preferences } = usePreferences();

  // Load journal entries
  useEffect(() => {
    if (preferences.autoSave) {
      const savedEntries = storage.get<JournalEntry[]>(STORAGE_KEYS.JOURNAL_ENTRIES);
      if (savedEntries) {
        setEntries(savedEntries);
      }
    }
  }, [preferences.autoSave]);

  // Save journal entries
  useEffect(() => {
    if (preferences.autoSave && entries.length > 0) {
      storage.set(STORAGE_KEYS.JOURNAL_ENTRIES, entries);
    }
  }, [entries, preferences.autoSave]);

  const addEntry = useCallback((content: string, mood: number, tags: string[] = []) => {
    const newEntry: JournalEntry = {
      id: uuidv4(),
      date: new Date().toISOString(),
      content,
      mood,
      tags,
    };
    setEntries(prev => [...prev, newEntry]);
  }, []);

  const updateEntry = useCallback((id: string, updates: Partial<JournalEntry>) => {
    setEntries(prev => prev.map(entry =>
      entry.id === id ? { ...entry, ...updates } : entry
    ));
  }, []);

  const deleteEntry = useCallback((id: string) => {
    setEntries(prev => prev.filter(entry => entry.id !== id));
  }, []);

  const getEntryById = useCallback((id: string) => {
    return entries.find(entry => entry.id === id);
  }, [entries]);

  const getEntriesByDate = useCallback((date: Date) => {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return entries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= startOfDay && entryDate <= endOfDay;
    });
  }, [entries]);

  const getEntriesByTag = useCallback((tag: string) => {
    return entries.filter(entry => entry.tags.includes(tag));
  }, [entries]);

  const getEntriesByMoodRange = useCallback((minMood: number, maxMood: number) => {
    return entries.filter(entry => 
      entry.mood >= minMood && entry.mood <= maxMood
    );
  }, [entries]);

  const searchEntries = useCallback((query: string) => {
    const searchTerm = query.toLowerCase();
    return entries.filter(entry =>
      entry.content.toLowerCase().includes(searchTerm) ||
      entry.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  }, [entries]);

  const exportEntries = useCallback(() => {
    return JSON.stringify(entries, null, 2);
  }, [entries]);

  const importEntries = useCallback((data: string) => {
    try {
      const imported = JSON.parse(data) as JournalEntry[];
      setEntries(imported);
      if (preferences.autoSave) {
        storage.set(STORAGE_KEYS.JOURNAL_ENTRIES, imported);
      }
    } catch (error) {
      console.error('Failed to import journal entries:', error);
      throw new Error('Invalid journal data');
    }
  }, [preferences.autoSave]);

  const clearEntries = useCallback(() => {
    setEntries([]);
    storage.remove(STORAGE_KEYS.JOURNAL_ENTRIES);
  }, []);

  const getMoodTrends = useCallback(() => {
    const trends = entries.reduce((acc, entry) => {
      const date = new Date(entry.date).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = { sum: 0, count: 0 };
      }
      acc[date].sum += entry.mood;
      acc[date].count += 1;
      return acc;
    }, {} as Record<string, { sum: number; count: number }>);

    return Object.entries(trends).map(([date, { sum, count }]) => ({
      date,
      averageMood: sum / count,
    }));
  }, [entries]);

  return {
    entries,
    addEntry,
    updateEntry,
    deleteEntry,
    getEntryById,
    getEntriesByDate,
    getEntriesByTag,
    getEntriesByMoodRange,
    searchEntries,
    exportEntries,
    importEntries,
    clearEntries,
    getMoodTrends,
  };
} 