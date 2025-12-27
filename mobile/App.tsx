import './global.css';
import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { store } from './src/store';
import RootNavigator from './src/navigation/RootNavigator';
import { setUser, setLoading, logout } from './src/store/authSlice';
import { firebaseAuth, firestoreDB } from './src/services/firebase';

function AppContent(): React.JSX.Element {
  useEffect(() => {
    // Listen to Firebase Auth state changes
    const unsubscribe = firebaseAuth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Get user data from Firestore
          const userData = await firestoreDB.users.get(firebaseUser.uid);
          if (userData) {
            store.dispatch(setUser(userData));
          } else {
            // User exists in Auth but not in Firestore
            const newUser = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
              subjects: [],
              examDates: [],
              dailyAvailability: 4,
              studyStyle: 'pomodoro' as const,
              onboardingComplete: false,
              createdAt: new Date().toISOString(),
            };
            store.dispatch(setUser(newUser));
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          store.dispatch(setLoading(false));
        }
      } else {
        store.dispatch(logout());
      }
      store.dispatch(setLoading(false));
    });

    return () => unsubscribe();
  }, []);

  return <RootNavigator />;
}

function App(): React.JSX.Element {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Provider store={store}>
          <AppContent />
        </Provider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default App;
