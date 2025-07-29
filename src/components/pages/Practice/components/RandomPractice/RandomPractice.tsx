import { useState } from "react";
import { Game } from "@/components/pages/Game";
import { RandomPracticeDifficultySelector } from "./components";
import type { Puzzle } from "@/types/game";

export function RandomPractice() {
  const [difficulty, setDifficulty] = useState<
    Puzzle["difficulty"] | undefined
  >(undefined);
  const [puzzleKey, setPuzzleKey] = useState(0);

  const handleLoadNew = () => {
    setPuzzleKey((prev) => prev + 1);
  };

  const handleDifficultyChange = (
    newDifficulty: Puzzle["difficulty"] | undefined
  ) => {
    setDifficulty(newDifficulty);
    setPuzzleKey((prev) => prev + 1);
  };

  return (
    <div className="space-y-6">
      <RandomPracticeDifficultySelector
        selectedDifficulty={difficulty}
        onDifficultyChange={handleDifficultyChange}
        onLoadPuzzle={handleLoadNew}
      />

      <Game key={puzzleKey} mode="random" difficulty={difficulty} />
    </div>
  );
}
