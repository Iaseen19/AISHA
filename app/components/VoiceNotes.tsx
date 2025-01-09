'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button"

export function VoiceNotes() {
  const [recordings, setRecordings] = useState<string[]>([]);
  
  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm">
          Record Note
        </Button>
      </div>
      <div className="space-y-1">
        {recordings.map((recording, index) => (
          <div key={index} className="p-2 bg-muted rounded-md">
            {/* Audio player */}
          </div>
        ))}
      </div>
    </div>
  );
} 