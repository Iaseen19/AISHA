export interface User {
  id: string;
  email: string;
  name: string;
  role: 'patient' | 'therapist' | 'admin';
  subscriptionTier?: 'free' | 'premium' | 'enterprise';
  language?: string;
  emergencyContacts?: EmergencyContact[];
}

export interface Therapist extends User {
  role: 'therapist';
  specializations: string[];
  availability: Availability[];
  patients: string[]; // User IDs
  rating?: number;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
}

export interface Appointment {
  id: string;
  therapistId: string;
  patientId: string;
  datetime: Date;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  type: 'video' | 'chat' | 'voice';
}

export interface AnalyticsData {
  userId: string;
  sessionDuration: number;
  moodScores: number[];
  interactionCount: number;
  progressMetrics: {
    category: string;
    score: number;
    timestamp: Date;
  }[];
}

export interface CommunityEvent {
  id: string;
  title: string;
  description: string;
  datetime: Date;
  type: 'support_group' | 'workshop' | 'webinar';
  hostId: string;
  participants: string[];
  maxParticipants?: number;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  category: 'article' | 'video' | 'exercise' | 'crisis';
  content: string;
  tags: string[];
  language: string;
}

export interface Availability {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  timezone: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  features: string[];
  maxSessions?: number;
  maxResources?: number;
  includesCommunity: boolean;
  includesAnalytics: boolean;
} 