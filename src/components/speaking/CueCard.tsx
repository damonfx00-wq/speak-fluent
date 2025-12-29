import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";

interface CueCardProps {
  topic: string;
  prompts: string[];
  thinkingTime?: string;
  speakingTime?: string;
}

export function CueCard({
  topic,
  prompts,
  thinkingTime = "1 minute",
  speakingTime = "1-2 minutes",
}: CueCardProps) {
  return (
    <Card variant="gradient" className="max-w-xl mx-auto">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <Badge variant="part2" className="gap-1.5">
            <FileText className="h-3 w-3" />
            Cue Card
          </Badge>
          <div className="flex gap-2">
            <Badge variant="secondary">Think: {thinkingTime}</Badge>
            <Badge variant="secondary">Speak: {speakingTime}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <h2 className="font-heading text-xl font-semibold text-foreground">
          {topic}
        </h2>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground font-medium">
            You should say:
          </p>
          <ul className="space-y-2">
            {prompts.map((prompt, index) => (
              <li
                key={index}
                className="flex items-start gap-3 text-sm text-foreground"
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                  {index + 1}
                </span>
                {prompt}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
