'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, Square } from 'lucide-react';
import { usePreferences } from '@/app/providers/preferences-provider';
import { toast } from 'sonner';

interface VoiceNotesProps {
  onTranscription: (text: string) => void;
}

export function VoiceNotes({ onTranscription }: VoiceNotesProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const { preferences } = usePreferences();

  const startRecording = async () => {
    if (!preferences.voiceEnabled) {
      toast.error('Voice input is disabled in settings');
      return;
    }

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Your browser does not support audio recording');
      }

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

      const mimeType = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/ogg;codecs=opus',
        'audio/ogg',
        'audio/mp4'
      ].find(type => MediaRecorder.isTypeSupported(type));

      if (!mimeType) {
        throw new Error('No supported audio MIME type found');
      }

      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      const chunks: BlobPart[] = [];
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: mimeType });
        const formData = new FormData();
        formData.append('audio', audioBlob, 'recording.webm');

        try {
          setIsProcessing(true);
          const response = await fetch('/api/audio', {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            throw new Error('Transcription failed');
          }

          const { text } = await response.json();
          
          if (!text) {
            throw new Error('No transcription received');
          }

          onTranscription(text);
        } catch (error) {
          console.error('Processing error:', error);
          toast.error('Failed to process voice recording');
        } finally {
          setIsProcessing(false);
        }
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
      toast.success('Recording started');
    } catch (error: any) {
      console.error('Error starting recording:', error);
      toast.error(error.message || 'Could not access microphone');
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      toast.success('Recording stopped');
    }
  };

  return (
    <Button
      onClick={isRecording ? stopRecording : startRecording}
      variant={isRecording ? "destructive" : "secondary"}
      disabled={isProcessing || !preferences.voiceEnabled}
      className="h-[52px] w-full rounded-xl flex items-center justify-center gap-2 text-sm font-medium"
    >
      {isRecording ? (
        <>
          <Square className="h-4 w-4" />
          <span>Stop</span>
        </>
      ) : (
        <>
          <Mic className="h-4 w-4" />
          <span>Voice</span>
        </>
      )}
    </Button>
  );
} 