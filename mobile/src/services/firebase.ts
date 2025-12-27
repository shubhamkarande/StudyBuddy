import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { User } from '../types';

// Auth functions
export const firebaseAuth = {
    // Sign up with email/password
    async signUp(email: string, password: string, displayName: string): Promise<User> {
        const userCredential = await auth().createUserWithEmailAndPassword(email, password);

        // Update display name
        await userCredential.user.updateProfile({ displayName });

        // Create user document in Firestore
        const userData: User = {
            uid: userCredential.user.uid,
            email: userCredential.user.email || email,
            displayName,
            subjects: [],
            examDates: [],
            dailyAvailability: 4,
            studyStyle: 'pomodoro',
            onboardingComplete: false,
            createdAt: new Date().toISOString(),
        };

        await firestore().collection('users').doc(userCredential.user.uid).set(userData);

        return userData;
    },

    // Sign in with email/password
    async signIn(email: string, password: string): Promise<User> {
        const userCredential = await auth().signInWithEmailAndPassword(email, password);

        // Get user data from Firestore
        const userDoc = await firestore()
            .collection('users')
            .doc(userCredential.user.uid)
            .get();

        if (userDoc.exists) {
            return userDoc.data() as User;
        }

        // If user exists in Auth but not Firestore, create document
        const userData: User = {
            uid: userCredential.user.uid,
            email: userCredential.user.email || email,
            displayName: userCredential.user.displayName || email.split('@')[0],
            subjects: [],
            examDates: [],
            dailyAvailability: 4,
            studyStyle: 'pomodoro',
            onboardingComplete: false,
            createdAt: new Date().toISOString(),
        };

        await firestore().collection('users').doc(userCredential.user.uid).set(userData);
        return userData;
    },

    // Sign out
    async signOut(): Promise<void> {
        await auth().signOut();
    },

    // Get current user
    getCurrentUser(): FirebaseAuthTypes.User | null {
        return auth().currentUser;
    },

    // Listen to auth state changes
    onAuthStateChanged(callback: (user: FirebaseAuthTypes.User | null) => void) {
        return auth().onAuthStateChanged(callback);
    },

    // Password reset
    async sendPasswordReset(email: string): Promise<void> {
        await auth().sendPasswordResetEmail(email);
    },
};

// Firestore functions
export const firestoreDB = {
    // Users collection
    users: {
        async get(uid: string): Promise<User | null> {
            const doc = await firestore().collection('users').doc(uid).get();
            return doc.exists ? (doc.data() as User) : null;
        },

        async update(uid: string, data: Partial<User>): Promise<void> {
            await firestore().collection('users').doc(uid).update(data);
        },

        async updateOnboarding(uid: string, data: {
            subjects: string[];
            dailyAvailability: number;
            studyStyle: 'pomodoro' | 'deep_work' | 'mixed';
            onboardingComplete: boolean;
        }): Promise<void> {
            await firestore().collection('users').doc(uid).update(data);
        },
    },

    // Study sessions collection
    sessions: {
        async add(session: any): Promise<string> {
            const docRef = await firestore().collection('sessions').add({
                ...session,
                createdAt: firestore.FieldValue.serverTimestamp(),
            });
            return docRef.id;
        },

        async getByUser(uid: string, date?: string): Promise<any[]> {
            let query = firestore()
                .collection('sessions')
                .where('userId', '==', uid);

            if (date) {
                query = query.where('date', '==', date);
            }

            const snapshot = await query.orderBy('startTime', 'asc').get();
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        },

        async update(sessionId: string, data: any): Promise<void> {
            await firestore().collection('sessions').doc(sessionId).update(data);
        },
    },

    // Focus sessions collection  
    focusSessions: {
        async add(focusSession: any): Promise<string> {
            const docRef = await firestore().collection('focusSessions').add({
                ...focusSession,
                createdAt: firestore.FieldValue.serverTimestamp(),
            });
            return docRef.id;
        },

        async getByUser(uid: string): Promise<any[]> {
            const snapshot = await firestore()
                .collection('focusSessions')
                .where('userId', '==', uid)
                .orderBy('startedAt', 'desc')
                .limit(50)
                .get();

            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        },
    },

    // Streaks collection
    streaks: {
        async get(uid: string): Promise<any | null> {
            const doc = await firestore().collection('streaks').doc(uid).get();
            return doc.exists ? doc.data() : null;
        },

        async update(uid: string, data: any): Promise<void> {
            await firestore().collection('streaks').doc(uid).set(data, { merge: true });
        },
    },
};

export default { auth: firebaseAuth, db: firestoreDB };
