export interface CoachPersona {
  id: string;
  name: string;
  title: string;
  avatarIcon: string;
  badge: string;
  tagline: string;
  systemInstruction: string;
  promptStarters: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: number;
  modelUsed?: string;
  personaId?: string;
}

export interface EvidenceEntry {
  id: string;
  title: string;
  category: 'win' | 'courage' | 'resilience' | 'kindness' | 'growth';
  description: string;
  date: string;
  strengthTag: string;
}

export interface LimitingBelief {
  id: string;
  originalThought: string;
  situation?: string;
  identifiedTrap: string;
  compassionateValidation: string;
  counterEvidenceQuestions: string[];
  empoweredReframe: string;
  microActionStep: string;
  actionCompleted: boolean;
  createdAt: string;
}

export interface LifeQualityPillar {
  id: string;
  name: string;
  score: number; // 1 to 10
  description: string;
  iconName: string;
  color: string;
  boostPlan?: {
    quickWin: string;
    dailyRitual: string;
    mindsetShift: string;
    reflectionPrompt: string;
  };
}

export interface DailyRitual {
  id: string;
  title: string;
  category: 'belief' | 'vitality' | 'focus' | 'gratitude';
  streak: number;
  completedToday: boolean;
  lastCompletedDate?: string;
}

export interface UserStats {
  beliefsReframed: number;
  evidenceItemsCount: number;
  completedRitualsCount: number;
  currentStreakDays: number;
  lifeQualityScore: number;
}

export interface LifeQualityCheckpoint {
  id: string;
  date: string;
  overallScore: number; // 0 - 100
  pillars: Record<string, number>; // e.g. { mindset: 7, vitality: 6, ... }
  reflectionNote?: string;
}

