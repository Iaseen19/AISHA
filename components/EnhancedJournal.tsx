'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";

const journalTemplates = [
  {
    category: 'gratitude',
    prompts: [
      "What are three things you're grateful for today?",
      "Who has positively impacted your life recently?",
      "What simple pleasure brought you joy today?",
    ],
    suggestedDuration: 10,
  },
  {
    category: 'reflection',
    prompts: [
      "How are you feeling right now, and why?",
      "What challenged you today, and how did you handle it?",
      "What did you learn about yourself today?",
    ],
    suggestedDuration: 15,
  },
  {
    category: 'growth',
    prompts: [
      "What progress have you made towards your goals?",
      "What would you like to improve about yourself?",
      "What steps can you take tomorrow to grow?",
    ],
    suggestedDuration: 20,
  },
];

export function EnhancedJournal() {
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const [entries, setEntries] = useState<Record<string, string>>({});

  const handleEntryChange = (prompt: string, value: string) => {
    setEntries(prev => ({
      ...prev,
      [prompt]: value,
    }));
  };

  const handleSave = () => {
    const savedEntries = localStorage.getItem('journalEntries');
    const existingEntries = savedEntries ? JSON.parse(savedEntries) : [];
    const newEntry = {
      date: new Date().toISOString(),
      entries,
      template: selectedTemplate !== null ? journalTemplates[selectedTemplate].category : null,
    };
    localStorage.setItem('journalEntries', JSON.stringify([...existingEntries, newEntry]));
  };

  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-semibold mb-4">Journal</h2>
          
          {selectedTemplate === null ? (
            <div className="space-y-4">
              <p className="text-muted-foreground">Choose a journaling template:</p>
              <div className="grid grid-cols-1 gap-3">
                {journalTemplates.map((template, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left h-auto p-4"
                      onClick={() => setSelectedTemplate(index)}
                    >
                      <div>
                        <div className="font-medium capitalize">{template.category}</div>
                        <div className="text-sm text-muted-foreground">
                          {template.suggestedDuration} minutes • {template.prompts.length} prompts
                        </div>
                      </div>
                    </Button>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium capitalize">
                  {journalTemplates[selectedTemplate].category} Journal
                </h3>
                <Button
                  variant="ghost"
                  onClick={() => setSelectedTemplate(null)}
                >
                  Change Template
                </Button>
              </div>

              {journalTemplates[selectedTemplate].prompts.map((prompt, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="space-y-2"
                >
                  <label className="font-medium">{prompt}</label>
                  <Textarea
                    value={entries[prompt] || ''}
                    onChange={(e) => handleEntryChange(prompt, e.target.value)}
                    placeholder="Start writing..."
                    className="min-h-[100px] resize-none"
                  />
                </motion.div>
              ))}

              <div className="flex justify-end">
                <Button onClick={handleSave}>
                  Save Entry
                </Button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </CardContent>
    </Card>
  );
} 