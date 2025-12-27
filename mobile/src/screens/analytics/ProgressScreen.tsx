import React from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppSelector } from '../../store';

// Bar chart component for weekly focus
const WeeklyBarChart = ({ data }: { data: { day: string; hours: number; isToday?: boolean }[] }) => {
    const maxHours = Math.max(...data.map(d => d.hours), 4);

    return (
        <View className="bg-dark-800 rounded-2xl p-4">
            <View className="flex-row justify-between items-end h-32">
                {data.map((item, index) => {
                    const heightPercent = item.hours > 0 ? (item.hours / maxHours) * 100 : 5;
                    return (
                        <View key={index} className="items-center flex-1">
                            <View
                                className={`w-5 rounded-t-sm ${item.isToday ? 'bg-blue-500' : 'bg-dark-600'}`}
                                style={{ height: `${heightPercent}%`, minHeight: 4 }}
                            />
                        </View>
                    );
                })}
            </View>
            <View className="flex-row justify-between mt-3">
                {data.map((item, index) => (
                    <View key={index} className="items-center flex-1">
                        <Text className={`text-xs ${item.isToday ? 'text-white font-semibold' : 'text-dark-400'}`}>
                            {item.day}
                        </Text>
                    </View>
                ))}
            </View>
        </View>
    );
};

// Subject breakdown component
const SubjectBreakdown = ({ subjects }: { subjects: { name: string; percentage: number; color: string }[] }) => {
    return (
        <View className="bg-dark-800 rounded-2xl p-4">
            {subjects.map((subject, index) => (
                <View key={index} className={`${index > 0 ? 'mt-4' : ''}`}>
                    <View className="flex-row justify-between items-center mb-2">
                        <View className="flex-row items-center">
                            <View className={`w-2 h-2 rounded-full ${subject.color} mr-2`} />
                            <Text className="text-white">{subject.name}</Text>
                        </View>
                        <Text className="text-dark-400">{subject.percentage}%</Text>
                    </View>
                    <View className="h-1.5 bg-dark-700 rounded-full">
                        <View
                            className={`h-1.5 rounded-full ${subject.color}`}
                            style={{ width: `${subject.percentage}%` }}
                        />
                    </View>
                </View>
            ))}
        </View>
    );
};

// Consistency calendar
const ConsistencyCalendar = ({ days }: { days: { date: number; status: 'done' | 'missed' | 'future' }[] }) => {
    const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

    return (
        <View className="bg-dark-800 rounded-2xl p-4">
            {/* Legend */}
            <View className="flex-row justify-end mb-3">
                <View className="flex-row items-center mr-4">
                    <View className="w-3 h-3 rounded-full bg-blue-500 mr-1" />
                    <Text className="text-dark-400 text-xs">Done</Text>
                </View>
                <View className="flex-row items-center">
                    <View className="w-3 h-3 rounded-full bg-red-500 mr-1" />
                    <Text className="text-dark-400 text-xs">Missed</Text>
                </View>
            </View>

            {/* Day headers */}
            <View className="flex-row justify-between mb-2">
                {weekDays.map((day, i) => (
                    <View key={i} className="w-9 items-center">
                        <Text className="text-dark-400 text-xs">{day}</Text>
                    </View>
                ))}
            </View>

            {/* Calendar grid */}
            <View className="flex-row flex-wrap">
                {days.map((day, index) => (
                    <View
                        key={index}
                        className={`w-9 h-9 m-0.5 rounded-full items-center justify-center ${day.status === 'done'
                                ? 'bg-blue-500'
                                : day.status === 'missed'
                                    ? 'bg-red-500/20 border border-red-500'
                                    : 'bg-transparent'
                            }`}
                    >
                        <Text className={`text-sm ${day.status === 'future' ? 'text-dark-500' : 'text-white'
                            }`}>
                            {day.date}
                        </Text>
                    </View>
                ))}
            </View>
        </View>
    );
};

