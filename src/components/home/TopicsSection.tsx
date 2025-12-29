import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const topics = [
  { name: "Education", questions: 24, color: "from-blue-500/20 to-cyan-500/20" },
  { name: "Technology", questions: 18, color: "from-purple-500/20 to-pink-500/20" },
  { name: "Environment", questions: 21, color: "from-green-500/20 to-emerald-500/20" },
  { name: "Health", questions: 16, color: "from-red-500/20 to-orange-500/20" },
  { name: "Culture", questions: 20, color: "from-amber-500/20 to-yellow-500/20" },
  { name: "Travel", questions: 22, color: "from-teal-500/20 to-cyan-500/20" },
];

export function TopicsSection() {
  return (
    <section className="py-20 bg-secondary/30">
      <div className="container">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-3">
              Topic-Based Practice
            </h2>
            <p className="text-muted-foreground text-lg">
              Master speaking across all common IELTS themes
            </p>
          </div>
          <Link to="/practice/topics" className="hidden sm:block">
            <Button variant="ghost" className="gap-2">
              View All Topics
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {topics.map((topic) => (
            <Link key={topic.name} to={`/practice/topics/${topic.name.toLowerCase()}`}>
              <Card variant="interactive" className="text-center group">
                <CardContent className="p-5">
                  <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br ${topic.color} flex items-center justify-center text-2xl transition-transform group-hover:scale-110`}>
                    {topic.name.charAt(0)}
                  </div>
                  <h3 className="font-medium text-sm mb-1">{topic.name}</h3>
                  <Badge variant="secondary" className="text-xs">
                    {topic.questions} questions
                  </Badge>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <Link to="/practice/topics" className="sm:hidden">
          <Button variant="ghost" className="w-full mt-6 gap-2">
            View All Topics
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
