import type { GameResult } from "../../../../../types/game";
import { Badge } from "@/components/ui/Badge";

interface GameResultsProps {
  gameResult: GameResult;
  attempts: number;
  solutionRevealed: boolean;
}

export function GameResults({
  gameResult,
  attempts,
  solutionRevealed,
}: GameResultsProps) {
  const isSuccess = gameResult.isCorrect;
  const percentage = Math.round(
    (gameResult.passedTests / gameResult.totalTests) * 100
  );

  return (
    <div className="bg-background border border-black/10 dark:border-white/10 rounded-lg p-4 space-y-3">
      {/* Header with score and percentage */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={`
            w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
            ${
              isSuccess
                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
            }
          `}
          >
            {isSuccess ? "✓" : "✗"}
          </div>
          <span className="font-medium text-sm">
            {gameResult.passedTests}/{gameResult.totalTests} Tests
          </span>
          <span className="text-xs text-muted-foreground">({percentage}%)</span>
        </div>

        <Badge
          variant={isSuccess ? "correct" : "incorrect"}
          className="text-xs px-2 py-1"
        >
          {isSuccess ? "Passed" : "Failed"}
        </Badge>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-muted rounded-full h-2">
        <div
          className={`
            h-2 rounded-full transition-all duration-500 ease-out
            ${
              isSuccess
                ? "bg-green-500 dark:bg-green-800"
                : "bg-red-500 dark:bg-red-800"
            }
          `}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Success message - only show if successful */}
      {isSuccess && (
        <div className="text-center text-xs text-muted-foreground">
          {solutionRevealed ? (
            <span className="text-orange-600 dark:text-orange-400">
              🙈 Solution was revealed
            </span>
          ) : (
            <span className="text-green-600 dark:text-green-400">
              🎉 Solved in {attempts} attempt{attempts !== 1 ? "s" : ""}!
            </span>
          )}
        </div>
      )}
    </div>
  );
}
