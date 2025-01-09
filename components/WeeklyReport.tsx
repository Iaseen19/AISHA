'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { WeeklyReport as IWeeklyReport } from '@/types/therapy';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const MOCK_DATA: IWeeklyReport = {
  moodSummary: {
    weeklyTrends: Array.from({ length: 7 }, (_, i) => ({
      date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000),
      mood: Math.floor(Math.random() * 5) + 1,
    })),
    commonTriggers: ['Work stress', 'Sleep quality', 'Social interactions'],
    recommendedStrategies: ['Mindful breathing', 'Regular exercise', 'Journal writing'],
  },
  journalHighlights: [
    'Showed resilience in handling work challenges',
    'Made progress in communication skills',
    'Practiced self-care consistently',
  ],
  progressTowardsGoals: 75,
  recommendedFocus: [
    'Continue practicing mindfulness',
    'Work on setting boundaries',
    'Maintain regular exercise routine',
  ],
};

export function WeeklyReport() {
  const [report, setReport] = useState<IWeeklyReport>(MOCK_DATA);

  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        <h2 className="text-2xl font-semibold">Weekly Progress Report</h2>

        {/* Mood Chart */}
        <div className="h-64">
          <h3 className="text-lg font-semibold mb-4">Mood Trends</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={report.moodSummary.weeklyTrends}>
              <XAxis 
                dataKey="date" 
                tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}
              />
              <YAxis domain={[1, 5]} />
              <Tooltip 
                labelFormatter={(date) => new Date(date).toLocaleDateString()}
                formatter={(value) => [`Mood: ${value}`, '']}
              />
              <Line 
                type="monotone" 
                dataKey="mood" 
                stroke="#8884d8" 
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Common Triggers */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Common Triggers</h3>
          <div className="flex flex-wrap gap-2">
            {report.moodSummary.commonTriggers.map((trigger, index) => (
              <span key={index} className="bg-muted px-3 py-1 rounded-full text-sm">
                {trigger}
              </span>
            ))}
          </div>
        </div>

        {/* Journal Highlights */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Weekly Highlights</h3>
          <ul className="list-disc pl-5 space-y-1">
            {report.journalHighlights.map((highlight, index) => (
              <li key={index}>{highlight}</li>
            ))}
          </ul>
        </div>

        {/* Progress Bar */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Progress Towards Goals</h3>
          <div className="w-full bg-muted rounded-full h-2.5">
            <div
              className="bg-primary h-2.5 rounded-full transition-all"
              style={{ width: `${report.progressTowardsGoals}%` }}
            />
          </div>
        </div>

        {/* Recommendations */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Focus Areas</h3>
          <ul className="list-disc pl-5 space-y-1">
            {report.recommendedFocus.map((focus, index) => (
              <li key={index}>{focus}</li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
} 