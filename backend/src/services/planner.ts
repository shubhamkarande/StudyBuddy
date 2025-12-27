// Types for study planning
export interface StudySession {
    id: string;
    userId: string;
    subject: string;
    type: 'reading' | 'practice' | 'revision' | 'writing';
    plannedMinutes: number;
    completedMinutes: number;
    date: string;
    startTime: string;
    endTime: string;
    status: 'scheduled' | 'completed' | 'missed' | 'in_progress';
}

export interface StudyPlan {
    userId: string;
    sessions: StudySession[];
    createdAt: string;
    examDate: string;
    totalPlannedHours: number;
}

interface GeneratePlanParams {
    userId: string;
    subjects: string[];
    examDate: Date;
    dailyHours: number;
    studyStyle: 'pomodoro' | 'deep_work' | 'mixed';
}

interface UpdatePlanParams {
    userId: string;
    sessionId: string;
    completedMinutes?: number;
    reschedule?: boolean;
    newDate?: Date;
}

// Session type weights (how often each type should appear)
const SESSION_TYPES: Array<{ type: StudySession['type']; weight: number }> = [
    { type: 'reading', weight: 0.3 },
    { type: 'practice', weight: 0.4 },
    { type: 'revision', weight: 0.2 },
    { type: 'writing', weight: 0.1 },
];

// Generate a unique ID
function generateId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Get session duration based on study style
function getSessionDuration(style: string): number {
    switch (style) {
        case 'pomodoro':
            return 25; // 25 minutes
        case 'deep_work':
            return 90; // 90 minutes
        case 'mixed':
        default:
            return 45; // 45 minutes
    }
}

// Select a random session type based on weights
function selectSessionType(): StudySession['type'] {
    const random = Math.random();
    let cumulative = 0;

    for (const { type, weight } of SESSION_TYPES) {
        cumulative += weight;
        if (random <= cumulative) {
            return type;
        }
    }

    return 'practice';
}

// Generate time slots for a day
function generateTimeSlots(
    dailyMinutes: number,
    sessionDuration: number,
    startHour: number = 9
): Array<{ startTime: string; endTime: string }> {
    const slots: Array<{ startTime: string; endTime: string }> = [];
    let currentMinutes = startHour * 60;
    let remainingMinutes = dailyMinutes;

    while (remainingMinutes >= sessionDuration && currentMinutes < 22 * 60) {
        const startHourStr = String(Math.floor(currentMinutes / 60)).padStart(2, '0');
        const startMinStr = String(currentMinutes % 60).padStart(2, '0');

        const endMinutes = currentMinutes + sessionDuration;
        const endHourStr = String(Math.floor(endMinutes / 60)).padStart(2, '0');
        const endMinStr = String(endMinutes % 60).padStart(2, '0');

        slots.push({
            startTime: `${startHourStr}:${startMinStr}`,
            endTime: `${endHourStr}:${endMinStr}`,
        });

        // Add break time
        const breakTime = sessionDuration <= 30 ? 5 : 15;
        currentMinutes = endMinutes + breakTime;
        remainingMinutes -= sessionDuration;
    }

    return slots;
}

/**
 * Generate a study plan based on user preferences
 */
export async function generateStudyPlan(params: GeneratePlanParams): Promise<StudyPlan> {
    const { userId, subjects, examDate, dailyHours, studyStyle } = params;

    const sessions: StudySession[] = [];
    const sessionDuration = getSessionDuration(studyStyle);
    const dailyMinutes = dailyHours * 60;

    // Calculate days until exam
    const today = new Date();
    const daysUntilExam = Math.ceil((examDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    const planDays = Math.min(daysUntilExam, 7); // Plan for up to 7 days

    // Generate sessions for each day
    for (let day = 0; day < planDays; day++) {
        const sessionDate = new Date(today);
        sessionDate.setDate(today.getDate() + day);
        const dateStr = sessionDate.toISOString().split('T')[0];

        // Get time slots for this day
        const timeSlots = generateTimeSlots(dailyMinutes, sessionDuration);

        // Assign subjects and types to slots
        timeSlots.forEach((slot, index) => {
            const subjectIndex = index % subjects.length;
            const subject = subjects[subjectIndex];
            const sessionType = selectSessionType();

            sessions.push({
                id: generateId(),
                userId,
                subject,
                type: sessionType,
                plannedMinutes: sessionDuration,
                completedMinutes: 0,
                date: dateStr,
                startTime: slot.startTime,
                endTime: slot.endTime,
                status: 'scheduled',
            });
        });
    }

    return {
        userId,
        sessions,
        createdAt: new Date().toISOString(),
        examDate: examDate.toISOString(),
        totalPlannedHours: Math.round(sessions.length * sessionDuration / 60 * 10) / 10,
    };
}

/**
 * Update an existing study session
 */
export async function updateStudyPlan(params: UpdatePlanParams): Promise<{
    session: Partial<StudySession>;
    message: string;
}> {
    const { sessionId, completedMinutes, reschedule, newDate } = params;

    // In production, this would update Firestore
    const updatedSession: Partial<StudySession> = {
        id: sessionId,
    };

    let message = 'Session updated successfully';

    if (completedMinutes !== undefined) {
        updatedSession.completedMinutes = completedMinutes;
        updatedSession.status = completedMinutes > 0 ? 'completed' : 'missed';
        message = `Session marked as ${updatedSession.status}`;
    }

    if (reschedule && newDate) {
        updatedSession.date = newDate.toISOString().split('T')[0];
        updatedSession.status = 'scheduled';
        message = `Session rescheduled to ${updatedSession.date}`;
    }

    return { session: updatedSession, message };
}
