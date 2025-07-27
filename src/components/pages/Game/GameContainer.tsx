import { useEffect } from "react";
import { EncouragementToast } from "./components/EncouragementToast/EncouragementToast";
import { PuzzleCard } from "./components/PuzzleCard/PuzzleCard";
import { RubberDuck } from "./components/RubberDuck/RubberDuck";
import { SpinWheel } from "./components/SpinWheel/SpinWheel";
import { useGameStore } from "../../../store/gameStore";
import type { GameMode } from "../../../services/puzzleService";
import type { Puzzle } from "../../../types/game";

interface GameProps {
  mode: GameMode;
  difficulty?: Puzzle["difficulty"];
  autoLoad?: boolean;
}

export function Game({ mode, difficulty, autoLoad = true }: GameProps) {
  const { loadPuzzleByMode } = useGameStore();

  useEffect(() => {
    if (autoLoad) {
      loadPuzzleByMode(mode, difficulty);
    }
  }, [mode, difficulty, loadPuzzleByMode, autoLoad]);

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
      <PuzzleCard />
      <EncouragementToast />
      <SpinWheel />
      <RubberDuck />
    </div>
  );
}
