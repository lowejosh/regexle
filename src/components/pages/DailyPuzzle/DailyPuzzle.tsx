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
    // Force refresh the daily puzzle to ensure we get the new one
    await forceRefreshDailyPuzzle();
    setPuzzleKey((prev) => prev + 1);
    lastDateRef.current = getCurrentDateString();
  }, [forceRefreshDailyPuzzle]);

  // Initialize last date on mount
  useEffect(() => {
    lastDateRef.current = getCurrentDateString();
  }, []);

  // Check for day change every 30 seconds as a backup
  useEffect(() => {
    const checkForNewDay = async () => {
      const currentDate = getCurrentDateString();
      if (lastDateRef.current && lastDateRef.current !== currentDate) {
        await handleNewDay();
      }
    };

    const interval = setInterval(checkForNewDay, 30000); // Check every 30 seconds
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
