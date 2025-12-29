import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  Clock, 
  Target, 
  Award, 
  Calendar,
  Play,
  ChevronRight,
  Volume2,
  BookOpen,
  PenTool
} from "lucide-react";
import { Link } from "react-router-dom";

const stats = [
  { label: "Total Practice Time", value: "12.5 hrs", icon: Clock, change: "+2.3 hrs this week" },
  { label: "Average Band Score", value: "6.5", icon: Target, change: "+0.5 from last month" },
  { label: "Questions Answered", value: "156", icon: Award, change: "23 this week" },
  { label: "Practice Streak", value: "7 days", icon: Calendar, change: "Keep it up!" },
];

const skillProgress = [
  { skill: "Fluency", score: 6.5, progress: 75, icon: TrendingUp, color: "bg-primary" },
  { skill: "Pronunciation", score: 6.0, progress: 65, icon: Volume2, color: "bg-accent" },
  { skill: "Vocabulary", score: 6.5, progress: 72, icon: BookOpen, color: "bg-success" },
  { skill: "Grammar", score: 6.0, progress: 68, icon: PenTool, color: "bg-warning" },
];

const recentSessions = [
  { type: "Part 2", topic: "Describe a memorable trip", score: 6.5, date: "Today, 2:30 PM" },
  { type: "Part 1", topic: "Work & Studies", score: 7.0, date: "Today, 10:15 AM" },
  { type: "Part 3", topic: "Environment Discussion", score: 6.0, date: "Yesterday" },
  { type: "Random", topic: "Technology in Daily Life", score: 6.5, date: "Yesterday" },
];

const Dashboard = () => {
  return (
    <Layout>
      <div className="gradient-hero py-8">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="font-heading text-3xl md:text-4xl font-bold mb-2">
                Your Progress
              </h1>
              <p className="text-muted-foreground">
                Track your IELTS speaking improvement over time
              </p>
            </div>
            <Link to="/practice">
              <Button size="lg" className="gap-2">
                <Play className="h-4 w-4" />
                Continue Practice
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container py-8 space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label} variant="gradient">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                    <p className="text-2xl md:text-3xl font-heading font-bold">{stat.value}</p>
                    <p className="text-xs text-success mt-1">{stat.change}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-primary/10">
                    <stat.icon className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Skill Progress */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Skill Breakdown</CardTitle>
              <CardDescription>Your performance across IELTS speaking criteria</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {skillProgress.map((skill) => (
                <div key={skill.skill} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <skill.icon className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium text-sm">{skill.skill}</span>
                    </div>
                    <Badge variant="secondary" className="font-bold">
                      {skill.score}
                    </Badge>
                  </div>
                  <Progress value={skill.progress} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Sessions */}
          <Card variant="elevated">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Sessions</CardTitle>
                  <CardDescription>Your latest practice activities</CardDescription>
                </div>
                <Button variant="ghost" size="sm" className="gap-1">
                  View All
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentSessions.map((session, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <Badge 
                        variant={
                          session.type === "Part 1" ? "part1" :
                          session.type === "Part 2" ? "part2" :
                          session.type === "Part 3" ? "part3" : "warning"
                        }
                      >
                        {session.type}
                      </Badge>
                      <div>
                        <p className="font-medium text-sm">{session.topic}</p>
                        <p className="text-xs text-muted-foreground">{session.date}</p>
                      </div>
                    </div>
                    <Badge variant="default" className="font-bold">
                      {session.score}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card variant="gradient">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="font-heading text-lg font-semibold mb-1">
                  Ready for your next session?
                </h3>
                <p className="text-sm text-muted-foreground">
                  Based on your progress, we recommend focusing on Part 3 discussions
                </p>
              </div>
              <div className="flex gap-3">
                <Link to="/practice/part3">
                  <Button className="gap-2">
                    <Play className="h-4 w-4" />
                    Part 3 Practice
                  </Button>
                </Link>
                <Link to="/practice">
                  <Button variant="outline">
                    View All
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Dashboard;
