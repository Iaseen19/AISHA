'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Mic } from 'lucide-react';
import { usePreferences } from '@/app/providers/preferences-provider';

interface VoiceNotesProps {
  onTranscription: (text: string) => void;
}

export function VoiceNotes({ onTranscription }: VoiceNotesProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const { voiceEnabled, isReady } = usePreferences();

  useEffect(() => {
    if (!isReady) return;
    
    if (isRecording && voiceEnabled) {
      startRecording();
    } else if (mediaRecorder) {
      mediaRecorder.stop();
    }
  }, [isRecording, voiceEnabled, isReady, mediaRecorder]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setAudioChunks((chunks) => [...chunks, event.data]);
        }
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        // Convert to base64 and send to API for transcription
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64Audio = (reader.result as string).split(',')[1];
          try {
            const response = await fetch('/api/transcribe', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ audio: base64Audio }),
            });
            
            if (response.ok) {
              const { text } = await response.json();
              onTranscription(text);
            }
          } catch (error) {
            console.error('Transcription error:', error);
          }
        };
        reader.readAsDataURL(audioBlob);
        setAudioChunks([]);
      };

      recorder.start();
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setIsRecording(false);
    }
  };

  const handleVoiceMode = () => {
    if (!voiceEnabled) return;
    setIsRecording(!isRecording);
  };

  return (
    <Button
      variant="default"
      onClick={handleVoiceMode}
      disabled={!voiceEnabled}
      className={`h-[60px] px-6 rounded-full flex items-center gap-2 shadow-md ${
        isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-primary hover:bg-primary/90'
      } ${!voiceEnabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      aria-label={isRecording ? 'Stop recording' : 'Start recording'}
    >
      <Mic className={`h-5 w-5 ${isRecording ? 'animate-pulse' : ''}`} />
      <span className="font-medium">
        {isRecording ? 'Recording...' : 'Voice mode'}
      </span>
    </Button>
  );
} 