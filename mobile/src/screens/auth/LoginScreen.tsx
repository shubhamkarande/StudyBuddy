import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    StatusBar,
    SafeAreaView,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppDispatch } from '../../store';
import { setUser, setError, setLoading } from '../../store/authSlice';
import { RootStackParamList } from '../../types';
import { firebaseAuth } from '../../services/firebase';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function LoginScreen() {
    const navigation = useNavigation<NavigationProp>();
    const dispatch = useAppDispatch();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setIsLoading(true);
        dispatch(setLoading(true));

        try {
            const user = await firebaseAuth.signIn(email, password);
            dispatch(setUser(user));
        } catch (error: any) {
            console.error('Login error:', error);
            let errorMessage = 'Login failed. Please try again.';

            if (error.code === 'auth/user-not-found') {
                errorMessage = 'No account found with this email.';
            } else if (error.code === 'auth/wrong-password') {
                errorMessage = 'Incorrect password.';
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = 'Invalid email address.';
            } else if (error.code === 'auth/too-many-requests') {
                errorMessage = 'Too many attempts. Please try again later.';
            }

            Alert.alert('Login Failed', errorMessage);
            dispatch(setError(errorMessage));
        } finally {
            setIsLoading(false);
            dispatch(setLoading(false));
        }
    };

    const handleForgotPassword = async () => {
        if (!email) {
            Alert.alert('Enter Email', 'Please enter your email address first.');
            return;
        }

        try {
            await firebaseAuth.sendPasswordReset(email);
            Alert.alert('Success', 'Password reset email sent!');
        } catch (error: any) {
            Alert.alert('Error', 'Failed to send reset email. Please check your email address.');
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-dark-900">
            <StatusBar barStyle="light-content" backgroundColor="#0f172a" />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                {/* Header */}
                <View className="px-6 pt-4">
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        className="p-2 -ml-2 w-12"
                    >
                        <Text className="text-white text-2xl">←</Text>
                    </TouchableOpacity>
                </View>

                <View className="flex-1 px-6 justify-center">
                    {/* Title */}
                    <View className="items-center mb-10">
                        <Text className="text-5xl mb-4">📚</Text>
                        <Text className="text-white text-3xl font-bold mb-2">
                            Welcome back!
                        </Text>
                        <Text className="text-dark-400 text-center">
                            Log in to continue your study journey
                        </Text>
                    </View>

                    {/* Form */}
                    <View className="mb-6">
                        <Text className="text-dark-300 text-sm font-medium mb-2">Email</Text>
                        <View className="bg-dark-800 rounded-xl flex-row items-center px-4">
                            <Text className="text-dark-400 mr-3">✉️</Text>
                            <TextInput
                                className="flex-1 py-4 text-white text-base"
                                placeholder="your@email.com"
                                placeholderTextColor="#64748b"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoComplete="email"
                            />
                        </View>
                    </View>

                    <View className="mb-8">
                        <Text className="text-dark-300 text-sm font-medium mb-2">Password</Text>
                        <View className="bg-dark-800 rounded-xl flex-row items-center px-4">
                            <Text className="text-dark-400 mr-3">🔒</Text>
                            <TextInput
                                className="flex-1 py-4 text-white text-base"
                                placeholder="Enter your password"
                                placeholderTextColor="#64748b"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                                autoComplete="password"
                            />
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                <Text className="text-dark-400">{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Login button */}
                    <TouchableOpacity
                        className={`rounded-2xl py-4 items-center ${email && password ? 'bg-primary-600' : 'bg-dark-700'
                            }`}
                        onPress={handleLogin}
                        disabled={isLoading || !email || !password}
                        activeOpacity={0.8}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text className="text-white text-lg font-semibold">Log In</Text>
                        )}
                    </TouchableOpacity>

                    {/* Forgot password */}
                    <TouchableOpacity className="py-4" onPress={handleForgotPassword}>
                        <Text className="text-primary-500 text-center font-medium">
                            Forgot password?
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Register link */}
                <View className="px-6 pb-8">
                    <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                        <Text className="text-dark-400 text-center">
                            Don't have an account?{' '}
                            <Text className="text-white font-semibold">Sign up</Text>
                        </Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
