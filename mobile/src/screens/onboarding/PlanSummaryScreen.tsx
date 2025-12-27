import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppSelector, useAppDispatch } from '../../store';
import { completeOnboarding } from '../../store/onboardingSlice';
import { RootStackParamList } from '../../types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function PlanSummaryScreen() {
    const navigation = useNavigation<NavigationProp>();
    const dispatch = useAppDispatch();
    const [isGenerating, setIsGenerating] = useState(false);
    const { subjects, examDate, dailyHours } = useAppSelector((state) => state.onboarding);

    const handleGeneratePlan = async () => {
        setIsGenerating(true);

        // Simulate plan generation
        await new Promise(resolve => setTimeout(resolve, 2000));

        dispatch(completeOnboarding());
        setIsGenerating(false);
    };

    const getDaysUntilExam = () => {
        if (!examDate) return 0;
        const now = new Date();
        const exam = new Date(examDate);
        const diff = exam.getTime() - now.getTime();
        return Math.ceil(diff / (1000 * 60 * 60 * 24));
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#0f172a" />

            <View style={styles.content}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Text style={styles.backText}>←</Text>
                    </TouchableOpacity>
                </View>

                {/* Title */}
                <Text style={styles.title}>Your Study Plan</Text>
                <Text style={styles.subtitle}>Review your preferences before we create your personalized plan</Text>

                {/* Summary Cards */}
                <View style={styles.summaryContainer}>
                    <View style={styles.summaryCard}>
                        <Text style={styles.summaryIcon}>📚</Text>
                        <View style={styles.summaryContent}>
                            <Text style={styles.summaryLabel}>Subjects</Text>
                            <Text style={styles.summaryValue}>{subjects?.length || 0} selected</Text>
                        </View>
                    </View>

                    <View style={styles.summaryCard}>
                        <Text style={styles.summaryIcon}>📅</Text>
                        <View style={styles.summaryContent}>
                            <Text style={styles.summaryLabel}>Days Until Exam</Text>
                            <Text style={styles.summaryValue}>{getDaysUntilExam()} days</Text>
                        </View>
                    </View>

                    <View style={styles.summaryCard}>
                        <Text style={styles.summaryIcon}>⏱️</Text>
                        <View style={styles.summaryContent}>
                            <Text style={styles.summaryLabel}>Daily Study Time</Text>
                            <Text style={styles.summaryValue}>{dailyHours} hours</Text>
                        </View>
                    </View>

                    <View style={styles.summaryCard}>
                        <Text style={styles.summaryIcon}>📊</Text>
                        <View style={styles.summaryContent}>
                            <Text style={styles.summaryLabel}>Total Study Hours</Text>
                            <Text style={styles.summaryValue}>{getDaysUntilExam() * dailyHours} hours</Text>
                        </View>
                    </View>
                </View>

                {/* Subject List */}
                {subjects && subjects.length > 0 && (
                    <View style={styles.subjectsCard}>
                        <Text style={styles.subjectsTitle}>Selected Subjects</Text>
                        <View style={styles.subjectsList}>
                            {subjects.map((subject, index) => (
                                <View key={index} style={styles.subjectPill}>
                                    <Text style={styles.subjectPillText}>{subject}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                )}

                <View style={styles.spacer} />

                {/* Generate Button */}
                <TouchableOpacity
                    style={[styles.generateButton, isGenerating && styles.generatingButton]}
                    onPress={handleGeneratePlan}
                    disabled={isGenerating}
                >
                    {isGenerating ? (
                        <>
                            <ActivityIndicator color="#0f172a" style={styles.loadingIndicator} />
                            <Text style={styles.generateText}>Generating Your Plan...</Text>
                        </>
                    ) : (
                        <>
                            <Text style={styles.generateEmoji}>🚀</Text>
                            <Text style={styles.generateText}>Generate My Study Plan</Text>
                        </>
                    )}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0f172a',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 16,
        marginBottom: 24,
    },
    backButton: {
        padding: 8,
    },
    backText: {
        color: '#ffffff',
        fontSize: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#94a3b8',
        marginBottom: 32,
    },
    summaryContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    summaryCard: {
        width: '48%',
        backgroundColor: '#1e293b',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
    },
    summaryIcon: {
        fontSize: 28,
        marginRight: 12,
    },
    summaryContent: {
        flex: 1,
    },
    summaryLabel: {
        color: '#94a3b8',
        fontSize: 12,
        marginBottom: 4,
    },
    summaryValue: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },
    subjectsCard: {
        backgroundColor: '#1e293b',
        borderRadius: 12,
        padding: 16,
        marginTop: 8,
    },
    subjectsTitle: {
        color: '#94a3b8',
        fontSize: 14,
        marginBottom: 12,
    },
    subjectsList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    subjectPill: {
        backgroundColor: '#334155',
        borderRadius: 16,
        paddingHorizontal: 12,
        paddingVertical: 6,
        marginRight: 8,
        marginBottom: 8,
    },
    subjectPillText: {
        color: '#ffffff',
        fontSize: 14,
    },
    spacer: {
        flex: 1,
    },
    generateButton: {
        backgroundColor: '#4ade80',
        borderRadius: 12,
        paddingVertical: 18,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
    },
    generatingButton: {
        backgroundColor: '#22c55e',
    },
    generateEmoji: {
        fontSize: 20,
        marginRight: 8,
    },
    loadingIndicator: {
        marginRight: 8,
    },
    generateText: {
        color: '#0f172a',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
