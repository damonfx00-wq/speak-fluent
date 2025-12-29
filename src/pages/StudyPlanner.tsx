import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { PlannerSetup } from "@/components/planner/PlannerSetup";
import { CalendarView } from "@/components/planner/CalendarView";
import { generateStudyPlan, StudyPlan, UserAvailability } from "@/lib/study-planner";
import { Button } from "@/components/ui/button";
import { Settings2 } from "lucide-react";

const StudyPlanner = () => {
    const [plan, setPlan] = useState<StudyPlan | null>(null);

    const handleSetupComplete = (availability: UserAvailability) => {
        const newPlan = generateStudyPlan(availability);
        setPlan(newPlan);
    };

    const handleReset = () => {
        if (confirm("Are you sure you want to reset your study plan? This cannot be undone.")) {
            setPlan(null);
        }
    };

    return (
        <Layout>
            <div className="gradient-hero py-8">
                <div className="container">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="font-heading text-3xl md:text-4xl font-bold mb-2">
                                Smart Study Planner
                            </h1>
                            <p className="text-muted-foreground">
                                {plan
                                    ? "Your personalized roadmap to IELTS success"
                                    : "Create a personalized schedule tailored to your goals"}
                            </p>
                        </div>
                        {plan && (
                            <Button variant="outline" onClick={handleReset} className="gap-2">
                                <Settings2 className="h-4 w-4" />
                                Adjust Plan
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            <div className="container py-8">
                {!plan ? (
                    <PlannerSetup onComplete={handleSetupComplete} />
                ) : (
                    <CalendarView plan={plan} />
                )}
            </div>
        </Layout>
    );
};

export default StudyPlanner;
