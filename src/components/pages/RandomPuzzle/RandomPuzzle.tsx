import { useState } from "react";
import { Game } from "@/components/pages/Game";
import { DifficultySelector } from "./components/DifficultySelector";
import type { Puzzle } from "@/types/game";

export function RandomPuzzle() {
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
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6 sm:space-y-8">
      {/* Difficulty Selection */}
      <DifficultySelector
        selectedDifficulty={difficulty}
        onDifficultyChange={handleDifficultyChange}
        onLoadPuzzle={handleLoadNew}
      />

      <Game key={puzzleKey} mode="random" difficulty={difficulty} />
    </div>
  );
}
