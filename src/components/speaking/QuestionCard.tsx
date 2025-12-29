import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuestionCardProps {
  question: string;
  part: 1 | 3;
  topic?: string;
  currentIndex?: number;
  totalQuestions?: number;
  onPrevious?: () => void;
  onNext?: () => void;
}

export function QuestionCard({
  question,
  part,
  topic,
  currentIndex = 1,
  totalQuestions = 1,
  onPrevious,
  onNext,
}: QuestionCardProps) {
  return (
    <Card variant="gradient" className="max-w-xl mx-auto">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <Badge variant={part === 1 ? "part1" : "part3"} className="gap-1.5">
            <MessageCircle className="h-3 w-3" />
            Part {part}
          </Badge>
          {topic && (
            <Badge variant="secondary">{topic}</Badge>
          )}
        </div>
        
        <p className="font-heading text-xl font-medium text-foreground leading-relaxed">
          {question}
        </p>

        {totalQuestions > 1 && (
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
            <Button
              variant="ghost"
              size="sm"
              onClick={onPrevious}
              disabled={currentIndex === 1}
              className="gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              {currentIndex} of {totalQuestions}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={onNext}
              disabled={currentIndex === totalQuestions}
              className="gap-1"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
