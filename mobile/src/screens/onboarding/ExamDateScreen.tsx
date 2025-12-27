import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StatusBar,
    SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppDispatch, useAppSelector } from '../../store';
import { setExamDate, nextStep } from '../../store/onboardingSlice';
import { RootStackParamList } from '../../types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Simple calendar component
const SimpleCalendar = ({
    selectedDate,
    onSelectDate
}: {
    selectedDate: Date | null;
    onSelectDate: (date: Date) => void;
}) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const daysInMonth = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() + 1,
        0
    ).getDate();

    const firstDayOfMonth = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        1
    ).getDay();

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    const prevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    };

    const isSelected = (day: number) => {
        if (!selectedDate) return false;
        return (
            selectedDate.getDate() === day &&
            selectedDate.getMonth() === currentMonth.getMonth() &&
            selectedDate.getFullYear() === currentMonth.getFullYear()
        );
    };

    const isToday = (day: number) => {
        const today = new Date();
        return (
            today.getDate() === day &&
            today.getMonth() === currentMonth.getMonth() &&
            today.getFullYear() === currentMonth.getFullYear()
        );
    };

    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
        days.push(<View key={`empty-${i}`} className="w-10 h-10" />);
    }
    for (let day = 1; day <= daysInMonth; day++) {
        days.push(
            <TouchableOpacity
                key={day}
                className={`w-10 h-10 items-center justify-center rounded-full ${isSelected(day)
                        ? 'bg-primary-600'
                        : isToday(day)
                            ? 'bg-dark-700'
                            : ''
                    }`}
                onPress={() => onSelectDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day))}
            >
                <Text className={`text-base ${isSelected(day) ? 'text-white font-bold' : 'text-white'
                    }`}>
                    {day}
                </Text>
            </TouchableOpacity>
        );
    }

    return (
        <View className="bg-dark-800 rounded-2xl p-4">
            {/* Month navigation */}
            <View className="flex-row items-center justify-between mb-4">
                <TouchableOpacity onPress={prevMonth} className="p-2">
                    <Text className="text-white text-xl">‹</Text>
                </TouchableOpacity>
                <Text className="text-white text-lg font-semibold">
                    {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </Text>
                <TouchableOpacity onPress={nextMonth} className="p-2">
                    <Text className="text-white text-xl">›</Text>
                </TouchableOpacity>
            </View>

            {/* Day names */}
            <View className="flex-row justify-around mb-2">
                {dayNames.map((name, i) => (
                    <View key={i} className="w-10 items-center">
                        <Text className="text-dark-400 text-sm">{name}</Text>
                    </View>
                ))}
            </View>

            {/* Calendar grid */}
            <View className="flex-row flex-wrap justify-around">
                {days}
            </View>
        </View>
    );
};

export default function ExamDateScreen() {
    const navigation = useNavigation<NavigationProp>();
    const dispatch = useAppDispatch();
    const { examDate } = useAppSelector(state => state.onboarding);
    const [selectedDate, setSelectedDate] = useState<Date | null>(
        examDate ? new Date(examDate) : null
    );

    const handleSelectDate = (date: Date) => {
        setSelectedDate(date);
        dispatch(setExamDate(date.toISOString()));
    };

    const handleNext = () => {
        if (selectedDate) {
            dispatch(nextStep());
            navigation.navigate('Availability');
        }
    };

    // Calculate days until exam
    const daysUntilExam = selectedDate
        ? Math.ceil((selectedDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
        : null;

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        });
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
                    <Text className="flex-1 text-dark-400 text-sm text-center mr-8">
                        STEP 3 OF 5
                    </Text>
                </View>

                {/* Progress bar */}
                <View className="flex-row space-x-1 mb-8">
                    <View className="flex-1 h-1.5 rounded-full bg-primary-600" />
                    <View className="flex-1 h-1.5 rounded-full bg-primary-600" />
                    <View className="flex-1 h-1.5 rounded-full bg-primary-600" />
                    <View className="flex-1 h-1.5 rounded-full bg-dark-700" />
                    <View className="flex-1 h-1.5 rounded-full bg-dark-700" />
                </View>
            </View>

            <View className="flex-1 px-6">
                {/* Title */}
                <Text className="text-white text-3xl font-bold mb-2">
                    When is your next big exam?
                </Text>
                <Text className="text-dark-400 text-base mb-8">
                    Knowing your deadline helps us build your perfect study plan.
                </Text>

                {/* Calendar */}
                <SimpleCalendar
                    selectedDate={selectedDate}
                    onSelectDate={handleSelectDate}
                />

                {/* Selected date display */}
                {selectedDate && (
                    <View className="items-center mt-8">
                        <Text className="text-white text-2xl font-bold mb-2">
                            {formatDate(selectedDate)}
                        </Text>
                        {daysUntilExam !== null && daysUntilExam > 0 && (
                            <View className="bg-primary-900 rounded-full px-4 py-2">
                                <Text className="text-primary-400 font-medium">
                                    ⏰ That's in {daysUntilExam} days!
                                </Text>
                            </View>
                        )}
                    </View>
                )}
            </View>

            {/* Next button */}
            <View className="px-6 pb-8">
                <TouchableOpacity
                    className={`rounded-2xl py-4 flex-row items-center justify-center ${selectedDate ? 'bg-primary-600' : 'bg-dark-700'
                        }`}
                    onPress={handleNext}
                    disabled={!selectedDate}
                    activeOpacity={0.8}
                >
                    <Text className={`text-lg font-semibold mr-2 ${selectedDate ? 'text-white' : 'text-dark-400'
                        }`}>
                        Next
                    </Text>
                    <Text className={selectedDate ? 'text-white' : 'text-dark-400'}>→</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
