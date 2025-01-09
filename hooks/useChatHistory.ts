'use client';

import { useState, useEffect, useCallback } from 'react';
import { storage, STORAGE_KEYS, ChatMessage } from '@/services/storage';
import { usePreferences } from '@/app/providers/preferences-provider';

export function useChatHistory() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const { preferences } = usePreferences();

  // Load chat history
  useEffect(() => {
    if (preferences.autoSave) {
      const savedMessages = storage.get<ChatMessage[]>(STORAGE_KEYS.CHAT_HISTORY);
      if (savedMessages) {
        setMessages(savedMessages);
      }
    }
  }, [preferences.autoSave]);

  // Save chat history
  useEffect(() => {
    if (preferences.autoSave && messages.length > 0) {
      storage.set(STORAGE_KEYS.CHAT_HISTORY, messages);
    }
  }, [messages, preferences.autoSave]);

  const addMessage = useCallback((role: ChatMessage['role'], content: string) => {
    const newMessage: ChatMessage = {
      role,
      content,
      timestamp: Date.now(),
    };
    setMessages(prev => [...prev, newMessage]);
  }, []);

  const clearHistory = useCallback(() => {
    setMessages([]);
    storage.remove(STORAGE_KEYS.CHAT_HISTORY);
  }, []);

  const exportHistory = useCallback(() => {
    return JSON.stringify(messages, null, 2);
  }, [messages]);

  const importHistory = useCallback((data: string) => {
    try {
      const imported = JSON.parse(data) as ChatMessage[];
      setMessages(imported);
      if (preferences.autoSave) {
        storage.set(STORAGE_KEYS.CHAT_HISTORY, imported);
      }
    } catch (error) {
      console.error('Failed to import chat history:', error);
      throw new Error('Invalid chat history data');
    }
  }, [preferences.autoSave]);

  const getMessagesByDate = useCallback((date: Date) => {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return messages.filter(msg => {
      const msgDate = new Date(msg.timestamp);
      return msgDate >= startOfDay && msgDate <= endOfDay;
    });
  }, [messages]);

  const searchMessages = useCallback((query: string) => {
    const searchTerm = query.toLowerCase();
    return messages.filter(msg =>
      msg.content.toLowerCase().includes(searchTerm)
    );
  }, [messages]);

  return {
    messages,
    addMessage,
    clearHistory,
    exportHistory,
    importHistory,
    getMessagesByDate,
    searchMessages,
  };
} 