import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  MessageSquare, 
  FileText, 
  MessagesSquare, 
  Mic2, 
  BarChart3, 
  Zap 
} from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    title: "Part 1: Interview",
    description: "Practice short answers on familiar topics like home, work, and hobbies.",
    icon: MessageSquare,
    badge: "4-5 min",
    href: "/practice/part1",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    title: "Part 2: Cue Card",
    description: "Develop structured long-form speaking with 1-minute prep and 2-minute talk.",
    icon: FileText,
    badge: "3-4 min",
    href: "/practice/part2",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    title: "Part 3: Discussion",
    description: "Engage in analytical discussions with AI-generated follow-up questions.",
    icon: MessagesSquare,
    badge: "4-5 min",
    href: "/practice/part3",
    color: "text-success",
    bgColor: "bg-success/10",
  },
  {
    title: "Random Talk",
    description: "Boost spontaneity with impromptu speaking on random topics.",
    icon: Zap,
    badge: "Flexible",
    href: "/practice/random",
    color: "text-warning",
    bgColor: "bg-warning/10",
  },
  {
    title: "Pronunciation Drills",
    description: "Shadow native speakers and compare your pronunciation patterns.",
    icon: Mic2,
    badge: "Coming Soon",
    href: "#",
    color: "text-muted-foreground",
    bgColor: "bg-muted",
  },
  {
    title: "Progress Analytics",
    description: "Track your improvement with detailed speaking analytics over time.",
    icon: BarChart3,
    badge: "Dashboard",
    href: "/dashboard",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-20 bg-background">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
            Complete IELTS Speaking Preparation
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Practice every aspect of the IELTS speaking test with our comprehensive modules
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Link key={feature.title} to={feature.href}>
              <Card 
                variant="feature" 
                className="h-full"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className={`p-3 rounded-xl ${feature.bgColor} ${feature.color} transition-transform group-hover:scale-110`}>
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <Badge variant="secondary">{feature.badge}</Badge>
                  </div>
                  <CardTitle className="mt-4">{feature.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
