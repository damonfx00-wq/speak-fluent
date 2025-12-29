import { Button } from "@/components/ui/button";
import { Mic, Square } from "lucide-react";
import { cn } from "@/lib/utils";

interface RecordButtonProps {
  isRecording: boolean;
  onToggle: () => void;
  size?: "default" | "large";
  className?: string;
}

export function RecordButton({
  isRecording,
  onToggle,
  size = "default",
  className,
}: RecordButtonProps) {
  return (
    <Button
      variant={isRecording ? "recording" : "default"}
      size={size === "large" ? "icon-lg" : "icon"}
      onClick={onToggle}
      className={cn(
        "relative",
        size === "large" && "h-20 w-20 rounded-full",
        className
      )}
    >
      {isRecording ? (
        <Square className={cn("fill-current", size === "large" ? "h-7 w-7" : "h-4 w-4")} />
      ) : (
        <Mic className={size === "large" ? "h-8 w-8" : "h-4 w-4"} />
      )}
      {isRecording && (
        <span className="absolute -inset-1 rounded-full border-2 border-destructive/50 animate-ping" />
      )}
    </Button>
  );
}
