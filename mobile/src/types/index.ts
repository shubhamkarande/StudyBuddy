// Types for StudyBuddy app

// User types
export interface User {
    uid: string;
    email: string;
    displayName?: string;
    photoURL?: string;
    subjects: string[];
    examDates: ExamDate[];
    dailyAvailability: number;
    studyStyle: 'pomodoro' | 'deep_work' | 'mixed';
    onboardingComplete: boolean;
    createdAt: string;
}

export interface ExamDate {
    subject: string;
    date: string;
    name: string;
}

// Study session types
export type SessionType = 'reading' | 'practice' | 'revision' | 'writing';
export type SessionStatus = 'scheduled' | 'completed' | 'missed' | 'in_progress';

export interface StudySession {
    id: string;
    userId: string;
    subject: string;
    type: SessionType;
    plannedMinutes: number;
    completedMinutes: number;
    date: string;
    startTime: string;
    endTime: string;
    status: SessionStatus;
    notes?: string;
}

export interface StudyPlan {
    userId: string;
    sessions: StudySession[];
    createdAt: string;
    examDate: string;
    totalPlannedHours: number;
}

// Focus mode types
export interface FocusSession {
    sessionId: string;
    subject: string;
    startedAt: string;
    targetMinutes: number;
    elapsedSeconds: number;
    isActive: boolean;
    isPaused: boolean;
}

// Streak types
export interface Streak {
    userId: string;
    current: number;
    longest: number;
    lastActiveDate: string;
}

// Stats types
export interface WeeklyStats {
    totalMinutes: number;
    totalHours: number;
    sessionsCompleted: number;
    averageSessionLength: number;
    dailyBreakdown: Record<string, number>;
    focusScore: number;
    streak: Streak;
}

export interface SubjectStats {
    name: string;
    totalMinutes: number;
    totalHours: number;
    sessions: number;
    types: Record<SessionType, number>;
    percentageOfTotal: number;
}

// Insights types
export interface StudyInsight {
    type: 'strength' | 'improvement' | 'tip' | 'encouragement';
    title: string;
    message: string;
    icon: string;
}

export type RootStackParamList = {
    Auth: undefined;
    Onboarding: undefined;
    Main: undefined;
    Login: undefined;
    Register: undefined;
    SubjectSelection: undefined;
    ExamDates: undefined;
    Availability: undefined;
    PlanSummary: undefined;
    Settings: undefined;
    SessionDetail: { sessionId: string };
    Focus: { sessionId?: string };
};

export type MainTabParamList = {
    Home: undefined;
    Focus: undefined;
    Progress: undefined;
    Insights: undefined;
};

// Onboarding state
export interface OnboardingState {
    step: number;
    subjects: string[];
    examDate: string | null;
    dailyHours: number;
    studyStyle: 'pomodoro' | 'deep_work' | 'mixed';
}

// Available subjects list
export const AVAILABLE_SUBJECTS = [
    { id: 'math', name: 'Mathematics', icon: '📐' },
    { id: 'physics', name: 'Physics', icon: '⚛️' },
    { id: 'chemistry', name: 'Chemistry', icon: '🧪' },
    { id: 'biology', name: 'Biology', icon: '🧬' },
    { id: 'history', name: 'History', icon: '📜' },
    { id: 'literature', name: 'Literature', icon: '📚' },
    { id: 'cs', name: 'Computer Science', icon: '💻' },
    { id: 'economics', name: 'Economics', icon: '📊' },
    { id: 'psychology', name: 'Psychology', icon: '🧠' },
    { id: 'languages', name: 'Languages', icon: '🌍' },
] as const;
