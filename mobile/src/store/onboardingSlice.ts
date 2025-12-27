import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { OnboardingState } from '../types';

const initialState: OnboardingState = {
    step: 1,
    subjects: [],
    examDate: null,
    dailyHours: 4,
    studyStyle: 'pomodoro',
};

const onboardingSlice = createSlice({
    name: 'onboarding',
    initialState,
    reducers: {
        setStep: (state, action: PayloadAction<number>) => {
            state.step = action.payload;
        },
        nextStep: (state) => {
            state.step = Math.min(state.step + 1, 5);
        },
        prevStep: (state) => {
            state.step = Math.max(state.step - 1, 1);
        },
        setSubjects: (state, action: PayloadAction<string[]>) => {
            state.subjects = action.payload;
        },
        toggleSubject: (state, action: PayloadAction<string>) => {
            const subject = action.payload;
            if (state.subjects.includes(subject)) {
                state.subjects = state.subjects.filter(s => s !== subject);
            } else {
                state.subjects.push(subject);
            }
        },
        setExamDate: (state, action: PayloadAction<string>) => {
            state.examDate = action.payload;
        },
        setDailyHours: (state, action: PayloadAction<number>) => {
            state.dailyHours = action.payload;
        },
        setStudyStyle: (state, action: PayloadAction<'pomodoro' | 'deep_work' | 'mixed'>) => {
            state.studyStyle = action.payload;
        },
        resetOnboarding: () => initialState,
    },
});

export const {
    setStep,
    nextStep,
    prevStep,
    setSubjects,
    toggleSubject,
    setExamDate,
    setDailyHours,
    setStudyStyle,
    resetOnboarding,
} = onboardingSlice.actions;

export default onboardingSlice.reducer;
