import React from 'react';
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
import { setDailyHours, nextStep } from '../../store/onboardingSlice';
import { RootStackParamList } from '../../types';
import Slider from '@react-native-community/slider';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function AvailabilityScreen() {
    const navigation = useNavigation<NavigationProp>();
    const dispatch = useAppDispatch();
    const { dailyHours } = useAppSelector(state => state.onboarding);

    const handleHoursChange = (value: number) => {
        dispatch(setDailyHours(Math.round(value * 2) / 2)); // Round to 0.5 increments
    };

    const handleContinue = () => {
        dispatch(nextStep());
        navigation.navigate('PlanSummary');
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
                        STEP 4 OF 5
                    </Text>
                </View>

                {/* Progress bar */}
                <View className="flex-row space-x-1 mb-8">
                    <View className="flex-1 h-1.5 rounded-full bg-primary-600" />
                    <View className="flex-1 h-1.5 rounded-full bg-primary-600" />
                    <View className="flex-1 h-1.5 rounded-full bg-primary-600" />
                    <View className="flex-1 h-1.5 rounded-full bg-primary-600" />
                    <View className="flex-1 h-1.5 rounded-full bg-dark-700" />
                </View>
            </View>

            <View className="flex-1 px-6 justify-center">
                {/* Title */}
                <Text className="text-white text-3xl font-bold text-center mb-2">
                    How many hours can you study today?
                </Text>
                <Text className="text-dark-400 text-center text-base mb-16">
                    Set a goal that challenges you but keeps you sane.
                </Text>

                {/* Hours display */}
                <View className="items-center mb-12">
                    <View className="flex-row items-baseline">
                        <Text className="text-primary-500 text-8xl font-bold">
                            {dailyHours}
                        </Text>
                        <Text className="text-dark-400 text-3xl ml-2">hrs</Text>
                    </View>
                </View>

                {/* Slider */}
                <View className="mb-8">
                    <Slider
                        style={{ width: '100%', height: 50 }}
                        minimumValue={0.5}
                        maximumValue={12}
                        step={0.5}
                        value={dailyHours}
                        onValueChange={handleHoursChange}
                        minimumTrackTintColor="#4f46e5"
                        maximumTrackTintColor="#334155"
                        thumbTintColor="#4f46e5"
                    />
                    <View className="flex-row justify-between mt-2">
                        <Text className="text-dark-400">0h</Text>
                        <Text className="text-dark-400">6h</Text>
                        <Text className="text-dark-400">12h+</Text>
                    </View>
                </View>

                {/* Tip */}
                <View className="items-center">
                    <View className="flex-row items-center">
                        <Text className="text-warning mr-2">⚠️</Text>
                        <Text className="text-warning text-sm">
                            Be realistic to avoid burnout.
                        </Text>
                    </View>
                </View>
            </View>

            {/* Continue button */}
            <View className="px-6 pb-8">
                <TouchableOpacity
                    className="bg-primary-600 rounded-2xl py-4 flex-row items-center justify-center"
                    onPress={handleContinue}
                    activeOpacity={0.8}
                >
                    <Text className="text-white text-lg font-semibold mr-2">
                        Continue
                    </Text>
                    <Text className="text-white">→</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
