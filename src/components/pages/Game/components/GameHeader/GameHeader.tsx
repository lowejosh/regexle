import { Button } from "@/components/ui/Button";
import { getTotalPuzzleCount } from "../../../../../data/puzzleLoader";

interface GameHeaderProps {
  completedPuzzlesCount: number;
  onLoadRandomPuzzle: () => void;
  hasCurrentPuzzle: boolean;
}

export function GameHeader({
  completedPuzzlesCount,
  onLoadRandomPuzzle,
  hasCurrentPuzzle,
}: GameHeaderProps) {
  return (
    <div className="text-center space-y-4">
      <p className="text-muted-foreground">
        {getTotalPuzzleCount()} | Completed: {completedPuzzlesCount}
      </p>

      <Button onClick={onLoadRandomPuzzle} size="lg">
        {hasCurrentPuzzle ? "Load New Puzzle" : "Start Playing"}
      </Button>
    </div>
  );
}
