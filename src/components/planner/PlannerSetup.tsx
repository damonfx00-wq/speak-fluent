import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar, Clock, Target, CheckCircle2, ArrowRight, Sparkles } from "lucide-react";
import { DayOfWeek, UserAvailability } from "@/lib/study-planner";

interface PlannerSetupProps {
    onComplete: (availability: UserAvailability) => void;
}

const DAYS: DayOfWeek[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const WEAKNESSES = ["Fluency", "Vocabulary", "Grammar", "Pronunciation", "Coherence"];

export const PlannerSetup = ({ onComplete }: PlannerSetupProps) => {
    const [step, setStep] = useState(1);
    const [days, setDays] = useState<DayOfWeek[]>([]);
    const [duration, setDuration] = useState<number>(30);
    const [targetBand, setTargetBand] = useState<number>(7.0);
    const [weaknesses, setWeaknesses] = useState<string[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);

    const toggleDay = (day: DayOfWeek) => {
        if (days.includes(day)) {
            setDays(days.filter(d => d !== day));
        } else {
            setDays([...days, day]);
        }
    };

    const toggleWeakness = (weakness: string) => {
        if (weaknesses.includes(weakness)) {
            setWeaknesses(weaknesses.filter(w => w !== weakness));
        } else {
            setWeaknesses([...weaknesses, weakness]);
        }
    };

    const handleNext = () => {
        setStep(step + 1);
    };

    const handleFinish = () => {
        setIsGenerating(true);
        // Simulate AI processing
        setTimeout(() => {
            onComplete({
                days,
                timeSlots: {}, // Default for now
                durationMinutes: duration as 15 | 30 | 45 | 60,
                targetBand,
                weaknesses
            });
        }, 2000);
    };

    if (isGenerating) {
        return (
            <Card className="w-full max-w-lg mx-auto border-dashed border-2">
                <CardContent className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                    <div className="relative">
                        <Sparkles className="h-12 w-12 text-primary animate-pulse" />
                        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
                    </div>
                    <h3 className="text-xl font-heading font-semibold">Building Your Personal Plan</h3>
                    <p className="text-muted-foreground max-w-xs">
                        Analyzing your goals and availability to create the perfect schedule...
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full max-w-2xl mx-auto shadow-lg">
            <CardHeader>
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-muted-foreground">Step {step} of 2</span>
                    <div className="flex gap-1">
                        <div className={`h-2 w-8 rounded-full ${step >= 1 ? "bg-primary" : "bg-secondary"}`} />
                        <div className={`h-2 w-8 rounded-full ${step >= 2 ? "bg-primary" : "bg-secondary"}`} />
                    </div>
                </div>
                <CardTitle className="text-2xl font-heading">
                    {step === 1 ? "Availability & Time" : "Goals & Focus"}
                </CardTitle>
                <CardDescription>
                    {step === 1
                        ? "Let us know when you can practice to build a realistic schedule."
                        : "Tell us what you want to achieve."}
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
                {step === 1 && (
                    <>
                        <div className="space-y-3">
                            <Label className="text-base">Which days can you practice?</Label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {DAYS.map((day) => (
                                    <div
                                        key={day}
                                        onClick={() => toggleDay(day)}
                                        className={`
                      cursor-pointer rounded-lg border p-3 flex items-center gap-2 transition-all
                      ${days.includes(day)
                                                ? "border-primary bg-primary/5 ring-1 ring-primary"
                                                : "border-input hover:bg-accent hover:text-accent-foreground"}
                    `}
                                    >
                                        <Checkbox checked={days.includes(day)} className="pointer-events-none" />
                                        <span className="text-sm font-medium">{day}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label className="text-base">Daily practice duration</Label>
                            <RadioGroup
                                value={duration.toString()}
                                onValueChange={(val) => setDuration(parseInt(val))}
                                className="grid grid-cols-2 md:grid-cols-4 gap-3"
                            >
                                {[15, 30, 45, 60].map((mins) => (
                                    <div key={mins}>
                                        <RadioGroupItem value={mins.toString()} id={`d-${mins}`} className="peer sr-only" />
                                        <Label
                                            htmlFor={`d-${mins}`}
                                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                                        >
                                            <Clock className="mb-2 h-6 w-6 text-muted-foreground peer-data-[state=checked]:text-primary" />
                                            <span className="font-semibold">{mins} min</span>
                                        </Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        </div>
                    </>
                )}

                {step === 2 && (
                    <>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label className="text-base">Target Band Score</Label>
                                <span className="text-2xl font-bold text-primary">{targetBand}</span>
                            </div>
                            <Slider
                                value={[targetBand]}
                                onValueChange={(vals) => setTargetBand(vals[0])}
                                min={5.0}
                                max={9.0}
                                step={0.5}
                                className="py-4"
                            />
                            <div className="flex justify-between text-xs text-muted-foreground">
                                <span>5.0</span>
                                <span>6.0</span>
                                <span>7.0</span>
                                <span>8.0</span>
                                <span>9.0</span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label className="text-base">Weak Areas (Focus)</Label>
                            <div className="grid grid-cols-2 gap-3">
                                {WEAKNESSES.map((weakness) => (
                                    <div
                                        key={weakness}
                                        onClick={() => toggleWeakness(weakness)}
                                        className={`
                      cursor-pointer rounded-lg border p-3 flex items-center gap-2 transition-all
                      ${weaknesses.includes(weakness)
                                                ? "border-destructive/50 bg-destructive/5 ring-1 ring-destructive/50"
                                                : "border-input hover:bg-accent"}
                    `}
                                    >
                                        <Checkbox
                                            checked={weaknesses.includes(weakness)}
                                            className="pointer-events-none data-[state=checked]:bg-destructive data-[state=checked]:border-destructive"
                                        />
                                        <span className="text-sm font-medium">{weakness}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </CardContent>

            <CardFooter className="flex justify-between">
                {step > 1 ? (
                    <Button variant="ghost" onClick={() => setStep(step - 1)}>Back</Button>
                ) : (
                    <div />
                )}

                {step < 2 ? (
                    <Button onClick={handleNext} disabled={days.length === 0} className="gap-2">
                        Next Step <ArrowRight className="h-4 w-4" />
                    </Button>
                ) : (
                    <Button onClick={handleFinish} className="gap-2">
                        Generate Plan <Sparkles className="h-4 w-4" />
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
};
