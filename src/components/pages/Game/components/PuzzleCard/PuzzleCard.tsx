import { useSpinWheelStore } from "../../../../../store/spinWheelStore";
import { useGameStore } from "../../../../../store/gameStore";
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
    updatePattern,
    testPatternWithEffects,
  } = useGameStore();

  const { partialDescription, getAvailableSpins, openSpinWheel } =
    useSpinWheelStore();

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

  const handlePatternChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updatePattern(e.target.value);
  };

  const handleTestPattern = () => {
    testPatternWithEffects();
  };

  const handleGiveUp = () => {
    setShowSolution(true);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{puzzle.title}</CardTitle>
          <div className="flex items-center gap-4">
            <Badge variant={puzzle.difficulty}>
              {toTitleCase(puzzle.difficulty)}
            </Badge>
            <SpinWheelButton
              availableSpins={availableSpins}
              gameResult={gameResult}
              onOpenSpinWheel={openSpinWheel}
            />
          </div>
        </div>
        {puzzle.description && (
          <CardDescription>
            {showDescription && puzzle.description}
            {!showDescription && partialDescription}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        <RegexInput
          userPattern={userPattern}
          onPatternChange={handlePatternChange}
          onTestPattern={handleTestPattern}
        />
        <TestCases
          testCases={puzzle.testCases}
          gameResult={gameResult}
          revealedCount={revealedTestCases}
        />
        {gameResult && (
          <GameResults gameResult={gameResult} attempts={attempts} />
        )}

        {allTestCasesRevealed && !isPuzzleSolved && !showSolution && (
          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={handleGiveUp}
              className="text-gray-500 hover:text-red-500 border-gray-200 hover:border-red-400 hover:bg-red-50 transition-all duration-300 hover:shadow-md group"
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
