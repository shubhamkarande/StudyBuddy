import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type FocusMode = 'pomodoro' | 'deep' | 'custom';
export type SessionStatus = 'idle' | 'running' | 'paused' | 'completed';

export interface FocusSession {
  id: string;
  duration: number; // in seconds
  mode: FocusMode;
  startTime: string;
  endTime?: string;
  completed: boolean;
  subject?: string;
}

interface FocusState {
  currentSession: FocusSession | null;
  timeRemaining: number; // in seconds
  status: SessionStatus;
  sessions: FocusSession[];
  settings: {
    pomodoroWork: number; // 25 minutes default
    pomodoroBreak: number; // 5 minutes default
    deepFocus: number; // 52 minutes default
    customDuration: number; // user defined
    soundEnabled: boolean;
    ambientSound: 'rain' | 'cafe' | 'silence';
  };
}

const initialState: FocusState = {
  currentSession: null,
  timeRemaining: 0,
  status: 'idle',
  sessions: [],
  settings: {
    pomodoroWork: 25 * 60,
    pomodoroBreak: 5 * 60,
    deepFocus: 52 * 60,
    customDuration: 30 * 60,
    soundEnabled: true,
    ambientSound: 'silence',
  },
};

const focusSlice = createSlice({
  name: 'focus',
  initialState,
  reducers: {
    startSession: (state, action: PayloadAction<{ mode: FocusMode; subject?: string }>) => {
      const { mode, subject } = action.payload;
      let duration: number;
      
      switch (mode) {
        case 'pomodoro':
          duration = state.settings.pomodoroWork;
          break;
        case 'deep':
          duration = state.settings.deepFocus;
          break;
        case 'custom':
          duration = state.settings.customDuration;
          break;
      }

      state.currentSession = {
        id: Date.now().toString(),
        duration,
        mode,
        startTime: new Date().toISOString(),
        completed: false,
        subject,
      };
      state.timeRemaining = duration;
      state.status = 'running';
    },
    pauseSession: (state) => {
      state.status = 'paused';
    },
    resumeSession: (state) => {
      state.status = 'running';
    },
    tick: (state) => {
      if (state.status === 'running' && state.timeRemaining > 0) {
        state.timeRemaining -= 1;
        if (state.timeRemaining === 0) {
          state.status = 'completed';
          if (state.currentSession) {
            state.currentSession.completed = true;
            state.currentSession.endTime = new Date().toISOString();
            state.sessions.push(state.currentSession);
          }
        }
      }
    },
    endSession: (state) => {
      if (state.currentSession) {
        state.currentSession.endTime = new Date().toISOString();
        state.sessions.push(state.currentSession);
      }
      state.currentSession = null;
      state.timeRemaining = 0;
      state.status = 'idle';
    },
    updateSettings: (state, action: PayloadAction<Partial<FocusState['settings']>>) => {
      state.settings = { ...state.settings, ...action.payload };
    },
  },
});

export const { startSession, pauseSession, resumeSession, tick, endSession, updateSettings } = focusSlice.actions;
export default focusSlice.reducer;