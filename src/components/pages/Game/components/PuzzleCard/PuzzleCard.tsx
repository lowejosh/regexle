import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { Badge } from "@/components/ui/Badge";
import { toTitleCase } from "@/lib/utils";
import { RegexInput } from "../RegexInput";
import { TestCases } from "../TestCases/TestCases";
import { GameResults } from "../GameResults";
import { SpinWheelButton } from "../SpinWheelButton";
import { useSpinWheelStore } from "../../../../../store/spinWheelStore";
import { useGameStore } from "../../../../../store/gameStore";
import type { Puzzle } from "../../../../../types/game";

interface PuzzleCardProps {
  puzzle?: Puzzle;
}

export function PuzzleCard({ puzzle: propPuzzle }: PuzzleCardProps) {
  // Consume game state directly
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

  // Consume spin state directly
  const { partialDescription, availableSpins, openSpinWheel } =
    useSpinWheelStore();

  // Use prop puzzle or current puzzle from store
  const puzzle = propPuzzle || currentPuzzle;

  // Don't render if no puzzle
  if (!puzzle) return null;

  const handlePatternChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updatePattern(e.target.value);
  };

  const handleTestPattern = () => {
    testPatternWithEffects();
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
        {/* Dev Solution (for testing) */}
        {process.env.NODE_ENV === "development" && puzzle.solution && (
          <div className="p-2 bg-gray-100 rounded text-xs text-gray-600">
            🔧 Dev Solution: <code>{puzzle.solution}</code>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
