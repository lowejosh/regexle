import { useSpinWheelStore } from "../../../../../store/spinWheelStore";
import { getTotalPuzzleCount } from "../../../../../data/puzzleLoader";
import { useGameStore } from "../../../../../store/gameStore";
import { Button } from "@/components/ui/Button";

export function GameHeader() {
  const { completedPuzzles, currentPuzzle, loadRandomPuzzle } = useGameStore();
  const { resetForNewPuzzle } = useSpinWheelStore();

  const handleLoadRandomPuzzle = async () => {
    await loadRandomPuzzle();
    resetForNewPuzzle();
  };

  return (
    <div className="text-center space-y-4">
      <p className="text-muted-foreground">
        {getTotalPuzzleCount()} | Completed: {completedPuzzles.size}
      </p>

      <Button onClick={handleLoadRandomPuzzle} size="lg">
        {currentPuzzle ? "Load New Puzzle" : "Start Playing"}
      </Button>
    </div>
  );
}
