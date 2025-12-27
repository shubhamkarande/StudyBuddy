import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StatusBar,
    SafeAreaView,
    Vibration,
    Modal,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../store';
import {
    startFocus,
    pauseFocus,
    resumeFocus,
    tick,
    endFocus,
} from '../../store/focusSlice';
import { incrementStreak } from '../../store/streakSlice';

// Format time as MM:SS
const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// Circular progress ring component
const CircularProgress = ({
    progress,
    size = 280,
    children,
}: {
    progress: number;
    size?: number;
    children: React.ReactNode;
}) => {
    // Progress from 0 to 1
    const strokeWidth = 6;
    const center = size / 2;
    const radius = center - strokeWidth;

    return (
        <View
            className="items-center justify-center"
            style={{ width: size, height: size }}
        >
            {/* Background circle */}
            <View
                className="absolute rounded-full"
                style={{
                    width: size,
                    height: size,
                    borderWidth: strokeWidth,
                    borderColor: '#1e293b',
                }}
            />
            {/* Progress circle - simplified representation */}
            <View
                className="absolute rounded-full"
                style={{
                    width: size,
                    height: size,
                    borderWidth: strokeWidth,
                    borderColor: '#3b82f6',
                    borderTopColor: progress > 0 ? '#3b82f6' : '#1e293b',
                    borderRightColor: progress > 0.25 ? '#3b82f6' : '#1e293b',
                    borderBottomColor: progress > 0.5 ? '#3b82f6' : '#1e293b',
                    borderLeftColor: progress > 0.75 ? '#3b82f6' : '#1e293b',
                    transform: [{ rotate: '-90deg' }],
                }}
            />
            {/* Inner glow effect */}
            <View
                className="absolute rounded-full bg-blue-500/5"
                style={{ width: size - 40, height: size - 40 }}
            />
            {/* Content */}
            <View className="items-center justify-center">
                {children}
            </View>
        </View>
    );
};

