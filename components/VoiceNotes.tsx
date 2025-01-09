'use client';

import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button"
import { Mic, Square, Play, Trash2 } from "lucide-react"

export function VoiceNotes() {
  const [recordings, setRecordings] = useState<{ blob: Blob; url: string }[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setRecordings(prev => [...prev, { blob, url }]);
        chunksRef.current = [];
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const deleteRecording = (index: number) => {
    URL.revokeObjectURL(recordings[index].url);
    setRecordings(prev => prev.filter((_, i) => i !== index));
  };

  const playRecording = (url: string) => {
    const audio = new Audio(url);
    audio.play();
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <Button 
          variant={isRecording ? "destructive" : "default"}
          size="sm"
          onClick={isRecording ? stopRecording : startRecording}
        >
          {isRecording ? (
            <>
              <Square className="h-4 w-4 mr-2" />
              Stop Recording
            </>
          ) : (
            <>
              <Mic className="h-4 w-4 mr-2" />
              Record Note
            </>
          )}
        </Button>
      </div>
      <div className="space-y-1">
        {recordings.map((recording, index) => (
          <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-md">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => playRecording(recording.url)}
            >
              <Play className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => deleteRecording(index)}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
} 