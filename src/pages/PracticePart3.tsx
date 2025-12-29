import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { QuestionCard } from "@/components/speaking/QuestionCard";
import { RecordButton } from "@/components/speaking/RecordButton";
import { FeedbackPanel } from "@/components/speaking/FeedbackPanel";
import { IdeaGenerator } from "@/components/speaking/IdeaGenerator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, RefreshCw, MessageCircle, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const discussionQuestions = [
  "Why do you think some places become popular tourist destinations?",
  "How has tourism changed in your country over the years?",
  "Do you think tourism has more positive or negative effects on local communities?",
  "What role does social media play in promoting travel destinations?",
  "How might tourism change in the future with technology advancements?",
];

const PracticePart3 = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState<number[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);

  const currentQuestion = discussionQuestions[currentIndex];

  const handleRecordToggle = () => {
    if (isRecording) {
      setIsRecording(false);
      if (!answeredQuestions.includes(currentIndex)) {
        setAnsweredQuestions([...answeredQuestions, currentIndex]);
      }
      setShowFeedback(true);
    } else {
      setIsRecording(true);
      setShowFeedback(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < discussionQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowFeedback(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowFeedback(false);
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
            <Badge variant="part3" className="text-sm">Part 3</Badge>
            <h1 className="font-heading text-2xl md:text-3xl font-bold">
              Discussion Practice
            </h1>
          </div>
        </div>
      </div>

      <div className="container py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Practice Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress indicator */}
            <div className="flex items-center gap-2">
              {discussionQuestions.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 flex-1 rounded-full transition-colors ${answeredQuestions.includes(index)
                    ? "bg-success"
                    : index === currentIndex
                      ? "bg-primary"
                      : "bg-muted"
                    }`}
                />
              ))}
            </div>

            <QuestionCard
              question={currentQuestion}
              part={3}
              topic="Tourism & Travel"
              currentIndex={currentIndex + 1}
              totalQuestions={discussionQuestions.length}
              onPrevious={handlePrevious}
              onNext={handleNext}
            />

            <IdeaGenerator topic={currentQuestion} />

            {/* Recording Controls */}
            <Card variant="gradient" className="p-8">
              <div className="flex flex-col items-center gap-6">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MessageCircle className="h-4 w-4" />
                  <span>Take your time — no strict limit for Part 3</span>
                </div>

                <RecordButton
                  isRecording={isRecording}
                  onToggle={handleRecordToggle}
                  size="large"
                />

                <p className="text-sm text-muted-foreground">
                  {isRecording
                    ? "Recording... Click to stop when done"
                    : "Click to start your response"}
                </p>
              </div>
            </Card>

            {/* Tips Card */}
            <Card variant="default">
              <CardContent className="p-4">
                <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                  <ChevronRight className="h-4 w-4 text-primary" />
                  Part 3 Tips
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    Give extended answers with examples and explanations
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    Express opinions and support them with reasons
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    Use academic vocabulary and complex sentence structures
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Feedback Panel */}
          <div className="lg:col-span-1">
            {showFeedback ? (
              <FeedbackPanel
                overallBand={6.5}
                scores={[
                  { label: "Fluency", score: 7.0, icon: () => null, color: "text-primary" },
                  { label: "Coherence", score: 6.5, icon: () => null, color: "text-accent" },
                  { label: "Vocabulary", score: 6.5, icon: () => null, color: "text-success" },
                  { label: "Grammar", score: 6.0, icon: () => null, color: "text-warning" },
                ]}
                suggestions={[
                  "Great use of examples to support your point",
                  "Try varying your sentence structures more",
                  "Consider both sides of the argument",
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
                    Record your discussion response to receive feedback on coherence and argumentation.
                  </p>
                </div>
              </Card>
            )}

            {/* Progress Summary */}
            <Card variant="default" className="p-4 mt-4">
              <h4 className="font-medium text-sm mb-3">Session Progress</h4>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Questions answered</span>
                <Badge variant="success">
                  {answeredQuestions.length} / {discussionQuestions.length}
                </Badge>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PracticePart3;
