'use client';

import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

const defaultPattern = {
  inhale: 4,
  hold: 4,
  exhale: 4,
  cycles: 5,
};

export function BreathingExercise() {
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [timeLeft, setTimeLeft] = useState(defaultPattern.inhale);
  const [cyclesLeft, setCyclesLeft] = useState(defaultPattern.cycles);

  useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev > 1) return prev - 1;
        
        // Phase transition
        switch (currentPhase) {
          case 'inhale':
            setCurrentPhase('hold');
            return defaultPattern.hold;
          case 'hold':
            setCurrentPhase('exhale');
            return defaultPattern.exhale;
          case 'exhale':
            setCurrentPhase('inhale');
            setCyclesLeft((prev) => prev - 1);
            return defaultPattern.inhale;
        }
      });
    }, 1000);

    if (cyclesLeft === 0) {
      setIsActive(false);
      setCyclesLeft(defaultPattern.cycles);
    }

    return () => clearInterval(timer);
  }, [isActive, currentPhase, cyclesLeft]);

  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <h2 className="text-2xl font-semibold text-center">Breathing Exercise</h2>
        <div className="text-center space-y-4">
          <div className="text-4xl font-bold">
            {isActive ? (
              <>
                <div>{currentPhase.toUpperCase()}</div>
                <div className="text-6xl mt-2">{timeLeft}</div>
              </>
            ) : (
              "Ready to begin?"
            )}
          </div>
          <div className="text-sm text-muted-foreground">
            Cycles remaining: {cyclesLeft}
          </div>
          <Button
            onClick={() => setIsActive(!isActive)}
            className="w-32"
          >
            {isActive ? "Stop" : "Start"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 