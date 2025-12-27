import React from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView, StatusBar } from 'react-native';

export default function ProgressScreen() {
    const weeklyData = [
        { day: 'Mon', hours: 3, max: 5 },
        { day: 'Tue', hours: 4, max: 5 },
        { day: 'Wed', hours: 2, max: 5 },
        { day: 'Thu', hours: 5, max: 5 },
        { day: 'Fri', hours: 3.5, max: 5 },
        { day: 'Sat', hours: 1, max: 5 },
        { day: 'Sun', hours: 0, max: 5 },
    ];

    const subjects = [
        { name: 'Mathematics', hours: 8, color: '#8b5cf6', percent: 35 },
        { name: 'Physics', hours: 6, color: '#06b6d4', percent: 26 },
        { name: 'Chemistry', hours: 5, color: '#22c55e', percent: 22 },
        { name: 'Biology', hours: 4, color: '#f97316', percent: 17 },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#0f172a" />

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>Your Progress</Text>
                    <Text style={styles.subtitle}>Track your study journey</Text>
                </View>

                {/* Streak Card */}
                <View style={styles.streakCard}>
                    <View style={styles.streakContent}>
                        <Text style={styles.streakEmoji}>🔥</Text>
                        <View>
                            <Text style={styles.streakNumber}>5 Day Streak!</Text>
                            <Text style={styles.streakText}>Keep it up! You're doing great</Text>
                        </View>
                    </View>
                </View>

                {/* Weekly Stats */}
                <View style={styles.statsRow}>
                    <View style={styles.statCard}>
                        <Text style={styles.statValue}>23.5</Text>
                        <Text style={styles.statLabel}>Hours this week</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statValue}>12</Text>
                        <Text style={styles.statLabel}>Sessions</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statValue}>85%</Text>
                        <Text style={styles.statLabel}>Avg Focus</Text>
                    </View>
                </View>

                {/* Weekly Chart */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Weekly Activity</Text>
                    <View style={styles.chartContainer}>
                        {weeklyData.map((item) => (
                            <View key={item.day} style={styles.barWrapper}>
                                <View style={styles.barBackground}>
                                    <View
                                        style={[
                                            styles.barFill,
                                            { height: `${(item.hours / item.max) * 100}%` }
                                        ]}
                                    />
                                </View>
                                <Text style={styles.barLabel}>{item.day}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Subject Breakdown */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Subject Breakdown</Text>
                    {subjects.map((subject) => (
                        <View key={subject.name} style={styles.subjectRow}>
                            <View style={[styles.subjectDot, { backgroundColor: subject.color }]} />
                            <View style={styles.subjectInfo}>
                                <Text style={styles.subjectName}>{subject.name}</Text>
                                <View style={styles.subjectProgressBar}>
                                    <View
                                        style={[
                                            styles.subjectProgressFill,
                                            { width: `${subject.percent}%`, backgroundColor: subject.color }
                                        ]}
                                    />
                                </View>
                            </View>
                            <Text style={styles.subjectHours}>{subject.hours}h</Text>
                        </View>
                    ))}
                </View>

                {/* Goals */}
                <View style={[styles.section, styles.lastSection]}>
                    <Text style={styles.sectionTitle}>Weekly Goals</Text>
                    <View style={styles.goalCard}>
                        <View style={styles.goalHeader}>
                            <Text style={styles.goalTitle}>Study 25 hours</Text>
                            <Text style={styles.goalPercent}>94%</Text>
                        </View>
                        <View style={styles.goalProgressBar}>
                            <View style={[styles.goalProgressFill, { width: '94%' }]} />
                        </View>
                        <Text style={styles.goalSubtext}>23.5 / 25 hours</Text>
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
        paddingTop: 20,
        marginBottom: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: '#94a3b8',
    },
    streakCard: {
        backgroundColor: '#422006',
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#f97316',
    },
    streakContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    streakEmoji: {
        fontSize: 40,
        marginRight: 16,
    },
    streakNumber: {
        color: '#f97316',
        fontSize: 20,
        fontWeight: 'bold',
    },
    streakText: {
        color: '#fdba74',
        fontSize: 14,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#1e293b',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        marginHorizontal: 4,
    },
    statValue: {
        color: '#4ade80',
        fontSize: 24,
        fontWeight: 'bold',
    },
    statLabel: {
        color: '#94a3b8',
        fontSize: 12,
        marginTop: 4,
    },
    section: {
        marginBottom: 24,
    },
    lastSection: {
        marginBottom: 40,
    },
    sectionTitle: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
    },
    chartContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 150,
        alignItems: 'flex-end',
    },
    barWrapper: {
        alignItems: 'center',
        flex: 1,
    },
    barBackground: {
        width: 24,
        height: 120,
        backgroundColor: '#1e293b',
        borderRadius: 12,
        justifyContent: 'flex-end',
        overflow: 'hidden',
    },
    barFill: {
        width: '100%',
        backgroundColor: '#4ade80',
        borderRadius: 12,
    },
    barLabel: {
        color: '#94a3b8',
        fontSize: 12,
        marginTop: 8,
    },
    subjectRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    subjectDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 12,
    },
    subjectInfo: {
        flex: 1,
    },
    subjectName: {
        color: '#ffffff',
        fontSize: 14,
        marginBottom: 6,
    },
    subjectProgressBar: {
        height: 6,
        backgroundColor: '#1e293b',
        borderRadius: 3,
    },
    subjectProgressFill: {
        height: '100%',
        borderRadius: 3,
    },
    subjectHours: {
        color: '#94a3b8',
        fontSize: 14,
        marginLeft: 12,
    },
    goalCard: {
        backgroundColor: '#1e293b',
        borderRadius: 12,
        padding: 16,
    },
    goalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    goalTitle: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },
    goalPercent: {
        color: '#4ade80',
        fontSize: 16,
        fontWeight: 'bold',
    },
    goalProgressBar: {
        height: 8,
        backgroundColor: '#334155',
        borderRadius: 4,
        marginBottom: 8,
    },
    goalProgressFill: {
        height: '100%',
        backgroundColor: '#4ade80',
        borderRadius: 4,
    },
    goalSubtext: {
        color: '#94a3b8',
        fontSize: 12,
    },
});
