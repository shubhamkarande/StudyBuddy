import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Switch,
    ScrollView,
    StatusBar,
    SafeAreaView,
    Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../../store';
import { logout } from '../../store/authSlice';

// Menu item component
const MenuItem = ({
    icon,
    iconBg,
    title,
    subtitle,
    onPress,
    rightElement,
}: {
    icon: string;
    iconBg: string;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    rightElement?: React.ReactNode;
}) => {
    return (
        <TouchableOpacity
            className="bg-white rounded-2xl p-4 flex-row items-center mb-3 shadow-sm"
            onPress={onPress}
            activeOpacity={onPress ? 0.7 : 1}
        >
            <View className={`w-12 h-12 rounded-xl items-center justify-center mr-4 ${iconBg}`}>
                <Text className="text-xl">{icon}</Text>
            </View>
            <View className="flex-1">
                <Text className="text-gray-900 font-semibold text-base">{title}</Text>
                {subtitle && (
                    <Text className="text-gray-500 text-sm mt-0.5">{subtitle}</Text>
                )}
            </View>
            {rightElement || (
                <Text className="text-gray-400">›</Text>
            )}
        </TouchableOpacity>
    );
};

// Section header component
const SectionHeader = ({ title }: { title: string }) => {
    return (
        <Text className="text-gray-400 text-xs font-semibold ml-4 mb-3 mt-6 tracking-wider">
            {title}
        </Text>
    );
};

export default function SettingsScreen() {
    const navigation = useNavigation();
    const dispatch = useAppDispatch();
    const { user } = useAppSelector(state => state.auth);
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);

    const handleLogout = () => {
        Alert.alert(
            'Log Out',
            'Are you sure you want to log out?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Log Out',
                    style: 'destructive',
                    onPress: () => dispatch(logout()),
                },
            ]
        );
    };

    const handleExportPDF = () => {
        Alert.alert(
            'Export Schedule',
            'Your study schedule will be downloaded as a PDF file.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Export',
                    onPress: () => {
                        // PDF export logic would go here
                        Alert.alert('Success', 'Schedule exported successfully!');
                    },
                },
            ]
        );
    };

    // Get user initials for avatar
    const getInitials = () => {
        if (!user?.displayName) return 'U';
        const names = user.displayName.split(' ');
        return names.map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-100">
            <StatusBar barStyle="dark-content" backgroundColor="#f3f4f6" />

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View className="flex-row items-center justify-between px-6 pt-4 pb-2">
                    <View className="flex-row items-center">
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            className="mr-3"
                        >
                            <Text className="text-gray-600 text-2xl">←</Text>
                        </TouchableOpacity>
                        <Text className="text-gray-900 text-2xl font-bold">Settings</Text>
                    </View>

                    {/* User avatar */}
                    <View className="w-10 h-10 rounded-full bg-blue-100 items-center justify-center">
                        <Text className="text-blue-600 font-semibold">{getInitials()}</Text>
                    </View>
                </View>

                {/* Account Section */}
                <View className="px-6">
                    <SectionHeader title="ACCOUNT" />
                    <MenuItem
                        icon="👤"
                        iconBg="bg-blue-100"
                        title="Profile & subjects"
                        subtitle="Manage your details & courses"
                        onPress={() => { }}
                    />
                </View>

                {/* Preferences Section */}
                <View className="px-6">
                    <SectionHeader title="PREFERENCES" />

                    <MenuItem
                        icon="🔔"
                        iconBg="bg-orange-100"
                        title="Notifications & reminders"
                        onPress={() => { }}
                    />

                    <MenuItem
                        icon="🌙"
                        iconBg="bg-gray-100"
                        title="Dark mode"
                        rightElement={
                            <Switch
                                value={isDarkMode}
                                onValueChange={setIsDarkMode}
                                trackColor={{ false: '#e5e7eb', true: '#3b82f6' }}
                                thumbColor={isDarkMode ? '#fff' : '#fff'}
                            />
                        }
                    />
                </View>

                {/* Data Section */}
                <View className="px-6">
                    <SectionHeader title="DATA" />

                    <MenuItem
                        icon="📄"
                        iconBg="bg-red-100"
                        title="Export schedule"
                        subtitle="Download as PDF"
                        onPress={handleExportPDF}
                        rightElement={
                            <Text className="text-gray-400 text-lg">⬇</Text>
                        }
                    />
                </View>

                {/* Logout Button */}
                <View className="px-6 mt-6">
                    <TouchableOpacity
                        className="bg-white rounded-2xl py-4 items-center border border-red-200"
                        onPress={handleLogout}
                        activeOpacity={0.7}
                    >
                        <View className="flex-row items-center">
                            <Text className="text-red-500 mr-2">↪</Text>
                            <Text className="text-red-500 font-semibold">Log out</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Version info */}
                <View className="items-center py-8">
                    <Text className="text-gray-400 text-sm">
                        StudyBuddy v1.0.4 • Build 2023
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
