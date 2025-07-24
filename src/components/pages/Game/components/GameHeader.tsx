import { Button } from "@/components/ui/Button";
import { getTotalPuzzleCount } from "../../../../data/puzzleLoader";

interface GameHeaderProps {
  completedPuzzlesCount: number;
  onLoadRandomPuzzle: () => void;
  onOpenSpinWheel: () => void;
  hasCurrentPuzzle: boolean;
}

export function GameHeader({
  completedPuzzlesCount,
  onLoadRandomPuzzle,
  onOpenSpinWheel,
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

      {/* Test Spin Wheel Button */}
      <Button onClick={onOpenSpinWheel} variant="outline" size="sm">
        🎰 Test Spin Wheel
      </Button>
    </div>
  );
}
