import { RootState } from '@/store';
import { startSession } from '@/store/slices/focusSlice';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

export default function Home() {
  const { user, isGuest } = useSelector((state: RootState) => state.auth);
  const { currentStreak, totalSessions } = useSelector((state: RootState) => state.streak);
  const { todaysTasks } = useSelector((state: RootState) => state.studyPlan);
  const dispatch = useDispatch();
  const router = useRouter();

  const completedTasks = todaysTasks.filter(task => task.completed).length;
  const totalTasks = todaysTasks.length;

  const handleQuickFocus = () => {
    dispatch(startSession({ mode: 'pomodoro' }));
    router.push('/focus');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.welcomeText}>
              Welcome back{user?.displayName ? `, ${user.displayName}` : ''}!
            </Text>
            {isGuest && (
              <Text style={styles.guestText}>Guest Mode - Sign up to sync data</Text>
            )}
          </View>
          <TouchableOpacity onPress={() => router.push('/settings')}>
            <Ionicons name="person-circle" size={32} color="#6b7280" />
          </TouchableOpacity>
        </View>

        {/* Streak Card */}
        <View style={styles.streakCard}>
          <View style={styles.streakContent}>
            <View>
              <Text style={styles.streakNumber}>{currentStreak}</Text>
              <Text style={styles.streakLabel}>Day Streak</Text>
            </View>
            <View style={styles.sessionsInfo}>
              <Text style={styles.sessionsNumber}>{totalSessions}</Text>
              <Text style={styles.sessionsLabel}>Total Sessions</Text>
            </View>
          </View>
        </View>

        {/* Today's Progress */}
        <View style={styles.progressCard}>
          <Text style={styles.cardTitle}>Today's Progress</Text>
          <View style={styles.progressInfo}>
            <Text style={styles.progressLabel}>Tasks Completed</Text>
            <Text style={styles.progressValue}>
              {completedTasks}/{totalTasks}
            </Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View 
              style={[
                styles.progressBar,
                { width: totalTasks > 0 ? `${(completedTasks / totalTasks) * 100}%` : '0%' }
              ]}
            />
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.quickFocusButton}
            onPress={handleQuickFocus}
          >
            <View style={styles.quickFocusContent}>
              <View>
                <Text style={styles.quickFocusTitle}>Quick Focus</Text>
                <Text style={styles.quickFocusSubtitle}>Start a 25-minute session</Text>
              </View>
              <Ionicons name="play-circle" size={32} color="white" />
            </View>
          </TouchableOpacity>

          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.push('/plan')}
            >
              <Ionicons name="book" size={24} color="#3b82f6" />
              <Text style={styles.actionButtonText}>Study Plan</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.push('/streak')}
            >
              <Ionicons name="stats-chart" size={24} color="#3b82f6" />
              <Text style={styles.actionButtonText}>Analytics</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Today's Tasks Preview */}
        {todaysTasks.length > 0 && (
          <View style={styles.tasksCard}>
            <Text style={styles.cardTitle}>Today's Tasks</Text>
            {todaysTasks.slice(0, 3).map((task) => (
              <View key={task.id} style={styles.taskItem}>
                <Ionicons 
                  name={task.completed ? "checkmark-circle" : "ellipse-outline"} 
                  size={20} 
                  color={task.completed ? "#10b981" : "#6b7280"} 
                />
                <Text style={[
                  styles.taskText,
                  task.completed && styles.taskTextCompleted
                ]}>
                  {task.title}
                </Text>
              </View>
            ))}
            {todaysTasks.length > 3 && (
              <TouchableOpacity 
                style={styles.viewAllButton}
                onPress={() => router.push('/plan')}
              >
                <Text style={styles.viewAllText}>View all tasks</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  headerText: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  guestText: {
    fontSize: 14,
    color: '#ea580c',
    marginTop: 4,
  },
  streakCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  streakContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  streakNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  streakLabel: {
    color: '#6b7280',
  },
  sessionsInfo: {
    alignItems: 'flex-end',
  },
  sessionsNumber: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  sessionsLabel: {
    color: '#6b7280',
  },
  progressCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressLabel: {
    color: '#6b7280',
  },
  progressValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  progressBarContainer: {
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    height: 8,
  },
  progressBar: {
    backgroundColor: '#2563eb',
    height: 8,
    borderRadius: 4,
  },
  actionsContainer: {
    marginBottom: 24,
  },
  quickFocusButton: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    padding: 24,
    marginBottom: 16,
  },
  quickFocusContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quickFocusTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  quickFocusSubtitle: {
    color: '#bfdbfe',
    marginTop: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  actionButton: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  actionButtonText: {
    color: '#111827',
    fontWeight: '500',
    marginTop: 8,
  },
  tasksCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  taskText: {
    marginLeft: 12,
    flex: 1,
    color: '#111827',
  },
  taskTextCompleted: {
    color: '#6b7280',
    textDecorationLine: 'line-through',
  },
  viewAllButton: {
    marginTop: 8,
  },
  viewAllText: {
    color: '#2563eb',
  },
});