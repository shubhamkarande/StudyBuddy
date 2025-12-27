import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, FlatList, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppDispatch } from '../../store';
import { setSubjects } from '../../store/onboardingSlice';
import { RootStackParamList } from '../../types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const SUBJECTS = [
    'Mathematics', 'Physics', 'Chemistry', 'Biology',
    'English', 'History', 'Geography', 'Economics',
    'Computer Science', 'Psychology', 'Philosophy', 'Art',
];

export default function SubjectSelectionScreen() {
    const navigation = useNavigation<NavigationProp>();
    const dispatch = useAppDispatch();
    const [selected, setSelected] = useState<string[]>([]);
    const [search, setSearch] = useState('');

    const filteredSubjects = SUBJECTS.filter(s =>
        s.toLowerCase().includes(search.toLowerCase())
    );

    const toggleSubject = (subject: string) => {
        setSelected(prev =>
            prev.includes(subject)
                ? prev.filter(s => s !== subject)
                : [...prev, subject]
        );
    };

    const handleContinue = () => {
        dispatch(setSubjects(selected));
        navigation.navigate('ExamDate');
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
                        <View style={styles.stepActive} />
                        <View style={styles.step} />
                        <View style={styles.step} />
                    </View>
                </View>

                {/* Title */}
                <Text style={styles.title}>What are you studying?</Text>
                <Text style={styles.subtitle}>Select your subjects to personalize your study plan</Text>

                {/* Search */}
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search subjects..."
                    placeholderTextColor="#64748b"
                    value={search}
                    onChangeText={setSearch}
                />

                {/* Subjects Grid */}
                <FlatList
                    data={filteredSubjects}
                    numColumns={2}
                    keyExtractor={(item) => item}
                    contentContainerStyle={styles.grid}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={[
                                styles.subjectCard,
                                selected.includes(item) && styles.subjectCardSelected
                            ]}
                            onPress={() => toggleSubject(item)}
                        >
                            <Text style={[
                                styles.subjectText,
                                selected.includes(item) && styles.subjectTextSelected
                            ]}>{item}</Text>
                            {selected.includes(item) && (
                                <Text style={styles.checkmark}>✓</Text>
                            )}
                        </TouchableOpacity>
                    )}
                />

                {/* Continue Button */}
                <TouchableOpacity
                    style={[styles.continueButton, selected.length === 0 && styles.disabledButton]}
                    onPress={handleContinue}
                    disabled={selected.length === 0}
                >
                    <Text style={styles.continueText}>
                        Continue ({selected.length} selected)
                    </Text>
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
    step: {
        flex: 1,
        height: 4,
        backgroundColor: '#334155',
        borderRadius: 2,
        marginHorizontal: 2,
    },
    stepActive: {
        flex: 1,
        height: 4,
        backgroundColor: '#4ade80',
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
        marginBottom: 24,
    },
    searchInput: {
        backgroundColor: '#1e293b',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        color: '#ffffff',
        fontSize: 16,
        marginBottom: 20,
    },
    grid: {
        paddingBottom: 20,
    },
    subjectCard: {
        flex: 1,
        backgroundColor: '#1e293b',
        borderRadius: 12,
        padding: 16,
        margin: 4,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    subjectCardSelected: {
        backgroundColor: '#4ade80',
    },
    subjectText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '500',
    },
    subjectTextSelected: {
        color: '#0f172a',
    },
    checkmark: {
        color: '#0f172a',
        fontWeight: 'bold',
    },
    continueButton: {
        backgroundColor: '#4ade80',
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        marginBottom: 20,
    },
    disabledButton: {
        opacity: 0.5,
    },
    continueText: {
        color: '#0f172a',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
