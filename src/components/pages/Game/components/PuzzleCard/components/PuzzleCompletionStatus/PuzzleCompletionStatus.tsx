import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui";
import type { GameResult } from "@/types/game";

interface PuzzleCompletionStatusProps {
  isDailyCompleted: boolean;
  gameResult: GameResult | null;
  attempts: number;
  solutionRevealed: boolean;
}

export function PuzzleCompletionStatus({
  isDailyCompleted,
  gameResult,
  attempts,
  solutionRevealed,
}: PuzzleCompletionStatusProps) {
  // Only show for completed daily puzzles
  if (!isDailyCompleted) {
    return null;
  }

  return (
    <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full">
              <span className="text-green-600 dark:text-green-400 text-lg">
                ✓
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-green-800 dark:text-green-200">
                Today's Puzzle Completed!
              </h3>
              {gameResult && (
                <p className="text-sm text-green-600 dark:text-green-400">
                  Solved in {attempts} attempt{attempts !== 1 ? "s" : ""}
                  {solutionRevealed && " (with solution revealed)"}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {gameResult && (
              <Badge
                variant="secondary"
                className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-600"
              >
                {gameResult.passedTests}/{gameResult.totalTests} tests
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
