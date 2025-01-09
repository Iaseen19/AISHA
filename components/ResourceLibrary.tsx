'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { TherapyResource } from '@/types/therapy';

const INITIAL_RESOURCES: TherapyResource[] = [
  {
    type: 'article',
    title: 'Understanding Anxiety',
    content: 'Comprehensive guide to anxiety management and coping strategies...',
    tags: ['anxiety', 'mental health', 'self-help'],
    recommendedFor: ['anxiety', 'stress'],
  },
  {
    type: 'exercise',
    title: 'Mindfulness Meditation',
    content: 'A 10-minute guided mindfulness meditation practice...',
    tags: ['meditation', 'mindfulness', 'relaxation'],
    recommendedFor: ['stress', 'anxiety', 'depression'],
  },
  // Add more resources as needed
];

export function ResourceLibrary() {
  const [resources] = useState<TherapyResource[]>(INITIAL_RESOURCES);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = selectedType === 'all' || resource.type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <h2 className="text-2xl font-semibold">Resource Library</h2>
        
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="border rounded-md px-3 py-2"
            >
              <option value="all">All Types</option>
              <option value="article">Articles</option>
              <option value="video">Videos</option>
              <option value="exercise">Exercises</option>
              <option value="worksheet">Worksheets</option>
            </select>
          </div>

          <div className="grid gap-4">
            {filteredResources.map((resource, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">{resource.title}</h3>
                    <span className="text-sm text-muted-foreground capitalize">
                      {resource.type}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {resource.content.substring(0, 100)}...
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {resource.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="text-xs bg-muted px-2 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
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