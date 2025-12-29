import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  MessageSquare, 
  FileText, 
  MessagesSquare, 
  Zap, 
  ArrowRight,
  Clock,
  Target
} from "lucide-react";
import { Link } from "react-router-dom";

const practiceModules = [
  {
    title: "Part 1: Interview",
    description: "Practice answering personal questions about familiar topics. The examiner asks about your home, family, work, studies, and interests.",
    icon: MessageSquare,
    duration: "4-5 minutes",
    questions: "8-12 questions",
    href: "/practice/part1",
    variant: "part1" as const,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    title: "Part 2: Cue Card",
    description: "Speak about a topic for 1-2 minutes. You'll have 1 minute to prepare and make notes before your long turn.",
    icon: FileText,
    duration: "3-4 minutes",
    questions: "1 topic card",
    href: "/practice/part2",
    variant: "part2" as const,
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    title: "Part 3: Discussion",
    description: "Engage in a deeper discussion related to Part 2 topic. Express and justify opinions on abstract ideas.",
    icon: MessagesSquare,
    duration: "4-5 minutes",
    questions: "4-6 questions",
    href: "/practice/part3",
    variant: "part3" as const,
    color: "text-success",
    bgColor: "bg-success/10",
  },
  {
    title: "Random Talk",
    description: "Boost your spontaneity with impromptu speaking practice on randomly selected topics and situations.",
    icon: Zap,
    duration: "Flexible",
    questions: "Random prompts",
    href: "/practice/random",
    variant: "warning" as const,
    color: "text-warning",
    bgColor: "bg-warning/10",
  },
];

const Practice = () => {
  return (
    <Layout>
      <div className="gradient-hero py-12">
        <div className="container">
          <h1 className="font-heading text-3xl md:text-4xl font-bold mb-3">
            Speaking Practice
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Choose a practice module to start improving your IELTS speaking skills
          </p>
        </div>
      </div>

      <div className="container py-12">
        <div className="grid md:grid-cols-2 gap-6">
          {practiceModules.map((module) => (
            <Card key={module.title} variant="feature" className="group">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className={`p-4 rounded-2xl ${module.bgColor} ${module.color} transition-transform group-hover:scale-110`}>
                    <module.icon className="h-7 w-7" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={module.variant}>{module.title.split(":")[0]}</Badge>
                    </div>
                    <CardTitle className="text-xl">{module.title}</CardTitle>
                  </div>
                </div>
                <CardDescription className="text-base mt-3">
                  {module.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    {module.duration}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Target className="h-4 w-4" />
                    {module.questions}
                  </div>
                </div>
                <Link to={module.href}>
                  <Button className="w-full gap-2">
                    Start Practice
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Practice;
