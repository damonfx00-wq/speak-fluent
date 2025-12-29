import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { RecordButton } from "@/components/speaking/RecordButton";
import { Timer } from "@/components/speaking/Timer";
import { FeedbackPanel } from "@/components/speaking/FeedbackPanel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Shuffle, RefreshCw, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const randomTopics = [
  "Talk about your last vacation and what made it memorable.",
  "Describe a skill you would like to learn and why.",
  "What's your opinion on working from home?",
  "Talk about a book, movie, or TV show that influenced you.",
  "Describe your ideal weekend.",
  "What do you think about the role of technology in education?",
  "Talk about a person who inspires you.",
  "Describe a challenge you overcame recently.",
];

const durations = [
  { label: "30 sec", value: 30 },
  { label: "1 min", value: 60 },
  { label: "2 min", value: 120 },
];

const RandomTalk = () => {
  const [topic, setTopic] = useState<string | null>(null);
  const [selectedDuration, setSelectedDuration] = useState(60);
  const [isRecording, setIsRecording] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleGetTopic = () => {
    const randomIndex = Math.floor(Math.random() * randomTopics.length);
    setTopic(randomTopics[randomIndex]);
    setShowFeedback(false);
  };

  const handleRecordToggle = () => {
    if (isRecording) {
      setIsRecording(false);
      setShowFeedback(true);
    } else {
      setIsRecording(true);
    }
  };

  const handleTimerComplete = () => {
    setIsRecording(false);
    setShowFeedback(true);
  };

  return (
    <Layout>
      <div className="gradient-hero py-6">
        <div className="container">
          <Link to="/practice">
            <Button variant="ghost" size="sm" className="gap-2 mb-4">
              <ArrowLeft className="h-4 w-4" />
              Back to Practice
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <Badge variant="warning" className="text-sm">Random</Badge>
            <h1 className="font-heading text-2xl md:text-3xl font-bold">
              Random Talk
            </h1>
          </div>
        </div>
      </div>

      <div className="container py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Practice Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Duration Selector */}
            <Card variant="default">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Duration:</span>
                  </div>
                  <div className="flex gap-2">
                    {durations.map((duration) => (
                      <Button
                        key={duration.value}
                        variant={selectedDuration === duration.value ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedDuration(duration.value)}
                        disabled={isRecording}
                      >
                        {duration.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Topic Card */}
            <Card variant="gradient" className="min-h-[200px]">
              <CardContent className="p-8 flex flex-col items-center justify-center text-center">
                {topic ? (
                  <div className="space-y-4 animate-fade-in-up">
                    <Badge variant="warning" className="gap-1.5">
                      <Shuffle className="h-3 w-3" />
                      Random Topic
                    </Badge>
                    <p className="font-heading text-xl md:text-2xl font-semibold text-foreground leading-relaxed max-w-lg">
                      {topic}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="w-16 h-16 mx-auto rounded-full bg-warning/10 flex items-center justify-center">
                      <Shuffle className="h-7 w-7 text-warning" />
                    </div>
                    <p className="text-muted-foreground">
                      Click below to get a random speaking topic
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Get Topic / Recording Controls */}
            <Card variant="gradient" className="p-8">
              <div className="flex flex-col items-center gap-6">
                {!topic ? (
                  <Button onClick={handleGetTopic} size="xl" variant="accent" className="gap-2">
                    <Shuffle className="h-5 w-5" />
                    Get Random Topic
                  </Button>
                ) : (
                  <>
                    {isRecording && (
                      <Timer
                        duration={selectedDuration}
                        isRunning={isRecording}
                        variant="countdown"
                        onComplete={handleTimerComplete}
                      />
                    )}
                    
                    <RecordButton
                      isRecording={isRecording}
                      onToggle={handleRecordToggle}
                      size="large"
                    />
                    
                    <div className="flex items-center gap-4">
                      <p className="text-sm text-muted-foreground">
                        {isRecording 
                          ? "Recording... Click to stop" 
                          : "Click to start speaking"}
                      </p>
                    </div>

                    {!isRecording && (
                      <Button onClick={handleGetTopic} variant="ghost" className="gap-2">
                        <Shuffle className="h-4 w-4" />
                        New Topic
                      </Button>
                    )}
                  </>
                )}
              </div>
            </Card>

            {/* Tips */}
            <Card variant="default">
              <CardContent className="p-4">
                <h4 className="font-medium text-sm mb-3">Why Random Talk?</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-warning mt-1">•</span>
                    Builds spontaneity and quick thinking
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-warning mt-1">•</span>
                    Reduces anxiety when facing unexpected topics
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-warning mt-1">•</span>
                    Improves confidence in real exam situations
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Feedback Panel */}
          <div className="lg:col-span-1">
            {showFeedback ? (
              <FeedbackPanel 
                overallBand={6.0}
                suggestions={[
                  "Good spontaneous response!",
                  "Try to organize ideas quickly in your head",
                  "Use filler phrases naturally while thinking",
                ]}
              />
            ) : (
              <Card variant="default" className="p-6 text-center">
                <div className="py-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary flex items-center justify-center">
                    <RefreshCw className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="font-medium mb-2">AI Feedback</h3>
                  <p className="text-sm text-muted-foreground">
                    Complete a random speaking task to receive feedback on your spontaneous speaking.
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RandomTalk;
