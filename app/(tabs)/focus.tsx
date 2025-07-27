import { RootState } from '@/store';
import { startSession } from '@/store/slices/focusSlice';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

export default function Focus() {
  const { currentSession } = useSelector((state: RootState) => state.focus);
  const { settings } = useSelector((state: RootState) => state.focus);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleStartSession = (mode: 'pomodoro' | 'deep' | 'custom') => {
    dispatch(startSession({ mode }));
    router.push('/focus');
  };

  if (currentSession) {
    // If there's an active session, redirect to the full focus screen
    router.push('/focus');
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Ionicons name="timer-outline" size={80} color="#3b82f6" />
          <Text style={styles.title}>Focus Mode</Text>
          <Text style={styles.subtitle}>
            Choose your focus session type and start concentrating
          </Text>
        </View>

        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={[styles.optionButton, styles.pomodoroButton]}
            onPress={() => handleStartSession('pomodoro')}
          >
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>Pomodoro</Text>
              <Text style={styles.optionSubtitle}>25 minutes focus</Text>
            </View>
            <Ionicons name="play-circle" size={32} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.optionButton, styles.deepButton]}
            onPress={() => handleStartSession('deep')}
          >
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>Deep Focus</Text>
              <Text style={styles.optionSubtitle}>52 minutes focus</Text>
            </View>
            <Ionicons name="play-circle" size={32} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.optionButton, styles.customButton]}
            onPress={() => handleStartSession('custom')}
          >
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>Custom</Text>
              <Text style={styles.optionSubtitle}>
                {Math.floor(settings.customDuration / 60)} minutes focus
              </Text>
            </View>
            <Ionicons name="play-circle" size={32} color="white" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 16,
  },
  subtitle: {
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 16,
  },
  optionsContainer: {
    width: '100%',
    maxWidth: 300,
    gap: 16,
  },
  optionButton: {
    paddingVertical: 24,
    paddingHorizontal: 24,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pomodoroButton: {
    backgroundColor: '#2563eb',
  },
  deepButton: {
    backgroundColor: '#059669',
  },
  customButton: {
    backgroundColor: '#7c3aed',
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    color: 'white',
    fontWeight: '600',
    fontSize: 18,
  },
  optionSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  backButton: {
    marginTop: 32,
  },
  backText: {
    color: '#6b7280',
  },
});