import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = __DEV__
    ? 'http://10.0.2.2:3001' // Android emulator localhost
    : 'https://your-production-api.com';

interface RequestOptions {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    body?: unknown;
    headers?: Record<string, string>;
}

class ApiService {
    private baseUrl: string;
    private authToken: string | null = null;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    setAuthToken(token: string | null) {
        this.authToken = token;
    }

    private async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
        const { method = 'GET', body, headers = {} } = options;

        const defaultHeaders: Record<string, string> = {
            'Content-Type': 'application/json',
        };

        if (this.authToken) {
            defaultHeaders['Authorization'] = `Bearer ${this.authToken}`;
        }

        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method,
            headers: { ...defaultHeaders, ...headers },
            body: body ? JSON.stringify(body) : undefined,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        return response.json();
    }

    // Health check
    async healthCheck() {
        return this.request<{ status: string; timestamp: string }>('/health');
    }

    // Plan endpoints
    async generatePlan(data: {
        userId: string;
        subjects: string[];
        examDate: string;
        dailyHours: number;
        studyStyle?: 'pomodoro' | 'deep_work' | 'mixed';
    }) {
        return this.request<{
            success: boolean;
            plan: {
                userId: string;
                sessions: Array<{
                    id: string;
                    userId: string;
                    subject: string;
                    type: string;
                    plannedMinutes: number;
                    completedMinutes: number;
                    date: string;
                    startTime: string;
                    endTime: string;
                    status: string;
                }>;
                createdAt: string;
                examDate: string;
                totalPlannedHours: number;
            };
        }>('/plan/generate', { method: 'POST', body: data });
    }

    async updatePlan(data: {
        userId: string;
        sessionId: string;
        completedMinutes?: number;
        reschedule?: boolean;
        newDate?: string;
    }) {
        return this.request<{
            success: boolean;
            session: Record<string, unknown>;
            message: string;
        }>('/plan/update', { method: 'POST', body: data });
    }

    // Stats endpoints
    async getWeeklyStats(userId: string, startDate?: string) {
        const params = new URLSearchParams({ userId });
        if (startDate) params.append('startDate', startDate);
        return this.request<{
            success: boolean;
            stats: {
                totalMinutes: number;
                totalHours: number;
                sessionsCompleted: number;
                averageSessionLength: number;
                dailyBreakdown: Record<string, number>;
                focusScore: number;
                streak: { current: number; longest: number };
            };
        }>(`/stats/weekly?${params.toString()}`);
    }

    async getSubjectStats(userId: string) {
        return this.request<{
            success: boolean;
            subjects: Array<{
                name: string;
                totalMinutes: number;
                totalHours: number;
                sessions: number;
                types: Record<string, number>;
                percentageOfTotal: number;
            }>;
            recommendations: Array<{
                subject: string;
                message: string;
            }>;
        }>(`/stats/subjects?userId=${userId}`);
    }
}

export const api = new ApiService(API_BASE_URL);

// Async storage helpers
export const storage = {
    async get<T>(key: string): Promise<T | null> {
        try {
            const value = await AsyncStorage.getItem(key);
            return value ? JSON.parse(value) : null;
        } catch {
            return null;
        }
    },
    async set(key: string, value: unknown): Promise<void> {
        try {
            await AsyncStorage.setItem(key, JSON.stringify(value));
        } catch {
            console.error('Failed to save to storage');
        }
    },
    async remove(key: string): Promise<void> {
        try {
            await AsyncStorage.removeItem(key);
        } catch {
            console.error('Failed to remove from storage');
        }
    },
};
