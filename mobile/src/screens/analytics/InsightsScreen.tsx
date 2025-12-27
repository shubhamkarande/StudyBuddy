import React from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    SafeAreaView,
    Image,
} from 'react-native';
import { useAppSelector } from '../../store';

// AI Chat bubble component
const AIChatBubble = ({ message }: { message: string }) => {
    return (
        <View className="flex-row items-start mb-4">
            {/* AI Avatar */}
            <View className="w-10 h-10 rounded-full bg-dark-700 items-center justify-center mr-3">
                <Text className="text-lg">🤖</Text>
            </View>

            <View className="flex-1">
                {/* Name and time */}
                <View className="flex-row items-center mb-2">
                    <Text className="text-white font-semibold mr-2">StudyBuddy AI</Text>
                    <Text className="text-dark-500 text-xs">Just now</Text>
                </View>

                {/* Message bubble */}
                <View className="bg-dark-800 rounded-2xl rounded-tl-none p-4">
                    <Text className="text-dark-300 leading-6">{message}</Text>
                </View>
            </View>
        </View>
    );
};

// Strength card component
const StrengthCard = ({
    subjects,
    efficiency,
    description
}: {
    subjects: string;
    efficiency: number;
    description: string;
}) => {
    return (
        <View className="bg-gradient-to-r from-green-900/40 to-green-800/20 rounded-2xl p-4 mb-4 border border-green-700/30">
            <View className="flex-row justify-between items-start mb-2">
                <Text className="text-green-400 text-xs font-semibold">🏆 TOP STRENGTHS</Text>
                <View className="bg-green-500/20 rounded-full px-2 py-1">
                    <Text className="text-green-400 text-xs font-semibold">{efficiency}% Eff.</Text>
                </View>
            </View>
            <View className="flex-row items-center">
                <View className="flex-1">
                    <Text className="text-white text-lg font-bold mb-1">{subjects}</Text>
                    <Text className="text-dark-400 text-sm leading-5">{description}</Text>
                </View>
                <View className="w-16 h-16 rounded-full bg-green-500/20 items-center justify-center ml-3">
                    <Text className="text-3xl">🧬</Text>
                </View>
            </View>
        </View>
    );
};

// Attention card component
const AttentionCard = ({
    subject,
    description
}: {
    subject: string;
    description: string;
}) => {
    return (
        <View className="bg-gradient-to-r from-orange-900/40 to-orange-800/20 rounded-2xl p-4 mb-4 border border-orange-700/30">
            <Text className="text-orange-400 text-xs font-semibold mb-2">⚠️ NEEDS ATTENTION</Text>
            <View className="flex-row items-center">
                <View className="flex-1">
                    <Text className="text-white text-lg font-bold mb-1">{subject}</Text>
                    <Text className="text-orange-300/80 text-sm leading-5">{description}</Text>
                </View>
                <View className="w-16 h-16 rounded-full bg-orange-500/20 items-center justify-center ml-3">
                    <Text className="text-3xl">📐</Text>
                </View>
            </View>
        </View>
    );
};

// Improvement suggestion component
const ImprovementItem = ({
    suggestion,
    checked = false
}: {
    suggestion: React.ReactNode;
    checked?: boolean;
}) => {
    return (
        <TouchableOpacity className="flex-row items-start py-3">
            <View className={`w-5 h-5 rounded-full border-2 mr-3 items-center justify-center ${checked ? 'bg-blue-500 border-blue-500' : 'border-dark-500'
                }`}>
                {checked && <Text className="text-white text-xs">✓</Text>}
            </View>
            <View className="flex-1">
                {suggestion}
            </View>
        </TouchableOpacity>
    );
};

export default function InsightsScreen() {
    const { user } = useAppSelector(state => state.auth);
    const userName = user?.displayName?.split(' ')[0] || 'Alex';

    // Current date range
    const getDateRange = () => {
        const now = new Date();
        const start = new Date(now);
        start.setDate(now.getDate() - 6);
        const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
        return `${start.toLocaleDateString('en-US', options)} - ${now.toLocaleDateString('en-US', options)}`;
    };

    return (
        <SafeAreaView className="flex-1 bg-dark-900">
            <StatusBar barStyle="light-content" backgroundColor="#0f172a" />

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View className="flex-row items-center justify-between px-6 pt-4 pb-2">
                    <Text className="text-white text-2xl font-bold">Weekly Insights</Text>
                    <TouchableOpacity className="bg-dark-800 rounded-full px-3 py-2 flex-row items-center">
                        <Text className="text-lg mr-2">📅</Text>
                        <Text className="text-white text-sm">{getDateRange()}</Text>
                        <Text className="text-dark-400 ml-1">▼</Text>
                    </TouchableOpacity>
                </View>

                {/* AI Chat */}
                <View className="px-6 mt-4">
                    <AIChatBubble
                        message={`Hi ${userName}! 👋 Here is your breakdown for the week. You've been remarkably consistent! You logged **24 hours** of focus time.`}
                    />
                </View>

                {/* Strengths Card */}
                <View className="px-6">
                    <StrengthCard
                        subjects="Biology & Chemistry"
                        efficiency={90}
                        description="These are your power zones this week! Your recall rate was exceptional."
                    />
                </View>

                {/* Attention Card */}
                <View className="px-6">
                    <AttentionCard
                        subject="Calculus"
                        description="We noticed frequent breaks during Tuesday's session. It was a tricky topic!"
                    />
                </View>

                {/* Suggested Improvements */}
                <View className="mx-6 bg-dark-800 rounded-2xl p-4 mb-4">
                    <View className="flex-row items-center mb-3">
                        <Text className="text-xl mr-2">💡</Text>
                        <Text className="text-white text-lg font-semibold">Suggested Improvements</Text>
                    </View>

                    <ImprovementItem
                        suggestion={
                            <Text className="text-dark-300">
                                Try the <Text className="text-blue-400">Pomodoro technique</Text> (25m work / 5m break) for Calculus next time.
                            </Text>
                        }
                    />

                    <View className="h-px bg-dark-700 my-1" />

                    <ImprovementItem
                        suggestion={
                            <Text className="text-dark-300">
                                Review your flashcards 10 minutes before sleeping to improve retention.
                            </Text>
                        }
                    />
                </View>

                {/* Motivational quote */}
                <View className="px-6 py-6">
                    <Text className="text-dark-500 text-center italic text-sm">
                        "Success is the sum of small efforts, repeated day in and day out."
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
