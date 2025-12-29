/**
 * Speak-Fluent API Client for React Frontend
 * TypeScript/JavaScript client for interacting with the backend API
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export interface Conversation {
    id: number;
    language: string;
    level: string;
    created_at: string;
    messages?: Message[];
}

export interface Message {
    id: number;
    role: string;
    content: string;
    created_at: string;
}

export interface VocabularyWord {
    word: string;
    definition: string;
    example: string;
    pronunciation?: string;
}

export interface GrammarCorrection {
    original: string;
    corrected: string;
    mistakes: Array<{
        error: string;
        correction: string;
        explanation: string;
    }>;
}

export interface Quiz {
    title: string;
    questions: Array<{
        type: string;
        question: string;
        options: string[];
        correct_answer: string;
        explanation: string;
    }>;
}

export interface Translation {
    original: string;
    translation: string;
    literal: string;
    notes: string;
}

class SpeakFluentAPI {
    private baseUrl: string;

    constructor(baseUrl: string = API_BASE_URL) {
        this.baseUrl = baseUrl;
    }

    // Helper method for API calls
    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        return response.json();
    }

    // Conversation Methods
    async createConversation(
        userId: number,
        language: string,
        level: string = 'intermediate'
    ): Promise<Conversation> {
        return this.request<Conversation>(
            `/conversations/?user_id=${userId}`,
            {
                method: 'POST',
                body: JSON.stringify({ language, level }),
            }
        );
    }

    async sendMessage(
        conversationId: number,
        content: string
    ): Promise<{ user_message: string; ai_response: string }> {
        return this.request(`/conversations/${conversationId}/messages`, {
            method: 'POST',
            body: JSON.stringify({ content }),
        });
    }

    async getConversation(conversationId: number): Promise<Conversation> {
        return this.request<Conversation>(`/conversations/${conversationId}`);
    }

    async getUserConversations(userId: number): Promise<Conversation[]> {
        return this.request<Conversation[]>(`/users/${userId}/conversations`);
    }

    // Grammar Methods
    async correctGrammar(
        text: string,
        language: string = 'English',
        userId?: number
    ): Promise<GrammarCorrection> {
        const params = userId ? `?user_id=${userId}` : '';
        return this.request<GrammarCorrection>(`/grammar/correct${params}`, {
            method: 'POST',
            body: JSON.stringify({ text, language }),
        });
    }

    // Vocabulary Methods
    async generateVocabulary(
        topic: string,
        language: string = 'English',
        count: number = 10
    ): Promise<VocabularyWord[]> {
        return this.request<VocabularyWord[]>('/vocabulary/generate', {
            method: 'POST',
            body: JSON.stringify({ topic, language, count }),
        });
    }

    async saveVocabulary(
        userId: number,
        wordData: VocabularyWord & { language: string; topic?: string }
    ): Promise<any> {
        return this.request(`/vocabulary/save?user_id=${userId}`, {
            method: 'POST',
            body: JSON.stringify(wordData),
        });
    }

    async getUserVocabulary(
        userId: number,
        language?: string
    ): Promise<VocabularyWord[]> {
        const params = language ? `?language=${language}` : '';
        return this.request<VocabularyWord[]>(
            `/users/${userId}/vocabulary${params}`
        );
    }

    // Quiz Methods
    async generateQuiz(
        topic: string,
        language: string = 'English',
        difficulty: string = 'intermediate'
    ): Promise<Quiz> {
        return this.request<Quiz>('/quiz/generate', {
            method: 'POST',
            body: JSON.stringify({ topic, language, difficulty }),
        });
    }

    async submitQuiz(
        userId: number,
        quizId: number,
        answers: Record<number, string>
    ): Promise<{ id: number; score: number; completed_at: string }> {
        return this.request(`/quiz/submit?user_id=${userId}`, {
            method: 'POST',
            body: JSON.stringify({ quiz_id: quizId, answers }),
        });
    }

    // Translation Methods
    async translate(
        text: string,
        sourceLang: string,
        targetLang: string
    ): Promise<Translation> {
        return this.request<Translation>('/translate', {
            method: 'POST',
            body: JSON.stringify({
                text,
                source_lang: sourceLang,
                target_lang: targetLang,
            }),
        });
    }

    // Progress Methods (Legacy - use dynamic version instead)
    async getUserProgressOld(userId: number): Promise<any[]> {
        return this.request<any[]>(`/users/${userId}/progress`);
    }

    // ========== IELTS AGENTIC AI METHODS ==========

    // IELTS Session Management
    async startIELTSSession(
        userId: number,
        sessionType: 'practice' | 'mock' | 'exam' = 'practice',
        userProfile: any = {}
    ): Promise<{
        session_id: string;
        motivation: any;
        first_question: string;
        part: number;
        session_type: string;
    }> {
        return this.request('/ielts/session/start', {
            method: 'POST',
            body: JSON.stringify({
                user_id: userId,
                session_type: sessionType,
                user_profile: userProfile
            }),
        });
    }

    async processIELTSResponse(
        sessionId: string,
        userResponse: string,
        transcriptMetadata: any = {}
    ): Promise<{
        next_question: string;
        part: number;
        confidence_tips: string[];
        confidence_level: string;
        action: string;
    }> {
        return this.request('/ielts/session/respond', {
            method: 'POST',
            body: JSON.stringify({
                session_id: sessionId,
                user_response: userResponse,
                transcript_metadata: transcriptMetadata
            }),
        });
    }

    async endIELTSSession(
        sessionId: string,
        fullTranscript: string,
        metadata: any = {}
    ): Promise<{
        session_id: string;
        score: any;
        validation: any;
        reflection: any;
        coach_message: any;
        session_summary: any;
    }> {
        return this.request('/ielts/session/end', {
            method: 'POST',
            body: JSON.stringify({
                session_id: sessionId,
                full_transcript: fullTranscript,
                metadata
            }),
        });
    }

    // IELTS Study Planning
    async generateStudyPlan(
        userId: number,
        targetBand: number,
        availableDays: string[],
        userProfile: any = {}
    ): Promise<any> {
        return this.request('/ielts/study-plan/generate', {
            method: 'POST',
            body: JSON.stringify({
                user_id: userId,
                target_band: targetBand,
                available_days: availableDays,
                user_profile: userProfile
            }),
        });
    }

    // IELTS Content Support
    async getContentIdeas(
        topic: string,
        questionType: string = 'opinion'
    ): Promise<{
        main_ideas: string[];
        examples: string[];
        contrasts: string[];
        structure: string;
    }> {
        return this.request('/ielts/content/ideas', {
            method: 'POST',
            body: JSON.stringify({ topic, question_type: questionType }),
        });
    }

    async generateCueCard(userProfile: any = {}): Promise<{
        topic: string;
        points: string[];
        preparation_time: number;
        speaking_time: number;
    }> {
        return this.request('/ielts/cue-card/generate', {
            method: 'POST',
            body: JSON.stringify({ user_profile: userProfile }),
        });
    }

    // IELTS Agent Status
    async getAgentsStatus(): Promise<any> {
        return this.request('/ielts/agents/status');
    }

    async getActiveSessions(): Promise<{
        active_sessions: string[];
        count: number;
    }> {
        return this.request('/ielts/sessions/active');
    }

    // ========== DYNAMIC CONTENT METHODS ==========

    // Roadmap & Progress
    async generateRoadmap(
        userId: number,
        targetBand: number,
        currentBand: number,
        availableDaysPerWeek: number,
        totalWeeks: number,
        weakAreas: string[] = [],
        preferredPracticeTime: string = '30min'
    ): Promise<any> {
        return this.request('/roadmap/generate', {
            method: 'POST',
            body: JSON.stringify({
                user_id: userId,
                target_band: targetBand,
                current_band: currentBand,
                available_days_per_week: availableDaysPerWeek,
                total_weeks: totalWeeks,
                weak_areas: weakAreas,
                preferred_practice_time: preferredPracticeTime
            }),
        });
    }

    async getDailyPractice(
        userId: number,
        date: string,
        part: number
    ): Promise<any> {
        return this.request('/practice/daily', {
            method: 'POST',
            body: JSON.stringify({
                user_id: userId,
                date,
                part
            }),
        });
    }

    async updateProgress(
        userId: number,
        activityType: string,
        score?: number,
        duration?: number,
        notes?: string
    ): Promise<any> {
        return this.request('/progress/update', {
            method: 'POST',
            body: JSON.stringify({
                user_id: userId,
                activity_type: activityType,
                score,
                duration,
                notes
            }),
        });
    }

    async getUserProgress(userId: number): Promise<any> {
        return this.request(`/progress/${userId}`);
    }

    async getComingSoonFeatures(): Promise<any> {
        return this.request('/features/coming-soon');
    }

    async getDailyTopics(): Promise<any> {
        return this.request('/topics/daily');
    }

    async getDailyVocabulary(): Promise<any> {
        return this.request('/vocabulary/daily');
    }

    // Streaming Chat
    async *streamChat(
        messages: Array<{ role: string; content: string }>,
        temperature: number = 1.0
    ): AsyncGenerator<string> {
        const response = await fetch(`${this.baseUrl}/chat/stream`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ messages, temperature }),
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) {
            throw new Error('No reader available');
        }

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');

            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    const data = JSON.parse(line.slice(6));
                    yield data.content;
                }
            }
        }
    }
}

// Export singleton instance
export const speakFluentAPI = new SpeakFluentAPI();

// Export class for custom instances
export default SpeakFluentAPI;
