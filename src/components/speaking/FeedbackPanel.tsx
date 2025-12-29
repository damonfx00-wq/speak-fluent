import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Volume2, BookOpen, PenTool } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeedbackScore {
  label: string;
  score: number;
  icon: React.ElementType;
  color: string;
}

interface FeedbackPanelProps {
  scores?: FeedbackScore[];
  overallBand?: number;
  suggestions?: string[];
  className?: string;
}

const defaultScores: FeedbackScore[] = [
  { label: "Fluency", score: 6.5, icon: TrendingUp, color: "text-primary" },
  { label: "Pronunciation", score: 6.0, icon: Volume2, color: "text-accent" },
  { label: "Vocabulary", score: 6.5, icon: BookOpen, color: "text-success" },
  { label: "Grammar", score: 6.0, icon: PenTool, color: "text-warning" },
];

export function FeedbackPanel({
  scores = defaultScores,
  overallBand = 6.5,
  suggestions = [
    "Try to use more complex sentence structures",
    "Expand your vocabulary with topic-specific words",
    "Work on natural pausing and intonation",
  ],
  className,
}: FeedbackPanelProps) {
  return (
    <Card variant="elevated" className={cn("w-full", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle>AI Feedback</CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Overall Band:</span>
            <Badge variant="default" className="text-lg font-bold px-3 py-1">
              {overallBand}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          {scores.map((score) => (
            <div
              key={score.label}
              className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50"
            >
              <div className={cn("p-2 rounded-lg bg-card", score.color)}>
                <score.icon className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{score.label}</p>
                <p className="text-lg font-bold">{score.score}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <h4 className="font-medium text-sm text-muted-foreground">
            Suggestions for Improvement
          </h4>
          <ul className="space-y-2">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-sm text-foreground"
              >
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
