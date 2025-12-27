import React from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView, StatusBar } from 'react-native';

export default function InsightsScreen() {
    const insights = [
        {
            type: 'strength',
            icon: '💪',
            title: 'Strong in Mathematics',
            description: 'You\'ve spent the most time on Math and show consistent improvement.',
            color: '#22c55e',
            bgColor: '#052e16',
        },
        {
            type: 'attention',
            icon: '⚠️',
            title: 'Physics needs attention',
            description: 'Your focus time in Physics has dropped 20% this week.',
            color: '#f97316',
            bgColor: '#422006',
        },
        {
            type: 'tip',
            icon: '💡',
            title: 'Best study time: Morning',
            description: 'Your focus scores are 30% higher during morning sessions.',
            color: '#06b6d4',
            bgColor: '#083344',
        },
    ];

    const suggestions = [
        { icon: '📚', text: 'Review Physics: Mechanics chapter', priority: 'high' },
        { icon: '⏰', text: 'Schedule 2 more Chemistry sessions', priority: 'medium' },
        { icon: '🎯', text: 'Try a 45-min focus session today', priority: 'low' },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#0f172a" />

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>AI Insights</Text>
                    <Text style={styles.subtitle}>Personalized recommendations for you</Text>
                </View>

                {/* AI Message */}
                <View style={styles.aiCard}>
                    <View style={styles.aiHeader}>
                        <Text style={styles.aiIcon}>🤖</Text>
                        <Text style={styles.aiTitle}>StudyBuddy AI</Text>
                    </View>
                    <Text style={styles.aiMessage}>
                        Great progress this week! You've completed 94% of your goals.
                        I noticed you're most productive in the mornings - consider scheduling
                        challenging subjects during that time.
                    </Text>
                </View>

                {/* Insights */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Key Insights</Text>
                    {insights.map((insight, index) => (
                        <View
                            key={index}
                            style={[
                                styles.insightCard,
                                { backgroundColor: insight.bgColor, borderColor: insight.color }
                            ]}
                        >
                            <Text style={styles.insightIcon}>{insight.icon}</Text>
                            <View style={styles.insightContent}>
                                <Text style={[styles.insightTitle, { color: insight.color }]}>
                                    {insight.title}
                                </Text>
                                <Text style={styles.insightDesc}>{insight.description}</Text>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Suggestions */}
                <View style={[styles.section, styles.lastSection]}>
                    <Text style={styles.sectionTitle}>Suggested Actions</Text>
                    {suggestions.map((suggestion, index) => (
                        <View key={index} style={styles.suggestionCard}>
                            <Text style={styles.suggestionIcon}>{suggestion.icon}</Text>
                            <Text style={styles.suggestionText}>{suggestion.text}</Text>
                            <View style={[
                                styles.priorityBadge,
                                suggestion.priority === 'high' && styles.priorityHigh,
                                suggestion.priority === 'medium' && styles.priorityMedium,
                                suggestion.priority === 'low' && styles.priorityLow,
                            ]}>
                                <Text style={styles.priorityText}>{suggestion.priority}</Text>
                            </View>
                        </View>
                    ))}
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
    aiCard: {
        backgroundColor: '#1e293b',
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#4ade80',
    },
    aiHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    aiIcon: {
        fontSize: 24,
        marginRight: 8,
    },
    aiTitle: {
        color: '#4ade80',
        fontSize: 16,
        fontWeight: '600',
    },
    aiMessage: {
        color: '#e2e8f0',
        fontSize: 14,
        lineHeight: 22,
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
    insightCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
    },
    insightIcon: {
        fontSize: 28,
        marginRight: 12,
    },
    insightContent: {
        flex: 1,
    },
    insightTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    insightDesc: {
        color: '#94a3b8',
        fontSize: 14,
        lineHeight: 20,
    },
    suggestionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1e293b',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
    },
    suggestionIcon: {
        fontSize: 24,
        marginRight: 12,
    },
    suggestionText: {
        flex: 1,
        color: '#ffffff',
        fontSize: 14,
    },
    priorityBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    priorityHigh: {
        backgroundColor: '#7f1d1d',
    },
    priorityMedium: {
        backgroundColor: '#78350f',
    },
    priorityLow: {
        backgroundColor: '#14532d',
    },
    priorityText: {
        color: '#ffffff',
        fontSize: 11,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
});
