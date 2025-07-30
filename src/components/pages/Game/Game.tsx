import { useEffect } from "react";
import { EncouragementToast } from "./components/EncouragementToast/EncouragementToast";
import { PuzzleCard } from "./components/PuzzleCard/PuzzleCard";
import { RubberDuck } from "./components/RubberDuck/RubberDuck";
import { TarotReading } from "./components/TarotReading/TarotReading";
import { SpinWheel } from "./components/SpinWheel/SpinWheel";
import { RegexExplosion } from "./components/RegexExplosion";
import { useGameStore } from "../../../store/gameStore";
import { useSpinWheelStore } from "../../../store/spinWheelStore";
import type { GameMode } from "../../../store/gameStore";
import type { Puzzle } from "../../../types/game";

interface GameProps {
  mode: GameMode;
  difficulty?: Puzzle["difficulty"];
  autoLoad?: boolean;
}

export function Game({ mode, difficulty, autoLoad = true }: GameProps) {
  const { loadDailyPuzzle } = useGameStore();
  const { setCurrentMode } = useSpinWheelStore();

  useEffect(() => {
    setCurrentMode(mode === "daily" ? "daily" : "practice");

    if (autoLoad) {
      if (mode === "daily") {
        loadDailyPuzzle();
      }
    }
  }, [mode, difficulty, loadDailyPuzzle, autoLoad, setCurrentMode]);

  return (
    <div className="space-y-6">
      <PuzzleCard />
      <EncouragementToast />
      <SpinWheel />
      <RubberDuck />
      <TarotReading />
      <RegexExplosion />
    </div>
  );
}
