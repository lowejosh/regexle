import { useState } from "react";
import { Game } from "@/components/pages/Game";
import { DailyCountdown } from "./DailyCountdown";
import { PageLayout } from "@/components/ui";

export function DailyPuzzle() {
  const [puzzleKey, setPuzzleKey] = useState(0);

  const handleNewDay = () => {
    setPuzzleKey((prev) => prev + 1);
  };

  return (
    <PageLayout
      title="Daily Puzzle"
      description="Challenge yourself with today's regex puzzle!"
    >
      <DailyCountdown onNewDay={handleNewDay} />
      <Game key={puzzleKey} mode="daily" />
    </PageLayout>
  );
}
