import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface DailyStats {
  date: string;
  sessionsCompleted: number;
  totalFocusTime: number; // in minutes
  tasksCompleted: number;
  streakMaintained: boolean;
}

interface StreakState {
  currentStreak: number;
  longestStreak: number;
  totalSessions: number;
  totalFocusTime: number; // in minutes
  dailyStats: DailyStats[];
  lastSessionDate: string | null;
}

const initialState: StreakState = {
  currentStreak: 0,
  longestStreak: 0,
  totalSessions: 0,
  totalFocusTime: 0,
  dailyStats: [],
  lastSessionDate: null,
};

const streakSlice = createSlice({
  name: 'streak',
  initialState,
  reducers: {
    recordSession: (state, action: PayloadAction<{ duration: number; date: string }>) => {
      const { duration, date } = action.payload;
      const today = new Date().toISOString().split('T')[0];
      
      // Update total stats
      state.totalSessions += 1;
      state.totalFocusTime += Math.floor(duration / 60);
      
      // Find or create today's stats
      let todayStats = state.dailyStats.find(stat => stat.date === today);
      if (!todayStats) {
        todayStats = {
          date: today,
          sessionsCompleted: 0,
          totalFocusTime: 0,
          tasksCompleted: 0,
          streakMaintained: false,
        };
        state.dailyStats.push(todayStats);
      }
      
      todayStats.sessionsCompleted += 1;
      todayStats.totalFocusTime += Math.floor(duration / 60);
      
      // Check streak logic
      if (state.lastSessionDate) {
        const lastDate = new Date(state.lastSessionDate);
        const currentDate = new Date(today);
        const daysDiff = Math.floor((currentDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysDiff === 1) {
          // Consecutive day
          state.currentStreak += 1;
          todayStats.streakMaintained = true;
        } else if (daysDiff > 1) {
          // Streak broken
          state.currentStreak = 1;
          todayStats.streakMaintained = true;
        }
        // Same day doesn't change streak
      } else {
        // First session ever
        state.currentStreak = 1;
        todayStats.streakMaintained = true;
      }
      
      state.lastSessionDate = today;
      
      // Update longest streak
      if (state.currentStreak > state.longestStreak) {
        state.longestStreak = state.currentStreak;
      }
    },
    recordTaskCompletion: (state, action: PayloadAction<string>) => {
      const today = action.payload;
      let todayStats = state.dailyStats.find(stat => stat.date === today);
      if (!todayStats) {
        todayStats = {
          date: today,
          sessionsCompleted: 0,
          totalFocusTime: 0,
          tasksCompleted: 0,
          streakMaintained: false,
        };
        state.dailyStats.push(todayStats);
      }
      todayStats.tasksCompleted += 1;
    },
    resetStreak: (state) => {
      state.currentStreak = 0;
    },
  },
});

export const { recordSession, recordTaskCompletion, resetStreak } = streakSlice.actions;
export default streakSlice.reducer;