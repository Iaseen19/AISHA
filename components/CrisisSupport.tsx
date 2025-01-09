'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { CrisisSupport as ICrisisSupport } from '@/types/therapy';

const EMERGENCY_RESOURCES: ICrisisSupport = {
  emergencyContacts: ['911', '988 - Suicide Prevention Lifeline'],
  helplineNumbers: [
    '1-800-273-8255 - National Crisis Line',
    '1-800-662-4357 - SAMHSA Treatment Referral',
  ],
  groundingExercises: [
    '5-4-3-2-1 Senses Exercise',
    'Deep Breathing',
    'Progressive Muscle Relaxation',
  ],
  safetyPlan: 'Contact emergency services or trusted person immediately if in crisis.',
};

export function CrisisSupport() {
  const [showGroundingExercise, setShowGroundingExercise] = useState(false);

  return (
    <Card className="border-2 border-red-200">
      <CardContent className="p-6 space-y-4">
        <h2 className="text-2xl font-semibold text-red-600">Crisis Support</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Emergency Contacts</h3>
            <ul className="list-disc pl-4 space-y-1">
              {EMERGENCY_RESOURCES.emergencyContacts.map((contact, index) => (
                <li key={index}>{contact}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Helpline Numbers</h3>
            <ul className="list-disc pl-4 space-y-1">
              {EMERGENCY_RESOURCES.helplineNumbers.map((number, index) => (
                <li key={index}>{number}</li>
              ))}
            </ul>
          </div>

          <div>
            <Button
              variant="outline"
              onClick={() => setShowGroundingExercise(!showGroundingExercise)}
              className="w-full"
            >
              {showGroundingExercise ? 'Hide' : 'Show'} Grounding Exercises
            </Button>
            
            {showGroundingExercise && (
              <div className="mt-2 space-y-2">
                {EMERGENCY_RESOURCES.groundingExercises.map((exercise, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      {exercise}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 