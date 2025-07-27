import { useState } from "react";
import { Game } from "@/components/pages/Game";
import { DailyCountdown } from "./DailyCountdown";

export function DailyPuzzle() {
  const [gameKey, setGameKey] = useState(0);

  const handleNewDay = () => {
    // Force Game component to remount and load new daily puzzle
    setGameKey((prev) => prev + 1);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Daily Puzzle
        </h1>
        <p className="text-muted-foreground">
          Challenge yourself with today's regex puzzle!
        </p>
      </div>

      <DailyCountdown onNewDay={handleNewDay} />

      <Game key={gameKey} mode="daily" />
    </div>
  );
}
