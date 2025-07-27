import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import focusSlice from './slices/focusSlice';
import streakSlice from './slices/streakSlice';
import studyPlanSlice from './slices/studyPlanSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    studyPlan: studyPlanSlice,
    focus: focusSlice,
    streak: streakSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;