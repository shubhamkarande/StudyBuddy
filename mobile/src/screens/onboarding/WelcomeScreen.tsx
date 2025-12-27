import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    StatusBar,
    SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function WelcomeScreen() {
    const navigation = useNavigation<NavigationProp>();

    return (
        <SafeAreaView className="flex-1 bg-dark-900">
            <StatusBar barStyle="light-content" backgroundColor="#0f172a" />

            <View className="flex-1 px-6 pt-8">
                {/* Step indicator */}
                <View className="items-center mb-8">
                    <Text className="text-dark-400 text-sm font-medium tracking-widest mb-2">
                        STEP 1 OF 5
                    </Text>
                    <View className="flex-row space-x-2">
                        <View className="w-8 h-1.5 rounded-full bg-primary-600" />
                        <View className="w-2 h-1.5 rounded-full bg-dark-700" />
                        <View className="w-2 h-1.5 rounded-full bg-dark-700" />
                        <View className="w-2 h-1.5 rounded-full bg-dark-700" />
                        <View className="w-2 h-1.5 rounded-full bg-dark-700" />
                    </View>
                </View>

                {/* Hero Image */}
                <View className="items-center mb-10">
                    <View className="w-80 h-64 rounded-2xl bg-dark-800 items-center justify-center overflow-hidden">
                        {/* Placeholder for hero image - books, clock, calendar */}
                        <View className="bg-emerald-600 w-full h-full items-center justify-center p-4">
                            <Text className="text-6xl mb-2">📚</Text>
                            <View className="flex-row space-x-4">
                                <Text className="text-4xl">⏰</Text>
                                <Text className="text-4xl">📅</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Tagline */}
                <View className="items-center mb-6">
                    <Text className="text-white text-4xl font-bold text-center mb-2">
                        Focus. Plan.
                    </Text>
                    <Text className="text-primary-500 text-4xl font-bold text-center">
                        Succeed.
                    </Text>
                </View>

                {/* Subtitle */}
                <Text className="text-dark-400 text-center text-lg px-4 mb-auto">
                    Master your schedule and crush your exams with the ultimate student planner.
                </Text>
            </View>

            {/* Bottom section */}
            <View className="px-6 pb-8">
                {/* Get Started button */}
                <TouchableOpacity
                    className="bg-primary-600 rounded-2xl py-4 flex-row items-center justify-center mb-4"
                    onPress={() => navigation.navigate('Register')}
                    activeOpacity={0.8}
                >
                    <Text className="text-white text-lg font-semibold mr-2">
                        Get Started
                    </Text>
                    <Text className="text-white text-lg">→</Text>
                </TouchableOpacity>

                {/* Login link */}
                <TouchableOpacity
                    className="py-2"
                    onPress={() => navigation.navigate('Login')}
                >
                    <Text className="text-dark-400 text-center">
                        Already have an account?{' '}
                        <Text className="text-white font-semibold">Log in</Text>
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
