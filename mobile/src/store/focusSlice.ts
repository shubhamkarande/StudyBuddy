import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FocusSession } from '../types';

interface FocusState {
    currentSession: FocusSession | null;
    isActive: boolean;
    isPaused: boolean;
    elapsedSeconds: number;
    totalFocusToday: number;
    completedSessionsToday: number;
}

const initialState: FocusState = {
    currentSession: null,
    isActive: false,
    isPaused: false,
    elapsedSeconds: 0,
    totalFocusToday: 0,
    completedSessionsToday: 0,
};

const focusSlice = createSlice({
    name: 'focus',
    initialState,
    reducers: {
        startFocus: (state, action: PayloadAction<FocusSession>) => {
            state.currentSession = action.payload;
            state.isActive = true;
            state.isPaused = false;
            state.elapsedSeconds = 0;
        },
        pauseFocus: (state) => {
            state.isPaused = true;
            if (state.currentSession) {
                state.currentSession.isPaused = true;
            }
        },
        resumeFocus: (state) => {
            state.isPaused = false;
            if (state.currentSession) {
                state.currentSession.isPaused = false;
            }
        },
        updateElapsedTime: (state, action: PayloadAction<number>) => {
            state.elapsedSeconds = action.payload;
            if (state.currentSession) {
                state.currentSession.elapsedSeconds = action.payload;
            }
        },
        tick: (state) => {
            if (state.isActive && !state.isPaused) {
                state.elapsedSeconds += 1;
                if (state.currentSession) {
                    state.currentSession.elapsedSeconds += 1;
                }
            }
        },
        endFocus: (state, action: PayloadAction<{ completed: boolean }>) => {
            if (state.currentSession && action.payload.completed) {
                state.totalFocusToday += state.elapsedSeconds;
                state.completedSessionsToday += 1;
            }
            state.currentSession = null;
            state.isActive = false;
            state.isPaused = false;
            state.elapsedSeconds = 0;
        },
        resetDailyStats: (state) => {
            state.totalFocusToday = 0;
            state.completedSessionsToday = 0;
        },
        setTotalFocusToday: (state, action: PayloadAction<number>) => {
            state.totalFocusToday = action.payload;
        },
        setCompletedSessionsToday: (state, action: PayloadAction<number>) => {
            state.completedSessionsToday = action.payload;
        },
    },
});

export const {
    startFocus,
    pauseFocus,
    resumeFocus,
    updateElapsedTime,
    tick,
    endFocus,
    resetDailyStats,
    setTotalFocusToday,
    setCompletedSessionsToday,
} = focusSlice.actions;

export default focusSlice.reducer;
