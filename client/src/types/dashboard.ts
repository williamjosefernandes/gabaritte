export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  level: number;
  xp: number;
  nextLevelXp: number;
}

export interface StatCardData {
  id: string;
  label: string;
  value: string | number;
  icon: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: string;
}

export interface ScheduleTask {
  id: number;
  subject: string;
  topic: string;
  duration: string;
  status: 'completed' | 'active' | 'pending';
  time: string;
  type?: 'theory' | 'exercise' | 'review';
}

export interface SubjectProgress {
  name: string;
  progress: number;
  color: string;
}

export interface ActivePlan {
  id: number;
  name: string;
  type: string;
  deadline: string;
  dailyGoalHours: number;
  progress: number;
  color: string;
  startDate: string;
  endDate: string;
  subjects: SubjectProgress[];
}

export interface Stats {
  weeklyHours: number[];
  monthlyProgress: number;
  questionsSolved: number;
  accuracy: number;
  streak: number;
}

export interface Activity {
  id: number;
  type: 'study' | 'quiz' | 'plan' | 'achievement';
  title: string;
  time: string;
  duration?: string;
  score?: string;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  color?: string;
}

export interface WeeklyProgressData {
  day: string;
  hours: number;
}

export interface SubjectDistribution {
  subject: string;
  hours: number;
  color: string;
}

export interface AISuggestion {
  id: string;
  type: 'improvement' | 'warning' | 'success';
  title: string;
  description: string;
  icon: string;
}

export interface NotificationItem {
  id: string;
  type: 'reminder' | 'achievement' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}
