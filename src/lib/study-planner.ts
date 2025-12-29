import { addDays, format, startOfWeek, addWeeks, isSameDay } from "date-fns";

export type DayOfWeek = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";

export interface UserAvailability {
    days: DayOfWeek[];
    timeSlots: { [key in DayOfWeek]?: string }; // e.g., "08:00"
    durationMinutes: 15 | 30 | 45 | 60;
    targetBand: number;
    weaknesses: string[];
}

export type SessionType = "part1" | "part2" | "part3" | "vocab" | "mock" | "review";

export interface StudySession {
    id: string;
    date: Date;
    duration: number;
    type: SessionType;
    topic: string;
    status: "pending" | "completed" | "missed";
}

export interface StudyPlan {
    startDate: Date;
    endDate: Date;
    sessions: StudySession[];
}

const TOPICS = {
    part1: ["Work & Studies", "Hometown", "Hobbies", "Travel", "Family", "Daily Routine"],
    part2: ["Describe a person", "Describe a place", "Describe an object", "Describe an event"],
    part3: ["Education", "Technology", "Environment", "Society", "Health"],
    vocab: ["Education", "Environment", "Technology", "Business", "Travel"],
};

export const generateStudyPlan = (availability: UserAvailability): StudyPlan => {
    const startDate = new Date();
    const endDate = addWeeks(startDate, 4); // Generate for 4 weeks
    const sessions: StudySession[] = [];

    let currentDate = startDate;
    let mockTestCount = 0;

    while (currentDate <= endDate) {
        const dayName = format(currentDate, "EEEE") as DayOfWeek;

        if (availability.days.includes(dayName)) {
            // Determine session type based on rules
            let type: SessionType = "part1";
            let topic = "General Practice";

            // Rule: Mock test once a week (preferably weekends)
            if ((dayName === "Saturday" || dayName === "Sunday") && mockTestCount < 4 && !sessions.some(s => isSameDay(s.date, currentDate))) {
                // Check if we already have a mock test this week? Simplified: just do it if it's a weekend
                // For now, let's just say Saturday is Mock Test day if selected
                if (dayName === "Saturday") {
                    type = "mock";
                    topic = "Full Mock Test";
                }
            }

            if (type !== "mock") {
                // Distribute other types
                const dayIndex = availability.days.indexOf(dayName);
                const totalDays = availability.days.length;

                // Simple rotation logic
                const rotationIndex = (sessions.length) % 5;

                if (rotationIndex === 0) {
                    type = "part1";
                    topic = TOPICS.part1[Math.floor(Math.random() * TOPICS.part1.length)];
                } else if (rotationIndex === 1) {
                    type = "vocab";
                    topic = TOPICS.vocab[Math.floor(Math.random() * TOPICS.vocab.length)];
                } else if (rotationIndex === 2) {
                    type = "part2";
                    topic = TOPICS.part2[Math.floor(Math.random() * TOPICS.part2.length)];
                } else if (rotationIndex === 3) {
                    type = "part3";
                    topic = TOPICS.part3[Math.floor(Math.random() * TOPICS.part3.length)];
                } else {
                    type = "review";
                    topic = "Review Weaknesses & Feedback";
                }

                // Prioritize weaknesses
                if (availability.weaknesses.length > 0 && Math.random() > 0.7) {
                    topic = `Focus on: ${availability.weaknesses[Math.floor(Math.random() * availability.weaknesses.length)]}`;
                }
            }

            sessions.push({
                id: Math.random().toString(36).substr(2, 9),
                date: new Date(currentDate), // Clone date
                duration: availability.durationMinutes,
                type,
                topic,
                status: "pending"
            });
        }

        currentDate = addDays(currentDate, 1);
    }

    return {
        startDate,
        endDate,
        sessions
    };
};
