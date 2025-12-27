import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StatusBar,
    SafeAreaView,
    ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppDispatch, useAppSelector } from '../../store';
import { updateUserProfile } from '../../store/authSlice';
import { setPlan } from '../../store/plannerSlice';
import { resetOnboarding } from '../../store/onboardingSlice';
import { RootStackParamList } from '../../types';
import { api } from '../../services/api';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function PlanSummaryScreen() {
    const navigation = useNavigation<NavigationProp>();
    const dispatch = useAppDispatch();
    const { subjects, examDate, dailyHours, studyStyle } = useAppSelector(state => state.onboarding);
    const { user } = useAppSelector(state => state.auth);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGeneratePlan = async () => {
        if (!user?.uid) return;

        setIsGenerating(true);
        try {
            const response = await api.generatePlan({
                userId: user.uid,
                subjects,
                examDate: examDate || new Date().toISOString(),
                dailyHours,
                studyStyle,
            });

            if (response.success) {
                dispatch(setPlan({
                    userId: user.uid,
                    sessions: response.plan.sessions.map(s => ({
                        ...s,
                        type: s.type as 'reading' | 'practice' | 'revision' | 'writing',
                        status: s.status as 'scheduled' | 'completed' | 'missed' | 'in_progress',
                    })),
                    createdAt: response.plan.createdAt,
                    examDate: response.plan.examDate,
                    totalPlannedHours: response.plan.totalPlannedHours,
                }));
                dispatch(updateUserProfile({
                    subjects,
                    dailyAvailability: dailyHours,
                    studyStyle,
                    onboardingComplete: true,
                }));
                dispatch(resetOnboarding());
            }
        } catch (error) {
            console.error('Failed to generate plan:', error);
            // For demo, still complete onboarding
            dispatch(updateUserProfile({
                subjects,
                dailyAvailability: dailyHours,
                studyStyle,
                onboardingComplete: true,
            }));
            dispatch(resetOnboarding());
        } finally {
            setIsGenerating(false);
        }
    };

    const getStudyStyleLabel = () => {
        switch (studyStyle) {
            case 'pomodoro':
                return 'Deep Work + Pomodoro';
            case 'deep_work':
                return 'Deep Work Sessions';
            case 'mixed':
            default:
                return 'Mixed Sessions';
        }
    };

    const getGoalLabel = () => {
        if (subjects.length === 1) return subjects[0];
        if (subjects.length <= 3) return subjects.join(', ');
        return `${subjects[0]}, ${subjects[1]} +${subjects.length - 2} more`;
    };

    return (
        <SafeAreaView className="flex-1 bg-dark-900">
            <StatusBar barStyle="light-content" backgroundColor="#0f172a" />

            {/* Header */}
            <View className="px-6 pt-4">
                <View className="flex-row items-center mb-4">
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        className="p-2 -ml-2"
                    >
                        <Text className="text-white text-2xl">←</Text>
                    </TouchableOpacity>
                    <Text className="flex-1 text-white text-lg font-medium text-center mr-8">
                        Step 5 of 5
                    </Text>
                </View>

                {/* Progress bar */}
                <View className="flex-row space-x-1 mb-6">
                    <View className="flex-1 h-1.5 rounded-full bg-primary-600" />
                    <View className="flex-1 h-1.5 rounded-full bg-primary-600" />
                    <View className="flex-1 h-1.5 rounded-full bg-primary-600" />
                    <View className="flex-1 h-1.5 rounded-full bg-primary-600" />
                    <View className="flex-1 h-1.5 rounded-full bg-primary-600" />
                </View>
            </View>

            <View className="flex-1 px-6">
                {/* Hero image placeholder */}
                <View className="h-48 rounded-2xl bg-gradient-to-br from-primary-600 to-primary-800 items-center justify-center mb-6 overflow-hidden">
                    <View className="bg-primary-700 rounded-full w-24 h-24 items-center justify-center mb-2">
                        <Text className="text-5xl">🎓</Text>
                    </View>
                    <View className="absolute bottom-4 left-4">
                        <Text className="text-4xl">📚</Text>
                    </View>
                    <View className="absolute top-4 right-4">
                        <Text className="text-3xl">⏰</Text>
                    </View>
                </View>

                {/* Title */}
                <Text className="text-white text-3xl font-bold text-center mb-2">
                    Ready to focus?
                </Text>
                <Text className="text-dark-400 text-center text-base mb-8">
                    We've analyzed your schedule and goals.{'\n'}Here is a summary of your plan preferences:
                </Text>

                {/* Summary cards */}
                <View className="bg-dark-800 rounded-2xl p-4 mb-4">
                    <View className="flex-row items-center">
                        <View className="w-12 h-12 rounded-xl bg-red-500/20 items-center justify-center mr-4">
                            <Text className="text-2xl">🎯</Text>
                        </View>
                        <View className="flex-1">
                            <Text className="text-dark-400 text-xs uppercase tracking-wider mb-1">GOAL</Text>
                            <Text className="text-white font-semibold">{getGoalLabel()}</Text>
                        </View>
                        <Text className="text-primary-500 text-xl">✓</Text>
                    </View>
                </View>

                <View className="bg-dark-800 rounded-2xl p-4 mb-4">
                    <View className="flex-row items-center">
                        <View className="w-12 h-12 rounded-xl bg-blue-500/20 items-center justify-center mr-4">
                            <Text className="text-2xl">⏰</Text>
                        </View>
                        <View className="flex-1">
                            <Text className="text-dark-400 text-xs uppercase tracking-wider mb-1">AVAILABILITY</Text>
                            <Text className="text-white font-semibold">{dailyHours} hours / day</Text>
                        </View>
                        <Text className="text-primary-500 text-xl">✓</Text>
                    </View>
                </View>

                <View className="bg-dark-800 rounded-2xl p-4 mb-4">
                    <View className="flex-row items-center">
                        <View className="w-12 h-12 rounded-xl bg-green-500/20 items-center justify-center mr-4">
                            <Text className="text-2xl">📋</Text>
                        </View>
                        <View className="flex-1">
                            <Text className="text-dark-400 text-xs uppercase tracking-wider mb-1">STYLE</Text>
                            <Text className="text-white font-semibold">{getStudyStyleLabel()}</Text>
                        </View>
                        <Text className="text-primary-500 text-xl">✓</Text>
                    </View>
                </View>
            </View>

            {/* Generate button */}
            <View className="px-6 pb-8">
                <TouchableOpacity
                    className="bg-primary-600 rounded-2xl py-4 flex-row items-center justify-center"
                    onPress={handleGeneratePlan}
                    disabled={isGenerating}
                    activeOpacity={0.8}
                >
                    {isGenerating ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <>
                            <Text className="text-xl mr-2">✨</Text>
                            <Text className="text-white text-lg font-semibold">
                                Generate My Study Plan
                            </Text>
                        </>
                    )}
                </TouchableOpacity>
                <Text className="text-dark-500 text-center text-sm mt-3">
                    You can adjust your preferences later in settings.
                </Text>
            </View>
        </SafeAreaView>
    );
}
