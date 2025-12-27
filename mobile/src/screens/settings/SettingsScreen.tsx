import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, StyleSheet, SafeAreaView, StatusBar, Alert } from 'react-native';
import { useAppSelector, useAppDispatch } from '../../store';
import { setUser } from '../../store/authSlice';
import { firebaseAuth } from '../../services/firebase';

export default function SettingsScreen() {
    const { user } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();
    const [notifications, setNotifications] = useState(true);
    const [darkMode, setDarkMode] = useState(true);
    const [sounds, setSounds] = useState(true);
    const [haptics, setHaptics] = useState(true);

    const handleLogout = async () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await firebaseAuth.signOut();
                            dispatch(setUser(null));
                        } catch (error) {
                            Alert.alert('Error', 'Failed to logout. Please try again.');
                        }
                    },
                },
            ]
        );
    };

    const settingSections = [
        {
            title: 'Preferences',
            items: [
                { icon: '🔔', label: 'Notifications', type: 'switch', value: notifications, onChange: setNotifications },
                { icon: '🌙', label: 'Dark Mode', type: 'switch', value: darkMode, onChange: setDarkMode },
                { icon: '🔊', label: 'Sounds', type: 'switch', value: sounds, onChange: setSounds },
                { icon: '📳', label: 'Haptic Feedback', type: 'switch', value: haptics, onChange: setHaptics },
            ],
        },
        {
            title: 'Study Settings',
            items: [
                { icon: '⏱️', label: 'Default Session', type: 'value', value: '25 min' },
                { icon: '☕', label: 'Break Duration', type: 'value', value: '5 min' },
                { icon: '🎯', label: 'Daily Goal', type: 'value', value: '4 hours' },
            ],
        },
        {
            title: 'About',
            items: [
                { icon: '📱', label: 'App Version', type: 'value', value: '1.0.0' },
                { icon: '📄', label: 'Privacy Policy', type: 'link' },
                { icon: '📋', label: 'Terms of Service', type: 'link' },
            ],
        },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#0f172a" />

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>Settings</Text>
                </View>

                {/* Profile Card */}
                <View style={styles.profileCard}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>
                            {user?.displayName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
                        </Text>
                    </View>
                    <View style={styles.profileInfo}>
                        <Text style={styles.profileName}>{user?.displayName || 'Student'}</Text>
                        <Text style={styles.profileEmail}>{user?.email}</Text>
                    </View>
                </View>

                {/* Setting Sections */}
                {settingSections.map((section) => (
                    <View key={section.title} style={styles.section}>
                        <Text style={styles.sectionTitle}>{section.title}</Text>
                        <View style={styles.sectionContent}>
                            {section.items.map((item, index) => (
                                <View
                                    key={item.label}
                                    style={[
                                        styles.settingRow,
                                        index < section.items.length - 1 && styles.settingRowBorder
                                    ]}
                                >
                                    <Text style={styles.settingIcon}>{item.icon}</Text>
                                    <Text style={styles.settingLabel}>{item.label}</Text>
                                    {item.type === 'switch' && (
                                        <Switch
                                            value={item.value as boolean}
                                            onValueChange={item.onChange as (value: boolean) => void}
                                            trackColor={{ false: '#334155', true: '#4ade80' }}
                                            thumbColor="#ffffff"
                                        />
                                    )}
                                    {item.type === 'value' && (
                                        <Text style={styles.settingValue}>{item.value}</Text>
                                    )}
                                    {item.type === 'link' && (
                                        <Text style={styles.settingArrow}>→</Text>
                                    )}
                                </View>
                            ))}
                        </View>
                    </View>
                ))}

                {/* Logout Button */}
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.logoutText}>🚪 Logout</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0f172a',
    },
    scrollView: {
        flex: 1,
        paddingHorizontal: 20,
    },
    header: {
        paddingTop: 20,
        marginBottom: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    profileCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1e293b',
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#4ade80',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    avatarText: {
        color: '#0f172a',
        fontSize: 24,
        fontWeight: 'bold',
    },
    profileInfo: {
        flex: 1,
    },
    profileName: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 4,
    },
    profileEmail: {
        color: '#94a3b8',
        fontSize: 14,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        color: '#94a3b8',
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 12,
        textTransform: 'uppercase',
    },
    sectionContent: {
        backgroundColor: '#1e293b',
        borderRadius: 12,
        overflow: 'hidden',
    },
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    settingRowBorder: {
        borderBottomWidth: 1,
        borderBottomColor: '#334155',
    },
    settingIcon: {
        fontSize: 20,
        marginRight: 12,
    },
    settingLabel: {
        flex: 1,
        color: '#ffffff',
        fontSize: 16,
    },
    settingValue: {
        color: '#94a3b8',
        fontSize: 14,
    },
    settingArrow: {
        color: '#94a3b8',
        fontSize: 18,
    },
    logoutButton: {
        backgroundColor: '#7f1d1d',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        marginBottom: 40,
    },
    logoutText: {
        color: '#fca5a5',
        fontSize: 16,
        fontWeight: '600',
    },
});
