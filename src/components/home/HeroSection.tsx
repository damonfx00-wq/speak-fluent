import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Mic, Sparkles, Users } from "lucide-react";
import { Link } from "react-router-dom";

export function HeroSection() {
  return (
    <section className="relative gradient-hero overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute top-1/2 -left-20 h-60 w-60 rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="container relative py-20 md:py-28">
        <div className="mx-auto max-w-3xl text-center stagger-children">
          <Badge variant="secondary" className="mb-6 gap-2">
            <Sparkles className="h-3 w-3" />
            AI-Powered Speaking Practice
          </Badge>

          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6">
            Master IELTS Speaking{" "}
            <span className="text-gradient">with Confidence</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Practice all three IELTS speaking parts with instant AI feedback. 
            Improve fluency, pronunciation, and vocabulary — anytime, anywhere.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link to="/practice">
              <Button size="xl" className="gap-2">
                <Mic className="h-5 w-5" />
                Start Practicing
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Button variant="outline" size="xl">
              Watch Demo
            </Button>
          </div>

          <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <span>10,000+ Learners</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-accent" />
              <span>AI Feedback</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