export default function FocusScreen() {
    const dispatch = useAppDispatch();
    const { currentSession, isActive, isPaused, elapsedSeconds } = useAppSelector(state => state.focus);
    const { todaySessions } = useAppSelector(state => state.planner);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Session settings
    const [targetMinutes, setTargetMinutes] = useState(25);
    const [selectedSubject, setSelectedSubject] = useState('Physics');
    const [sessionTitle, setSessionTitle] = useState('Quantum Mechanics Review');
    const [currentSessionIndex, setCurrentSessionIndex] = useState(3);
    const [totalSessions, setTotalSessions] = useState(4);
    const [showAdjustModal, setShowAdjustModal] = useState(false);

    // Duration presets
    const durationPresets = [15, 25, 45, 60, 90];

    // Start timer
    useEffect(() => {
        if (isActive && !isPaused) {
            timerRef.current = setInterval(() => {
                dispatch(tick());
            }, 1000);
        } else if (timerRef.current) {
            clearInterval(timerRef.current);
        }

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [isActive, isPaused, dispatch]);

    // Check if timer completed
    useEffect(() => {
        if (currentSession && elapsedSeconds >= targetMinutes * 60) {
            handleComplete();
        }
    }, [elapsedSeconds, targetMinutes, currentSession]);

    const handleStart = () => {
        Vibration.vibrate(100);
        dispatch(startFocus({
            sessionId: `focus_${Date.now()}`,
            subject: selectedSubject,
            startedAt: new Date().toISOString(),
            targetMinutes,
            elapsedSeconds: 0,
            isActive: true,
            isPaused: false,
        }));
    };

    const handlePause = () => {
        Vibration.vibrate(50);
        dispatch(isPaused ? resumeFocus() : pauseFocus());
    };

    const handleComplete = () => {
        Vibration.vibrate([100, 100, 100]);
        dispatch(endFocus({ completed: true }));
        dispatch(incrementStreak());
    };

    const handleCancel = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
        dispatch(endFocus({ completed: false }));
    };

    // Calculate progress
    const targetSeconds = targetMinutes * 60;
    const remainingSeconds = Math.max(0, targetSeconds - elapsedSeconds);
    const progress = targetSeconds > 0 ? elapsedSeconds / targetSeconds : 0;

    return (
        <SafeAreaView className="flex-1 bg-dark-900">
            <StatusBar barStyle="light-content" backgroundColor="#0f172a" />

            {/* Header */}
            <View className="flex-row items-center justify-between px-6 pt-4">
                <TouchableOpacity onPress={handleCancel} className="p-2">
                    <Text className="text-white text-2xl">˅</Text>
                </TouchableOpacity>
                <Text className="text-dark-400 text-sm font-medium tracking-widest">
                    FOCUS MODE
                </Text>
                <TouchableOpacity className="p-2">
                    <Text className="text-dark-400">•••</Text>
                </TouchableOpacity>
            </View>

            <View className="flex-1 items-center justify-center px-6">
                {/* Subject badge */}
                <View className="bg-dark-700 rounded-full px-4 py-2 flex-row items-center mb-4">
                    <View className="w-3 h-3 rounded-sm bg-blue-500 mr-2" />
                    <Text className="text-white font-medium">{selectedSubject}</Text>
                </View>

                {/* Session title */}
                <Text className="text-white text-2xl font-bold text-center mb-8">
                    {sessionTitle}
                </Text>

                {/* Timer circle */}
                <CircularProgress progress={progress} size={280}>
                    <Text className="text-white text-7xl font-light font-mono">
                        {formatTime(isActive ? remainingSeconds : targetMinutes * 60)}
                    </Text>
                    <Text className="text-dark-400 text-sm tracking-widest mt-2">
                        MINUTES LEFT
                    </Text>
                </CircularProgress>
            </View>

            {/* Bottom controls */}
            <View className="px-6 pb-8">
                {/* Start/Pause/Resume button */}
                {!isActive ? (
                    <TouchableOpacity
                        className="bg-blue-500 rounded-2xl py-4 flex-row items-center justify-center mb-8"
                        onPress={handleStart}
                        activeOpacity={0.8}
                    >
                        <Text className="text-white text-xl mr-2">▶</Text>
                        <Text className="text-white text-lg font-semibold">Start Focus</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        className={`rounded-2xl py-4 flex-row items-center justify-center mb-8 ${isPaused ? 'bg-blue-500' : 'bg-yellow-600'
                            }`}
                        onPress={handlePause}
                        activeOpacity={0.8}
                    >
                        <Text className="text-white text-lg font-semibold">
                            {isPaused ? '▶ Resume' : '⏸ Pause'}
                        </Text>
                    </TouchableOpacity>
                )}

                {/* Adjust and Sounds buttons */}
                <View className="flex-row justify-center items-center mb-6">
                    <TouchableOpacity
                        className="items-center mx-8"
                        onPress={() => setShowAdjustModal(true)}
                    >
                        <View className="w-12 h-12 rounded-full bg-dark-800 items-center justify-center mb-2">
                            <Text className="text-xl">⏱</Text>
                        </View>
                        <Text className="text-dark-400 text-xs">ADJUST</Text>
                    </TouchableOpacity>

                    <View className="w-px h-8 bg-dark-700" />

                    <TouchableOpacity className="items-center mx-8">
                        <View className="w-12 h-12 rounded-full bg-dark-800 items-center justify-center mb-2">
                            <Text className="text-xl">♪</Text>
                        </View>
                        <Text className="text-dark-400 text-xs">SOUNDS</Text>
                    </TouchableOpacity>
                </View>

                {/* Session indicator */}
                <View className="items-center">
                    <Text className="text-dark-400 text-sm mb-2">
                        SESSION {currentSessionIndex} OF {totalSessions}
                    </Text>
                    <View className="flex-row">
                        {Array.from({ length: totalSessions }).map((_, i) => (
                            <View
                                key={i}
                                className={`w-2 h-2 rounded-full mx-1 ${i < currentSessionIndex
                                        ? 'bg-blue-500'
                                        : i === currentSessionIndex
                                            ? 'w-4 border-2 border-blue-500 bg-transparent'
                                            : 'bg-dark-600'
                                    }`}
                            />
                        ))}
                    </View>
                </View>
            </View>

            {/* Adjust Modal */}
            <Modal
                visible={showAdjustModal}
                transparent
                animationType="slide"
            >
                <View className="flex-1 justify-end bg-black/50">
                    <View className="bg-dark-800 rounded-t-3xl p-6">
                        <Text className="text-white text-xl font-bold mb-4">Adjust Duration</Text>
                        <View className="flex-row flex-wrap justify-center">
                            {durationPresets.map((mins) => (
                                <TouchableOpacity
                                    key={mins}
                                    className={`m-2 px-6 py-3 rounded-xl ${targetMinutes === mins ? 'bg-blue-500' : 'bg-dark-700'
                                        }`}
                                    onPress={() => {
                                        setTargetMinutes(mins);
                                        setShowAdjustModal(false);
                                    }}
                                >
                                    <Text className={`font-medium ${targetMinutes === mins ? 'text-white' : 'text-dark-300'
                                        }`}>
                                        {mins} min
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <TouchableOpacity
                            className="mt-4 py-3 items-center"
                            onPress={() => setShowAdjustModal(false)}
                        >
                            <Text className="text-dark-400">Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}
