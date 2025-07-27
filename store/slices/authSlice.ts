import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isGuest: boolean;
}

const initialState: AuthState = {
  user: null,
  isLoading: true,
  isGuest: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isLoading = false;
      state.isGuest = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setGuest: (state, action: PayloadAction<boolean>) => {
      state.isGuest = action.payload;
      state.isLoading = false;
    },
    logout: (state) => {
      state.user = null;
      state.isGuest = false;
      state.isLoading = false;
    },
  },
});

export const { setUser, setLoading, setGuest, logout } = authSlice.actions;
export default authSlice.reducer;