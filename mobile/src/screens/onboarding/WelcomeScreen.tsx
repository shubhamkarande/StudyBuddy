import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function WelcomeScreen() {
    const navigation = useNavigation<NavigationProp>();

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#0f172a" />

            <View style={styles.content}>
                {/* Logo */}
                <View style={styles.logoContainer}>
                    <Text style={styles.emoji}>📚</Text>
                    <Text style={styles.title}>StudyBuddy</Text>
                    <Text style={styles.subtitle}>Your AI-Powered Study Companion</Text>
                </View>

                {/* Features */}
                <View style={styles.features}>
                    <View style={styles.feature}>
                        <Text style={styles.featureIcon}>📅</Text>
                        <View style={styles.featureText}>
                            <Text style={styles.featureTitle}>Smart Planning</Text>
                            <Text style={styles.featureDesc}>AI-generated study schedules</Text>
                        </View>
                    </View>
                    <View style={styles.feature}>
                        <Text style={styles.featureIcon}>🎯</Text>
                        <View style={styles.featureText}>
                            <Text style={styles.featureTitle}>Focus Mode</Text>
                            <Text style={styles.featureDesc}>Pomodoro timer with ambient sounds</Text>
                        </View>
                    </View>
                    <View style={styles.feature}>
                        <Text style={styles.featureIcon}>📊</Text>
                        <View style={styles.featureText}>
                            <Text style={styles.featureTitle}>Track Progress</Text>
                            <Text style={styles.featureDesc}>Visual analytics and streaks</Text>
                        </View>
                    </View>
                </View>

                {/* Buttons */}
                <View style={styles.buttons}>
                    <TouchableOpacity
                        style={styles.primaryButton}
                        onPress={() => navigation.navigate('Register')}
                    >
                        <Text style={styles.primaryButtonText}>Get Started</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.secondaryButton}
                        onPress={() => navigation.navigate('Login')}
                    >
                        <Text style={styles.secondaryButtonText}>I already have an account</Text>
                    </TouchableOpacity>
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
        paddingTop: 60,
        paddingBottom: 40,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 48,
    },
    emoji: {
        fontSize: 80,
        marginBottom: 16,
    },
    title: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#94a3b8',
        textAlign: 'center',
    },
    features: {
        flex: 1,
        justifyContent: 'center',
    },
    feature: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1e293b',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
    },
    featureIcon: {
        fontSize: 32,
        marginRight: 16,
    },
    featureText: {
        flex: 1,
    },
    featureTitle: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 4,
    },
    featureDesc: {
        color: '#94a3b8',
        fontSize: 14,
    },
    buttons: {
        marginTop: 32,
    },
    primaryButton: {
        backgroundColor: '#4ade80',
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        marginBottom: 16,
    },
    primaryButtonText: {
        color: '#0f172a',
        fontSize: 18,
        fontWeight: 'bold',
    },
    secondaryButton: {
        borderWidth: 1,
        borderColor: '#4ade80',
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
    },
    secondaryButtonText: {
        color: '#4ade80',
        fontSize: 16,
        fontWeight: '600',
    },
});
