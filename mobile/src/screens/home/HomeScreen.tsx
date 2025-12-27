import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StatusBar,
    SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppSelector } from '../../store';

// Session type colors
const sessionColors = {
    practice: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500' },
    reading: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500' },
    revision: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500' },
    writing: { bg: 'bg-pink-500/20', text: 'text-pink-400', border: 'border-pink-500' },
};

// Get greeting based on time
const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
};

// Format date
const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
    });
};

// Week days component
const WeekDays = ({ selectedDate }: { selectedDate: Date }) => {
    const today = new Date();
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const weekDays = [];
    for (let i = -2; i <= 3; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        weekDays.push(date);
    }

    return (
        <View className="flex-row justify-between px-2">
            {weekDays.map((date, index) => {
                const isToday = date.toDateString() === today.toDateString();
                return (
                    <TouchableOpacity
                        key={index}
                        className={`items-center py-2 px-3 rounded-xl ${isToday ? 'bg-primary-600' : ''}`}
                    >
                        <Text className={`text-xs mb-1 ${isToday ? 'text-white' : 'text-dark-400'}`}>
                            {dayNames[date.getDay()]}
                        </Text>
                        <Text className={`text-lg font-semibold ${isToday ? 'text-white' : 'text-white'}`}>
                            {date.getDate()}
                        </Text>
                        {isToday && <View className="w-1 h-1 rounded-full bg-white mt-1" />}
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

// Session card component
const SessionCard = ({ session, isNext = false }: { session: any; isNext?: boolean }) => {
    const colors = sessionColors[session.type as keyof typeof sessionColors] || sessionColors.reading;

    return (
        <View className={`bg-dark-800 rounded-2xl p-4 mb-3 ${isNext ? 'border-l-4 ' + colors.border : ''}`}>
            <View className="flex-row justify-between items-start mb-2">
                <View>
                    <Text className="text-dark-400 text-sm">{session.startTime}</Text>
                    <Text className="text-dark-500 text-xs">{session.endTime}</Text>
                </View>
                <View className={`px-3 py-1 rounded-full ${colors.bg}`}>
                    <Text className={`text-xs font-medium uppercase ${colors.text}`}>
                        {session.type}
                    </Text>
                </View>
            </View>

            <Text className="text-white text-lg font-semibold mb-1">{session.subject}</Text>

            {session.notes && (
                <Text className="text-dark-400 text-sm mb-3">{session.notes}</Text>
            )}

            {isNext && (
                <TouchableOpacity className="bg-primary-600 rounded-xl py-3 flex-row items-center justify-center mt-2">
                    <Text className="text-white mr-2">▶</Text>
                    <Text className="text-white font-semibold">Start Focus Session</Text>
                </TouchableOpacity>
            )}

            {session.status === 'completed' && (
                <View className="flex-row items-center mt-2">
                    <Text className="text-green-400 mr-1">✓</Text>
                    <Text className="text-green-400 text-sm">Completed</Text>
                </View>
            )}

            {session.status === 'missed' && (
                <View className="flex-row items-center justify-between mt-2">
                    <View className="flex-row items-center">
                        <Text className="text-dark-400 text-sm">Session missed</Text>
                    </View>
                    <TouchableOpacity className="bg-dark-700 rounded-lg px-3 py-1">
                        <Text className="text-dark-300 text-sm">Reschedule?</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

// Progress ring component
const ProgressRing = ({ progress, size = 100 }: { progress: number; size?: number }) => {
    return (
        <View className="items-center justify-center" style={{ width: size, height: size }}>
            <View className="absolute w-full h-full rounded-full border-8 border-dark-700" />
            <View
                className="absolute w-full h-full rounded-full border-8 border-primary-600"
                style={{
                    transform: [{ rotate: '-90deg' }],
                    borderRightColor: 'transparent',
                    borderBottomColor: progress > 25 ? '#4f46e5' : 'transparent',
                    borderLeftColor: progress > 50 ? '#4f46e5' : 'transparent',
                    borderTopColor: progress > 75 ? '#4f46e5' : 'transparent',
                }}
            />
            <Text className="text-white text-2xl font-bold">{progress}%</Text>
        </View>
    );
};

export default function HomeScreen() {
    const { user } = useAppSelector(state => state.auth);
    const { todaySessions, sessions } = useAppSelector(state => state.planner);
    const { current: streakCurrent } = useAppSelector(state => state.streak);
    const { totalFocusToday, completedSessionsToday } = useAppSelector(state => state.focus);

    // Calculate stats
    const totalMinutesToday = todaySessions.reduce((sum, s) => sum + s.plannedMinutes, 0);
    const completedMinutesToday = todaySessions
        .filter(s => s.status === 'completed')
        .reduce((sum, s) => sum + s.completedMinutes, 0);
    const progressPercent = totalMinutesToday > 0
        ? Math.round((completedMinutesToday / totalMinutesToday) * 100)
        : 0;

    // Demo sessions if none exist
    const displaySessions = todaySessions.length > 0 ? todaySessions : [
        {
            id: '1',
            subject: 'Advanced Calculus',
            type: 'practice',
            startTime: '14:00',
            endTime: '15:30',
            status: 'scheduled',
            notes: 'Chapter 4: Derivatives and Integrals review.',
        },
        {
            id: '2',
            subject: 'Organic Chemistry',
            type: 'reading',
            startTime: '16:00',
            endTime: '17:30',
            status: 'scheduled',
            notes: 'Lab preparation: Molecular structures.',
        },
        {
            id: '3',
            subject: 'History Essay',
            type: 'writing',
            startTime: '09:00',
            endTime: '10:00',
            status: 'missed',
        },
    ];

    const userName = user?.displayName || 'Student';

    return (
        <SafeAreaView className="flex-1 bg-dark-900">
            <StatusBar barStyle="light-content" backgroundColor="#0f172a" />

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View className="px-6 pt-4 pb-2">
                    <View className="flex-row justify-between items-center mb-4">
                        <View>
                            <Text className="text-dark-400 text-sm">{formatDate(new Date())}</Text>
                            <Text className="text-white text-2xl font-bold">
                                {getGreeting()}, {userName.split(' ')[0]}
                            </Text>
                        </View>
                        <TouchableOpacity className="w-12 h-12 rounded-full bg-dark-800 items-center justify-center">
                            <Text className="text-2xl">🔔</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Week calendar */}
                    <WeekDays selectedDate={new Date()} />
                </View>

                {/* Daily goal card */}
                <View className="mx-6 mt-6 bg-dark-800 rounded-2xl p-5">
                    <View className="flex-row items-center">
                        <ProgressRing progress={progressPercent} />
                        <View className="ml-6 flex-1">
                            <Text className="text-dark-400 text-xs uppercase tracking-wider mb-1">DAILY GOAL</Text>
                            <Text className="text-white text-2xl font-bold">
                                {Math.floor(completedMinutesToday / 60)}h {completedMinutesToday % 60}m
                                <Text className="text-dark-400 text-lg font-normal"> / {Math.floor(totalMinutesToday / 60)}h</Text>
                            </Text>
                            <View className="flex-row mt-2">
                                <View className="mr-6">
                                    <Text className="text-dark-400 text-xs">Completed</Text>
                                    <Text className="text-white font-semibold">{completedSessionsToday} Tasks</Text>
                                </View>
                                <View>
                                    <Text className="text-dark-400 text-xs">Focus Score</Text>
                                    <Text className="text-white font-semibold">85/100</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Up Next section */}
                <View className="px-6 mt-6">
                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-white text-xl font-bold">Up Next</Text>
                        <TouchableOpacity>
                            <Text className="text-primary-500 font-medium">View Schedule</Text>
                        </TouchableOpacity>
                    </View>

                    {displaySessions.map((session, index) => (
                        <SessionCard
                            key={session.id}
                            session={session}
                            isNext={index === 0 && session.status === 'scheduled'}
                        />
                    ))}
                </View>

                {/* Study tip */}
                <View className="mx-6 mt-4 mb-6 bg-dark-800 rounded-2xl p-4">
                    <View className="flex-row items-start">
                        <Text className="text-2xl mr-3">💡</Text>
                        <View className="flex-1">
                            <Text className="text-white font-semibold mb-1">Study Tip</Text>
                            <Text className="text-dark-400 text-sm">
                                Try the Pomodoro technique for your calculus session today. 25 minutes focus, 5 minutes break.
                            </Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
