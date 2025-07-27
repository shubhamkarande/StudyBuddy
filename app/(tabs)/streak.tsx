import { RootState } from '@/store';
import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';

export default function Streak() {
  const { currentStreak, longestStreak, totalSessions, totalFocusTime, dailyStats } = useSelector(
    (state: RootState) => state.streak
  );

  const getWeeklyData = () => {
    const today = new Date();
    const weekData = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayStats = dailyStats.find(stat => stat.date === dateStr);
      weekData.push({
        date: dateStr,
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        sessions: dayStats?.sessionsCompleted || 0,
        focusTime: dayStats?.totalFocusTime || 0,
        streakMaintained: dayStats?.streakMaintained || false,
      });
    }
    
    return weekData;
  };

  const weeklyData = getWeeklyData();
  const maxSessions = Math.max(...weeklyData.map(d => d.sessions), 1);

  const getStreakEmoji = (streak: number) => {
    if (streak >= 30) return '🔥';
    if (streak >= 14) return '⚡';
    if (streak >= 7) return '💪';
    if (streak >= 3) return '🌟';
    return '🎯';
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.pageTitle}>Your Progress</Text>

        {/* Streak Cards */}
        <View style={styles.streakCards}>
          <View style={styles.streakCard}>
            <Text style={styles.streakEmoji}>{getStreakEmoji(currentStreak)}</Text>
            <Text style={styles.streakNumber}>{currentStreak}</Text>
            <Text style={styles.streakLabel}>Current Streak</Text>
          </View>
          
          <View style={styles.streakCard}>
            <Text style={styles.streakEmoji}>🏆</Text>
            <Text style={[styles.streakNumber, styles.bestStreakNumber]}>{longestStreak}</Text>
            <Text style={styles.streakLabel}>Best Streak</Text>
          </View>
        </View>

        {/* Stats Overview */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Overview</Text>
          
          <View style={styles.statItem}>
            <View style={styles.statIcon}>
              <Ionicons name="timer" size={20} color="#3b82f6" />
              <Text style={styles.statLabel}>Total Focus Time</Text>
            </View>
            <Text style={styles.statValue}>
              {Math.floor(totalFocusTime / 60)}h {totalFocusTime % 60}m
            </Text>
          </View>

          <View style={styles.statItem}>
            <View style={styles.statIcon}>
              <Ionicons name="checkmark-circle" size={20} color="#10b981" />
              <Text style={styles.statLabel}>Sessions Completed</Text>
            </View>
            <Text style={styles.statValue}>{totalSessions}</Text>
          </View>

          <View style={[styles.statItem, styles.lastStatItem]}>
            <View style={styles.statIcon}>
              <Ionicons name="trending-up" size={20} color="#f59e0b" />
              <Text style={styles.statLabel}>Average per Day</Text>
            </View>
            <Text style={styles.statValue}>
              {dailyStats.length > 0 ? Math.round(totalFocusTime / dailyStats.length) : 0}m
            </Text>
          </View>
        </View>

        {/* Weekly Chart */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>This Week</Text>
          
          <View style={styles.chartContainer}>
            {weeklyData.map((day, index) => (
              <View key={index} style={styles.chartBar}>
                <View 
                  style={[
                    styles.bar,
                    {
                      height: Math.max((day.sessions / maxSessions) * 80, 4),
                      backgroundColor: day.streakMaintained ? '#2563eb' : '#d1d5db',
                    }
                  ]}
                />
                <Text style={styles.chartLabel}>{day.day}</Text>
              </View>
            ))}
          </View>

          <View style={styles.chartFooter}>
            <Text style={styles.chartFooterText}>Sessions per day</Text>
            <Text style={styles.chartFooterText}>Max: {maxSessions}</Text>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Recent Activity</Text>
          
          {dailyStats.slice(-7).reverse().map((stat, index) => (
            <View key={index} style={styles.activityItem}>
              <View style={styles.activityLeft}>
                <View style={[
                  styles.activityDot,
                  { backgroundColor: stat.streakMaintained ? '#10b981' : '#d1d5db' }
                ]} />
                <View>
                  <Text style={styles.activityDate}>
                    {new Date(stat.date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </Text>
                  <Text style={styles.activityDetails}>
                    {stat.sessionsCompleted} sessions • {stat.totalFocusTime}m focus
                  </Text>
                </View>
              </View>
              
              {stat.streakMaintained && (
                <Ionicons name="flame" size={16} color="#f59e0b" />
              )}
            </View>
          ))}

          {dailyStats.length === 0 && (
            <View style={styles.emptyActivity}>
              <Ionicons name="calendar-outline" size={48} color="#6b7280" />
              <Text style={styles.emptyActivityTitle}>No activity yet</Text>
              <Text style={styles.emptyActivitySubtitle}>Complete your first focus session to see stats</Text>
            </View>
          )}
        </View>

        {/* Motivational Section */}
        {currentStreak > 0 && (
          <View style={styles.motivationCard}>
            <Text style={styles.motivationTitle}>Keep it up! 🎉</Text>
            <Text style={styles.motivationText}>
              You're on a {currentStreak}-day streak. 
              {currentStreak < 7 && ` Just ${7 - currentStreak} more days to reach a week!`}
              {currentStreak >= 7 && currentStreak < 30 && ' Amazing consistency!'}
              {currentStreak >= 30 && ' You\'re a focus master!'}
            </Text>
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
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 32,
  },
  streakCards: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  streakCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  streakEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  streakNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  bestStreakNumber: {
    color: '#ea580c',
  },
  streakLabel: {
    color: '#6b7280',
    textAlign: 'center',
  },
  card: {
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
  statItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  lastStatItem: {
    borderBottomWidth: 0,
  },
  statIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statLabel: {
    color: '#374151',
    marginLeft: 12,
  },
  statValue: {
    color: '#111827',
    fontWeight: '600',
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 100,
    marginBottom: 16,
  },
  chartBar: {
    alignItems: 'center',
    flex: 1,
  },
  bar: {
    width: 24,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
    marginBottom: 8,
  },
  chartLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  chartFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  chartFooterText: {
    fontSize: 12,
    color: '#6b7280',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  activityLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  activityDate: {
    color: '#111827',
    fontWeight: '500',
  },
  activityDetails: {
    fontSize: 14,
    color: '#6b7280',
  },
  emptyActivity: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  emptyActivityTitle: {
    color: '#6b7280',
    marginTop: 8,
  },
  emptyActivitySubtitle: {
    color: '#9ca3af',
    fontSize: 14,
  },
  motivationCard: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    padding: 24,
  },
  motivationTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  motivationText: {
    color: '#bfdbfe',
  },
});