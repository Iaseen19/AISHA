export interface MoodAnalytics {
  weeklyTrends: Array<{date: Date, mood: number}>;
  commonTriggers: string[];
  recommendedStrategies: string[];
}

export interface BreathingExercise {
  duration: number;
  pattern: {
    inhale: number;
    hold: number;
    exhale: number;
    cycles: number;
  };
  guidedAudio?: string;
}

export interface TherapyGoal {
  description: string;
  targetDate: Date;
  milestones: Array<{
    description: string;
    completed: boolean;
  }>;
  reflections: string[];
}

export interface JournalTemplate {
  category: 'gratitude' | 'reflection' | 'challenge' | 'growth';
  prompts: string[];
  suggestedDuration: number;
  attachments?: File[];
}

export interface TherapyResource {
  type: 'article' | 'video' | 'exercise' | 'worksheet';
  title: string;
  content: string;
  tags: string[];
  recommendedFor: string[];
}

export interface CrisisSupport {
  emergencyContacts: string[];
  helplineNumbers: string[];
  groundingExercises: string[];
  safetyPlan: string;
}

export interface WeeklyReport {
  moodSummary: MoodAnalytics;
  journalHighlights: string[];
  progressTowardsGoals: number;
  recommendedFocus: string[];
} 