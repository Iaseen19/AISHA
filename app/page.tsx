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
import { Square, Mic } from 'lucide-react'

export default function VoiceChat() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([])
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [inputText, setInputText] = useState('')
  const recognition = useRef<any>(null)
  const router = useRouter()
  const { preferences } = usePreferences()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)

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
      // First check if the browser supports getUserMedia
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Your browser does not support audio recording');
      }

      // Check if we already have permission
      const permissionResult = await navigator.permissions.query({ name: 'microphone' as PermissionName });
      
      if (permissionResult.state === 'denied') {
        throw new Error('Microphone access is blocked. Please allow access in your browser settings.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      const chunks: BlobPart[] = [];
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm;codecs=opus' });
        
        // Create FormData and append the audio file
        const formData = new FormData();
        formData.append('audio', audioBlob, 'recording.webm');

        try {
          setIsProcessing(true);
          // Send audio for transcription
          const transcriptionResponse = await fetch('/api/audio', {
            method: 'POST',
            body: formData,
          });

          if (!transcriptionResponse.ok) {
            throw new Error('Transcription failed');
          }

          const { text } = await transcriptionResponse.json();
          
          if (!text) {
            throw new Error('No transcription received');
          }

          // Add transcribed text as user message
          setMessages(prev => [...prev, { role: 'user', content: text }]);

          // Process transcribed text with chat API
          const chatResponse = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text }),
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
          console.error('Processing error:', error);
          setMessages(prev => [...prev, { 
            role: 'system', 
            content: 'Sorry, there was an error processing your voice message.' 
          }]);
        } finally {
          setIsProcessing(false);
        }
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error: any) {
      console.error('Error starting recording:', error);
      setMessages(prev => [...prev, { 
        role: 'system', 
        content: error.message || 'Could not access microphone. Please check your browser permissions.' 
      }]);
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

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
    <div className="min-h-screen bg-off-white">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-light-gray bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container flex h-14 items-center justify-between">
          <h1 className="font-serif text-h2 font-bold text-dark-gray">AISHA Therapy</h1>
          <div className="flex items-center space-x-4">
            <CrisisSupport />
            <UserSettings />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar - Support Tools */}
          <div className="lg:col-span-3 space-y-6">
            <div className="sticky top-24">
              <Tabs defaultValue="mood" className="w-full">
                <TabsList className="w-full grid grid-cols-3 p-1 bg-sand rounded-lg">
                  <TabsTrigger value="mood" className="data-[state=active]:bg-healing data-[state=active]:text-white">
                    Mood
                  </TabsTrigger>
                  <TabsTrigger value="progress" className="data-[state=active]:bg-healing data-[state=active]:text-white">
                    Progress
                  </TabsTrigger>
                  <TabsTrigger value="goals" className="data-[state=active]:bg-healing data-[state=active]:text-white">
                    Goals
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="mood">
                  <Card className="shadow-card">
                    <CardContent className="p-6">
                      <MoodTracker />
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="progress">
                  <Card className="shadow-card">
                    <CardContent className="p-6">
                      <ProgressView />
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="goals">
                  <Card className="shadow-card">
                    <CardContent className="p-6">
                      <GoalTracker />
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              <Card className="mt-6 shadow-card">
                <CardContent className="p-6">
                  <BreathingExercise />
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Chat Area */}
          <div className="lg:col-span-6 flex flex-col h-[calc(100vh-8rem)]">
            <Card className="flex-1 overflow-hidden shadow-card">
              <CardContent className="p-6 h-full flex flex-col">
                <div className="flex-1 overflow-y-auto space-y-4">
                  {messages.map((msg, index) => (
                    <div 
                      key={index} 
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[80%] rounded-lg px-4 py-2 ${
                        msg.role === 'user' 
                          ? 'bg-primary text-white ml-4' 
                          : msg.role === 'system'
                          ? 'bg-sand text-dark-gray'
                          : 'bg-lavender text-white mr-4'
                      }`}>
                        <p className="text-body">{msg.content}</p>
                      </div>
                    </div>
                  ))}
                  {isProcessing && (
                    <div className="voice-processing">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Chat Input */}
                <div className="mt-6 space-y-4">
                  <div className="flex gap-4">
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
                      className="flex-1 h-12 rounded-lg border-light-gray focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={isProcessing || isRecording || !inputText.trim()}
                      className="h-12 px-6 bg-primary text-white hover:bg-primary/90 disabled:opacity-50"
                    >
                      Send
                    </Button>
                  </div>

                  <div className="flex justify-between items-center">
                    <Button
                      onClick={isRecording ? stopRecording : startRecording}
                      variant={isRecording ? "destructive" : "secondary"}
                      disabled={isProcessing || !preferences.voiceEnabled}
                      className={`h-12 px-6 flex items-center ${
                        isRecording 
                          ? 'bg-error text-white hover:bg-error/90' 
                          : 'bg-lavender text-white hover:bg-lavender/90'
                      } disabled:opacity-50`}
                    >
                      {isRecording ? (
                        <>
                          <Square className="h-4 w-4 mr-2" />
                          Stop Recording
                        </>
                      ) : (
                        <>
                          <Mic className="h-4 w-4 mr-2" />
                          Start Recording
                        </>
                      )}
                    </Button>

                    {messages.length > 0 && (
                      <Button
                        onClick={handleViewSummary}
                        variant="outline"
                        disabled={isProcessing}
                        className="h-12 px-6 border-2 border-lavender text-lavender hover:bg-lavender/10 disabled:opacity-50"
                      >
                        View Summary
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar - Journal and Resources */}
          <div className="lg:col-span-3 space-y-6">
            <div className="sticky top-24">
              <Card className="shadow-card">
                <CardContent className="p-6">
                  <h3 className="font-serif text-h3 font-bold text-dark-gray mb-4">Journal</h3>
                  <EnhancedJournal />
                </CardContent>
              </Card>

              <Card className="mt-6 shadow-card">
                <CardContent className="p-6">
                  <h3 className="font-serif text-h3 font-bold text-dark-gray mb-4">Resources</h3>
                  <ResourceLibrary />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

