import type { GameResult } from "../../../../../types/game";
import { Badge } from "@/components/ui/Badge";

interface GameResultsProps {
  gameResult: GameResult;
  attempts: number;
}

export function GameResults({ gameResult, attempts }: GameResultsProps) {
  return (
    <div className="p-4 rounded border">
      <div className="flex items-center justify-between mb-2">
        <span className="font-medium">
          Score: {gameResult.passedTests}/{gameResult.totalTests}
        </span>
        {gameResult.isCorrect ? (
          <Badge variant="correct">Perfect! All tests passed!</Badge>
        ) : (
          <Badge variant="incorrect">
            {gameResult.failedCases.length} test
            {gameResult.failedCases.length !== 1 ? "s" : ""} failed
          </Badge>
        )}
      </div>

      {gameResult.isCorrect && (
        <div className="text-center text-muted-foreground">
          Solved in {attempts} attempt{attempts !== 1 ? "s" : ""}!
        </div>
      )}
    </div>
  );
}
