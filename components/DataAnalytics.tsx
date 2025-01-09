'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Assessment {
  date: string;
  answers: Record<string, number | string>;
  notes: string;
}

interface Interaction {
  date: string;
  type: 'chat' | 'assessment' | 'resource' | 'safety';
  duration: number;
}

interface AnalyticsData {
  assessments: Assessment[];
  interactions: Interaction[];
}

export function DataAnalytics() {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');
  const [data, setData] = useState<AnalyticsData>({
    assessments: [],
    interactions: []
  });

  useEffect(() => {
    // Load data from localStorage
    const assessments = JSON.parse(localStorage.getItem('assessments') || '[]');
    const interactions = JSON.parse(localStorage.getItem('interactions') || '[]');
    setData({ assessments, interactions });
  }, []);

  const getFilteredData = () => {
    const now = new Date();
    const cutoff = new Date();
    
    switch (timeRange) {
      case 'week':
        cutoff.setDate(now.getDate() - 7);
        break;
      case 'month':
        cutoff.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        cutoff.setFullYear(now.getFullYear() - 1);
        break;
    }

    return {
      assessments: data.assessments.filter(a => new Date(a.date) >= cutoff),
      interactions: data.interactions.filter(i => new Date(i.date) >= cutoff)
    };
  };

  const getMoodData = () => {
    const filtered = getFilteredData().assessments;
    return filtered.map(assessment => ({
      date: new Date(assessment.date).toLocaleDateString(),
      mood: assessment.answers.mood as number || 0,
      anxiety: assessment.answers.anxiety as number || 0,
      energy: assessment.answers.energy as number || 0
    }));
  };

  const getInteractionData = () => {
    const filtered = getFilteredData().interactions;
    const grouped = filtered.reduce((acc, curr) => {
      const date = new Date(curr.date).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = { date, total: 0 };
      }
      acc[date].total += curr.duration;
      return acc;
    }, {} as Record<string, { date: string; total: number }>);

    return Object.values(grouped);
  };

  const calculateAverages = () => {
    const filtered = getFilteredData().assessments;
    if (filtered.length === 0) return { mood: 0, anxiety: 0, energy: 0 };

    const sums = filtered.reduce((acc, curr) => ({
      mood: acc.mood + (curr.answers.mood as number || 0),
      anxiety: acc.anxiety + (curr.answers.anxiety as number || 0),
      energy: acc.energy + (curr.answers.energy as number || 0)
    }), { mood: 0, anxiety: 0, energy: 0 });

    return {
      mood: Math.round((sums.mood / filtered.length) * 10) / 10,
      anxiety: Math.round((sums.anxiety / filtered.length) * 10) / 10,
      energy: Math.round((sums.energy / filtered.length) * 10) / 10
    };
  };

  const averages = calculateAverages();
  const moodData = getMoodData();
  const interactionData = getInteractionData();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Analytics Dashboard</h2>
        <Select
          value={timeRange}
          onValueChange={(value: 'week' | 'month' | 'year') => setTimeRange(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Past Week</SelectItem>
            <SelectItem value="month">Past Month</SelectItem>
            <SelectItem value="year">Past Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Average Mood</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{averages.mood}</div>
            <p className="text-sm text-muted-foreground">Out of 10</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Average Anxiety</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{averages.anxiety}</div>
            <p className="text-sm text-muted-foreground">Out of 10</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Average Energy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{averages.energy}</div>
            <p className="text-sm text-muted-foreground">Out of 10</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Mood Trends</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={moodData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 10]} />
              <Tooltip />
              <Line type="monotone" dataKey="mood" stroke="#4CAF50" name="Mood" />
              <Line type="monotone" dataKey="anxiety" stroke="#F44336" name="Anxiety" />
              <Line type="monotone" dataKey="energy" stroke="#2196F3" name="Energy" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Interaction Time</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={interactionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="total" stroke="#9C27B0" name="Minutes" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
} 