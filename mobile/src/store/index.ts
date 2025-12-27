import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import authReducer from './authSlice';
import plannerReducer from './plannerSlice';
import focusReducer from './focusSlice';
import streakReducer from './streakSlice';
import onboardingReducer from './onboardingSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        planner: plannerReducer,
        focus: focusReducer,
        streak: streakReducer,
        onboarding: onboardingReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
            },
        }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
