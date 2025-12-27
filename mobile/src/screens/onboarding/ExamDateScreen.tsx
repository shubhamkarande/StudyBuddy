import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppDispatch } from '../../store';
import { setExamDate } from '../../store/onboardingSlice';
import { RootStackParamList } from '../../types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function ExamDateScreen() {
    const navigation = useNavigation<NavigationProp>();
    const dispatch = useAppDispatch();
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    const dates = [
        { label: '1 Month', days: 30 },
        { label: '2 Months', days: 60 },
        { label: '3 Months', days: 90 },
        { label: '6 Months', days: 180 },
    ];

    const handleSelectDate = (days: number) => {
        const date = new Date();
        date.setDate(date.getDate() + days);
        setSelectedDate(date);
    };

    const handleContinue = () => {
        if (selectedDate) {
            dispatch(setExamDate(selectedDate.toISOString()));
            navigation.navigate('Availability');
        }
    };

    const getDaysUntil = () => {
        if (!selectedDate) return 0;
        const now = new Date();
        const diff = selectedDate.getTime() - now.getTime();
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
                    <View style={styles.stepIndicator}>
                        <View style={styles.stepCompleted} />
                        <View style={styles.stepActive} />
                        <View style={styles.step} />
                    </View>
                </View>

                {/* Title */}
                <Text style={styles.title}>When is your exam?</Text>
                <Text style={styles.subtitle}>We'll create a study schedule based on your timeline</Text>

                {/* Date Options */}
                <View style={styles.dateOptions}>
                    {dates.map((option) => (
                        <TouchableOpacity
                            key={option.days}
                            style={[
                                styles.dateCard,
                                selectedDate && getDaysUntil() === option.days && styles.dateCardSelected
                            ]}
                            onPress={() => handleSelectDate(option.days)}
                        >
                            <Text style={styles.dateLabel}>{option.label}</Text>
                            <Text style={styles.dateIcon}>📅</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Countdown Preview */}
                {selectedDate && (
                    <View style={styles.countdownCard}>
                        <Text style={styles.countdownTitle}>Days Until Exam</Text>
                        <Text style={styles.countdownNumber}>{getDaysUntil()}</Text>
                        <Text style={styles.countdownDate}>
                            {selectedDate.toLocaleDateString('en-US', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric'
                            })}
                        </Text>
                    </View>
                )}

                <View style={styles.spacer} />

                {/* Continue Button */}
                <TouchableOpacity
                    style={[styles.continueButton, !selectedDate && styles.disabledButton]}
                    onPress={handleContinue}
                    disabled={!selectedDate}
                >
                    <Text style={styles.continueText}>Continue</Text>
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
        marginRight: 16,
    },
    backText: {
        color: '#ffffff',
        fontSize: 24,
    },
    stepIndicator: {
        flexDirection: 'row',
        flex: 1,
    },
    step: {
        flex: 1,
        height: 4,
        backgroundColor: '#334155',
        borderRadius: 2,
        marginHorizontal: 2,
    },
    stepActive: {
        flex: 1,
        height: 4,
        backgroundColor: '#4ade80',
        borderRadius: 2,
        marginHorizontal: 2,
    },
    stepCompleted: {
        flex: 1,
        height: 4,
        backgroundColor: '#22c55e',
        borderRadius: 2,
        marginHorizontal: 2,
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
    dateOptions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    dateCard: {
        width: '48%',
        backgroundColor: '#1e293b',
        borderRadius: 12,
        padding: 20,
        alignItems: 'center',
        marginBottom: 12,
    },
    dateCardSelected: {
        backgroundColor: '#4ade80',
    },
    dateLabel: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    dateIcon: {
        fontSize: 24,
    },
    countdownCard: {
        backgroundColor: '#1e293b',
        borderRadius: 16,
        padding: 24,
        alignItems: 'center',
        marginTop: 24,
    },
    countdownTitle: {
        color: '#94a3b8',
        fontSize: 14,
        marginBottom: 8,
    },
    countdownNumber: {
        color: '#4ade80',
        fontSize: 64,
        fontWeight: 'bold',
    },
    countdownDate: {
        color: '#ffffff',
        fontSize: 16,
        marginTop: 8,
    },
    spacer: {
        flex: 1,
    },
    continueButton: {
        backgroundColor: '#4ade80',
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        marginBottom: 20,
    },
    disabledButton: {
        opacity: 0.5,
    },
    continueText: {
        color: '#0f172a',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
