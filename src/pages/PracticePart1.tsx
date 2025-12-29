import { useState, useEffect } from 'react';
import { speakFluentAPI } from '@/lib/api-client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Mic, Send, RefreshCw, Clock } from 'lucide-react';
import { Layout } from "@/components/layout/Layout";

export default function DynamicPracticePart1() {
  const [practiceContent, setPracticeContent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userResponse, setUserResponse] = useState('');
  const [responses, setResponses] = useState<string[]>([]);
  const [startTime, setStartTime] = useState<Date | null>(null);

  useEffect(() => {
    loadPracticeContent();
  }, []);

  const loadPracticeContent = async () => {
    setIsLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      const content = await speakFluentAPI.getDailyPractice(1, today, 1);
      setPracticeContent(content);
      setStartTime(new Date());
    } catch (error) {
      console.error('Failed to load practice content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const submitResponse = async () => {
    if (!userResponse.trim()) return;

    setResponses([...responses, userResponse]);
    setUserResponse('');

    // Move to next question
    if (currentQuestionIndex < (practiceContent?.content?.questions?.length || 0) - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Practice complete
      const duration = startTime ? Math.floor((new Date().getTime() - startTime.getTime()) / 60000) : 0;
      await speakFluentAPI.updateProgress(1, 'practice_part1', undefined, duration);
      alert('Part 1 practice complete! Great job!');
    }
  };

  const currentQuestion = practiceContent?.content?.questions?.[currentQuestionIndex];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              IELTS Speaking Part 1
            </h1>
            <p className="text-gray-600">Introduction & Interview Questions</p>
          </div>

          {isLoading ? (
            <Card>
              <CardContent className="p-12 text-center">
                <RefreshCw className="w-12 h-12 mx-auto mb-4 animate-spin text-blue-600" />
                <p>Loading today's practice questions...</p>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Progress */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Badge variant="outline">
                        Question {currentQuestionIndex + 1} / {practiceContent?.content?.questions?.length || 0}
                      </Badge>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>Expected: {practiceContent?.content?.expected_duration || '10-15'} min</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={loadPracticeContent}>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      New Questions
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Current Question */}
              <Card className="border-l-4 border-l-green-500">
                <CardHeader>
                  <CardTitle>Question {currentQuestionIndex + 1}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-medium text-gray-800">
                    {currentQuestion}
                  </p>
                </CardContent>
              </Card>

              {/* Tips */}
              {practiceContent?.content?.tips && (
                <Card className="bg-blue-50 border-blue-200">
                  <CardHeader>
                    <CardTitle className="text-sm">💡 Tips</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1">
                      {practiceContent.content.tips.map((tip: string, idx: number) => (
                        <li key={idx} className="text-sm text-gray-700">• {tip}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Response Input */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mic className="w-5 h-5" />
                    Your Response
                  </CardTitle>
                  <CardDescription>
                    Speak naturally for 20-30 seconds
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    value={userResponse}
                    onChange={(e) => setUserResponse(e.target.value)}
                    placeholder="Type your response here..."
                    rows={6}
                    className="resize-none"
                  />
                  <Button
                    onClick={submitResponse}
                    disabled={!userResponse.trim()}
                    className="w-full bg-gradient-to-r from-green-600 to-blue-600"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Submit & Next Question
                  </Button>
                </CardContent>
              </Card>

              {/* Vocabulary */}
              {practiceContent?.content?.vocabulary && practiceContent.content.vocabulary.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">📚 Useful Vocabulary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {practiceContent.content.vocabulary.map((word: string, idx: number) => (
                        <Badge key={idx} variant="secondary">{word}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Previous Responses */}
              {responses.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Your Previous Responses</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {responses.map((response, idx) => (
                        <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-xs text-gray-500 mb-1">Question {idx + 1}</p>
                          <p className="text-sm text-gray-700">{response}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
