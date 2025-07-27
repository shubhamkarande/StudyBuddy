import { RootState } from '@/store';
import { recordTaskCompletion } from '@/store/slices/streakSlice';
import { completeTask, setCurrentPlan, setGenerating } from '@/store/slices/studyPlanSlice';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

export default function Plan() {
  const { currentPlan, todaysTasks, isGenerating } = useSelector((state: RootState) => state.studyPlan);
  const dispatch = useDispatch();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [subject, setSubject] = useState('');
  const [examDate, setExamDate] = useState('');
  const [hoursPerDay, setHoursPerDay] = useState('2');

  const handleCreatePlan = async () => {
    if (!subject || !examDate || !hoursPerDay) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    dispatch(setGenerating(true));
    setShowCreateModal(false);

    // Simulate AI plan generation
    setTimeout(() => {
      const mockPlan = {
        id: Date.now().toString(),
        title: `${subject} Study Plan`,
        subject,
        examDate,
        hoursPerDay: parseInt(hoursPerDay),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tasks: generateMockTasks(subject, examDate, parseInt(hoursPerDay)),
      };

      dispatch(setCurrentPlan(mockPlan));
      dispatch(setGenerating(false));
      
      // Clear form
      setSubject('');
      setExamDate('');
      setHoursPerDay('2');
    }, 2000);
  };

  const generateMockTasks = (subject: string, examDate: string, hoursPerDay: number) => {
    const tasks = [];
    const startDate = new Date();
    const endDate = new Date(examDate);
    const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    const topics = [
      'Introduction and Fundamentals',
      'Core Concepts',
      'Advanced Topics',
      'Practice Problems',
      'Review and Revision',
      'Mock Tests',
      'Final Preparation'
    ];

    for (let day = 0; day < Math.min(daysDiff, 14); day++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + day);
      const dateStr = currentDate.toISOString().split('T')[0];
      
      const topicIndex = Math.floor(day / 2) % topics.length;
      const sessionTime = hoursPerDay * 60; // Convert to minutes
      
      tasks.push({
        id: `${day}-1`,
        title: `${topics[topicIndex]} - Session 1`,
        subject,
        description: `Study ${topics[topicIndex]} for ${Math.floor(sessionTime / 2)} minutes`,
        estimatedTime: Math.floor(sessionTime / 2),
        completed: false,
        date: dateStr,
      });

      if (hoursPerDay >= 2) {
        tasks.push({
          id: `${day}-2`,
          title: `${topics[topicIndex]} - Session 2`,
          subject,
          description: `Continue with ${topics[topicIndex]} for ${Math.ceil(sessionTime / 2)} minutes`,
          estimatedTime: Math.ceil(sessionTime / 2),
          completed: false,
          date: dateStr,
        });
      }
    }

    return tasks;
  };

  const handleCompleteTask = (taskId: string) => {
    dispatch(completeTask(taskId));
    dispatch(recordTaskCompletion(new Date().toISOString().split('T')[0]));
  };

  if (isGenerating) {
    return (
      <View style={styles.loadingContainer}>
        <Ionicons name="sparkles" size={48} color="#3b82f6" />
        <Text style={styles.loadingTitle}>Generating Your Study Plan</Text>
        <Text style={styles.loadingSubtitle}>AI is creating a personalized plan for you...</Text>
      </View>
    );
  }

  if (!currentPlan) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="book-outline" size={64} color="#6b7280" />
        <Text style={styles.emptyTitle}>Create Your Study Plan</Text>
        <Text style={styles.emptySubtitle}>
          Let AI generate a personalized study schedule based on your goals
        </Text>
        
        <TouchableOpacity
          style={styles.getStartedButton}
          onPress={() => setShowCreateModal(true)}
        >
          <Text style={styles.getStartedButtonText}>Get Started</Text>
        </TouchableOpacity>

        <Modal visible={showCreateModal} animationType="slide" presentationStyle="pageSheet">
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create Study Plan</Text>
              <TouchableOpacity onPress={() => setShowCreateModal(false)}>
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              <View style={styles.formContainer}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Subject/Topic</Text>
                  <TextInput
                    style={styles.textInput}
                    value={subject}
                    onChangeText={setSubject}
                    placeholder="e.g., Mathematics, Physics, History"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Exam Date</Text>
                  <TextInput
                    style={styles.textInput}
                    value={examDate}
                    onChangeText={setExamDate}
                    placeholder="YYYY-MM-DD"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Hours per Day</Text>
                  <TextInput
                    style={styles.textInput}
                    value={hoursPerDay}
                    onChangeText={setHoursPerDay}
                    placeholder="2"
                    keyboardType="numeric"
                  />
                </View>

                <TouchableOpacity
                  style={styles.generateButton}
                  onPress={handleCreatePlan}
                >
                  <Text style={styles.generateButtonText}>Generate Plan</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </Modal>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={styles.planTitle}>{currentPlan.title}</Text>
            <Text style={styles.examDate}>Exam: {currentPlan.examDate}</Text>
          </View>
          <TouchableOpacity onPress={() => setShowCreateModal(true)}>
            <Ionicons name="add-circle" size={28} color="#3b82f6" />
          </TouchableOpacity>
        </View>

        {/* Today's Tasks */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Today's Tasks</Text>
          {todaysTasks.length === 0 ? (
            <Text style={styles.emptyTasksText}>No tasks for today</Text>
          ) : (
            todaysTasks.map((task) => (
              <View key={task.id} style={styles.taskItem}>
                <TouchableOpacity onPress={() => handleCompleteTask(task.id)}>
                  <Ionicons 
                    name={task.completed ? "checkmark-circle" : "ellipse-outline"} 
                    size={24} 
                    color={task.completed ? "#10b981" : "#6b7280"} 
                  />
                </TouchableOpacity>
                <View style={styles.taskContent}>
                  <Text style={[
                    styles.taskTitle,
                    task.completed && styles.taskTitleCompleted
                  ]}>
                    {task.title}
                  </Text>
                  <Text style={styles.taskDuration}>{task.estimatedTime} minutes</Text>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Weekly Overview */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>This Week</Text>
          {Array.from({ length: 7 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() + i);
            const dateStr = date.toISOString().split('T')[0];
            const dayTasks = currentPlan.tasks.filter(task => task.date === dateStr);
            const completedCount = dayTasks.filter(task => task.completed).length;
            
            return (
              <View key={i} style={styles.weekItem}>
                <View>
                  <Text style={styles.weekDay}>
                    {date.toLocaleDateString('en-US', { weekday: 'long' })}
                  </Text>
                  <Text style={styles.weekDate}>
                    {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </Text>
                </View>
                <View style={styles.weekProgress}>
                  <Text style={styles.weekTaskCount}>
                    {completedCount}/{dayTasks.length} tasks
                  </Text>
                  <View style={styles.weekProgressBar}>
                    <View 
                      style={[
                        styles.weekProgressFill,
                        { width: dayTasks.length > 0 ? `${(completedCount / dayTasks.length) * 100}%` : '0%' }
                      ]}
                    />
                  </View>
                </View>
              </View>
            );
          })}
        </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  loadingTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginTop: 16,
  },
  loadingSubtitle: {
    color: '#6b7280',
    marginTop: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtitle: {
    color: '#6b7280',
    marginTop: 8,
    textAlign: 'center',
  },
  getStartedButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginTop: 32,
  },
  getStartedButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 18,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalContent: {
    flex: 1,
    padding: 24,
  },
  formContainer: {
    gap: 24,
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    color: '#374151',
    fontWeight: '500',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  generateButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 16,
    borderRadius: 8,
  },
  generateButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 18,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  planTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  examDate: {
    color: '#6b7280',
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
  emptyTasksText: {
    color: '#6b7280',
    textAlign: 'center',
    paddingVertical: 16,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  taskContent: {
    marginLeft: 16,
    flex: 1,
  },
  taskTitle: {
    fontWeight: '500',
    color: '#111827',
  },
  taskTitleCompleted: {
    color: '#6b7280',
    textDecorationLine: 'line-through',
  },
  taskDuration: {
    fontSize: 14,
    color: '#6b7280',
  },
  weekItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  weekDay: {
    fontWeight: '500',
    color: '#111827',
  },
  weekDate: {
    fontSize: 14,
    color: '#6b7280',
  },
  weekProgress: {
    alignItems: 'flex-end',
  },
  weekTaskCount: {
    fontSize: 14,
    color: '#6b7280',
  },
  weekProgressBar: {
    backgroundColor: '#e5e7eb',
    borderRadius: 2,
    height: 4,
    width: 64,
    marginTop: 4,
  },
  weekProgressFill: {
    backgroundColor: '#2563eb',
    height: 4,
    borderRadius: 2,
  },
});