export default function ProgressScreen() {
    const navigation = useNavigation();
    const { current: streakCurrent, longest: streakLongest } = useAppSelector(state => state.streak);

    // Weekly data
    const weeklyData = [
        { day: 'M', hours: 3.5 },
        { day: 'T', hours: 4.2 },
        { day: 'W', hours: 2.8 },
        { day: 'T', hours: 5.1, isToday: true },
        { day: 'F', hours: 0 },
        { day: 'S', hours: 0 },
        { day: 'S', hours: 0 },
    ];

    // Total hours
    const totalHoursWeek = weeklyData.reduce((sum, d) => sum + d.hours, 0);

    // Subject data
    const subjectData = [
        { name: 'Mathematics', percentage: 45, color: 'bg-blue-500' },
        { name: 'Physics', percentage: 30, color: 'bg-purple-500' },
        { name: 'History', percentage: 15, color: 'bg-green-500' },
        { name: 'Others', percentage: 10, color: 'bg-yellow-500' },
    ];

    // Consistency calendar data (3 weeks)
    const calendarDays: { date: number; status: 'done' | 'missed' | 'future' }[] = [];
    for (let i = 1; i <= 21; i++) {
        const status = i <= 18
            ? (Math.random() > 0.2 ? 'done' : 'missed')
            : 'future';
        calendarDays.push({ date: i, status });
    }

    return (
        <SafeAreaView className="flex-1 bg-dark-900">
            <StatusBar barStyle="light-content" backgroundColor="#0f172a" />

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View className="flex-row items-center justify-between px-6 pt-4 pb-2">
                    <Text className="text-white text-2xl font-bold">Your Progress</Text>
                    <View className="flex-row">
                        <TouchableOpacity className="w-10 h-10 rounded-full bg-dark-800 items-center justify-center mr-2">
                            <Text className="text-lg">⚙️</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="w-10 h-10 rounded-full bg-dark-800 items-center justify-center">
                            <Text className="text-lg">👤</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Streak Card */}
                <View className="mx-6 mt-4 bg-gradient-to-b from-blue-900/40 to-dark-800 rounded-2xl p-6 items-center">
                    <Text className="text-5xl mb-2">🔥</Text>
                    <Text className="text-white text-4xl font-bold mb-1">
                        {streakCurrent || 12} Days
                    </Text>
                    <Text className="text-dark-400 mb-3">Current Streak</Text>
                    <View className="bg-dark-700/50 rounded-full px-4 py-2">
                        <Text className="text-yellow-500">
                            🏆 Longest: <Text className="text-blue-400">{streakLongest || 24} Days</Text>
                        </Text>
                    </View>
                </View>

                {/* Recovery Suggestion */}
                <View className="mx-6 mt-4 bg-dark-800 rounded-2xl p-4">
                    <View className="flex-row items-start">
                        <View className="w-10 h-10 rounded-full bg-blue-500/20 items-center justify-center mr-3">
                            <Text className="text-xl">💫</Text>
                        </View>
                        <View className="flex-1">
                            <Text className="text-white font-semibold mb-1">Recovery Suggestion</Text>
                            <Text className="text-dark-400 text-sm leading-5">
                                You missed a session yesterday. Try a lighter 15-minute review today to gently get back on track.
                            </Text>
                        </View>
                    </View>
                </View>

                {/* This Week's Focus */}
                <View className="mx-6 mt-6">
                    <View className="flex-row justify-between items-center mb-3">
                        <Text className="text-white text-lg font-semibold">This Week's Focus</Text>
                        <Text className="text-blue-500 font-semibold">
                            {Math.floor(totalHoursWeek)}h {Math.round((totalHoursWeek % 1) * 60)}m
                        </Text>
                    </View>
                    <WeeklyBarChart data={weeklyData} />
                </View>

                {/* Subject Breakdown */}
                <View className="mx-6 mt-6">
                    <Text className="text-white text-lg font-semibold mb-3">Subject Breakdown</Text>
                    <SubjectBreakdown subjects={subjectData} />
                </View>

                {/* Consistency */}
                <View className="mx-6 mt-6 mb-6">
                    <Text className="text-white text-lg font-semibold mb-3">Consistency</Text>
                    <ConsistencyCalendar days={calendarDays} />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
