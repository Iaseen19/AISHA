'use client'

import { useState, useCallback, useEffect } from 'react'
import { useChat } from 'ai/react'
import { Message } from 'ai'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { MessageList } from "../components/MessageList"
import { VoiceNotes } from "@/components/VoiceNotes"
import { UserSettings } from "@/components/UserSettings"
import { Assessment } from "@/components/Assessment"
import { MoodTracker } from "@/components/MoodTracker"
import { BreathingExercise } from "@/components/BreathingExercise"
import { DataAnalytics } from "@/components/DataAnalytics"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Settings, Sun, Moon } from 'lucide-react'
import { useTheme } from 'next-themes'

export default function Home() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat();
  const [showSettings, setShowSettings] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Only show theme toggle after mounting to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSendMessage = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmit(e);
  }, [handleSubmit]);

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-[#343541]">
      <header className="flex justify-between items-center p-4 border-b bg-white dark:bg-[#343541] border-gray-200 dark:border-gray-600/50">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">AISHA – AI Supported Health Assistant</h1>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="relative"
            aria-label="Toggle theme"
          >
            {mounted && (theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />)}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowSettings(!showSettings)}
            className="relative"
            aria-label="Settings"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main className="flex-1 container max-w-5xl mx-auto px-4 py-6">
        <Tabs defaultValue="chat" className="w-full h-full space-y-6">
          <TabsList className="grid w-full grid-cols-5 gap-4 p-1">
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="mood">Mood</TabsTrigger>
            <TabsTrigger value="breathing">Breathing</TabsTrigger>
            <TabsTrigger value="assessment">Assessment</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="h-[calc(100vh-16rem)] flex flex-col space-y-4">
            <div className="flex-1 overflow-auto px-4 py-2">
              <MessageList messages={messages} />
            </div>
            <form onSubmit={handleSendMessage} className="border-t border-gray-200 dark:border-gray-600/50 bg-white dark:bg-[#343541] p-4">
              <div className="max-w-3xl mx-auto flex gap-4 items-end">
                <div className="flex-1 relative">
                  <Textarea
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Message AISHA..."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        if (input.trim()) {
                          handleSendMessage(new Event('submit') as any);
                        }
                      }
                    }}
                    className="min-h-[100px] py-3 px-4 rounded-xl border-2 border-gray-200 dark:border-gray-600/50 bg-white dark:bg-[#40414f] focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary text-lg resize-none shadow-sm text-gray-900 dark:text-gray-100"
                    aria-label="Chat input"
                  />
                  <Button 
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="absolute right-3 bottom-3 p-2 bg-primary hover:bg-primary/90 text-white rounded-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Send message"
                  >
                    Send
                  </Button>
                </div>
                <div className="flex-shrink-0 w-32">
                  <VoiceNotes onTranscription={(text) => handleInputChange({ target: { value: text } } as any)} />
                </div>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="mood" className="h-[calc(100vh-16rem)] overflow-auto">
            <MoodTracker />
          </TabsContent>

          <TabsContent value="breathing" className="h-[calc(100vh-16rem)] overflow-auto">
            <BreathingExercise />
          </TabsContent>

          <TabsContent value="assessment" className="h-[calc(100vh-16rem)] overflow-auto">
            <Assessment />
          </TabsContent>

          <TabsContent value="analytics" className="h-[calc(100vh-16rem)] overflow-auto">
            <DataAnalytics />
          </TabsContent>
        </Tabs>

        {showSettings && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50">
            <div className="fixed right-0 top-0 h-full w-[400px] bg-background shadow-lg">
              <div className="h-full overflow-y-auto">
                <div className="flex justify-between items-center p-4 border-b">
                  <h2 className="text-lg font-semibold">Settings</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowSettings(false)}
                    aria-label="Close settings"
                  >
                    <span className="sr-only">Close</span>
                    ×
                  </Button>
                </div>
                <UserSettings onClose={() => setShowSettings(false)} />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

