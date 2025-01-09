'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Plus, Save, Trash2, FileText, Link as LinkIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

type ResourceType = 'article' | 'video' | 'exercise' | 'link';
type FilterType = ResourceType | 'all';

interface Resource {
  id: string;
  title: string;
  description: string;
  type: ResourceType;
  content: string;
  tags: string[];
  dateAdded: string;
}

export function ResourceManagement() {
  const [resources, setResources] = useState<Resource[]>(() => {
    const saved = localStorage.getItem('resources');
    return saved ? JSON.parse(saved) : [];
  });
  const [newResource, setNewResource] = useState<Partial<Resource>>({
    type: 'article',
    tags: [],
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<FilterType>('all');

  const handleAddResource = () => {
    if (!newResource.title || !newResource.content) {
      toast.error('Please fill in all required fields');
      return;
    }

    const resource: Resource = {
      id: Date.now().toString(),
      title: newResource.title!,
      description: newResource.description || '',
      type: newResource.type as Resource['type'],
      content: newResource.content!,
      tags: newResource.tags || [],
      dateAdded: new Date().toISOString(),
    };

    setResources(prev => [...prev, resource]);
    localStorage.setItem('resources', JSON.stringify([...resources, resource]));
    setNewResource({ type: 'article', tags: [] });
    toast.success('Resource added successfully');
  };

  const handleDeleteResource = (id: string) => {
    setResources(prev => {
      const updated = prev.filter(r => r.id !== id);
      localStorage.setItem('resources', JSON.stringify(updated));
      return updated;
    });
    toast.success('Resource deleted successfully');
  };

  const filteredResources = resources.filter(resource => 
    (resource.type === selectedType || selectedType === 'all') &&
    (resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
     resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
     resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Resource</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={newResource.title || ''}
              onChange={(e) => setNewResource(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter resource title..."
            />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={newResource.description || ''}
              onChange={(e) => setNewResource(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter resource description..."
            />
          </div>

          <div className="space-y-2">
            <Label>Type</Label>
            <select
              className="w-full p-2 border rounded-md"
              value={newResource.type}
              onChange={(e) => setNewResource(prev => ({ ...prev, type: e.target.value as Resource['type'] }))}
            >
              <option value="article">Article</option>
              <option value="video">Video</option>
              <option value="exercise">Exercise</option>
              <option value="link">Link</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label>Content</Label>
            <Textarea
              value={newResource.content || ''}
              onChange={(e) => setNewResource(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Enter resource content or URL..."
            />
          </div>

          <div className="space-y-2">
            <Label>Tags (comma-separated)</Label>
            <Input
              value={newResource.tags?.join(', ') || ''}
              onChange={(e) => setNewResource(prev => ({ 
                ...prev, 
                tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
              }))}
              placeholder="Enter tags..."
            />
          </div>

          <Button onClick={handleAddResource} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Resource
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Resource Library</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search resources..."
              className="flex-1"
            />
            <select
              className="p-2 border rounded-md"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as Resource['type'])}
            >
              <option value="all">All Types</option>
              <option value="article">Articles</option>
              <option value="video">Videos</option>
              <option value="exercise">Exercises</option>
              <option value="link">Links</option>
            </select>
          </div>

          <div className="space-y-4">
            {filteredResources.map(resource => (
              <Card key={resource.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        {resource.type === 'article' && <FileText className="h-4 w-4" />}
                        {resource.type === 'link' && <LinkIcon className="h-4 w-4" />}
                        <h3 className="font-medium">{resource.title}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">{resource.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {resource.tags.map(tag => (
                          <span key={tag} className="text-xs bg-muted px-2 py-1 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteResource(resource.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 