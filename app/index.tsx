import { RootState } from '@/store';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';

export default function Index() {
  const { user, isLoading, isGuest } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (user || isGuest) {
        router.replace('/(tabs)');
      } else {
        router.replace('/auth');
      }
    }
  }, [user, isLoading, isGuest, router]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>StudyBuddy</Text>
      <Text style={styles.subtitle}>Focus. Plan. Succeed.</Text>
      <ActivityIndicator size="large" color="#3b82f6" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 16,
  },
  subtitle: {
    color: '#6b7280',
    marginBottom: 32,
  },
});