import { useState, useEffect } from 'react';
import { speakFluentAPI } from '@/lib/api-client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Target, TrendingUp, Calendar, Award, Zap, Clock,
  BookOpen, Brain, Rocket, CheckCircle2
} from 'lucide-react';

export default function DynamicDashboard() {
  const [roadmap, setRoadmap] = useState<any>(null);
  const [progress, setProgress] = useState<any>(null);
  const [comingSoon, setComingSoon] = useState<any>(null);
  const [dailyTopics, setDailyTopics] = useState<any>(null);
  const [dailyVocab, setDailyVocab] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showRoadmapForm, setShowRoadmapForm] = useState(true);

  // Roadmap form state
  const [formData, setFormData] = useState({
    currentBand: 6.0,
    targetBand: 7.5,
    availableDays: 5,
    totalWeeks: 8,
    weakAreas: [] as string[],
    practiceTime: '30min'
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [progressData, features, topics, vocab] = await Promise.all([
        speakFluentAPI.getUserProgress(1),
        speakFluentAPI.getComingSoonFeatures(),
        speakFluentAPI.getDailyTopics(),
        speakFluentAPI.getDailyVocabulary()
      ]);

      setProgress(progressData);
      setComingSoon(features);
      setDailyTopics(topics);
      setDailyVocab(vocab);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    }
  };

  const generateRoadmap = async () => {
    setIsLoading(true);
    try {
      const roadmapData = await speakFluentAPI.generateRoadmap(
        1, // user_id
        formData.targetBand,
        formData.currentBand,
        formData.availableDays,
        formData.totalWeeks,
        formData.weakAreas,
        formData.practiceTime
      );

      setRoadmap(roadmapData);
      setShowRoadmapForm(false);
    } catch (error) {
      console.error('Failed to generate roadmap:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Your Learning Dashboard
          </h1>
          <p className="text-gray-600">Track progress, plan your journey, and achieve your goals</p>
        </div>

        <Tabs defaultValue="roadmap" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="roadmap">
              <Target className="w-4 h-4 mr-2" />
              Roadmap
            </TabsTrigger>
            <TabsTrigger value="progress">
              <TrendingUp className="w-4 h-4 mr-2" />
              Progress
            </TabsTrigger>
            <TabsTrigger value="daily">
              <Calendar className="w-4 h-4 mr-2" />
              Daily
            </TabsTrigger>
            <TabsTrigger value="coming-soon">
              <Rocket className="w-4 h-4 mr-2" />
              Coming Soon
            </TabsTrigger>
          </TabsList>

          {/* Roadmap Tab */}
          <TabsContent value="roadmap" className="space-y-6">
            {showRoadmapForm || !roadmap ? (
              <Card>
                <CardHeader>
                  <CardTitle>Create Your Personalized Roadmap</CardTitle>
                  <CardDescription>
                    Tell us about your goals and we'll create a custom study plan
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Current Band Score</Label>
                      <Input
                        type="number"
                        step="0.5"
                        min="4"
                        max="9"
                        value={formData.currentBand}
                        onChange={(e) => setFormData({ ...formData, currentBand: parseFloat(e.target.value) })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Target Band Score</Label>
                      <Input
                        type="number"
                        step="0.5"
                        min="4"
                        max="9"
                        value={formData.targetBand}
                        onChange={(e) => setFormData({ ...formData, targetBand: parseFloat(e.target.value) })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Available Days Per Week</Label>
                      <Input
                        type="number"
                        min="1"
                        max="7"
                        value={formData.availableDays}
                        onChange={(e) => setFormData({ ...formData, availableDays: parseInt(e.target.value) })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Total Weeks</Label>
                      <Input
                        type="number"
                        min="1"
                        max="52"
                        value={formData.totalWeeks}
                        onChange={(e) => setFormData({ ...formData, totalWeeks: parseInt(e.target.value) })}
                      />
                    </div>
                  </div>
                  <Button
                    onClick={generateRoadmap}
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
                  >
                    {isLoading ? 'Generating...' : 'Generate My Roadmap'}
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Your {roadmap.total_weeks}-Week Roadmap</h2>
                  <Button variant="outline" onClick={() => setShowRoadmapForm(true)}>
                    Create New
                  </Button>
                </div>

                {roadmap.weekly_plan?.map((week: any, idx: number) => (
                  <Card key={idx}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>Week {week.week}: {week.focus}</span>
                        <Badge>{week.expected_improvement}</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4">
                        <strong>Milestone:</strong> {week.milestone}
                      </p>
                      {week.daily_activities?.slice(0, 3).map((day: any, dayIdx: number) => (
                        <div key={dayIdx} className="mb-2">
                          <p className="font-semibold text-sm">{day.day}:</p>
                          <ul className="ml-4 text-sm text-gray-600">
                            {day.activities?.map((activity: any, actIdx: number) => (
                              <li key={actIdx}>
                                • {activity.type} - {activity.duration} min
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress" className="space-y-6">
            {progress && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-gray-600">Current Band</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-blue-600">
                        {progress.current_band}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-gray-600">Target Band</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-purple-600">
                        {progress.target_band}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-gray-600">Progress</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-green-600">
                        {progress.progress_percentage}%
                      </div>
                      <Progress value={progress.progress_percentage} className="mt-2" />
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Statistics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          {progress.stats?.total_practice_sessions || 0}
                        </div>
                        <div className="text-sm text-gray-600">Sessions</div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">
                          {progress.stats?.total_hours || 0}h
                        </div>
                        <div className="text-sm text-gray-600">Practice Time</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          {progress.stats?.current_streak || 0}
                        </div>
                        <div className="text-sm text-gray-600">Day Streak</div>
                      </div>
                      <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">
                          {progress.stats?.completed_activities?.mock_tests || 0}
                        </div>
                        <div className="text-sm text-gray-600">Mock Tests</div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Recommendations</h3>
                      <ul className="space-y-1">
                        {progress.recommendations?.map((rec: string, idx: number) => (
                          <li key={idx} className="text-sm text-gray-700 flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          {/* Daily Tab */}
          <TabsContent value="daily" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Daily Topics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Today's Topics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {dailyTopics?.topics?.map((topic: any, idx: number) => (
                    <div key={idx} className="mb-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <Badge variant="outline">Part {topic.part}</Badge>
                        <Badge variant={
                          topic.difficulty === 'easy' ? 'default' :
                            topic.difficulty === 'medium' ? 'secondary' : 'destructive'
                        }>
                          {topic.difficulty}
                        </Badge>
                      </div>
                      <p className="text-sm font-medium">{topic.topic}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Daily Vocabulary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5" />
                    Vocabulary of the Day
                  </CardTitle>
                  <CardDescription>
                    Theme: {dailyVocab?.theme || 'General'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {dailyVocab?.words?.slice(0, 5).map((word: any, idx: number) => (
                    <div key={idx} className="mb-3 p-3 bg-gray-50 rounded-lg">
                      <p className="font-semibold text-blue-600">{word.word}</p>
                      <p className="text-sm text-gray-600">{word.definition}</p>
                      <p className="text-xs text-gray-500 italic mt-1">{word.example}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Coming Soon Tab */}
          <TabsContent value="coming-soon" className="space-y-4">
            {comingSoon?.features?.map((feature: any, idx: number) => (
              <Card key={idx}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-yellow-500" />
                      {feature.name}
                    </CardTitle>
                    <Badge variant={
                      feature.status === 'In Development' ? 'default' : 'secondary'
                    }>
                      {feature.status}
                    </Badge>
                  </div>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-semibold">{feature.progress}%</span>
                    </div>
                    <Progress value={feature.progress} />
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>ETA: {feature.eta}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
