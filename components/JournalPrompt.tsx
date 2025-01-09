'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";

const prompts = [
  "How are you feeling right now?",
  "What's on your mind today?",
  "What are you grateful for?",
  "What's challenging you at the moment?",
  "What's one thing you'd like to improve?"
];

export function JournalPrompt() {
  const [currentPrompt, setCurrentPrompt] = useState(prompts[0]);
  const [entry, setEntry] = useState('');
  
  const getNewPrompt = () => {
    const currentIndex = prompts.indexOf(currentPrompt);
    const nextIndex = (currentIndex + 1) % prompts.length;
    setCurrentPrompt(prompts[nextIndex]);
  };
  
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">{currentPrompt}</p>
      <textarea 
        value={entry}
        onChange={(e) => setEntry(e.target.value)}
        className="w-full min-h-[100px] p-2 rounded-lg bg-muted/50 resize-none"
        placeholder="Start writing..."
      />
      <Button variant="outline" onClick={getNewPrompt}>
        Next Prompt
      </Button>
    </div>
  );
} 