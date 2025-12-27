import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Streak } from '../types';

interface StreakState {
    current: number;
    longest: number;
    lastActiveDate: string | null;
    isLoading: boolean;
}

const initialState: StreakState = {
    current: 0,
    longest: 0,
    lastActiveDate: null,
    isLoading: false,
};

const streakSlice = createSlice({
    name: 'streak',
    initialState,
    reducers: {
        setStreak: (state, action: PayloadAction<Streak>) => {
            state.current = action.payload.current;
            state.longest = action.payload.longest;
            state.lastActiveDate = action.payload.lastActiveDate;
            state.isLoading = false;
        },
        incrementStreak: (state) => {
            const today = new Date().toISOString().split('T')[0];
            const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

            // Only increment if not already active today
            if (state.lastActiveDate !== today) {
                // Check if streak continues from yesterday
                if (state.lastActiveDate === yesterday) {
                    state.current += 1;
                } else {
                    // Streak broken, start fresh
                    state.current = 1;
                }

                state.lastActiveDate = today;

                // Update longest if current beat it
                if (state.current > state.longest) {
                    state.longest = state.current;
                }
            }
        },
        resetStreak: (state) => {
            state.current = 0;
            state.lastActiveDate = null;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
    },
});

export const { setStreak, incrementStreak, resetStreak, setLoading } = streakSlice.actions;
export default streakSlice.reducer;
