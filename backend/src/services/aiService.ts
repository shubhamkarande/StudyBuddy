import OpenAI from 'openai';

// Initialize OpenAI only if API key is provided
const openai = process.env.OPENAI_API_KEY
    ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    : null;

interface WeeklyInsightsParams {
    userId: string;
    completedSessions: number;
    totalPlannedSessions: number;
    subjectBreakdown: Record<string, number>;
    streakDays: number;
    missedSessions: number;
}

interface StudyInsight {
    type: 'strength' | 'improvement' | 'tip' | 'encouragement';
    title: string;
    message: string;
    icon: string;
}

/**
 * Generate weekly study insights using rule-based logic
 * Falls back to AI if OpenAI is configured
 */
export async function generateWeeklyInsights(params: WeeklyInsightsParams): Promise<{
    insights: StudyInsight[];
    summary: string;
}> {
    const {
        completedSessions,
        totalPlannedSessions,
        subjectBreakdown,
        streakDays,
        missedSessions,
    } = params;

    const insights: StudyInsight[] = [];
    const completionRate = totalPlannedSessions > 0
        ? (completedSessions / totalPlannedSessions) * 100
        : 0;

    // Streak analysis
    if (streakDays >= 7) {
        insights.push({
            type: 'encouragement',
            title: 'Amazing Consistency!',
            message: `You've maintained a ${streakDays}-day streak! Your dedication is paying off.`,
            icon: '🔥',
        });
    } else if (streakDays >= 3) {
        insights.push({
            type: 'encouragement',
            title: 'Building Momentum',
            message: `${streakDays} days and counting! Keep pushing to reach a week-long streak.`,
            icon: '⚡',
        });
    }

    // Completion rate analysis
    if (completionRate >= 80) {
        insights.push({
            type: 'strength',
            title: 'Excellent Progress',
            message: `You completed ${Math.round(completionRate)}% of your planned sessions. Outstanding work!`,
            icon: '🌟',
        });
    } else if (completionRate >= 50) {
        insights.push({
            type: 'improvement',
            title: 'Room for Growth',
            message: `You're halfway there with ${Math.round(completionRate)}% completion. Try breaking sessions into smaller chunks.`,
            icon: '📈',
        });
    } else if (completionRate > 0) {
        insights.push({
            type: 'tip',
            title: 'Start Small',
            message: 'Consider reducing session length to build consistency first. Every minute counts!',
            icon: '💡',
        });
    }

    // Subject analysis
    const subjects = Object.entries(subjectBreakdown);
    if (subjects.length > 0) {
        const sortedSubjects = subjects.sort((a, b) => b[1] - a[1]);
        const strongestSubject = sortedSubjects[0];
        const weakestSubject = sortedSubjects[sortedSubjects.length - 1];

        insights.push({
            type: 'strength',
            title: `Strong in ${strongestSubject[0]}`,
            message: `You've spent ${Math.round(strongestSubject[1] / 60 * 10) / 10} hours on ${strongestSubject[0]} - great focus!`,
            icon: '💪',
        });

        if (subjects.length > 1 && weakestSubject[1] < strongestSubject[1] * 0.3) {
            insights.push({
                type: 'improvement',
                title: `Balance ${weakestSubject[0]}`,
                message: `Consider allocating more time to ${weakestSubject[0]} to maintain balanced progress.`,
                icon: '⚖️',
            });
        }
    }

    // Missed sessions recovery
    if (missedSessions > 0) {
        insights.push({
            type: 'tip',
            title: 'Recovery Strategy',
            message: `You have ${missedSessions} missed sessions. Would you like to reschedule them for this week?`,
            icon: '🔄',
        });
    }

    // Study tips
    const tips = [
        { title: 'Pomodoro Power', message: 'Try the Pomodoro technique: 25 min focus, 5 min break.', icon: '🍅' },
        { title: 'Active Recall', message: 'Test yourself instead of just re-reading notes.', icon: '🧠' },
        { title: 'Sleep & Study', message: 'Good sleep consolidates memory. Don\'t sacrifice rest!', icon: '😴' },
        { title: 'Spaced Repetition', message: 'Review material at increasing intervals for better retention.', icon: '📆' },
    ];

    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    insights.push({
        type: 'tip',
        ...randomTip,
    });

    // Generate summary
    let summary = '';
    if (completionRate >= 80) {
        summary = `Great week! You completed ${completedSessions} sessions and maintained strong focus across your subjects.`;
    } else if (completionRate >= 50) {
        summary = `Good progress this week. Focus on consistency and you'll see even better results.`;
    } else {
        summary = `Every journey starts somewhere. Try shorter sessions and build up your study habit gradually.`;
    }

    return { insights, summary };
}

/**
 * Generate AI-powered study suggestions (optional enhancement)
 */
export async function generateAISuggestions(prompt: string): Promise<string | null> {
    if (!openai) {
        return null;
    }

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content: 'You are a friendly study coach. Provide encouraging, actionable advice for students. Keep responses concise and positive.',
                },
                {
                    role: 'user',
                    content: prompt,
                },
            ],
            max_tokens: 150,
            temperature: 0.7,
        });

        return response.choices[0]?.message?.content || null;
    } catch (error) {
        console.error('OpenAI API error:', error);
        return null;
    }
}
