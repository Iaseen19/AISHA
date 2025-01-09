'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { TherapyGoal } from '@/types/therapy';

export function GoalTracker() {
  const [goals, setGoals] = useState<TherapyGoal[]>([]);
  const [newGoal, setNewGoal] = useState('');

  const addGoal = () => {
    if (!newGoal.trim()) return;

    setGoals([
      ...goals,
      {
        description: newGoal,
        targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
        milestones: [],
        reflections: [],
      },
    ]);
    setNewGoal('');
  };

  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <h2 className="text-2xl font-semibold">Goals</h2>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
              placeholder="Enter a new goal..."
              onKeyDown={(e) => e.key === 'Enter' && addGoal()}
            />
            <Button onClick={addGoal}>Add</Button>
          </div>
          <div className="space-y-2">
            {goals.map((goal, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>{goal.description}</div>
                    <div className="text-sm text-muted-foreground">
                      Due: {goal.targetDate.toLocaleDateString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 