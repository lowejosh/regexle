import { useSpinWheelStore } from "../../../../../store/spinWheelStore";
import { getTotalPuzzleCount } from "../../../../../data/puzzleLoader";
import { useGameStore } from "../../../../../store/gameStore";
import { useStatisticsStore } from "../../../../../store/statisticsStore";
import { Button } from "@/components/ui/Button";

export function GameHeader() {
  const { currentPuzzle, loadRandomPuzzle } = useGameStore();
  const solvedPuzzleIds = useStatisticsStore((state) => state.solvedPuzzleIds);
  const { resetForNewPuzzle } = useSpinWheelStore();

  const handleLoadRandomPuzzle = async () => {
    await loadRandomPuzzle();
    resetForNewPuzzle();
  };

  return (
    <div className="text-center space-y-4">
      <p className="text-muted-foreground">
        {getTotalPuzzleCount()} | Completed: {solvedPuzzleIds.size}
      </p>

      <Button onClick={handleLoadRandomPuzzle} size="lg">
        {currentPuzzle ? "Load New Puzzle" : "Start Playing"}
      </Button>
    </div>
  );
}
