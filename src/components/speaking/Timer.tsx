import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface TimerProps {
  duration: number; // in seconds
  isRunning: boolean;
  onComplete?: () => void;
  variant?: "countdown" | "stopwatch";
  className?: string;
}

export function Timer({
  duration,
  isRunning,
  onComplete,
  variant = "countdown",
  className,
}: TimerProps) {
  const [time, setTime] = useState(variant === "countdown" ? duration : 0);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTime((prev) => {
        if (variant === "countdown") {
          if (prev <= 1) {
            onComplete?.();
            return 0;
          }
          return prev - 1;
        } else {
          if (prev >= duration) {
            onComplete?.();
            return duration;
          }
          return prev + 1;
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, duration, onComplete, variant]);

  useEffect(() => {
    if (!isRunning) {
      setTime(variant === "countdown" ? duration : 0);
    }
  }, [duration, variant, isRunning]);

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  const progress = variant === "countdown" 
    ? (time / duration) * 100 
    : (time / duration) * 100;

  const isLow = variant === "countdown" && time <= 10;

  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      <div
        className={cn(
          "font-heading text-4xl font-bold tabular-nums transition-colors",
          isLow ? "text-destructive" : "text-foreground"
        )}
      >
        {minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}
      </div>
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-1000",
            isLow ? "bg-destructive" : "gradient-primary"
          )}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
