import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface StudyTask {
  id: string;
  title: string;
  subject: string;
  description: string;
  estimatedTime: number; // in minutes
  completed: boolean;
  date: string;
}

export interface StudyPlan {
  id: string;
  title: string;
  subject: string;
  examDate: string;
  hoursPerDay: number;
  tasks: StudyTask[];
  createdAt: string;
  updatedAt: string;
}

interface StudyPlanState {
  currentPlan: StudyPlan | null;
  plans: StudyPlan[];
  isGenerating: boolean;
  todaysTasks: StudyTask[];
}

const initialState: StudyPlanState = {
  currentPlan: null,
  plans: [],
  isGenerating: false,
  todaysTasks: [],
};

const studyPlanSlice = createSlice({
  name: 'studyPlan',
  initialState,
  reducers: {
    setCurrentPlan: (state, action: PayloadAction<StudyPlan>) => {
      state.currentPlan = action.payload;
      state.todaysTasks = action.payload.tasks.filter(
        task => task.date === new Date().toISOString().split('T')[0]
      );
    },
    setPlans: (state, action: PayloadAction<StudyPlan[]>) => {
      state.plans = action.payload;
    },
    setGenerating: (state, action: PayloadAction<boolean>) => {
      state.isGenerating = action.payload;
    },
    completeTask: (state, action: PayloadAction<string>) => {
      if (state.currentPlan) {
        const task = state.currentPlan.tasks.find(t => t.id === action.payload);
        if (task) {
          task.completed = true;
        }
      }
      const todayTask = state.todaysTasks.find(t => t.id === action.payload);
      if (todayTask) {
        todayTask.completed = true;
      }
    },
    updateTodaysTasks: (state) => {
      if (state.currentPlan) {
        state.todaysTasks = state.currentPlan.tasks.filter(
          task => task.date === new Date().toISOString().split('T')[0]
        );
      }
    },
  },
});

export const { setCurrentPlan, setPlans, setGenerating, completeTask, updateTodaysTasks } = studyPlanSlice.actions;
export default studyPlanSlice.reducer;