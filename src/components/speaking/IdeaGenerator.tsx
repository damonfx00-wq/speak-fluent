import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Lightbulb, Sparkles, BookOpen, List, Loader2, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface IdeaGeneratorProps {
    topic: string;
}

export const IdeaGenerator = ({ topic }: IdeaGeneratorProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [generatedContent, setGeneratedContent] = useState<{
        ideas: string[];
        points: string[];
        vocabulary: { word: string; meaning: string }[];
    } | null>(null);

    const handleGenerate = () => {
        setIsLoading(true);

        // Simulate API call with context-aware mock data
        setTimeout(() => {
            const lowerTopic = topic.toLowerCase();
            let content;

            if (lowerTopic.includes("tourism") || lowerTopic.includes("travel") || lowerTopic.includes("visit") || lowerTopic.includes("place")) {
                content = {
                    ideas: [
                        "A quiet coffee shop in the city center",
                        "A secluded beach near my hometown",
                        "The public library on weekends"
                    ],
                    points: [
                        "Peaceful atmosphere helps me concentrate",
                        "The smell of fresh coffee is relaxing",
                        "I can watch people passing by",
                        "It's a great escape from daily stress",
                        "The architecture is inspiring"
                    ],
                    vocabulary: [
                        { word: "Tranquil", meaning: "Free from disturbance; calm" },
                        { word: "Ambiance", meaning: "The character and atmosphere of a place" },
                        { word: "Bustling", meaning: "Moving in an energetic and busy manner" },
                        { word: "Sanctuary", meaning: "A place of refuge or safety" }
                    ]
                };
            } else if (lowerTopic.includes("work") || lowerTopic.includes("job") || lowerTopic.includes("study") || lowerTopic.includes("education")) {
                content = {
                    ideas: [
                        "Focusing on continuous learning",
                        "Maintaining work-life balance",
                        "Collaborating with diverse teams"
                    ],
                    points: [
                        "Helps in career progression",
                        "Reduces burnout and stress",
                        "Improves problem-solving skills",
                        "Networking opportunities",
                        "Gaining practical experience"
                    ],
                    vocabulary: [
                        { word: "Productivity", meaning: "The state or quality of producing something" },
                        { word: "Collaboration", meaning: "The action of working with someone to produce something" },
                        { word: "Deadline", meaning: "The latest time or date by which something should be completed" },
                        { word: "Curriculum", meaning: "The subjects comprising a course of study" }
                    ]
                };
            } else {
                // Generic / Opinion
                content = {
                    ideas: [
                        "It depends on the individual's perspective",
                        "There are both pros and cons",
                        "Social media has a significant impact"
                    ],
                    points: [
                        "Allows for global connectivity",
                        "Can lead to information overload",
                        "Changes how we interact socially",
                        "Provides instant access to news",
                        "Creates new business opportunities"
                    ],
                    vocabulary: [
                        { word: "Perspective", meaning: "A particular attitude toward or way of regarding something" },
                        { word: "Significant", meaning: "Sufficiently great or important to be worthy of attention" },
                        { word: "Influence", meaning: "The capacity to have an effect on the character or behavior of someone" },
                        { word: "Global", meaning: "Relating to the whole world; worldwide" }
                    ]
                };
            }

            setGeneratedContent(content);
            setIsLoading(false);
            setIsOpen(true);
        }, 1500);
    };

    if (!isOpen && !isLoading) {
        return (
            <Button
                variant="outline"
                className="w-full gap-2 border-dashed border-2 hover:border-primary hover:bg-primary/5 h-auto py-4"
                onClick={handleGenerate}
            >
                <Sparkles className="h-5 w-5 text-primary" />
                <div className="flex flex-col items-start">
                    <span className="font-semibold">Stuck? Generate Ideas</span>
                    <span className="text-xs text-muted-foreground font-normal">Get main points, supporting details & vocabulary</span>
                </div>
            </Button>
        );
    }

    if (isLoading) {
        return (
            <Card className="w-full border-dashed border-2">
                <CardContent className="py-8 flex flex-col items-center justify-center gap-3">
                    <Loader2 className="h-8 w-8 text-primary animate-spin" />
                    <p className="text-sm text-muted-foreground animate-pulse">Brainstorming ideas for you...</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full border-primary/20 shadow-lg animate-in fade-in zoom-in-95 duration-300">
            <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
                <div className="flex items-center gap-2">
                    <div className="p-2 rounded-full bg-primary/10">
                        <Lightbulb className="h-4 w-4 text-primary" />
                    </div>
                    <CardTitle className="text-lg">Idea Assistant</CardTitle>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsOpen(false)}>
                    <X className="h-4 w-4" />
                </Button>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="ideas" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 mb-4">
                        <TabsTrigger value="ideas" className="gap-2">
                            <Lightbulb className="h-3 w-3" />
                            Main Ideas
                        </TabsTrigger>
                        <TabsTrigger value="points" className="gap-2">
                            <List className="h-3 w-3" />
                            Points
                        </TabsTrigger>
                        <TabsTrigger value="vocab" className="gap-2">
                            <BookOpen className="h-3 w-3" />
                            Vocabulary
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="ideas" className="mt-0">
                        <div className="space-y-3">
                            {generatedContent?.ideas.map((idea, index) => (
                                <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30 border border-secondary hover:bg-secondary/50 transition-colors">
                                    <Badge variant="outline" className="mt-0.5 h-6 w-6 flex items-center justify-center rounded-full p-0 shrink-0">
                                        {index + 1}
                                    </Badge>
                                    <p className="text-sm font-medium">{idea}</p>
                                </div>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="points" className="mt-0">
                        <ScrollArea className="h-[200px] pr-4">
                            <div className="space-y-2">
                                {generatedContent?.points.map((point, index) => (
                                    <div key={index} className="flex items-start gap-2 text-sm">
                                        <span className="text-primary mt-1.5">•</span>
                                        <span className="text-muted-foreground">{point}</span>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </TabsContent>

                    <TabsContent value="vocab" className="mt-0">
                        <ScrollArea className="h-[200px] pr-4">
                            <div className="grid gap-3">
                                {generatedContent?.vocabulary.map((item, index) => (
                                    <div key={index} className="p-3 rounded-lg bg-secondary/20 border border-secondary/50">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="font-semibold text-sm text-primary">{item.word}</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground">{item.meaning}</p>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
};
