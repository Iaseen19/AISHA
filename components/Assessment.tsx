'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { Textarea } from './ui/textarea';
import { Progress } from './ui/progress';
import { ChevronRight, Save } from 'lucide-react';

interface AssessmentQuestion {
  id: string;
  question: string;
  type: 'scale' | 'text';
  category: 'mood' | 'anxiety' | 'sleep' | 'energy' | 'social';
}

const ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  {
    id: 'mood',
    question: 'How would you rate your overall mood today?',
    type: 'scale',
    category: 'mood'
  },
  {
    id: 'anxiety',
    question: 'How would you rate your anxiety level?',
    type: 'scale',
    category: 'anxiety'
  },
  {
    id: 'sleep',
    question: 'How well did you sleep last night?',
    type: 'scale',
    category: 'sleep'
  },
  {
    id: 'energy',
    question: 'How would you rate your energy level?',
    type: 'scale',
    category: 'energy'
  },
  {
    id: 'social',
    question: 'How would you rate your social interactions today?',
    type: 'scale',
    category: 'social'
  }
];

export function Assessment() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number | string>>({});
  const [notes, setNotes] = useState('');

  const handleNext = () => {
    if (currentQuestion < ASSESSMENT_QUESTIONS.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleAnswer = (value: number | string) => {
    setAnswers(prev => ({
      ...prev,
      [ASSESSMENT_QUESTIONS[currentQuestion].id]: value
    }));
  };

  const handleSave = () => {
    const assessment = {
      date: new Date(),
      answers,
      notes
    };
    // Save to local storage or database
    const savedAssessments = JSON.parse(localStorage.getItem('assessments') || '[]');
    savedAssessments.push(assessment);
    localStorage.setItem('assessments', JSON.stringify(savedAssessments));
  };

  const question = ASSESSMENT_QUESTIONS[currentQuestion];
  const progress = ((currentQuestion + 1) / ASSESSMENT_QUESTIONS.length) * 100;

  return (
    <Card className="w-full">
      <CardContent className="p-6 space-y-6">
        <div className="space-y-2">
          <Progress value={progress} className="w-full h-2" />
          <p className="text-sm text-muted-foreground text-right">
            Question {currentQuestion + 1} of {ASSESSMENT_QUESTIONS.length}
          </p>
        </div>

        <div className="space-y-4">
          <Label className="text-lg font-medium">{question.question}</Label>
          
          {question.type === 'scale' && (
            <div className="space-y-3">
              <Slider
                defaultValue={[answers[question.id] as number || 5]}
                min={1}
                max={10}
                step={1}
                onValueChange={([value]) => handleAnswer(value)}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Poor</span>
                <span>Excellent</span>
              </div>
            </div>
          )}

          {question.type === 'text' && (
            <Textarea
              value={answers[question.id] as string || ''}
              onChange={(e) => handleAnswer(e.target.value)}
              placeholder="Enter your response..."
              className="min-h-[100px]"
            />
          )}
        </div>

        {currentQuestion === ASSESSMENT_QUESTIONS.length - 1 && (
          <div className="space-y-4">
            <Label className="text-lg font-medium">Additional Notes</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional thoughts or feelings you'd like to share..."
              className="min-h-[100px]"
            />
          </div>
        )}

        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
          >
            Previous
          </Button>

          {currentQuestion < ASSESSMENT_QUESTIONS.length - 1 ? (
            <Button onClick={handleNext} className="ml-auto">
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleSave} className="ml-auto">
              Save Assessment
              <Save className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 