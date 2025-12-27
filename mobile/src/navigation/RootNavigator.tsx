import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useAppSelector } from '../store';
import { RootStackParamList, MainTabParamList } from '../types';

// Import screens
import WelcomeScreen from '../screens/onboarding/WelcomeScreen';
import SubjectSelectionScreen from '../screens/onboarding/SubjectSelectionScreen';
import ExamDateScreen from '../screens/onboarding/ExamDateScreen';
import AvailabilityScreen from '../screens/onboarding/AvailabilityScreen';
import PlanSummaryScreen from '../screens/onboarding/PlanSummaryScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import HomeScreen from '../screens/home/HomeScreen';
import FocusScreen from '../screens/focus/FocusScreen';
import ProgressScreen from '../screens/analytics/ProgressScreen';
import InsightsScreen from '../screens/analytics/InsightsScreen';
import SettingsScreen from '../screens/settings/SettingsScreen';

// Tab icons component - defined outside of navigator
const TabIconContent = ({ name, focused }: { name: string; focused: boolean }) => {
    const icons: Record<string, string> = {
        Home: '🏠',
        Focus: '⏱️',
        Progress: '📊',
        Insights: '💡',
    };
    return (
        <View style={[styles.tabIcon, { opacity: focused ? 1 : 0.5 }]}>
            <Text style={styles.tabIconText}>{icons[name]}</Text>
        </View>
    );
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

// Main tab navigator
function MainTabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ focused }) => <TabIconContent name={route.name} focused={focused} />,
                tabBarActiveTintColor: '#4f46e5',
                tabBarInactiveTintColor: '#64748b',
                tabBarStyle: {
                    backgroundColor: '#0f172a',
                    borderTopColor: '#1e293b',
                    borderTopWidth: 1,
                    paddingTop: 8,
                    paddingBottom: 8,
                    height: 70,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '600',
                    marginTop: 4,
                },
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Focus" component={FocusScreen} />
            <Tab.Screen name="Progress" component={ProgressScreen} />
            <Tab.Screen name="Insights" component={InsightsScreen} />
        </Tab.Navigator>
    );
}

// Onboarding stack navigator
function OnboardingStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="SubjectSelection" component={SubjectSelectionScreen} />
            <Stack.Screen name="ExamDate" component={ExamDateScreen} />
            <Stack.Screen name="Availability" component={AvailabilityScreen} />
            <Stack.Screen name="PlanSummary" component={PlanSummaryScreen} />
        </Stack.Navigator>
    );
}

// Root navigator
export default function RootNavigator() {
    const { isAuthenticated, isLoading } = useAppSelector(state => state.auth);
    const { step: onboardingStep } = useAppSelector(state => state.onboarding);

    // Onboarding is complete when step reaches 5
    const onboardingComplete = onboardingStep >= 5;

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4f46e5" />
                <Text style={styles.loadingText}>Loading...</Text>
            </View>
        );
    }

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {!isAuthenticated ? (
                    <>
                        <Stack.Screen name="Auth" component={WelcomeScreen} />
                        <Stack.Screen name="Login" component={LoginScreen} />
                        <Stack.Screen name="Register" component={RegisterScreen} />
                    </>
                ) : !onboardingComplete ? (
                    <Stack.Screen name="Onboarding" component={OnboardingStack} />
                ) : (
                    <>
                        <Stack.Screen name="Main" component={MainTabs} />
                        <Stack.Screen name="Settings" component={SettingsScreen} />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    tabIcon: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabIconText: {
        fontSize: 24,
    },
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0f172a',
    },
    loadingText: {
        marginTop: 16,
        color: '#ffffff',
        fontSize: 18,
    },
});
