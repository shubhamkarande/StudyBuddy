import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Slider from '@react-native-community/slider';
import { useAppDispatch } from '../../store';
import { setDailyHours } from '../../store/onboardingSlice';
import { RootStackParamList } from '../../types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function AvailabilityScreen() {
    const navigation = useNavigation<NavigationProp>();
    const dispatch = useAppDispatch();
    const [hours, setHours] = useState(3);

    const handleContinue = () => {
        dispatch(setDailyHours(hours));
        navigation.navigate('PlanSummary');
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
                        <View style={styles.stepCompleted} />
                        <View style={styles.stepActive} />
                    </View>
                </View>

                {/* Title */}
                <Text style={styles.title}>Daily study time</Text>
                <Text style={styles.subtitle}>How many hours can you dedicate to studying each day?</Text>

                {/* Hours Display */}
                <View style={styles.hoursDisplay}>
                    <Text style={styles.hoursNumber}>{hours}</Text>
                    <Text style={styles.hoursLabel}>hours/day</Text>
                </View>

                {/* Slider */}
                <View style={styles.sliderContainer}>
                    <Text style={styles.sliderLabel}>1</Text>
                    <Slider
                        style={styles.slider}
                        minimumValue={1}
                        maximumValue={8}
                        step={0.5}
                        value={hours}
                        onValueChange={setHours}
                        minimumTrackTintColor="#4ade80"
                        maximumTrackTintColor="#334155"
                        thumbTintColor="#4ade80"
                    />
                    <Text style={styles.sliderLabel}>8</Text>
                </View>

                {/* Tips */}
                <View style={styles.tipCard}>
                    <Text style={styles.tipIcon}>💡</Text>
                    <Text style={styles.tipText}>
                        We recommend 2-4 hours of focused study per day for optimal retention.
                    </Text>
                </View>

                {/* Weekly Summary */}
                <View style={styles.summaryCard}>
                    <Text style={styles.summaryTitle}>Weekly Study Time</Text>
                    <Text style={styles.summaryValue}>{(hours * 7).toFixed(0)} hours</Text>
                </View>

                <View style={styles.spacer} />

                {/* Continue Button */}
                <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
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
        marginBottom: 40,
    },
    hoursDisplay: {
        alignItems: 'center',
        marginBottom: 40,
    },
    hoursNumber: {
        fontSize: 80,
        fontWeight: 'bold',
        color: '#4ade80',
    },
    hoursLabel: {
        fontSize: 18,
        color: '#94a3b8',
    },
    sliderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        marginBottom: 32,
    },
    slider: {
        flex: 1,
        marginHorizontal: 12,
    },
    sliderLabel: {
        color: '#94a3b8',
        fontSize: 16,
    },
    tipCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#1e293b',
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
    },
    tipIcon: {
        fontSize: 24,
        marginRight: 12,
    },
    tipText: {
        flex: 1,
        color: '#94a3b8',
        fontSize: 14,
        lineHeight: 20,
    },
    summaryCard: {
        backgroundColor: '#1e293b',
        borderRadius: 12,
        padding: 20,
        alignItems: 'center',
    },
    summaryTitle: {
        color: '#94a3b8',
        fontSize: 14,
        marginBottom: 8,
    },
    summaryValue: {
        color: '#ffffff',
        fontSize: 32,
        fontWeight: 'bold',
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
    continueText: {
        color: '#0f172a',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
