import { store } from '@/store';
import { setLoading } from '@/store/slices/authSlice';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';

function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();

  useEffect(() => {
    // Simulate auth check - set loading to false after a brief delay
    const timer = setTimeout(() => {
      dispatch(setLoading(false));
    }, 1000);

    return () => clearTimeout(timer);
  }, [dispatch]);

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="auth" />
          <Stack.Screen name="focus" />
        </Stack>
        <StatusBar style="auto" />
      </AuthProvider>
    </Provider>
  );
}