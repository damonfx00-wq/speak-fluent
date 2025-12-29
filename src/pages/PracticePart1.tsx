import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { QuestionCard } from "@/components/speaking/QuestionCard";
import { RecordButton } from "@/components/speaking/RecordButton";
import { Timer } from "@/components/speaking/Timer";
import { FeedbackPanel } from "@/components/speaking/FeedbackPanel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, RefreshCw, Lightbulb, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

const sampleQuestions = [
  { question: "Do you work or are you a student?", topic: "Work/Study" },
  { question: "What do you enjoy most about your work or studies?", topic: "Work/Study" },
  { question: "How do you usually spend your weekends?", topic: "Leisure" },
  { question: "Do you prefer spending time alone or with others?", topic: "Lifestyle" },
  { question: "What kind of music do you like?", topic: "Hobbies" },
];

const PracticePart1 = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showSampleAnswer, setShowSampleAnswer] = useState(false);

  const currentQuestion = sampleQuestions[currentIndex];

  const handleRecordToggle = () => {
    if (isRecording) {
      setIsRecording(false);
      setShowFeedback(true);
    } else {
      setIsRecording(true);
      setShowFeedback(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < sampleQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowFeedback(false);
      setShowSampleAnswer(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowFeedback(false);
      setShowSampleAnswer(false);
    }
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
            <Badge variant="part1" className="text-sm">Part 1</Badge>
            <h1 className="font-heading text-2xl md:text-3xl font-bold">
              Interview Practice
            </h1>
          </div>
        </div>
      </div>

      <div className="container py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Practice Area */}
          <div className="lg:col-span-2 space-y-6">
            <QuestionCard
              question={currentQuestion.question}
              part={1}
              topic={currentQuestion.topic}
              currentIndex={currentIndex + 1}
              totalQuestions={sampleQuestions.length}
              onPrevious={handlePrevious}
              onNext={handleNext}
            />

            {/* Recording Controls */}
            <Card variant="gradient" className="p-8">
              <div className="flex flex-col items-center gap-6">
                {isRecording && (
                  <Timer
                    duration={30}
                    isRunning={isRecording}
                    variant="countdown"
                  />
                )}
                
                <RecordButton
                  isRecording={isRecording}
                  onToggle={handleRecordToggle}
                  size="large"
                />
                
                <p className="text-sm text-muted-foreground">
                  {isRecording 
                    ? "Recording... Click to stop" 
                    : "Click to start recording your answer"}
                </p>
              </div>
            </Card>

            {/* Sample Answer Toggle */}
            <Card variant="default">
              <CardContent className="p-4">
                <button
                  onClick={() => setShowSampleAnswer(!showSampleAnswer)}
                  className="flex items-center justify-between w-full text-left"
                >
                  <div className="flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-warning" />
                    <span className="font-medium text-sm">View Sample Answer</span>
                  </div>
                  <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${showSampleAnswer ? 'rotate-180' : ''}`} />
                </button>
                {showSampleAnswer && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      "Actually, I'm currently working as a software developer at a tech company. 
                      I've been in this role for about two years now. What I enjoy most is the 
                      problem-solving aspect — it's like solving puzzles every day, which keeps 
                      me engaged and motivated."
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Feedback Panel */}
          <div className="lg:col-span-1">
            {showFeedback ? (
              <FeedbackPanel />
            ) : (
              <Card variant="default" className="p-6 text-center">
                <div className="py-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary flex items-center justify-center">
                    <RefreshCw className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="font-medium mb-2">AI Feedback</h3>
                  <p className="text-sm text-muted-foreground">
                    Record your answer to receive instant feedback on fluency, vocabulary, and grammar.
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

export default PracticePart1;
