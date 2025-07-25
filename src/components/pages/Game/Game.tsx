import { EncouragementToast } from "./components/EncouragementToast/EncouragementToast";
import { GameHeader } from "./components/GameHeader/GameHeader";
import { PuzzleCard } from "./components/PuzzleCard/PuzzleCard";
import { RubberDuck } from "./components/RubberDuck/RubberDuck";
import { SpinWheel } from "./components/SpinWheel/SpinWheel";

export function Game() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <GameHeader />
      <PuzzleCard />
      <EncouragementToast />
      <SpinWheel />
      <RubberDuck />
    </div>
  );
}
