'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Plus, Save, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface SafetyPlanData {
  warningSignals: string[];
  copingStrategies: string[];
  supportContacts: Array<{
    name: string;
    relationship: string;
    contact: string;
  }>;
  safeEnvironments: string[];
  reasons: string[];
  professionalHelp: Array<{
    name: string;
    type: string;
    contact: string;
  }>;
}

const defaultSafetyPlan: SafetyPlanData = {
  warningSignals: [''],
  copingStrategies: [''],
  supportContacts: [{ name: '', relationship: '', contact: '' }],
  safeEnvironments: [''],
  reasons: [''],
  professionalHelp: [{ name: '', type: '', contact: '' }],
};

export function SafetyPlan() {
  const [plan, setPlan] = useState<SafetyPlanData>(() => {
    const saved = localStorage.getItem('safetyPlan');
    return saved ? JSON.parse(saved) : defaultSafetyPlan;
  });

  const handleAddItem = (key: keyof SafetyPlanData) => {
    setPlan(prev => {
      const updated = { ...prev };
      if (Array.isArray(updated[key])) {
        if (typeof updated[key][0] === 'string') {
          (updated[key] as string[]).push('');
        } else {
          if (key === 'supportContacts') {
            (updated.supportContacts).push({ name: '', relationship: '', contact: '' });
          } else if (key === 'professionalHelp') {
            (updated.professionalHelp).push({ name: '', type: '', contact: '' });
          }
        }
      }
      return updated;
    });
  };

  const handleRemoveItem = (key: keyof SafetyPlanData, index: number) => {
    setPlan(prev => {
      const updated = { ...prev };
      if (Array.isArray(updated[key]) && updated[key].length > 1) {
        (updated[key] as any[]).splice(index, 1);
      }
      return updated;
    });
  };

  const handleUpdateItem = (key: keyof SafetyPlanData, index: number, value: any) => {
    setPlan(prev => {
      const updated = { ...prev };
      if (Array.isArray(updated[key])) {
        (updated[key] as any[])[index] = value;
      }
      return updated;
    });
  };

  const handleSave = () => {
    localStorage.setItem('safetyPlan', JSON.stringify(plan));
    toast.success('Safety plan saved successfully');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Warning Signals</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {plan.warningSignals.map((signal, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={signal}
                onChange={(e) => handleUpdateItem('warningSignals', index, e.target.value)}
                placeholder="Enter a warning signal..."
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveItem('warningSignals', index)}
                disabled={plan.warningSignals.length === 1}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            onClick={() => handleAddItem('warningSignals')}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Warning Signal
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Support Contacts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {plan.supportContacts.map((contact, index) => (
            <div key={index} className="space-y-4 p-4 border rounded-lg">
              <div className="flex justify-between items-start">
                <div className="space-y-2 flex-1">
                  <Label>Name</Label>
                  <Input
                    value={contact.name}
                    onChange={(e) => handleUpdateItem('supportContacts', index, { ...contact, name: e.target.value })}
                    placeholder="Contact name..."
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveItem('supportContacts', index)}
                  disabled={plan.supportContacts.length === 1}
                  className="ml-2"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Relationship</Label>
                  <Input
                    value={contact.relationship}
                    onChange={(e) => handleUpdateItem('supportContacts', index, { ...contact, relationship: e.target.value })}
                    placeholder="Relationship..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Contact Info</Label>
                  <Input
                    value={contact.contact}
                    onChange={(e) => handleUpdateItem('supportContacts', index, { ...contact, contact: e.target.value })}
                    placeholder="Phone or email..."
                  />
                </div>
              </div>
            </div>
          ))}
          <Button
            variant="outline"
            onClick={() => handleAddItem('supportContacts')}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Support Contact
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Coping Strategies</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {plan.copingStrategies.map((strategy, index) => (
            <div key={index} className="flex gap-2">
              <Textarea
                value={strategy}
                onChange={(e) => handleUpdateItem('copingStrategies', index, e.target.value)}
                placeholder="Enter a coping strategy..."
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveItem('copingStrategies', index)}
                disabled={plan.copingStrategies.length === 1}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            onClick={() => handleAddItem('copingStrategies')}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Coping Strategy
          </Button>
        </CardContent>
      </Card>

      <Button onClick={handleSave} className="w-full">
        <Save className="h-4 w-4 mr-2" />
        Save Safety Plan
      </Button>
    </div>
  );
} 