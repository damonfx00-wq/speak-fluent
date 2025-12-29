import { useState, useEffect } from 'react';
import { speakFluentAPI } from '@/lib/api-client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Mic, Send, StopCircle, Brain, Target, TrendingUp, Lightbulb } from 'lucide-react';

interface SessionState {
    sessionId: string | null;
    currentPart: number;
    currentQuestion: string;
    isActive: boolean;
    transcript: string[];
    confidenceLevel: string;
    confidenceTips: string[];
}

export default function IELTSSpeakingPractice() {
    const [session, setSession] = useState<SessionState>({
        sessionId: null,
        currentPart: 1,
        currentQuestion: '',
        isActive: false,
        transcript: [],
        confidenceLevel: 'medium',
        confidenceTips: []
    });

    const [userResponse, setUserResponse] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [motivation, setMotivation] = useState<any>(null);
    const [finalScore, setFinalScore] = useState<any>(null);
    const [showScore, setShowScore] = useState(false);

    // Start IELTS Session
    const startSession = async () => {
        setIsLoading(true);
        try {
            const result = await speakFluentAPI.startIELTSSession(
                1, // User ID - would come from auth
                'practice',
                {
                    current_band: 6.0,
                    target_band: 7.5,
                    weak_areas: ['fluency', 'vocabulary']
                }
            );

            setSession({
                sessionId: result.session_id,
                currentPart: result.part,
                currentQuestion: result.first_question,
                isActive: true,
                transcript: [],
                confidenceLevel: 'medium',
                confidenceTips: []
            });

            setMotivation(result.motivation);
        } catch (error) {
            console.error('Failed to start session:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Process User Response
    const submitResponse = async () => {
        if (!session.sessionId || !userResponse.trim()) return;

        setIsLoading(true);
        try {
            const result = await speakFluentAPI.processIELTSResponse(
                session.sessionId,
                userResponse,
                {
                    duration: 45,
                    word_count: userResponse.split(' ').length,
                    pause_count: 0
                }
            );

            setSession(prev => ({
                ...prev,
                currentPart: result.part,
                currentQuestion: result.next_question,
                transcript: [...prev.transcript, userResponse],
                confidenceLevel: result.confidence_level,
                confidenceTips: result.confidence_tips
            }));

            setUserResponse('');
        } catch (error) {
            console.error('Failed to process response:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // End Session and Get Score
    const endSession = async () => {
        if (!session.sessionId) return;

        setIsLoading(true);
        try {
            const fullTranscript = session.transcript.join(' ');
            const result = await speakFluentAPI.endIELTSSession(
                session.sessionId,
                fullTranscript,
                {
                    total_duration: 600,
                    total_words: fullTranscript.split(' ').length
                }
            );

            setFinalScore(result);
            setShowScore(true);
            setSession(prev => ({ ...prev, isActive: false }));
        } catch (error) {
            console.error('Failed to end session:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        IELTS Speaking Practice
                    </h1>
                    <p className="text-gray-600">Powered by Multi-Agent AI System</p>
                </div>

                {/* Motivation Card */}
                {motivation && !showScore && (
                    <Card className="border-l-4 border-l-green-500 bg-green-50">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Target className="w-5 h-5 text-green-600" />
                                Coach's Message
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-700">{motivation.message}</p>
                            {motivation.action_items && (
                                <ul className="mt-2 space-y-1">
                                    {motivation.action_items.map((item: string, idx: number) => (
                                        <li key={idx} className="text-sm text-gray-600">• {item}</li>
                                    ))}
                                </ul>
                            )}
                        </CardContent>
                    </Card>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Practice Area */}
                    <div className="lg:col-span-2 space-y-6">
                        {!session.isActive && !showScore ? (
                            <Card className="text-center p-12">
                                <Brain className="w-16 h-16 mx-auto mb-4 text-indigo-600" />
                                <h2 className="text-2xl font-bold mb-2">Ready to Practice?</h2>
                                <p className="text-gray-600 mb-6">
                                    Start your AI-powered IELTS speaking session with adaptive questioning
                                </p>
                                <Button
                                    onClick={startSession}
                                    disabled={isLoading}
                                    size="lg"
                                    className="bg-gradient-to-r from-indigo-600 to-purple-600"
                                >
                                    {isLoading ? 'Starting...' : 'Start Session'}
                                </Button>
                            </Card>
                        ) : showScore ? (
                            /* Score Display */
                            <div className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <TrendingUp className="w-5 h-5" />
                                            Your IELTS Band Score
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        {/* Overall Band */}
                                        <div className="text-center p-8 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg">
                                            <div className="text-6xl font-bold text-indigo-600">
                                                {finalScore?.score?.overall_band || '0.0'}
                                            </div>
                                            <div className="text-gray-600 mt-2">Overall Band Score</div>
                                        </div>

                                        {/* Individual Scores */}
                                        <div className="grid grid-cols-2 gap-4">
                                            {[
                                                { label: 'Fluency & Coherence', key: 'fluency_band' },
                                                { label: 'Grammar', key: 'grammar_band' },
                                                { label: 'Vocabulary', key: 'vocabulary_band' },
                                                { label: 'Pronunciation', key: 'pronunciation_band' }
                                            ].map((criterion) => (
                                                <div key={criterion.key} className="p-4 border rounded-lg">
                                                    <div className="text-2xl font-bold text-indigo-600">
                                                        {finalScore?.score?.[criterion.key] || '0.0'}
                                                    </div>
                                                    <div className="text-sm text-gray-600">{criterion.label}</div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Strengths & Weaknesses */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <h3 className="font-semibold text-green-600 mb-2">✓ Strengths</h3>
                                                <ul className="space-y-1">
                                                    {finalScore?.score?.strengths?.map((strength: string, idx: number) => (
                                                        <li key={idx} className="text-sm text-gray-700">• {strength}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-orange-600 mb-2">⚠ Areas to Improve</h3>
                                                <ul className="space-y-1">
                                                    {finalScore?.score?.weaknesses?.map((weakness: string, idx: number) => (
                                                        <li key={idx} className="text-sm text-gray-700">• {weakness}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>

                                        {/* Reflection */}
                                        {finalScore?.reflection && (
                                            <div className="p-4 bg-blue-50 rounded-lg">
                                                <h3 className="font-semibold text-blue-900 mb-2">📝 Reflection</h3>
                                                <p className="text-sm text-blue-800">
                                                    <strong>Next Focus:</strong> {finalScore.reflection.next_focus}
                                                </p>
                                            </div>
                                        )}

                                        {/* Coach Message */}
                                        {finalScore?.coach_message && (
                                            <div className="p-4 bg-green-50 rounded-lg">
                                                <p className="text-green-800">{finalScore.coach_message.message}</p>
                                            </div>
                                        )}

                                        <Button
                                            onClick={() => {
                                                setShowScore(false);
                                                setFinalScore(null);
                                                setMotivation(null);
                                            }}
                                            className="w-full"
                                        >
                                            Start New Session
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>
                        ) : (
                            /* Active Session */
                            <div className="space-y-6">
                                {/* Current Question */}
                                <Card className="border-l-4 border-l-indigo-500">
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <CardTitle>Part {session.currentPart}</CardTitle>
                                            <Badge variant="outline">Active Session</Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-lg font-medium text-gray-800">
                                            {session.currentQuestion}
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Response Input */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Mic className="w-5 h-5" />
                                            Your Response
                                        </CardTitle>
                                        <CardDescription>
                                            Speak naturally and answer the question above
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <Textarea
                                            value={userResponse}
                                            onChange={(e) => setUserResponse(e.target.value)}
                                            placeholder="Type your response here (or use voice input)..."
                                            rows={6}
                                            className="resize-none"
                                        />
                                        <div className="flex gap-2">
                                            <Button
                                                onClick={submitResponse}
                                                disabled={isLoading || !userResponse.trim()}
                                                className="flex-1"
                                            >
                                                <Send className="w-4 h-4 mr-2" />
                                                {isLoading ? 'Processing...' : 'Submit Response'}
                                            </Button>
                                            <Button
                                                onClick={endSession}
                                                variant="destructive"
                                                disabled={isLoading}
                                            >
                                                <StopCircle className="w-4 h-4 mr-2" />
                                                End Session
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}
                    </div>

                    {/* Sidebar - Real-time Insights */}
                    {session.isActive && !showScore && (
                        <div className="space-y-6">
                            {/* Confidence Level */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-sm">Confidence Level</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-2xl font-bold capitalize">{session.confidenceLevel}</span>
                                            <Badge variant={
                                                session.confidenceLevel === 'high' ? 'default' :
                                                    session.confidenceLevel === 'medium' ? 'secondary' : 'destructive'
                                            }>
                                                {session.confidenceLevel}
                                            </Badge>
                                        </div>
                                        <Progress
                                            value={
                                                session.confidenceLevel === 'high' ? 100 :
                                                    session.confidenceLevel === 'medium' ? 60 : 30
                                            }
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Confidence Tips */}
                            {session.confidenceTips.length > 0 && (
                                <Card className="border-l-4 border-l-yellow-500">
                                    <CardHeader>
                                        <CardTitle className="text-sm flex items-center gap-2">
                                            <Lightbulb className="w-4 h-4" />
                                            Tips
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="space-y-2">
                                            {session.confidenceTips.map((tip, idx) => (
                                                <li key={idx} className="text-sm text-gray-700">• {tip}</li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Session Progress */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-sm">Session Progress</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Responses:</span>
                                        <span className="font-semibold">{session.transcript.length}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Current Part:</span>
                                        <span className="font-semibold">{session.currentPart}/3</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
