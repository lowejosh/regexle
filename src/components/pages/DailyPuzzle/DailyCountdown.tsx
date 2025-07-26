import { useState, useEffect } from "react";

export function DailyCountdown() {
  const [timeLeft, setTimeLeft] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
  }>({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
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
      } else {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      }
    };

    // Calculate immediately
    calculateTimeLeft();

    // Update every second
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (value: number) => value.toString().padStart(2, "0");

  return (
    <div className="bg-accent/20 border border-border rounded-lg p-4 text-center">
      <h3 className="text-sm font-medium text-muted-foreground mb-2">
        Next puzzle in:
      </h3>
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
    </div>
  );
}
