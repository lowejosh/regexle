import { useEffect } from "react";
import { EncouragementToast } from "./components/EncouragementToast/EncouragementToast";
import { PuzzleCard } from "./components/PuzzleCard/PuzzleCard";
import { RubberDuck } from "./components/RubberDuck/RubberDuck";
import { SpinWheel } from "./components/SpinWheel/SpinWheel";
import { useGameStore } from "../../../store/gameStore";
import { useSpinWheelStore } from "../../../store/spinWheelStore";
import type { GameMode } from "../../../services/puzzleService";
import type { Puzzle } from "../../../types/game";

interface GameProps {
  mode: GameMode;
  difficulty?: Puzzle["difficulty"];
  autoLoad?: boolean;
}

export function Game({ mode, difficulty, autoLoad = true }: GameProps) {
  const { loadPuzzleByMode } = useGameStore();
  const { setCurrentMode } = useSpinWheelStore();

  useEffect(() => {
    setCurrentMode(mode === "daily" ? "daily" : "random");

    if (autoLoad) {
      loadPuzzleByMode(mode, difficulty);
    }
  }, [mode, difficulty, loadPuzzleByMode, autoLoad, setCurrentMode]);

  return (
    <div className="space-y-6">
      <PuzzleCard />
      <EncouragementToast />
      <SpinWheel />
      <RubberDuck />
    </div>
  );
}
