import type { GameResult } from "../../../../../types/game";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

interface GameResultsProps {
  gameResult: GameResult;
  onComplete: () => void;
}

export function GameResults({ gameResult, onComplete }: GameResultsProps) {
  return (
    <div className="p-4 rounded border">
      <div className="flex items-center justify-between mb-2">
        <span className="font-medium">
          Score: {gameResult.passedTests}/{gameResult.totalTests}
        </span>
        {gameResult.isCorrect ? (
          <Badge variant="correct">🎉 Perfect! All tests passed!</Badge>
        ) : (
          <Badge variant="incorrect">
            {gameResult.failedCases.length} test
            {gameResult.failedCases.length !== 1 ? "s" : ""} failed
          </Badge>
        )}
      </div>

      {gameResult.isCorrect && (
        <Button onClick={onComplete} className="w-full">
          Complete & Next Puzzle
        </Button>
      )}
    </div>
  );
}
