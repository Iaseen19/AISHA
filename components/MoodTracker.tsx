'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";

interface Mood {
  value: number;
  timestamp: Date;
  note?: string;
}

const MOOD_EMOJIS = ['😢', '😕', '😐', '🙂', '😊'];

export function MoodTracker() {
  const [moods, setMoods] = useState<Mood[]>([]);
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        {MOOD_EMOJIS.map((emoji, index) => (
          <Button
            key={index}
            variant="ghost"
            onClick={() => setMoods(prev => [...prev, { value: index + 1, timestamp: new Date() }])}
            className="text-2xl hover:bg-muted"
          >
            {emoji}
          </Button>
        ))}
      </div>
      
      <div className="space-y-2">
        {moods.slice(-3).map((mood, index) => (
          <div key={index} className="text-sm text-muted-foreground">
            {MOOD_EMOJIS[mood.value - 1]} {mood.timestamp.toLocaleTimeString()}
          </div>
        ))}
      </div>
    </div>
  );
} 