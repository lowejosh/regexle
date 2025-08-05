import { useState, useEffect, useRef, useCallback } from "react";
import { Game } from "@/components/pages/Game";
import { DailyCountdown } from "./DailyCountdown";
import { PageLayout } from "@/components/ui";
import { useGameStore } from "@/store/gameStore";

export function DailyPuzzle() {
  const [puzzleKey, setPuzzleKey] = useState(0);
  const lastDateRef = useRef<string>("");
  const { forceRefreshDailyPuzzle } = useGameStore();

  const getCurrentDateString = (): string => {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, "0");
    const day = today.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleNewDay = useCallback(async () => {
    await forceRefreshDailyPuzzle();
    setPuzzleKey((prev) => prev + 1);
    lastDateRef.current = getCurrentDateString();
  }, [forceRefreshDailyPuzzle]);

  useEffect(() => {
    lastDateRef.current = getCurrentDateString();
  }, []);

  useEffect(() => {
    const checkForNewDay = async () => {
      const currentDate = getCurrentDateString();
      if (lastDateRef.current && lastDateRef.current !== currentDate) {
        await handleNewDay();
      }
    };

    const interval = setInterval(checkForNewDay, 30000);
    return () => clearInterval(interval);
  }, [handleNewDay]);

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
