import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppSelector } from '../../store';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function HomeScreen() {
    const navigation = useNavigation();
    const { user } = useAppSelector((state) => state.auth);
    const today = new Date();
    const currentDay = today.getDay();

    const sessions = [
        { id: 1, subject: 'Mathematics', topic: 'Calculus', time: '09:00 AM', duration: 45, color: '#8b5cf6' },
        { id: 2, subject: 'Physics', topic: 'Mechanics', time: '11:00 AM', duration: 30, color: '#06b6d4' },
        { id: 3, subject: 'Chemistry', topic: 'Organic', time: '02:00 PM', duration: 45, color: '#22c55e' },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#0f172a" />

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.greeting}>Hello, {user?.displayName || 'Student'}! 👋</Text>
                        <Text style={styles.dateText}>{today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</Text>
                    </View>
                    <View style={styles.streakBadge}>
                        <Text style={styles.streakEmoji}>🔥</Text>
                        <Text style={styles.streakText}>5</Text>
                    </View>
                </View>

                {/* Weekly Calendar */}
                <View style={styles.weekContainer}>
                    {DAYS.map((day, index) => (
                        <TouchableOpacity
                            key={day}
                            style={[
                                styles.dayButton,
                                index === currentDay && styles.dayButtonActive
                            ]}
                        >
                            <Text style={[
                                styles.dayText,
                                index === currentDay && styles.dayTextActive
                            ]}>{day}</Text>
                            <Text style={[
                                styles.dateNumber,
                                index === currentDay && styles.dateNumberActive
                            ]}>{today.getDate() - currentDay + index}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Progress Card */}
                <View style={styles.progressCard}>
                    <View style={styles.progressHeader}>
                        <Text style={styles.progressTitle}>Today's Progress</Text>
                        <Text style={styles.progressPercent}>65%</Text>
                    </View>
                    <View style={styles.progressBar}>
                        <View style={[styles.progressFill, { width: '65%' }]} />
                    </View>
                    <Text style={styles.progressSubtext}>2 of 3 sessions completed</Text>
                </View>

                {/* Today's Sessions */}
                <View style={styles.sessionsContainer}>
                    <Text style={styles.sectionTitle}>Today's Sessions</Text>
                    {sessions.map((session) => (
                        <TouchableOpacity
                            key={session.id}
                            style={styles.sessionCard}
                            onPress={() => navigation.navigate('Focus' as never)}
                        >
                            <View style={[styles.sessionIndicator, { backgroundColor: session.color }]} />
                            <View style={styles.sessionContent}>
                                <View style={styles.sessionHeader}>
                                    <Text style={styles.sessionSubject}>{session.subject}</Text>
                                    <Text style={styles.sessionTime}>{session.time}</Text>
                                </View>
                                <Text style={styles.sessionTopic}>{session.topic}</Text>
                                <View style={styles.sessionFooter}>
                                    <Text style={styles.sessionDuration}>{session.duration} min</Text>
                                    <Text style={styles.startButton}>Start →</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Quick Stats */}
                <View style={styles.statsRow}>
                    <View style={styles.statCard}>
                        <Text style={styles.statEmoji}>⏱️</Text>
                        <Text style={styles.statValue}>2.5h</Text>
                        <Text style={styles.statLabel}>Study Time</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statEmoji}>📖</Text>
                        <Text style={styles.statValue}>3</Text>
                        <Text style={styles.statLabel}>Subjects</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statEmoji}>🎯</Text>
                        <Text style={styles.statValue}>85%</Text>
                        <Text style={styles.statLabel}>Focus</Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0f172a',
    },
    scrollView: {
        flex: 1,
        paddingHorizontal: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 20,
        marginBottom: 24,
    },
    greeting: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 4,
    },
    dateText: {
        fontSize: 14,
        color: '#94a3b8',
    },
    streakBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1e293b',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
    },
    streakEmoji: {
        fontSize: 20,
        marginRight: 4,
    },
    streakText: {
        color: '#f97316',
        fontWeight: 'bold',
        fontSize: 16,
    },
    weekContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    dayButton: {
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 8,
        borderRadius: 12,
        minWidth: 44,
    },
    dayButtonActive: {
        backgroundColor: '#4ade80',
    },
    dayText: {
        color: '#94a3b8',
        fontSize: 12,
        marginBottom: 4,
    },
    dayTextActive: {
        color: '#0f172a',
    },
    dateNumber: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },
    dateNumberActive: {
        color: '#0f172a',
    },
    progressCard: {
        backgroundColor: '#1e293b',
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
    },
    progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    progressTitle: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },
    progressPercent: {
        color: '#4ade80',
        fontSize: 18,
        fontWeight: 'bold',
    },
    progressBar: {
        height: 8,
        backgroundColor: '#334155',
        borderRadius: 4,
        marginBottom: 8,
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#4ade80',
        borderRadius: 4,
    },
    progressSubtext: {
        color: '#94a3b8',
        fontSize: 12,
    },
    sessionsContainer: {
        marginBottom: 24,
    },
    sectionTitle: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
    },
    sessionCard: {
        flexDirection: 'row',
        backgroundColor: '#1e293b',
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 12,
    },
    sessionIndicator: {
        width: 4,
    },
    sessionContent: {
        flex: 1,
        padding: 16,
    },
    sessionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    sessionSubject: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },
    sessionTime: {
        color: '#94a3b8',
        fontSize: 12,
    },
    sessionTopic: {
        color: '#94a3b8',
        fontSize: 14,
        marginBottom: 8,
    },
    sessionFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    sessionDuration: {
        color: '#64748b',
        fontSize: 12,
    },
    startButton: {
        color: '#4ade80',
        fontWeight: '600',
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 32,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#1e293b',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        marginHorizontal: 4,
    },
    statEmoji: {
        fontSize: 24,
        marginBottom: 8,
    },
    statValue: {
        color: '#ffffff',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    statLabel: {
        color: '#94a3b8',
        fontSize: 12,
    },
});
