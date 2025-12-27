import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { StudySession, StudyPlan } from '../types';

interface PlannerState {
    sessions: StudySession[];
    todaySessions: StudySession[];
    selectedDate: string;
    isLoading: boolean;
    error: string | null;
    lastUpdated: string | null;
}

const initialState: PlannerState = {
    sessions: [],
    todaySessions: [],
    selectedDate: new Date().toISOString().split('T')[0],
    isLoading: false,
    error: null,
    lastUpdated: null,
};

const plannerSlice = createSlice({
    name: 'planner',
    initialState,
    reducers: {
        setPlan: (state, action: PayloadAction<StudyPlan>) => {
            state.sessions = action.payload.sessions;
            state.lastUpdated = new Date().toISOString();
            state.isLoading = false;
            // Update today's sessions
            const today = new Date().toISOString().split('T')[0];
            state.todaySessions = action.payload.sessions.filter(s => s.date === today);
        },
        setSessions: (state, action: PayloadAction<StudySession[]>) => {
            state.sessions = action.payload;
            state.isLoading = false;
            // Update today's sessions
            const today = new Date().toISOString().split('T')[0];
            state.todaySessions = action.payload.filter(s => s.date === today);
        },
        addSession: (state, action: PayloadAction<StudySession>) => {
            state.sessions.push(action.payload);
            const today = new Date().toISOString().split('T')[0];
            if (action.payload.date === today) {
                state.todaySessions.push(action.payload);
            }
        },
        updateSession: (state, action: PayloadAction<{ id: string; updates: Partial<StudySession> }>) => {
            const { id, updates } = action.payload;
            const sessionIndex = state.sessions.findIndex(s => s.id === id);
            if (sessionIndex !== -1) {
                state.sessions[sessionIndex] = { ...state.sessions[sessionIndex], ...updates };
            }
            const todayIndex = state.todaySessions.findIndex(s => s.id === id);
            if (todayIndex !== -1) {
                state.todaySessions[todayIndex] = { ...state.todaySessions[todayIndex], ...updates };
            }
        },
        removeSession: (state, action: PayloadAction<string>) => {
            state.sessions = state.sessions.filter(s => s.id !== action.payload);
            state.todaySessions = state.todaySessions.filter(s => s.id !== action.payload);
        },
        setSelectedDate: (state, action: PayloadAction<string>) => {
            state.selectedDate = action.payload;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
            state.isLoading = false;
        },
        markSessionComplete: (state, action: PayloadAction<{ id: string; completedMinutes: number }>) => {
            const { id, completedMinutes } = action.payload;
            const sessionIndex = state.sessions.findIndex(s => s.id === id);
            if (sessionIndex !== -1) {
                state.sessions[sessionIndex].status = 'completed';
                state.sessions[sessionIndex].completedMinutes = completedMinutes;
            }
            const todayIndex = state.todaySessions.findIndex(s => s.id === id);
            if (todayIndex !== -1) {
                state.todaySessions[todayIndex].status = 'completed';
                state.todaySessions[todayIndex].completedMinutes = completedMinutes;
            }
        },
        markSessionMissed: (state, action: PayloadAction<string>) => {
            const sessionIndex = state.sessions.findIndex(s => s.id === action.payload);
            if (sessionIndex !== -1) {
                state.sessions[sessionIndex].status = 'missed';
            }
            const todayIndex = state.todaySessions.findIndex(s => s.id === action.payload);
            if (todayIndex !== -1) {
                state.todaySessions[todayIndex].status = 'missed';
            }
        },
    },
});

export const {
    setPlan,
    setSessions,
    addSession,
    updateSession,
    removeSession,
    setSelectedDate,
    setLoading,
    setError,
    markSessionComplete,
    markSessionMissed,
} = plannerSlice.actions;

export default plannerSlice.reducer;
