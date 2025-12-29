import { format, isSameDay, startOfWeek, addDays, isToday } from "date-fns";
import { StudyPlan, StudySession } from "@/lib/study-planner";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeft, ChevronRight, Clock, CheckCircle2, Circle } from "lucide-react";
import { useState } from "react";

interface CalendarViewProps {
    plan: StudyPlan;
}

export const CalendarView = ({ plan }: CalendarViewProps) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const startOfCurrentWeek = startOfWeek(currentDate, { weekStartsOn: 1 });
    const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(startOfCurrentWeek, i));

    const nextWeek = () => setCurrentDate(addDays(currentDate, 7));
    const prevWeek = () => setCurrentDate(addDays(currentDate, -7));

    const getSessionForDay = (date: Date) => {
        return plan.sessions.find(s => isSameDay(s.date, date));
    };

    const getStatusColor = (status: StudySession["status"]) => {
        switch (status) {
            case "completed": return "bg-success text-success-foreground hover:bg-success/90";
            case "missed": return "bg-destructive text-destructive-foreground hover:bg-destructive/90";
            default: return "bg-primary text-primary-foreground hover:bg-primary/90";
        }
    };

    const getTypeLabel = (type: StudySession["type"]) => {
        switch (type) {
            case "part1": return "Part 1";
            case "part2": return "Part 2";
            case "part3": return "Part 3";
            case "vocab": return "Vocab";
            case "mock": return "Mock Test";
            case "review": return "Review";
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-heading font-bold">
                    {format(startOfCurrentWeek, "MMMM yyyy")}
                </h2>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={prevWeek}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm font-medium w-32 text-center">
                        {format(startOfCurrentWeek, "MMM d")} - {format(addDays(startOfCurrentWeek, 6), "MMM d")}
                    </span>
                    <Button variant="outline" size="icon" onClick={nextWeek}>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                {weekDays.map((day) => {
                    const session = getSessionForDay(day);
                    const isDayToday = isToday(day);

                    return (
                        <div key={day.toISOString()} className={`flex flex-col gap-2 ${isDayToday ? "md:-mt-4" : ""}`}>
                            <div className={`text-center p-2 rounded-t-lg ${isDayToday ? "bg-primary text-primary-foreground" : "bg-secondary/50"}`}>
                                <p className="text-xs font-medium uppercase opacity-80">{format(day, "EEE")}</p>
                                <p className="text-lg font-bold">{format(day, "d")}</p>
                            </div>

                            <div className={`flex-1 min-h-[120px] rounded-b-lg border p-2 ${isDayToday ? "border-primary ring-1 ring-primary" : "border-border bg-card"}`}>
                                {session ? (
                                    <Card className={`h-full border-0 shadow-none ${session.status === 'completed' ? 'opacity-60' : ''}`}>
                                        <CardContent className="p-2 space-y-2">
                                            <Badge variant="outline" className={`w-full justify-center ${session.type === 'mock' ? 'border-purple-500 text-purple-600 bg-purple-50' :
                                                    session.type === 'vocab' ? 'border-green-500 text-green-600 bg-green-50' : ''
                                                }`}>
                                                {getTypeLabel(session.type)}
                                            </Badge>

                                            <p className="text-xs font-medium line-clamp-3 leading-tight">
                                                {session.topic}
                                            </p>

                                            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-auto pt-2">
                                                <Clock className="h-3 w-3" />
                                                <span>{session.duration}m</span>
                                            </div>

                                            {session.status === 'pending' && (
                                                <Button size="sm" className="w-full h-7 text-xs mt-1" variant="secondary">
                                                    Start
                                                </Button>
                                            )}
                                        </CardContent>
                                    </Card>
                                ) : (
                                    <div className="h-full flex items-center justify-center text-muted-foreground/30">
                                        <div className="h-1 w-1 rounded-full bg-current mx-0.5" />
                                        <div className="h-1 w-1 rounded-full bg-current mx-0.5" />
                                        <div className="h-1 w-1 rounded-full bg-current mx-0.5" />
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold">Upcoming Sessions</h3>
                        <Button variant="link" className="text-primary">View Full Schedule</Button>
                    </div>
                    <ScrollArea className="h-[200px]">
                        <div className="space-y-3">
                            {plan.sessions
                                .filter(s => s.date >= new Date())
                                .slice(0, 5)
                                .map(session => (
                                    <div key={session.id} className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-2 rounded-full ${session.type === 'mock' ? 'bg-purple-100 text-purple-600' : 'bg-primary/10 text-primary'
                                                }`}>
                                                {session.status === 'completed' ? <CheckCircle2 className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm">{session.topic}</p>
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                    <span>{format(session.date, "EEEE, MMM d")}</span>
                                                    <span>•</span>
                                                    <span>{getTypeLabel(session.type)}</span>
                                                    <span>•</span>
                                                    <span>{session.duration} min</span>
                                                </div>
                                            </div>
                                        </div>
                                        <Button size="sm" variant={session.status === 'completed' ? "ghost" : "default"}>
                                            {session.status === 'completed' ? "Review" : "Start"}
                                        </Button>
                                    </div>
                                ))}
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    );
};
