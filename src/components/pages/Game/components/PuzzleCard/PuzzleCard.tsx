import { useSpinWheelStore } from "../../../../../store/spinWheelStore";
import { useGameStore } from "../../../../../store/gameStore";
import { useStatisticsStore } from "../../../../../store/statisticsStore";
import type { Puzzle } from "../../../../../types/game";
import { SpinWheelButton } from "../SpinWheelButton";
import { TestCases } from "../TestCases/TestCases";
import { Badge } from "@/components/ui/Badge";
import { GameResults } from "../GameResults";
import { RegexInput } from "../RegexInput";
import { toTitleCase } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { useState, useEffect } from "react";
import { PuzzleCardSolutionReveal, PuzzleCompletionStatus } from "./components";
import {
  CardDescription,
  CardContent,
  CardHeader,
  CardTitle,
  Card,
} from "@/components/ui";

interface PuzzleCardProps {
  puzzle?: Puzzle;
}

export function PuzzleCard({ puzzle: propPuzzle }: PuzzleCardProps) {
  const {
    currentPuzzle,
    userPattern,
    gameResult,
    showDescription,
    revealedTestCases,
    attempts,
    solutionRevealed,
    currentMode,
    updatePattern,
    testPatternWithEffects,
    setSolutionRevealed,
    isDailyPuzzleCompleted,
    getDailyPuzzleCompletion,
  } = useGameStore();

  const { partialDescription, getAvailableSpins, openSpinWheel } =
    useSpinWheelStore();

  const { isPuzzleSolved: isPreviouslySolved } = useStatisticsStore();

  const [showSolution, setShowSolution] = useState(false);
  const availableSpins = getAvailableSpins();

  const puzzle = propPuzzle || currentPuzzle;

  const isDailyCompleted = currentMode === "daily" && isDailyPuzzleCompleted();
  const dailyCompletionData =
    currentMode === "daily" ? getDailyPuzzleCompletion() : null;

  // prefill solution for completed daily puzzles
  useEffect(() => {
    if (
      isDailyCompleted &&
      dailyCompletionData?.completionUserPattern &&
      !userPattern
    ) {
      updatePattern(dailyCompletionData.completionUserPattern);
    }
  }, [isDailyCompleted, dailyCompletionData, userPattern, updatePattern]);

  if (!puzzle) return null;

  const shouldMatchCases = puzzle.testCases.filter((tc) => tc.shouldMatch);
  const shouldNotMatchCases = puzzle.testCases.filter((tc) => !tc.shouldMatch);
  const isPuzzleSolved = gameResult?.isCorrect;
  const wasPreviouslySolved = isPreviouslySolved(puzzle.id);

  // For daily puzzles, disable input if completed today
  // For other puzzles, only disable if solved in current session (allow replay of previously solved)
  const shouldDisableInput =
    isPuzzleSolved || (isDailyCompleted && currentMode === "daily");

  // For completed daily puzzles or currently solved puzzles, show all test cases
  // For previously solved non-daily puzzles, use normal reveal logic (allow replay)
  const isFullyCompleted =
    isPuzzleSolved || (isDailyCompleted && currentMode === "daily");
  const testCasesToReveal = isFullyCompleted
    ? Math.max(shouldMatchCases.length, shouldNotMatchCases.length)
    : revealedTestCases;

  const allTestCasesRevealed =
    testCasesToReveal >=
    Math.max(shouldMatchCases.length, shouldNotMatchCases.length);

  const handlePatternChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updatePattern(e.target.value);
  };

  const handleTestPattern = () => {
    testPatternWithEffects();
  };

  const handleGiveUp = () => {
    setShowSolution(true);
    setSolutionRevealed(true);
  };

  return (
    <Card>
      <CardHeader className="!pb-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
          <CardTitle className="text-xl sm:text-2xl">{puzzle.title}</CardTitle>
          <div className="flex items-center gap-2 sm:gap-4 self-start sm:self-auto">
            <Badge variant={puzzle.difficulty}>
              {toTitleCase(puzzle.difficulty)}
            </Badge>
            {wasPreviouslySolved && currentMode !== "daily" && (
              <Badge variant="completed" className="text-xs">
                Previously Completed
              </Badge>
            )}
            <SpinWheelButton
              availableSpins={availableSpins}
              gameResult={gameResult}
              onOpenSpinWheel={openSpinWheel}
            />
          </div>
        </div>
        {puzzle.description && (
          <CardDescription className="text-sm">
            {showDescription && puzzle.description}
            {!showDescription && partialDescription}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="space-y-4 sm:space-y-6">
        {currentMode === "daily" && (
          <PuzzleCompletionStatus isDailyCompleted={isDailyCompleted} />
        )}

        <RegexInput
          userPattern={userPattern}
          onPatternChange={handlePatternChange}
          onTestPattern={handleTestPattern}
          disabled={shouldDisableInput}
        />
        <TestCases
          testCases={puzzle.testCases}
          gameResult={gameResult}
          revealedCount={testCasesToReveal}
        />
        {gameResult && (
          <GameResults
            gameResult={gameResult}
            attempts={attempts}
            solutionRevealed={solutionRevealed}
          />
        )}

        {/* Surrender button */}
        {allTestCasesRevealed &&
          !isPuzzleSolved &&
          !isDailyCompleted &&
          !showSolution && (
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={handleGiveUp}
                className="text-muted-foreground hover:text-red-500 border-border hover:border-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300 hover:shadow-md group"
              >
                <span className="group-hover:animate-pulse">🏳️</span>
                <span className="ml-2 font-medium">Surrender</span>
              </Button>
            </div>
          )}

        {showSolution && puzzle.solution && (
          <PuzzleCardSolutionReveal puzzle={puzzle} />
        )}
      </CardContent>
    </Card>
  );
}
