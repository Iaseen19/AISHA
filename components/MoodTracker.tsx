'use client';

import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Textarea } from './ui/textarea';

interface Mood {
  value: number;
  note: string;
  timestamp: Date;
}

const MOOD_EMOJIS = ['😢', '😕', '😐', '🙂', '😊'];
const MOOD_LABELS = ['Very Low', 'Low', 'Neutral', 'Good', 'Very Good'];

export function MoodTracker() {
  const [moods, setMoods] = useState<Mood[]>([]);
  const [currentNote, setCurrentNote] = useState('');
  const [selectedMood, setSelectedMood] = useState<number | null>(null);

  useEffect(() => {
    const savedMoods = localStorage.getItem('moodHistory');
    if (savedMoods) {
      const parsedMoods = JSON.parse(savedMoods).map((mood: any) => ({
        ...mood,
        timestamp: new Date(mood.timestamp),
      }));
      setMoods(parsedMoods);
    }
  }, []);

  const handleMoodSelect = (value: number) => {
    setSelectedMood(value);
  };

  const handleSaveMood = () => {
    if (selectedMood === null) return;

    const newMood: Mood = {
      value: selectedMood,
      note: currentNote,
      timestamp: new Date(),
    };

    const updatedMoods = [...moods, newMood];
    setMoods(updatedMoods);
    localStorage.setItem('moodHistory', JSON.stringify(updatedMoods));
    
    setSelectedMood(null);
    setCurrentNote('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mood Tracker</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">How are you feeling?</h3>
          <div className="grid grid-cols-5 gap-2">
            {MOOD_EMOJIS.map((emoji, index) => (
              <Button
                key={index}
                variant={selectedMood === index ? 'default' : 'outline'}
                onClick={() => handleMoodSelect(index)}
                className="h-16 text-2xl flex flex-col gap-1 hover:bg-primary/90"
              >
                <span>{emoji}</span>
                <span className="text-xs font-normal">{MOOD_LABELS[index]}</span>
              </Button>
            ))}
          </div>
        </div>

        {selectedMood !== null && (
          <div className="space-y-4">
            <Textarea
              placeholder="Add a note about how you're feeling... (optional)"
              value={currentNote}
              onChange={(e) => setCurrentNote(e.target.value)}
              className="min-h-[100px]"
            />
            <Button onClick={handleSaveMood} className="w-full">
              Save Mood
            </Button>
          </div>
        )}

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Recent Moods</h3>
          <div className="space-y-2">
            {moods.slice(-5).reverse().map((mood, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-3 rounded-lg bg-muted/50"
              >
                <div className="text-2xl">{MOOD_EMOJIS[mood.value]}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">
                    {MOOD_LABELS[mood.value]}
                  </div>
                  {mood.note && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {mood.note}
                    </p>
                  )}
                  <div className="text-xs text-muted-foreground mt-1">
                    {mood.timestamp.toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
            {moods.length === 0 && (
              <p className="text-center text-sm text-muted-foreground py-4">
                No moods recorded yet
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 