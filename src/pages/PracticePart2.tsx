import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { CueCard } from "@/components/speaking/CueCard";
import { RecordButton } from "@/components/speaking/RecordButton";
import { Timer } from "@/components/speaking/Timer";
import { FeedbackPanel } from "@/components/speaking/FeedbackPanel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, RefreshCw, PenLine, Play, RotateCcw } from "lucide-react";
import { Link } from "react-router-dom";

type Stage = "prep" | "speaking" | "done";

const sampleCueCard = {
  topic: "Describe a place you like to visit in your free time",
  prompts: [
    "where this place is",
    "how often you go there",
    "what you do there",
    "and explain why you like this place",
  ],
};

const PracticePart2 = () => {
  const [stage, setStage] = useState<Stage>("prep");
  const [notes, setNotes] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [prepTimerRunning, setPrepTimerRunning] = useState(false);

  const handleStartPrep = () => {
    setPrepTimerRunning(true);
  };

  const handlePrepComplete = () => {
    setPrepTimerRunning(false);
    setStage("speaking");
  };

  const handleRecordToggle = () => {
    if (isRecording) {
      setIsRecording(false);
      setStage("done");
      setShowFeedback(true);
    } else {
      setIsRecording(true);
    }
  };

  const handleReset = () => {
    setStage("prep");
    setNotes("");
    setIsRecording(false);
    setShowFeedback(false);
    setPrepTimerRunning(false);
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
            <Badge variant="part2" className="text-sm">Part 2</Badge>
            <h1 className="font-heading text-2xl md:text-3xl font-bold">
              Cue Card Practice
            </h1>
          </div>
        </div>
      </div>

      <div className="container py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Practice Area */}
          <div className="lg:col-span-2 space-y-6">
            <CueCard
              topic={sampleCueCard.topic}
              prompts={sampleCueCard.prompts}
            />

            {/* Stage-based content */}
            {stage === "prep" && (
              <>
                <Card variant="gradient" className="p-6">
                  <div className="flex flex-col items-center gap-6">
                    <div className="text-center">
                      <Badge variant="secondary" className="mb-3">Preparation Time</Badge>
                      <Timer
                        duration={60}
                        isRunning={prepTimerRunning}
                        variant="countdown"
                        onComplete={handlePrepComplete}
                      />
                    </div>
                    
                    {!prepTimerRunning ? (
                      <Button onClick={handleStartPrep} size="lg" className="gap-2">
                        <Play className="h-4 w-4" />
                        Start Preparation
                      </Button>
                    ) : (
                      <Button onClick={handlePrepComplete} variant="secondary" size="lg">
                        Skip to Speaking
                      </Button>
                    )}
                  </div>
                </Card>

                <Card variant="default">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <PenLine className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium text-sm">Your Notes</span>
                    </div>
                    <Textarea
                      placeholder="Jot down quick notes and ideas here..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="min-h-[120px] resize-none"
                    />
                  </CardContent>
                </Card>
              </>
            )}

            {stage === "speaking" && (
              <Card variant="gradient" className="p-8">
                <div className="flex flex-col items-center gap-6">
                  <div className="text-center">
                    <Badge variant="accent" className="mb-3">Speaking Time</Badge>
                    <Timer
                      duration={120}
                      isRunning={isRecording}
                      variant="stopwatch"
                    />
                  </div>
                  
                  <RecordButton
                    isRecording={isRecording}
                    onToggle={handleRecordToggle}
                    size="large"
                  />
                  
                  <p className="text-sm text-muted-foreground">
                    {isRecording 
                      ? "Speaking... Click to finish" 
                      : "Click to start speaking"}
                  </p>
                </div>
              </Card>
            )}

            {stage === "done" && (
              <Card variant="gradient" className="p-6">
                <div className="flex flex-col items-center gap-4">
                  <div className="text-center">
                    <h3 className="font-heading text-xl font-semibold mb-2">
                      Great job! 🎉
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Check your feedback on the right panel
                    </p>
                  </div>
                  <Button onClick={handleReset} variant="outline" className="gap-2">
                    <RotateCcw className="h-4 w-4" />
                    Try Another Topic
                  </Button>
                </div>
              </Card>
            )}
          </div>

          {/* Feedback Panel */}
          <div className="lg:col-span-1">
            {showFeedback ? (
              <FeedbackPanel 
                overallBand={6.5}
                suggestions={[
                  "Good structure following the cue card prompts",
                  "Try adding more descriptive vocabulary",
                  "Use more linking phrases between ideas",
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
                    Complete your 2-minute speaking task to receive detailed feedback.
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

export default PracticePart2;
