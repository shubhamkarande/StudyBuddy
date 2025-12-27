import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, Animated } from 'react-native';
import { useAppSelector, useAppDispatch } from '../../store';
import { startTimer, pauseTimer, resetTimer, tick, setSessionMinutes } from '../../store/focusSlice';

export default function FocusScreen() {
    const dispatch = useAppDispatch();
    const { isRunning, isPaused, timeRemaining, sessionMinutes } = useAppSelector((state) => state.focus);
    const [selectedSubject, setSelectedSubject] = useState('Mathematics');
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (isRunning && !isPaused && timeRemaining > 0) {
            interval = setInterval(() => {
                dispatch(tick());
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isRunning, isPaused, timeRemaining, dispatch]);

    useEffect(() => {
        if (isRunning && !isPaused) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, { toValue: 1.05, duration: 1000, useNativeDriver: true }),
                    Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
                ])
            ).start();
        } else {
            pulseAnim.setValue(1);
        }
    }, [isRunning, isPaused]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const progress = 1 - (timeRemaining / (sessionMinutes * 60));

    const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology'];
    const durations = [15, 25, 45, 60];

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#0f172a" />

            <View style={styles.content}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>Focus Mode</Text>
                    <Text style={styles.subtitle}>Stay concentrated and productive</Text>
                </View>

                {/* Subject Selector */}
                <View style={styles.subjectContainer}>
                    <Text style={styles.sectionLabel}>Subject</Text>
                    <View style={styles.subjectRow}>
                        {subjects.map((subject) => (
                            <TouchableOpacity
                                key={subject}
                                style={[
                                    styles.subjectPill,
                                    selectedSubject === subject && styles.subjectPillActive
                                ]}
                                onPress={() => setSelectedSubject(subject)}
                            >
                                <Text style={[
                                    styles.subjectText,
                                    selectedSubject === subject && styles.subjectTextActive
                                ]}>{subject.substring(0, 4)}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Timer Circle */}
                <Animated.View style={[styles.timerContainer, { transform: [{ scale: pulseAnim }] }]}>
                    <View style={styles.timerOuter}>
                        <View style={styles.timerInner}>
                            <Text style={styles.timerText}>{formatTime(timeRemaining)}</Text>
                            <Text style={styles.timerLabel}>
                                {isRunning ? (isPaused ? 'Paused' : 'Focus Time') : 'Ready'}
                            </Text>
                        </View>
                    </View>
                </Animated.View>

                {/* Duration Selector */}
                <View style={styles.durationContainer}>
                    <Text style={styles.sectionLabel}>Duration (minutes)</Text>
                    <View style={styles.durationRow}>
                        {durations.map((dur) => (
                            <TouchableOpacity
                                key={dur}
                                style={[
                                    styles.durationButton,
                                    sessionMinutes === dur && styles.durationButtonActive
                                ]}
                                onPress={() => dispatch(setSessionMinutes(dur))}
                                disabled={isRunning}
                            >
                                <Text style={[
                                    styles.durationText,
                                    sessionMinutes === dur && styles.durationTextActive
                                ]}>{dur}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Controls */}
                <View style={styles.controls}>
                    {!isRunning ? (
                        <TouchableOpacity
                            style={styles.startButton}
                            onPress={() => dispatch(startTimer())}
                        >
                            <Text style={styles.startButtonText}>▶ Start Focus</Text>
                        </TouchableOpacity>
                    ) : (
                        <View style={styles.controlRow}>
                            <TouchableOpacity
                                style={styles.pauseButton}
                                onPress={() => dispatch(pauseTimer())}
                            >
                                <Text style={styles.pauseButtonText}>
                                    {isPaused ? '▶ Resume' : '⏸ Pause'}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.resetButton}
                                onPress={() => dispatch(resetTimer())}
                            >
                                <Text style={styles.resetButtonText}>↻ Reset</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
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
        paddingHorizontal: 24,
        paddingTop: 20,
    },
    header: {
        alignItems: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: '#94a3b8',
    },
    sectionLabel: {
        color: '#94a3b8',
        fontSize: 14,
        marginBottom: 12,
    },
    subjectContainer: {
        marginBottom: 24,
    },
    subjectRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    subjectPill: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: '#1e293b',
        borderRadius: 20,
    },
    subjectPillActive: {
        backgroundColor: '#4ade80',
    },
    subjectText: {
        color: '#94a3b8',
        fontSize: 14,
        fontWeight: '600',
    },
    subjectTextActive: {
        color: '#0f172a',
    },
    timerContainer: {
        alignItems: 'center',
        marginBottom: 32,
    },
    timerOuter: {
        width: 220,
        height: 220,
        borderRadius: 110,
        backgroundColor: '#1e293b',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderColor: '#4ade80',
    },
    timerInner: {
        alignItems: 'center',
    },
    timerText: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    timerLabel: {
        fontSize: 16,
        color: '#94a3b8',
        marginTop: 8,
    },
    durationContainer: {
        marginBottom: 32,
    },
    durationRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    durationButton: {
        flex: 1,
        marginHorizontal: 4,
        paddingVertical: 12,
        backgroundColor: '#1e293b',
        borderRadius: 12,
        alignItems: 'center',
    },
    durationButtonActive: {
        backgroundColor: '#4ade80',
    },
    durationText: {
        color: '#94a3b8',
        fontSize: 16,
        fontWeight: '600',
    },
    durationTextActive: {
        color: '#0f172a',
    },
    controls: {
        flex: 1,
        justifyContent: 'center',
    },
    startButton: {
        backgroundColor: '#4ade80',
        borderRadius: 16,
        paddingVertical: 18,
        alignItems: 'center',
    },
    startButtonText: {
        color: '#0f172a',
        fontSize: 20,
        fontWeight: 'bold',
    },
    controlRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    pauseButton: {
        flex: 1,
        backgroundColor: '#4ade80',
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        marginRight: 8,
    },
    pauseButtonText: {
        color: '#0f172a',
        fontSize: 16,
        fontWeight: 'bold',
    },
    resetButton: {
        flex: 1,
        backgroundColor: '#ef4444',
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        marginLeft: 8,
    },
    resetButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
