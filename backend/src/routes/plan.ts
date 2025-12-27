import { FastifyInstance } from 'fastify';
import { generateStudyPlan, updateStudyPlan } from '../services/planner.js';

interface GeneratePlanBody {
    userId: string;
    subjects: string[];
    examDate: string;
    dailyHours: number;
    studyStyle?: 'pomodoro' | 'deep_work' | 'mixed';
}

interface UpdatePlanBody {
    userId: string;
    sessionId: string;
    completedMinutes?: number;
    reschedule?: boolean;
    newDate?: string;
}

export default async function planRoutes(fastify: FastifyInstance) {
    // Generate a new study plan
    fastify.post<{ Body: GeneratePlanBody }>('/generate', async (request, reply) => {
        try {
            const { userId, subjects, examDate, dailyHours, studyStyle } = request.body;

            if (!userId || !subjects?.length || !examDate || !dailyHours) {
                return reply.status(400).send({
                    error: 'Missing required fields: userId, subjects, examDate, dailyHours'
                });
            }

            const plan = await generateStudyPlan({
                userId,
                subjects,
                examDate: new Date(examDate),
                dailyHours,
                studyStyle: studyStyle || 'pomodoro',
            });

            return reply.send({ success: true, plan });
        } catch (error) {
            fastify.log.error(error);
            return reply.status(500).send({ error: 'Failed to generate study plan' });
        }
    });

    // Update an existing session
    fastify.post<{ Body: UpdatePlanBody }>('/update', async (request, reply) => {
        try {
            const { userId, sessionId, completedMinutes, reschedule, newDate } = request.body;

            if (!userId || !sessionId) {
                return reply.status(400).send({
                    error: 'Missing required fields: userId, sessionId'
                });
            }

            const result = await updateStudyPlan({
                userId,
                sessionId,
                completedMinutes,
                reschedule,
                newDate: newDate ? new Date(newDate) : undefined,
            });

            return reply.send({ success: true, ...result });
        } catch (error) {
            fastify.log.error(error);
            return reply.status(500).send({ error: 'Failed to update study plan' });
        }
    });
}
