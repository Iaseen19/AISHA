'use client';

import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

export function BreathingExercise() {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale' | 'rest'>('inhale');
  const [timer, setTimer] = useState(0);

  const phaseDurations = {
    inhale: 4,
    hold: 7,
    exhale: 8,
    rest: 1,
  };

  const phaseMessages = {
    inhale: 'Breathe in...',
    hold: 'Hold...',
    exhale: 'Breathe out...',
    rest: 'Rest...',
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive) {
      interval = setInterval(() => {
        setTimer((prevTimer) => {
          const newTimer = prevTimer + 1;
          const currentPhaseDuration = phaseDurations[phase];

          if (newTimer >= currentPhaseDuration) {
            // Move to next phase
            switch (phase) {
              case 'inhale':
                setPhase('hold');
                break;
              case 'hold':
                setPhase('exhale');
                break;
              case 'exhale':
                setPhase('rest');
                break;
              case 'rest':
                setPhase('inhale');
                break;
            }
            return 0;
          }
          return newTimer;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isActive, phase]);

  const handleStartStop = () => {
    if (!isActive) {
      setPhase('inhale');
      setTimer(0);
    }
    setIsActive(!isActive);
  };

  const getCircleSize = () => {
    switch (phase) {
      case 'inhale':
        return `${(timer / phaseDurations.inhale) * 100}%`;
      case 'hold':
        return '100%';
      case 'exhale':
        return `${100 - (timer / phaseDurations.exhale) * 100}%`;
      case 'rest':
        return '0%';
      default:
        return '50%';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>4-7-8 Breathing Exercise</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-8">
        <div className="relative w-64 h-64 flex items-center justify-center">
          <div
            className="absolute bg-primary/20 rounded-full transition-all duration-1000"
            style={{
              width: getCircleSize(),
              height: getCircleSize(),
            }}
          />
          <div className="text-lg font-medium">
            {phaseMessages[phase]}
          </div>
        </div>

        <div className="text-center space-y-4">
          <p className="text-sm text-muted-foreground">
            This breathing technique can help reduce anxiety and promote relaxation.
          </p>
          <Button
            onClick={handleStartStop}
            size="lg"
            className="min-w-[120px]"
          >
            {isActive ? 'Stop' : 'Start'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 