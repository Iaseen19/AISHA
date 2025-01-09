'use client';

import { useState } from 'react';

export function ProgressView() {
  const [sessions] = useState(0);
  
  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">
        <div className="flex justify-between items-center mb-2">
          <span>Sessions Completed</span>
          <span className="font-semibold">{sessions}</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-primary rounded-full h-2 transition-all"
            style={{ width: `${Math.min((sessions / 10) * 100, 100)}%` }}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: 7 }).map((_, i) => (
          <div 
            key={i}
            className="aspect-square rounded bg-muted/50"
          />
        ))}
      </div>
    </div>
  );
} 