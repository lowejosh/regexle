import { useState } from "react";
import { Game } from "@/components/pages/Game";
import { DailyCountdown } from "./DailyCountdown";

export function DailyPuzzle() {
  const [puzzleKey, setPuzzleKey] = useState(0);

  const handleNewDay = () => {
    setPuzzleKey((prev) => prev + 1);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div className="text-center mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
          Daily Puzzle
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Challenge yourself with today's regex puzzle!
        </p>
      </div>

      <DailyCountdown onNewDay={handleNewDay} />

      <Game key={puzzleKey} mode="daily" />
    </div>
  );
}
