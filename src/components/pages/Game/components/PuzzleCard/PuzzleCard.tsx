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
import { useState } from "react";
import { PuzzleCardSolutionReveal } from "./components";
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
    updatePattern,
    testPatternWithEffects,
    setSolutionRevealed,
  } = useGameStore();

  const { partialDescription, getAvailableSpins, openSpinWheel } =
    useSpinWheelStore();

  const { isPuzzleSolved: isPreviouslySolved } = useStatisticsStore();

  const [showSolution, setShowSolution] = useState(false);
  const availableSpins = getAvailableSpins();

  const puzzle = propPuzzle || currentPuzzle;

  if (!puzzle) return null;

  const shouldMatchCases = puzzle.testCases.filter((tc) => tc.shouldMatch);
  const shouldNotMatchCases = puzzle.testCases.filter((tc) => !tc.shouldMatch);
  const allTestCasesRevealed =
    revealedTestCases >=
    Math.max(shouldMatchCases.length, shouldNotMatchCases.length);
  const isPuzzleSolved = gameResult?.isCorrect;
  const wasPreviouslySolved = isPreviouslySolved(puzzle.id);

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

  const handleInstantSolve = () => {
    // Set the correct pattern and test it
    if (puzzle.solution) {
      updatePattern(puzzle.solution);
      // Use setTimeout to ensure the pattern is updated before testing
      setTimeout(() => {
        testPatternWithEffects();
      }, 0);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
          <CardTitle className="text-xl sm:text-2xl">{puzzle.title}</CardTitle>
          <div className="flex items-center gap-2 sm:gap-4 self-start sm:self-auto">
            <Badge variant={puzzle.difficulty}>
              {toTitleCase(puzzle.difficulty)}
            </Badge>
            {wasPreviouslySolved && (
              <Badge
                variant="secondary"
                className="text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border border-green-300 dark:border-green-600"
              >
                Completed
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
        <RegexInput
          userPattern={userPattern}
          onPatternChange={handlePatternChange}
          onTestPattern={handleTestPattern}
          disabled={isPuzzleSolved || wasPreviouslySolved}
        />
        <TestCases
          testCases={puzzle.testCases}
          gameResult={gameResult}
          revealedCount={revealedTestCases}
        />
        {gameResult && (
          <GameResults
            gameResult={gameResult}
            attempts={attempts}
            solutionRevealed={solutionRevealed}
          />
        )}

        {/* Temporary test button - always visible when puzzle not solved */}
        {!isPuzzleSolved && (
          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={handleInstantSolve}
              className="text-muted-foreground hover:text-green-500 border-border hover:border-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-300 hover:shadow-md group"
            >
              <span className="group-hover:animate-pulse">⚡</span>
              <span className="ml-2 font-medium">Instant Solve (Test)</span>
            </Button>
          </div>
        )}

        {allTestCasesRevealed && !isPuzzleSolved && !showSolution && (
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

        {/* Solution Display */}
        {showSolution && puzzle.solution && (
          <PuzzleCardSolutionReveal puzzle={puzzle} />
        )}
      </CardContent>
    </Card>
  );
}
