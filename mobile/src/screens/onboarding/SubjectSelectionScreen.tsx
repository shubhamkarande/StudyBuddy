import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    ScrollView,
    StatusBar,
    SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppDispatch, useAppSelector } from '../../store';
import { toggleSubject, nextStep } from '../../store/onboardingSlice';
import { RootStackParamList, AVAILABLE_SUBJECTS } from '../../types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Subject icons mapping
const subjectIcons: Record<string, string> = {
    Mathematics: '📐',
    Physics: '⚛️',
    Chemistry: '🧪',
    Biology: '🧬',
    History: '📜',
    Literature: '📚',
    'Computer Science': '💻',
    Economics: '📊',
    Psychology: '🧠',
    Languages: '🌍',
};

export default function SubjectSelectionScreen() {
    const navigation = useNavigation<NavigationProp>();
    const dispatch = useAppDispatch();
    const { subjects } = useAppSelector(state => state.onboarding);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredSubjects = AVAILABLE_SUBJECTS.filter(subject =>
        subject.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSubjectToggle = (subjectName: string) => {
        dispatch(toggleSubject(subjectName));
    };

    const handleContinue = () => {
        if (subjects.length > 0) {
            dispatch(nextStep());
            navigation.navigate('ExamDates');
        }
    };

    const isSelected = (subjectName: string) => subjects.includes(subjectName);
    const completionPercent = Math.min(Math.round((subjects.length / 3) * 40), 40);

    return (
        <SafeAreaView className="flex-1 bg-dark-900">
            <StatusBar barStyle="light-content" backgroundColor="#0f172a" />

            {/* Header */}
            <View className="px-6 pt-4 pb-2">
                <View className="flex-row items-center mb-4">
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        className="p-2 -ml-2"
                    >
                        <Text className="text-white text-2xl">←</Text>
                    </TouchableOpacity>
                    <Text className="flex-1 text-white text-lg font-semibold text-center mr-8">
                        Subject Selection
                    </Text>
                </View>

                {/* Progress bar */}
                <View className="flex-row items-center justify-between mb-6">
                    <Text className="text-dark-400 text-sm">STEP 2 OF 5</Text>
                    <Text className="text-primary-500 text-sm font-medium">
                        {completionPercent}% Completed
                    </Text>
                </View>
                <View className="h-1.5 bg-dark-700 rounded-full mb-6">
                    <View
                        className="h-1.5 bg-primary-600 rounded-full"
                        style={{ width: `${completionPercent}%` }}
                    />
                </View>
            </View>

            <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
                {/* Title */}
                <Text className="text-white text-3xl font-bold mb-2">
                    What are you studying?
                </Text>
                <Text className="text-dark-400 text-base mb-6">
                    Select all subjects included in your curriculum to personalize your study plan.
                </Text>

                {/* Search input */}
                <View className="bg-dark-800 rounded-xl flex-row items-center px-4 py-3 mb-6">
                    <Text className="text-dark-400 text-xl mr-3">🔍</Text>
                    <TextInput
                        className="flex-1 text-white text-base"
                        placeholder="Search subjects..."
                        placeholderTextColor="#64748b"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                {/* Subject grid */}
                <View className="flex-row flex-wrap justify-between pb-24">
                    {filteredSubjects.map((subject) => (
                        <TouchableOpacity
                            key={subject.id}
                            className={`w-[48%] mb-4 rounded-2xl p-4 ${isSelected(subject.name) ? 'bg-primary-900 border-2 border-primary-600' : 'bg-dark-800'
                                }`}
                            onPress={() => handleSubjectToggle(subject.name)}
                            activeOpacity={0.7}
                        >
                            <View className="flex-row justify-between items-start mb-3">
                                <View className="w-12 h-12 rounded-xl bg-dark-700 items-center justify-center">
                                    <Text className="text-2xl">{subjectIcons[subject.name] || '📖'}</Text>
                                </View>
                                <View className={`w-6 h-6 rounded-full border-2 items-center justify-center ${isSelected(subject.name)
                                        ? 'bg-primary-600 border-primary-600'
                                        : 'border-dark-600'
                                    }`}>
                                    {isSelected(subject.name) && (
                                        <Text className="text-white text-xs">✓</Text>
                                    )}
                                </View>
                            </View>
                            <Text className="text-white font-semibold text-base">
                                {subject.name}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>

            {/* Continue button */}
            <View className="absolute bottom-0 left-0 right-0 px-6 pb-8 pt-4 bg-dark-900">
                <TouchableOpacity
                    className={`rounded-2xl py-4 items-center ${subjects.length > 0 ? 'bg-primary-600' : 'bg-dark-700'
                        }`}
                    onPress={handleContinue}
                    disabled={subjects.length === 0}
                    activeOpacity={0.8}
                >
                    <Text className={`text-lg font-semibold ${subjects.length > 0 ? 'text-white' : 'text-dark-400'
                        }`}>
                        Continue
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
