'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useRouter } from 'next/navigation'
import { MoodTracker } from '@/components/MoodTracker'
import { JournalPrompt } from '@/components/JournalPrompt'
import { ProgressView } from '@/components/ProgressView'
import { UserSettings } from '@/components/UserSettings'
import { WeeklyReport } from '@/components/WeeklyReport'
import { EnhancedJournal } from '@/components/EnhancedJournal'
import { BreathingExercise } from '@/components/BreathingExercise'
import { CrisisSupport } from '@/components/CrisisSupport'
import { ResourceLibrary } from '@/components/ResourceLibrary'
import { GoalTracker } from '@/components/GoalTracker'
import { usePreferences } from '@/contexts/PreferencesContext'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function VoiceChat() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([])
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [inputText, setInputText] = useState('')
  const recognition = useRef<any>(null)
  const router = useRouter()
  const { preferences } = usePreferences()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (preferences.autoSave) {
      const savedMessages = localStorage.getItem('chatHistory')
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages))
      }
    }
  }, [preferences.autoSave])

  useEffect(() => {
    if (preferences.autoSave) {
      localStorage.setItem('chatHistory', JSON.stringify(messages))
    }
  }, [messages, preferences.autoSave])

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    try {
      setIsProcessing(true);
      setMessages(prev => [...prev, { role: 'user', content: inputText }]);

      const chatResponse = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: inputText }),
      });

      if (!chatResponse.ok) {
        throw new Error('Chat response failed');
      }

      const data = await chatResponse.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.response.content }]);
      setInputText('');
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        role: 'system', 
        content: 'Sorry, there was an error processing your message.' 
      }]);
    } finally {
      setIsProcessing(false);
    }
  };

  const startRecording = async () => {
    if (!preferences.voiceEnabled) {
      setMessages(prev => [...prev, { 
        role: 'system', 
        content: 'Voice input is disabled in settings.' 
      }]);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      if (!window.webkitSpeechRecognition && !window.SpeechRecognition) {
        throw new Error('Speech recognition is not supported in this browser. Please use Chrome.');
      }

      recognition.current = new (window.webkitSpeechRecognition || window.SpeechRecognition)();
      recognition.current.lang = 'en-US';
      recognition.current.continuous = false;
      recognition.current.interimResults = false;

      recognition.current.onstart = () => {
        setIsRecording(true);
      };

      recognition.current.onresult = async (event: any) => {
        const transcript = event.results[0][0].transcript;
        setMessages(prev => [...prev, { role: 'user', content: transcript }]);

        try {
          setIsProcessing(true);
          const chatResponse = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: transcript }),
          });

          if (!chatResponse.ok) {
            throw new Error('Chat response failed');
          }

          const data = await chatResponse.json();
          setMessages(prev => [...prev, { 
            role: 'assistant', 
            content: data.response.content 
          }]);
        } catch (error) {
          console.error('Error:', error);
          setMessages(prev => [...prev, { 
            role: 'system', 
            content: 'Sorry, there was an error processing your message.' 
          }]);
        } finally {
          setIsProcessing(false);
        }
      };

      recognition.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setMessages(prev => [...prev, { 
          role: 'system', 
          content: `Error with speech recognition: ${event.error}. Please try again.` 
        }]);
        setIsRecording(false);
      };

      recognition.current.onend = () => {
        setIsRecording(false);
      };

      recognition.current.start();
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      setMessages(prev => [...prev, { 
        role: 'system', 
        content: 'Speech recognition not supported or permission denied. Please use Chrome and allow microphone access.' 
      }]);
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (recognition.current) {
      recognition.current.stop()
      setIsRecording(false)
    }
  }

  const handleViewSummary = async () => {
    try {
      setIsProcessing(true);
      const response = await fetch('/api/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversation: messages.map(m => `${m.role}: ${m.content}`).join('\n')
        }),
      });
      
      if (!response.ok) {
        throw new Error('Summary generation failed');
      }
      
      const data = await response.json();
      localStorage.setItem('sessionSummary', data.summary.content);
      router.push('/summary');
    } catch (error) {
      console.error('Error generating summary:', error);
      setMessages(prev => [...prev, { 
        role: 'system', 
        content: 'Error generating summary. Please try again.' 
      }]);
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">AI Therapy Session</h1>
        <div className="flex items-center gap-4">
          <CrisisSupport />
          <UserSettings />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Left Column: Support Tools */}
        <div className="space-y-4">
          <Tabs defaultValue="mood" className="w-full">
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="mood">Mood</TabsTrigger>
              <TabsTrigger value="progress">Progress</TabsTrigger>
              <TabsTrigger value="goals">Goals</TabsTrigger>
            </TabsList>
            <TabsContent value="mood">
              <Card>
                <CardContent className="p-4">
                  <MoodTracker />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="progress">
              <Card>
                <CardContent className="p-4">
                  <ProgressView />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="goals">
              <Card>
                <CardContent className="p-4">
                  <GoalTracker />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <WeeklyReport />
          
          <Card>
            <CardContent className="p-4">
              <BreathingExercise />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <ResourceLibrary />
            </CardContent>
          </Card>
        </div>

        {/* Middle Column: Chat */}
        <div className="md:col-span-2">
          <Card className="mb-4">
            <CardContent className="p-4 min-h-[400px] max-h-[600px] overflow-y-auto">
              {messages.map((msg, index) => (
                <div 
                  key={index} 
                  className={`mb-4 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`message-bubble max-w-[80%] ${
                    msg.role === 'user' 
                      ? 'user-message' 
                      : msg.role === 'system'
                      ? 'system-message'
                      : 'assistant-message'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isProcessing && (
                <div className="flex justify-center">
                  <div className="animate-pulse text-muted-foreground">
                    Processing...
                  </div>
          </div>
        )}
              <div ref={messagesEndRef} />
            </CardContent>
          </Card>

          {/* Chat Input */}
          <div className="space-y-4">
            <div className="input-container">
              <Input
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Type your message..."
                disabled={isProcessing || isRecording}
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={isProcessing || isRecording || !inputText.trim()}
                className="w-24"
              >
                Send
              </Button>
            </div>

            <div className="controls-container">
          <Button
                onClick={isRecording ? stopRecording : startRecording}
                variant={isRecording ? "destructive" : "default"}
                className="w-32"
                disabled={isProcessing || !preferences.voiceEnabled}
              >
                {isRecording ? 'Stop' : 'Record'}
          </Button>

              {messages.length > 0 && (
          <Button
                  onClick={handleViewSummary}
            variant="outline"
                  disabled={isProcessing}
          >
                  View Summary
          </Button>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Journal */}
        <div>
          <EnhancedJournal />
        </div>
      </div>
    </div>
  )
}

