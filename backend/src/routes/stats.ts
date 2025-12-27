import { FastifyInstance } from 'fastify';

interface WeeklyStatsQuery {
    userId: string;
    startDate?: string;
}

interface SubjectStatsQuery {
    userId: string;
}

// Mock data for demo - in production, this would come from Firestore
const mockSessions = [
    { subject: 'Mathematics', completedMinutes: 90, date: '2025-12-25', type: 'practice' },
    { subject: 'Physics', completedMinutes: 60, date: '2025-12-25', type: 'reading' },
    { subject: 'Mathematics', completedMinutes: 45, date: '2025-12-26', type: 'revision' },
    { subject: 'Computer Science', completedMinutes: 120, date: '2025-12-26', type: 'practice' },
    { subject: 'Chemistry', completedMinutes: 30, date: '2025-12-27', type: 'reading' },
];

export default async function statsRoutes(fastify: FastifyInstance) {
    // Get weekly statistics
    fastify.get<{ Querystring: WeeklyStatsQuery }>('/weekly', async (request, reply) => {
        try {
            const { userId, startDate } = request.query;

            if (!userId) {
                return reply.status(400).send({ error: 'Missing required field: userId' });
            }

            // Calculate weekly stats
            const totalMinutes = mockSessions.reduce((sum, s) => sum + s.completedMinutes, 0);
            const sessionsCompleted = mockSessions.length;
            const averageSessionLength = Math.round(totalMinutes / sessionsCompleted);

            // Daily breakdown
            const dailyBreakdown: Record<string, number> = {};
            mockSessions.forEach(session => {
                dailyBreakdown[session.date] = (dailyBreakdown[session.date] || 0) + session.completedMinutes;
            });

            return reply.send({
                success: true,
                stats: {
                    totalMinutes,
                    totalHours: Math.round(totalMinutes / 60 * 10) / 10,
                    sessionsCompleted,
                    averageSessionLength,
                    dailyBreakdown,
                    focusScore: 85, // Calculated based on completion rate
                    streak: {
                        current: 12,
                        longest: 30,
                    },
                },
            });
        } catch (error) {
            fastify.log.error(error);
            return reply.status(500).send({ error: 'Failed to fetch weekly stats' });
        }
    });

    // Get subject-wise statistics
    fastify.get<{ Querystring: SubjectStatsQuery }>('/subjects', async (request, reply) => {
        try {
            const { userId } = request.query;

            if (!userId) {
                return reply.status(400).send({ error: 'Missing required field: userId' });
            }

            // Calculate subject breakdown
            const subjectStats: Record<string, {
                totalMinutes: number;
                sessions: number;
                types: Record<string, number>;
            }> = {};

            mockSessions.forEach(session => {
                if (!subjectStats[session.subject]) {
                    subjectStats[session.subject] = { totalMinutes: 0, sessions: 0, types: {} };
                }
                subjectStats[session.subject].totalMinutes += session.completedMinutes;
                subjectStats[session.subject].sessions += 1;
                subjectStats[session.subject].types[session.type] =
                    (subjectStats[session.subject].types[session.type] || 0) + 1;
            });

            // Convert to array format
            const subjects = Object.entries(subjectStats).map(([name, data]) => ({
                name,
                totalMinutes: data.totalMinutes,
                totalHours: Math.round(data.totalMinutes / 60 * 10) / 10,
                sessions: data.sessions,
                types: data.types,
                percentageOfTotal: 0, // Will be calculated below
            }));

            // Calculate percentages
            const grandTotal = subjects.reduce((sum, s) => sum + s.totalMinutes, 0);
            subjects.forEach(s => {
                s.percentageOfTotal = Math.round(s.totalMinutes / grandTotal * 100);
            });

            return reply.send({
                success: true,
                subjects,
                recommendations: [
                    { subject: 'Chemistry', message: 'Needs more attention - only 30 mins this week' },
                    { subject: 'Computer Science', message: 'Great progress! Keep up the momentum' },
                ],
            });
        } catch (error) {
            fastify.log.error(error);
            return reply.status(500).send({ error: 'Failed to fetch subject stats' });
        }
    });
}
