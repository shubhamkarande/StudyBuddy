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
    ScrollView,
    Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppDispatch } from '../../store';
import { setUser, setError, setLoading } from '../../store/authSlice';
import { RootStackParamList } from '../../types';
import { firebaseAuth } from '../../services/firebase';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function RegisterScreen() {
    const navigation = useNavigation<NavigationProp>();
    const dispatch = useAppDispatch();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleRegister = async () => {
        if (!name || !email || !password || !confirmPassword) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        if (password.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters');
            return;
        }

        setIsLoading(true);
        dispatch(setLoading(true));

        try {
            const user = await firebaseAuth.signUp(email, password, name);
            dispatch(setUser(user));
        } catch (error: any) {
            console.error('Registration error:', error);
            let errorMessage = 'Registration failed. Please try again.';

            if (error.code === 'auth/email-already-in-use') {
                errorMessage = 'An account with this email already exists.';
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = 'Invalid email address.';
            } else if (error.code === 'auth/weak-password') {
                errorMessage = 'Password is too weak. Use at least 6 characters.';
            }

            Alert.alert('Registration Failed', errorMessage);
            dispatch(setError(errorMessage));
        } finally {
            setIsLoading(false);
            dispatch(setLoading(false));
        }
    };

    const isFormValid = name && email && password && confirmPassword && password === confirmPassword;

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

                <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
                    {/* Title */}
                    <View className="items-center mb-8 mt-4">
                        <Text className="text-5xl mb-4">🚀</Text>
                        <Text className="text-white text-3xl font-bold mb-2">
                            Create Account
                        </Text>
                        <Text className="text-dark-400 text-center">
                            Start your journey to academic success
                        </Text>
                    </View>

                    {/* Form */}
                    <View className="mb-4">
                        <Text className="text-dark-300 text-sm font-medium mb-2">Full Name</Text>
                        <View className="bg-dark-800 rounded-xl flex-row items-center px-4">
                            <Text className="text-dark-400 mr-3">👤</Text>
                            <TextInput
                                className="flex-1 py-4 text-white text-base"
                                placeholder="Your name"
                                placeholderTextColor="#64748b"
                                value={name}
                                onChangeText={setName}
                                autoComplete="name"
                            />
                        </View>
                    </View>

                    <View className="mb-4">
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

                    <View className="mb-4">
                        <Text className="text-dark-300 text-sm font-medium mb-2">Password</Text>
                        <View className="bg-dark-800 rounded-xl flex-row items-center px-4">
                            <Text className="text-dark-400 mr-3">🔒</Text>
                            <TextInput
                                className="flex-1 py-4 text-white text-base"
                                placeholder="At least 6 characters"
                                placeholderTextColor="#64748b"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                                autoComplete="new-password"
                            />
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                <Text className="text-dark-400">{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View className="mb-8">
                        <Text className="text-dark-300 text-sm font-medium mb-2">Confirm Password</Text>
                        <View className="bg-dark-800 rounded-xl flex-row items-center px-4">
                            <Text className="text-dark-400 mr-3">🔒</Text>
                            <TextInput
                                className="flex-1 py-4 text-white text-base"
                                placeholder="Confirm your password"
                                placeholderTextColor="#64748b"
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry={!showPassword}
                                autoComplete="new-password"
                            />
                        </View>
                        {password && confirmPassword && password !== confirmPassword && (
                            <Text className="text-red-500 text-sm mt-2">Passwords do not match</Text>
                        )}
                    </View>

                    {/* Register button */}
                    <TouchableOpacity
                        className={`rounded-2xl py-4 items-center mb-4 ${isFormValid ? 'bg-primary-600' : 'bg-dark-700'
                            }`}
                        onPress={handleRegister}
                        disabled={isLoading || !isFormValid}
                        activeOpacity={0.8}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text className={`text-lg font-semibold ${isFormValid ? 'text-white' : 'text-dark-400'}`}>
                                Create Account
                            </Text>
                        )}
                    </TouchableOpacity>

                    {/* Terms text */}
                    <Text className="text-dark-500 text-center text-sm mb-8">
                        By signing up, you agree to our{' '}
                        <Text className="text-primary-500">Terms of Service</Text>
                        {' '}and{' '}
                        <Text className="text-primary-500">Privacy Policy</Text>
                    </Text>
                </ScrollView>

                {/* Login link */}
                <View className="px-6 pb-8">
                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                        <Text className="text-dark-400 text-center">
                            Already have an account?{' '}
                            <Text className="text-white font-semibold">Log in</Text>
                        </Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
