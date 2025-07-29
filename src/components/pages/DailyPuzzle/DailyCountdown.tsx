import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

interface DailyCountdownProps {
  onNewDay?: () => void | Promise<void>;
}

export function DailyCountdown({ onNewDay }: DailyCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
  }>({ hours: 0, minutes: 0, seconds: 0 });

  const calculateTimeLeft = useCallback(() => {
    const now = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0); // Set to midnight

    const difference = tomorrow.getTime() - now.getTime();

    if (difference > 0) {
      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor(
        (difference % (1000 * 60 * 60)) / (1000 * 60)
      );
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds });
      return false; // Not midnight yet
    } else {
      setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      return true; // It's midnight (or past)
    }
  }, []);

  useEffect(() => {
    let hasTriggeredNewDay = false;

    const timer = setInterval(async () => {
      const isMidnight = calculateTimeLeft();
      
      // Trigger onNewDay only once when we hit midnight
      if (isMidnight && !hasTriggeredNewDay && onNewDay) {
        hasTriggeredNewDay = true;
        await onNewDay();
      }
      
      // Reset the flag after a few seconds to allow for next day detection
      if (!isMidnight && hasTriggeredNewDay) {
        hasTriggeredNewDay = false;
      }
    }, 1000);

    // Calculate initial time
    calculateTimeLeft();

    return () => clearInterval(timer);
  }, [onNewDay, calculateTimeLeft]);

  const formatTime = (value: number) => value.toString().padStart(2, "0");

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Next puzzle in:
        </CardTitle>
      </CardHeader>
      <CardContent className="!pt-0">
        <div className="flex justify-center items-center space-x-2 text-2xl font-mono font-bold text-primary">
          <div className="bg-background rounded px-2 py-1 shadow-sm min-w-[3rem] border border-border">
            {formatTime(timeLeft.hours)}
          </div>
          <span className="text-primary/60">:</span>
          <div className="bg-background rounded px-2 py-1 shadow-sm min-w-[3rem] border border-border">
            {formatTime(timeLeft.minutes)}
          </div>
          <span className="text-primary/60">:</span>
          <div className="bg-background rounded px-2 py-1 shadow-sm min-w-[3rem] border border-border">
            {formatTime(timeLeft.seconds)}
          </div>
        </div>
        <div className="flex justify-center space-x-4 text-xs text-muted-foreground mt-2">
          <span>hours</span>
          <span>minutes</span>
          <span>seconds</span>
        </div>
      </CardContent>
    </Card>
  );
}
